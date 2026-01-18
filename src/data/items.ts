import type { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  // --- ITEM FINAL ---
  'incenso-sonho': {
    id: 'incenso-sonho',
    name: 'Incenso que Chama o Sonho',
    isCraftable: true,
    isMarketable: false,
    acquisitionMethod: 'craft'
  },

  // --- COMPONENTES PRINCIPAIS ---
  'incensario-lua': {
    id: 'incensario-lua',
    name: 'Incensário da Lua Minguante',
    isCraftable: true,
    isMarketable: false,
    acquisitionMethod: 'craft'
  },
  'po-devaneio': {
    id: 'po-devaneio',
    name: 'Pó de Devaneio',
    isCraftable: true,
    isMarketable: false,
    acquisitionMethod: 'craft'
  },
  'pluma-devaneio': {
    id: 'pluma-devaneio',
    name: 'Pluma de Devaneio',
    isCraftable: false, // Drop/Quest
    isMarketable: true,
    marketId: 757010,
    acquisitionMethod: 'farm',
    acquisitionNote: 'Quests semanais/diárias de Liana ou drops de chefe'
  },
  'chifre-fogo': {
    id: 'chifre-fogo',
    name: 'Chifre de Fogo',
    isCraftable: false, // Coleta
    isMarketable: true,
    marketId: 6185,
    acquisitionMethod: 'market',
    acquisitionNote: 'Coleta (Caça/Açougue)'
  },
  'po-chama': {
    id: 'po-chama',
    name: 'Pó de Chama',
    isCraftable: false, // Node/Coleta
    isMarketable: true,
    marketId: 4802,
    acquisitionMethod: 'market',
    acquisitionNote: 'Nodes de mineração'
  },

  // --- MATERIAIS PARA INCENSÁRIO DA LUA MINGUANTE ---
  'molde-incensario': {
    id: 'molde-incensario',
    name: 'Molde de Incensário da Lua Minguante',
    isCraftable: false,
    isMarketable: false,
    npcPrice: 10000000,
    acquisitionMethod: 'npc',
    acquisitionNote: 'Vendido por Gerente de Lua Minguante'
  },
  'essencia-platina': {
    id: 'essencia-platina',
    name: 'Essência de Platina Pura',
    isCraftable: true, // Processamento
    isMarketable: true,
    marketId: 4259,
    acquisitionMethod: 'market'
  },
  'essencia-cobre': {
    id: 'essencia-cobre',
    name: 'Essência de Cobre Puro',
    isCraftable: true,
    isMarketable: true,
    marketId: 4059,
    acquisitionMethod: 'market'
  },
  'essencia-estanho': {
    id: 'essencia-estanho',
    name: 'Essência de Estanho Puro',
    isCraftable: true,
    isMarketable: true,
    marketId: 4062,
    acquisitionMethod: 'market'
  },
  'opala-lunar': {
    id: 'opala-lunar',
    name: 'Opala Lunar',
    isCraftable: true,
    isMarketable: true,
    marketId: 4266,
    acquisitionMethod: 'market'
  },
  'melodia-estrelas': {
    id: 'melodia-estrelas',
    name: 'Melodia das Estrelas',
    isCraftable: true, // Aquecimento
    isMarketable: false,
    acquisitionMethod: 'farm',
    acquisitionNote: 'Aquecimento de acessórios azuis (PRI+)'
  },
  'cristal-pedra-luz': {
    id: 'cristal-pedra-luz',
    name: 'Cristal Mágico de Pedra de Luz',
    isCraftable: false, // Troca
    isMarketable: false,
    acquisitionMethod: 'exchange',
    acquisitionNote: 'Troca de pedras de luz com Dalishain'
  },
  'catalisador-alquimia': {
    id: 'catalisador-alquimia',
    name: 'Catalisador de Alquimia Lua Minguante',
    isCraftable: false,
    isMarketable: false,
    npcPrice: 3500000,
    acquisitionMethod: 'npc',
    acquisitionNote: 'Vendido por Gerente de Lua Minguante'
  },
  'barra-cobre': {
    id: 'barra-cobre',
    name: 'Barra de Cobre',
    isCraftable: true,
    isMarketable: true,
    marketId: 4058,
    acquisitionMethod: 'market'
  },
  'barra-estanho': {
    id: 'barra-estanho',
    name: 'Barra de Estanho',
    isCraftable: true,
    isMarketable: true,
    marketId: 4061,
    acquisitionMethod: 'market'
  },

  // --- MATERIAIS PARA PÓ DE DEVANEIO ---
  'flor-errante': {
    id: 'flor-errante',
    name: 'Flor de Errante',
    isCraftable: false,
    isMarketable: false,
    acquisitionMethod: 'farm',
    acquisitionNote: 'Entrega de cavalo imperial (exceto Corcel Lendário)'
  },
  'raiz-samambaia': {
    id: 'raiz-samambaia',
    name: 'Raiz de Samambaia',
    isCraftable: false,
    isMarketable: false,
    acquisitionMethod: 'farm',
    acquisitionNote: 'Quests diárias/semanais (Wapra)'
  },
  'erva-eterna': {
    id: 'erva-eterna',
    name: 'Erva Eterna',
    isCraftable: false, // Coleta
    isMarketable: true,
    marketId: 5406,
    acquisitionMethod: 'market'
  },
  'fruto-natureza': {
    id: 'fruto-natureza',
    name: 'Fruto da Natureza',
    isCraftable: false, // Coleta/Farming
    isMarketable: true,
    marketId: 5205,
    acquisitionMethod: 'market'
  },
  'po-pedra-negra': {
    id: 'po-pedra-negra',
    name: 'Pó de Pedra Negra',
    isCraftable: true, // Moagem
    isMarketable: true,
    marketId: 4901,
    acquisitionMethod: 'market'
  }
};
