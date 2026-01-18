import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import type { CalculationResult, CalculationSummary, InventoryMap } from '../types';

export function calculateMaterialTree(
  itemId: string,
  quantityNeeded: number,
  methodId: string,
  userInventory: InventoryMap,
  marketPrices: Map<string, number> = new Map()
): CalculationResult | null {
  const item = ITEMS[itemId];
  if (!item) return null;

  const quantityOwned = userInventory.get(itemId) || 0;
  // Se temos o item, não precisamos craftar/comprar o que já temos.
  // O "quantityNeeded" aqui é o quanto o PAI precisa.
  // O "quantityMissing" é o quanto realmente falta para satisfazer o pai.
  const quantityMissing = Math.max(0, quantityNeeded - quantityOwned);
  const isComplete = quantityMissing === 0;

  let unitPrice = 0;
  if (marketPrices.has(itemId)) {
    unitPrice = marketPrices.get(itemId)!;
  } else if (item.marketPrice) {
    unitPrice = item.marketPrice;
  } else if (item.npcPrice) {
    unitPrice = item.npcPrice;
  }

  const result: CalculationResult = {
    itemId,
    itemName: item.name,
    quantityNeeded,
    quantityOwned,
    quantityMissing,
    acquisitionMethod: item.acquisitionMethod,
    npcPrice: item.npcPrice,
    marketPrice: item.marketPrice,
    isComplete,
    totalCost: 0,
    ingredients: []
  };

  // Se falta item e ele é craftável, processamos os ingredientes
  if (quantityMissing > 0 && item.isCraftable) {
    const recipes = RECIPES[itemId];
    if (recipes && recipes.length > 0) {
      // Seleciona receita baseada no método
      let recipe = recipes[0];
      if (recipes.length > 1 && methodId) {
        const found = recipes.find(r => r.method === methodId);
        if (found) recipe = found;
      }

      // Calcula ingredientes para a quantidade que FALTA
      // Se precisamos de 10 e temos 2, calculamos ingredientes para 8.
      let ingredientsCost = 0;
      const ingredients: CalculationResult[] = [];
      
      recipe.ingredients.forEach(ing => {
        const childNode = calculateMaterialTree(
          ing.itemId,
          ing.quantity * quantityMissing,
          methodId,
          userInventory,
          marketPrices
        );
        
        if (childNode) {
          ingredients.push(childNode);
          ingredientsCost += childNode.totalCost || 0;
        }
      });

      result.ingredients = ingredients;
      result.totalCost = ingredientsCost;
    } else {
      // Craftable mas sem receita (erro de dados?), trata como compravel
      result.totalCost = quantityMissing * unitPrice;
    }
  } else {
    // Se não é craftável ou já temos tudo, o custo é comprar o que falta
    // Se isComplete, quantityMissing é 0, logo custo é 0.
    result.totalCost = quantityMissing * unitPrice;
  }

  return result;
}

/**
 * Calcula materiais necessários considerando inventário do usuário
 * Retorna estrutura de árvore para exibição hierárquica
 */
export function calculateMaterials(
  targetItemId: string,
  quantity: number,
  methodId: string,
  userInventory: InventoryMap,
  marketPrices: Map<string, number> = new Map()
): CalculationSummary {
  const rootNode = calculateMaterialTree(targetItemId, quantity, methodId, userInventory, marketPrices);
  
  if (!rootNode) {
    return {
      totalNpcCost: 0,
      totalMarketCost: 0,
      totalCost: 0,
      savedByInventory: 0,
      results: [],
      incompleteItems: [],
      completeItems: []
    };
  }

  // Helper para extrair listas planas se necessário (mantendo compatibilidade parcial)
  // Mas para o novo layout, usaremos principalmente o rootNode.results
  
  return {
    totalNpcCost: 0, // Simplificação: Custo total agora está na árvore
    totalMarketCost: 0,
    totalCost: rootNode.totalCost || 0,
    savedByInventory: 0, // Pode ser calculado comparando custo total sem inventário vs com
    results: [rootNode], // Retorna o nó raiz na lista
    incompleteItems: [], // Deprecated para visualização em árvore
    completeItems: []    // Deprecated para visualização em árvore
  };
}
