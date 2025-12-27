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

// GET - Get stats for organization
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
    
    // Get redemptions for this org
    const redemptionsSnapshot = await adminDb
      .collection('partnerRedemptions')
      .where('organizationId', '==', organizationId)
      .get();
    
    const totalRedemptions = redemptionsSnapshot.size;
    
    // Count active vs expired users
    let activeUsers = 0;
    let expiredUsers = 0;
    
    redemptionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const expiresAt = data.accessExpiresAt?.toDate?.() || new Date(data.accessExpiresAt);
      if (expiresAt > now) {
        activeUsers++;
      } else {
        expiredUsers++;
      }
    });
    
    // Get active codes count
    const activeCodesSnapshot = await adminDb
      .collection('partnerCodes')
      .where('organizationId', '==', organizationId)
      .where('isActive', '==', true)
      .get();
    
    // Filter by expiration
    const activeCodesCount = activeCodesSnapshot.docs.filter(doc => {
      const data = doc.data();
      const expiresAt = data.expiresAt?.toDate?.() || new Date(data.expiresAt);
      return expiresAt > now;
    }).length;
    
    // Get recent redemptions for chart data (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentRedemptions = redemptionsSnapshot.docs
      .filter(doc => {
        const data = doc.data();
        const redeemedAt = data.redeemedAt?.toDate?.() || new Date(data.redeemedAt);
        return redeemedAt >= thirtyDaysAgo;
      })
      .map(doc => {
        const data = doc.data();
        return {
          date: (data.redeemedAt?.toDate?.() || new Date(data.redeemedAt)).toISOString().split('T')[0],
        };
      });
    
    // Aggregate by date
    const redemptionsByDate: Record<string, number> = {};
    recentRedemptions.forEach(r => {
      redemptionsByDate[r.date] = (redemptionsByDate[r.date] || 0) + 1;
    });
    
    // Fill in missing dates
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      chartData.push({
        date: dateStr,
        redemptions: redemptionsByDate[dateStr] || 0,
      });
    }
    
    return NextResponse.json({
      activeUsers,
      expiredUsers,
      totalRedemptions,
      activeCodesCount,
      chartData,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

