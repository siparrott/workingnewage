import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Sparkles, Lightbulb } from 'lucide-react';
import { useCreateLandingPage } from '../../features/landing-pages/hooks/useCreateLandingPage';
import { LANDING_PAGE_TYPES } from '../../features/landing-pages/utils/landingPage.constants';
import { slugifyLandingPageTitle } from '../../features/landing-pages/utils/landingPage.helpers';
import { toast } from '@/hooks/use-toast';

export default function AdminLandingPageNewPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [primaryService, setPrimaryService] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [pageType, setPageType] = useState('custom');
  const [city, setCity] = useState('');
  const [offerSummary, setOfferSummary] = useState('');

  const { create, isCreating, error } = useCreateLandingPage({
    onSuccess: () => {
      toast({ title: 'Landing page created', description: 'Your draft has been saved.' });
      navigate('/admin/landing-pages');
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const handleSave = () => {
    const slug = slugifyLandingPageTitle(title || 'untitled-landing-page');
    create({
      title: title || 'Untitled Landing Page',
      slug,
      status: 'draft',
      page_type: pageType,
      primary_service: primaryService || undefined,
      target_audience: targetAudience || undefined,
      city: city || undefined,
      offer_summary: offerSummary || undefined,
      content_json: {},
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin/landing-pages')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Landing Page</h1>
            <p className="text-sm text-gray-500">
              Set up the basics first. You'll be able to generate copy, refine sections, and publish a live URL in the next stages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main form */}
          <div className="col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Family Photoshoot Vouchers Vienna"
                  />
                  {title && (
                    <p className="text-xs text-gray-400 font-mono">
                      /lp/{slugifyLandingPageTitle(title)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageType">Page Type</Label>
                  <Select value={pageType} onValueChange={setPageType}>
                    <SelectTrigger id="pageType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANDING_PAGE_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.icon} {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryService">Primary Service</Label>
                    <Input
                      id="primaryService"
                      value={primaryService}
                      onChange={(e) => setPrimaryService(e.target.value)}
                      placeholder="e.g., Family Photography"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / Service Area</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., Wien, Vienna"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Parents looking for family photoshoots"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerSummary">Offer Summary</Label>
                  <Textarea
                    id="offerSummary"
                    value={offerSummary}
                    onChange={(e) => setOfferSummary(e.target.value)}
                    placeholder="e.g., 60-minute session, 10 retouched images, private online gallery..."
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                    {error.message}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right info panel */}
          <div className="col-span-4 space-y-4">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">AI Generation</h3>
                </div>
                <p className="text-sm text-purple-800">
                  In the next phase you'll be able to generate compelling copy, headlines, and
                  full page sections using AI — based on the details you enter here.
                </p>
                {/* TODO: Phase 2 — link to AI generation wizard */}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">What's Next</h3>
                </div>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Save as a draft now</li>
                  <li>• AI-generated copy (Phase 2)</li>
                  <li>• Visual section editor (Phase 3)</li>
                  <li>• Publish to a live URL (Phase 4)</li>
                </ul>
                {/* TODO: Phase 3 — link to editor */}
                {/* TODO: Phase 4 — link to publish flow */}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => navigate('/admin/landing-pages')}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isCreating}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            <Save className="h-4 w-4" />
            {isCreating ? 'Saving...' : 'Save as Draft'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
