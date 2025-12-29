'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PartnerPath, CreatePathForm, PartnerPathRequest } from '@/types/partners';

// Common SF Symbol alternatives for web
const iconOptions = [
  { value: 'figure.walk', label: 'Walking' },
  { value: 'heart.fill', label: 'Heart' },
  { value: 'brain.head.profile', label: 'Brain' },
  { value: 'leaf.fill', label: 'Leaf' },
  { value: 'drop.fill', label: 'Water' },
  { value: 'moon.fill', label: 'Moon' },
  { value: 'sun.max.fill', label: 'Sun' },
  { value: 'bolt.fill', label: 'Energy' },
  { value: 'flame.fill', label: 'Flame' },
  { value: 'star.fill', label: 'Star' },
];

const colorOptions = [
  { value: '#FF6B6B', label: 'Red' },
  { value: '#4ECDC4', label: 'Teal' },
  { value: '#45B7D1', label: 'Blue' },
  { value: '#96CEB4', label: 'Green' },
  { value: '#FFEAA7', label: 'Yellow' },
  { value: '#DDA0DD', label: 'Purple' },
  { value: '#FF8C42', label: 'Orange' },
  { value: '#A8E6CF', label: 'Mint' },
];

const categoryOptions = [
  'Fitness',
  'Nutrition',
  'Mindfulness',
  'Sleep',
  'Recovery',
  'Performance',
  'Wellness',
  'Custom',
];

const requestCategoryOptions = [
  { value: 'fitness', label: 'Fitness' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'mental', label: 'Mental Wellness' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'recovery', label: 'Recovery' },
  { value: 'other', label: 'Other' },
];

const statusConfig: Record<string, { bg: string; text: string; label: string; icon?: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  in_review: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Review' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  live: { bg: 'bg-green-100', text: 'text-green-700', label: 'Live', icon: '✓' },
};

interface PathsTabProps {
  organizationId: string;
}

export default function PathsTab({ organizationId }: PathsTabProps) {
  const { user } = useAuth();
  const [paths, setPaths] = useState<PartnerPath[]>([]);
  const [pathRequests, setPathRequests] = useState<PartnerPathRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Request form state
  const [requestForm, setRequestForm] = useState({
    pathName: '',
    description: '',
    targetAudience: '',
    goals: [''],
    preferredCategory: 'fitness' as const,
    additionalNotes: ''
  });

  const fetchPaths = async () => {
    if (!user || !organizationId) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/partners/paths?organizationId=${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setPaths(data.paths);
      }
    } catch (error) {
      console.error('Error fetching paths:', error);
    }
  };

  const fetchPathRequests = async () => {
    if (!user || !organizationId) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/path-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setPathRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching path requests:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPaths(), fetchPathRequests()]);
      setLoading(false);
    };
    loadData();
  }, [user, organization]);

  const handleCreatePath = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !organizationId) return;
    
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    
    const pathData: CreatePathForm & { organizationId: string } = {
      organizationId: organizationId,
      pathId: formData.get('pathId') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
      category: formData.get('category') as string,
    };
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/paths', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pathData)
      });
      
      if (res.ok) {
        setShowCreateModal(false);
        fetchPaths();
      }
    } catch (error) {
      console.error('Error creating path:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !organizationId) return;
    
    // Filter out empty goals
    const filteredGoals = requestForm.goals.filter(g => g.trim() !== '');
    if (filteredGoals.length === 0) {
      alert('Please add at least one goal');
      return;
    }

    setSubmittingRequest(true);
    
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/partners/path-requests', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...requestForm,
          goals: filteredGoals
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setShowRequestModal(false);
        setSuccessMessage(data.message);
        setRequestForm({
          pathName: '',
          description: '',
          targetAudience: '',
          goals: [''],
          preferredCategory: 'fitness',
          additionalNotes: ''
        });
        fetchPathRequests();
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleToggleActive = async (path: PartnerPath) => {
    if (!user || !organizationId) return;
    
    try {
      const token = await user.getIdToken();
      await fetch('/api/partners/paths', {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pathId: path.id,
          organizationId: organizationId,
          isActive: !path.isActive
        })
      });
      
      fetchPaths();
    } catch (error) {
      console.error('Error toggling path:', error);
    }
  };

  const handleDeletePath = async (path: PartnerPath) => {
    if (!user || !organizationId) return;
    if (!confirm('Are you sure you want to delete this path?')) return;
    
    try {
      const token = await user.getIdToken();
      await fetch(`/api/partners/paths?pathId=${path.id}&organizationId=${organizationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchPaths();
    } catch (error) {
      console.error('Error deleting path:', error);
    }
  };

  const addGoal = () => {
    setRequestForm(prev => ({ ...prev, goals: [...prev.goals, ''] }));
  };

  const removeGoal = (index: number) => {
    setRequestForm(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setRequestForm(prev => ({
      ...prev,
      goals: prev.goals.map((g, i) => i === index ? value : g)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Partner Paths</h2>
          <p className="text-sm text-gray-500">Create exclusive wellness paths for your users</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request Custom Path
        </button>
      </div>

      {/* Path Requests Section */}
      {pathRequests.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Path Requests</h3>
          <div className="space-y-3">
            {pathRequests.map((req) => {
              const status = statusConfig[req.status] || statusConfig.pending;
              return (
                <div 
                  key={req.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-gray-900">{req.pathName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.icon && <span className="mr-1">{status.icon}</span>}
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{req.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Category: {requestCategoryOptions.find(c => c.value === req.preferredCategory)?.label}</span>
                      <span>Goals: {req.goals.length}</span>
                      {req.submittedAt && (
                        <span>
                          Submitted: {new Date(req.submittedAt.seconds * 1000).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {req.status === 'rejected' && req.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2">
                        Reason: {req.rejectionReason}
                      </p>
                    )}
                    {req.reviewNotes && (
                      <p className="text-sm text-blue-600 mt-2">
                        Note: {req.reviewNotes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Paths Grid */}
      {paths.length === 0 && pathRequests.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No paths yet</h3>
          <p className="text-gray-500 mb-4">Create your first exclusive wellness path or request a custom one.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowRequestModal(true)}
              className="text-orange-600 font-medium hover:text-orange-700"
            >
              Request a custom path →
            </button>
          </div>
        </div>
      ) : paths.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-900">Active Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => (
              <div 
                key={path.id} 
                className={`bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 transition-all hover:shadow-md ${
                  !path.isActive && 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: path.color }}
                  >
                    {iconOptions.find(i => i.value === path.icon)?.label?.charAt(0) || '★'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      path.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {path.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{path.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{path.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                    {path.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {path.pathId}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleActive(path)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      path.isActive 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {path.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeletePath(path)}
                    className="py-2 px-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Path Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New Path</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreatePath} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Path ID</label>
                <input
                  type="text"
                  name="pathId"
                  required
                  placeholder="e.g., recovery, wellness101"
                  pattern="[a-z0-9_]+"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and underscores only</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Post-Workout Recovery"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Describe what this path helps users achieve..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  name="category" 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select 
                  name="icon" 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map(color => (
                    <label key={color.value} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="color" 
                        value={color.value} 
                        defaultChecked={color.value === colorOptions[0].value}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-full h-10 rounded-lg border-2 border-transparent peer-checked:border-gray-900 transition-all"
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    </label>
                  ))}
                </div>
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
                  {creating ? 'Creating...' : 'Create Path'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Custom Path Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Request Custom Path</h3>
                <p className="text-sm text-gray-500">We'll build a custom wellness path tailored to your needs</p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Path Name</label>
                <input
                  type="text"
                  required
                  value={requestForm.pathName}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, pathName: e.target.value }))}
                  placeholder="e.g., Corporate Stress Relief Program"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description - What should this path help users achieve?
                </label>
                <textarea
                  required
                  rows={3}
                  value={requestForm.description}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and outcomes you'd like this path to provide..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience - Who is this path for?
                </label>
                <input
                  type="text"
                  required
                  value={requestForm.targetAudience}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., Remote employees dealing with work-from-home burnout"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goals - What outcomes should users expect?
                </label>
                <div className="space-y-2">
                  {requestForm.goals.map((goal, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                        placeholder={`Goal ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {requestForm.goals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGoal(index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGoal}
                    className="text-sm text-orange-600 font-medium hover:text-orange-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add another goal
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  required
                  value={requestForm.preferredCategory}
                  onChange={(e) => setRequestForm(prev => ({ 
                    ...prev, 
                    preferredCategory: e.target.value as typeof requestForm.preferredCategory 
                  }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {requestCategoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={requestForm.additionalNotes}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="Any other details that would help us build the perfect path..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50"
                >
                  {submittingRequest ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
