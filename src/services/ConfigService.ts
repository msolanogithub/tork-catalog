import type { Config } from '../types';
import { fetchSheetData } from './SheetFetcher';
import { CacheService } from './CacheService';
import { DEFAULT_CACHE_MINUTES } from '../config';

const CACHE_KEY = 'tk_config';

export class ConfigService {
  static async getConfig(): Promise<Config> {
    const cached = CacheService.get<Config>(CACHE_KEY);
    if (cached) {
      this.applyColors(cached);
      return cached;
    }

    try {
      const rawData = await fetchSheetData('Config');
      const config = this.parseConfig(rawData);
      const ttl = config.cache_minutes || DEFAULT_CACHE_MINUTES;
      CacheService.set(CACHE_KEY, config, ttl);
      this.applyColors(config);
      return config;
    } catch (error) {
      console.error('Failed to fetch config, using fallback settings:', error);
      const fallback = this.parseConfig([]);
      this.applyColors(fallback);
      return fallback;
    }
  }

  private static parseConfig(rows: Record<string, string>[]): Config {
    const config: Partial<Config> = {};
    
    if (rows.length > 0) {
      const firstRow = rows[0];
      const keys = Object.keys(firstRow);
      
      const isKeyValue = keys.length === 2 || 
        keys.some(k => k.toLowerCase() === 'key' || k.toLowerCase() === 'campo') ||
        keys.some(k => k.toLowerCase() === 'value' || k.toLowerCase() === 'valor');

      if (isKeyValue) {
        const keyCol = keys[0];
        const valCol = keys[1];
        rows.forEach(row => {
          const key = row[keyCol]?.trim();
          const val = row[valCol]?.trim();
          if (key) {
            (config as any)[key] = val;
          }
        });
      } else {
        const row = rows[0];
        keys.forEach(key => {
          (config as any)[key] = row[key];
        });
      }
    }

    return {
      store_name: config.store_name || 'TK Accesorios',
      hero_title: config.hero_title || 'Premium Motorcycle Accessories',
      hero_subtitle: config.hero_subtitle || 'Gear up for the next race',
      whatsapp_number: config.whatsapp_number || '',
      facebook_url: config.facebook_url || '',
      instagram_url: config.instagram_url || '',
      cache_minutes: Number(config.cache_minutes) || DEFAULT_CACHE_MINUTES,
      hero_image: config.hero_image || '',
      logo: config.logo || '',
      primary_color: config.primary_color || '#39ff14',
      secondary_color: config.secondary_color || '#121212',
    };
  }

  private static applyColors(config: Config) {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', config.primary_color);
      root.style.setProperty('--color-secondary', config.secondary_color);
    }
  }
}
