import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, SUPER_ADMIN_UID } from '@/lib/firebase-admin';
import { CreateOrganizationForm, CreateAdminForm } from '@/types/partners';

// Verify super admin access
async function verifySuperAdmin(token: string) {
  const decodedToken = await adminAuth.verifyIdToken(token);
  if (decodedToken.uid !== SUPER_ADMIN_UID) {
    throw new Error('Super admin access required');
  }
  return decodedToken.uid;
}

// Verify org admin access
async function verifyOrgAccess(token: string, organizationId: string) {
  const decodedToken = await adminAuth.verifyIdToken(token);
  const uid = decodedToken.uid;
  
  if (uid === SUPER_ADMIN_UID) {
    return { uid, role: 'owner' as const, isSuperAdmin: true };
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
  
  return { uid, role: admin.role, isSuperAdmin: false };
}

// GET - List all organizations (super admin) or single org
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const organizationId = request.nextUrl.searchParams.get('organizationId');
    const listAll = request.nextUrl.searchParams.get('listAll') === 'true';
    
    if (listAll) {
      // Super admin only
      await verifySuperAdmin(token);
      
      const orgsSnapshot = await adminDb
        .collection('organizations')
        .orderBy('name')
        .get();
      
      const organizations = orgsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return NextResponse.json({ organizations });
    }
    
    if (organizationId) {
      await verifyOrgAccess(token, organizationId);
      
      const orgSnapshot = await adminDb
        .collection('organizations')
        .doc(organizationId)
        .get();
      
      if (!orgSnapshot.exists) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }
      
      // Get team members
      const adminsSnapshot = await adminDb
        .collection('partnerAdmins')
        .where('organizationId', '==', organizationId)
        .get();
      
      const admins = adminsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return NextResponse.json({ 
        organization: { id: orgSnapshot.id, ...orgSnapshot.data() },
        admins 
      });
    }
    
    return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 });
  }
}

// POST - Create new organization (super admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    await verifySuperAdmin(token);
    
    const body: CreateOrganizationForm = await request.json();
    
    // Check slug uniqueness
    const existingSlug = await adminDb
      .collection('organizations')
      .where('slug', '==', body.slug)
      .limit(1)
      .get();
    
    if (!existingSlug.empty) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    
    const newOrg = {
      ...body,
      logo: '',
      status: 'active' as const,
      createdAt: new Date(),
      partnerSince: new Date(),
    };
    
    const docRef = await adminDb.collection('organizations').add(newOrg);
    
    // Update with id field
    await docRef.update({ id: docRef.id });
    
    return NextResponse.json({ 
      success: true, 
      organization: { id: docRef.id, ...newOrg } 
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}

// PATCH - Update organization
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const body = await request.json();
    const { organizationId, ...updates } = body;
    
    const access = await verifyOrgAccess(token, organizationId);
    
    // Only owner or super admin can update org settings
    if (access.role !== 'owner' && !access.isSuperAdmin) {
      return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
    }
    
    // Filter allowed fields for non-super admins
    const allowedUpdates: Record<string, unknown> = {};
    const orgEditableFields = ['description', 'website', 'primaryColor', 'logo'];
    const superAdminFields = ['status', 'tier', 'maxActiveUsers', 'name', 'contactName', 'contactEmail', 'defaultCodeDurationDays'];
    
    for (const field of orgEditableFields) {
      if (field in updates) allowedUpdates[field] = updates[field];
    }
    
    if (access.isSuperAdmin) {
      for (const field of superAdminFields) {
        if (field in updates) allowedUpdates[field] = updates[field];
      }
    }
    
    await adminDb.collection('organizations').doc(organizationId).update(allowedUpdates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}

// POST to /organizations/admins - Add team member
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const body: CreateAdminForm & { organizationId: string; action: string } = await request.json();
    
    if (body.action === 'addAdmin') {
      const access = await verifyOrgAccess(token, body.organizationId);
      
      if (access.role !== 'owner' && !access.isSuperAdmin) {
        return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
      }
      
      // Look up user by email in Firebase Auth
      let userRecord;
      try {
        userRecord = await adminAuth.getUserByEmail(body.email);
      } catch {
        return NextResponse.json({ 
          error: 'User not found. They must create an Elevatia account first.' 
        }, { status: 404 });
      }
      
      // Check if already an admin
      const existingAdmin = await adminDb
        .collection('partnerAdmins')
        .where('id', '==', userRecord.uid)
        .limit(1)
        .get();
      
      if (!existingAdmin.empty) {
        return NextResponse.json({ error: 'User is already a partner admin' }, { status: 400 });
      }
      
      const newAdmin = {
        id: userRecord.uid,
        email: body.email,
        organizationId: body.organizationId,
        role: body.role,
        displayName: body.displayName || userRecord.displayName || null,
        createdAt: new Date(),
      };
      
      await adminDb.collection('partnerAdmins').doc(userRecord.uid).set(newAdmin);
      
      return NextResponse.json({ success: true, admin: newAdmin });
    }
    
    if (body.action === 'removeAdmin') {
      const access = await verifyOrgAccess(token, body.organizationId);
      
      if (access.role !== 'owner' && !access.isSuperAdmin) {
        return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
      }
      
      const adminId = (body as unknown as { adminId: string }).adminId;
      
      // Don't allow removing yourself if you're the only owner
      const ownersSnapshot = await adminDb
        .collection('partnerAdmins')
        .where('organizationId', '==', body.organizationId)
        .where('role', '==', 'owner')
        .get();
      
      if (ownersSnapshot.size === 1 && ownersSnapshot.docs[0].id === adminId) {
        return NextResponse.json({ 
          error: 'Cannot remove the only owner' 
        }, { status: 400 });
      }
      
      await adminDb.collection('partnerAdmins').doc(adminId).delete();
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error managing admin:', error);
    return NextResponse.json({ error: 'Failed to manage admin' }, { status: 500 });
  }
}

