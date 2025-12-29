'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import StatsCard from './StatsCard';
import { PartnerStats } from '@/types/partners';

interface OverviewTabProps {
  organizationId: string;
}

export default function OverviewTab({ organizationId }: OverviewTabProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<PartnerStats & { chartData?: { date: string; redemptions: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user || !organizationId) return;
      
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/partners/stats?organizationId=${organizationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [user, organizationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        Unable to load statistics
      </div>
    );
  }

  // Simple bar chart
  const maxRedemptions = Math.max(...(stats.chartData?.map(d => d.redemptions) || [1]), 1);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          subtitle="Currently using access"
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Redemptions"
          value={stats.totalRedemptions}
          subtitle="All time"
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Active Codes"
          value={stats.activeCodesCount}
          subtitle="Ready to use"
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <StatsCard
          title="Expired Users"
          value={stats.expiredUsers}
          subtitle="Access ended"
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Redemptions Chart */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Redemptions (Last 30 Days)</h3>
        <div className="h-48 flex items-end gap-1">
          {stats.chartData?.map((day, index) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-gradient-to-t from-orange-500 to-yellow-400 rounded-t transition-all hover:from-orange-600 hover:to-yellow-500"
                style={{ 
                  height: `${Math.max((day.redemptions / maxRedemptions) * 100, 4)}%`,
                  minHeight: day.redemptions > 0 ? '8px' : '2px',
                  opacity: day.redemptions > 0 ? 1 : 0.3
                }}
                title={`${day.date}: ${day.redemptions} redemptions`}
              />
              {index % 5 === 0 && (
                <span className="text-xs text-gray-400 -rotate-45 origin-left whitespace-nowrap">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => document.querySelector('[data-tab="codes"]')?.dispatchEvent(new Event('click'))}
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
          >
            Generate New Code
          </button>
          <button 
            onClick={() => document.querySelector('[data-tab="paths"]')?.dispatchEvent(new Event('click'))}
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
          >
            Request Path
          </button>
          <button 
            onClick={() => document.querySelector('[data-tab="settings"]')?.dispatchEvent(new Event('click'))}
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
