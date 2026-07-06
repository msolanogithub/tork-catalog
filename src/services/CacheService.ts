import type { CachePayload } from '../types';
import { APP_VERSION } from '../config';

export class CacheService {
  static get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const payload: CachePayload<T> = JSON.parse(cached);
      
      if (payload.version !== APP_VERSION) {
        localStorage.removeItem(key);
        return null;
      }

      const now = Date.now();
      if (now - payload.timestamp > payload.ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return payload.data;
    } catch (e) {
      console.error('Cache read error:', e);
      return null;
    }
  }

  static set<T>(key: string, data: T, ttlMinutes: number): void {
    try {
      const payload: CachePayload<T> = {
        data,
        timestamp: Date.now(),
        version: APP_VERSION,
        ttl: ttlMinutes * 60 * 1000
      };
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
      console.error('Cache write error:', e);
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
