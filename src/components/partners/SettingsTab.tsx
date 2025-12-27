'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PartnerAdmin, CreateAdminForm } from '@/types/partners';

export default function SettingsTab() {
  const { user, organization, partnerAdmin } = useAuth();
  const [admins, setAdmins] = useState<PartnerAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#FF6B00');

  useEffect(() => {
    if (organization) {
      setDescription(organization.description || '');
      setWebsite(organization.website || '');
      setPrimaryColor(organization.primaryColor || '#FF6B00');
    }
  }, [organization]);

  const fetchAdmins = async () => {
    if (!user || !organization) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/partners/organizations?organizationId=${organization.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [user, organization]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !organization) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/organizations', {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId: organization.id,
          description,
          website,
          primaryColor,
        })
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !organization) return;
    
    setAdding(true);
    const formData = new FormData(e.currentTarget);
    
    const adminData: CreateAdminForm & { organizationId: string; action: string } = {
      organizationId: organization.id,
      action: 'addAdmin',
      email: formData.get('email') as string,
      role: formData.get('role') as 'owner' | 'admin' | 'viewer',
      displayName: formData.get('displayName') as string || undefined,
    };
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/organizations', {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });
      
      if (res.ok) {
        setShowAddModal(false);
        fetchAdmins();
        setMessage({ type: 'success', text: 'Team member added successfully' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to add team member' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add team member' });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!user || !organization) return;
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/organizations', {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId: organization.id,
          action: 'removeAdmin',
          adminId,
        })
      });
      
      if (res.ok) {
        fetchAdmins();
        setMessage({ type: 'success', text: 'Team member removed' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to remove team member' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove team member' });
    }
  };

  const canManageTeam = partnerAdmin?.role === 'owner';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Message */}
      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Organization Profile */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Organization Profile</h2>
        
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={organization?.name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Contact support to change</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={organization?.slug || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell users about your organization..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                pattern="^#[0-9A-Fa-f]{6}$"
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent w-32 font-mono"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Partnership Info */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Partnership Details</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Tier</p>
            <p className="font-semibold text-gray-900 capitalize">{organization?.tier}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Status</p>
            <p className={`font-semibold capitalize ${
              organization?.status === 'active' ? 'text-green-600' : 'text-gray-600'
            }`}>{organization?.status}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Max Active Users</p>
            <p className="font-semibold text-gray-900">{organization?.maxActiveUsers}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Default Code Duration</p>
            <p className="font-semibold text-gray-900">{organization?.defaultCodeDurationDays} days</p>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            <p className="text-sm text-gray-500">Manage who has access to this dashboard</p>
          </div>
          {canManageTeam && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center text-orange-700 font-semibold">
                  {(admin.displayName || admin.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{admin.displayName || admin.email}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  admin.role === 'owner' 
                    ? 'bg-purple-100 text-purple-700' 
                    : admin.role === 'admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {admin.role}
                </span>
                {canManageTeam && admin.id !== partnerAdmin?.id && (
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Team Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="team@company.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Must have an existing Elevatia account</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name (optional)</label>
                <input
                  type="text"
                  name="displayName"
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  name="role" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  defaultValue="admin"
                >
                  <option value="owner">Owner (full access + team management)</option>
                  <option value="admin">Admin (can manage codes & paths)</option>
                  <option value="viewer">Viewer (read-only access)</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50"
                >
                  {adding ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

