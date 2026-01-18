import React, { useState } from 'react';
import { ChevronDown, ChevronRight} from 'lucide-react';
import type { CalculationResult, InventoryMap } from '../../types';
import { cn } from '../../lib/utils';
import { ITEMS } from '../../data/items';

interface CalculatorTableProps {
  rootNode: CalculationResult;
  inventory: InventoryMap;
  onInventoryChange: (itemId: string, newQty: number) => void;
  onPriceChange: (itemId: string, newPrice: number) => void;
  marketPrices: Map<string, number>;
}

export function CalculatorTable({
  rootNode,
  inventory,
  onInventoryChange,
  onPriceChange,
  marketPrices
}: CalculatorTableProps) {
  
  // Estado para controlar quais nós estão expandidos (padrão: todos)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootNode.itemId]));

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedNodes(newExpanded);
  };

  // Garante que o nó raiz sempre comece expandido se tiver filhos
  React.useEffect(() => {
    if (rootNode.ingredients && rootNode.ingredients.length > 0) {
        setExpandedNodes(prev => new Set(prev).add(rootNode.itemId));
    }
  }, [rootNode.itemId, rootNode.ingredients]);

  const renderRow = (node: CalculationResult, depth: number = 0, parentPath: string[] = []) => {
    const hasChildren = node.ingredients && node.ingredients.length > 0;
    const isExpanded = expandedNodes.has(node.itemId);
    const currentPath = [...parentPath, node.itemId];
    
    // Identação visual
    const paddingLeft = depth * 24;
    
    return (
      <React.Fragment key={currentPath.join('-')}>
        <div className={cn(
          "flex flex-col md:grid md:grid-cols-12 gap-4 items-center p-4 md:py-3 border-b transition-colors duration-200",
          "border-t10-blue-4/20 dark:border-t10-dark-surfaceBorder", // Border color
          "hover:bg-t10-blue-2/10 dark:hover:bg-t10-dark-surface/50", // Hover effect
          depth === 0 ? "bg-t10-blue-2/20 dark:bg-t10-dark-surface/30" : "" // Depth 0 background
        )}>
          {/* Coluna 1: Item / Receita */}
          <div className="w-full md:col-span-4 flex items-center justify-between md:justify-start" 
               style={{ paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${Math.max(0, paddingLeft - 20)}px` : '0px' }}>
            <div className="flex items-center w-full">
               {/* Linhas de conexão para filhos (Apenas Desktop) */}
               {depth > 0 && (
                <div className="hidden md:flex w-6 h-full justify-center items-center relative mr-2">
                   {hasChildren && (
                    <>
                      <div className="absolute top-0 bottom-1/2 left-1/2 w-px bg-t10-blue-4/50 dark:bg-gray-600 -translate-x-1/2"></div>
                      <div className="absolute top-1/2 left-1/2 w-4 h-px bg-t10-blue-4/50 dark:bg-gray-600"></div>
                    </>
                   )}
                </div>
               )}

              {/* Botão Expandir/Colapsar se tiver filhos */}
              {hasChildren ? (
                <button 
                  onClick={() => toggleExpand(node.itemId)}
                  className={cn(
                    "mr-2 p-1 rounded-full transition-all duration-200 border",
                    isExpanded 
                      ? "bg-t10-blue-1/20 text-t10-blue-1 border-t10-blue-1/30 hover:bg-t10-blue-1/30 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30 dark:hover:bg-indigo-500/30" 
                      : "bg-white text-t10-blue-4 border-t10-blue-4/30 hover:bg-t10-blue-2/30 hover:text-t10-blue-3 dark:bg-t10-dark-surface dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  )}
                >
                  {isExpanded ? <ChevronDown size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
                </button>
              ) : (
                <div className="w-[22px] mr-2 hidden md:block"></div> // Espaçamento ajustado para alinhar (apenas desktop)
              )}

              {/* Nome do Item e Ícone (placeholder) */}
              <div className="flex items-center gap-2 flex-grow min-w-0">
                 {/* Indicador de profundidade mobile (pontos coloridos) */}
                 {depth > 0 && (
                   <div className="flex md:hidden mr-1">
                     {Array.from({ length: depth }).map((_, i) => (
                       <div key={i} className="w-1 h-3 bg-t10-blue-4/20 dark:bg-gray-700 rounded-full mr-0.5"></div>
                     ))}
                   </div>
                 )}

                 {/* Ícone */}
                 <div className="w-8 h-8 bg-t10-blue-1/10 dark:bg-t10-dark-surface rounded border border-t10-blue-4/30 dark:border-t10-dark-surfaceBorder flex-shrink-0 flex items-center justify-center text-xs text-t10-blue-4 dark:text-gray-400 overflow-hidden">
                    {node.itemName.substring(0, 2).toUpperCase()}
                 </div>
                 
                 {/* Nome (quebra de linha permitida no mobile) */}
                 <span className={cn(
                   "text-sm font-medium break-words leading-tight", 
                   depth === 0 ? "text-t10-blue-1 dark:text-t10-dark-textHighlight" : "text-t10-blue-3 dark:text-t10-dark-textPrimary"
                 )}>
                   {node.itemName}
                 </span>
              </div>
            </div>
          </div>

          {/* Wrapper Grid para Mobile (Dados) */}
          <div className="grid grid-cols-2 gap-3 w-full md:contents">
            
            {/* Coluna 2: Qtd Base (Necessária) */}
            <div className="col-span-1 md:col-span-1 flex flex-col md:block text-left md:text-center">
               <span className="md:hidden text-[10px] text-t10-blue-4 dark:text-gray-500 font-bold uppercase mb-1">Necessário</span>
               <span className="text-t10-blue-4 dark:text-gray-400 font-mono text-sm">
                 {node.quantityNeeded.toLocaleString()}
               </span>
            </div>

            {/* Coluna 3: Meu Estoque (Input) */}
            <div className="col-span-2 md:col-span-2 flex flex-col md:block">
              <span className="md:hidden text-[10px] text-t10-blue-4 dark:text-gray-500 font-bold uppercase mb-1">Estoque</span>
              <div className={cn(
                "relative rounded transition-colors border",
                (inventory.get(node.itemId) || 0) === 0 
                  ? "bg-t10-palette-stockBg dark:bg-t10-dark-stockBg border-transparent dark:border-t10-dark-stockBorder" 
                  : "bg-transparent border-transparent"
              )}>
                <input
                  type="number"
                  min="0"
                  value={inventory.get(node.itemId) || ''}
                  placeholder="-"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onInventoryChange(node.itemId, isNaN(val) ? 0 : val);
                  }}
                  className={cn(
                    "w-full border rounded px-2 py-1 text-center focus:ring-1 outline-none transition-all appearance-none",
                    (inventory.get(node.itemId) || 0) === 0 
                      ? "bg-transparent border-transparent text-t10-palette-stockText dark:text-t10-dark-stockText font-semibold placeholder-t10-palette-stockText/50 dark:placeholder-t10-dark-stockText/50" 
                      : "bg-white dark:bg-t10-dark-base border-t10-blue-4/30 dark:border-gray-700 text-t10-palette-emeraldGreen dark:text-emerald-400 font-semibold focus:ring-t10-palette-emeraldGreen"
                  )}
                />
                {(inventory.get(node.itemId) || 0) > 0 && (inventory.get(node.itemId)! >= node.quantityNeeded) && (
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 text-t10-palette-emeraldGreen pointer-events-none text-xs">✓</span>
                )}
              </div>
            </div>

            {/* Coluna 4: Faltam? */}
            <div className="col-span-1 md:col-span-1 flex flex-col md:block text-left md:text-center">
               <span className="md:hidden text-[10px] text-t10-blue-4 dark:text-gray-500 font-bold uppercase mb-1">Restante</span>
               <div className={cn(
                 "flex items-center md:justify-center gap-1 py-1 px-2 rounded border w-fit md:w-auto",
                 node.quantityMissing > 0 
                   ? "bg-t10-palette-remainingBg dark:bg-t10-dark-remainingBg text-t10-palette-remainingText dark:text-t10-dark-remainingText border-transparent dark:border-t10-dark-remainingBorder dark:shadow-[0_0_8px_rgba(239,68,68,0.4)]" 
                   : "text-t10-blue-4/50 dark:text-gray-500 border-transparent"
               )}>
                 {node.quantityMissing > 0 && <span className="text-[10px]">⚠️</span>}
                 {node.quantityMissing > 0 ? node.quantityMissing.toLocaleString() : "-"}
               </div>
            </div>

            {/* Coluna 5: Preço Unit. */}
            <div className="col-span-2 md:col-span-2 flex flex-col md:block">
              <span className="md:hidden text-[10px] text-t10-blue-4 dark:text-gray-500 font-bold uppercase mb-1">Preço Unitário</span>
              <div className="relative">
                {(!node.marketPrice && !node.npcPrice && !ITEMS[node.itemId].isMarketable) ? (
                   <span className="text-t10-blue-4/50 dark:text-gray-600 text-sm">-</span>
                ) : (
                  <>
                    <input
                      type="number"
                      min="0"
                      value={(marketPrices.get(node.itemId) ?? (node.marketPrice || node.npcPrice || 0)) || ''}
                      placeholder="-"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onPriceChange(node.itemId, isNaN(val) ? 0 : val);
                      }}
                      className="w-full bg-white dark:bg-t10-dark-base border border-t10-blue-4/30 dark:border-t10-dark-surfaceBorder rounded px-2 py-1 text-center text-t10-blue-3 dark:text-t10-dark-textPrimary focus:ring-1 focus:ring-t10-blue-1 dark:focus:ring-t10-dark-textHighlight focus:border-t10-blue-1 dark:focus:border-t10-dark-textHighlight outline-none text-xs disabled:opacity-50 appearance-none"
                    />
                  </>
                )}
              </div>
               {node.ingredients && node.ingredients.length > 0 && (
                   <div className="text-[10px] text-gray-500 mt-1 text-right pr-2"></div>
               )}
            </div>

            {/* Coluna 6: Custo Total */}
            <div className="col-span-2 md:col-span-2 flex flex-col md:block text-left md:text-right md:pr-4">
               <span className="md:hidden text-[10px] text-t10-blue-4 dark:text-gray-500 font-bold uppercase mb-1">Custo Total</span>
               <div className="text-sm font-medium">
                 <div className={cn(
                   "py-1 px-2 rounded flex items-center md:justify-end gap-1 w-fit md:w-auto",
                   (node.totalCost && node.totalCost > 0 && !['incenso-sonho', 'po-devaneio'].includes(node.itemId))
                     ? "bg-t10-palette-totalCostBg dark:bg-t10-dark-totalCostBg text-t10-palette-totalCostText dark:text-t10-dark-totalCostText font-bold dark:shadow-[0_0_10px_rgba(52,211,153,0.3)]" 
                     : "text-t10-blue-3 dark:text-t10-dark-textSecondary"
                 )}>
                    {(() => {
                        if (['incenso-sonho', 'po-devaneio'].includes(node.itemId)) {
                            return <span className="text-t10-blue-4/50 dark:text-gray-600">-</span>;
                        }
                        if (node.totalCost && node.totalCost > 0) {
                            return (
                                <>
                                    <span className="text-xs text-emerald-500 dark:text-emerald-400">💰</span>
                                    {node.totalCost.toLocaleString()}
                                </>
                            );
                        }
                        return <span className="text-t10-blue-4/50 dark:text-gray-600">-</span>;
                    })()}
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Renderizar filhos recursivamente */}
        {hasChildren && isExpanded && (
          <div className="contents">
            {node.ingredients!.map((child, index) => (
              renderRow(
                  child, 
                  depth + 1, 
                  currentPath
              )
            ))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-t10-dark-surface rounded-lg shadow-xl border border-t10-blue-4/30 dark:border-t10-dark-surfaceBorder text-t10-blue-3 dark:text-t10-dark-textSecondary transition-colors duration-300 flex flex-col">
      {/* Mobile/Tablet Card View Wrapper (No min-width enforcement on container level, handled by inner logic) */}
      <div className="w-full">
         {/* Desktop Header (Hidden on Mobile) */}
         <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-t10-blue-1/10 dark:bg-t10-dark-base text-xs font-semibold text-t10-blue-1 dark:text-t10-dark-textHeader uppercase tracking-wider border-b border-t10-blue-4/30 dark:border-t10-dark-surfaceBorder">
            <div className="col-span-4">Item / Receita</div>
            <div className="col-span-1 text-center">Necessário</div>
            <div className="col-span-2 text-center">Estoque</div>
            <div className="col-span-1 text-center">Restante</div>
            <div className="col-span-2 text-center">Preço</div>
            <div className="col-span-2 text-right pr-4">Custo Total</div>
         </div>

         {/* Corpo da Tabela */}
         <div className="flex flex-col">
            {renderRow(rootNode)}
         </div>
      </div>
    </div>
  );
}
