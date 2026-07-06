import type { Category } from '../types';
import { fetchSheetData } from './SheetFetcher';
import { CacheService } from './CacheService';
import { ConfigService } from './ConfigService';
import { DEFAULT_CACHE_MINUTES } from '../config';

const CACHE_KEY = 'tk_categories';

export class CategoryService {
  static async getCategories(): Promise<Category[]> {
    const cached = CacheService.get<Category[]>(CACHE_KEY);
    if (cached) return cached;

    try {
      const config = await ConfigService.getConfig();
      const rawData = await fetchSheetData('Categories');
      
      const categories: Category[] = rawData
        .map(row => {
          const name = row.name || '';
          const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          return {
            name,
            description: row.description || '',
            display_order: Number(row.display_order) || 0,
            active: row.active === 'true' || row.active === '1' || row.active === 'TRUE',
            id,
            slug: id
          };
        })
        .filter(cat => cat.active && cat.name)
        .sort((a, b) => a.display_order - b.display_order);

      CacheService.set(CACHE_KEY, categories, config.cache_minutes || DEFAULT_CACHE_MINUTES);
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }
}
