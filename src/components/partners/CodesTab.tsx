'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PartnerCode, CreateCodeForm } from '@/types/partners';

interface CodesTabProps {
  organizationId: string;
}

export default function CodesTab({ organizationId }: CodesTabProps) {
  const { user } = useAuth();
  const [codes, setCodes] = useState<PartnerCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchCodes = async () => {
    if (!user || !organizationId) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/partners/codes?organizationId=${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes);
      }
    } catch (error) {
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, [user, organizationId]);

  const handleCreateCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !organizationId) return;
    
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    
    const codeData: CreateCodeForm & { organizationId: string } = {
      organizationId: organizationId,
      type: formData.get('type') as 'single' | 'multi',
      maxRedemptions: formData.get('type') === 'multi' ? parseInt(formData.get('maxRedemptions') as string) : undefined,
      expiresAt: formData.get('expiresAt') as string,
      durationDays: parseInt(formData.get('durationDays') as string) || 30,
      label: formData.get('label') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      prefix: formData.get('prefix') as string || undefined,
    };
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/codes', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(codeData)
      });
      
      if (res.ok) {
        setShowCreateModal(false);
        fetchCodes();
      }
    } catch (error) {
      console.error('Error creating code:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (code: PartnerCode) => {
    if (!user || !organizationId) return;
    
    try {
      const token = await user.getIdToken();
      await fetch('/api/partners/codes', {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codeId: code.id,
          organizationId: organizationId,
          isActive: !code.isActive
        })
      });
      
      fetchCodes();
    } catch (error) {
      console.error('Error toggling code:', error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (timestamp: { seconds?: number } | string) => {
    const date = typeof timestamp === 'object' && timestamp.seconds 
      ? new Date(timestamp.seconds * 1000) 
      : new Date(timestamp as string);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isExpired = (timestamp: { seconds?: number } | string) => {
    const date = typeof timestamp === 'object' && timestamp.seconds 
      ? new Date(timestamp.seconds * 1000) 
      : new Date(timestamp as string);
    return date < new Date();
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Partner Codes</h2>
          <p className="text-sm text-gray-500">Generate and manage access codes for your users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Code
        </button>
      </div>

      {/* Codes Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Label</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Redemptions</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {codes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No codes yet. Generate your first code to get started.
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {code.code}
                        </code>
                        <button
                          onClick={() => copyToClipboard(code.code)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === code.code ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {code.label || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        code.type === 'multi' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {code.type === 'multi' ? 'Multi-use' : 'Single-use'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {code.currentRedemptions}
                      {code.type === 'multi' && code.maxRedemptions && (
                        <span className="text-gray-400"> / {code.maxRedemptions}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(code.expiresAt)}
                    </td>
                    <td className="px-6 py-4">
                      {!code.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Disabled
                        </span>
                      ) : isExpired(code.expiresAt) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Expired
                        </span>
                      ) : code.type === 'single' && code.currentRedemptions >= 1 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Used
                        </span>
                      ) : code.type === 'multi' && code.maxRedemptions && code.currentRedemptions >= code.maxRedemptions ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Maxed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleActive(code)}
                        className={`text-sm font-medium transition-colors ${
                          code.isActive 
                            ? 'text-red-600 hover:text-red-700' 
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {code.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Generate New Code</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code Type</label>
                <select 
                  name="type" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  defaultValue="multi"
                >
                  <option value="single">Single-use (1 redemption)</option>
                  <option value="multi">Multi-use (multiple redemptions)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Redemptions (for multi-use)</label>
                <input
                  type="number"
                  name="maxRedemptions"
                  min="1"
                  defaultValue="100"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code Expiration</label>
                <input
                  type="date"
                  name="expiresAt"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  defaultValue={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Duration (days after redemption)</label>
                <input
                  type="number"
                  name="durationDays"
                  min="1"
                  defaultValue={30}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label (optional)</label>
                <input
                  type="text"
                  name="label"
                  placeholder="e.g., Summer 2025 Promo"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code Prefix (optional)</label>
                <input
                  type="text"
                  name="prefix"
                  placeholder={organizationId.toUpperCase().slice(0, 4)}
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Internal notes about this code..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Generate Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
