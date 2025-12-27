'use client';

import { useAuth } from '@/lib/auth-context';
import DashboardTabs from '@/components/partners/DashboardTabs';

export default function PartnerDashboardPage() {
  const { organization } = useAuth();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{organization?.contactName ? `, ${organization.contactName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-600">
          Manage your Elevatia partnership and track engagement
        </p>
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs />
    </div>
  );
}

