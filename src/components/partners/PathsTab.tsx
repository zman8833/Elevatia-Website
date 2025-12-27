'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PartnerPath, CreatePathForm } from '@/types/partners';

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

export default function PathsTab() {
  const { user, organization } = useAuth();
  const [paths, setPaths] = useState<PartnerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingPath, setEditingPath] = useState<PartnerPath | null>(null);

  const fetchPaths = async () => {
    if (!user || !organization) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/partners/paths?organizationId=${organization.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setPaths(data.paths);
      }
    } catch (error) {
      console.error('Error fetching paths:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, [user, organization]);

  const handleCreatePath = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !organization) return;
    
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    
    const pathData: CreatePathForm & { organizationId: string } = {
      organizationId: organization.id,
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

  const handleToggleActive = async (path: PartnerPath) => {
    if (!user || !organization) return;
    
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
          organizationId: organization.id,
          isActive: !path.isActive
        })
      });
      
      fetchPaths();
    } catch (error) {
      console.error('Error toggling path:', error);
    }
  };

  const handleDeletePath = async (path: PartnerPath) => {
    if (!user || !organization) return;
    if (!confirm('Are you sure you want to delete this path?')) return;
    
    try {
      const token = await user.getIdToken();
      await fetch(`/api/partners/paths?pathId=${path.id}&organizationId=${organization.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchPaths();
    } catch (error) {
      console.error('Error deleting path:', error);
    }
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
          <h2 className="text-xl font-semibold text-gray-900">Partner Paths</h2>
          <p className="text-sm text-gray-500">Create exclusive wellness paths for your users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Path
        </button>
      </div>

      {/* Paths Grid */}
      {paths.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No paths yet</h3>
          <p className="text-gray-500 mb-4">Create your first exclusive wellness path for your users.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-orange-600 font-medium hover:text-orange-700"
          >
            Create your first path →
          </button>
        </div>
      ) : (
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
      )}

      {/* Create Modal */}
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
    </div>
  );
}

