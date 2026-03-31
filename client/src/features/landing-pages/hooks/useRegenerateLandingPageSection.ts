import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { regenerateLandingPageSection, type RegenerateSectionPayload } from '../services/landingPageRegeneration.client';
import type { LandingPageSectionKey } from '../types/landingPageEditor.types';
import type { RegenerateLandingPageSectionResponse } from '../types/landingPageRegeneration.types';

interface UseRegenerateSectionOptions {
  onSuccess?: (res: RegenerateLandingPageSectionResponse) => void;
  onError?: (err: Error) => void;
}

export function useRegenerateLandingPageSection(landingPageId: string, options?: UseRegenerateSectionOptions) {
  const qc = useQueryClient();
  const [regeneratingSection, setRegeneratingSection] = useState<LandingPageSectionKey | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: RegenerateSectionPayload) => {
      setRegeneratingSection(payload.sectionKey);
      return regenerateLandingPageSection(landingPageId, payload);
    },
    onSuccess: (res) => {
      setRegeneratingSection(null);
      qc.invalidateQueries({ queryKey: ['landing-page', landingPageId] });
      options?.onSuccess?.(res);
    },
    onError: (err: Error) => {
      setRegeneratingSection(null);
      options?.onError?.(err);
    },
  });

  return {
    regenerate: mutation.mutate,
    regenerateAsync: mutation.mutateAsync,
    isRegenerating: mutation.isPending,
    regeneratingSection,
    error: mutation.error,
    reset: mutation.reset,
  };
}
