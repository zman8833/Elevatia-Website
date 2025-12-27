import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, SUPER_ADMIN_UID } from '@/lib/firebase-admin';

// Verify org admin access
async function verifyOrgAccess(token: string, organizationId: string) {
  const decodedToken = await adminAuth.verifyIdToken(token);
  const uid = decodedToken.uid;
  
  if (uid === SUPER_ADMIN_UID) {
    return { uid, isSuperAdmin: true };
  }
  
  const adminSnapshot = await adminDb
    .collection('partnerAdmins')
    .where('id', '==', uid)
    .limit(1)
    .get();
  
  if (adminSnapshot.empty) {
    throw new Error('Not authorized');
  }
  
  const admin = adminSnapshot.docs[0].data();
  if (admin.organizationId !== organizationId) {
    throw new Error('Not authorized for this organization');
  }
  
  return { uid, isSuperAdmin: false };
}

// GET - List anonymized users for organization
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const organizationId = request.nextUrl.searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }
    
    await verifyOrgAccess(token, organizationId);
    
    const now = new Date();
    
    // Get all redemptions for this org
    const redemptionsSnapshot = await adminDb
      .collection('partnerRedemptions')
      .where('organizationId', '==', organizationId)
      .orderBy('redeemedAt', 'desc')
      .get();
    
    // Anonymize and aggregate user data
    const usersMap = new Map<string, {
      id: string;
      redeemedAt: Date;
      accessExpiresAt: Date;
      codeUsed: string;
      isActive: boolean;
    }>();
    
    redemptionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const redeemedAt = data.redeemedAt?.toDate?.() || new Date(data.redeemedAt);
      const accessExpiresAt = data.accessExpiresAt?.toDate?.() || new Date(data.accessExpiresAt);
      
      // Use hashed user ID for anonymization
      const anonymizedId = `user_${data.userId.slice(-6)}`;
      
      // Only keep the most recent redemption per user
      if (!usersMap.has(data.userId) || redeemedAt > usersMap.get(data.userId)!.redeemedAt) {
        usersMap.set(data.userId, {
          id: anonymizedId,
          redeemedAt,
          accessExpiresAt,
          codeUsed: data.codeUsed,
          isActive: accessExpiresAt > now,
        });
      }
    });
    
    const users = Array.from(usersMap.values())
      .sort((a, b) => b.redeemedAt.getTime() - a.redeemedAt.getTime())
      .map(user => ({
        ...user,
        redeemedAt: user.redeemedAt.toISOString(),
        accessExpiresAt: user.accessExpiresAt.toISOString(),
      }));
    
    return NextResponse.json({ 
      users,
      total: users.length,
      activeCount: users.filter(u => u.isActive).length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

