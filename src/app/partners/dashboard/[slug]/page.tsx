'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useViewedOrg } from './layout';
import DashboardTabs from '@/components/partners/DashboardTabs';

export default function PartnerDashboardPage() {
  const { isSuperAdmin } = useAuth();
  const viewedOrg = useViewedOrg();
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome{viewedOrg?.contactName ? `, ${viewedOrg.contactName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-600">
          Manage your Elevatia partnership and track engagement
        </p>
      </div>

      {/* Dashboard Tabs - pass the org ID from URL slug */}
      <DashboardTabs organizationId={slug} />
    </div>
  );
}
