/**
 * DomainStep — Configure app URL, frontend URL, public site base URL
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Globe, Loader2, Info } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function DomainStep({ onComplete, onBack }: Props) {
  const [appUrl, setAppUrl] = useState('');
  const [frontendUrl, setFrontendUrl] = useState('');
  const [publicSiteBaseUrl, setPublicSiteBaseUrl] = useState('');

  // Load existing values
  const { data: current, isLoading } = useQuery({
    queryKey: ['tech-setup-current'],
    queryFn: () => fetch('/api/setup/technical/current').then(r => r.json()),
    staleTime: 5000,
  });

  useEffect(() => {
    if (current?.domain) {
      setAppUrl(current.domain.appUrl || '');
      setFrontendUrl(current.domain.frontendUrl || '');
      setPublicSiteBaseUrl(current.domain.publicSiteBaseUrl || '');
    }
  }, [current]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/setup/technical/domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appUrl, frontendUrl, publicSiteBaseUrl }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      return res.json();
    },
    onSuccess: () => onComplete(),
  });

  const isValid = appUrl.trim().length > 0;

  if (isLoading) {
    return (
      <CardContent className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <CardTitle>Domain & URLs</CardTitle>
            <CardDescription>Where does your app live on the internet?</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-6">
        {/* App URL (API) */}
        <div className="space-y-2">
          <Label htmlFor="appUrl">
            App URL (API Backend) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="appUrl"
            placeholder="https://api.yourdomain.com"
            value={appUrl}
            onChange={e => setAppUrl(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            The base URL for your API server (e.g., where this Express app runs)
          </p>
        </div>

        {/* Frontend URL */}
        <div className="space-y-2">
          <Label htmlFor="frontendUrl">Frontend URL</Label>
          <Input
            id="frontendUrl"
            placeholder="https://yourdomain.com"
            value={frontendUrl}
            onChange={e => setFrontendUrl(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            Your client's main domain. Used for CORS, redirects, and email links.
          </p>
        </div>

        {/* Public Site Base URL */}
        <div className="space-y-2">
          <Label htmlFor="publicSiteBaseUrl">Public Site Base URL</Label>
          <Input
            id="publicSiteBaseUrl"
            placeholder="https://yourdomain.com"
            value={publicSiteBaseUrl}
            onChange={e => setPublicSiteBaseUrl(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            If your public-facing site has a different domain from the admin panel, enter it here.
            Defaults to the frontend URL.
          </p>
        </div>

        {/* Info box */}
        <div className="flex gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Tip:</strong> If you're running everything on a single domain, the App URL and
            Frontend URL can be the same. URLs should include the protocol (https://) and 
            should <em>not</em> end with a trailing slash.
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between px-6 pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onComplete}>Skip for now</Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!isValid || saveMutation.isPending}
          >
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save & Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardFooter>

      {saveMutation.isError && (
        <div className="px-6 pb-4">
          <p className="text-sm text-red-600">
            {(saveMutation.error as Error).message}
          </p>
        </div>
      )}
    </>
  );
}
