import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, ZoomIn, ZoomOut, Move, Check, X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

// Cover template definitions
export interface CoverTemplate {
  id: string;
  name: string;
  thumbnail: string;
  textPosition: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left-center' | 'right-center';
  textAlignment: 'left' | 'center' | 'right';
  overlay: 'none' | 'dark' | 'light' | 'gradient-bottom' | 'gradient-top';
  titleSize: 'small' | 'medium' | 'large' | 'xlarge';
  showSubtitle: boolean;
  showButton: boolean;
  buttonStyle: 'solid' | 'outline' | 'pill';
  fontStyle: 'modern' | 'elegant' | 'bold' | 'minimal';
  imageStyle: 'full' | 'left-half' | 'right-half' | 'top-half' | 'bottom-half' | 'inset';
}

const COVER_TEMPLATES: CoverTemplate[] = [
  {
    id: 'classic-center',
    name: 'Classic Center',
    thumbnail: 'center',
    textPosition: 'center',
    textAlignment: 'center',
    overlay: 'dark',
    titleSize: 'large',
    showSubtitle: true,
    showButton: true,
    buttonStyle: 'outline',
    fontStyle: 'elegant',
    imageStyle: 'full'
  },
  {
    id: 'modern-left',
    name: 'Modern Left',
    thumbnail: 'left',
    textPosition: 'left-center',
    textAlignment: 'left',
    overlay: 'gradient-bottom',
    titleSize: 'xlarge',
    showSubtitle: false,
    showButton: true,
    buttonStyle: 'solid',
    fontStyle: 'bold',
    imageStyle: 'full'
  },
  {
    id: 'minimal-bottom',
    name: 'Minimal Bottom',
    thumbnail: 'bottom',
    textPosition: 'bottom-center',
    textAlignment: 'center',
    overlay: 'gradient-bottom',
    titleSize: 'medium',
    showSubtitle: true,
    showButton: true,
    buttonStyle: 'pill',
    fontStyle: 'minimal',
    imageStyle: 'full'
  },
  {
    id: 'elegant-top',
    name: 'Elegant Top',
    thumbnail: 'top',
    textPosition: 'top-center',
    textAlignment: 'center',
    overlay: 'light',
    titleSize: 'large',
    showSubtitle: true,
    showButton: false,
    buttonStyle: 'outline',
    fontStyle: 'elegant',
    imageStyle: 'full'
  },
  {
    id: 'split-right',
    name: 'Split Right',
    thumbnail: 'split-r',
    textPosition: 'right-center',
    textAlignment: 'center',
    overlay: 'none',
    titleSize: 'large',
    showSubtitle: true,
    showButton: true,
    buttonStyle: 'solid',
    fontStyle: 'modern',
    imageStyle: 'left-half'
  },
  {
    id: 'split-left',
    name: 'Split Left',
    thumbnail: 'split-l',
    textPosition: 'left-center',
    textAlignment: 'center',
    overlay: 'none',
    titleSize: 'large',
    showSubtitle: true,
    showButton: true,
    buttonStyle: 'solid',
    fontStyle: 'modern',
    imageStyle: 'right-half'
  },
  {
    id: 'corner-badge',
    name: 'Corner Badge',
    thumbnail: 'corner',
    textPosition: 'bottom-left',
    textAlignment: 'left',
    overlay: 'gradient-bottom',
    titleSize: 'medium',
    showSubtitle: false,
    showButton: true,
    buttonStyle: 'pill',
    fontStyle: 'bold',
    imageStyle: 'full'
  },
  {
    id: 'inset-frame',
    name: 'Inset Frame',
    thumbnail: 'inset',
    textPosition: 'bottom-center',
    textAlignment: 'center',
    overlay: 'none',
    titleSize: 'medium',
    showSubtitle: true,
    showButton: true,
    buttonStyle: 'outline',
    fontStyle: 'elegant',
    imageStyle: 'inset'
  }
];

export interface CoverSettings {
  template: CoverTemplate;
  imagePosition: { x: number; y: number };
  imageScale: number;
  title: string;
  subtitle?: string;
}

interface GalleryCoverDesignerProps {
  imageUrl: string;
  galleryTitle: string;
  initialSettings?: Partial<CoverSettings>;
  onSave: (settings: CoverSettings) => void;
  onCancel: () => void;
}

const GalleryCoverDesigner: React.FC<GalleryCoverDesignerProps> = ({
  imageUrl,
  galleryTitle,
  initialSettings,
  onSave,
  onCancel
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CoverTemplate>(
    initialSettings?.template || COVER_TEMPLATES[0]
  );
  const [imagePosition, setImagePosition] = useState(
    initialSettings?.imagePosition || { x: 50, y: 50 }
  );
  const [imageScale, setImageScale] = useState(initialSettings?.imageScale || 100);
  const [title, setTitle] = useState(initialSettings?.title || galleryTitle);
  const [subtitle, setSubtitle] = useState(initialSettings?.subtitle || 'NEW AGE FOTOGRAFIE');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isDragging, setIsDragging] = useState(false);
  const [templatePage, setTemplatePage] = useState(0);

  const templatesPerPage = 5;
  const totalPages = Math.ceil(COVER_TEMPLATES.length / templatesPerPage);
  const visibleTemplates = COVER_TEMPLATES.slice(
    templatePage * templatesPerPage,
    (templatePage + 1) * templatesPerPage
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    setImagePosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setImagePosition({ x: 50, y: 50 });
    setImageScale(100);
  };

  const handleSave = () => {
    onSave({
      template: selectedTemplate,
      imagePosition,
      imageScale,
      title,
      subtitle
    });
  };

  const getTextPositionClasses = (position: CoverTemplate['textPosition']) => {
    const positions: Record<string, string> = {
      'top-left': 'items-start justify-start text-left pt-8 pl-8',
      'top-center': 'items-start justify-center text-center pt-8',
      'top-right': 'items-start justify-end text-right pt-8 pr-8',
      'center': 'items-center justify-center text-center',
      'bottom-left': 'items-end justify-start text-left pb-8 pl-8',
      'bottom-center': 'items-end justify-center text-center pb-8',
      'bottom-right': 'items-end justify-end text-right pb-8 pr-8',
      'left-center': 'items-center justify-start text-left pl-8',
      'right-center': 'items-center justify-end text-right pr-8'
    };
    return positions[position] || positions['center'];
  };

  const getOverlayClasses = (overlay: CoverTemplate['overlay']) => {
    const overlays: Record<string, string> = {
      'none': '',
      'dark': 'bg-black/40',
      'light': 'bg-white/30',
      'gradient-bottom': 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
      'gradient-top': 'bg-gradient-to-b from-black/70 via-black/20 to-transparent'
    };
    return overlays[overlay] || '';
  };

  const getTitleSizeClasses = (size: CoverTemplate['titleSize'], isMobile: boolean) => {
    const sizes: Record<string, string> = {
      'small': isMobile ? 'text-lg' : 'text-2xl',
      'medium': isMobile ? 'text-xl' : 'text-3xl',
      'large': isMobile ? 'text-2xl' : 'text-4xl',
      'xlarge': isMobile ? 'text-3xl' : 'text-5xl'
    };
    return sizes[size] || sizes['large'];
  };

  const getFontStyleClasses = (style: CoverTemplate['fontStyle']) => {
    const styles: Record<string, string> = {
      'modern': 'font-sans tracking-wide',
      'elegant': 'font-serif tracking-widest uppercase',
      'bold': 'font-bold tracking-tight',
      'minimal': 'font-light tracking-[0.3em] uppercase'
    };
    return styles[style] || styles['modern'];
  };

  const getButtonClasses = (style: CoverTemplate['buttonStyle']) => {
    const styles: Record<string, string> = {
      'solid': 'bg-white text-gray-900 px-6 py-2 font-medium',
      'outline': 'border-2 border-white text-white px-6 py-2 font-medium',
      'pill': 'bg-white text-gray-900 px-8 py-2 rounded-full font-medium'
    };
    return styles[style] || styles['solid'];
  };

  const getImageContainerStyle = (imageStyle: CoverTemplate['imageStyle']) => {
    switch (imageStyle) {
      case 'left-half':
        return { width: '50%', left: 0 };
      case 'right-half':
        return { width: '50%', right: 0 };
      case 'top-half':
        return { height: '60%', top: 0 };
      case 'bottom-half':
        return { height: '60%', bottom: 0 };
      case 'inset':
        return { inset: '20px' };
      default:
        return {};
    }
  };

  const renderCoverPreview = (isMobile: boolean) => {
    const containerStyle = isMobile 
      ? { width: '180px', height: '320px' }
      : { width: '100%', aspectRatio: '16/9' };

    const template = selectedTemplate;
    const imageContainerStyle = getImageContainerStyle(template.imageStyle);

    return (
      <div 
        className={`relative overflow-hidden rounded-lg bg-gray-100 ${isMobile ? 'mx-auto' : ''}`}
        style={containerStyle}
      >
        {/* Image container */}
        <div 
          className="absolute overflow-hidden"
          style={{ 
            inset: template.imageStyle === 'inset' ? '16px' : 0,
            borderRadius: template.imageStyle === 'inset' ? '8px' : 0,
            ...imageContainerStyle 
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={imageUrl}
            alt="Cover"
            className="w-full h-full object-cover cursor-move"
            style={{
              objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
              transform: `scale(${imageScale / 100})`,
              transformOrigin: `${imagePosition.x}% ${imagePosition.y}%`
            }}
            draggable={false}
          />
        </div>

        {/* Overlay */}
        <div className={`absolute inset-0 ${getOverlayClasses(template.overlay)}`} />

        {/* Text content area - for split layouts */}
        {(template.imageStyle === 'left-half' || template.imageStyle === 'right-half') && (
          <div 
            className={`absolute top-0 bottom-0 ${template.imageStyle === 'left-half' ? 'right-0' : 'left-0'} w-1/2 bg-white flex flex-col items-center justify-center p-4`}
          >
            <h2 className={`${getTitleSizeClasses(template.titleSize, isMobile)} ${getFontStyleClasses(template.fontStyle)} text-gray-900 mb-2`}>
              {title}
            </h2>
            {template.showSubtitle && (
              <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} tracking-wider mb-4`}>
                {subtitle}
              </p>
            )}
            {template.showButton && (
              <button className={`${getButtonClasses(template.buttonStyle)} bg-gray-900 text-white ${isMobile ? 'text-xs px-4 py-1' : ''}`}>
                OPEN GALLERY
              </button>
            )}
          </div>
        )}

        {/* Text content - overlay layouts */}
        {template.imageStyle === 'full' && (
          <div className={`absolute inset-0 flex flex-col ${getTextPositionClasses(template.textPosition)} p-4`}>
            <div className={template.textAlignment === 'center' ? 'text-center' : template.textAlignment === 'right' ? 'text-right' : 'text-left'}>
              <h2 className={`${getTitleSizeClasses(template.titleSize, isMobile)} ${getFontStyleClasses(template.fontStyle)} text-white mb-2 drop-shadow-lg`}>
                {title}
              </h2>
              {template.showSubtitle && (
                <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'} tracking-wider mb-4`}>
                  {subtitle}
                </p>
              )}
              {template.showButton && (
                <button className={`${getButtonClasses(template.buttonStyle)} ${isMobile ? 'text-xs px-4 py-1' : ''}`}>
                  OPEN GALLERY
                </button>
              )}
            </div>
          </div>
        )}

        {/* Inset layout text */}
        {template.imageStyle === 'inset' && (
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 text-center">
            <h2 className={`${getTitleSizeClasses('small', isMobile)} ${getFontStyleClasses(template.fontStyle)} text-gray-900`}>
              {title}
            </h2>
            {template.showSubtitle && (
              <p className="text-gray-500 text-xs tracking-wider">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTemplateThumbnail = (template: CoverTemplate, isSelected: boolean) => {
    return (
      <div
        key={template.id}
        onClick={() => setSelectedTemplate(template)}
        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
          isSelected 
            ? 'border-purple-500 ring-2 ring-purple-200' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        style={{ width: '100px', height: '70px' }}
      >
        {/* Mini preview */}
        <div className="absolute inset-0 bg-gray-200">
          <img
            src={imageUrl}
            alt={template.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className={`absolute inset-0 ${getOverlayClasses(template.overlay)}`} />
          
          {/* Text indicator */}
          <div className={`absolute inset-0 flex ${getTextPositionClasses(template.textPosition)} p-1`}>
            <div className={`${template.textAlignment === 'center' ? 'text-center' : ''}`}>
              <div className="bg-white/90 text-[6px] px-1 rounded font-medium text-gray-800">
                {template.imageStyle === 'left-half' || template.imageStyle === 'right-half' ? 'SPLIT' : 'TEXT'}
              </div>
            </div>
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <Check size={10} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xl max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Gallery Cover Designer</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Check size={16} />
            Save Cover
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Main Preview Area */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Preview Mode Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Monitor size={18} />
              Cover
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Smartphone size={18} />
              Thumbnails
            </button>
          </div>

          {/* Preview Container */}
          <div className="flex items-center justify-center gap-8">
            {/* Desktop Preview */}
            <div className={previewMode === 'mobile' ? 'opacity-50 scale-90' : ''}>
              <div className="bg-white rounded-lg shadow-lg p-2" style={{ width: '480px' }}>
                {renderCoverPreview(false)}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Desktop View</p>
            </div>

            {/* Mobile Preview */}
            <div className={previewMode === 'desktop' ? 'opacity-50 scale-90' : ''}>
              <div className="bg-white rounded-lg shadow-lg p-2">
                {renderCoverPreview(true)}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Mobile View</p>
            </div>
          </div>

          {/* Image Controls */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Move size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                Position: {Math.round(imagePosition.x)}%, {Math.round(imagePosition.y)}%
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setImageScale(Math.max(50, imageScale - 10))}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <ZoomOut size={18} className="text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 w-16 text-center">{imageScale}%</span>
              <button
                onClick={() => setImageScale(Math.min(200, imageScale + 10))}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <ZoomIn size={18} className="text-gray-600" />
              </button>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          {/* Template Selector */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Gallery Cover</h3>
              <span className="text-sm text-purple-600 cursor-pointer hover:underline">+ ADD NEW</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTemplatePage(Math.max(0, templatePage - 1))}
                disabled={templatePage === 0}
                className="p-2 rounded-full bg-purple-100 text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex gap-3 overflow-hidden">
                {/* No Cover option */}
                <div
                  onClick={() => setSelectedTemplate({ ...COVER_TEMPLATES[0], id: 'no-cover', name: 'No Cover', overlay: 'none' })}
                  className="flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                  style={{ width: '100px', height: '70px' }}
                >
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <X size={12} className="text-gray-400" />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">No Cover</span>
                </div>
                
                {visibleTemplates.map(template => 
                  renderTemplateThumbnail(template, selectedTemplate.id === template.id)
                )}
              </div>

              <button
                onClick={() => setTemplatePage(Math.min(totalPages - 1, templatePage + 1))}
                disabled={templatePage >= totalPages - 1}
                className="p-2 rounded-full bg-purple-100 text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-80 border-l bg-white p-6 space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Cover Settings</h3>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Subtitle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Image Scale Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Scale</label>
            <input
              type="range"
              min="50"
              max="200"
              value={imageScale}
              onChange={(e) => setImageScale(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50%</span>
              <span>{imageScale}%</span>
              <span>200%</span>
            </div>
          </div>

          {/* Template Info */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Template</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-900">{selectedTemplate.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Text: {selectedTemplate.textPosition.replace('-', ' ')} • 
                Overlay: {selectedTemplate.overlay}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tips</h4>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Drag on the preview to reposition the image</li>
              <li>• Use zoom to fit more or less of the photo</li>
              <li>• Different templates work better with different photos</li>
              <li>• Check both desktop and mobile previews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryCoverDesigner;
export { COVER_TEMPLATES };
