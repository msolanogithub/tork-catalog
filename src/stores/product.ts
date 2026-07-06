import { defineStore } from 'pinia';
import type { Product } from '../types';
import { ProductService } from '../services/ProductService';

export type SortKey = 'featured' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    searchQuery: '',
    sortBy: 'featured' as SortKey,
    loading: false,
    initialized: false
  }),
  actions: {
    async loadProducts(force = false) {
      if (this.initialized && !force) return;
      this.loading = true;
      try {
        this.products = await ProductService.getProducts();
        this.initialized = true;
      } catch (error) {
        console.error('Failed to load products in store:', error);
      } finally {
        this.loading = false;
      }
    },
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
    setSortBy(sort: SortKey) {
      this.sortBy = sort;
    }
  },
  getters: {
    featuredProducts: (state) => {
      return state.products.filter(p => p.featured);
    },
    getProductBySlug: (state) => (slug: string) => {
      return state.products.find(p => p.slug === slug);
    },
    getFilteredProducts: (state) => (categoryId?: string) => {
      let result = [...state.products];

      if (categoryId) {
        result = result.filter(p => p.category_id === categoryId);
      }

      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim();
        result = result.filter(p => {
          return p.name.toLowerCase().includes(query) ||
                 p.brand.toLowerCase().includes(query) ||
                 p.sku.toLowerCase().includes(query) ||
                 p.description.toLowerCase().includes(query);
        });
      }

      if (state.sortBy === 'featured') {
        result.sort((a, b) => {
          if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
          }
          return a.display_order - b.display_order;
        });
      } else if (state.sortBy === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (state.sortBy === 'name-desc') {
        result.sort((a, b) => b.name.localeCompare(a.name));
      } else if (state.sortBy === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (state.sortBy === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (state.sortBy === 'newest') {
        result.sort((a, b) => {
          if (a.new !== b.new) {
            return a.new ? -1 : 1;
          }
          return a.display_order - b.display_order;
        });
      }

      return result;
    },
    getRelatedProducts: (state) => (product: Product, limit = 4) => {
      return state.products
        .filter(p => p.sku !== product.sku && (p.category_id === product.category_id || p.brand === product.brand))
        .slice(0, limit);
    }
  }
});
