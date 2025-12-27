'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { Organization, CreateOrganizationForm, CreateAdminForm } from '@/types/partners';

function AdminContent() {
  const { user, loading, isSuperAdmin, signOut } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/partners/login');
    } else if (!loading && !isSuperAdmin) {
      router.push('/partners/login');
    }
  }, [user, loading, isSuperAdmin, router]);

  const fetchOrganizations = async () => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/organizations?listAll=true', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchOrganizations();
    }
  }, [user, isSuperAdmin]);

  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setCreating(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    
    const orgData: CreateOrganizationForm = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      primaryColor: formData.get('primaryColor') as string || '#FF6B00',
      tier: formData.get('tier') as 'starter' | 'growth' | 'enterprise',
      maxActiveUsers: parseInt(formData.get('maxActiveUsers') as string),
      defaultCodeDurationDays: parseInt(formData.get('defaultCodeDurationDays') as string),
      contactEmail: formData.get('contactEmail') as string,
      contactName: formData.get('contactName') as string,
      description: formData.get('description') as string || undefined,
      website: formData.get('website') as string || undefined,
    };
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/organizations', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orgData)
      });
      
      if (res.ok) {
        setShowCreateModal(false);
        fetchOrganizations();
        setMessage({ type: 'success', text: 'Organization created successfully' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to create organization' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create organization' });
    } finally {
      setCreating(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !showAddAdminModal) return;
    
    setCreating(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    
    const adminData: CreateAdminForm & { organizationId: string; action: string } = {
      organizationId: showAddAdminModal,
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
        setShowAddAdminModal(null);
        setMessage({ type: 'success', text: 'Admin added successfully' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to add admin' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add admin' });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (org: Organization) => {
    if (!user) return;
    
    const newStatus = org.status === 'active' ? 'suspended' : 'active';
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/organizations', {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId: org.id,
          status: newStatus
        })
      });
      
      if (res.ok) {
        fetchOrganizations();
        setMessage({ type: 'success', text: `Organization ${newStatus}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/partners/login');
  };

  if (loading || !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF6]">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/elevatia-logo.png" 
                  alt="Elevatia Logo" 
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="text-xl font-semibold gradient-text">Elevatia</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Super Admin
                </span>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Organizations</h1>
            <p className="text-gray-600">Manage all partner organizations and their access</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Organization
          </button>
        </div>

        {/* Organizations Grid */}
        {loadingOrgs ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
          </div>
        ) : organizations.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations yet</h3>
            <p className="text-gray-500 mb-4">Create your first partner organization to get started.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-purple-600 font-medium hover:text-purple-700"
            >
              Create organization →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div 
                key={org.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: org.primaryColor || '#FF6B00' }}
                  >
                    {org.name.charAt(0)}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    org.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : org.status === 'suspended'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {org.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{org.name}</h3>
                <p className="text-sm text-gray-500 mb-3">/{org.slug}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 capitalize">
                    {org.tier}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                    {org.maxActiveUsers} users max
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  <p>{org.contactName}</p>
                  <p>{org.contactEmail}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <Link
                    href={`/partners/dashboard/${org.slug}`}
                    className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-center"
                  >
                    View Dashboard
                  </Link>
                  <button
                    onClick={() => setShowAddAdminModal(org.id)}
                    className="py-2 px-3 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    Add Admin
                  </button>
                  <button
                    onClick={() => handleToggleStatus(org)}
                    className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      org.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {org.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create Organization</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="SurfSynergy"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    placeholder="surfsynergy"
                    pattern="[a-z0-9-]+"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    placeholder="John Smith"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    required
                    placeholder="john@company.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                  <select 
                    name="tier" 
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    defaultValue="starter"
                  >
                    <option value="starter">Starter (50 users)</option>
                    <option value="growth">Growth (500 users)</option>
                    <option value="enterprise">Enterprise (Unlimited)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Active Users</label>
                  <input
                    type="number"
                    name="maxActiveUsers"
                    required
                    min="1"
                    defaultValue="50"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Code Duration (days)</label>
                  <input
                    type="number"
                    name="defaultCodeDurationDays"
                    required
                    min="1"
                    defaultValue="30"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Color</label>
                  <input
                    type="color"
                    name="primaryColor"
                    defaultValue="#FF6B00"
                    className="w-full h-10 px-1 py-1 border border-gray-200 rounded-xl cursor-pointer"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
                <input
                  type="url"
                  name="website"
                  placeholder="https://surfsynergy.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="About this organization..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Partner Admin</h3>
              <button
                onClick={() => setShowAddAdminModal(null)}
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
                  placeholder="admin@company.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Must have an existing Elevatia account</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name (optional)</label>
                <input
                  type="text"
                  name="displayName"
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  name="role" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  defaultValue="owner"
                >
                  <option value="owner">Owner (full access)</option>
                  <option value="admin">Admin (manage codes & paths)</option>
                  <option value="viewer">Viewer (read-only)</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(null)}
                  className="flex-1 py-2 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {creating ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPartnersPage() {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
}

