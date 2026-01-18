import { calculateMaterials } from './lib/calculator';
import { ITEMS } from './data/items';

// Simulando um teste simples
console.log('--- TESTE DE LÓGICA: CALCULADORA T10 ---');

// Cenário 1: 1 Incenso, Método Padrão, Sem Inventário
console.log('\n>> Cenário 1: 1 Incenso, Método Padrão, Zero Inventário');
const result1 = calculateMaterials(
  'incenso-sonho',
  1,
  'method-2-popular',
  new Map()
);

console.log(`Custo Total Estimado: ${result1.totalCost.toLocaleString()} prata`);
console.log('Materiais Faltantes:');
result1.incompleteItems.forEach(item => {
  console.log(`- ${item.itemName}: Precisa ${item.quantityNeeded} | Falta ${item.quantityMissing}`);
});

// Cenário 2: 5 Incensos, Método Barato, Com Inventário Parcial
console.log('\n>> Cenário 2: 5 Incensos, Método Barato, Inventário Parcial');
const mockInventory = new Map<string, number>([
  ['essencia-platina', 500], // Tem tudo
  ['po-chama', 10] // Tem parcial (precisa 50)
]);

const result2 = calculateMaterials(
  'incenso-sonho',
  5,
  'method-1-cheap',
  mockInventory
);

console.log(`Economia pelo Inventário: ${result2.savedByInventory.toLocaleString()} prata`);
console.log('Itens Completos (Verde):');
result2.completeItems.forEach(item => {
  console.log(`[OK] ${item.itemName}: Tem ${item.quantityOwned} / ${item.quantityNeeded}`);
});

console.log('Itens Incompletos (Vermelho):');
result2.incompleteItems.forEach(item => {
  console.log(`[X] ${item.itemName}: Tem ${item.quantityOwned} / ${item.quantityNeeded} (Falta ${item.quantityMissing})`);
});
