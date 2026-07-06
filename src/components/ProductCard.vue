<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../types';
import { formatPrice } from '../utils';
import { useCartStore } from '../stores/cart';
import { useConfigStore } from '../stores/config';
import { useQuasar } from 'quasar';

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();
const configStore = useConfigStore();
const $q = useQuasar();

const isOutOfStock = computed(() => props.product.stock <= 0);

const handleAddToCart = () => {
  cartStore.addToCart(props.product, 1);
  $q.notify({
    message: `${props.product.name} agregado`,
    color: 'brand-accent',
    textColor: 'black',
    icon: 'check_circle',
    classes: 'bg-brand-accent text-black font-bold uppercase tracking-wider text-xs rounded border border-black'
  });
};

const handleNotifyAvailability = () => {
  const phone = configStore.config?.whatsapp_number.replace(/[^0-9]/g, '') || '';
  const message = `Hola, me gustaría consultar la disponibilidad del siguiente producto:\n\n• ${props.product.name}\nSKU: ${props.product.sku}\nMarca: ${props.product.brand}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};
</script>

<template>
  <div class="flex flex-col gap-3 py-6 border-b border-brand-border/40 last:border-none relative">
    <!-- Hero Image (4:3 aspect) -->
    <div class="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#0a0a0a] border border-brand-border/40">
      <img 
        :src="product.main_image" 
        :alt="product.name" 
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
      />
      
      <!-- Premium badges -->
      <div class="absolute top-3 left-3 z-10 flex gap-2">
        <span 
          v-if="isOutOfStock" 
          class="text-[8px] font-display font-black tracking-widest bg-brand-dark/90 text-brand-gray border border-brand-border px-2 py-0.5 rounded backdrop-blur-sm"
        >
          SIN STOCK
        </span>
        <span 
          v-else-if="product.stock > 0 && product.stock <= 2" 
          class="text-[8px] font-display font-black tracking-widest bg-amber-950/90 text-amber-400 border border-amber-900/60 px-2 py-0.5 rounded backdrop-blur-sm"
        >
          ÚLTIMAS UNIDADES
        </span>
      </div>
    </div>

    <!-- Typography Details -->
    <div class="space-y-1.5 px-1 pt-1">
      <p class="text-[9px] uppercase font-display tracking-[0.2em] text-brand-gray font-black">
        {{ product.brand }}
      </p>
      <h3 class="text-sm md:text-base font-display font-bold text-white leading-snug tracking-tight">
        {{ product.name }}
      </h3>
      <p class="text-xs text-brand-gray/95 leading-relaxed font-sans font-light">
        {{ product.description }}
      </p>
      <div class="pt-0.5">
        <span class="text-sm font-display font-black text-brand-accent">
          {{ formatPrice(product.price) }}
        </span>
      </div>
    </div>

    <!-- CTA Button -->
    <button
      v-if="!isOutOfStock"
      @click="handleAddToCart"
      class="w-full flex items-center justify-center gap-1.5 py-3 rounded bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-display font-black uppercase tracking-wider transition duration-300 button-press"
    >
      <span class="material-icons text-sm">add_shopping_cart</span>
      Agregar
    </button>
    <button
      v-else
      @click="handleNotifyAvailability"
      class="w-full flex items-center justify-center gap-1.5 py-3 rounded bg-[#101010] hover:bg-[#161616] border border-brand-border text-brand-gray hover:text-white text-xs font-display font-black uppercase tracking-wider transition duration-300 button-press"
    >
      <span class="material-icons text-sm">chat</span>
      Consultar disponibilidad
    </button>
  </div>
</template>
