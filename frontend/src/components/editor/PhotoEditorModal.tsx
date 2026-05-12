import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Crop, 
  RotateCw, 
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sun, 
  Contrast, 
  Droplet, 
  Zap,
  Sparkles,
  RefreshCw,
  Check,
  Grid,
  Maximize2,
  Minus,
  Plus,
  Save,
  Camera,
  Sliders,
  Palette,
  Move,
  Square,
  Image as ImageIcon,
  Undo2,
  Redo2,
  ChevronDown
} from 'lucide-react';

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: File | null;
  resumeId: string;
  onImageUpload: (imageUrl: string) => void;
}

type FilterType = 'none' | 'clarity' | 'hazyDays' | 'pinhole' | 'vintage' | 'mono' | 'warm' | 'cool';
type EditMode = 'transform' | 'crop' | 'adjust' | 'filters';
type AspectRatio = 'free' | 'square' | '3:4' | '4:3' | '1:1';

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

// Filter presets
const filterPresets = [
  { value: 'none', label: 'Original', filter: '', icon: '🖼️' },
  { value: 'clarity', label: 'Clarity', filter: 'contrast(1.2) brightness(1.1) saturate(1.1)', icon: '✨' },
  { value: 'vintage', label: 'Vintage', filter: 'sepia(0.4) contrast(1.1) brightness(0.95)', icon: '📷' },
  { value: 'mono', label: 'Mono', filter: 'grayscale(1) contrast(1.2)', icon: '⚫' },
  { value: 'warm', label: 'Warm', filter: 'sepia(0.2) brightness(1.05) saturate(1.1)', icon: '☀️' },
  { value: 'cool', label: 'Cool', filter: 'hue-rotate(10deg) brightness(1.05) saturate(0.9)', icon: '❄️' },
  { value: 'hazyDays', label: 'Hazy', filter: 'blur(0.5px) brightness(1.1) contrast(0.9)', icon: '🌫️' },
  { value: 'pinhole', label: 'Pinhole', filter: 'brightness(0.8) contrast(1.3) saturate(1.2)', icon: '🔍' }
];

// Aspect ratio options
const aspectRatios: { value: AspectRatio; label: string; ratio: number | null }[] = [
  { value: 'free', label: 'Free', ratio: null },
  { value: '1:1', label: '1:1 Square', ratio: 1 },
  { value: '3:4', label: '3:4 Portrait', ratio: 4/3 },
  { value: '4:3', label: '4:3 Landscape', ratio: 3/4 }
];

// Adjustment sliders
const adjustmentSliders = [
  { id: 'brightness', label: 'Brightness', icon: Sun, min: 50, max: 150, step: 1, unit: '%' },
  { id: 'contrast', label: 'Contrast', icon: Contrast, min: 50, max: 150, step: 1, unit: '%' },
  { id: 'saturation', label: 'Saturation', icon: Droplet, min: 0, max: 200, step: 1, unit: '%' },
  { id: 'exposure', label: 'Exposure', icon: Zap, min: 50, max: 150, step: 1, unit: '%' },
  { id: 'vibrance', label: 'Vibrance', icon: Sparkles, min: 0, max: 200, step: 1, unit: '%' },
  { id: 'sharpness', label: 'Sharpness', icon: Sliders, min: 0, max: 100, step: 1, unit: '' }
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
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4');
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<ImageTransform[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const [transform, setTransform] = useState<ImageTransform>({
    scale: 1, rotation: 0, flipX: false, flipY: false, filter: 'none',
    brightness: 100, contrast: 100, saturation: 100, exposure: 100, vibrance: 100, sharpness: 0
  });

  const [cropArea, setCropArea] = useState<CropArea>({ x: 40, y: 40, width: 200, height: 280 });

  // Add to history when transform changes
  useEffect(() => {
    if (historyIndex === -1) {
      setHistory([transform]);
      setHistoryIndex(0);
    } else {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(transform);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [transform]);

  // Initial load
  useEffect(() => {
    if (isOpen && selectedImage) {
      setLoading(true);
      const img = new Image();
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        if (canvas) {
          const canvasWidth = 300;
          const canvasHeight = 400;
          
          setCropArea({
            x: 30,
            y: 40,
            width: canvasWidth - 60,
            height: canvasHeight - 80
          });
        }
        setLoading(false);
      };
      img.src = URL.createObjectURL(selectedImage);
    }
  }, [isOpen, selectedImage]);

  const applyFilters = useCallback((ctx: CanvasRenderingContext2D) => {
    const filter = filterPresets.find(f => f.value === transform.filter);
    const filterArray = [];
    
    if (filter && filter.value !== 'none') {
      filterArray.push(filter.filter);
    }
    
    filterArray.push(`brightness(${transform.brightness}%)`);
    filterArray.push(`contrast(${transform.contrast}%)`);
    filterArray.push(`saturate(${transform.saturation}%)`);
    
    ctx.filter = filterArray.join(' ');
  }, [transform]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // White background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(
      transform.scale * (transform.flipX ? -1 : 1),
      transform.scale * (transform.flipY ? -1 : 1)
    );
    
    applyFilters(ctx);

    const imgAspect = image.width / image.height;
    const canvasAspect = canvas.width / canvas.height;
    let drawWidth, drawHeight;
    
    if (imgAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspect;
    }
    
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Draw crop overlay if in crop mode
    if (editMode === 'crop') {
      ctx.save();
      
      // Semi-transparent overlay outside crop area
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(0, 0, canvas.width, cropArea.y);
      ctx.fillRect(0, cropArea.y + cropArea.height, canvas.width, canvas.height - cropArea.y - cropArea.height);
      ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.height);
      ctx.fillRect(cropArea.x + cropArea.width, cropArea.y, canvas.width - cropArea.x - cropArea.width, cropArea.height);

      // Crop border
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

      // Grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.3)';
        ctx.lineWidth = 1;
        
        const thirdWidth = cropArea.width / 3;
        const thirdHeight = cropArea.height / 3;
        
        for (let i = 1; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(cropArea.x + i * thirdWidth, cropArea.y);
          ctx.lineTo(cropArea.x + i * thirdWidth, cropArea.y + cropArea.height);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(cropArea.x, cropArea.y + i * thirdHeight);
          ctx.lineTo(cropArea.x + cropArea.width, cropArea.y + i * thirdHeight);
          ctx.stroke();
        }
      }

      // Corner handles
      const handleSize = 6;
      const handles = [
        [cropArea.x, cropArea.y],
        [cropArea.x + cropArea.width, cropArea.y],
        [cropArea.x, cropArea.y + cropArea.height],
        [cropArea.x + cropArea.width, cropArea.y + cropArea.height]
      ];
      
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1.5;
      
      handles.forEach(([x, y]) => {
        ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.strokeRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
      });

      ctx.restore();
    }
  }, [image, transform, editMode, cropArea, showGrid, applyFilters]);

  useEffect(() => { 
    renderCanvas(); 
  }, [renderCanvas]);

  // Crop interaction handlers
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const getResizeHandle = (x: number, y: number): string | null => {
    const handleSize = 15;
    if (Math.abs(x - cropArea.x) < handleSize && Math.abs(y - cropArea.y) < handleSize) return 'nw';
    if (Math.abs(x - (cropArea.x + cropArea.width)) < handleSize && Math.abs(y - cropArea.y) < handleSize) return 'ne';
    if (Math.abs(x - cropArea.x) < handleSize && Math.abs(y - (cropArea.y + cropArea.height)) < handleSize) return 'sw';
    if (Math.abs(x - (cropArea.x + cropArea.width)) < handleSize && Math.abs(y - (cropArea.y + cropArea.height)) < handleSize) return 'se';
    if (x > cropArea.x && x < cropArea.x + cropArea.width && y > cropArea.y && y < cropArea.y + cropArea.height) return 'move';
    return null;
  };

  const handleCropMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editMode !== 'crop') return;
    const { x, y } = getCanvasCoordinates(e);
    
    const handle = getResizeHandle(x, y);
    if (handle) {
      setIsDragging(true);
      if (handle === 'move') {
        setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
      } else {
        setIsResizing(true);
        setResizeHandle(handle);
        setDragStart({ x, y });
      }
    }
  };

  const handleCropMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || editMode !== 'crop') return;
    const { x, y } = getCanvasCoordinates(e);

    if (isResizing && resizeHandle) {
      let newCrop = { ...cropArea };
      
      const aspect = aspectRatio !== 'free' 
        ? aspectRatios.find(r => r.value === aspectRatio)?.ratio 
        : null;

      if (resizeHandle.includes('e')) {
        newCrop.width = Math.max(30, x - cropArea.x);
        if (aspect) newCrop.height = newCrop.width * aspect;
      }
      if (resizeHandle.includes('w')) {
        const newWidth = Math.max(30, cropArea.x + cropArea.width - x);
        if (aspect) {
          const newHeight = newWidth * aspect;
          newCrop.y = cropArea.y + (cropArea.height - newHeight) / 2;
          newCrop.height = newHeight;
        }
        newCrop.x = x;
        newCrop.width = newWidth;
      }
      if (resizeHandle.includes('s')) {
        newCrop.height = Math.max(30, y - cropArea.y);
        if (aspect) newCrop.width = newCrop.height / aspect;
      }
      if (resizeHandle.includes('n')) {
        const newHeight = Math.max(30, cropArea.y + cropArea.height - y);
        if (aspect) {
          const newWidth = newHeight / aspect;
          newCrop.x = cropArea.x + (cropArea.width - newWidth) / 2;
          newCrop.width = newWidth;
        }
        newCrop.y = y;
        newCrop.height = newHeight;
      }

      setCropArea(newCrop);
    } else {
      setCropArea({
        x: Math.max(0, Math.min(x - dragStart.x, canvasRef.current!.width - cropArea.width)),
        y: Math.max(0, Math.min(y - dragStart.y, canvasRef.current!.height - cropArea.height)),
        width: cropArea.width,
        height: cropArea.height
      });
    }
  };

  const handleCropMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const applyCrop = () => {
    const canvas = canvasRef.current;
    const cropCanvas = cropCanvasRef.current;
    if (!canvas || !cropCanvas || cropArea.width < 10 || cropArea.height < 10) return;

    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    cropCanvas.width = cropArea.width;
    cropCanvas.height = cropArea.height;

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
      
      setTimeout(() => {
        if (canvasRef.current) {
          setCropArea({
            x: 30, y: 40,
            width: canvasRef.current.width - 60,
            height: canvasRef.current.height - 80
          });
        }
      }, 100);
    };
    croppedImg.src = cropCanvas.toDataURL('image/png', 0.95);
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 25));

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTransform(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTransform(history[historyIndex + 1]);
    }
  };

  const handleReset = () => {
    setTransform({
      scale: 1, rotation: 0, flipX: false, flipY: false, filter: 'none',
      brightness: 100, contrast: 100, saturation: 100, exposure: 100, vibrance: 100, sharpness: 0
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onImageUpload(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <canvas ref={cropCanvasRef} className="hidden" />
      
      <div 
        ref={containerRef} 
        className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-gray-600" />
            <h2 className="text-sm font-medium text-gray-700">Edit Photo</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="w-3/5 bg-gray-50 flex items-center justify-center p-4">
            <div className="relative">
              {/* Zoom controls */}
              <div className="absolute -top-3 right-0 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm z-10">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-l-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-gray-600 min-w-[45px] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Canvas container */}
              <div className="overflow-auto max-w-full max-h-[60vh] bg-white rounded-lg shadow-sm border border-gray-200">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleCropMouseDown}
                  onMouseMove={handleCropMouseMove}
                  onMouseUp={handleCropMouseUp}
                  onMouseLeave={handleCropMouseUp}
                  className={`block ${
                    editMode === 'crop' ? 'cursor-move' : 'cursor-default'
                  }`}
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                    width: '300px',
                    height: '400px'
                  }}
                />
              </div>

              {/* Image dimensions */}
              {image && (
                <div className="absolute -bottom-6 left-0 text-xs text-gray-400">
                  {image.width} × {image.height}
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-2/5 bg-white border-l border-gray-200 overflow-y-auto">
            {/* Mode Tabs */}
            <div className="p-3 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-1 bg-gray-100 rounded-lg p-0.5">
                {[
                  { mode: 'transform', icon: Move, label: 'Transform' },
                  { mode: 'crop', icon: Crop, label: 'Crop' },
                  { mode: 'adjust', icon: Sliders, label: 'Adjust' },
                  { mode: 'filters', icon: Palette, label: 'Filters' }
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setEditMode(mode as EditMode)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                      editMode === mode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Content */}
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Transform Mode */}
                  {editMode === 'transform' && (
                    <div className="space-y-4">
                      {/* Scale */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-medium text-gray-600">Scale</label>
                          <span className="text-xs text-gray-500">{Math.round(transform.scale * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.01"
                          value={transform.scale}
                          onChange={(e) => setTransform(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      {/* Rotation */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Rotation</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => setTransform(prev => ({ ...prev, rotation: prev.rotation - 90 }))}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-800 transition-colors text-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            -90°
                          </button>
                          <button
                            onClick={() => setTransform(prev => ({ ...prev, rotation: prev.rotation + 90 }))}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-800 transition-colors text-xs"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            +90°
                          </button>
                          <button
                            onClick={() => setTransform(prev => ({ ...prev, rotation: 0 }))}
                            className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-800 transition-colors text-xs"
                          >
                            Reset
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                          <button
                            onClick={() => setTransform(prev => ({ ...prev, flipX: !prev.flipX }))}
                            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs transition-colors ${
                              transform.flipX
                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                          >
                            <FlipHorizontal className="w-3.5 h-3.5" />
                            Flip H
                          </button>
                          <button
                            onClick={() => setTransform(prev => ({ ...prev, flipY: !prev.flipY }))}
                            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs transition-colors ${
                              transform.flipY
                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                          >
                            <FlipVertical className="w-3.5 h-3.5" />
                            Flip V
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Crop Mode */}
                  {editMode === 'crop' && (
                    <div className="space-y-4">
                      {/* Aspect Ratio */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Aspect Ratio</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {aspectRatios.map(ar => (
                            <button
                              key={ar.value}
                              onClick={() => setAspectRatio(ar.value)}
                              className={`py-1.5 px-2 rounded-md text-xs transition-colors ${
                                aspectRatio === ar.value
                                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                              }`}
                            >
                              {ar.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Grid Toggle */}
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-600">Show Grid</label>
                        <button
                          onClick={() => setShowGrid(!showGrid)}
                          className={`p-1.5 rounded-md transition-colors ${
                            showGrid ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <Grid className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Crop Info */}
                      <div className="bg-gray-50 rounded-md p-2">
                        <p className="text-xs text-gray-500">
                          {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
                        </p>
                      </div>

                      {/* Apply Crop */}
                      <button
                        onClick={applyCrop}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        Apply Crop
                      </button>
                    </div>
                  )}

                  {/* Adjust Mode */}
                  {editMode === 'adjust' && (
                    <div className="space-y-4">
                      {adjustmentSliders.map(slider => (
                        <div key={slider.id}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <slider.icon className="w-3.5 h-3.5 text-gray-500" />
                              <label className="text-xs font-medium text-gray-600">{slider.label}</label>
                            </div>
                            <span className="text-xs text-gray-500">
                              {transform[slider.id as keyof ImageTransform]}{slider.unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={slider.min}
                            max={slider.max}
                            step={slider.step}
                            value={transform[slider.id as keyof ImageTransform] as number}
                            onChange={(e) => setTransform(prev => ({
                              ...prev,
                              [slider.id]: parseFloat(e.target.value)
                            }))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                      ))}

                      {/* Reset Adjustments */}
                      <button
                        onClick={() => {
                          setTransform(prev => ({
                            ...prev,
                            brightness: 100,
                            contrast: 100,
                            saturation: 100,
                            exposure: 100,
                            vibrance: 100,
                            sharpness: 0
                          }));
                        }}
                        className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset
                      </button>
                    </div>
                  )}

                  {/* Filters Mode */}
                  {editMode === 'filters' && (
                    <div className="grid grid-cols-2 gap-2">
                      {filterPresets.map(filter => (
                        <button
                          key={filter.value}
                          onClick={() => setTransform(prev => ({ ...prev, filter: filter.value as FilterType }))}
                          className={`p-3 rounded-md border transition-all ${
                            transform.filter === filter.value
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-lg mb-1">{filter.icon}</div>
                          <div className="text-xs font-medium text-gray-700">{filter.label}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset all
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}