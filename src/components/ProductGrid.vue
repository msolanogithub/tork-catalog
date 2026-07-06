<script setup lang="ts">
import type { Product } from '../types';
import ProductCard from './ProductCard.vue';

defineProps<{
  products: Product[];
}>();
</script>

<template>
  <div v-if="products.length > 0" class="flex flex-col gap-6">
    <ProductCard 
      v-for="product in products" 
      :key="product.sku" 
      :product="product" 
    />
  </div>
  <div v-else class="flex flex-col items-center justify-center py-12 text-center border border-dashed border-brand-border rounded-xl bg-brand-section">
    <span class="material-icons text-3xl text-brand-gray/50 mb-2">search_off</span>
    <h3 class="font-display font-bold text-xs text-white">No se encontraron productos</h3>
    <p class="text-[10px] text-brand-gray mt-1 max-w-[200px]">Intenta buscando con palabras clave diferentes.</p>
  </div>
</template>
