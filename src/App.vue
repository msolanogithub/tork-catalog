<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useConfigStore } from './stores/config';
import { useCategoryStore } from './stores/category';
import { useProductStore } from './stores/product';
import { useCartStore } from './stores/cart';

const configStore = useConfigStore();
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const cartStore = useCartStore();

const isAppLoading = computed(() => {
  return configStore.loading || categoryStore.loading || productStore.loading;
});

onMounted(async () => {
  cartStore.loadCart();
  try {
    await configStore.loadConfig();
    await Promise.all([
      categoryStore.loadCategories(),
      productStore.loadProducts()
    ]);
  } catch (error) {
    console.error('Initialization error:', error);
  }
});
</script>

<template>
  <div v-if="isAppLoading && !configStore.initialized" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
    <div class="relative w-24 h-24">
      <div class="absolute inset-0 rounded-full border-4 border-t-brand-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      <div class="absolute inset-2 rounded-full border-4 border-b-brand-accent border-t-transparent border-r-transparent border-l-transparent animate-spin-reverse"></div>
    </div>
    <span class="mt-6 text-xs uppercase tracking-[0.3em] text-brand-accent animate-pulse font-display">Cargando Catálogo</span>
  </div>
  
  <router-view v-else />
</template>

<style>
@keyframes spin-reverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}
.animate-spin-reverse {
  animation: spin-reverse 1.2s linear infinite;
}
</style>
