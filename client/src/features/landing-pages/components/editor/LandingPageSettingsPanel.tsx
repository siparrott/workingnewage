import { useEffect, useRef, useState } from 'react';
import type { LandingPageRecord } from '../../types/landingPage.types';
import LandingPageInlineTextField from './LandingPageInlineTextField';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  page: LandingPageRecord;
  title: string;
  onTitleChange: (title: string) => void;
}

interface VoucherProduct { id: string; slug: string; name: string; price: string | number; }

export default function LandingPageSettingsPanel({ page, title, onTitleChange }: Props) {
  const { toast } = useToast();
  const p = page as any;
  const [voucherSlug, setVoucherSlug] = useState<string>(p.cta_voucher_slug || '');
  const [offerAmount, setOfferAmount] = useState<string>(p.cta_voucher_amount != null ? String(p.cta_voucher_amount) : '');
  const [offerTitle, setOfferTitle] = useState<string>(p.cta_voucher_title || '');
  const [heroImage, setHeroImage] = useState<string>(p.hero_image_url || '');
  const [heroVideo, setHeroVideo] = useState<string>(p.hero_video_url || '');
  const [products, setProducts] = useState<VoucherProduct[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Drag-to-fit hero crop: object-position (x/y in %) + zoom. Drag the
  // preview to choose the visible area; saved per page and applied 1:1 on
  // the public hero.
  const parsePos = (raw: any): { x: number; y: number; zoom: number } => {
    try {
      const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return {
        x: Math.min(100, Math.max(0, Number(v?.x ?? 50))),
        y: Math.min(100, Math.max(0, Number(v?.y ?? 25))),
        zoom: Math.min(2, Math.max(1, Number(v?.zoom ?? 1))),
      };
    } catch { return { x: 50, y: 25, zoom: 1 }; }
  };
  const [heroPos, setHeroPos] = useState(() => parsePos(p.hero_image_position));
  const posRef = useRef(heroPos);
  posRef.current = heroPos;
  const previewRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const startHeroDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    const rect = previewRef.current?.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const start = { ...posRef.current };
    const onMove = (ev: MouseEvent) => {
      if (!rect) return;
      // Dragging right shows more of the image's left side → x decreases.
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      setHeroPos({
        x: Math.min(100, Math.max(0, start.x - dx)),
        y: Math.min(100, Math.max(0, start.y - dy)),
        zoom: start.zoom,
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setDragging(false);
      saveField('hero_image_position', JSON.stringify(posRef.current));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const setZoom = (zoom: number) => {
    setHeroPos((prev) => ({ ...prev, zoom }));
  };
  const commitZoom = () => saveField('hero_image_position', JSON.stringify(posRef.current));

  useEffect(() => {
    fetch('/api/vouchers/products', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : []))
      .then(rows => setProducts(Array.isArray(rows) ? rows : (rows?.products || [])))
      .catch(() => {});
  }, []);

  // Persist a single page column (partial update — the editor's content save
  // doesn't touch these columns, so there's no clobber).
  const saveField = async (field: string, value: string | null) => {
    try {
      const res = await fetch(`/api/admin/landing-pages/${page.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast({ title: 'Saved', description: 'Setting updated.' });
    } catch {
      toast({ title: 'Save failed', description: 'Could not save the setting.', variant: 'destructive' });
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/image', { method: 'POST', credentials: 'include', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const url = data.url;
      setHeroImage(url);
      await saveField('hero_image_url', url);
    } catch {
      toast({ title: 'Upload failed', description: 'Could not upload the image.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-900">Page Settings</h3>

      <LandingPageInlineTextField
        label="Page Title"
        value={title}
        onChange={onTitleChange}
        placeholder="Landing page title"
      />

      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex justify-between"><span>Type</span><span className="font-medium text-gray-700">{page.page_type || 'Custom'}</span></div>
        {page.primary_service && <div className="flex justify-between"><span>Service</span><span className="font-medium text-gray-700">{page.primary_service}</span></div>}
        {page.city && <div className="flex justify-between"><span>City</span><span className="font-medium text-gray-700">{page.city}</span></div>}
        {page.target_audience && <div className="flex justify-between"><span>Audience</span><span className="font-medium text-gray-700 text-right max-w-[160px] truncate">{page.target_audience}</span></div>}
        {page.offer_summary && <div className="flex justify-between"><span>Offer</span><span className="font-medium text-gray-700 text-right max-w-[160px] truncate">{page.offer_summary}</span></div>}
      </div>

      {/* CTA → dynamic-priced voucher offer */}
      <div className="pt-4 border-t space-y-2">
        <Label className="text-xs font-semibold text-gray-700">Voucher offer — CTA price</Label>
        <div className="flex gap-2">
          <input
            type="number" min="0" step="1" value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            onBlur={() => saveField('cta_voucher_amount', offerAmount && Number(offerAmount) > 0 ? offerAmount : null)}
            placeholder="€ e.g. 225"
            className="w-24 border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text" value={offerTitle}
            onChange={(e) => setOfferTitle(e.target.value)}
            onBlur={() => saveField('cta_voucher_title', offerTitle || null)}
            placeholder="Offer title (defaults to page title)"
            className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <p className="text-xs text-gray-400">
          Set a price and the “Jetzt buchen” CTA sends buyers to personalise &amp; pay <b>exactly this amount</b>
          via Stripe (they download/print the voucher after). This overrides the product below.
        </p>
      </div>

      {/* CTA → Voucher product binding (fixed price; used only if no offer price above) */}
      <div className="pt-4 border-t space-y-2">
        <Label className="text-xs font-semibold text-gray-700">Voucher product (fixed-price alternative)</Label>
        <select
          value={voucherSlug}
          onChange={(e) => { setVoucherSlug(e.target.value); saveField('cta_voucher_slug', e.target.value || null); }}
          className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-purple-500"
        >
          <option value="">— Voucher list (/vouchers) —</option>
          {products.map(pr => (
            <option key={pr.id} value={pr.slug}>{pr.name} — €{Number(pr.price).toFixed(0)}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400">
          The CTA sends buyers straight to this product's personalize → Stripe checkout at its price.
          Manage products in <span className="font-medium">Online Voucher Sales</span>.
        </p>
      </div>

      {/* Hero media */}
      <div className="pt-4 border-t space-y-3">
        <Label className="text-xs font-semibold text-gray-700">Hero image</Label>
        {heroImage ? (
          // Miniature of the REAL hero (same crop + overlay + headline) that
          // is also the crop TOOL: drag the image to choose the visible area,
          // zoom with the slider. Saved per page, applied 1:1 on the public
          // hero.
          <div
            ref={previewRef}
            onMouseDown={startHeroDrag}
            className={`relative aspect-[5/2] rounded-md border overflow-hidden select-none ${dragging ? 'cursor-grabbing ring-2 ring-purple-400' : 'cursor-grab'}`}
          >
            <img
              src={heroImage}
              alt="Hero"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: `${heroPos.x}% ${heroPos.y}%`,
                transform: heroPos.zoom > 1 ? `scale(${heroPos.zoom})` : undefined,
                transformOrigin: `${heroPos.x}% ${heroPos.y}%`,
              }}
            />
            <div className="absolute inset-0 bg-black/55 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center px-3 pointer-events-none">
              <p className="text-white text-[10px] font-extrabold text-center leading-tight line-clamp-2">
                {((p as any).content_json?.hero?.headline as string) || p.hero_headline || 'Ihre Headline'}
              </p>
            </div>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => { setHeroImage(''); saveField('hero_image_url', null); }}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded"
            >Remove</button>
            <span className="absolute bottom-1 left-1 bg-black/50 text-white/80 text-[9px] px-1.5 py-0.5 rounded pointer-events-none">
              ✥ Ziehen zum Ausrichten
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-md text-gray-400">
            <ImageIcon className="h-5 w-5 mr-2" /> <span className="text-xs">No hero image</span>
          </div>
        )}
        {heroImage && (
          <div className="flex items-center gap-2">
            <Label className="text-[10px] text-gray-500 shrink-0">Zoom</Label>
            <input
              type="range"
              min={1}
              max={2}
              step={0.05}
              value={heroPos.zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              onMouseUp={commitZoom}
              onTouchEnd={commitZoom}
              className="w-full accent-purple-600"
            />
            <span className="text-[10px] text-gray-500 w-8 text-right">{heroPos.zoom.toFixed(2)}×</span>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
        <Button variant="outline" size="sm" className="w-full gap-2" disabled={uploading}
          onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Uploading…' : 'Upload hero image'}
        </Button>

        <LandingPageInlineTextField
          label="Hero video URL (optional — .mp4, YouTube or Vimeo)"
          value={heroVideo}
          onChange={setHeroVideo}
          placeholder="https://youtu.be/… or https://…/video.mp4"
        />
        <Button variant="outline" size="sm" className="w-full"
          onClick={() => saveField('hero_video_url', heroVideo || null)}>
          Save video URL
        </Button>
        <p className="text-xs text-gray-400">Plays muted &amp; looping behind the hero (a dark overlay keeps text readable). Paste a direct .mp4 link or a YouTube/Vimeo URL. Remember to Save.</p>
      </div>
    </div>
  );
}
