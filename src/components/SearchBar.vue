<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProductStore } from '../stores/product';

const productStore = useProductStore();
const query = ref(productStore.searchQuery);

watch(() => productStore.searchQuery, (newVal) => {
  query.value = newVal;
});

const handleSearch = () => {
  productStore.setSearchQuery(query.value);
};

const clearSearch = () => {
  query.value = '';
  productStore.setSearchQuery('');
};
</script>

<template>
  <div class="relative w-full max-w-lg mx-auto px-4">
    <div class="absolute inset-y-0 left-4 pl-3.5 flex items-center pointer-events-none">
      <span class="material-icons text-brand-gray text-lg">search</span>
    </div>
    <input
      v-model="query"
      @input="handleSearch"
      type="text"
      placeholder="Buscar..."
      class="w-full bg-brand-section text-sm text-white placeholder-brand-gray border border-brand-border rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300"
    />
    <button
      v-if="query"
      @click="clearSearch"
      class="absolute inset-y-0 right-4 pr-3.5 flex items-center text-brand-gray hover:text-white transition"
    >
      <span class="material-icons text-base">close</span>
    </button>
  </div>
</template>
