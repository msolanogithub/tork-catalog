import type { Banner } from '../types';
import { fetchSheetData } from './SheetFetcher';
import { CacheService } from './CacheService';
import { ConfigService } from './ConfigService';
import { DEFAULT_CACHE_MINUTES } from '../config';

const CACHE_KEY = 'tk_banners';

export class BannerService {
  static async getBanners(): Promise<Banner[]> {
    const cached = CacheService.get<Banner[]>(CACHE_KEY);
    if (cached) return cached;

    try {
      const config = await ConfigService.getConfig();
      const rawData = await fetchSheetData('Banners');

      const banners: Banner[] = rawData
        .map(row => ({
          id: row.id || '',
          title: row.title || '',
          subtitle: row.subtitle || '',
          image: row.image || '',
          button_text: row.button_text || '',
          button_link: row.button_link || '',
          active: row.active === 'true' || row.active === '1' || row.active === 'TRUE',
          display_order: Number(row.display_order) || 0
        }))
        .filter(b => b.active && b.id)
        .sort((a, b) => a.display_order - b.display_order);

      CacheService.set(CACHE_KEY, banners, config.cache_minutes || DEFAULT_CACHE_MINUTES);
      return banners;
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      return [];
    }
  }
}
