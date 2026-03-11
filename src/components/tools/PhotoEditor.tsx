import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Image as ImageIcon, Download, Sparkles, Wand2, Scissors, Type, 
  Palette, Sun, Contrast, Droplets, RotateCcw, Layers, MousePointer2, 
  Square, Circle, Trash2, Eye, EyeOff, Plus, PenTool, Layout, FileJson, FileText, FileImage, Loader2, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage, Layer, Image as KonvaImage, Text, Rect, Circle as KonvaCircle, Line, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { jsPDF } from 'jspdf';

type LayerType = 'image' | 'text' | 'shape' | 'drawing';

interface EditorLayer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  src?: string; // for image
  text?: string; // for text
  fontSize?: number;
  fill?: string; // for text/shape/drawing
  shapeType?: 'rect' | 'circle'; // for shape
  points?: number[]; // for drawing
  brightness?: number;
  contrast?: number;
  saturation?: number;
  blur?: number;
}

const URLImage = ({ layer, isSelected, onSelect, onChange }: { 
  layer: EditorLayer; 
  isSelected: boolean; 
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
}) => {
  const [img] = useImage(layer.src || '');
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.cache();
    }
  }, [img, layer.brightness, layer.contrast, layer.saturation, layer.blur]);

  const filters = [];
  if (layer.brightness !== undefined) filters.push(Konva.Filters.Brighten);
  if (layer.contrast !== undefined) filters.push(Konva.Filters.Contrast);
  if (layer.saturation !== undefined) filters.push(Konva.Filters.HSV);
  if (layer.blur !== undefined) filters.push(Konva.Filters.Blur);

  return (
    <React.Fragment>
      <KonvaImage
        image={img}
        id={layer.id}
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        rotation={layer.rotation}
        scaleX={layer.scaleX}
        scaleY={layer.scaleY}
        opacity={layer.opacity}
        visible={layer.visible}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable
        filters={filters}
        brightness={((layer.brightness || 100) - 100) / 100}
        contrast={(layer.contrast || 100) - 100}
        saturation={((layer.saturation || 100) - 100) / 100}
        blurRadius={layer.blur || 0}
        onDragEnd={(e) => {
          onChange({
            ...layer,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...layer,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default function PhotoEditor() {
  const [layers, setLayers] = useState<EditorLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'brush' | 'text' | 'rect' | 'circle'>('select');
  const [activeTab, setActiveTab] = useState<'layers' | 'adjust' | 'collage'>('layers');
  const [stageSize, setStageSize] = useState({ width: 500, height: 500 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#10b981');
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setStageSize({ width: clientWidth, height: clientHeight });
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLayer: EditorLayer = {
          id: `layer-${Date.now()}`,
          type: 'image',
          src: reader.result as string,
          x: 50,
          y: 50,
          width: 300,
          height: 300,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          visible: true,
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0
        };
        setLayers([...layers, newLayer]);
        setSelectedId(newLayer.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: any) => {
    if (tool !== 'brush') return;
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    const newLayer: EditorLayer = {
      id: `layer-${Date.now()}`,
      type: 'drawing',
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      points: [pos.x, pos.y],
      fill: brushColor,
    };
    setLayers([...layers, newLayer]);
    setSelectedId(newLayer.id);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || tool !== 'brush') return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLayer = layers[layers.length - 1];
    if (lastLayer.type === 'drawing' && lastLayer.points) {
      const newPoints = lastLayer.points.concat([point.x, point.y]);
      const newLayers = layers.slice(0, layers.length - 1).concat([{
        ...lastLayer,
        points: newPoints
      }]);
      setLayers(newLayers);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const updateLayer = (id: string, newAttrs: any) => {
    setLayers(layers.map(l => l.id === id ? { ...l, ...newAttrs } : l));
  };

  const deleteLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDownload = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!stageRef.current) return;
    
    setIsDownloading(true);
    setShowDownloadMenu(false);

    try {
      // Deselect before exporting
      setSelectedId(null);
      // Wait a bit for the transformer to disappear
      await new Promise(resolve => setTimeout(resolve, 100));

      const stage = stageRef.current;
      const fileName = `edited-photo-${Date.now()}`;

      if (format === 'pdf') {
        const dataUrl = stage.toDataURL({ pixelRatio: 2 });
        const pdf = new jsPDF({
          orientation: stage.width() > stage.height() ? 'landscape' : 'portrait',
          unit: 'px',
          format: [stage.width(), stage.height()]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, stage.width(), stage.height());
        pdf.save(`${fileName}.pdf`);
      } else {
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = stage.toDataURL({ 
          pixelRatio: 2,
          mimeType: mimeType,
          quality: 0.95
        });
        const link = document.createElement('a');
        link.download = `${fileName}.${format}`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedLayer = layers.find(l => l.id === selectedId);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            PicsArt Pro <Sparkles size={18} className="text-emerald-400" />
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setLayers([])}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            title="Reset All"
          >
            <RotateCcw size={20} />
          </button>
          
          <div className="relative" ref={downloadMenuRef}>
            <button 
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              disabled={isDownloading || layers.length === 0}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Export
              <ChevronDown size={14} className={`transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
                >
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleDownload('png')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/5 rounded-xl transition-colors text-left"
                    >
                      <FileImage size={18} className="text-emerald-400" />
                      <div>
                        <p>Download PNG</p>
                        <p className="text-[10px] text-white/40">Best for web & graphics</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDownload('jpg')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/5 rounded-xl transition-colors text-left"
                    >
                      <ImageIcon size={18} className="text-blue-400" />
                      <div>
                        <p>Download JPG</p>
                        <p className="text-[10px] text-white/40">Smaller file size</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDownload('pdf')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/5 rounded-xl transition-colors text-left"
                    >
                      <FileText size={18} className="text-rose-400" />
                      <div>
                        <p>Download PDF</p>
                        <p className="text-[10px] text-white/40">Best for printing</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-slate-900 border-r border-white/10 flex flex-col items-center py-6 gap-6">
          {[
            { id: 'select', icon: <MousePointer2 size={20} />, label: 'Select' },
            { id: 'brush', icon: <PenTool size={20} />, label: 'Brush' },
            { id: 'text', icon: <Type size={20} />, label: 'Text' },
            { id: 'rect', icon: <Square size={20} />, label: 'Rect' },
            { id: 'circle', icon: <Circle size={20} />, label: 'Circle' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as any)}
              className={`p-3 rounded-xl transition-all relative group ${tool === t.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {t.icon}
              <span className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {t.label}
              </span>
            </button>
          ))}
          <div className="mt-auto flex flex-col gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-emerald-400 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onClick={checkDeselect}
            ref={stageRef}
            className="bg-slate-900 shadow-2xl"
          >
            <Layer>
              {layers.map((layer) => {
                if (layer.type === 'image') {
                  return (
                    <URLImage
                      key={layer.id}
                      layer={layer}
                      isSelected={layer.id === selectedId}
                      onSelect={() => setSelectedId(layer.id)}
                      onChange={(newAttrs) => updateLayer(layer.id, newAttrs)}
                    />
                  );
                }
                if (layer.type === 'drawing') {
                  return (
                    <Line
                      key={layer.id}
                      points={layer.points}
                      stroke={layer.fill}
                      strokeWidth={5}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation="source-over"
                      opacity={layer.opacity}
                      visible={layer.visible}
                      onClick={() => setSelectedId(layer.id)}
                    />
                  );
                }
                if (layer.type === 'text') {
                  return (
                    <Text
                      key={layer.id}
                      id={layer.id}
                      text={layer.text}
                      x={layer.x}
                      y={layer.y}
                      fill={layer.fill}
                      fontSize={layer.fontSize}
                      draggable
                      onClick={() => setSelectedId(layer.id)}
                      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>

          {layers.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                <ImageIcon size={40} className="text-white/20" />
              </div>
              <p className="text-white/40 text-sm font-medium">Start by adding an image or drawing</p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-72 bg-slate-900 border-l border-white/10 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'layers', icon: <Layers size={16} />, label: 'Layers' },
              { id: 'adjust', icon: <Sun size={16} />, label: 'Adjust' },
              { id: 'collage', icon: <Layout size={16} />, label: 'Collage' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/5' : 'text-white/40 hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'layers' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Layers</h3>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{layers.length}</span>
                </div>
                {layers.slice().reverse().map((layer) => (
                  <div 
                    key={layer.id}
                    onClick={() => setSelectedId(layer.id)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${selectedId === layer.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <div className="w-8 h-8 bg-black/20 rounded flex items-center justify-center text-xs">
                      {layer.type === 'image' ? <ImageIcon size={14} /> : layer.type === 'drawing' ? <PenTool size={14} /> : <Type size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{layer.type === 'image' ? 'Image Layer' : layer.type === 'drawing' ? 'Drawing' : 'Text Layer'}</p>
                      <p className="text-[10px] text-white/40">ID: {layer.id.split('-')[1]}</p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"
                      >
                        {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg text-white/40 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'adjust' && selectedLayer && selectedLayer.type === 'image' && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Image Adjustments</h3>
                {[
                  { id: 'brightness', label: 'Brightness', icon: <Sun size={14} />, min: 0, max: 200 },
                  { id: 'contrast', label: 'Contrast', icon: <Contrast size={14} />, min: 0, max: 200 },
                  { id: 'saturation', label: 'Saturation', icon: <Droplets size={14} />, min: 0, max: 200 },
                  { id: 'blur', label: 'Blur', icon: <Sparkles size={14} />, min: 0, max: 20 },
                ].map(adj => (
                  <div key={adj.id} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase tracking-widest">
                      <span className="flex items-center gap-2">{adj.icon} {adj.label}</span>
                      <span>{(selectedLayer as any)[adj.id]}%</span>
                    </div>
                    <input 
                      type="range" min={adj.min} max={adj.max} value={(selectedLayer as any)[adj.id]} 
                      onChange={(e) => updateLayer(selectedId!, { [adj.id]: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Opacity</h3>
                  <input 
                    type="range" min="0" max="1" step="0.01" value={selectedLayer.opacity} 
                    onChange={(e) => updateLayer(selectedId!, { opacity: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'collage' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Collage Layouts</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'grid2', label: '2 Grid', icon: <Layout size={20} /> },
                    { id: 'grid4', label: '4 Grid', icon: <Layout size={20} /> },
                  ].map(layout => (
                    <button
                      key={layout.id}
                      className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all flex flex-col items-center gap-2"
                    >
                      {layout.icon}
                      <span className="text-[10px] font-bold uppercase">{layout.label}</span>
                    </button>
                  ))}
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl mt-4">
                  <p className="text-[10px] text-emerald-400 font-bold leading-relaxed">
                    Pro Tip: Add multiple images and use the "Layers" tab to arrange them into a collage!
                  </p>
                </div>
              </div>
            )}

            {!selectedLayer && activeTab === 'adjust' && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40">
                <MousePointer2 size={32} className="mb-2" />
                <p className="text-xs font-medium">Select a layer to adjust its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
}
