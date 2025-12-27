import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, SUPER_ADMIN_UID } from '@/lib/firebase-admin';
import { CreatePathForm } from '@/types/partners';

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

// GET - List paths for organization
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
    
    const pathsSnapshot = await adminDb
      .collection('partnerPaths')
      .where('organizationId', '==', organizationId)
      .orderBy('sortOrder')
      .get();
    
    const paths = pathsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ paths });
  } catch (error) {
    console.error('Error fetching paths:', error);
    return NextResponse.json({ error: 'Failed to fetch paths' }, { status: 500 });
  }
}

// POST - Create new path
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const body: CreatePathForm & { organizationId: string } = await request.json();
    
    const access = await verifyOrgAccess(token, body.organizationId);
    
    if (access.role === 'viewer') {
      return NextResponse.json({ error: 'Viewers cannot create paths' }, { status: 403 });
    }
    
    // Get current max sortOrder
    const existingPaths = await adminDb
      .collection('partnerPaths')
      .where('organizationId', '==', body.organizationId)
      .orderBy('sortOrder', 'desc')
      .limit(1)
      .get();
    
    const maxSortOrder = existingPaths.empty ? 0 : (existingPaths.docs[0].data().sortOrder || 0);
    
    // Generate unique path ID
    const org = await adminDb.collection('organizations').doc(body.organizationId).get();
    const orgData = org.data();
    const pathId = `${orgData?.slug || 'partner'}_${body.pathId}`;
    
    const newPath = {
      organizationId: body.organizationId,
      pathId,
      title: body.title,
      description: body.description,
      icon: body.icon,
      color: body.color,
      category: body.category,
      isActive: true,
      sortOrder: maxSortOrder + 1,
      createdAt: new Date(),
    };
    
    const docRef = await adminDb.collection('partnerPaths').add(newPath);
    
    // Update with id field
    await docRef.update({ id: docRef.id });
    
    return NextResponse.json({ 
      success: true, 
      path: { id: docRef.id, ...newPath } 
    });
  } catch (error) {
    console.error('Error creating path:', error);
    return NextResponse.json({ error: 'Failed to create path' }, { status: 500 });
  }
}

// PATCH - Update path
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const body = await request.json();
    const { pathId, organizationId, ...updates } = body;
    
    const access = await verifyOrgAccess(token, organizationId);
    
    if (access.role === 'viewer') {
      return NextResponse.json({ error: 'Viewers cannot update paths' }, { status: 403 });
    }
    
    // Only allow certain fields to be updated
    const allowedUpdates: Record<string, unknown> = {};
    const editableFields = ['title', 'description', 'icon', 'color', 'category', 'isActive', 'sortOrder'];
    
    for (const field of editableFields) {
      if (field in updates) allowedUpdates[field] = updates[field];
    }
    
    await adminDb.collection('partnerPaths').doc(pathId).update(allowedUpdates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating path:', error);
    return NextResponse.json({ error: 'Failed to update path' }, { status: 500 });
  }
}

// DELETE - Delete path
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const pathId = request.nextUrl.searchParams.get('pathId');
    const organizationId = request.nextUrl.searchParams.get('organizationId');
    
    if (!pathId || !organizationId) {
      return NextResponse.json({ error: 'Path ID and Organization ID required' }, { status: 400 });
    }
    
    const access = await verifyOrgAccess(token, organizationId);
    
    if (access.role === 'viewer') {
      return NextResponse.json({ error: 'Viewers cannot delete paths' }, { status: 403 });
    }
    
    await adminDb.collection('partnerPaths').doc(pathId).delete();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting path:', error);
    return NextResponse.json({ error: 'Failed to delete path' }, { status: 500 });
  }
}

