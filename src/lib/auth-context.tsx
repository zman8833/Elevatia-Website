'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  AuthCredential,
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  linkWithCredential,
  OAuthProvider,
  RecaptchaVerifier,
  ConfirmationResult,
  PhoneAuthProvider,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from './firebase';
import { PartnerAdmin, Organization } from '@/types/partners';

interface AuthResult {
  success: boolean;
  slug?: string;
  error?: string;
  needsLinking?: boolean;
  pendingCredential?: AuthCredential;
  pendingUser?: User;
}

interface AuthContextType {
  user: User | null;
  partnerAdmin: PartnerAdmin | null;
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithApple: () => Promise<AuthResult>;
  sendPhoneCode: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<{ success: boolean; confirmationResult?: ConfirmationResult; error?: string }>;
  verifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<AuthResult>;
  linkAccountWithEmail: (email: string, password: string, pendingCredential: AuthCredential) => Promise<AuthResult>;
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

  // Verify partner admin status after any auth
  const verifyPartnerAdmin = async (firebaseUser: User): Promise<AuthResult> => {
    const token = await firebaseUser.getIdToken();
    const res = await fetch('/api/partners/auth', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      // Don't sign out - we need the user for linking
      return { 
        success: false, 
        error: errorData.error || 'No partner account found for this login',
        needsLinking: true,
        pendingUser: firebaseUser
      };
    }
    
    const data = await res.json();
    setPartnerAdmin(data.partnerAdmin);
    setOrganization(data.organization);
    setIsSuperAdmin(data.isSuperAdmin || false);
    
    return { success: true, slug: data.organization?.slug };
  };

  // Fetch partner admin data when user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
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

  // Email/Password sign in
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return await verifyPartnerAdmin(result.user);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Apple Sign In
  const signInWithApple = async (): Promise<AuthResult> => {
    try {
      setError(null);
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await signInWithPopup(auth, provider);
      const credential = OAuthProvider.credentialFromResult(result);
      
      const verifyResult = await verifyPartnerAdmin(result.user);
      
      if (verifyResult.needsLinking && credential) {
        // Sign out the Apple user so we can sign in with email
        await firebaseSignOut(auth);
        return {
          ...verifyResult,
          pendingCredential: credential
        };
      }
      
      return verifyResult;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Apple';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Send phone verification code
  const sendPhoneCode = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    try {
      setError(null);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return { success: true, confirmationResult };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Verify phone code
  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string): Promise<AuthResult> => {
    try {
      setError(null);
      const result = await confirmationResult.confirm(code);
      
      // Create credential for potential linking
      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, code);
      
      const verifyResult = await verifyPartnerAdmin(result.user);
      
      if (verifyResult.needsLinking) {
        // Sign out the phone user so we can sign in with email
        await firebaseSignOut(auth);
        return {
          ...verifyResult,
          pendingCredential: credential
        };
      }
      
      return verifyResult;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid verification code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Link a pending credential to an existing email account
  const linkAccountWithEmail = async (
    email: string, 
    password: string, 
    pendingCredential: AuthCredential
  ): Promise<AuthResult> => {
    try {
      setError(null);
      
      // Sign in with email/password
      const emailResult = await signInWithEmailAndPassword(auth, email, password);
      
      // Link the pending credential (Apple/Phone) to this account
      await linkWithCredential(emailResult.user, pendingCredential);
      
      // Now verify partner admin (should succeed since email account exists)
      return await verifyPartnerAdmin(emailResult.user);
    } catch (err: unknown) {
      let errorMessage = err instanceof Error ? err.message : 'Failed to link accounts';
      
      // Handle specific Firebase errors
      if (errorMessage.includes('auth/provider-already-linked')) {
        errorMessage = 'This sign-in method is already linked to another account';
      } else if (errorMessage.includes('auth/credential-already-in-use')) {
        errorMessage = 'This Apple/Phone account is already linked to a different user';
      } else if (errorMessage.includes('auth/wrong-password')) {
        errorMessage = 'Incorrect password';
      } else if (errorMessage.includes('auth/user-not-found')) {
        errorMessage = 'No account found with this email';
      }
      
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
      signInWithApple,
      sendPhoneCode,
      verifyPhoneCode,
      linkAccountWithEmail,
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
