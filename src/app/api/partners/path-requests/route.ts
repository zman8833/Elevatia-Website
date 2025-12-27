import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// GET - Fetch path requests for an organization
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get organization ID from partner admin
    const partnerAdminDoc = await adminDb.collection('partnerAdmins').doc(uid).get();
    if (!partnerAdminDoc.exists) {
      return NextResponse.json({ error: 'Not a partner admin' }, { status: 403 });
    }

    const partnerAdmin = partnerAdminDoc.data() as { organizationId: string };
    const organizationId = partnerAdmin.organizationId;

    // Fetch path requests for this organization
    const requestsSnapshot = await adminDb
      .collection('partnerPathRequests')
      .where('organizationId', '==', organizationId)
      .orderBy('submittedAt', 'desc')
      .get();

    const requests = requestsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching path requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new path request
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get organization ID from partner admin
    const partnerAdminDoc = await adminDb.collection('partnerAdmins').doc(uid).get();
    if (!partnerAdminDoc.exists) {
      return NextResponse.json({ error: 'Not a partner admin' }, { status: 403 });
    }

    const partnerAdmin = partnerAdminDoc.data() as { organizationId: string; role: string };
    
    // Only owners and admins can create requests
    if (partnerAdmin.role === 'viewer') {
      return NextResponse.json({ error: 'Viewers cannot create path requests' }, { status: 403 });
    }

    const body = await request.json();
    const { pathName, description, targetAudience, goals, preferredCategory, additionalNotes } = body;

    // Validate required fields
    if (!pathName || !description || !targetAudience || !goals || !preferredCategory) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Array.isArray(goals) || goals.length === 0) {
      return NextResponse.json({ error: 'At least one goal is required' }, { status: 400 });
    }

    // Create the path request
    const requestData = {
      organizationId: partnerAdmin.organizationId,
      requestedBy: uid,
      pathName,
      description,
      targetAudience,
      goals,
      preferredCategory,
      additionalNotes: additionalNotes || null,
      status: 'pending',
      submittedAt: Timestamp.now()
    };

    const docRef = await adminDb.collection('partnerPathRequests').add(requestData);

    return NextResponse.json({ 
      success: true, 
      requestId: docRef.id,
      message: "Request submitted! We'll review and get back to you within 5 business days."
    });
  } catch (error) {
    console.error('Error creating path request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update request status (for super admin use)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Check if super admin
    const SUPER_ADMIN_UID = process.env.SUPER_ADMIN_UID;
    if (uid !== SUPER_ADMIN_UID) {
      return NextResponse.json({ error: 'Only super admins can update request status' }, { status: 403 });
    }

    const body = await request.json();
    const { requestId, status, reviewNotes, rejectionReason, partnerPathId } = body;

    if (!requestId || !status) {
      return NextResponse.json({ error: 'Request ID and status are required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'in_review', 'approved', 'rejected', 'live'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      status,
      reviewedAt: Timestamp.now()
    };

    if (reviewNotes) updateData.reviewNotes = reviewNotes;
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    if (partnerPathId) updateData.partnerPathId = partnerPathId;
    if (status === 'live') updateData.completedAt = Timestamp.now();

    await adminDb.collection('partnerPathRequests').doc(requestId).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating path request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

