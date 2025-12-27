import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, SUPER_ADMIN_UID } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Check if super admin
    const isSuperAdmin = uid === SUPER_ADMIN_UID;

    // Look up partner admin record
    const adminSnapshot = await adminDb
      .collection('partnerAdmins')
      .where('id', '==', uid)
      .limit(1)
      .get();

    if (adminSnapshot.empty && !isSuperAdmin) {
      return NextResponse.json({ error: 'Not authorized as partner admin' }, { status: 403 });
    }

    let partnerAdmin: { id: string; organizationId?: string; [key: string]: unknown } | null = null;
    let organization = null;

    if (!adminSnapshot.empty) {
      const adminData = adminSnapshot.docs[0].data();
      partnerAdmin = { id: adminSnapshot.docs[0].id, ...adminData };
      
      // Fetch organization
      if (partnerAdmin.organizationId) {
        const orgSnapshot = await adminDb
          .collection('organizations')
          .doc(partnerAdmin.organizationId)
          .get();
      
        if (orgSnapshot.exists) {
          organization = { id: orgSnapshot.id, ...orgSnapshot.data() };
        }
      }
    }

    // Update last login
    if (partnerAdmin) {
      await adminDb.collection('partnerAdmins').doc(partnerAdmin.id).update({
        lastLoginAt: new Date()
      });
    }

    return NextResponse.json({ 
      partnerAdmin, 
      organization, 
      isSuperAdmin,
      uid 
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

