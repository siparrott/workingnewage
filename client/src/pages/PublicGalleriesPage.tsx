import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getPublicGalleries } from '../lib/gallery-api';
import { Gallery } from '../types/gallery';
import { 
  Search, 
  Calendar, 
  Eye, 
  Loader2, 
  AlertCircle, 
  Camera, 
  Image as ImageIcon, 
  FolderOpen,
  Lock,
  Unlock,
  Grid,
  List
} from 'lucide-react';
import { useManualPageContent } from '../hooks/useManualPageContent';
import { SEOHead } from '../components/SEO/SEOHead';

const PublicGalleriesPage: React.FC = () => {
  const t = useManualPageContent('galleries');
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    filterGalleries();
  }, [galleries, searchTerm]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const data = await getPublicGalleries();
      setGalleries(data);
    } catch (err) {
      setError('Failed to load galleries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterGalleries = () => {
    if (!searchTerm.trim()) {
      setFilteredGalleries(galleries);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = galleries.filter(gallery => 
      gallery.title.toLowerCase().includes(lowerSearchTerm) ||
      (gallery.description && gallery.description.toLowerCase().includes(lowerSearchTerm)) ||
      (gallery.clientEmail && gallery.clientEmail.toLowerCase().includes(lowerSearchTerm))
    );
    
    setFilteredGalleries(filtered);
  };

  const getWatermarkedCoverImage = (gallery: Gallery) => {
    return gallery.coverImage || '/placeholder-gallery.jpg';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate stats
  const stats = {
    totalGalleries: galleries.length,
    totalImages: galleries.reduce((sum, g) => sum + (parseInt(String(g.imageCount)) || 0), 0),
    passwordProtected: galleries.filter(g => g.isPasswordProtected).length,
    publicGalleries: galleries.filter(g => !g.isPasswordProtected).length,
  };

  return (
    <Layout>
      <SEOHead
        title="Foto-Galerien – New Age Fotografie Wien"
        description="Öffentliche Foto-Galerien von New Age Fotografie: Familien-, Baby- und Business-Aufnahmen aus unserem Fotostudio in Wien."
        canonical="/galleries/"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center py-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('gallery.publicTitle')}</h1>
                <p className="mt-2 text-sm text-gray-600">
                  {t('gallery.publicDescription')}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-100">{t('gallery.totalGalleries')}</span>
                <FolderOpen className="h-5 w-5 text-purple-200" />
              </div>
              <div className="text-3xl font-bold">{stats.totalGalleries}</div>
              <p className="text-xs text-purple-100 mt-1">{t('gallery.availableToView')}</p>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-pink-100">{t('gallery.totalPhotos')}</span>
                <ImageIcon className="h-5 w-5 text-pink-200" />
              </div>
              <div className="text-3xl font-bold">{stats.totalImages}</div>
              <p className="text-xs text-pink-100 mt-1">{t('gallery.acrossAllGalleries')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{t('gallery.publicAccess')}</span>
                <Unlock className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.publicGalleries}</div>
              <p className="text-xs text-gray-500 mt-1">{t('gallery.openGalleries')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{t('gallery.passwordProtected')}</span>
                <Lock className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.passwordProtected}</div>
              <p className="text-xs text-gray-500 mt-1">{t('gallery.requiresAccess')}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('gallery.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start mb-8">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              <span className="ml-3 text-gray-600">{t('gallery.loading')}</span>
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  {filteredGalleries.length} {filteredGalleries.length === 1 ? t('gallery.galleryFound') : t('gallery.galleriesFound')} {t('gallery.found')}
                  {searchTerm && ` für "${searchTerm}"`}
                </p>
              </div>

              {/* Galleries Grid */}
              {filteredGalleries.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
                }>
                  {filteredGalleries.map(gallery => (
                    viewMode === 'grid' ? (
                      <div 
                        key={gallery.id}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-300 overflow-hidden"
                      >
                        {/* Gallery Cover */}
                        <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                          {gallery.coverImage ? (
                            <img
                              src={getWatermarkedCoverImage(gallery)}
                              alt={gallery.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Camera className="w-8 h-8 text-purple-600" />
                                </div>
                                <p className="text-sm text-gray-500">{t('gallery.noPreview')}</p>
                              </div>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {gallery.isPasswordProtected && (
                              <span className="bg-amber-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                <Lock className="h-3 w-3 mr-1" />
                                {t('gallery.protected')}
                              </span>
                            )}
                          </div>

                          {/* Image count badge */}
                          <div className="absolute top-3 right-3">
                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center backdrop-blur-sm">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              {gallery.imageCount || 0}
                            </span>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                            <Link
                              to={`/gallery/${gallery.slug}`}
                              className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-2.5 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 flex items-center shadow-lg"
                            >
                              <Eye size={16} className="mr-2" />
                              {t('gallery.viewGallery')}
                            </Link>
                          </div>
                        </div>

                        {/* Gallery Info */}
                        <div className="p-5">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                            {gallery.title}
                          </h3>

                          {gallery.description && (
                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                              {gallery.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(gallery.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* List View */
                      <Link
                        key={gallery.id}
                        to={`/gallery/${gallery.slug}`}
                        className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-300 overflow-hidden"
                      >
                        <div className="flex items-center p-4">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-50 to-pink-50">
                            {gallery.coverImage ? (
                              <img
                                src={getWatermarkedCoverImage(gallery)}
                                alt={gallery.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Camera className="w-8 h-8 text-purple-400" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 truncate">{gallery.title}</h3>
                              {gallery.isPasswordProtected && (
                                <Lock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                              )}
                            </div>
                            {gallery.description && (
                              <p className="text-sm text-gray-500 truncate">{gallery.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                              <span className="flex items-center">
                                <ImageIcon className="h-3 w-3 mr-1" />
                                {gallery.imageCount || 0} {t('gallery.photos')}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(gallery.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <Eye className="h-5 w-5 text-gray-300 group-hover:text-purple-500 transition-colors flex-shrink-0" />
                        </div>
                      </Link>
                    )
                  ))}
                </div>
              ) : (
                /* No Results */
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="mx-auto h-20 w-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                    <Camera className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm ? t('gallery.noGalleriesFound') : t('gallery.noGalleriesAvailable')}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm 
                      ? `${t('gallery.noGalleriesDescription')} "${searchTerm}".`
                      : t('gallery.noGalleriesAvailableDescription')
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="inline-flex items-center px-5 py-2.5 rounded-full font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                    >
                      {t('gallery.showAllGalleries')}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Help Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-center text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">{t('gallery.notFoundTitle')}</h2>
            <p className="mb-6 max-w-2xl mx-auto text-purple-100">
              {t('gallery.notFoundDescription')}
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-purple-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
            >
              {t('gallery.contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PublicGalleriesPage;
