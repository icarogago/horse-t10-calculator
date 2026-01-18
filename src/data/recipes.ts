import type { Recipe } from '../types';

export const RECIPES: Record<string, Recipe[]> = {
  'incenso-sonho': [{
    outputItemId: 'incenso-sonho',
    ingredients: [
      { itemId: 'incensario-lua', quantity: 1 },
      { itemId: 'po-devaneio', quantity: 10 },
      { itemId: 'pluma-devaneio', quantity: 10 },
      { itemId: 'chifre-fogo', quantity: 10 },
      { itemId: 'po-chama', quantity: 10 }
    ]
  }],
  
  'incensario-lua': [
    {
      outputItemId: 'incensario-lua',
      method: 'method-1-cheap',
      ingredients: [
        { itemId: 'molde-incensario', quantity: 1 },
        { itemId: 'essencia-platina', quantity: 100 },
        { itemId: 'essencia-cobre', quantity: 100 },
        { itemId: 'essencia-estanho', quantity: 100 },
        { itemId: 'opala-lunar', quantity: 100 }
      ]
    },
    {
      outputItemId: 'incensario-lua',
      method: 'method-2-popular', // PADRÃO
      ingredients: [
        { itemId: 'molde-incensario', quantity: 1 },
        { itemId: 'melodia-estrelas', quantity: 25 },
        { itemId: 'essencia-cobre', quantity: 100 },
        { itemId: 'essencia-estanho', quantity: 100 },
        { itemId: 'cristal-pedra-luz', quantity: 300 }
      ]
    },
    {
      outputItemId: 'incensario-lua',
      method: 'method-3-fast',
      ingredients: [
        { itemId: 'molde-incensario', quantity: 1 },
        { itemId: 'cristal-pedra-luz', quantity: 300 },
        { itemId: 'catalisador-alquimia', quantity: 400 },
        { itemId: 'barra-cobre', quantity: 1000 },
        { itemId: 'barra-estanho', quantity: 1000 }
      ]
    }
  ],
  
  'po-devaneio': [{
    outputItemId: 'po-devaneio',
    ingredients: [
      { itemId: 'flor-errante', quantity: 10 },
      { itemId: 'raiz-samambaia', quantity: 10 },
      { itemId: 'erva-eterna', quantity: 10 },
      { itemId: 'fruto-natureza', quantity: 10 },
      { itemId: 'po-pedra-negra', quantity: 10 }
    ]
  }]
};
