
import React, { useState, useCallback, useEffect } from 'react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import ImportTools from './components/ImportTools';
import Vault from './components/Vault';
import PrintSheet from './components/PrintSheet';
import { Layer, CanvasConfig, Product, ColumnMapping, HistoryRecord } from './types';
import { INITIAL_LAYERS, CANVAS_CONFIG } from './constants';
import { Layout, Database, History, Printer, ZoomIn, ZoomOut, Upload, Search, Save, PlusCircle, CheckSquare, Square } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [canvasConfig, setCanvasConfig] = useState<CanvasConfig>({
      ...CANVAS_CONFIG,
      backgroundTop: '#F5F0E1', 
      backgroundBottom: '#7B1E36', 
      splitRatio: 0.6,
  });
  
  const [viewMode, setViewMode] = useState<'batch' | 'vault' | 'architecture'>('batch');
  const [zoomLevel, setZoomLevel] = useState(0.85);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [layerMapping, setLayerMapping] = useState<Record<string, string>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // PRODUCTION ENGINE STATE
  const [printQueue, setPrintQueue] = useState<{ id: string; layers: Layer[] }[]>([]);
  const [showPrintSheet, setShowPrintSheet] = useState(false);
  const [checkedProducts, setCheckedProducts] = useState<Set<number>>(new Set());
  const [customBadges, setCustomBadges] = useState<string[]>([]); // Base64 strings

  useEffect(() => {
    const savedMapping = localStorage.getItem('std_mapping');
    if (savedMapping) setColumnMapping(JSON.parse(savedMapping));
    const savedHistory = localStorage.getItem('std_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const initLayerMap: Record<string, string> = {};
    INITIAL_LAYERS.forEach(l => {
        if (l.id.includes('product-name-1')) initLayerMap[l.id] = 'product-name-1';
        if (l.id.includes('active-price')) initLayerMap[l.id] = 'active-price';
        if (l.id.includes('badge-points-group')) initLayerMap[l.id] = 'badge-points-group';
        if (l.id.includes('category-label')) initLayerMap[l.id] = 'category-label';
        if (l.id.includes('was-price')) initLayerMap[l.id] = 'was-price';
    });
    setLayerMapping(initLayerMap);
  }, []);

  // --- CANVAS HANDLERS ---
  const handleSelectLayer = useCallback((id: string) => {
    setSelectedLayerId(id === selectedLayerId ? null : id);
  }, [selectedLayerId]);

  const handleUpdateLayerPosition = useCallback((id: string, x: number, y: number) => {
      setLayers(prev => prev.map(l => l.id === id ? { ...l, x, y } : l));
  }, []);

  const handleUpdateLayer = useCallback((id: string, updates: Partial<Layer>) => {
      setLayers(prev => prev.map(l => l.id !== id ? l : { 
          ...l, ...updates, 
          style: updates.style ? { ...l.style, ...updates.style } : l.style 
      }));
  }, []);
  
  const handleUpdateConfig = (updates: Partial<CanvasConfig>) => {
      setCanvasConfig(prev => ({ ...prev, ...updates }));
  };

  const handleBindLayer = (layerId: string, systemKey: string) => {
      setLayerMapping(prev => ({ ...prev, [layerId]: systemKey }));
      if (selectedProductIndex !== null && products[selectedProductIndex]) {
           const product = products[selectedProductIndex];
           const csvHeader = columnMapping[systemKey];
           if (csvHeader && product[csvHeader]) {
               handleUpdateLayer(layerId, { content: product[csvHeader] });
           }
      }
  };

  // --- CUSTOM ASSETS ---
  const handleAddCustomBadgeLayer = (base64: string) => {
      const newLayer: Layer = {
          id: `custom-badge-${Date.now()}`,
          type: 'image',
          name: 'Custom Badge',
          content: base64,
          x: 50,
          y: 50,
          style: { width: 80, height: 80, zIndex: 100 }
      };
      setLayers([...layers, newLayer]);
  };

  // --- SMART DATA LOGIC (AUTO-MATH) ---
  const applyProductToLayers = (product: Product, currentLayers: Layer[], colMap: ColumnMapping, layMap: Record<string, string>) => {
      // 1. Map Standard Fields
      let nextLayers = currentLayers.map(layer => {
          const systemKey = layMap[layer.id] || layer.id;
          const csvHeader = colMap[systemKey];
          if (csvHeader && product[csvHeader] !== undefined) {
              return { ...layer, content: product[csvHeader] };
          }
          return layer;
      });

      // 2. RIBBON LOGIC (Calculated)
      const getPrice = (key: string) => {
          // Find the layer mapped to this key to get its content, or find raw product data
          const mappedLayerId = Object.keys(layMap).find(id => layMap[id] === key);
          let val = null;
          
          // Try to get from layer content first (in case user edited it manually in Data Mode)
          if (mappedLayerId) {
              const l = nextLayers.find(nl => nl.id === mappedLayerId);
              if (l) val = l.content;
          }
          
          // Fallback to CSV data
          if (!val) {
              const csvHeader = colMap[key];
              if (csvHeader) val = product[csvHeader];
          }

          return val ? parseFloat(val.replace(/[^0-9.]/g, '')) : 0;
      };

      const activePrice = getPrice('active-price');
      const wasPrice = getPrice('was-price');
      const savings = wasPrice - activePrice;

      // Find ribbon layers by ID (assuming standard template structure)
      const ribbonBg = nextLayers.find(l => l.id === 'ribbon-bg');
      const ribbonText = nextLayers.find(l => l.id === 'ribbon-text');

      if (ribbonBg && ribbonText) {
          if (wasPrice > activePrice && savings > 0.01) {
              // SHOW RIBBON
              ribbonBg.style.display = 'flex';
              ribbonText.style.display = 'block';
              ribbonText.content = `SAVE $${savings.toFixed(2)}`;
          } else {
              // HIDE RIBBON
              ribbonBg.style.display = 'none';
              ribbonText.style.display = 'none';
          }
      }

      return nextLayers;
  };

  const handleSelectProduct = (product: Product) => {
      const idx = products.indexOf(product);
      setSelectedProductIndex(idx);
      const newLayers = applyProductToLayers(product, layers, columnMapping, layerMapping);
      setLayers(newLayers);
  };

  const handleMappingChanged = (newMapping: ColumnMapping) => {
      setColumnMapping(newMapping);
      localStorage.setItem('std_mapping', JSON.stringify(newMapping));
      if (selectedProductIndex !== null && products[selectedProductIndex]) {
          const newLayers = applyProductToLayers(products[selectedProductIndex], layers, newMapping, layerMapping);
          setLayers(newLayers);
      }
  };

  // --- BATCH PRINT QUEUE ---
  const toggleCheckProduct = (index: number) => {
      const newSet = new Set(checkedProducts);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      setCheckedProducts(newSet);
  };

  const addCheckedToQueue = () => {
      const newItems: { id: string; layers: Layer[] }[] = [];
      
      checkedProducts.forEach(idx => {
          const prod = products[idx];
          // Generate layers for this specific product based on current layout
          const renderedLayers = applyProductToLayers(prod, layers, columnMapping, layerMapping);
          newItems.push({
              id: `${Date.now()}-${idx}`,
              layers: renderedLayers
          });
      });

      setPrintQueue([...printQueue, ...newItems]);
      setCheckedProducts(new Set()); // Clear selection
      alert(`Added ${newItems.length} labels to Print Queue`);
  };

  const handleBatchPrint = () => {
      if (printQueue.length === 0) {
          alert("Queue is empty!");
          return;
      }
      setShowPrintSheet(true);
  };

  // --- TEMPLATE SWAPPING ---
  const handleLoadTemplate = (templateName: string) => {
      // In a real app, this would load from a list of templates
      // For now, we simulate by resetting to INITIAL_LAYERS but preserving data
      if (confirm("Reset layout to default? (Data will be preserved)")) {
          let newLayers = JSON.parse(JSON.stringify(INITIAL_LAYERS));
          if (selectedProductIndex !== null) {
              newLayers = applyProductToLayers(products[selectedProductIndex], newLayers, columnMapping, layerMapping);
          }
          setLayers(newLayers);
      }
  };

  // --- VAULT UPDATE ---
  const updateVaultRecord = (id: string, field: string, value: string) => {
      const newHistory = history.map(h => h.id === id ? { ...h, [field]: value } : h);
      setHistory(newHistory);
      localStorage.setItem('std_history', JSON.stringify(newHistory));
  };

  const filteredProducts = products.filter(p => 
    Object.values(p).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen w-full bg-[#121212] text-gray-200 font-sans overflow-hidden">
      
      {/* PRINT OVERLAY */}
      {showPrintSheet && (
          <PrintSheet 
            queue={printQueue} 
            config={canvasConfig} 
            onClose={() => setShowPrintSheet(false)}
            onPrint={() => window.print()}
            onRemoveFromQueue={(i) => setPrintQueue(printQueue.filter((_, idx) => idx !== i))}
          />
      )}

      {/* HEADER */}
      <header className="h-16 border-b border-[rgba(255,255,255,0.08)] bg-[#121212] flex items-center justify-between px-6 z-50 shrink-0">
         <div className="flex items-center gap-4">
            <h1 className="text-xl text-white serif tracking-widest font-bold">CORKED</h1>
            <div className="h-6 w-px bg-gray-700"></div>
            <p className="text-[10px] text-[#D4AF37] tracking-[0.2em] uppercase">Production Engine</p>
         </div>

         {/* NAV PILLS */}
         <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-sm border border-[rgba(255,255,255,0.05)]">
             <button onClick={() => { setViewMode('batch'); setSelectedLayerId(null); }} className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'batch' ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-white'}`}>
                <Database size={12} /> Data Mode
             </button>
             <button onClick={() => setViewMode('architecture')} className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'architecture' ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-white'}`}>
                <Layout size={12} /> Design Mode
             </button>
             <button onClick={() => setViewMode('vault')} className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'vault' ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-white'}`}>
                <History size={12} /> Vault
             </button>
         </div>

         <div className="flex items-center gap-4">
             {viewMode === 'batch' && (
                  <select onChange={(e) => handleLoadTemplate(e.target.value)} className="bg-[#1a1a1a] text-xs text-gray-300 border border-gray-700 rounded-sm px-2 py-1 outline-none">
                      <option value="default">Default Template</option>
                      <option value="reset">Reset Layout</option>
                  </select>
             )}
             
             {/* BATCH PRINT BUTTON */}
             <button 
                onClick={handleBatchPrint}
                className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all border border-gray-600 relative"
             >
                <Printer size={14} /> Batch Print ({printQueue.length})
                {printQueue.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse"></span>}
             </button>
         </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden">
         
         {/* LEFT COL: INVENTORY */}
         {viewMode === 'batch' && (
             <div className="w-[20%] min-w-[250px] border-r border-[rgba(255,255,255,0.08)] bg-[#121212] flex flex-col">
                 <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[#141414]">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Inventory</h3>
                        <div className="flex gap-2">
                             <button onClick={addCheckedToQueue} title="Add Checked to Queue" className="text-gray-400 hover:text-[#D4AF37]"><PlusCircle size={14} /></button>
                             <label htmlFor="csv-upload-input" className="cursor-pointer text-gray-500 hover:text-white"><Upload size={14} /></label>
                        </div>
                    </div>
                    <ImportTools 
                        onProductsImported={setProducts}
                        onMappingChanged={handleMappingChanged}
                        initialMapping={columnMapping}
                    />
                    <div className="relative mt-2">
                        <Search size={12} className="absolute left-3 top-2.5 text-gray-600" />
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#333] text-gray-300 text-xs py-2 pl-8 pr-2 rounded-sm outline-none focus:border-[#D4AF37]" />
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto">
                    {products.length === 0 ? (
                        <div className="p-8 text-center text-gray-700 text-xs italic">Upload CSV to begin.</div>
                    ) : (
                        filteredProducts.map((product, idx) => {
                            const name = Object.values(product)[0] || 'Unknown';
                            const sku = Object.values(product)[1] || '---';
                            const isSelected = selectedProductIndex === products.indexOf(product);
                            const isChecked = checkedProducts.has(products.indexOf(product));

                            return (
                                <div key={idx} className={`flex items-center p-2 border-b border-[#222] transition-colors ${isSelected ? 'bg-[#1a1a1a]' : 'hover:bg-[#161616]'}`}>
                                    <button onClick={() => toggleCheckProduct(products.indexOf(product))} className="px-2 text-gray-500 hover:text-[#D4AF37]">
                                        {isChecked ? <CheckSquare size={14} /> : <Square size={14} />}
                                    </button>
                                    <div className="flex-1 cursor-pointer" onClick={() => handleSelectProduct(product)}>
                                        <div className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>{String(name)}</div>
                                        <div className="text-[10px] text-gray-600 font-mono">{String(sku)}</div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                 </div>
             </div>
         )}

         {/* RIGHT COL: SIDEBAR */}
         {(viewMode === 'batch' || viewMode === 'architecture') && (
             <div className="w-[25%] min-w-[300px] border-r border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,18,0.95)] z-20">
                 <Sidebar
                    layers={layers}
                    selectedLayerId={selectedLayerId}
                    config={canvasConfig}
                    onUpdateLayer={handleUpdateLayer}
                    onUpdateConfig={handleUpdateConfig}
                    onDeleteLayer={(id) => setLayers(l => l.filter(x => x.id !== id))}
                    onSelectLayer={handleSelectLayer}
                    onBindLayer={handleBindLayer}
                    viewMode={viewMode}
                    customBadges={customBadges}
                    onUploadBadge={(b64) => setCustomBadges([...customBadges, b64])}
                    onAddCustomBadgeLayer={handleAddCustomBadgeLayer}
                 />
             </div>
         )}

         {/* CENTER: CANVAS */}
         {(viewMode === 'batch' || viewMode === 'architecture') ? (
             <div className="flex-1 bg-[#0a0a0a] relative flex flex-col min-w-0">
                 <div className="absolute top-4 right-4 z-20 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm p-1 rounded-full flex items-center border border-[rgba(255,255,255,0.1)]">
                    <button onClick={() => setZoomLevel(Math.max(0.4, zoomLevel - 0.1))} className="p-2 text-gray-400 hover:text-white"><ZoomOut size={14} /></button>
                    <span className="text-[10px] font-mono w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))} className="p-2 text-gray-400 hover:text-white"><ZoomIn size={14} /></button>
                 </div>
                 
                 <div className="absolute top-4 left-4 z-20">
                     {viewMode === 'batch' ? (
                         <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Data Mode (Smart Calc Active)</span>
                     ) : (
                         <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Design Mode</span>
                     )}
                 </div>

                 <div className="flex-1 overflow-auto relative custom-scrollbar">
                    <Canvas
                        layers={layers}
                        selectedLayerId={selectedLayerId}
                        config={canvasConfig}
                        onSelectLayer={handleSelectLayer}
                        onUpdateLayerPosition={handleUpdateLayerPosition}
                        onUpdateLayer={handleUpdateLayer}
                        onUpdateConfig={handleUpdateConfig}
                        viewMode={viewMode}
                        scale={zoomLevel}
                    />
                 </div>
             </div>
         ) : (
             <div className="flex-1 bg-[#121212]">
                 <Vault history={history} onReprint={() => {}} onUpdateRecord={updateVaultRecord} />
             </div>
         )}

      </main>
    </div>
  );
};

export default App;
