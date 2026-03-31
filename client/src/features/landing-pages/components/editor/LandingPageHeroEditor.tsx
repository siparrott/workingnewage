import type { LandingPageHeroBlock } from '../../types/landingPageGeneration.types';
import LandingPageInlineTextField from './LandingPageInlineTextField';
import LandingPageInlineTextarea from './LandingPageInlineTextarea';

interface Props {
  data: LandingPageHeroBlock;
  onChange: (data: LandingPageHeroBlock) => void;
}

export default function LandingPageHeroEditor({ data, onChange }: Props) {
  const update = (field: keyof LandingPageHeroBlock, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <LandingPageInlineTextField
        label="Eyebrow"
        value={data.eyebrow || ''}
        onChange={v => update('eyebrow', v)}
        placeholder="e.g., Limited Time Offer"
      />
      <LandingPageInlineTextField
        label="Headline"
        value={data.headline}
        onChange={v => update('headline', v)}
        placeholder="Your main headline"
      />
      <LandingPageInlineTextarea
        label="Subheadline"
        value={data.subheadline}
        onChange={v => update('subheadline', v)}
        placeholder="Supporting text (2-3 sentences)"
        rows={3}
      />
      <div className="grid grid-cols-2 gap-3">
        <LandingPageInlineTextField
          label="Primary CTA"
          value={data.primaryCtaText}
          onChange={v => update('primaryCtaText', v)}
          placeholder="e.g., Book Now"
        />
        <LandingPageInlineTextField
          label="Secondary CTA"
          value={data.secondaryCtaText || ''}
          onChange={v => update('secondaryCtaText', v)}
          placeholder="e.g., Learn More"
        />
      </div>
      <LandingPageInlineTextField
        label="Badge Text"
        value={data.badgeText || ''}
        onChange={v => update('badgeText', v)}
        placeholder="e.g., 🌸 Spring Special"
      />
    </div>
  );
}
