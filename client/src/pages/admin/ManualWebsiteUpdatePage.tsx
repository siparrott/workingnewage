   import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Eye, RotateCcw, FileText, Globe, Check, X } from 'lucide-react';
import { manualPageManifest, type ManualPageDefinition, type ManualPageSection, type ManualPageField } from '../../../../shared/manualPages';
import Cropper, { Area } from 'react-easy-crop';

interface PageContent {
  id?: string;
  pageId: string;
  language: string;
  draftContent: Record<string, string>;
  publishedContent: Record<string, string>;
  status: string;
  publishedAt?: string;
  updatedAt?: string;
}

const createImageElement = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
};

const getCroppedImageBlob = async (imageSrc: string, crop: Area, mimeType: string): Promise<Blob> => {
  const image = await createImageElement(imageSrc);
  const canvas = document.createElement('canvas');
  const targetWidth = Math.round(crop.width);
  const targetHeight = Math.round(crop.height);
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context unavailable');
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to crop image'));
        return;
      }
      resolve(blob);
    }, mimeType || 'image/jpeg', 0.92);
  });
};

const ManualWebsiteUpdatePage: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<ManualPageDefinition | null>(manualPageManifest[0] || null);
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string | null>>({});
  const [dragOverFields, setDragOverFields] = useState<Record<string, boolean>>({});
  const [cropModal, setCropModal] = useState<{
    field: ManualPageField;
    file: File;
    imageSrc: string;
    mimeType: string;
  } | null>(null);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOrientation, setCropOrientation] = useState<'landscape' | 'portrait' | 'wide'>('landscape');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);
  const queryClient = useQueryClient();

  // Load field-specific orientation preferences from localStorage
  const getFieldOrientation = (fieldId: string): 'landscape' | 'portrait' | 'wide' => {
    const saved = localStorage.getItem(`cropOrientation_${fieldId}`);
    return (saved === 'landscape' || saved === 'portrait' || saved === 'wide') ? saved : 'landscape';
  };

  // Save field-specific orientation preference
  const saveFieldOrientation = (fieldId: string, orientation: 'landscape' | 'portrait' | 'wide') => {
    localStorage.setItem(`cropOrientation_${fieldId}`, orientation);
  };

  // Fetch page content
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/manual-pages', selectedPage?.id, language],
    queryFn: async () => {
      if (!selectedPage) return null;
      const res = await fetch(`/api/manual-pages/${selectedPage.id}?language=${language}`);
      if (!res.ok) throw new Error('Failed to fetch page content');
      return res.json();
    },
    enabled: !!selectedPage
  });

  // Initialize edited content when page content loads
  useEffect(() => {
    if (pageContent) {
      // Merge published content with draft content (draft takes precedence)
      const mergedContent = {
        ...(pageContent.publishedContent || {}),
        ...(pageContent.draftContent || {})
      };
      setEditedContent(mergedContent);
      setHasUnsavedChanges(false);
    } else {
      setEditedContent({});
      setHasUnsavedChanges(false);
    }
  }, [pageContent, selectedPage?.id, language]);

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPage) return;
      const res = await fetch(`/api/manual-pages/${selectedPage.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          draftContent: editedContent,
          action: 'save_draft'
        })
      });
      if (!res.ok) throw new Error('Failed to save draft');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/manual-pages'] });
      setHasUnsavedChanges(false);
    }
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPage) return;
      const res = await fetch(`/api/manual-pages/${selectedPage.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          draftContent: editedContent,
          action: 'publish'
        })
      });
      if (!res.ok) throw new Error('Failed to publish');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/manual-pages'] });
      setHasUnsavedChanges(false);
    }
  });

  // Reset mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPage) return;
      const res = await fetch(`/api/manual-pages/${selectedPage.id}?language=${language}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to reset');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/manual-pages'] });
      setEditedContent({});
      setHasUnsavedChanges(false);
    }
  });

  const handleFieldChange = (fieldId: string, value: string) => {
    setEditedContent(prev => ({ ...prev, [fieldId]: value }));
    setHasUnsavedChanges(true);
  };

  // Handles image uploads and stores the returned serve URL in the draft content map.
  const handleImageUpload = async (field: ManualPageField, file: File) => {
    setUploadErrors(prev => ({ ...prev, [field.id]: null }));
    setUploadingFields(prev => ({ ...prev, [field.id]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderName', 'Manual Website Images');
      formData.append('context', field.translationKey);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'File upload failed');
      }

      // Use the B2 URL from the response
      const fileUrl = payload.url || payload.thumbnailUrl;

      if (!fileUrl) {
        throw new Error('No URL returned from upload');
      }

      handleFieldChange(field.translationKey, fileUrl);
      return fileUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'File upload failed';
      setUploadErrors(prev => ({ ...prev, [field.id]: message }));
      throw error;
    } finally {
      setUploadingFields(prev => ({ ...prev, [field.id]: false }));
    }
  };

  const handleImageClick = (field: ManualPageField, file: File) => {
    const imageSrc = URL.createObjectURL(file);
    setCropModal({ field, file, imageSrc, mimeType: file.type || 'image/jpeg' });
    setCropPosition({ x: 0, y: 0 });
    setCropZoom(1);
    setCroppedAreaPixels(null);
    // Load the saved orientation preference for this specific field
    setCropOrientation(getFieldOrientation(field.id));
  };

  const closeCropModal = () => {
    if (cropModal?.imageSrc?.startsWith('blob:')) {
      URL.revokeObjectURL(cropModal.imageSrc);
    }
    setCropModal(null);
    setCroppedAreaPixels(null);
    setCropPosition({ x: 0, y: 0 });
    setCropZoom(1);
    setIsProcessingCrop(false);
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = async (useOriginal = false) => {
    if (!cropModal) return;
    setIsProcessingCrop(true);

    try {
      let fileToUpload = cropModal.file;

      // For "Wide Hero" orientation, always use original (no crop)
      const shouldUseOriginal = useOriginal || cropOrientation === 'wide';

      if (!shouldUseOriginal && croppedAreaPixels) {
        const croppedBlob = await getCroppedImageBlob(cropModal.imageSrc, croppedAreaPixels, cropModal.mimeType);
        const extension = cropModal.file.name.includes('.') ? cropModal.file.name.split('.').pop() : 'jpg';
        const nextName = `cropped-${Date.now()}.${extension}`;
        fileToUpload = new File([croppedBlob], nextName, { type: cropModal.mimeType || 'image/jpeg' });
      }

      await handleImageUpload(cropModal.field, fileToUpload);
      closeCropModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process image';
      setUploadErrors(prev => ({ ...prev, [cropModal.field.id]: message }));
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const getFieldValue = (field: ManualPageField): string => {
    return editedContent[field.translationKey] || '';
  };

  const handleDragOver = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFields(prev => ({ ...prev, [fieldId]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFields(prev => ({ ...prev, [fieldId]: false }));
  };

  const handleDrop = (e: React.DragEvent, field: ManualPageField) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFields(prev => ({ ...prev, [field.id]: false }));

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageClick(field, file);
      } else {
        setUploadErrors(prev => ({ ...prev, [field.id]: 'Please drop an image file' }));
      }
    }
  };

  const renderField = (field: ManualPageField) => {
    const value = getFieldValue(field);
    const isModified = editedContent[field.translationKey] !== undefined;

    if (field.type === 'longForm') {
      return (
        <div key={field.id} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            {field.label}
            {isModified && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Modified</span>}
          </label>
          {field.helperText && (
            <p className="text-xs text-gray-500 mb-2">{field.helperText}</p>
          )}
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.translationKey, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
          <p className="text-xs text-gray-400 mt-1">Key: {field.translationKey}</p>
        </div>
      );
    }

    if (field.type === 'image') {
      const isUploading = uploadingFields[field.id];
      const errorMessage = uploadErrors[field.id];
      const isDragOver = dragOverFields[field.id];

      return (
        <div key={field.id} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            {field.label}
            {isModified && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Modified</span>}
          </label>
          {field.helperText && (
            <p className="text-xs text-gray-500 mb-2">{field.helperText}</p>
          )}

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => handleDragOver(e, field.id)}
            onDragLeave={(e) => handleDragLeave(e, field.id)}
            onDrop={(e) => handleDrop(e, field)}
            className={`relative border-2 border-dashed rounded-lg transition-all ${
              isDragOver
                ? 'border-purple-500 bg-purple-50'
                : value
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {value ? (
              <div className="relative group">
                <img
                  src={value}
                  alt={field.label}
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center px-4">
                    <p className="text-sm font-medium mb-2">Drop new image to replace</p>
                    <p className="text-xs">or click Upload Image below</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className={`mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
                  isDragOver ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <svg
                    className={`w-8 h-8 ${isDragOver ? 'text-purple-600' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className={`text-sm font-medium mb-1 ${isDragOver ? 'text-purple-600' : 'text-gray-700'}`}>
                  {isDragOver ? 'Drop image here' : 'Drag & drop image here'}
                </p>
                <p className="text-xs text-gray-500">or use the Upload Image button below</p>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.translationKey, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              placeholder={`Paste image URL or drag & drop...`}
            />
            <label className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${isUploading ? 'bg-gray-200 text-gray-500' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
              {isUploading ? 'Uploading…' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageClick(field, file);
                    e.target.value = '';
                  }
                }}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => handleFieldChange(field.translationKey, '')}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          {errorMessage && (
            <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">Key: {field.translationKey}</p>
        </div>
      );
    }

    return (
      <div key={field.id} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          {field.label}
          {isModified && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Modified</span>}
        </label>
        {field.helperText && (
          <p className="text-xs text-gray-500 mb-2">{field.helperText}</p>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(field.translationKey, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
        />
        <p className="text-xs text-gray-400 mt-1">Key: {field.translationKey}</p>
      </div>
    );
  };

  const renderSection = (section: ManualPageSection) => {
    return (
      <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{section.label}</h3>
          {section.description && (
            <p className="text-sm text-gray-600 mt-1">{section.description}</p>
          )}
        </div>
        {section.fields.map(renderField)}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Page List */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="mr-2" size={20} />
              Manual Website Update
            </h2>
            <p className="text-sm text-gray-600 mt-1">Edit any public page content</p>
          </div>

          {/* Language Selector */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('de')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  language === 'de'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🇩🇪 Deutsch
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Page List */}
          <div className="p-2">
            {manualPageManifest.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                  selectedPage?.id === page.id
                    ? 'bg-purple-100 border border-purple-300 text-purple-900'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="font-medium">{page.label}</div>
                <div className="text-xs text-gray-500 mt-1">{page.route}</div>
                {page.tags && page.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {page.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedPage ? (
            <div className="max-w-4xl mx-auto p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedPage.label}</h1>
                    <p className="text-sm text-gray-600 mt-1">{selectedPage.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Globe size={16} className="text-gray-400" />
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedPage.route}</code>
                      {selectedPage.previewUrl && (
                        <a
                          href={selectedPage.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                        >
                          <Eye size={14} className="mr-1" />
                          Preview
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveDraftMutation.mutate()}
                      disabled={!hasUnsavedChanges || saveDraftMutation.isPending}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Save size={16} />
                      Save Draft
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Publish changes to live website?')) {
                          publishMutation.mutate();
                        }
                      }}
                      disabled={publishMutation.isPending}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Check size={16} />
                      Publish
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Reset to default content? This will delete all customizations.')) {
                          resetMutation.mutate();
                        }
                      }}
                      disabled={resetMutation.isPending}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  </div>
                </div>

                {/* Status Indicator */}
                {pageContent && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        pageContent.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm text-gray-700">
                        Status: <strong>{pageContent.status || 'default'}</strong>
                      </span>
                    </div>
                    {pageContent.publishedAt && (
                      <div className="text-sm text-gray-600">
                        Last published: {new Date(pageContent.publishedAt).toLocaleString()}
                      </div>
                    )}
                    {hasUnsavedChanges && (
                      <div className="ml-auto flex items-center gap-2 text-yellow-600">
                        <X size={14} />
                        <span className="text-sm font-medium">Unsaved changes</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sections */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading page content...</p>
                </div>
              ) : (
                selectedPage.sections.map(renderSection)
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a page to edit</p>
            </div>
          )}
        </div>
      </div>
    {cropModal && (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Adjust Image Position</h2>
              <p className="text-sm text-gray-600 mb-2">Choose orientation, drag to reposition, and zoom to frame perfectly.</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">🖱️</span>
                  Drag to move
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">🔍</span>
                  Scroll to zoom
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCropModal}
              className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              aria-label="Close cropper"
            >
              <X size={18} />
            </button>
          </div>

          {/* Orientation Toggle */}
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setCropOrientation('landscape');
                if (cropModal) saveFieldOrientation(cropModal.field.id, 'landscape');
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                cropOrientation === 'landscape'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Landscape (16:10)
            </button>
            <button
              type="button"
              onClick={() => {
                setCropOrientation('portrait');
                if (cropModal) saveFieldOrientation(cropModal.field.id, 'portrait');
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                cropOrientation === 'portrait'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Portrait (10:16)
            </button>
            <button
              type="button"
              onClick={() => {
                setCropOrientation('wide');
                if (cropModal) saveFieldOrientation(cropModal.field.id, 'wide');
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                cropOrientation === 'wide'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Wide Hero
            </button>
          </div>

          <div className="relative mb-4 h-96 w-full overflow-hidden rounded-xl bg-black cursor-move">
            <Cropper
              image={cropModal.imageSrc}
              crop={cropPosition}
              zoom={cropZoom}
              aspect={cropOrientation === 'landscape' ? 16 / 10 : cropOrientation === 'portrait' ? 10 / 16 : undefined}
              cropShape="rect"
              showGrid={true}
              onCropChange={setCropPosition}
              onZoomChange={setCropZoom}
              onCropComplete={onCropComplete}
              zoomWithWheel
              restrictPosition={false}
              style={{ containerStyle: { cursor: 'move' } }}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className={`relative border-2 border-white/80 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.4)] ${
                cropOrientation === 'landscape' ? 'w-[85%] max-w-[720px] aspect-[16/10]' : 
                cropOrientation === 'portrait' ? 'h-[85%] max-h-[640px] aspect-[10/16]' :
                'w-[90%] h-[90%]'
              }`}>
                <div className="absolute inset-0 rounded-xl border border-white/40 border-dashed" />
                <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                  {cropOrientation === 'landscape' ? 'Landscape · 16:10' : cropOrientation === 'portrait' ? 'Portrait · 10:16' : 'Wide Hero · No Crop'} · {cropModal.field.label}
                </span>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/60"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/60"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
              <span>Zoom: {cropZoom.toFixed(2)}x</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCropZoom(Math.max(1, cropZoom - 0.1))}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-semibold"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setCropZoom(1)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setCropZoom(Math.min(3, cropZoom + 0.1))}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-semibold"
                >
                  +
                </button>
              </div>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={cropZoom}
              onChange={(e) => setCropZoom(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeCropModal}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              {cropOrientation !== 'wide' && (
                <button
                  type="button"
                  onClick={() => handleCropConfirm(true)}
                  disabled={isProcessingCrop}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Use Original
                </button>
              )}
              <button
                type="button"
                onClick={() => handleCropConfirm(false)}
                disabled={isProcessingCrop}
                className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessingCrop ? 'Saving…' : cropOrientation === 'wide' ? 'Save Original (No Crop)' : 'Save Crop'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </AdminLayout>
  );
};

export default ManualWebsiteUpdatePage;
