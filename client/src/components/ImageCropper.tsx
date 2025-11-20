import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

interface ImageCropperProps {
  file: File | null;
  onCancel: () => void;
  onCropped: (blob: Blob, previewUrl: string) => void;
  aspect?: number;
  circular?: boolean;
}

// Utility to create cropped image blob
async function getCroppedBlob(imageSrc: string, crop: { x: number; y: number }, zoom: number, area: { width: number; height: number, x: number, y: number }, outputWidth = 1400, outputHeight = 900): Promise<Blob> {
  const image: HTMLImageElement = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
  const canvas = document.createElement('canvas');
  // Scale output to desired width preserving aspect ratio of crop area
  const scale = outputWidth / area.width;
  canvas.width = outputWidth;
  canvas.height = Math.round(area.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');
  ctx.drawImage(
    image,
    area.x, // source x
    area.y, // source y
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.9);
  });
}

const ImageCropper: React.FC<ImageCropperProps> = ({ file, onCancel, onCropped, aspect = 14/9, circular }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const onCropComplete = useCallback((_area: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFinish = async () => {
    if (!imageUrl || !croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imageUrl, crop, zoom, croppedAreaPixels, 1400, 1400 / aspect);
      const previewUrl = URL.createObjectURL(blob);
      onCropped(blob, previewUrl);
    } catch (e) {
      console.error('[CROPPER] Failed to crop image', e);
      alert('Bild konnte nicht verarbeitet werden');
    } finally {
      setProcessing(false);
    }
  };

  if (!file || !imageUrl) return null;

  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 bg-black rounded-md overflow-hidden">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape={circular ? 'round' : 'rect'}
          showGrid={false}
        />
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 w-24">Zoom {zoom.toFixed(2)}x</span>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          disabled={processing}
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={handleFinish}
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
          disabled={processing}
        >
          {processing ? 'Verarbeite…' : 'Speichern & Hochladen'}
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
