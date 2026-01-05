
import React, { useState, useRef } from 'react';
import Canvas from './Canvas';
import { Layer, CanvasConfig } from '../types';
import { X, Printer, Settings, Move, Grid, RotateCw, Smartphone, Monitor } from 'lucide-react';

interface PrintSheetProps {
  queue: { id: string; layers: Layer[] }[];
  config: CanvasConfig;
  onClose: () => void;
  onPrint: () => void;
  onRemoveFromQueue: (index: number) => void;
  onReorderQueue: (newQueue: { id: string; layers: Layer[] }[]) => void;
}

const PrintSheet: React.FC<PrintSheetProps> = ({ queue, config, onClose, onPrint, onRemoveFromQueue, onReorderQueue }) => {
  // --- LAYOUT STATE ---
  const [marginTop, setMarginTop] = useState(25); // px
  const [marginLeft, setMarginLeft] = useState(25); // px
  const [gapX, setGapX] = useState(10); // px
  const [gapY, setGapY] = useState(10); // px
  const [scale, setScale] = useState(0.42); // Adjusts label size
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // --- DRAG AND DROP STATE ---
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
      setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;
      
      const newQueue = [...queue];
      const draggedItem = newQueue[draggedIndex];
      newQueue.splice(draggedIndex, 1);
      newQueue.splice(index, 0, draggedItem);
      
      onReorderQueue(newQueue);
      setDraggedIndex(index);
  };

  const handleDrop = () => {
      setDraggedIndex(null);
  };

  // --- DIRECT PRINT EXECUTION ---
  const handlePrint = () => {
      // Trigger browser print dialog
      window.print();
  };

  // Helper for Landscape transform
  const getTransform = () => {
      if (orientation === 'landscape') {
          return `translateX(${config.height * scale}px) rotate(90deg) scale(${scale})`;
      }
      return `scale(${scale})`;
  };

  return (
    <div className="flex h-full w-full bg-[#E5E5E5] text-gray-800 font-sans">
      
      {/* SIDEBAR: PRINT CONTROLS (Hidden on Print) */}
      <div className="w-[300px] bg-white border-r border-gray-300 flex flex-col z-20 print:hidden shadow-lg">
          <div className="p-6 border-b border-gray-200">
             <h2 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2">
                 <Printer size={20} className="text-[#D4AF37]" /> Print Layout
             </h2>
             <p className="text-xs text-gray-500 mt-1">Configure 8.5" x 11" Sheet</p>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              
              {/* PAGE MARGINS */}
              <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2"><Move size={12}/> Page Margins</label>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Top (px)</label>
                          <input type="number" value={marginTop} onChange={e => setMarginTop(parseInt(e.target.value))} className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-[#D4AF37] outline-none" />
                      </div>
                      <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Left (px)</label>
                          <input type="number" value={marginLeft} onChange={e => setMarginLeft(parseInt(e.target.value))} className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-[#D4AF37] outline-none" />
                      </div>
                  </div>
              </div>

              {/* LABEL SPACING */}
              <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2"><Grid size={12}/> Label Spacing</label>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Horizontal Gap</label>
                          <input type="number" value={gapX} onChange={e => setGapX(parseInt(e.target.value))} className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-[#D4AF37] outline-none" />
                      </div>
                      <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Vertical Gap</label>
                          <input type="number" value={gapY} onChange={e => setGapY(parseInt(e.target.value))} className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-[#D4AF37] outline-none" />
                      </div>
                  </div>
              </div>

              {/* ORIENTATION */}
              <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2"><RotateCw size={12}/> Orientation</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-sm">
                      <button 
                        onClick={() => setOrientation('portrait')}
                        className={`flex items-center justify-center gap-2 py-2 rounded-sm text-xs font-bold transition-all ${orientation === 'portrait' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                         <Smartphone size={14} /> Vertical
                      </button>
                      <button 
                        onClick={() => setOrientation('landscape')}
                        className={`flex items-center justify-center gap-2 py-2 rounded-sm text-xs font-bold transition-all ${orientation === 'landscape' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                         <Monitor size={14} /> Horizontal
                      </button>
                  </div>
              </div>

              {/* SCALE */}
              <div>
                  <label className="text-xs font-bold uppercase text-gray-500 mb-3 block">Label Size (Scale)</label>
                  <input 
                    type="range" 
                    min="0.3" max="1.5" step="0.01" 
                    value={scale} 
                    onChange={e => setScale(parseFloat(e.target.value))}
                    className="w-full accent-[#D4AF37]" 
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">{Math.round(scale * 100)}%</div>
              </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
             <button 
                onClick={handlePrint}
                className="w-full bg-[#D4AF37] hover:bg-[#b38f20] text-black py-3 rounded-sm font-bold uppercase tracking-widest shadow-md transition-colors flex items-center justify-center gap-2"
             >
                <Printer size={18} /> Print Now
             </button>
             <button 
                onClick={onClose}
                className="w-full mt-3 text-gray-500 hover:text-gray-800 text-xs font-bold uppercase tracking-widest py-2"
             >
                Back to Editor
             </button>
          </div>
      </div>

      {/* PREVIEW AREA */}
      <div className="flex-1 overflow-auto flex justify-center p-8 custom-scrollbar print:p-0 print:overflow-visible">
        
        {/* PHYSICAL SHEET (8.5in x 11in) */}
        <div 
            id="print-sheet-root"
            className="bg-white shadow-2xl relative print:shadow-none print:m-0"
            style={{ 
                width: '8.5in', 
                height: '11in', 
                paddingTop: `${marginTop}px`,
                paddingLeft: `${marginLeft}px`,
                boxSizing: 'border-box',
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: 'flex-start',
                gap: `${gapY}px ${gapX}px`, // Vertical Horizontal
            }}
        >
             {queue.map((item, index) => (
                 <div 
                    key={`${item.id}-${index}`} 
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleDrop}
                    className="relative bg-white group cursor-move print:cursor-auto"
                    style={{
                        // Wrapper size swaps if landscape
                        width: (orientation === 'landscape' ? config.height : config.width) * scale,
                        height: (orientation === 'landscape' ? config.width : config.height) * scale,
                        border: '1px dashed #ddd' // Helper border
                    }}
                 >
                    {/* Remove Button */}
                    <button 
                        onClick={() => onRemoveFromQueue(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-50 print:hidden shadow-sm"
                        title="Remove Label"
                    >
                        <X size={10} />
                    </button>

                    {/* Scale Down Canvas */}
                    <div style={{ 
                        width: config.width, 
                        height: config.height,
                        transform: getTransform(), 
                        transformOrigin: 'top left',
                        // If landscape, we need to ensure the container doesn't clip the rotated overflow during transform
                     }}>
                        <Canvas 
                            layers={item.layers}
                            config={config}
                            selectedLayerId={null}
                            onSelectLayer={() => {}}
                            onUpdateLayer={() => {}}
                            onUpdateLayerPosition={() => {}}
                            onUpdateConfig={() => {}}
                            viewMode="batch"
                            scale={1} // Internal scale 1, we handle scaling via parent transform
                            minimal={true}
                        />
                    </div>
                 </div>
             ))}
        </div>
      </div>

      <style>{`
        @media print {
            @page { margin: 0; size: letter; }
            html, body { 
                margin: 0 !important; 
                padding: 0 !important; 
                background: white !important; 
                height: 100%; 
                overflow: hidden !important; 
            }
            
            /* FORCE COLORS */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            /* CRITICAL: Hide all UI elements including Sidebar and Tools Panel */
            aside, nav, header, button, .sidebar, .tools-panel, .print\\:hidden { 
                display: none !important; 
            }
            
            /* Allow root containers to show content but hide their styles if needed */
            #root > div {
                overflow: visible !important;
                height: auto !important;
                background: white !important;
            }

            /* Default hidden for everything else */
            body * {
                visibility: hidden;
            }

            /* FORCE SHOW THE PRINT SHEET */
            #print-sheet-root, #print-sheet-root * { 
                visibility: visible !important; 
            }

            /* FIXED POSITIONING FOR THE SHEET */
            #print-sheet-root {
                position: fixed !important; /* Fixed ensures top-left regardless of scroll */
                top: 0 !important;
                left: 0 !important;
                width: 8.5in !important;
                height: 11in !important;
                margin: 0 !important;
                overflow: hidden !important;
                display: flex !important;
                flex-wrap: wrap !important;
                align-content: flex-start !important;
                background: white !important;
                z-index: 9999;
            }
            
            /* Remove Helper Borders */
            #print-sheet-root > div { border: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrintSheet;
