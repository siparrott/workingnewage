import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, Download, Share2, Calendar, X } from 'lucide-react';
import { getGalleries, deleteGallery } from '../../lib/gallery-api';
import AdvancedGalleryForm from '../../components/admin/AdvancedGalleryForm';

interface Gallery {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientId: string;
  photoCount: number;
  coverImage: string;
  status: 'active' | 'archived' | 'shared';
  createdAt: string;
  expiresAt?: string;
}

const AdminGalleriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    filterGalleries();
  }, [galleries, searchTerm, statusFilter]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const data = await getGalleries();
      
      // Transform API data to match Gallery interface
      const transformedGalleries: Gallery[] = data.map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description || '',
        clientName: g.client_name || 'No client assigned',
        clientId: g.client_id || '',
        photoCount: 0, // Will be updated when we fetch images
        coverImage: g.cover_image || g.coverImage || '',
        status: g.is_public ? 'active' : 'archived',
        createdAt: g.created_at || g.createdAt,
        expiresAt: g.expires_at || g.expiresAt
      }));
      
      setGalleries(transformedGalleries);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;
    
    try {
      await deleteGallery(id);
      setGalleries(galleries.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('Failed to delete gallery');
    }
  };

  const filterGalleries = () => {
    let filtered = galleries;

    if (searchTerm) {
      filtered = filtered.filter(gallery =>
        gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(gallery => gallery.status === statusFilter);
    }

    setFilteredGalleries(filtered);
  };

  const getStatusBadge = (status: Gallery['status']) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      shared: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Shared' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const isExpiringSoon = (expiresAt?: string) => {
    if (!expiresAt) return false;
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Galleries Management</h1>
            <p className="text-gray-600">Manage client photo galleries and sharing</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Create Gallery
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search galleries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="shared">Shared</option>
              <option value="archived">Archived</option>
            </select>

            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} className="mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Galleries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={gallery.coverImage}
                  alt={gallery.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{gallery.title}</h3>
                    <p className="text-sm text-gray-600">{gallery.clientName}</p>
                  </div>
                  {getStatusBadge(gallery.status)}
                </div>

                <p className="text-sm text-gray-600 mb-3">{gallery.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{gallery.photoCount} photos</span>
                  <span>Created {new Date(gallery.createdAt).toLocaleDateString()}</span>
                </div>

                {gallery.expiresAt && (
                  <div className={`text-xs mb-4 flex items-center ${
                    isExpiringSoon(gallery.expiresAt) ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    <Calendar size={12} className="mr-1" />
                    Expires {new Date(gallery.expiresAt).toLocaleDateString()}
                    {isExpiringSoon(gallery.expiresAt) && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        Expiring Soon
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/gallery/${gallery.id}`)}
                      className="text-blue-600 hover:text-blue-900" 
                      title="View Gallery"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/galleries/${gallery.id}/edit`)}
                      className="text-green-600 hover:text-green-900" 
                      title="Edit Gallery"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/galleries/${gallery.id}/upload`)}
                      className="text-purple-600 hover:text-purple-900" 
                      title="Upload Photos"
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => window.open(`/api/galleries/${gallery.id}/download`, '_blank')}
                      className="text-gray-600 hover:text-gray-900" 
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/gallery/${gallery.id}`;
                        navigator.clipboard.writeText(shareUrl);
                        alert('Gallery link copied to clipboard!');
                      }}
                      className="text-indigo-600 hover:text-indigo-900" 
                      title="Share"
                    >
                      <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteGallery(gallery.id)}
                      className="text-red-600 hover:text-red-900" 
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGalleries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No galleries found matching your criteria.</p>
          </div>
        )}

        {/* Create Gallery Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Gallery</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <AdvancedGalleryForm 
                  isEditing={false}
                  onSuccess={() => {
                    setShowCreateModal(false);
                    fetchGalleries();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGalleriesPage;