import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Wand2, Loader2, CheckCircle, AlertCircle, Camera, Eye, Tag } from 'lucide-react';

// Idea-mode editor panel: the photo-first workflow for a blog post in IDEA status.
//   1. Upload up to 5 images   -> POST /api/blog/idea/:id/images   (B2 + EXIF)
//   2. Add context + consent   -> PUT  /api/blog/idea/:id/context
//   3. Analyse images          -> POST /api/blog/idea/:id/analyze  (Vision + IPTC)
//   4. Generate draft          -> POST /api/blog/idea/:id/generate (IDEA -> DRAFT)

interface IdeaImage {
  url?: string;
  exif?: { make?: string; model?: string; lensModel?: string; fNumber?: number; iso?: number; focalLength?: number } | null;
  vision?: { description?: string; altText?: string; sceneKeywords?: string[]; mood?: string } | null;
  altText?: string;
  iptcWritten?: boolean;
}
interface IdeaContext { location?: string; timing?: string; people?: string; celebration?: string; commentary?: string; }
interface IdeaData { images?: IdeaImage[]; context?: IdeaContext; consent?: { given?: boolean }; }

interface Props {
  postId: string;
  title: string;
  pillar?: string;
  initialIdea?: IdeaData | null;
  onGenerated?: () => void;
}

const getAdminToken = () => (typeof window !== 'undefined' ? (localStorage.getItem('ADMIN_TOKEN') || '') : '');

const IdeaModePanel: React.FC<Props> = ({ postId, title, pillar, initialIdea, onGenerated }) => {
  const [images, setImages] = useState<IdeaImage[]>(initialIdea?.images || []);
  const [ctx, setCtx] = useState<IdeaContext>(initialIdea?.context || {});
  const [consent, setConsent] = useState<boolean>(!!initialIdea?.consent?.given);
  const [busy, setBusy] = useState<'' | 'upload' | 'context' | 'analyze' | 'generate'>('');
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const analyzedCount = images.filter(i => i.vision).length;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    if (images.length + files.length > 5) { setError('Maximal 5 Bilder pro Beitrag.'); return; }
    setBusy('upload'); setError(null);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('images', f));
      const res = await fetch(`/api/blog/idea/${postId}/images`, {
        method: 'POST', headers: { 'x-admin-token': getAdminToken() }, body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload fehlgeschlagen');
      setImages(data.images || []);
    } catch (err: any) { setError(err.message); } finally { setBusy(''); (e.target as HTMLInputElement).value = ''; }
  };

  const saveContext = async () => {
    setBusy('context'); setError(null); setSavedMsg(null);
    try {
      const res = await fetch(`/api/blog/idea/${postId}/context`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': getAdminToken() },
        body: JSON.stringify({ context: ctx, consent: { given: consent } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Speichern fehlgeschlagen');
      setSavedMsg('Kontext gespeichert.');
    } catch (err: any) { setError(err.message); } finally { setBusy(''); }
  };

  const analyze = async () => {
    setBusy('analyze'); setError(null);
    try {
      const res = await fetch(`/api/blog/idea/${postId}/analyze`, {
        method: 'POST', headers: { 'x-admin-token': getAdminToken() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analyse fehlgeschlagen');
      setImages(data.images || []);
    } catch (err: any) { setError(err.message); } finally { setBusy(''); }
  };

  const generate = async () => {
    if (!consent) { setError('Bitte bestätige die Einwilligung, bevor du den Entwurf erzeugst.'); return; }
    setBusy('generate'); setError(null);
    try {
      // persist latest context/consent first
      await fetch(`/api/blog/idea/${postId}/context`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': getAdminToken() },
        body: JSON.stringify({ context: ctx, consent: { given: consent } }),
      });
      const res = await fetch(`/api/blog/idea/${postId}/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': getAdminToken() },
        body: JSON.stringify({ pillar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generierung fehlgeschlagen');
      onGenerated ? onGenerated() : window.location.reload();
    } catch (err: any) { setError(err.message); setBusy(''); }
  };

  const field = (label: string, key: keyof IdeaContext, placeholder: string, area = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {area ? (
        <textarea value={ctx[key] || ''} onChange={e => setCtx({ ...ctx, [key]: e.target.value })}
          rows={2} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
      ) : (
        <input value={ctx[key] || ''} onChange={e => setCtx({ ...ctx, [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center text-purple-800 font-medium"><Wand2 size={18} className="mr-2" /> Idee-Modus</div>
        <p className="text-sm text-purple-700 mt-1">
          Lade bis zu 5 Fotos hoch, ergänze Kontext und lass den Artikel daraus schreiben.
          Reihenfolge: Fotos → Kontext → Analysieren → Entwurf erzeugen. Thema: <strong>{title}</strong>
        </p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"><AlertCircle className="h-5 w-5 mr-2 mt-0.5" /><span>{error}</span></div>}
      {savedMsg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">{savedMsg}</div>}

      {/* 1. Images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold flex items-center mb-3"><ImageIcon size={18} className="mr-2" /> 1. Fotos ({images.length}/5)</h3>
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {images.map((img, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                {img.url && <img src={img.url} alt={img.altText || ''} className="w-full h-32 object-cover" />}
                <div className="p-2 space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-gray-600"><Camera size={12} />{img.exif?.model || img.exif?.make || 'keine Kameradaten'}</div>
                  <div className={`flex items-center gap-1 ${img.vision ? 'text-green-600' : 'text-gray-400'}`}><Eye size={12} />{img.vision ? 'analysiert' : 'nicht analysiert'}</div>
                  <div className={`flex items-center gap-1 ${img.iptcWritten ? 'text-green-600' : 'text-gray-400'}`}><Tag size={12} />{img.iptcWritten ? 'IPTC gesetzt' : 'kein IPTC'}</div>
                  {img.altText && <div className="text-gray-500 truncate" title={img.altText}>„{img.altText}"</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        {images.length < 5 && (
          <label className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm">
            {busy === 'upload' ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
            Fotos hochladen
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={busy === 'upload'} />
          </label>
        )}
      </div>

      {/* 2. Context + consent */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold">2. Kontext (Fakten – das Wichtigste für gute Texte)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Ort', 'location', 'z.B. Tageslichtstudio Wien-Margareten')}
          {field('Zeit / Jahreszeit', 'timing', 'z.B. Frühlingsnachmittag')}
          {field('Personen / Namen', 'people', 'z.B. Familie M. mit zwei Kindern')}
          {field('Anlass', 'celebration', 'z.B. erstes Familienshooting')}
        </div>
        {field('Kommentar / besondere Momente', 'commentary', 'Was war besonders? Stimmung, Details …', true)}
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" />
          <span><strong>Einwilligung (DSGVO):</strong> Mir liegt die Zustimmung der abgebildeten Personen zur Veröffentlichung dieser Fotos (und genannter Namen) vor.</span>
        </label>
        <button type="button" onClick={saveContext} disabled={busy === 'context'}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50">
          {busy === 'context' ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null} Kontext speichern
        </button>
      </div>

      {/* 3. Analyse + generate */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <button type="button" onClick={analyze} disabled={busy === 'analyze' || images.length === 0}
          className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 flex items-center">
          {busy === 'analyze' ? <Loader2 size={16} className="animate-spin mr-2" /> : <Eye size={16} className="mr-2" />}
          3. Bilder analysieren {analyzedCount > 0 && `(${analyzedCount}/${images.length})`}
        </button>
        <button type="button" onClick={generate} disabled={busy === 'generate' || analyzedCount === 0 || !consent}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center">
          {busy === 'generate' ? <Loader2 size={16} className="animate-spin mr-2" /> : <Wand2 size={16} className="mr-2" />}
          4. Entwurf erzeugen
        </button>
        <span className="text-xs text-gray-500">
          {analyzedCount === 0 ? 'Erst Bilder analysieren.' : !consent ? 'Einwilligung erforderlich.' : 'Erzeugt den Artikel und wechselt zu „Entwurf".'}
        </span>
      </div>
    </div>
  );
};

export default IdeaModePanel;
