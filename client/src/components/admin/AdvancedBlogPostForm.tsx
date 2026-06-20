import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdvancedRichTextEditor from './AdvancedRichTextEditor';
import IdeaModePanel from './IdeaModePanel';
import ImageCropper from '../ImageCropper';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Send, 
  AlertCircle, 
  Check,
  FileText,
  Image as ImageIcon,
  Settings,
  Eye,
  Upload,
  Loader2,
  X,
  Plus,
  Sparkles
} from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  content_html: string;
  cover_image?: string;
  image_url_2?: string;
  image_url_3?: string;
  tags?: string[];
  status: 'IDEA' | 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  ideaData?: any;
  pillar?: string;
  seo_title?: string;
  meta_description?: string;
  author_id?: string;
  published_at?: string;
  scheduled_for?: string;
}

interface BlogPostFormProps {
  post?: BlogPost;
  isEditing?: boolean;
}

type Step = 'content' | 'media' | 'meta' | 'preview';
type ImageField = 'cover_image' | 'image_url_2' | 'image_url_3';

interface CropTarget {
  field: ImageField;
  label: string;
  file: File;
}

// Curated tag suggestions for a Vienna portrait studio. Always available so the
// editor never depends on a remote tag table; merged with tags already used on
// existing posts at runtime.
const SUGGESTED_TAGS: string[] = [
  'wien',
  'studio',
  'familienfotos', 'familie', 'kinderfotos', 'geschwister',
  'neugeborenenfotos', 'babyfotos', 'baby',
  'schwangerschaftsfotos', 'babybauch',
  'businessfotos', 'bewerbungsfotos', 'teamfotos', 'linkedin', 'headshots', 'portrait',
  'hochzeitsfotos', 'hochzeit', 'paarfotos', 'event',
  'gutschein', 'geschenk', 'wandbilder', 'produktfotografie',
  'outfits', 'kleidung', 'preise', 'ablauf', 'vorbereitung', 'tipps',
];

// --- Auto-tagging -----------------------------------------------------------
// Rank known tags by how strongly they appear in the post's own text so the
// best matches can be applied without the user hand-picking them. German-aware:
// folds umlauts and matches photo-compound stems (e.g. the tag
// "familienfotos" still scores on body text that only says "Familien…").

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, ' ');

const normalizeText = (s: string): string =>
  s
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss');

// The strings we look for in the text for a given tag: the tag itself, a rough
// singular (trailing "s" dropped), and the stem with a trailing photo-word
// removed so compound tags match their root word.
const tagNeedles = (tag: string): string[] => {
  const t = normalizeText(tag).trim();
  const needles = new Set<string>([t]);
  if (t.endsWith('s')) needles.add(t.slice(0, -1));
  const base = t.replace(/(fotografie|fotos|foto|shootings|shooting|bilder|bild)$/, '');
  if (base.length >= 4 && base !== t) needles.add(base);
  return Array.from(needles).filter((n) => n.length >= 4);
};

const countOccurrences = (haystack: string, needle: string): number => {
  let idx = 0;
  let count = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    count++;
    idx += needle.length;
  }
  return count;
};

// Returns candidate tags ranked best-first, dropping any with no match. Title
// counts 3x and excerpt 2x so headline/summary keywords rank above body asides.
const recommendTagsFromContent = (
  candidates: string[],
  fields: { title?: string; excerpt?: string; contentHtml?: string },
  limit = 8,
): string[] => {
  const haystack = normalizeText(
    [
      fields.title ?? '',
      fields.title ?? '',
      fields.title ?? '',
      fields.excerpt ?? '',
      fields.excerpt ?? '',
      stripHtml(fields.contentHtml ?? ''),
    ].join(' '),
  );
  if (!haystack.trim()) return [];

  return candidates
    .map((tag) => {
      const score = tagNeedles(tag).reduce(
        (best, needle) => Math.max(best, countOccurrences(haystack, needle)),
        0,
      );
      return { tag, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.tag);
};

const AdvancedBlogPostForm: React.FC<BlogPostFormProps> = ({ post, isEditing = false }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const de = language === 'de'; // honour the global EN/DE toggle for this admin form
  const [currentStep, setCurrentStep] = useState<Step>('content');
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content_html: '',
    status: 'DRAFT',
    seo_title: '',
    meta_description: '',
    tags: [],
    scheduled_for: '',
    cover_image: '',
    image_url_2: '',
    image_url_3: ''
  });
  
  const [availableTags, setAvailableTags] = useState<{id: string, name: string}[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [zernioSending, setZernioSending] = useState(false);
  const [zernioMsg, setZernioMsg] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);

  const steps = [
    { id: 'content', label: 'Content', icon: FileText, description: 'Write your blog post content' },
    { id: 'media', label: 'Media', icon: ImageIcon, description: 'Add cover image and media' },
    { id: 'meta', label: 'Meta', icon: Settings, description: 'SEO and publishing settings' },
    { id: 'preview', label: 'Preview', icon: Eye, description: 'Review and publish' }
  ];

  useEffect(() => {
    fetchTags();
    
    if (post && isEditing) {
      const mappedData = {
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content_html: post.content_html || '',
        status: post.status || 'DRAFT',
        seo_title: post.seo_title || '',
        meta_description: post.meta_description || '',
        tags: post.tags || [],
        scheduled_for: post.scheduled_for || '',
        cover_image: post.cover_image || '',
        image_url_2: post.image_url_2 || (post as any).imageUrl2 || '',
        image_url_3: post.image_url_3 || (post as any).imageUrl3 || '',
        id: post.id,
        author_id: post.author_id,
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at
      };
      
      setFormData(mappedData);
      setSelectedTags(post.tags || []);
    }
  }, [post, isEditing]);

  const fetchTags = async () => {
    // Start from the curated list so suggestions always show, then merge in any
    // tags already used across existing posts (best-effort; the old Supabase
    // tag table was removed when the app moved to Neon).
    const merged = new Map<string, string>(); // lowercased -> display
    SUGGESTED_TAGS.forEach(t => merged.set(t.toLowerCase(), t));

    try {
      const res = await fetch('/api/blog/posts?limit=200');
      if (res.ok) {
        const json = await res.json();
        const posts: Array<{ tags?: string[] | null }> = json?.posts ?? [];
        posts.forEach(p => (p.tags ?? []).forEach(t => {
          const key = String(t).trim().toLowerCase();
          if (key && !merged.has(key)) merged.set(key, String(t).trim());
        }));
      }
    } catch {
      // Network/endpoint issue — curated suggestions still work.
    }

    setAvailableTags(Array.from(merged.values()).map((name, i) => ({ id: `tag-${i}`, name })));
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 60); // Limit length
  };

  const handleChange = (field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadImageFile = async (
    file: File,
    field: ImageField = 'cover_image',
  ) => {
    if (!file) return;
    
    try {
      setImageUploading(true);
      setError(null);
      
      // Get admin token from localStorage
      const getAdminToken = () => (typeof window !== 'undefined' ? (localStorage.getItem('ADMIN_TOKEN') || '') : '');
      
      // Upload to Backblaze B2 via /api/files/upload
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folderName', 'Blog Covers');
      uploadData.append('context', 'blog-cover-image');
      
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'x-admin-token': getAdminToken()
        },
        body: uploadData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Upload failed');
      }
      
      const data = await response.json();
      const publicUrl = data.url || data.publicUrl;
      
      if (!publicUrl) {
        throw new Error('No URL returned from upload');
      }
      
      handleChange(field, publicUrl);
    } catch (err: any) {
      console.error('[BLOG IMAGE UPLOAD] Error:', err);
      setError('Failed to upload image. Please try again. ' + (err.message || ''));
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageField,
    label: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropTarget({ field, label, file });
    e.target.value = '';
  };

  const reopenCropper = async (field: ImageField, label: string) => {
    const imageUrl = formData[field];
    if (!imageUrl) return;

    try {
      setError(null);
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(de ? 'Bild konnte nicht geladen werden' : 'Image could not be loaded');
      const blob = await response.blob();
      const extension = blob.type.split('/')[1] || 'jpg';
      const file = new File([blob], `${field}-${Date.now()}.${extension}`, {
        type: blob.type || 'image/jpeg',
      });
      setCropTarget({ field, label, file });
    } catch (err: any) {
      setError(err.message || (de ? 'Bild konnte nicht für die Transformation geöffnet werden' : 'Image could not be opened for transformation'));
    }
  };

  const handleCroppedUpload = async (blob: Blob) => {
    if (!cropTarget) return;

    const extension = cropTarget.file.name.includes('.')
      ? cropTarget.file.name.split('.').pop()
      : 'jpg';
    const croppedFile = new File([blob], `${cropTarget.field}-${Date.now()}.${extension}`, {
      type: cropTarget.file.type || blob.type || 'image/jpeg',
    });

    await uploadImageFile(croppedFile, cropTarget.field);
    setCropTarget(null);
  };

  const handleAddTag = () => {
    const value = newTag?.trim();
    if (!value) return;
    const exists = selectedTags.some(t => t.toLowerCase() === value.toLowerCase());
    if (!exists) {
      const updatedTags = [...selectedTags, value];
      setSelectedTags(updatedTags);
      handleChange('tags', updatedTags);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(updatedTags);
    handleChange('tags', updatedTags);
  };

  const handleTagSelect = (tagName: string) => {
    if (!selectedTags.some(t => t.toLowerCase() === tagName.toLowerCase())) {
      const updatedTags = [...selectedTags, tagName];
      setSelectedTags(updatedTags);
      handleChange('tags', updatedTags);
    }
  };

  // Rank the known tags against the post's text and merge the best matches into
  // the current selection. Only ever adds — never drops tags the user chose.
  const applyRecommendedTags = useCallback(() => {
    const candidates = availableTags.map(t => t.name);
    const recommended = recommendTagsFromContent(candidates, {
      title: formData.title,
      excerpt: formData.excerpt,
      contentHtml: formData.content_html,
    });

    setSelectedTags(prev => {
      const merged = [...prev];
      const seen = new Set(prev.map(t => t.toLowerCase()));
      recommended.forEach(tag => {
        if (!seen.has(tag.toLowerCase())) {
          merged.push(tag);
          seen.add(tag.toLowerCase());
        }
      });
      if (merged.length !== prev.length) handleChange('tags', merged);
      return merged;
    });
  }, [availableTags, formData.title, formData.excerpt, formData.content_html]);

  // Auto-apply recommended tags once for an existing post that has none yet, so
  // the best tags are filled in without the user having to click. Waits until
  // the candidate tag list has loaded. Never overwrites an existing selection.
  const autoTaggedRef = useRef(false);
  useEffect(() => {
    if (autoTaggedRef.current) return;
    if (!availableTags.length) return;
    if (!formData.title && !formData.content_html) return;
    if (selectedTags.length > 0) {
      // Post already has tags — nothing to auto-fill; don't run again.
      autoTaggedRef.current = true;
      return;
    }
    autoTaggedRef.current = true;
    applyRecommendedTags();
  }, [availableTags, selectedTags, formData.title, formData.content_html, applyRecommendedTags]);

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 'content':
        return !!(formData.title?.trim() && formData.content_html?.trim());
      case 'media':
        return true; // Media is optional
      case 'meta':
        return !!(formData.excerpt?.trim());
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const canProceedToNext = () => {
    return validateStep(currentStep);
  };

  const getStepIndex = (step: Step) => {
    return steps.findIndex(s => s.id === step);
  };

  const nextStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < steps.length - 1 && canProceedToNext()) {
      setCurrentStep(steps[currentIndex + 1].id as Step);
    }
  };

  const prevStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as Step);
    }
  };

  const handleSubmit = async (publish = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const postData = {
        title: formData.title || '',
        slug: formData.slug || generateSlug(formData.title || ''),
        excerpt: formData.excerpt || '',
        content: formData.content_html || '',
        contentHtml: formData.content_html || '',
        imageUrl: formData.cover_image || '',
        imageUrl2: formData.image_url_2 || '',
        imageUrl3: formData.image_url_3 || '',
        published: publish || formData.status === 'PUBLISHED',
        status: publish || formData.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
        metaDescription: formData.meta_description || '',
        seoTitle: formData.seo_title || '',
        tags: formData.tags || []
      };
      
      if (publish || formData.status === 'PUBLISHED') {
        postData.publishedAt = new Date().toISOString();
        postData.status = 'PUBLISHED';
      }
      
      // Get admin token from localStorage
      const getAdminToken = () => (typeof window !== 'undefined' ? (localStorage.getItem('ADMIN_TOKEN') || '') : '');
      
      const response = await fetch(isEditing && post?.id ? `/api/blog/posts/${post.id}` : '/api/blog/posts', {
        method: isEditing && post?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getAdminToken()
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[BLOG SAVE] Error response:', errorData);
        const errorMessage = errorData.details || errorData.error || 'Failed to save post';
        throw new Error(errorMessage);
      }
      
      setSuccessMessage(isEditing ? 'Post updated successfully!' : 'Post created successfully!');
      
      setTimeout(() => {
        navigate('/admin/blog');
      }, 1500);
      
    } catch (err) {
      console.error('[BLOG SAVE] Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving the post';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = validateStep(step.id as Step) && getStepIndex(currentStep) > index;
        const Icon = step.icon;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
                ${isActive 
                  ? 'bg-purple-600 border-purple-600 text-white' 
                  : isCompleted 
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }
              `}>
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-gray-500 max-w-24">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderContentStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Post Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            handleChange('title', e.target.value);
            // Auto-generate slug if not manually set
            if (!formData.slug || formData.slug === generateSlug(formData.title || '')) {
              handleChange('slug', generateSlug(e.target.value));
            }
          }}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Enter your post title..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL Slug <span className="text-red-500">*</span>
          <span className="text-xs text-gray-500 ml-2">(Used in the post URL)</span>
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 px-3 py-3 bg-gray-50 border border-gray-300 rounded-l-lg">
            /blog/
          </span>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="post-url-slug"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Only lowercase letters, numbers, and hyphens allowed. Auto-generated from title if left empty.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <AdvancedRichTextEditor
          value={formData.content_html}
          onChange={(value) => handleChange('content_html', value)}
          placeholder="Start writing your blog post content..."
        />
      </div>
    </div>
  );

  // Build the post's social pack and send it to Zernio (admin trigger).
  const sendToZernio = async () => {
    if (!post?.id) return;
    setZernioSending(true);
    setZernioMsg(null);
    try {
      const getAdminToken = () => (typeof window !== 'undefined' ? (localStorage.getItem('ADMIN_TOKEN') || '') : '');
      const socialPayload = {
        title: formData.title || post.title || '',
        slug: formData.slug || post.slug || '',
        excerpt: formData.excerpt || '',
        content: formData.content_html || '',
        contentHtml: formData.content_html || '',
        imageUrl: formData.cover_image || '',
        imageUrl2: formData.image_url_2 || '',
        imageUrl3: formData.image_url_3 || '',
      };
      const res = await fetch(`/api/blog/posts/${post.id}/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getAdminToken(),
        },
        body: JSON.stringify(socialPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (de ? 'Senden fehlgeschlagen' : 'Send failed'));
      const zernioError = String(data.result?.error || '');
      const zernioNeedsSetup = /not configured|not set/i.test(zernioError);
      setZernioMsg(
        !zernioNeedsSetup && data.configured
          ? (data.success
              ? (de ? '✓ An Zernio gesendet.' : '✓ Sent to Zernio.')
              : `${de ? 'Zernio-Fehler' : 'Zernio error'}: ${data.result?.error || data.result?.status || ''}`)
          : (de
              ? 'Social-Pack erstellt (Zernio-API noch nicht konfiguriert) — API-Key und Endpoint fehlen noch oder sind nicht vollstaendig gesetzt.'
              : 'Social pack created (Zernio API not configured yet) — API key and endpoint are still missing or incomplete.'),
      );
    } catch (err: any) {
      setZernioMsg(err.message);
    } finally {
      setZernioSending(false);
    }
  };

  // A single uploadable image slot (cover + optional extra images). The post
  // page renders cover + imageUrl2 + imageUrl3, so up to three images show.
  const imageSlot = (field: ImageField, label: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {formData[field] ? (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          {/* Constrain the preview so tall (portrait) images don't fill the screen and
              push the Free-transform / Remove / Save controls below the fold. */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white flex justify-center">
            <img
              src={formData[field]}
              alt={`${label} ${de ? 'Vorschau' : 'preview'}`}
              className={`max-h-96 w-auto max-w-full object-contain rounded-xl ${field === 'cover_image' ? 'shadow-lg' : 'shadow-2xl'}`}
            />
          </div>
          <p className="text-xs text-gray-500">
            {de
              ? 'Diese Vorschau nutzt die gleichen Bildproportionen wie der veröffentlichte Blogartikel. Über "Frei transformieren" kannst du den sichtbaren Ausschnitt verschieben und skalieren.'
              : 'This preview uses the same image proportions as the published blog article. Use "Free transform" to move and scale the visible crop.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => reopenCropper(field, label)}
              className="inline-flex items-center rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50"
            >
              {de ? 'Frei transformieren' : 'Free transform'}
            </button>
            <button
              type="button"
              onClick={() => handleChange(field, '')}
              className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <X size={16} className="mr-1" />
              {de ? 'Entfernen' : 'Remove'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <label className="cursor-pointer">
              <span className="text-purple-600 hover:text-purple-700 font-medium">{de ? 'Bild hochladen' : 'Upload image'}</span>
              <span className="text-gray-600">{de ? ' oder hierher ziehen' : ' or drag it here'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, field, label)}
                className="sr-only"
                disabled={imageUploading}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">PNG, JPG, WEBP {de ? 'bis' : 'up to'} 10MB</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderMediaStep = () => (
    <div className="space-y-6">
      {imageSlot('cover_image', de ? 'Titelbild (Cover)' : 'Cover image')}
      {imageSlot('image_url_2', de ? 'Weiteres Bild 2 (optional)' : 'Additional image 2 (optional)')}
      {imageSlot('image_url_3', de ? 'Weiteres Bild 3 (optional)' : 'Additional image 3 (optional)')}
      {imageUploading && (
        <div className="flex items-center justify-center text-purple-600">
          <Loader2 className="animate-spin mr-2" size={20} /> {de ? 'Wird hochgeladen…' : 'Uploading…'}
        </div>
      )}
      <p className="text-xs text-gray-500">
        {de
          ? 'Tipp: Für eine ganze Fotostrecke mit automatischen EXIF/SEO-Metadaten nutzt den Idee-Modus.'
          : 'Tip: For a whole photo series with automatic EXIF/SEO metadata, use Idea Mode.'}
      </p>

      {isEditing && post?.id && (
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{de ? 'Social-Verteilung (Zernio)' : 'Social distribution (Zernio)'}</label>
          <button
            type="button"
            onClick={sendToZernio}
            disabled={zernioSending || !formData.cover_image}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center"
            title={!formData.cover_image
              ? (de ? 'Titelbild erforderlich' : 'Cover image required')
              : (de ? 'Social-Posts (FB/IG/GMB/Pinterest/LinkedIn) an Zernio senden' : 'Send social posts (FB/IG/GMB/Pinterest/LinkedIn) to Zernio')}
          >
            {zernioSending ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send size={16} className="mr-2" />}
            {de ? 'An Zernio senden (Social)' : 'Send to Zernio (Social)'}
          </button>
          {zernioMsg && <p className="text-sm mt-2 text-gray-600">{zernioMsg}</p>}
        </div>
      )}
    </div>
  );

  const renderMetaStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Brief summary of your post (recommended: 280 characters)"
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {formData.excerpt.length}/280 characters
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <button
            type="button"
            onClick={applyRecommendedTags}
            title={de ? 'Passende Tags aus Titel, Auszug und Text vorschlagen' : 'Suggest matching tags from title, excerpt and content'}
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
          >
            <Sparkles size={14} className="mr-1" />
            {de ? 'Tags aus Inhalt vorschlagen' : 'Suggest tags from content'}
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Add
            </button>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {availableTags.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Suggested tags (click to add):</p>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !selectedTags.some(t => t.toLowerCase() === tag.name.toLowerCase()))
                  .slice(0, 18)
                  .map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagSelect(tag.name)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publishing Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>
        </div>

        {formData.status === 'SCHEDULED' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Date
            </label>
            <input
              type="datetime-local"
              value={formData.scheduled_for ? new Date(formData.scheduled_for).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('scheduled_for', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SEO Title
        </label>
        <input
          type="text"
          value={formData.seo_title || ''}
          onChange={(e) => handleChange('seo_title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="SEO optimized title (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          value={formData.meta_description || ''}
          onChange={(e) => handleChange('meta_description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="SEO meta description (optional)"
        />
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>
        
        {formData.cover_image && (
          <img
            src={formData.cover_image}
            alt="Cover"
            className="w-full rounded-xl shadow-lg mb-6"
          />
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
        
        {formData.excerpt && (
          <p className="text-lg text-gray-600 mb-6">{formData.excerpt}</p>
        )}
        
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedTags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: formData.content_html }}
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'content':
        return renderContentStep();
      case 'media':
        return renderMediaStep();
      case 'meta':
        return renderMetaStep();
      case 'preview':
        return renderPreviewStep();
      default:
        return renderContentStep();
    }
  };

  // Idea mode: the article body doesn't exist yet — show the photo-first panel
  // instead of the step editor. After "Generate" the post becomes a DRAFT and a
  // reload loads the normal editor with the generated content.
  if (formData.status === 'IDEA' && post?.id) {
    return (
      <div className="max-w-4xl mx-auto">
        <IdeaModePanel
          postId={post.id}
          title={formData.title || post.title}
          pillar={(post as any).pillar}
          initialIdea={(post as any).ideaData}
          onGenerated={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start mb-6">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {renderStepIndicator()}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderCurrentStep()}
        
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={getStepIndex(currentStep) === 0}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} className="mr-2" />
            Previous
          </button>
          
          <div className="flex space-x-3">
            {currentStep === 'preview' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Publish Post
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Save is available on every step (not just Preview) so changes —
                    e.g. a newly uploaded/cropped image — can be saved here directly. */}
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  {de ? 'Speichern' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToNext()}
                  className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {cropTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl">
            <ImageCropper
              file={cropTarget.file}
              title={`${cropTarget.label} ${de ? 'ausrichten' : 'align'}`}
              helpText={de
                ? 'Verschiebe und skaliere das Bild direkt im finalen Blog-Rahmen. Beim Speichern wird genau dieser Ausschnitt hochgeladen.'
                : 'Move and scale the image directly within the final blog frame. On save, exactly this crop is uploaded.'}
              onCancel={() => setCropTarget(null)}
              onCropped={(blob) => handleCroppedUpload(blob)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedBlogPostForm;
