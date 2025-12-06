import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit2, Trash2, Save, X, GripVertical } from 'lucide-react';

interface LeadSource {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

const LeadSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/crm/lead-sources');
      if (!response.ok) throw new Error('Failed to fetch lead sources');
      const data = await response.json();
      setSources(data);
    } catch (err) {
      setError('Failed to load lead sources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newSourceName.trim()) return;
    
    try {
      const response = await fetch('/api/crm/lead-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSourceName.trim(),
          isActive: true,
          sortOrder: sources.length
        })
      });

      if (!response.ok) throw new Error('Failed to create lead source');
      
      setNewSourceName('');
      fetchSources();
    } catch (err) {
      setError('Failed to create lead source');
      console.error(err);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      const response = await fetch(`/api/crm/lead-sources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() })
      });

      if (!response.ok) throw new Error('Failed to update lead source');
      
      setEditingId(null);
      setEditName('');
      fetchSources();
    } catch (err) {
      setError('Failed to update lead source');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead source?')) return;

    try {
      const response = await fetch(`/api/crm/lead-sources/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete lead source');
      
      fetchSources();
    } catch (err) {
      setError('Failed to delete lead source');
      console.error(err);
    }
  };

  const toggleActive = async (source: LeadSource) => {
    try {
      const response = await fetch(`/api/crm/lead-sources/${source.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !source.isActive })
      });

      if (!response.ok) throw new Error('Failed to update lead source');
      
      fetchSources();
    } catch (err) {
      setError('Failed to update lead source');
      console.error(err);
    }
  };

  const startEdit = (source: LeadSource) => {
    setEditingId(source.id);
    setEditName(source.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Lead Sources</h1>
          <p className="text-gray-600">Manage where your leads come from</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add New Source */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Lead Source</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Enter lead source name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleCreate}
              disabled={!newSourceName.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Source
            </button>
          </div>
        </div>

        {/* Sources List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Existing Lead Sources</h2>
            
            {sources.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No lead sources yet. Add your first one above!</p>
            ) : (
              <div className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    
                    {editingId === source.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdate(source.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdate(source.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Save"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Cancel"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-gray-900">{source.name}</span>
                        
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={source.isActive}
                            onChange={() => toggleActive(source)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">Active</span>
                        </label>

                        <button
                          onClick={() => startEdit(source)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(source.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LeadSourcesPage;

