import React, { useState, useRef, useEffect, useCallback } from 'react';

// ... (Interfaces and Constants remain the same as your original)
interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: File | null;
  resumeId: string;
  onImageUpload: (imageUrl: string) => void;
}

type FilterType = 'none' | 'clarity' | 'hazyDays' | 'pinhole' | 'vintage' | 'mono' | 'warm' | 'cool';
type EditMode = 'transform' | 'crop' | 'adjust' | 'filters';
type ToolType = 'crop' | 'rotate' | 'flip' | 'reset';

interface ImageTransform {
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  filter: FilterType;
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  vibrance: number;
  sharpness: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const filters = [
  { value: 'none', label: 'Original', preview: 'bg-gradient-to-br from-gray-100 to-gray-300' },
  { value: 'clarity', label: 'Clarity', preview: 'bg-gradient-to-br from-blue-50 to-blue-100' },
  { value: 'vintage', label: 'Vintage', preview: 'bg-gradient-to-br from-amber-50 to-amber-100' },
  { value: 'mono', label: 'Mono', preview: 'bg-gradient-to-br from-gray-200 to-gray-400' },
  { value: 'warm', label: 'Warm', preview: 'bg-gradient-to-br from-orange-50 to-amber-100' },
  { value: 'cool', label: 'Cool', preview: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
  { value: 'hazyDays', label: 'Hazy', preview: 'bg-gradient-to-br from-gray-50 to-gray-200' },
  { value: 'pinhole', label: 'Pinhole', preview: 'bg-gradient-to-br from-gray-900 to-gray-700' }
];

const tools: { id: ToolType; label: string; icon: string }[] = [
  { id: 'crop', label: 'Crop', icon: '✂' },
  { id: 'rotate', label: 'Rotate', icon: '↻' },
  { id: 'flip', label: 'Flip', icon: '⇄' },
  { id: 'reset', label: 'Reset All', icon: '↺' }
];

export default function PhotoEditorModal({
  isOpen,
  onClose,
  selectedImage,
  resumeId,
  onImageUpload
}: PhotoEditorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>('transform');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropType, setCropType] = useState<'free' | 'square' | '3.5:4.5'>('3.5:4.5');
  const [showGrid, setShowGrid] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  
  const [transform, setTransform] = useState<ImageTransform>({
    scale: 1, rotation: 0, flipX: false, flipY: false, filter: 'none',
    brightness: 100, contrast: 100, saturation: 100, exposure: 100, vibrance: 100, sharpness: 0
  });

  const [cropArea, setCropArea] = useState<CropArea>({ x: 40, y: 40, width: 200, height: 280 });

  // Initial load
  useEffect(() => {
    if (isOpen && selectedImage) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setTransform(prev => ({ ...prev, scale: 1 }));
      };
      img.src = URL.createObjectURL(selectedImage);
    }
  }, [isOpen, selectedImage]);

  const applyFiltersToCtx = (ctx: CanvasRenderingContext2D) => {
    const filterArray = [];
    if (transform.filter === 'clarity') filterArray.push('contrast(1.2) brightness(1.1)');
    if (transform.filter === 'vintage') filterArray.push('sepia(0.4) contrast(1.1)');
    if (transform.filter === 'mono') filterArray.push('grayscale(1)');
    
    filterArray.push(`brightness(${transform.brightness}%)`);
    filterArray.push(`contrast(${transform.contrast}%)`);
    filterArray.push(`saturate(${transform.saturation}%)`);
    ctx.filter = filterArray.join(' ');
  };

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal resolution for the "Work Area"
    canvas.width = 280;
    canvas.height = 360;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.scale * (transform.flipX ? -1 : 1), transform.scale * (transform.flipY ? -1 : 1));
    applyFiltersToCtx(ctx);

    const imgAspect = image.width / image.height;
    const canvasAspect = canvas.width / canvas.height;
    let dw, dh;
    if (imgAspect > canvasAspect) {
      dw = canvas.width;
      dh = canvas.width / imgAspect;
    } else {
      dh = canvas.height;
      dw = canvas.height * imgAspect;
    }
    ctx.drawImage(image, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();

    // Draw Crop Overlay
    if (editMode === 'crop') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      // Dim outside areas
      ctx.fillRect(0, 0, canvas.width, cropArea.y); // top
      ctx.fillRect(0, cropArea.y + cropArea.height, canvas.width, canvas.height); // bottom
      ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.height); // left
      ctx.fillRect(cropArea.x + cropArea.width, cropArea.y, canvas.width, cropArea.width); // right

      ctx.strokeStyle = '#0660a9';
      ctx.lineWidth = 2;
      ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    }
  }, [image, transform, editMode, cropArea]);

  useEffect(() => { renderCanvas(); }, [renderCanvas]);

  // CROP LOGIC
  const handleCropMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editMode !== 'crop') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setIsDragging(true);
    setDragStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handleCropMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || editMode !== 'crop') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const currentY = (e.clientY - rect.top) * (canvas.height / rect.height);

    let width = currentX - dragStart.x;
    let height = currentY - dragStart.y;

    if (cropType === 'square') {
      const side = Math.max(Math.abs(width), Math.abs(height));
      width = width > 0 ? side : -side;
      height = height > 0 ? side : -side;
    } else if (cropType === '3.5:4.5') {
      const ratio = 4.5 / 3.5;
      height = width * ratio;
    }

    setCropArea({
      x: width > 0 ? dragStart.x : dragStart.x + width,
      y: height > 0 ? dragStart.y : dragStart.y + height,
      width: Math.abs(width),
      height: Math.abs(height)
    });
  };

  const applyCrop = () => {
    const canvas = canvasRef.current;
    const cropCanvas = cropCanvasRef.current;
    if (!canvas || !cropCanvas || cropArea.width < 5) return;

    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    cropCanvas.width = cropArea.width;
    cropCanvas.height = cropArea.height;

    // Capture what is CURRENTLY visible in the crop box on the main canvas
    cropCtx.drawImage(
      canvas,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, cropArea.width, cropArea.height
    );

    const croppedImg = new Image();
    croppedImg.onload = () => {
      setImage(croppedImg);
      setTransform(prev => ({ ...prev, scale: 1, rotation: 0, flipX: false, flipY: false }));
      setEditMode('transform');
    };
    croppedImg.src = cropCanvas.toDataURL('image/jpeg', 0.9);
    setIsDragging(false);
  };

  const handleSetAsCVPhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onImageUpload(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
      <canvas ref={cropCanvasRef} className="hidden" />
      <div ref={containerRef} className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Photo Editor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
          {/* Canvas Area */}
          <div className="lg:w-7/12 bg-gray-950 rounded-xl flex items-center justify-center relative">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCropMouseDown}
              onMouseMove={handleCropMouseMove}
              onMouseUp={() => setIsDragging(false)}
              className={`max-w-full max-h-full shadow-2xl ${editMode === 'crop' ? 'cursor-crosshair' : 'cursor-default'}`}
            />
          </div>

          {/* Controls Area */}
          <div className="lg:w-5/12 flex flex-col gap-4 overflow-y-auto">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {(['transform', 'crop', 'adjust', 'filters'] as EditMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setEditMode(mode)}
                  className={`flex-1 py-2 text-xs font-medium rounded ${editMode === mode ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 flex-1">
              {editMode === 'transform' && (
                <div className="space-y-4">
                   <p className="text-xs text-gray-400">Zoom</p>
                   <input 
                    type="range" min="0.1" max="3" step="0.01" value={transform.scale} 
                    onChange={(e) => setTransform(prev => ({...prev, scale: parseFloat(e.target.value)}))}
                    className="w-full"
                   />
                   <div className="flex gap-2">
                     <button onClick={() => setTransform(prev => ({...prev, rotation: prev.rotation - 90}))} className="bg-gray-700 p-2 rounded text-xs text-white">Rotate Left</button>
                     <button onClick={() => setTransform(prev => ({...prev, rotation: prev.rotation + 90}))} className="bg-gray-700 p-2 rounded text-xs text-white">Rotate Right</button>
                   </div>
                </div>
              )}

              {editMode === 'crop' && (
                <div className="space-y-4 text-white">
                  <div className="grid grid-cols-3 gap-2">
                    {['free', 'square', '3.5:4.5'].map(t => (
                      <button key={t} onClick={() => setCropType(t as any)} className={`p-2 text-xs rounded ${cropType === t ? 'bg-blue-600' : 'bg-gray-700'}`}>{t}</button>
                    ))}
                  </div>
                  <button onClick={applyCrop} className="w-full py-3 bg-green-600 rounded-lg font-bold">Apply Crop Selection</button>
                </div>
              )}

              {editMode === 'filters' && (
                <div className="grid grid-cols-4 gap-2">
                  {filters.map(f => (
                    <button 
                      key={f.value} 
                      onClick={() => setTransform(prev => ({...prev, filter: f.value as any}))}
                      className={`aspect-square rounded ${f.preview} ${transform.filter === f.value ? 'ring-2 ring-blue-500' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400">Cancel</button>
          <button onClick={handleSetAsCVPhoto} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Save Final Photo</button>
        </div>
      </div>
    </div>
  );
}