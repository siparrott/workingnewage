import type { LandingPageSectionKey, LandingPageSectionVisibilityMap, LandingPageSectionOrder } from '../../types/landingPageEditor.types';
import type { LandingPageGeneratedContent } from '../../types/landingPageGeneration.types';
import LandingPageSectionCard from './LandingPageSectionCard';
import LandingPageEditorEmptyBlock from './LandingPageEditorEmptyBlock';
import LandingPageHeroEditor from './LandingPageHeroEditor';
import LandingPageOfferEditor from './LandingPageOfferEditor';
import LandingPageProblemEditor from './LandingPageProblemEditor';
import LandingPageBenefitsEditor from './LandingPageBenefitsEditor';
import LandingPageWhyChooseUsEditor from './LandingPageWhyChooseUsEditor';
import LandingPageInclusionsEditor from './LandingPageInclusionsEditor';
import LandingPageTestimonialsEditor from './LandingPageTestimonialsEditor';
import LandingPageFaqEditor from './LandingPageFaqEditor';
import LandingPageFinalCtaEditor from './LandingPageFinalCtaEditor';
import { getSectionDefinition } from '../../utils/landingPageSections';

interface Props {
  content: LandingPageGeneratedContent;
  sectionOrder: LandingPageSectionKey[];
  visibility: LandingPageSectionVisibilityMap;
  activeSection: LandingPageSectionKey | null;
  regeneratingSection?: LandingPageSectionKey | null;
  onActivateSection: (key: LandingPageSectionKey) => void;
  onUpdateSection: (key: LandingPageSectionKey, data: unknown) => void;
  onMoveSectionUp: (key: LandingPageSectionKey) => void;
  onMoveSectionDown: (key: LandingPageSectionKey) => void;
  onToggleVisibility: (key: LandingPageSectionKey) => void;
  onRemoveSection: (key: LandingPageSectionKey) => void;
  onRegenerate: (key: LandingPageSectionKey) => void;
}

/** Maps a section key to the corresponding editor component */
function renderSectionEditor(
  key: LandingPageSectionKey,
  content: LandingPageGeneratedContent,
  onUpdate: (data: unknown) => void,
): React.ReactNode {
  const def = getSectionDefinition(key);

  switch (key) {
    case 'hero':
      return content.hero
        ? <LandingPageHeroEditor data={content.hero} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'Hero'} />;

    case 'offerSection':
      return content.offerSection
        ? <LandingPageOfferEditor data={content.offerSection} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'Offer'} />;

    case 'problemSection':
      return content.problemSection
        ? <LandingPageProblemEditor data={content.problemSection} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'Problem'} />;

    case 'benefits':
      return content.benefits
        ? <LandingPageBenefitsEditor data={content.benefits} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'Benefits'} />;

    case 'whyChooseUs':
      return content.whyChooseUs
        ? <LandingPageWhyChooseUsEditor data={content.whyChooseUs} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'Why Choose Us'} />;

    case 'inclusions':
      return content.inclusions
        ? <LandingPageInclusionsEditor data={content.inclusions} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'Inclusions'} />;

    case 'testimonials':
      return content.testimonials
        ? <LandingPageTestimonialsEditor data={content.testimonials} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'Testimonials'} />;

    case 'faq':
      return content.faq
        ? <LandingPageFaqEditor data={content.faq} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'FAQ'} />;

    case 'finalCta':
      return content.finalCta
        ? <LandingPageFinalCtaEditor data={content.finalCta} onChange={onUpdate} />
        : <LandingPageEditorEmptyBlock sectionLabel={def?.label ?? 'Final CTA'} />;

    case 'trustBar':
      return <LandingPageEditorEmptyBlock sectionLabel="Trust Bar (visual only)" />;

    case 'seo':
      // SEO is handled separately in the right panel
      return null;

    default:
      return null;
  }
}

export default function LandingPageEditorCanvas({
  content,
  sectionOrder,
  visibility,
  activeSection,
  regeneratingSection,
  onActivateSection,
  onUpdateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onToggleVisibility,
  onRemoveSection,
  onRegenerate,
}: Props) {
  // Filter out seo from the canvas — it's in the right panel
  const canvasSections = sectionOrder.filter(k => k !== 'seo');

  return (
    <div className="space-y-4">
      {canvasSections.map((key, idx) => (
        <LandingPageSectionCard
          key={key}
          sectionKey={key}
          isVisible={visibility[key]}
          isFirst={idx === 0}
          isLast={idx === canvasSections.length - 1}
          isActive={activeSection === key}
          regenerating={regeneratingSection === key}
          onActivate={() => onActivateSection(key)}
          onRegenerate={() => onRegenerate(key)}
          onToggleVisibility={() => onToggleVisibility(key)}
          onMoveUp={() => onMoveSectionUp(key)}
          onMoveDown={() => onMoveSectionDown(key)}
          onRemove={() => onRemoveSection(key)}
        >
          {renderSectionEditor(key, content, data => onUpdateSection(key, data))}
        </LandingPageSectionCard>
      ))}
    </div>
  );
}
