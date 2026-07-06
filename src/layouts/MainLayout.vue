<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '../stores/cart';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import CartBottomSheet from '../components/CartBottomSheet.vue';

const cartStore = useCartStore();
const cartOpen = ref(false);

const totalItems = computed(() => cartStore.totalItems);
</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-[#020202] min-h-screen text-white flex justify-center">
    <div class="w-full max-w-5xl min-h-screen bg-brand-dark border-x border-brand-border flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.6)] relative">
      <!-- Header -->
      <Header />

      <!-- Cart Bottom Sheet -->
      <CartBottomSheet v-model="cartOpen" />

      <!-- Content Page -->
      <q-page-container class="flex-1 flex flex-col bg-brand-dark">
        <main class="flex-1 w-full px-4 py-6">
          <router-view />
        </main>
      </q-page-container>

      <!-- Floating Cart Badge Button (Bottom Right) -->
      <button 
        v-if="totalItems > 0"
        @click="cartOpen = true" 
        class="fixed bottom-6 right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-black font-black shadow-lg hover:scale-110 active:scale-95 transition duration-300 border border-black button-press"
        aria-label="Ver pedido"
      >
        <span class="material-icons text-xl">shopping_cart</span>
        <span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white border border-brand-dark">
          {{ totalItems }}
        </span>
      </button>

      <!-- Footer -->
      <Footer />
    </div>
  </q-layout>
</template>

<style scoped>
:deep(.q-page-container) {
  padding-top: 0 !important;
}
</style>
