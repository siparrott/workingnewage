// PublicLandingPageRenderer — Phase 4 + Phase 5 Event Tracking
// Master component that renders visible sections in order with SEO metadata + JSON-LD

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { buildLandingPageMetadata } from '../../utils/buildLandingPageMetadata';
import { buildLandingPageSchema } from '../../utils/buildLandingPageSchema';
import { getVisibleLandingPageSections } from '../../utils/landingPageVisibility';
import { trackPageView } from '../../utils/trackLandingPageEvent';
import type { LandingPageSectionKey } from '../../types/landingPageEditor.types';
import { PublicLandingPageHero } from './PublicLandingPageHero';
import { PublicLandingPageTrustBar } from './PublicLandingPageTrustBar';
import { PublicLandingPageProblemSection } from './PublicLandingPageProblemSection';
import { PublicLandingPageOfferSection } from './PublicLandingPageOfferSection';
import { PublicLandingPageBenefitsSection } from './PublicLandingPageBenefitsSection';
import { PublicLandingPageWhyChooseUsSection } from './PublicLandingPageWhyChooseUsSection';
import { PublicLandingPageInclusionsSection } from './PublicLandingPageInclusionsSection';
import { PublicLandingPageTestimonialsSection } from './PublicLandingPageTestimonialsSection';
import { PublicLandingPageFaqSection } from './PublicLandingPageFaqSection';
import { PublicLandingPageFinalCta } from './PublicLandingPageFinalCta';
import { PublicLandingPageSeoFooter } from './PublicLandingPageSeoFooter';
import { PublicLandingPagePreviewBanner } from './PublicLandingPagePreviewBanner';

interface PublicLandingPageRendererProps {
  page: {
    id: string;
    slug: string;
    seo_title?: string;
    meta_description?: string;
    canonical_url?: string | null;
    noindex?: boolean;
    cta_action?: string;
    cta_text?: string;
    city?: string | null;
    primary_service?: string | null;
    published_at?: string | null;
    content_json: Record<string, any>;
  };
  isPreview?: boolean;
  previewExpiresAt?: string | null;
}

function getCtaHref(page: any): string {
  const amount = Number(page.cta_voucher_amount) || 0;
  const voucherSlug = page.cta_voucher_slug;
  const ctaAction = page.cta_action || 'enquire';
  let base: string;
  // Priority:
  // 1. A DYNAMIC-priced voucher offer → open the personalize → Stripe flow at
  //    exactly this amount/title (the customer pays the offer price, e.g. €225).
  // 2. A bound voucher product → that product's fixed-price personalize flow.
  // 3. The conversion action's default page.
  if (amount > 0) {
    // Prefer the server-signed offer token (tamper-proof price). Fall back to
    // raw amount/title only if the token is somehow absent.
    if (page.cta_offer_token) {
      base = `/cart?vf=personalization&offer=${encodeURIComponent(String(page.cta_offer_token))}`;
    } else {
      const title = page.cta_voucher_title || page.content_json?.offerSection?.headline || page.title || 'Gutschein';
      base = `/cart?vf=personalization&amount=${encodeURIComponent(String(amount))}&title=${encodeURIComponent(String(title))}`;
    }
  } else if (voucherSlug) {
    base = `/voucher/${voucherSlug}`;
  } else {
    switch (ctaAction) {
      case 'book_now': base = '/booking'; break;
      case 'buy_voucher': base = '/vouchers'; break;
      case 'enquire':
      case 'callback':
      case 'waitlist':
      default: base = '/contact'; break;
    }
  }
  // Propagate campaign/UTM params from the landing URL so attribution survives.
  try {
    const src = new URLSearchParams(window.location.search);
    const keep: string[] = [];
    ['utm_campaign', 'utm_source', 'utm_medium', 'nac', 'campaign_id'].forEach((k) => {
      const v = src.get(k);
      if (v) keep.push(`${k}=${encodeURIComponent(v)}`);
    });
    if (keep.length) base += (base.includes('?') ? '&' : '?') + keep.join('&');
  } catch {}
  return base;
}

export function PublicLandingPageRenderer({
  page,
  isPreview = false,
  previewExpiresAt = null,
}: PublicLandingPageRendererProps) {
  const content = page.content_json || {};
  const ctaAction = page.cta_action || 'enquire';
  const ctaHref = getCtaHref(page);
  const ctaText = content.hero?.ctaText || page.cta_text || 'Jetzt buchen';

  // Build SEO metadata
  const metadata = buildLandingPageMetadata({
    seoTitle: page.seo_title || page.content_json?.seo?.title || '',
    metaDescription: page.meta_description || page.content_json?.seo?.description || page.content_json?.seo?.metaDescription || '',
    canonicalUrl: page.canonical_url || null,
    noindex: page.noindex || false,
    slug: page.slug,
    city: page.city || null,
    primaryService: page.primary_service || null,
    isPreview,
  });

  // Build JSON-LD schema blocks
  const schemaBlocks = buildLandingPageSchema({
    title: metadata.title,
    description: metadata.description,
    canonicalUrl: metadata.canonical || `${window.location.origin}/lp/${page.slug}`,
    city: page.city || null,
    primaryService: page.primary_service || null,
    faqItems: Array.isArray(content.faq) ? content.faq : undefined,
    offerName: content.offerSection?.headline,
    offerDescription: content.offerSection?.description,
  });

  // Phase 5: Track page view on mount (non-blocking, fire-and-forget)
  useEffect(() => {
    trackPageView(page.id, undefined, isPreview);
  }, [page.id, isPreview]);

  // Get visible sections in configured order
  const visibleSections = getVisibleLandingPageSections(content);

  // Section renderer map — uses raw DB field names from content_json
  const sectionRenderers: Partial<Record<LandingPageSectionKey, () => React.JSX.Element | null>> = {
    hero: () => content.hero ? (
      <PublicLandingPageHero
        key="hero"
        data={content.hero}
        imageUrl={(page as any).hero_image_url || null}
        videoUrl={(page as any).hero_video_url || null}
        ctaHref={ctaHref}
        ctaText={ctaText}
        pageId={page.id}
        pageSlug={page.slug}
        isPreview={isPreview}
      />
    ) : null,

    trustBar: () => content.trustBar ? (
      <PublicLandingPageTrustBar key="trustBar" data={content.trustBar} />
    ) : null,

    problemSection: () => content.problemSection ? (
      <PublicLandingPageProblemSection key="problemSection" data={content.problemSection} />
    ) : null,

    offerSection: () => content.offerSection ? (
      <PublicLandingPageOfferSection
        key="offerSection"
        data={content.offerSection}
        ctaHref={ctaHref}
        ctaText={ctaText}
        pageId={page.id}
        pageSlug={page.slug}
        isPreview={isPreview}
      />
    ) : null,

    benefits: () => content.benefits && content.benefits.length > 0 ? (
      <PublicLandingPageBenefitsSection key="benefits" data={content.benefits} />
    ) : null,

    whyChooseUs: () => content.whyChooseUs ? (
      <PublicLandingPageWhyChooseUsSection key="whyChooseUs" data={content.whyChooseUs} />
    ) : null,

    inclusions: () => content.inclusions ? (
      <PublicLandingPageInclusionsSection key="inclusions" data={content.inclusions} />
    ) : null,

    testimonials: () => content.testimonials && content.testimonials.length > 0 ? (
      <PublicLandingPageTestimonialsSection key="testimonials" data={content.testimonials} />
    ) : null,

    faq: () => content.faq && content.faq.length > 0 ? (
      <PublicLandingPageFaqSection key="faq" data={content.faq} />
    ) : null,

    finalCta: () => content.finalCta ? (
      <PublicLandingPageFinalCta
        key="finalCta"
        data={content.finalCta}
        ctaHref={ctaHref}
        ctaText={ctaText}
        pageId={page.id}
        pageSlug={page.slug}
        isPreview={isPreview}
      />
    ) : null,
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="robots" content={metadata.robots} />
        {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}
        <meta property="og:title" content={metadata.og.title} />
        <meta property="og:description" content={metadata.og.description} />
        <meta property="og:type" content={metadata.og.type} />
        {metadata.og.url && <meta property="og:url" content={metadata.og.url} />}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
      </Helmet>

      {/* JSON-LD structured data */}
      {schemaBlocks.map((block, i) => (
        <Helmet key={`schema-${i}`}>
          <script type="application/ld+json">{JSON.stringify(block)}</script>
        </Helmet>
      ))}

      {isPreview && <PublicLandingPagePreviewBanner expiresAt={previewExpiresAt} />}

      <div className={`min-h-screen bg-white font-sans ${isPreview ? 'pt-10' : ''}`}>
        {visibleSections.map(sectionKey => {
          const renderer = sectionRenderers[sectionKey];
          return renderer ? renderer() : null;
        })}

        <PublicLandingPageSeoFooter city={page.city} />
      </div>
    </>
  );
}
