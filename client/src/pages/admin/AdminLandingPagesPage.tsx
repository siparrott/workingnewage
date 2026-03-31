import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import {
  ArrowLeft, ChevronRight, Wand2, RefreshCw, Monitor, Smartphone,
  Eye, Edit, CheckCircle, Globe, MessageSquare, Shield, HelpCircle,
  Target, Users, Zap, Sparkles, Plus
} from 'lucide-react';

// Feature imports — modular architecture
import type { LandingPageRecord } from '../../features/landing-pages/types/landingPage.types';
import { useLandingPages, LANDING_PAGES_QUERY_KEY } from '../../features/landing-pages/hooks/useLandingPages';
import { useDeleteLandingPage } from '../../features/landing-pages/hooks/useDeleteLandingPage';
import { usePublishLandingPage } from '../../features/landing-pages/hooks/usePublishLandingPage';
import { useUnpublishLandingPage } from '../../features/landing-pages/hooks/useUnpublishLandingPage';
import { duplicateLandingPage } from '../../features/landing-pages/services/landingPages.client';
import { LandingPagesHeader } from '../../features/landing-pages/components/LandingPagesHeader';
import { LandingPagesList as LandingPagesListView } from '../../features/landing-pages/components/LandingPagesList';
import { slugifyLandingPageTitle } from '../../features/landing-pages/utils/landingPage.helpers';

// ===== MAIN COMPONENT =====
export default function AdminLandingPagesPage() {
  const [view, setView] = useState<'list' | 'wizard' | 'editor'>('list');
  const [editingPage, setEditingPage] = useState<LandingPageRecord | null>(null);
  const [wizardData, setWizardData] = useState<WizardData>(defaultWizardData);
  const [wizardStep, setWizardStep] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Use feature hooks
  const { pages, filters, setFilters, statusCounts, isLoading } = useLandingPages();
  const { deletePage } = useDeleteLandingPage({
    onSuccess: () => setDeleteConfirmId(null),
  });

  const { publish } = usePublishLandingPage();
  const { unpublish } = useUnpublishLandingPage();

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicateLandingPage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [LANDING_PAGES_QUERY_KEY] }),
  });

  const handleCreateNew = () => {
    // Route to dedicated create page for Phase 1 scaffold
    navigate('/admin/landing-pages/new');
  };

  // TODO: Phase 2 — wizard-based creation with AI generation
  const handleCreateViaWizard = () => {
    setWizardData(defaultWizardData);
    setWizardStep(1);
    setEditingPage(null);
    setView('wizard');
  };

  const handleEditPage = (page: LandingPageRecord) => {
    navigate(`/admin/landing-pages/${page.id}`);
  };

  const handleBackToList = () => {
    setView('list');
    setEditingPage(null);
    setWizardData(defaultWizardData);
    setWizardStep(1);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {view === 'list' && (
          <div className="space-y-6">
            <LandingPagesHeader onCreateNew={handleCreateNew} />
            <LandingPagesListView
              pages={pages}
              filters={filters}
              onFiltersChange={setFilters}
              statusCounts={statusCounts}
              isLoading={isLoading}
              onEdit={handleEditPage}
              onDelete={(id) => setDeleteConfirmId(id)}
              onDuplicate={(id) => duplicateMutation.mutate(id)}
              onPublish={(id) => publish(id)}
              onUnpublish={(id) => unpublish(id)}
              onCreateNew={handleCreateNew}
            />
          </div>
        )}
        {view === 'wizard' && (
          <LandingPageWizard
            data={wizardData}
            setData={setWizardData}
            step={wizardStep}
            setStep={setWizardStep}
            onBack={handleBackToList}
            onComplete={(page) => {
              setEditingPage(page as any);
              setView('editor');
              queryClient.invalidateQueries({ queryKey: [LANDING_PAGES_QUERY_KEY] });
            }}
          />
        )}
        {view === 'editor' && editingPage && (
          <LandingPageEditor
            page={editingPage as any}
            onBack={handleBackToList}
            onUpdate={(updated) => {
              setEditingPage(updated as any);
              queryClient.invalidateQueries({ queryKey: [LANDING_PAGES_QUERY_KEY] });
            }}
          />
        )}

        {/* Delete Confirmation */}
        <Dialog open={!!deleteConfirmId} onOpenChange={(o) => { if (!o) setDeleteConfirmId(null); }}>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[400px] bg-white border-2 shadow-2xl">
              <DialogHeader>
                <DialogTitle>Delete Landing Page</DialogTitle>
                <DialogDescription>This action cannot be undone. The page and all its content will be permanently deleted.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => deleteConfirmId && deletePage(deleteConfirmId)}
                  disabled={!deleteConfirmId}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

// WizardData type for the AI generation wizard (Phase 2)
interface WizardData {
  pageType: string;
  primaryService: string;
  city: string;
  title: string;
  tone: string;
  offerSummary: string;
  targetAudience: string;
  painPoints: string;
  urgency: string;
  trustSignals: string;
  testimonials: string;
  yearsInBusiness: string;
  studioLocation: string;
  ctaText: string;
  ctaAction: string;
  secondaryCtaText: string;
  keywords: string;
  seoTitle: string;
  metaDescription: string;
  slug: string;
}

const defaultWizardData: WizardData = {
  pageType: 'leads',
  primaryService: '',
  city: '',
  title: '',
  tone: 'warm',
  offerSummary: '',
  targetAudience: '',
  painPoints: '',
  urgency: '',
  trustSignals: '',
  testimonials: '',
  yearsInBusiness: '',
  studioLocation: '',
  ctaText: 'Jetzt buchen',
  ctaAction: 'book_now',
  secondaryCtaText: '',
  keywords: '',
  seoTitle: '',
  metaDescription: '',
  slug: '',
};

// ===== WIZARD (TODO: Phase 2 — AI-powered generation) =====
const WIZARD_STEPS = [
  { num: 1, title: 'What are you selling?', icon: Target },
  { num: 2, title: 'Offer & Audience', icon: Users },
  { num: 3, title: 'Trust & Proof', icon: Shield },
  { num: 4, title: 'CTA & Conversion', icon: Zap },
  { num: 5, title: 'SEO & Generate', icon: Sparkles },
];

function LandingPageWizard({ data, setData, step, setStep, onBack, onComplete }: {
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
  onComplete: (page: LandingPageRecord) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const updateField = (field: keyof WizardData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      // 1. Generate content via AI
      const genRes = await fetch('/api/admin/landing-pages/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: data.pageType,
          primaryService: data.primaryService,
          targetAudience: data.targetAudience,
          city: data.city,
          tone: data.tone,
          offerSummary: data.offerSummary,
          painPoints: data.painPoints,
          urgency: data.urgency,
          trustSignals: data.trustSignals,
          testimonials: data.testimonials,
          ctaText: data.ctaText,
          ctaAction: data.ctaAction,
          keywords: data.keywords,
        }),
      });
      if (!genRes.ok) throw new Error('AI generation failed');
      const genData = await genRes.json();

      // 2. Build slug
      const slug = data.slug || slugifyLandingPageTitle(data.title || data.primaryService || 'landing-page');

      // 3. Create the landing page in DB
      const createRes = await fetch('/api/admin/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title || genData.content?.seo?.title || `${data.primaryService} Landing Page`,
          slug,
          status: 'draft',
          page_type: data.pageType,
          primary_service: data.primaryService,
          target_audience: data.targetAudience,
          offer_summary: data.offerSummary,
          city: data.city,
          tone: data.tone,
          seo_title: data.seoTitle || genData.content?.seo?.title || '',
          meta_description: data.metaDescription || genData.content?.seo?.metaDescription || '',
          hero_headline: genData.content?.hero?.headline || '',
          hero_subheadline: genData.content?.hero?.subheadline || '',
          cta_text: data.ctaText || genData.content?.hero?.ctaText || 'Jetzt buchen',
          cta_action: data.ctaAction,
          content_json: genData.content,
          generation_prompt_json: data,
          generation_context_json: { model: genData.model, usage: genData.usage, generatedAt: new Date().toISOString() },
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || 'Failed to save landing page');
      }
      const page = await createRes.json();
      onComplete(page);
    } catch (err: any) {
      setGenError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Landing Page</h1>
          <p className="text-sm text-gray-500">AI will generate compelling copy based on your inputs</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 bg-white rounded-xl border p-4">
        {WIZARD_STEPS.map((s, idx) => (
          <React.Fragment key={s.num}>
            <button
              onClick={() => s.num <= step && setStep(s.num)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                step === s.num ? 'bg-purple-100 text-purple-700' :
                s.num < step ? 'text-green-600 cursor-pointer' : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s.num ? 'bg-purple-600 text-white' :
                s.num < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s.num < step ? <CheckCircle className="h-4 w-4" /> : s.num}
              </div>
              <span className="text-sm font-medium hidden md:inline">{s.title}</span>
            </button>
            {idx < WIZARD_STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-gray-300" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">What are you selling?</h2>
                <p className="text-sm text-gray-500">Tell us about the service or offer for this landing page</p>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Page Purpose</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'leads', label: 'Lead Capture', icon: '📋' },
                    { value: 'bookings', label: 'Bookings', icon: '📅' },
                    { value: 'voucher_sales', label: 'Voucher Sales', icon: '🎁' },
                    { value: 'mini_sessions', label: 'Mini Sessions', icon: '📸' },
                    { value: 'seasonal', label: 'Seasonal Campaign', icon: '🌸' },
                    { value: 'promotion', label: 'Special Promotion', icon: '⭐' },
                  ].map(opt => (
                    <button key={opt.value}
                      onClick={() => updateField('pageType', opt.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        data.pageType === opt.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <span className="text-2xl">{opt.icon}</span>
                      <p className="font-medium mt-1">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Service Type</Label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
                    { value: 'newborn', label: 'Newborn', icon: '👶' },
                    { value: 'maternity', label: 'Maternity', icon: '🤰' },
                    { value: 'wedding', label: 'Wedding', icon: '💒' },
                    { value: 'business', label: 'Business', icon: '💼' },
                    { value: 'cake_smash', label: 'Cake Smash', icon: '🎂' },
                    { value: 'mini_session', label: 'Mini Session', icon: '⚡' },
                    { value: 'custom', label: 'Custom', icon: '✏️' },
                  ].map(opt => (
                    <button key={opt.value}
                      onClick={() => updateField('primaryService', opt.value)}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        data.primaryService === opt.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <span className="text-xl">{opt.icon}</span>
                      <p className="text-sm font-medium mt-1">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City / Service Area</Label>
                  <Input value={data.city} onChange={(e) => updateField('city', e.target.value)} placeholder="e.g., Wien, Vienna" />
                </div>
                <div className="space-y-2">
                  <Label>Tone of Voice</Label>
                  <Select value={data.tone} onValueChange={(v) => updateField('tone', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm & Inviting</SelectItem>
                      <SelectItem value="premium">Premium & Elegant</SelectItem>
                      <SelectItem value="direct">Direct Response</SelectItem>
                      <SelectItem value="playful">Playful & Fun</SelectItem>
                      <SelectItem value="emotional">Emotional & Heartfelt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Landing Page Title (optional — AI can generate)</Label>
                <Input value={data.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g., Family Photoshoot Vouchers Vienna" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Offer & Audience</h2>
                <p className="text-sm text-gray-500">What's special about the offer and who is it for?</p>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Main Offer / What's Included</Label>
                <Textarea value={data.offerSummary} onChange={(e) => updateField('offerSummary', e.target.value)}
                  placeholder="e.g., 60 min family photoshoot, 10 retouched digital images, private online gallery, canvas 30x40cm included..."
                  rows={3} />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Target Audience — Who is this page for?</Label>
                <Textarea value={data.targetAudience} onChange={(e) => updateField('targetAudience', e.target.value)}
                  placeholder="e.g., Parents in Vienna looking for a family Christmas photoshoot, couples wanting pregnancy photos..."
                  rows={2} />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Pain Points — What problems does your audience have?</Label>
                <Textarea value={data.painPoints} onChange={(e) => updateField('painPoints', e.target.value)}
                  placeholder="e.g., Can't find a photographer who's good with kids, worried photos will look stiff and unnatural..."
                  rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Urgency / Deadline (optional)</Label>
                <Input value={data.urgency} onChange={(e) => updateField('urgency', e.target.value)}
                  placeholder="e.g., Only 5 dates available, offer ends April 15th, limited availability for Easter" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Trust & Proof</h2>
                <p className="text-sm text-gray-500">Why should the visitor trust you?</p>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Trust Signals — Why choose you?</Label>
                <Textarea value={data.trustSignals} onChange={(e) => updateField('trustSignals', e.target.value)}
                  placeholder="e.g., 8 years experience, 500+ happy families, professional studio in 1020 Wien, natural and relaxed style..."
                  rows={3} />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Testimonials (optional — AI will create realistic ones if empty)</Label>
                <Textarea value={data.testimonials} onChange={(e) => updateField('testimonials', e.target.value)}
                  placeholder='e.g., "Matt was amazing with our kids!" — Katharina M. / "Professional and relaxed atmosphere" — Thomas W.'
                  rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Years in Business</Label>
                  <Input value={data.yearsInBusiness} onChange={(e) => updateField('yearsInBusiness', e.target.value)} placeholder="e.g., 8" />
                </div>
                <div className="space-y-2">
                  <Label>Studio Location</Label>
                  <Input value={data.studioLocation} onChange={(e) => updateField('studioLocation', e.target.value)} placeholder="e.g., 1020 Wien, Leopoldstadt" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">CTA & Conversion</h2>
                <p className="text-sm text-gray-500">What should visitors do?</p>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Primary CTA Button Text</Label>
                <Input value={data.ctaText} onChange={(e) => updateField('ctaText', e.target.value)} placeholder="e.g., Jetzt buchen, Book Now" />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Conversion Action</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'book_now', label: 'Book Now', icon: '📅' },
                    { value: 'enquire', label: 'Enquire', icon: '✉️' },
                    { value: 'buy_voucher', label: 'Buy Voucher', icon: '🎁' },
                    { value: 'callback', label: 'Request Callback', icon: '📞' },
                    { value: 'waitlist', label: 'Join Waitlist', icon: '📝' },
                    { value: 'custom', label: 'Custom Link', icon: '🔗' },
                  ].map(opt => (
                    <button key={opt.value}
                      onClick={() => updateField('ctaAction', opt.value)}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        data.ctaAction === opt.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <span className="text-xl">{opt.icon}</span>
                      <p className="text-sm font-medium mt-1">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary CTA Text (optional)</Label>
                <Input value={data.secondaryCtaText} onChange={(e) => updateField('secondaryCtaText', e.target.value)}
                  placeholder="e.g., Mehr erfahren, See Our Work" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">SEO & Generate</h2>
                <p className="text-sm text-gray-500">Final details before AI generates your page</p>
              </div>
              <div className="space-y-2">
                <Label>Target Keywords</Label>
                <Input value={data.keywords} onChange={(e) => updateField('keywords', e.target.value)}
                  placeholder="e.g., family photoshoot vienna, fotoshooting wien, newborn photographer" />
              </div>
              <div className="space-y-2">
                <Label>SEO Page Title (optional — AI will suggest)</Label>
                <Input value={data.seoTitle} onChange={(e) => updateField('seoTitle', e.target.value)}
                  placeholder="Under 60 characters" maxLength={60} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description (optional — AI will suggest)</Label>
                <Textarea value={data.metaDescription} onChange={(e) => updateField('metaDescription', e.target.value)}
                  placeholder="Under 160 characters" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-mono">/lp/</span>
                  <Input value={data.slug} onChange={(e) => updateField('slug', e.target.value)}
                    placeholder={slugifyLandingPageTitle(data.title || data.primaryService || 'my-page')}
                    className="font-mono" />
                </div>
              </div>

              {genError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  {genError}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : onBack()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {step > 1 ? 'Previous' : 'Cancel'}
        </Button>
        {step < 5 ? (
          <Button onClick={() => setStep(step + 1)} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={generating} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2 px-8">
            {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {generating ? 'Generating with AI...' : 'Generate Landing Page'}
          </Button>
        )}
      </div>
    </div>
  );
}

// ===== EDITOR =====
// TODO: Phase 3 — extract editor into features/landing-pages/components/LandingPageEditor
function LandingPageEditor({ page, onBack, onUpdate }: {
  page: LandingPageRecord;
  onBack: () => void;
  onUpdate: (page: LandingPageRecord) => void;
}) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(page.content_json || {});
  const [seoTitle, setSeoTitle] = useState(page.seo_title || '');
  const [metaDesc, setMetaDesc] = useState(page.meta_description || '');
  const [slug, setSlug] = useState(page.slug);

  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: () => fetch(`/api/admin/landing-pages/${page.id}/publish`, { method: 'POST' }).then(r => r.json()),
    onSuccess: (data) => { onUpdate(data); queryClient.invalidateQueries({ queryKey: ['/api/admin/landing-pages'] }); },
  });

  const unpublishMutation = useMutation({
    mutationFn: () => fetch(`/api/admin/landing-pages/${page.id}/unpublish`, { method: 'POST' }).then(r => r.json()),
    onSuccess: (data) => { onUpdate(data); queryClient.invalidateQueries({ queryKey: ['/api/admin/landing-pages'] }); },
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/landing-pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_json: content,
          seo_title: seoTitle,
          meta_description: metaDesc,
          slug,
          hero_headline: content?.hero?.headline,
          hero_subheadline: content?.hero?.subheadline,
          cta_text: content?.hero?.ctaText || content?.finalCta?.ctaText,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateSection = async (sectionKey: string) => {
    try {
      const res = await fetch('/api/admin/landing-pages/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: sectionKey,
          context: page.generation_prompt_json,
          currentContent: content[sectionKey],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setContent((prev: any) => ({ ...prev, [sectionKey]: data.content }));
      }
    } catch (err) {
      console.error('Regenerate failed:', err);
    }
  };

  const sections = [
    { key: 'hero', label: 'Hero Section', icon: '🎯' },
    { key: 'trustBar', label: 'Trust Bar', icon: '⭐' },
    { key: 'problemSection', label: 'Problem / Pain', icon: '💭' },
    { key: 'offerSection', label: 'Offer', icon: '🎁' },
    { key: 'benefits', label: 'Benefits', icon: '✅' },
    { key: 'whyChooseUs', label: 'Why Choose Us', icon: '🏆' },
    { key: 'testimonials', label: 'Testimonials', icon: '💬' },
    { key: 'faq', label: 'FAQ', icon: '❓' },
    { key: 'finalCta', label: 'Final CTA', icon: '🚀' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-white border-b px-6 py-3 -mx-6 -mt-6 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h2 className="font-semibold text-gray-900">{page.title}</h2>
            <span className="text-xs text-gray-500 font-mono">/lp/{slug}</span>
          </div>
          <Badge variant={page.status === 'published' ? 'default' : 'secondary'}
            className={page.status === 'published' ? 'bg-green-100 text-green-800' : ''}>
            {page.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-1">
            {showPreview ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          {showPreview && (
            <div className="flex border rounded-lg">
              <button onClick={() => setPreviewMode('desktop')}
                className={`px-2 py-1 ${previewMode === 'desktop' ? 'bg-gray-100' : ''}`}>
                <Monitor className="h-4 w-4" />
              </button>
              <button onClick={() => setPreviewMode('mobile')}
                className={`px-2 py-1 ${previewMode === 'mobile' ? 'bg-gray-100' : ''}`}>
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving} className="gap-1">
            {saving ? <RefreshCw className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
            Save Draft
          </Button>
          {page.status === 'published' ? (
            <Button variant="outline" size="sm" onClick={() => unpublishMutation.mutate()}
              disabled={unpublishMutation.isPending}>Unpublish</Button>
          ) : (
            <Button size="sm" onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white gap-1">
              <Globe className="h-3 w-3" />
              {publishMutation.isPending ? 'Publishing...' : 'Publish'}
            </Button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Section Navigator */}
        <div className="col-span-3 space-y-2">
          <h3 className="font-semibold text-sm text-gray-500 uppercase mb-3">Sections</h3>
          {sections.map(s => (
            <button key={s.key} onClick={() => { setEditingSection(s.key); setShowPreview(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                editingSection === s.key ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
              } ${!content?.[s.key] ? 'opacity-50' : ''}`}>
              <span>{s.icon}</span>
              <span>{s.label}</span>
              {content?.[s.key] && <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />}
            </button>
          ))}
          <hr className="my-3" />
          <button onClick={() => setEditingSection('seo')}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
              editingSection === 'seo' ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
            }`}>
            <span>🔍</span>
            <span>SEO Settings</span>
          </button>
        </div>

        {/* Center: Section Editor or Preview */}
        <div className="col-span-9">
          {showPreview ? (
            <div className={`bg-white rounded-lg border overflow-hidden mx-auto ${previewMode === 'mobile' ? 'max-w-sm' : ''}`}>
              <LandingPagePreviewInline content={content} />
            </div>
          ) : editingSection === 'seo' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={60} />
                  <p className="text-xs text-gray-400">{seoTitle.length}/60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={3} />
                  <p className="text-xs text-gray-400">{metaDesc.length}/160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-mono">/lp/</span>
                    <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="font-mono" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : editingSection && content?.[editingSection] ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{sections.find(s => s.key === editingSection)?.label}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleRegenerateSection(editingSection)} className="gap-1">
                  <RefreshCw className="h-3 w-3" /> Regenerate
                </Button>
              </CardHeader>
              <CardContent>
                <SectionEditor sectionKey={editingSection} data={content[editingSection]}
                  onChange={(newData) => setContent((prev: any) => ({ ...prev, [editingSection]: newData }))} />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a section to edit</h3>
              <p className="text-gray-400">Click any section on the left to start editing, or use Preview to see the full page.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== SECTION EDITOR =====
function SectionEditor({ sectionKey, data, onChange }: { sectionKey: string; data: any; onChange: (data: any) => void }) {
  if (!data) return null;

  // Handle different section structures
  if (sectionKey === 'hero') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="font-medium">Headline</Label>
          <Input value={data.headline || ''} onChange={(e) => onChange({ ...data, headline: e.target.value })} className="text-lg font-bold" />
        </div>
        <div className="space-y-2">
          <Label className="font-medium">Subheadline</Label>
          <Textarea value={data.subheadline || ''} onChange={(e) => onChange({ ...data, subheadline: e.target.value })} rows={3} />
        </div>
        <div className="space-y-2">
          <Label className="font-medium">CTA Button Text</Label>
          <Input value={data.ctaText || ''} onChange={(e) => onChange({ ...data, ctaText: e.target.value })} />
        </div>
      </div>
    );
  }

  if (sectionKey === 'trustBar') {
    const items = data.items || [];
    return (
      <div className="space-y-3">
        <Label className="font-medium">Trust Signals</Label>
        {items.map((item: string, idx: number) => (
          <Input key={idx} value={item} onChange={(e) => {
            const newItems = [...items];
            newItems[idx] = e.target.value;
            onChange({ ...data, items: newItems });
          }} />
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange({ ...data, items: [...items, ''] })}>
          <Plus className="h-3 w-3 mr-1" /> Add Item
        </Button>
      </div>
    );
  }

  if (sectionKey === 'faq') {
    const faqs = Array.isArray(data) ? data : [];
    return (
      <div className="space-y-4">
        {faqs.map((faq: any, idx: number) => (
          <Card key={idx} className="p-4">
            <div className="space-y-2">
              <Input value={faq.question || ''} onChange={(e) => {
                const newFaqs = [...faqs];
                newFaqs[idx] = { ...faq, question: e.target.value };
                onChange(newFaqs);
              }} placeholder="Question" className="font-medium" />
              <Textarea value={faq.answer || ''} onChange={(e) => {
                const newFaqs = [...faqs];
                newFaqs[idx] = { ...faq, answer: e.target.value };
                onChange(newFaqs);
              }} placeholder="Answer" rows={2} />
            </div>
          </Card>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...faqs, { question: '', answer: '' }])}>
          <Plus className="h-3 w-3 mr-1" /> Add FAQ
        </Button>
      </div>
    );
  }

  if (sectionKey === 'testimonials') {
    const testimonials = Array.isArray(data) ? data : [];
    return (
      <div className="space-y-4">
        {testimonials.map((t: any, idx: number) => (
          <Card key={idx} className="p-4">
            <div className="space-y-2">
              <Textarea value={t.quote || ''} onChange={(e) => {
                const newT = [...testimonials];
                newT[idx] = { ...t, quote: e.target.value };
                onChange(newT);
              }} placeholder="Quote" rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input value={t.author || ''} onChange={(e) => {
                  const newT = [...testimonials];
                  newT[idx] = { ...t, author: e.target.value };
                  onChange(newT);
                }} placeholder="Author name" />
                <Input value={t.role || ''} onChange={(e) => {
                  const newT = [...testimonials];
                  newT[idx] = { ...t, role: e.target.value };
                  onChange(newT);
                }} placeholder="Context" />
              </div>
            </div>
          </Card>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...testimonials, { quote: '', author: '', role: '' }])}>
          <Plus className="h-3 w-3 mr-1" /> Add Testimonial
        </Button>
      </div>
    );
  }

  if (sectionKey === 'benefits') {
    const benefits = Array.isArray(data) ? data : [];
    return (
      <div className="space-y-4">
        {benefits.map((b: any, idx: number) => (
          <Card key={idx} className="p-4">
            <div className="space-y-2">
              <Input value={b.title || ''} onChange={(e) => {
                const newB = [...benefits];
                newB[idx] = { ...b, title: e.target.value };
                onChange(newB);
              }} placeholder="Benefit title" className="font-medium" />
              <Textarea value={b.description || ''} onChange={(e) => {
                const newB = [...benefits];
                newB[idx] = { ...b, description: e.target.value };
                onChange(newB);
              }} placeholder="Description" rows={2} />
            </div>
          </Card>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...benefits, { title: '', description: '' }])}>
          <Plus className="h-3 w-3 mr-1" /> Add Benefit
        </Button>
      </div>
    );
  }

  // Generic section editor for problemSection, offerSection, whyChooseUs, finalCta
  return (
    <div className="space-y-4">
      {typeof data === 'object' && Object.entries(data).map(([key, value]: [string, any]) => {
        if (Array.isArray(value)) {
          return (
            <div key={key} className="space-y-2">
              <Label className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
              {value.map((item: any, idx: number) => {
                if (typeof item === 'string') {
                  return <Input key={idx} value={item} onChange={(e) => {
                    const newArr = [...value];
                    newArr[idx] = e.target.value;
                    onChange({ ...data, [key]: newArr });
                  }} />;
                }
                if (typeof item === 'object') {
                  return (
                    <Card key={idx} className="p-3 space-y-2">
                      {Object.entries(item).map(([k, v]) => (
                        <div key={k}>
                          <Label className="text-xs capitalize">{k}</Label>
                          <Input value={String(v || '')} onChange={(e) => {
                            const newArr = [...value];
                            newArr[idx] = { ...item, [k]: e.target.value };
                            onChange({ ...data, [key]: newArr });
                          }} />
                        </div>
                      ))}
                    </Card>
                  );
                }
                return null;
              })}
            </div>
          );
        }
        if (typeof value === 'string') {
          const isLong = value.length > 80;
          return (
            <div key={key} className="space-y-2">
              <Label className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
              {isLong ? (
                <Textarea value={value} onChange={(e) => onChange({ ...data, [key]: e.target.value })} rows={3} />
              ) : (
                <Input value={value} onChange={(e) => onChange({ ...data, [key]: e.target.value })} />
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ===== INLINE PREVIEW =====
function LandingPagePreviewInline({ content }: { content: any }) {
  if (!content || Object.keys(content).length === 0) {
    return <div className="p-12 text-center text-gray-400">No content generated yet</div>;
  }

  return (
    <div className="font-sans">
      {/* Hero */}
      {content.hero && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.hero.headline}</h1>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">{content.hero.subheadline}</p>
          <button className="bg-white text-purple-700 font-bold px-8 py-3 rounded-full text-lg shadow-lg">
            {content.hero.ctaText || 'Book Now'}
          </button>
        </div>
      )}

      {/* Trust Bar */}
      {content.trustBar?.items && (
        <div className="bg-gray-50 py-4 px-6 flex justify-center gap-8 text-sm text-gray-600 border-b">
          {content.trustBar.items.map((item: string, i: number) => (
            <span key={i} className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" /> {item}
            </span>
          ))}
        </div>
      )}

      {/* Problem Section */}
      {content.problemSection && (
        <div className="py-12 px-8 bg-white">
          <h2 className="text-2xl font-bold text-center mb-4">{content.problemSection.headline}</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6">{content.problemSection.description}</p>
          {content.problemSection.painPoints && (
            <div className="max-w-md mx-auto space-y-2">
              {content.problemSection.painPoints.map((p: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-400 mt-1">•</span> {p}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Offer Section */}
      {content.offerSection && (
        <div className="py-12 px-8 bg-purple-50">
          <h2 className="text-2xl font-bold text-center mb-4">{content.offerSection.headline}</h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-4">{content.offerSection.description}</p>
          {content.offerSection.price && <p className="text-3xl font-bold text-purple-600 text-center mb-4">{content.offerSection.price}</p>}
          {content.offerSection.inclusions && (
            <div className="max-w-md mx-auto space-y-2">
              {content.offerSection.inclusions.map((inc: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> {inc}
                </div>
              ))}
            </div>
          )}
          {content.offerSection.urgency && (
            <p className="text-center text-red-600 font-semibold mt-4">{content.offerSection.urgency}</p>
          )}
        </div>
      )}

      {/* Benefits */}
      {content.benefits && (
        <div className="py-12 px-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {content.benefits.map((b: any, i: number) => (
              <div key={i} className="text-center p-4">
                <h3 className="font-bold mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      {content.whyChooseUs && (
        <div className="py-12 px-8 bg-gray-50">
          <h2 className="text-2xl font-bold text-center mb-8">{content.whyChooseUs.headline}</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {content.whyChooseUs.reasons?.map((r: any, i: number) => (
              <div key={i} className="flex gap-3">
                <Shield className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">{r.title}</h4>
                  <p className="text-sm text-gray-600">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials */}
      {content.testimonials && (
        <div className="py-12 px-8 bg-white">
          <h2 className="text-2xl font-bold text-center mb-8">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {content.testimonials.map((t: any, i: number) => (
              <Card key={i} className="p-6">
                <p className="text-gray-700 italic mb-3">"{t.quote}"</p>
                <p className="text-sm font-semibold">— {t.author}</p>
                {t.role && <p className="text-xs text-gray-500">{t.role}</p>}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {content.faq && (
        <div className="py-12 px-8 bg-gray-50">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {content.faq.map((f: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-500" /> {f.question}
                </h4>
                <p className="text-sm text-gray-600 mt-2 ml-6">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final CTA */}
      {content.finalCta && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{content.finalCta.headline}</h2>
          <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">{content.finalCta.description}</p>
          <button className="bg-white text-purple-700 font-bold px-8 py-3 rounded-full text-lg shadow-lg">
            {content.finalCta.ctaText || 'Book Now'}
          </button>
        </div>
      )}
    </div>
  );
}
