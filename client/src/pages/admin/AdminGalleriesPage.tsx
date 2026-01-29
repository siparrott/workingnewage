import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Search, Filter, Eye, Edit, Trash2, Clock, MoreVertical, Mail, Flag, Image, ChevronLeft, ChevronRight, HelpCircle, BookOpen, X } from 'lucide-react';
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
  status: 'active' | 'draft' | 'archived' | 'expired';
  createdAt: string;
  expiresAt?: string;
  attachedShoot?: string;
  brand?: string;
  type?: string;
}

const AdminGalleriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showExpired, setShowExpired] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGalleries, setSelectedGalleries] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    filterGalleries();
  }, [galleries, searchTerm, statusFilter, showExpired, showTrash]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const data = await getGalleries();
      
      const transformedGalleries: Gallery[] = data.map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description || '',
        clientName: g.client_name || 'No client assigned',
        clientId: g.client_id || '',
        photoCount: g.photo_count || 0,
        coverImage: g.cover_image || g.coverImage || '',
        status: g.is_public ? 'active' : (g.status || 'draft'),
        createdAt: g.created_at || g.createdAt,
        expiresAt: g.expires_at || g.expiresAt,
        attachedShoot: g.attached_shoot || g.attachedShoot || '',
        brand: 'New Age Fotografie',
        type: 'Gallery'
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
      setOpenMenuId(null);
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
    setCurrentPage(1);
  };

  const calculateAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days old`;
  };

  const formatExpiry = (expiresAt?: string) => {
    if (!expiresAt) return '--';
    return new Date(expiresAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const toggleSelectAll = () => {
    if (selectedGalleries.length === paginatedGalleries.length) {
      setSelectedGalleries([]);
    } else {
      setSelectedGalleries(paginatedGalleries.map(g => g.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedGalleries(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage);
  const paginatedGalleries = filteredGalleries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-500"></div>
            <p className="text-gray-600 text-sm">Loading galleries...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Galleries</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded text-sm font-medium"
            >
              ADD NEW
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm font-medium border border-gray-300">
              VIEW CATALOG
            </button>
          </div>
          <button className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium">
            <HelpCircle size={16} className="mr-1" />
            Get Help
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-3">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
              <Filter size={16} className="mr-1" />
              Filter
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Galleries</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showExpired}
                onChange={(e) => setShowExpired(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
              />
              Expired
            </label>
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showTrash}
                onChange={(e) => setShowTrash(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
              />
              Trash
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedGalleries.length === paginatedGalleries.length && paginatedGalleries.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attached
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedGalleries.map((gallery) => (
                <tr key={gallery.id} className="hover:bg-gray-50">
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedGalleries.includes(gallery.id)}
                      onChange={() => toggleSelect(gallery.id)}
                      className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                  </td>
                  
                  {/* Name with thumbnail */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100">
                        {gallery.coverImage ? (
                          <img 
                            src={gallery.coverImage} 
                            alt={gallery.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span 
                            className="text-teal-600 hover:text-teal-800 font-medium cursor-pointer"
                            onClick={() => navigate(`/admin/galleries/${gallery.id}/edit`)}
                          >
                            {gallery.title}
                          </span>
                          <Mail size={14} className="text-gray-400" />
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Flag size={12} />
                          <Image size={12} />
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Attached Shoot */}
                  <td className="px-4 py-3">
                    {gallery.attachedShoot ? (
                      <span className="text-teal-600 text-sm hover:underline cursor-pointer">
                        ⚙ {gallery.attachedShoot}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">--</span>
                    )}
                  </td>
                  
                  {/* User Avatar */}
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-medium">
                      {gallery.clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                  </td>
                  
                  {/* Age */}
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      {calculateAge(gallery.createdAt)}
                    </div>
                  </td>
                  
                  {/* Expires */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatExpiry(gallery.expiresAt)}
                  </td>
                  
                  {/* Brand */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      {gallery.brand}
                    </span>
                  </td>
                  
                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      <Image size={12} className="mr-1" />
                      {gallery.type}
                    </span>
                  </td>
                  
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                      gallery.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : gallery.status === 'draft'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {gallery.status.charAt(0).toUpperCase() + gallery.status.slice(1)}
                    </span>
                  </td>
                  
                  {/* Actions Menu */}
                  <td className="px-4 py-3 relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === gallery.id ? null : gallery.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {openMenuId === gallery.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => {
                            navigate(`/admin/galleries/${gallery.id}/edit`);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/gallery/${gallery.id}`);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye size={16} className="mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => setOpenMenuId(null)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Clock size={16} className="mr-2" />
                          Set Expiration
                        </button>
                        <button
                          onClick={() => setOpenMenuId(null)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <BookOpen size={16} className="mr-2" />
                          Add to Catalog
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleDeleteGallery(gallery.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Trash
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredGalleries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No galleries found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 text-sm text-gray-600">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
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