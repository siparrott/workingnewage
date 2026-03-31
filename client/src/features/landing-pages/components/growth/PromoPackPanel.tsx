// Promo Pack Panel — Phase 5

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useLandingPagePromoPack } from '../../hooks/useLandingPagePromoPack';
import { PromoPackCard } from './PromoPackCard';

interface PromoPackPanelProps {
  landingPageId: string;
}

const CHANNELS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'email', label: 'Email' },
  { key: 'gmb', label: 'Google Business' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'hero_image', label: 'Hero Image Prompt' },
] as const;

export function PromoPackPanel({ landingPageId }: PromoPackPanelProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'facebook',
    'instagram',
    'email',
    'gmb',
  ]);

  const { generate, isGenerating, promoPack } = useLandingPagePromoPack(landingPageId);

  function toggleChannel(key: string) {
    setSelectedChannels((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Select Channels</h3>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((ch) => (
            <Button
              key={ch.key}
              variant={selectedChannels.includes(ch.key) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleChannel(ch.key)}
            >
              {ch.label}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => generate({ channels: selectedChannels as any })}
        disabled={isGenerating || selectedChannels.length === 0}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Promo Pack
          </>
        )}
      </Button>

      {promoPack && (
        <div className="space-y-3">
          {promoPack.facebookPost && (
            <PromoPackCard title="Facebook Post" content={promoPack.facebookPost} />
          )}
          {promoPack.instagramCaption && (
            <PromoPackCard title="Instagram Caption" content={promoPack.instagramCaption} />
          )}
          {promoPack.emailSubject && (
            <PromoPackCard
              title="Email"
              content={`Subject: ${promoPack.emailSubject}\n\n${promoPack.emailBody || ''}`}
            />
          )}
          {promoPack.gmbPost && (
            <PromoPackCard title="Google Business Post" content={promoPack.gmbPost} />
          )}
          {promoPack.whatsappPromo && (
            <PromoPackCard title="WhatsApp Message" content={promoPack.whatsappPromo} />
          )}
          {promoPack.heroImagePrompt && (
            <PromoPackCard title="Hero Image Prompt" content={promoPack.heroImagePrompt} />
          )}
          {promoPack.voucherImagePrompt && (
            <PromoPackCard title="Voucher Image Prompt" content={promoPack.voucherImagePrompt} />
          )}
          {promoPack.socialCreativePrompt && (
            <PromoPackCard title="Social Creative Prompt" content={promoPack.socialCreativePrompt} />
          )}
        </div>
      )}
    </div>
  );
}
