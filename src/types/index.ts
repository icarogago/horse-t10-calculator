export interface Item {
  id: string;
  name: string;
  isCraftable: boolean;
  isMarketable: boolean;
  marketId?: number; // ID do BDO Database para API
  npcPrice?: number; // preço fixo de NPC (se aplicável)
  marketPrice?: number; // preço do mercado (editável pelo usuário)
  acquisitionMethod: 'npc' | 'market' | 'craft' | 'farm' | 'exchange';
  acquisitionNote?: string; // ex: "Entrega de cavalo imperial"
}

export interface RecipeIngredient {
  itemId: string;
  quantity: number;
}

export interface Recipe {
  outputItemId: string;
  ingredients: RecipeIngredient[];
  method?: string; // para identificar os 3 métodos do Incensário
}

export interface InventoryItem {
  itemId: string;
  quantityOwned: number;
}

export interface CalculationResult {
  itemId: string;
  itemName: string;
  quantityNeeded: number;
  quantityOwned: number;
  quantityMissing: number;
  acquisitionMethod: string;
  npcPrice?: number;
  marketPrice?: number;
  totalCost?: number;
  isComplete: boolean; // true se quantityOwned >= quantityNeeded
  ingredients?: CalculationResult[]; // Para estrutura de árvore/recursiva, se necessário visualizar
}

export interface CalculationSummary {
  totalNpcCost: number;
  totalMarketCost: number;
  totalCost: number;
  savedByInventory: number; // economia gerada pelo inventário
  results: CalculationResult[];
  incompleteItems: CalculationResult[]; // itens que ainda faltam
  completeItems: CalculationResult[]; // itens que o usuário já tem suficiente
}

// Para o sistema de inventário
export type InventoryMap = Map<string, number>;
