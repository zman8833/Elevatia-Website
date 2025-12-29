'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface AffiliatedUser {
  id: string;
  redeemedAt: string;
  accessExpiresAt: string;
  codeUsed: string;
  isActive: boolean;
}

interface UsersTabProps {
  organizationId: string;
}

export default function UsersTab({ organizationId }: UsersTabProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<AffiliatedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, activeCount: 0 });

  useEffect(() => {
    async function fetchUsers() {
      if (!user || !organizationId) return;
      
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/partners/users?organizationId=${organizationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
          setStats({ total: data.total, activeCount: data.activeCount });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, [user, organizationId]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Affiliated Users</h2>
        <p className="text-sm text-gray-500">Users who have redeemed your partner codes (anonymized)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-2xl font-bold text-green-600">{stats.activeCount}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code Used</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Redeemed</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Access Expires</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No users have redeemed codes yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {user.id}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <code className="font-mono text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {user.codeUsed}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.redeemedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.accessExpiresAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.isActive ? 'Active' : 'Expired'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <div className="flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Privacy Protection</p>
            <p className="mt-1 text-blue-600">User data is anonymized. You can see redemption patterns but not personal information like names or emails.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

