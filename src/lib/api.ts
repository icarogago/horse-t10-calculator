import type { Item } from '../types';

export const API_CONFIG = {
  baseUrl: 'https://api.arsha.io/v2',
  region: 'sa', // South America
  lang: 'pt',
  cacheKey: 't10-market-cache-v1',
  cacheTimeout: 30 * 60 * 1000 // 30 minutes
};

interface MarketPriceResponse {
  id: number;
  sid: number;
  minPrice: number;
  maxPrice: number;
  basePrice: number;
  currentStock: number;
  totalTrades: number;
  pricePerOne: number;
  count: number;
  lastSoldPrice: number;
  lastSoldTime: number;
}

/**
 * Checks cache age in minutes
 */
function getCacheAge(): number | null {
  const cache = localStorage.getItem(API_CONFIG.cacheKey);
  if (!cache) return null;
  try {
    const parsed = JSON.parse(cache);
    const ageMs = Date.now() - parsed.timestamp;
    return Math.floor(ageMs / 60000);
  } catch {
    return null;
  }
}

/**
 * Returns the last update timestamp from cache
 */
export function getLastUpdateTimestamp(): number | null {
  const cache = localStorage.getItem(API_CONFIG.cacheKey);
  if (!cache) return null;
  try {
    const parsed = JSON.parse(cache);
    return parsed.timestamp;
  } catch {
    return null;
  }
}

/**
 * Fetches market prices for a list of items
 */
export async function fetchMarketPrices(items: Item[], forceRefresh = false): Promise<Map<string, number> | null> {
  // 1. Filter items that have marketId
  const marketableItems = items.filter(item => item.isMarketable && item.marketId);
  
  if (marketableItems.length === 0) {
    console.warn('No marketable items with IDs found.');
    return null;
  }

  // 2. Check Cache (unless forced)
  if (!forceRefresh) {
    const cacheAge = getCacheAge();
    if (cacheAge !== null && cacheAge < 30) {
      console.log(`Using cached prices (${cacheAge} min old)`);
      try {
        const cachedData = JSON.parse(localStorage.getItem(API_CONFIG.cacheKey)!);
        return new Map(cachedData.data); // data is [itemId, price][]
      } catch (e) {
        console.error('Error reading cache', e);
      }
    }
  }

  // 3. Prepare IDs
  const ids = marketableItems.map(item => item.marketId).join(',');
  const url = `${API_CONFIG.baseUrl}/${API_CONFIG.region}/item?id=${ids}&lang=${API_CONFIG.lang}`;

  try {
    console.log(`Fetching prices from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const results: MarketPriceResponse[] = Array.isArray(data) ? data : (data.data || [data]);
    
    // 4. Map results back to our Item IDs
    // We need to map BDO ID -> Item ID (string)
    const priceMap = new Map<string, number>();
    
    // Create a lookup for marketId -> itemId
    const marketIdToItemId = new Map<number, string>();
    marketableItems.forEach(item => {
      if (item.marketId) marketIdToItemId.set(item.marketId, item.id);
    });

    results.forEach(res => {
      const localId = marketIdToItemId.get(res.id);
      if (localId && res.basePrice) {
        priceMap.set(localId, res.basePrice);
      }
    });

    // 5. Save to Cache
    if (priceMap.size > 0) {
      localStorage.setItem(API_CONFIG.cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: Array.from(priceMap.entries())
      }));
    }

    return priceMap;

  } catch (error) {
    console.error('Failed to fetch market prices:', error);
    return null;
  }
}
