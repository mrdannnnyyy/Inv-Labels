
import React, { useRef } from 'react';
import { Layer, CanvasConfig } from '../types';
import { 
    AlignLeft, AlignCenter, AlignRight, 
    Type, Bold, Wand2, Palette, Layers, 
    Eye, EyeOff, Trash2, Database, Box, Image as ImageIcon, Plus
} from 'lucide-react';

interface SidebarProps {
  layers: Layer[];
  selectedLayerId: string | null;
  config: CanvasConfig;
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
  onUpdateConfig: (updates: Partial<CanvasConfig>) => void;
  onDeleteLayer?: (id: string) => void;
  onSelectLayer: (id: string) => void;
  onBindLayer: (layerId: string, systemKey: string) => void;
  viewMode: 'batch' | 'architecture' | 'vault';
  customBadges: string[];
  onUploadBadge: (base64: string) => void;
  onAddCustomBadgeLayer: (base64: string) => void;
}

const FONTS = [
    { label: 'Premium Serif (Cinzel)', value: 'Cinzel, serif' },
    { label: 'Modern (Montserrat)', value: 'Montserrat, sans-serif' },
    { label: 'Condensed (Oswald)', value: 'Oswald, sans-serif' },
    { label: 'Classic (Playfair)', value: 'Playfair Display, serif' },
];

const Sidebar: React.FC<SidebarProps> = ({
  layers,
  selectedLayerId,
  config,
  onUpdateLayer,
  onUpdateConfig,
  onDeleteLayer,
  onSelectLayer,
  onBindLayer,
  viewMode,
  customBadges,
  onUploadBadge,
  onAddCustomBadgeLayer
}) => {
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const isArchitecture = viewMode === 'architecture';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              if (reader.result) {
                  onUploadBadge(reader.result as string);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const updateStyle = (key: string, value: any) => {
      if (!selectedLayer) return;
      onUpdateLayer(selectedLayer.id, { style: { ...selectedLayer.style, [key]: value } });
  };

  // --- ARCHITECTURE MODE: FULL CONTROL ---
  if (isArchitecture && !selectedLayer) {
      return (
        <aside className="glass-panel flex flex-col h-full overflow-hidden text-gray-200">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[#0C0C0C]">
                <h2 className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    <Palette size={14}/> Canvas & Assets
                </h2>
            </div>
            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                {/* Global Config */}
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Background Colors</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 glass-input p-1 rounded-sm">
                            <input type="color" value={config.backgroundTop} onChange={e => onUpdateConfig({backgroundTop: e.target.value})} className="bg-transparent border-none w-6 h-6 p-0 cursor-pointer"/>
                        </div>
                        <div className="flex items-center gap-2 glass-input p-1 rounded-sm">
                            <input type="color" value={config.backgroundBottom} onChange={e => onUpdateConfig({backgroundBottom: e.target.value})} className="bg-transparent border-none w-6 h-6 p-0 cursor-pointer"/>
                        </div>
                    </div>
                </div>

                {/* Badge Library */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Badge Library</label>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[#D4AF37] hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase"
                        >
                            <Plus size={10} /> Upload
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {customBadges.map((badge, i) => (
                            <button 
                                key={i} 
                                onClick={() => onAddCustomBadgeLayer(badge)}
                                className="aspect-square bg-[#1a1a1a] border border-[#333] hover:border-[#D4AF37] rounded-sm flex items-center justify-center p-1 overflow-hidden"
                            >
                                <img src={badge} alt="custom badge" className="w-full h-full object-contain" />
                            </button>
                        ))}
                        {customBadges.length === 0 && (
                            <div className="col-span-3 text-center text-xs text-gray-600 italic py-4">No custom assets</div>
                        )}
                    </div>
                </div>

                {/* Layer List */}
                <div className="pt-6 border-t border-gray-800">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3 flex items-center gap-2">
                        <Layers size={12}/> All Layers
                    </label>
                    <div className="space-y-1">
                        {layers.slice().reverse().map((layer) => (
                            <div key={layer.id} onClick={() => onSelectLayer(layer.id)} className="flex items-center gap-3 p-2 rounded-sm cursor-pointer transition-all border border-transparent hover:bg-[#1a1a1a] text-gray-500 hover:text-white">
                                <span className="text-xs truncate">{layer.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
      );
  }

  // --- SELECTED LAYER (Architecture Mode) ---
  if (isArchitecture && selectedLayer) {
      return (
        <aside className="glass-panel flex flex-col h-full overflow-hidden text-gray-200">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[#0C0C0C] flex justify-between items-center">
                <h2 className="text-white font-bold text-sm tracking-widest uppercase truncate max-w-[150px]">{selectedLayer.name}</h2>
                <button onClick={() => onDeleteLayer && onDeleteLayer(selectedLayer.id)} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {(selectedLayer.type === 'text' || selectedLayer.type === 'group') && (
                    <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Content</label>
                         <textarea className="glass-input w-full p-3 text-sm rounded-sm" rows={3} value={selectedLayer.content || ''} onChange={(e) => onUpdateLayer(selectedLayer.id, { content: e.target.value })} />
                    </div>
                )}
                {selectedLayer.type === 'text' && (
                    <div className="space-y-4 pt-4 border-t border-gray-800">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Type size={12}/> Typography</label>
                        <select value={selectedLayer.style.fontFamily} onChange={(e) => updateStyle('fontFamily', e.target.value)} className="glass-input w-full p-2 text-xs rounded-sm cursor-pointer">
                            {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                             <div className="flex items-center gap-2 glass-input p-2 rounded-sm justify-between">
                                <span className="text-[10px] text-gray-400">Color</span>
                                <input type="color" value={selectedLayer.style.color} onChange={(e) => updateStyle('color', e.target.value)} className="bg-transparent border-none w-5 h-5 p-0 cursor-pointer"/>
                             </div>
                             <input type="number" value={selectedLayer.style.fontSize} onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))} className="glass-input p-2 text-sm rounded-sm" placeholder="Size" />
                        </div>
                    </div>
                )}
            </div>
        </aside>
      );
  }

  // --- BATCH/DATA MODE: CONTENT EDITING ONLY ---
  // If nothing selected, show instructions
  if (!selectedLayer) {
      return (
          <aside className="glass-panel flex flex-col h-full overflow-hidden text-gray-200 justify-center items-center text-center p-6">
              <Database className="text-[#333] mb-4" size={48} />
              <h3 className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs">Quick Edit Mode</h3>
              <p className="text-gray-500 text-xs mt-2">Click any text on the canvas to edit its content safely.</p>
          </aside>
      );
  }

  // If selected in Batch Mode
  return (
    <aside className="glass-panel flex flex-col h-full overflow-hidden text-gray-200">
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[#0C0C0C]">
             <h2 className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase">Quick Edit</h2>
             <p className="text-xs text-gray-500">{selectedLayer.name}</p>
        </div>
        <div className="p-6">
             {selectedLayer.type === 'text' || selectedLayer.type === 'group' ? (
                 <div className="space-y-4">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update Text</label>
                     <textarea 
                        className="glass-input w-full p-4 text-sm rounded-sm focus:border-[#D4AF37] border-l-4 border-l-[#D4AF37]" 
                        rows={5} 
                        value={selectedLayer.content || ''} 
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { content: e.target.value })} 
                        autoFocus
                     />
                     <p className="text-[10px] text-gray-600 italic">Layout changes are disabled in Data Mode.</p>
                 </div>
             ) : (
                 <p className="text-xs text-gray-500 italic">This layer type cannot be edited in Quick Mode.</p>
             )}
        </div>
    </aside>
  );
};

export default Sidebar;
