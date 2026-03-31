/**
 * Public Landing Page — /lp/:slug
 *
 * Phase 4: Modular renderer with SEO metadata, JSON-LD schema,
 * canonical URLs, section visibility, preview token support, and CTA tracking.
 */
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { PublicLandingPageRenderer } from '@/features/landing-pages/components/public/PublicLandingPageRenderer';
import { PublicLandingPageNotFound } from '@/features/landing-pages/components/public/PublicLandingPageNotFound';

export default function PublicLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get('preview');

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['/api/lp', slug, previewToken],
    queryFn: () => {
      const url = previewToken
        ? `/api/lp/${slug}?preview=${encodeURIComponent(previewToken)}`
        : `/api/lp/${slug}`;
      return fetch(url).then(r => {
        if (!r.ok) throw new Error('Page not found');
        return r.json();
      });
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return <PublicLandingPageNotFound />;
  }

  const isPreview = !!page._isPreview;

  return (
    <PublicLandingPageRenderer
      page={page}
      isPreview={isPreview}
      previewExpiresAt={isPreview ? page.preview_token_expires_at : null}
    />
  );
}
