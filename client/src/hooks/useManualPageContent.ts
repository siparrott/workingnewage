import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../context/LanguageContext';

interface PageContent {
  pageId: string;
  language: string;
  publishedContent: Record<string, string>;
  status: string;
  publishedAt?: string;
}

/**
 * Hook to fetch manual page content overrides and merge with translation keys
 * Usage in any public page component:
 * 
 * const t = useManualPageContent('home'); // 'home', 'contact', 'blog', etc.
 * return <h1>{t('home.heroTitle')}</h1>
 */
export function useManualPageContent(pageId: string) {
  const { t: originalT, language } = useLanguage();

  // Fetch manual page content from API
  const { data: pageContent } = useQuery<PageContent>({
    queryKey: ['/api/manual-pages', pageId, language],
    queryFn: async () => {
      const res = await fetch(`/api/manual-pages/${pageId}?language=${language}&_t=${Date.now()}`);
      if (!res.ok) return { pageId, language, publishedContent: {}, status: 'none' };
      return res.json();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const { data: germanFallback } = useQuery<PageContent>({
    queryKey: ['/api/manual-pages', pageId, 'de'],
    queryFn: async () => {
      const res = await fetch(`/api/manual-pages/${pageId}?language=de&_t=${Date.now()}`);
      if (!res.ok) return { pageId, language: 'de', publishedContent: {}, status: 'none' };
      return res.json();
    },
    enabled: language !== 'de',
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  /**
   * Enhanced translation function that checks manual overrides first,
   * then falls back to default translations
   */
  const t = (key: string): string => {
    // Debug logging
    console.log('[useManualPageContent] Looking up key:', key);
    console.log('[useManualPageContent] pageContent:', pageContent);
    console.log('[useManualPageContent] publishedContent:', pageContent?.publishedContent);
    console.log('[useManualPageContent] Keys in publishedContent:', pageContent?.publishedContent ? Object.keys(pageContent.publishedContent) : 'none');
    
    // First check if there's a manual override for this key
    if (pageContent?.publishedContent?.[key]) {
      console.log('[useManualPageContent] ✅ Found in publishedContent:', pageContent.publishedContent[key]);
      return pageContent.publishedContent[key];
    }

    if (language !== 'de' && germanFallback?.publishedContent?.[key]) {
      console.log('[useManualPageContent] ✅ Found in German fallback:', germanFallback.publishedContent[key]);
      return germanFallback.publishedContent[key];
    }
    
    // Fall back to default translation
    const defaultValue = originalT(key);
    console.log('[useManualPageContent] ⚠️ Using fallback translation:', defaultValue);
    return defaultValue;
  };

  return t;
}

/**
 * Simpler hook that returns just the manual content data
 * Useful for checking if content exists or getting metadata
 */
export function useManualPageData(pageId: string) {
  const { language } = useLanguage();

  return useQuery<PageContent>({
    queryKey: ['/api/manual-pages', pageId, language],
    queryFn: async () => {
      const res = await fetch(`/api/manual-pages/${pageId}?language=${language}&_t=${Date.now()}`);
      if (!res.ok) return { pageId, language, publishedContent: {}, status: 'none' };
      return res.json();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}
