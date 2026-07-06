import { defineStore } from 'pinia';
import type { Config } from '../types';
import { ConfigService } from '../services/ConfigService';

export const useConfigStore = defineStore('config', {
  state: () => ({
    config: null as Config | null,
    loading: false,
    initialized: false
  }),
  actions: {
    async loadConfig(force = false) {
      if (this.initialized && !force) return;
      this.loading = true;
      try {
        this.config = await ConfigService.getConfig();
        this.initialized = true;
      } catch (error) {
        console.error('Failed to load config in store:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});
