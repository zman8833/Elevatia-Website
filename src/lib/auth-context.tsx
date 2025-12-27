'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from './firebase';
import { PartnerAdmin, Organization } from '@/types/partners';

interface AuthContextType {
  user: User | null;
  partnerAdmin: PartnerAdmin | null;
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; slug?: string; error?: string }>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partnerAdmin, setPartnerAdmin] = useState<PartnerAdmin | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Fetch partner admin data when user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Verify partner admin status via API
          const token = await firebaseUser.getIdToken();
          const res = await fetch('/api/partners/auth', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.ok) {
            const data = await res.json();
            setPartnerAdmin(data.partnerAdmin);
            setOrganization(data.organization);
            setIsSuperAdmin(data.isSuperAdmin || false);
            setError(null);
          } else {
            setPartnerAdmin(null);
            setOrganization(null);
            setIsSuperAdmin(false);
          }
        } catch (err) {
          console.error('Error fetching partner admin:', err);
          setPartnerAdmin(null);
          setOrganization(null);
        }
      } else {
        setPartnerAdmin(null);
        setOrganization(null);
        setIsSuperAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Verify partner admin status
      const token = await result.user.getIdToken();
      const res = await fetch('/api/partners/auth', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        await firebaseSignOut(auth);
        return { success: false, error: errorData.error || 'Not authorized as partner admin' };
      }
      
      const data = await res.json();
      setPartnerAdmin(data.partnerAdmin);
      setOrganization(data.organization);
      setIsSuperAdmin(data.isSuperAdmin || false);
      
      return { success: true, slug: data.organization?.slug };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setPartnerAdmin(null);
    setOrganization(null);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      partnerAdmin, 
      organization, 
      loading, 
      error, 
      signIn, 
      signOut,
      isSuperAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

