import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { useLandingPageEditor } from '../../features/landing-pages/hooks/useLandingPageEditor';
import { useDuplicateLandingPage } from '../../features/landing-pages/hooks/useDuplicateLandingPage';
import { useRegenerateLandingPageSection } from '../../features/landing-pages/hooks/useRegenerateLandingPageSection';
import { usePublishLandingPage } from '../../features/landing-pages/hooks/usePublishLandingPage';
import { useUnpublishLandingPage } from '../../features/landing-pages/hooks/useUnpublishLandingPage';
import { useLandingPagePreviewUrl } from '../../features/landing-pages/hooks/useLandingPagePreviewUrl';
import LandingPageEditorLayout from '../../features/landing-pages/components/editor/LandingPageEditorLayout';
import type { LandingPageSectionKey } from '../../features/landing-pages/types/landingPageEditor.types';
import type { LandingPageSectionRegenerationMode } from '../../features/landing-pages/types/landingPageRegeneration.types';
import { normalizeLandingPageContent } from '../../features/landing-pages/utils/normalizeLandingPageContent';
import { useToast } from '@/hooks/use-toast';

export default function AdminLandingPageEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const editor = useLandingPageEditor(id!);

  const { duplicate: triggerDuplicate, isDuplicating } = useDuplicateLandingPage({
    onSuccess: (duplicatedId: string) => {
      navigate(`/admin/landing-pages/${duplicatedId}`);
    },
  });

  const { regenerate, regeneratingSection } = useRegenerateLandingPageSection(id!, {
    onSuccess: (res) => {
      // The AI endpoint returns a section in server shape (arrays are unwrapped,
      // whyChooseUs uses reasons, testimonials use role). Re-wrap + run it
      // through the same normalizer the editor uses so it maps to the editor's
      // section shape, then apply to local state. (Without this the regenerated
      // content was silently discarded.)
      // Server returns { sectionKey, content }; the typed shape calls it
      // `section` — accept either so a type drift can't silently break this.
      const key = (((res as any).sectionKey ?? (res as any).section)) as LandingPageSectionKey;
      const raw: any = (res as any).content;
      if (raw == null) return;

      // SEO isn't a content section — it lives in the SEO fields.
      if (key === ('seo' as LandingPageSectionKey)) {
        if (raw.title) editor.updateSeoField('seoTitle', String(raw.title));
        if (raw.metaDescription) editor.updateSeoField('metaDescription', String(raw.metaDescription));
        toast({ title: 'SEO regenerated', description: 'Review the new title/description, then Save.' });
        return;
      }

      const existingTitle = (editor.content as any)?.[key]?.title || '';
      let wrapped: any = raw;
      if (Array.isArray(raw)) {
        if (key === 'benefits' || key === 'faq' || key === 'inclusions') wrapped = { title: existingTitle, items: raw };
        else if (key === 'testimonials') wrapped = { title: existingTitle, testimonials: raw };
        else if (key === 'trustBar') wrapped = { items: raw };
      }

      const normalized = (normalizeLandingPageContent({ [key]: wrapped } as any).content as any)[key];
      if (normalized !== undefined) {
        // applyAiSection keeps what was there before, so "Undo AI change" on the
        // section puts the studio's own copy back.
        editor.applyAiSection(key, normalized);
        toast({
          title: 'Section regenerated',
          description: editor.isPublished
            ? 'Review the new copy. "Undo AI change" restores your text; Save puts it live.'
            : 'Review the new copy. "Undo AI change" restores your text.',
        });
      } else {
        toast({ title: 'Nothing generated', description: 'The AI returned no usable content. Try again.', variant: 'destructive' });
      }
    },
    onError: (err: any) => {
      toast({ title: 'Regeneration failed', description: err?.message || 'Could not regenerate the section.', variant: 'destructive' });
    },
  });

  const { publish, isPublishing } = usePublishLandingPage();
  const { unpublish, isUnpublishing } = useUnpublishLandingPage();
  const { requestPreviewLink } = useLandingPagePreviewUrl();

  // Leaving never drops copy silently. A draft is saved on the way out; a live
  // page is not (Save is what puts changes live), so ask first.
  const handleBack = useCallback(async () => {
    if (editor.isDirty) {
      if (editor.isPublished) {
        if (!window.confirm('You have unsaved changes on this live page. Leave without saving them?')) return;
      } else if (!(await editor.save())) {
        toast({ title: 'Not saved', description: 'Your changes could not be saved, so you are still on this page.', variant: 'destructive' });
        return;
      }
    }
    navigate('/admin/landing-pages');
  }, [editor, navigate, toast]);

  const handleDuplicate = useCallback(() => {
    if (id) triggerDuplicate(id);
  }, [id, triggerDuplicate]);

  const handleSuggestFields = useCallback(async () => {
    try {
      const { filled } = await editor.suggestFields();
      toast(
        filled > 0
          ? { title: `Filled ${filled} field${filled === 1 ? '' : 's'}`, description: 'Review the suggestions, then Save.' }
          : { title: 'Nothing to fill', description: 'All recommended and optional fields already have content.' },
      );
    } catch (err: any) {
      toast({ title: 'Suggestion failed', description: err?.message || 'Could not generate suggestions.', variant: 'destructive' });
    }
  }, [editor, toast]);

  const handleRegenerateSection = useCallback(
    (key: LandingPageSectionKey, mode: string, customInstruction?: string) => {
      regenerate({
        sectionKey: key,
        mode: mode as LandingPageSectionRegenerationMode,
        customInstruction,
        // The copy on screen, not the last saved copy — "improve" must improve
        // what the studio is looking at, including edits not yet saved.
        currentContent: (editor.content as unknown as Record<string, unknown> | null)?.[key],
      });
    },
    [regenerate, editor.content],
  );

  const handlePublish = useCallback(() => {
    if (!id) return;
    publish(id, {
      onSuccess: () => {
        toast({ title: 'Page published', description: 'Your landing page is now live.' });
      },
      onError: (err: any) => {
        const message = err?.validation?.errors?.join(', ') || err?.message || 'Failed to publish';
        toast({ title: 'Publish failed', description: message, variant: 'destructive' });
      },
    });
  }, [id, publish, toast]);

  const handleUnpublish = useCallback(() => {
    if (!id) return;
    unpublish(id, {
      onSuccess: () => {
        toast({ title: 'Page unpublished', description: 'Your landing page has been taken offline.' });
      },
      onError: () => {
        toast({ title: 'Unpublish failed', description: 'Could not unpublish the page.', variant: 'destructive' });
      },
    });
  }, [id, unpublish, toast]);

  const handlePreviewLink = useCallback(async () => {
    if (!id) return;
    // Pre-open a tab synchronously (inside the click gesture) so the popup
    // blocker doesn't kill it after the await; we set its URL once we have it.
    const previewWindow = window.open('about:blank', '_blank');
    const url = await requestPreviewLink(id);
    if (url) {
      const fullUrl = `${window.location.origin}${url}`;
      if (previewWindow) {
        previewWindow.location.href = fullUrl;
      }
      navigator.clipboard?.writeText(fullUrl).catch(() => {});
      toast({
        title: 'Preview ready',
        description: previewWindow
          ? 'Opened in a new tab (and copied to clipboard). Expires in 24 hours.'
          : 'Copied to clipboard — paste it in a new tab. Expires in 24 hours.',
      });
    } else {
      if (previewWindow) previewWindow.close();
      toast({ title: 'Preview failed', description: 'Could not create a preview link. Please save the page and try again.', variant: 'destructive' });
    }
  }, [id, requestPreviewLink, toast]);

  if (editor.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-gray-500">Loading editor…</p>
      </div>
    );
  }

  if (editor.fetchError || !editor.page) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <p className="text-sm text-red-600">{editor.fetchError?.message || 'Page not found'}</p>
        <button className="text-sm text-purple-600 underline" onClick={handleBack}>
          Back to list
        </button>
      </div>
    );
  }

  if (!editor.content || !editor.meta) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-gray-500">Initializing editor…</p>
      </div>
    );
  }

  return (
    <LandingPageEditorLayout
      page={editor.page}
      content={editor.content}
      seo={editor.seo}
      title={editor.title}
      sectionOrder={editor.meta.sectionOrder}
      visibility={editor.meta.sectionVisibility}
      alignment={editor.meta.sectionAlignment}
      activeSection={editor.activeSection}
      readiness={editor.readiness}
      isDirty={editor.isDirty}
      isSaving={editor.isSaving}
      lastSavedAt={editor.lastSavedAt}
      saveError={editor.saveError}
      regeneratingSection={regeneratingSection}
      pageStatus={(editor.page.status as 'draft' | 'published' | 'archived') || 'draft'}
      publishedUrl={editor.page.published_url || null}
      isPublishing={isPublishing}
      isUnpublishing={isUnpublishing}
      setActiveSection={editor.setActiveSection}
      updateSection={editor.updateSection}
      updateTitle={editor.updateTitle}
      updateSeoField={editor.updateSeoField}
      moveSectionUp={editor.moveSectionUp}
      moveSectionDown={editor.moveSectionDown}
      toggleVisibility={editor.toggleVisibility}
      setAlignment={editor.setAlignment}
      removeSection={editor.removeSection}
      save={editor.save}
      onBack={handleBack}
      onDuplicate={handleDuplicate}
      isDuplicating={isDuplicating}
      onSuggestFields={handleSuggestFields}
      isSuggesting={editor.isSuggesting}
      onRegenerateSection={handleRegenerateSection}
      aiUndoAvailable={editor.aiUndoAvailable}
      onUndoAiSection={editor.undoAiSection}
      onPublish={handlePublish}
      onUnpublish={handleUnpublish}
      onPreviewLink={handlePreviewLink}
    />
  );
}
