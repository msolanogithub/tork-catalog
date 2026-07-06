import type { Product } from '../types';
import { fetchSheetData } from './SheetFetcher';
import { CacheService } from './CacheService';
import { ConfigService } from './ConfigService';
import { DEFAULT_CACHE_MINUTES } from '../config';

const CACHE_KEY = 'tk_products';

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    const cached = CacheService.get<Product[]>(CACHE_KEY);
    if (cached) return cached;

    try {
      const config = await ConfigService.getConfig();
      const rawData = await fetchSheetData('Products');

      const cleanNum = (val: string): number => {
        if (!val) return 0;
        const cleaned = val.replace(/[^0-9.-]/g, '');
        return Number(cleaned) || 0;
      };

      const products: Product[] = rawData
        .map(row => {
          const name = row.name || '';
          const category_name = row.category_name || '';
          const sku = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const category_id = category_name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const brand = name.split(' ')[0] || 'Premium';
          
          return {
            category_name,
            name,
            description: row.description || '',
            price: cleanNum(row.price),
            stock: cleanNum(row.stock),
            active: row.active === 'true' || row.active === '1' || row.active === 'TRUE',
            display_order: cleanNum(row.display_order),
            main_image: row.main_image || '',
            sku,
            slug: sku,
            category_id,
            brand,
            previous_price: null,
            new: false,
            featured: false
          };
        })
        .filter(prod => prod.active && prod.name)
        .sort((a, b) => a.display_order - b.display_order);

      CacheService.set(CACHE_KEY, products, config.cache_minutes || DEFAULT_CACHE_MINUTES);
      return products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }
}
