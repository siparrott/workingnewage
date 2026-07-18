import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEditableLandingPage, updateLandingPageDraft } from '../services/landingPageEditor.client';
import { normalizeLandingPageContent, serializeEditorContent } from '../utils/normalizeLandingPageContent';
import { moveSectionUp, moveSectionDown, toggleSectionVisibility, removeSection, updateSectionData } from '../utils/landingPageEditor.helpers';
import { applySectionPatch } from '../utils/applySectionPatch';
import { evaluateLandingPagePublishReadiness } from '../utils/landingPageReadiness';
import type { LandingPageRecord } from '../types/landingPage.types';
import type { LandingPageGeneratedContent } from '../types/landingPageGeneration.types';
import type { LandingPageSectionKey, LandingPageContentMeta, LandingPageSeoState, LandingPagePublishReadinessResult, LandingPageSectionAlignment } from '../types/landingPageEditor.types';

export function useLandingPageEditor(pageId: string) {
  const qc = useQueryClient();

  // Fetch the page
  const { data: page, isLoading, error: fetchError } = useQuery<LandingPageRecord>({
    queryKey: ['landing-page', pageId],
    queryFn: () => getEditableLandingPage(pageId),
    enabled: !!pageId,
  });

  // Local editor state
  const [content, setContent] = useState<LandingPageGeneratedContent | null>(null);
  const [meta, setMeta] = useState<LandingPageContentMeta | null>(null);
  const [seo, setSeo] = useState<LandingPageSeoState>({ seoTitle: '', metaDescription: '', keyphrase: '', slug: '' });
  const [title, setTitle] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<LandingPageSectionKey | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialize from fetched page
  useEffect(() => {
    if (!page) return;
    const { content: norm, meta: normMeta } = normalizeLandingPageContent(page.content_json as Record<string, unknown>);
    setContent(norm);
    setMeta(normMeta);
    setTitle(page.title || '');
    setSeo({
      seoTitle: norm.seo?.seoTitle || page.seo_title || '',
      metaDescription: norm.seo?.metaDescription || page.meta_description || '',
      keyphrase: norm.seo?.keyphrase || '',
      slug: page.slug || '',
    });
    setLastSavedAt(page.updated_at || null);
  }, [page]);

  // Mark dirty on any change
  const markDirty = useCallback(() => setIsDirty(true), []);

  // Section updates
  const updateSection = useCallback((key: LandingPageSectionKey, data: unknown) => {
    setContent(prev => prev ? updateSectionData(prev, key, data) : prev);
    markDirty();
  }, [markDirty]);

  const handleMoveSectionUp = useCallback((key: LandingPageSectionKey) => {
    setMeta(prev => prev ? { ...prev, sectionOrder: moveSectionUp(prev.sectionOrder, key) } : prev);
    markDirty();
  }, [markDirty]);

  const handleMoveSectionDown = useCallback((key: LandingPageSectionKey) => {
    setMeta(prev => prev ? { ...prev, sectionOrder: moveSectionDown(prev.sectionOrder, key) } : prev);
    markDirty();
  }, [markDirty]);

  const handleToggleVisibility = useCallback((key: LandingPageSectionKey) => {
    setMeta(prev => prev ? { ...prev, sectionVisibility: toggleSectionVisibility(prev.sectionVisibility, key) } : prev);
    markDirty();
  }, [markDirty]);

  const handleSetAlignment = useCallback((key: LandingPageSectionKey, align: LandingPageSectionAlignment) => {
    setMeta(prev => {
      if (!prev) return prev;
      const current = prev.sectionAlignment || {};
      // 'center' is the default → drop the key rather than storing it.
      const next = { ...current };
      if (align === 'center') delete next[key];
      else next[key] = align;
      return { ...prev, sectionAlignment: next };
    });
    markDirty();
  }, [markDirty]);

  const handleRemoveSection = useCallback((key: LandingPageSectionKey) => {
    if (!content || !meta) return;
    const result = removeSection(content, meta, key);
    setContent(result.content);
    setMeta(result.meta);
    markDirty();
  }, [content, meta, markDirty]);

  const handleApplyPatch = useCallback((sectionKey: LandingPageSectionKey, patchData: unknown) => {
    if (!content || !meta) return;
    const result = applySectionPatch(content, meta, sectionKey, patchData);
    setContent(result.content);
    setMeta(result.meta);
    markDirty();
  }, [content, meta, markDirty]);

  const updateSeoField = useCallback((field: keyof LandingPageSeoState, value: string) => {
    setSeo(prev => ({ ...prev, [field]: value }));
    markDirty();
  }, [markDirty]);

  const updateTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
    markDirty();
  }, [markDirty]);

  // Save
  const save = useCallback(async () => {
    if (!page || !content || !meta) return;
    setIsSaving(true);
    setSaveError(null);

    // Sync SEO into content before save
    const updatedContent = {
      ...content,
      seo: {
        ...content.seo,
        seoTitle: seo.seoTitle,
        metaDescription: seo.metaDescription,
        keyphrase: seo.keyphrase,
        suggestedSlug: seo.slug,
      },
    };

    try {
      const payload = {
        title,
        slug: seo.slug,
        seo_title: seo.seoTitle,
        meta_description: seo.metaDescription,
        hero_headline: updatedContent.hero?.headline || '',
        hero_subheadline: updatedContent.hero?.subheadline || '',
        cta_text: updatedContent.hero?.primaryCtaText || updatedContent.finalCta?.primaryCtaText || '',
        content_json: serializeEditorContent(updatedContent, meta),
      };

      await updateLandingPageDraft(page.id, payload);
      const now = new Date().toISOString();
      setLastSavedAt(now);
      setIsDirty(false);
      qc.invalidateQueries({ queryKey: ['landing-page', pageId] });
      qc.invalidateQueries({ queryKey: ['landing-page-revisions', pageId] });
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [page, content, meta, title, seo, pageId, qc]);

  // Readiness
  const readiness = useMemo<LandingPagePublishReadinessResult>(() => {
    if (!page) return { isReady: false, errors: [], warnings: [], completedChecks: [], missingCriticalSections: [] };
    // Build a virtual page record with local edits for real-time readiness
    const virtual: LandingPageRecord = {
      ...page,
      title,
      slug: seo.slug,
      seo_title: seo.seoTitle,
      meta_description: seo.metaDescription,
      content_json: content ? serializeEditorContent(content, meta!) as any : page.content_json,
    };
    return evaluateLandingPagePublishReadiness(virtual);
  }, [page, title, seo, content, meta]);

  return {
    // Data
    page,
    content,
    meta,
    seo,
    title,
    readiness,

    // State
    isLoading,
    fetchError,
    isDirty,
    isSaving,
    lastSavedAt,
    saveError,
    activeSection,

    // Actions
    setActiveSection,
    updateSection,
    updateTitle,
    updateSeoField,
    moveSectionUp: handleMoveSectionUp,
    moveSectionDown: handleMoveSectionDown,
    toggleVisibility: handleToggleVisibility,
    setAlignment: handleSetAlignment,
    removeSection: handleRemoveSection,
    applyPatch: handleApplyPatch,
    save,
  };
}
