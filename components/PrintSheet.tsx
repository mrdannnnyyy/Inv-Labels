
import React from 'react';
import Canvas from './Canvas';
import { Layer, CanvasConfig } from '../types';
import { X, Printer } from 'lucide-react';

interface PrintSheetProps {
  queue: { id: string; layers: Layer[] }[];
  config: CanvasConfig;
  onClose: () => void;
  onPrint: () => void;
  onRemoveFromQueue: (index: number) => void;
}

const PrintSheet: React.FC<PrintSheetProps> = ({ queue, config, onClose, onPrint, onRemoveFromQueue }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 overflow-hidden">
      
      {/* HEADER (Hidden on Print) */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 print:hidden">
        <div>
           <h2 className="text-2xl text-white font-serif font-bold">Print Queue Preview</h2>
           <p className="text-gray-400 text-sm">Sheet Layout: 8.5" x 11" (Letter) • {queue.length} Labels</p>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={onClose}
                className="px-6 py-2 text-gray-300 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
             >
                Close
             </button>
             <button 
                onClick={onPrint}
                className="bg-[#D4AF37] hover:bg-[#b38f20] text-black px-8 py-3 rounded-sm font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg"
             >
                <Printer size={18} /> Print Sheet
             </button>
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div className="flex-1 w-full overflow-auto flex justify-center custom-scrollbar print:overflow-visible print:h-auto">
        
        {/* PHYSICAL SHEET SIMULATION (8.5in x 11in) */}
        {/* Tailwind 'w-[8.5in]' doesn't exist by default, using pixel approx: 816px x 1056px @ 96dpi */}
        <div 
            id="print-sheet-root"
            className="bg-white shadow-2xl relative grid grid-cols-2 grid-rows-3 gap-4 content-start print:shadow-none print:m-0 print:w-full print:h-full"
            style={{ 
                width: '8.5in', 
                height: '11in', 
                padding: '0.5in', // Safe margin
                pageBreakAfter: 'always'
            }}
        >
             {queue.map((item, index) => (
                 <div key={`${item.id}-${index}`} className="relative border border-gray-100 print:border-none flex items-center justify-center overflow-hidden bg-gray-50 group">
                    {/* Remove Button (Hover) */}
                    <button 
                        onClick={() => onRemoveFromQueue(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-50 print:hidden"
                    >
                        <X size={12} />
                    </button>

                    {/* Scale Down Canvas to Fit Cell */}
                    <div style={{ transform: 'scale(0.43)', transformOrigin: 'center' }}>
                        <Canvas 
                            layers={item.layers}
                            config={config}
                            selectedLayerId={null}
                            onSelectLayer={() => {}}
                            onUpdateLayer={() => {}}
                            onUpdateLayerPosition={() => {}}
                            onUpdateConfig={() => {}}
                            viewMode="batch" // Read only
                            scale={1} // Internal scale 1, handled by parent div transform
                        />
                    </div>
                 </div>
             ))}

             {/* Empty Placeholders to visualize grid */}
             {Array.from({ length: Math.max(0, 6 - queue.length) }).map((_, i) => (
                 <div key={`empty-${i}`} className="border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-sm uppercase font-bold tracking-widest print:hidden">
                    Empty Slot
                 </div>
             ))}
        </div>
      </div>

      <style>{`
        @media print {
            @page { margin: 0; size: letter; }
            body * { visibility: hidden; }
            #print-sheet-root, #print-sheet-root * { visibility: visible; }
            #print-sheet-root {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0.5in; /* Keep physical margin */
                background: white !important;
            }
        }
      `}</style>
    </div>
  );
};

export default PrintSheet;
