import { defineStore } from 'pinia';
import type { Category } from '../types';
import { CategoryService } from '../services/CategoryService';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    initialized: false
  }),
  actions: {
    async loadCategories(force = false) {
      if (this.initialized && !force) return;
      this.loading = true;
      try {
        this.categories = await CategoryService.getCategories();
        this.initialized = true;
      } catch (error) {
        console.error('Failed to load categories in store:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  getters: {
    getCategoryById: (state) => (id: string) => state.categories.find(c => c.id === id),
    getCategoryBySlug: (state) => (slug: string) => state.categories.find(c => c.slug === slug)
  }
});
