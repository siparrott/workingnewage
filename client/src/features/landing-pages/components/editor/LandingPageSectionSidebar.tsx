import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronUp, ChevronDown, Sparkles, Trash2, Eye, EyeOff } from 'lucide-react';
import type { LandingPageSectionKey, LandingPageSectionVisibilityMap } from '../../types/landingPageEditor.types';
import { LANDING_PAGE_SECTION_DEFINITIONS } from '../../utils/landingPageSections';
import { getSectionDefinition } from '../../utils/landingPageSections';

interface Props {
  sectionOrder: LandingPageSectionKey[];
  visibility: LandingPageSectionVisibilityMap;
  activeSection: LandingPageSectionKey | null;
  onSelect: (key: LandingPageSectionKey) => void;
  onToggleVisibility: (key: LandingPageSectionKey) => void;
  onRegenerate: (key: LandingPageSectionKey) => void;
}

export default function LandingPageSectionSidebar({
  sectionOrder,
  visibility,
  activeSection,
  onSelect,
  onToggleVisibility,
  onRegenerate,
}: Props) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Sections</h3>
      {sectionOrder.map(key => {
        const def = getSectionDefinition(key);
        if (!def) return null;
        const isVisible = visibility[key];
        const isActive = activeSection === key;

        return (
          <div
            key={key}
            className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
              isActive ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
            } ${!isVisible ? 'opacity-50' : ''}`}
            onClick={() => onSelect(key)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{def.label}</p>
            </div>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {def.supportsRegeneration && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={e => { e.stopPropagation(); onRegenerate(key); }}
                  title="Regenerate"
                >
                  <Sparkles className="h-3 w-3 text-purple-500" />
                </Button>
              )}
              {def.supportsVisibilityToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={e => { e.stopPropagation(); onToggleVisibility(key); }}
                  title={isVisible ? 'Hide section' : 'Show section'}
                >
                  {isVisible
                    ? <Eye className="h-3 w-3 text-gray-400" />
                    : <EyeOff className="h-3 w-3 text-gray-400" />
                  }
                </Button>
              )}
            </div>

            {def.required && (
              <span className="text-[10px] text-purple-500 font-medium">REQ</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
