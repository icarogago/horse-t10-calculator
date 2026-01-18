import { useState, useEffect, useMemo } from 'react';
import { CalculatorTable } from './components/calculator/CalculatorTable';
import { ItemInfoSection } from './components/calculator/ItemInfoSection';
import { calculateMaterials } from './lib/calculator';
import type { InventoryMap } from './types';
import { fetchMarketPrices, getLastUpdateTimestamp, API_CONFIG } from './lib/api';
import { ITEMS } from './data/items';
import { Rocket, Moon, Sun, Minus, Plus, Info, RefreshCw } from 'lucide-react';

const STORAGE_KEY_THEME = 't10-theme';
const STORAGE_KEY_INV = 't10-inventory-v1';
const STORAGE_KEY_PRICES = 't10-prices-v1';
const STORAGE_KEY_QTY = 't10-target-qty';
const STORAGE_KEY_METHOD = 't10-craft-method';

function App() {
  // --- Estados ---
  
  // 0. Tema
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) return saved === 'dark';
    return false; // Padrão light
  });

  // 1. Configuração
  const [targetQuantity, setTargetQuantity] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_QTY);
    const parsed = saved ? parseInt(saved) : 1;
    return isNaN(parsed) ? 1 : parsed;
  });
  
  const [craftMethod, setCraftMethod] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_METHOD) || 'method-2-popular';
  });
  
  // 2. Inventário
  const [inventory, setInventory] = useState<InventoryMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INV);
      return saved ? new Map(JSON.parse(saved)) : new Map();
    } catch { return new Map(); }
  });

  // 3. Preços de Mercado
  const [marketPrices, setMarketPrices] = useState<Map<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRICES);
      return saved ? new Map(JSON.parse(saved)) : new Map();
    } catch { return new Map(); }
  });

  // 4. Controle de Atualização
  const [nextUpdateAt, setNextUpdateAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now()); // Para forçar re-render do timer

  // --- Efeitos de Persistência ---
  useEffect(() => {
    // Inicializa o timer baseado no cache
    const lastUpdate = getLastUpdateTimestamp();
    if (lastUpdate) {
      const nextTime = lastUpdate + API_CONFIG.cacheTimeout;
      if (nextTime > Date.now()) {
        setNextUpdateAt(nextTime);
      }
    }

    // Timer para atualizar o contador visualmente a cada minuto
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => localStorage.setItem(STORAGE_KEY_QTY, targetQuantity.toString()), [targetQuantity]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_METHOD, craftMethod), [craftMethod]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INV, JSON.stringify(Array.from(inventory.entries())));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRICES, JSON.stringify(Array.from(marketPrices.entries())));
  }, [marketPrices]);

  // --- Handlers ---
  const handleUpdatePrices = async () => {
    if (nextUpdateAt && nextUpdateAt > Date.now()) {
      return; // Bloqueado
    }

    const prices = await fetchMarketPrices(Object.values(ITEMS), true);
    if (prices) {
      setMarketPrices(prev => {
        const next = new Map(prev);
        prices.forEach((price, id) => next.set(id, price));
        return next;
      });
      
      // Bloqueia por 30 min
      setNextUpdateAt(Date.now() + API_CONFIG.cacheTimeout);
      
      alert('Preços atualizados com sucesso via Arsha.io!');
    } else {
      alert('Falha ao buscar preços. Verifique o console.');
    }
  };

  const handleInventoryChange = (itemId: string, newQty: number) => {
    setInventory(prev => {
      const next = new Map(prev);
      next.set(itemId, newQty);
      return next;
    });
  };

  const handlePriceChange = (itemId: string, newPrice: number) => {
    setMarketPrices(prev => {
      const next = new Map(prev);
      next.set(itemId, newPrice);
      return next;
    });
  };

  // --- Cálculo Automático (Reativo) ---
  const calculationResult = useMemo(() => {
    return calculateMaterials(
      'incenso-sonho',
      targetQuantity,
      craftMethod,
      inventory,
      marketPrices
    );
  }, [targetQuantity, craftMethod, inventory, marketPrices]);

  // Pegamos o nó raiz da árvore
  const rootNode = calculationResult.results[0];

  const minutesRemaining = nextUpdateAt ? Math.ceil((nextUpdateAt - Date.now()) / 60000) : 0;
  const isLocked = minutesRemaining > 0;

  return (
    <div className="min-h-screen bg-t10-blue-2 dark:bg-t10-dark-base transition-colors duration-300 font-sans pb-20 text-t10-blue-3 dark:text-t10-dark-textPrimary">
      {/* Header Minimalista */}
      <header className="border-b border-t10-blue-4/30 dark:border-t10-dark-surfaceBorder bg-t10-palette-deepBlue dark:bg-t10-dark-base backdrop-blur-md sticky top-0 z-10 transition-colors duration-300 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 dark:bg-indigo-600/20 p-2 rounded-lg">
              <Rocket className="text-white dark:text-indigo-500 h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-white dark:text-gray-100 tracking-tight">
              Calculadora T10 <span className="text-blue-200 dark:text-gray-600 font-normal text-sm ml-2 hidden sm:inline">| Incenso que Chama o Sonho</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Botão de Atualizar Preços com Timer */}
            <div className="relative group">
              <button
                onClick={handleUpdatePrices}
                disabled={isLocked}
                className={`p-2 rounded-full transition-all flex items-center gap-2 ${
                  isLocked 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                    : 'bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 text-white dark:text-gray-300'
                }`}
                title={isLocked ? `Disponível em ${minutesRemaining} min` : "Atualizar Preços (Arsha.io)"}
              >
                <RefreshCw size={18} className={!isLocked ? "group-hover:rotate-180 transition-transform duration-500" : ""} />
                {isLocked && <span className="text-xs font-mono font-medium">{minutesRemaining}m</span>}
              </button>
              
              {/* Tooltip Informativo se Bloqueado */}
              {isLocked && (
                <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Preços atualizados recentemente. Aguarde para atualizar novamente.
                </div>
              )}
            </div>

            <div className="text-xs text-blue-200 dark:text-gray-500 hidden sm:block">
              Edição Black Desert Online
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 text-white dark:text-gray-300 transition-colors"
              title="Alternar Tema"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
        
        {/* Controles de Configuração (Inline) */}
        <div className="bg-white dark:bg-t10-dark-surface rounded-lg border border-t10-blue-4/30 dark:border-t10-dark-surfaceBorder p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-center justify-between shadow-lg transition-colors duration-300">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto justify-center sm:justify-start">
            
            {/* Input Quantidade */}
            <div>
              <label className="block text-xs font-semibold text-t10-blue-4 dark:text-t10-dark-textHeader uppercase tracking-wider mb-1 text-center sm:text-left">
                Quantidade Alvo
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTargetQuantity(Math.max(1, targetQuantity - 1))}
                  className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="bg-t10-blue-2/20 dark:bg-t10-dark-base border border-t10-blue-4/30 dark:border-t10-dark-surfaceBorder text-t10-blue-3 dark:text-t10-dark-textPrimary text-lg font-bold rounded-md w-20 py-1 focus:ring-2 focus:ring-t10-blue-1 dark:focus:ring-t10-dark-textHighlight outline-none text-center appearance-none transition-colors"
                />
                <button
                  onClick={() => setTargetQuantity(targetQuantity + 1)}
                  className="p-1.5 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 transition-colors"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-t10-blue-4 dark:text-t10-dark-textSecondary ml-1">unidades</span>
              </div>
            </div>

            {/* Seletor de Método */}
            <div>
              <label className="block text-xs font-semibold text-t10-blue-4 dark:text-t10-dark-textHeader uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-1">
                Método de Crafting <Info size={12} />
              </label>
              <div className="flex gap-1 bg-t10-blue-2/20 dark:bg-[#101113] rounded-md p-1 border border-t10-blue-4/30 dark:border-gray-700 transition-colors">
                {[
                  { id: 'method-1-cheap', label: 'Popular' },
                  { id: 'method-2-popular', label: 'Padrão' },
                  { id: 'method-3-fast', label: 'Rápido' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setCraftMethod(m.id)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm ${
                      craftMethod === m.id
                        ? 'bg-t10-palette-methodSelected text-white ring-2 ring-t10-palette-methodSelected ring-offset-1 dark:ring-offset-[#101113]'
                        : 'bg-t10-palette-methodUnselected text-white hover:bg-t10-palette-methodUnselected/80'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
          
          {/* Resumo Rápido */}
          <div className="w-full sm:w-auto text-center sm:text-right bg-gradient-to-r from-t10-palette-costGradientStart to-t10-palette-costGradientEnd p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
             <div className="text-xs text-white/80 uppercase tracking-wider mb-1 font-semibold">Custo Estimado</div>
             <div className="text-3xl font-bold text-white flex items-center justify-center sm:justify-end gap-2">
               <span className="text-xl opacity-70">💰</span>
               {rootNode?.totalCost?.toLocaleString() || 0}
             </div>
          </div>
        </div>

        {/* Tabela Principal */}
        {rootNode ? (
          <>
            <CalculatorTable
              rootNode={rootNode}
              inventory={inventory}
              onInventoryChange={handleInventoryChange}
              onPriceChange={handlePriceChange}
              marketPrices={marketPrices}
            />
            <ItemInfoSection />
          </>
        ) : (
          <div className="text-center py-12 text-t10-blue-4 dark:text-gray-500">
            Erro ao carregar dados do item.
          </div>
        )}

        <div className="text-center text-xs text-t10-blue-4 dark:text-gray-600 pt-8">
           Dica: Os valores salvam automaticamente no seu navegador.
        </div>
      </main>
    </div>
  );
}

export default App;
