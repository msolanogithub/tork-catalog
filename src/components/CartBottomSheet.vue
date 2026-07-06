<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '../stores/cart';
import { formatPrice } from '../utils';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const cartStore = useCartStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const cartItems = computed(() => cartStore.items);
const totalItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);

const handleCheckout = () => {
  const url = cartStore.generateWhatsAppUrl();
  window.open(url, '_blank');
  isOpen.value = false;
};
</script>

<template>
  <q-dialog
    v-model="isOpen"
    position="bottom"
    class="z-[9999]"
  >
    <div class="bg-brand-section border-t border-brand-border rounded-t-2xl p-5 text-white max-w-[500px] w-full mx-auto space-y-4 max-h-[85vh] flex flex-col font-sans">
      <div class="w-12 h-1 bg-brand-border rounded-full mx-auto mb-1"></div>

      <div class="flex items-center justify-between border-b border-brand-border pb-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-brand-accent">shopping_basket</span>
          <span class="font-display font-black tracking-widest text-xs uppercase">Tu Pedido</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-brand-card text-brand-gray border border-brand-border font-bold">{{ totalItems }}</span>
        </div>
        <button @click="isOpen = false" class="text-brand-gray hover:text-white transition">
          <span class="material-icons text-lg">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
        <div 
          v-for="item in cartItems" 
          :key="item.product.sku" 
          class="flex gap-3 p-3 rounded-lg border border-brand-border bg-brand-card"
        >
          <img 
            :src="item.product.main_image" 
            :alt="item.product.name" 
            class="h-14 w-14 rounded-md object-cover bg-black"
          />
          
          <div class="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <h4 class="text-xs font-bold text-white truncate">{{ item.product.name }}</h4>
              <p class="text-[9px] uppercase font-display tracking-wider text-brand-gray mt-0.5">{{ item.product.brand }}</p>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs font-display font-black text-brand-accent">{{ formatPrice(item.product.price) }}</span>
              
              <div class="flex items-center border border-brand-border rounded overflow-hidden bg-brand-dark">
                <button 
                  @click="cartStore.updateQuantity(item.product.sku, item.quantity - 1)"
                  class="px-2 py-0.5 text-xs text-brand-gray hover:text-white hover:bg-brand-border transition"
                >
                  -
                </button>
                <span class="px-2 py-0.5 text-xs font-bold text-white">{{ item.quantity }}</span>
                <button 
                  @click="cartStore.updateQuantity(item.product.sku, item.quantity + 1)"
                  class="px-2 py-0.5 text-xs text-brand-gray hover:text-white hover:bg-brand-border transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button 
            @click="cartStore.removeFromCart(item.product.sku)" 
            class="text-brand-gray hover:text-red-500 self-start transition duration-200"
          >
            <span class="material-icons text-lg">delete_outline</span>
          </button>
        </div>
      </div>

      <div class="border-t border-brand-border pt-4 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs uppercase tracking-widest text-brand-gray font-display font-black">Total Estimado</span>
          <span class="text-lg font-display font-black text-brand-accent">{{ formatPrice(totalPrice) }}</span>
        </div>
        <button 
          @click="handleCheckout"
          class="w-full flex items-center justify-center gap-2 rounded bg-brand-accent hover:bg-brand-accentHover text-black font-display font-black uppercase text-xs py-3.5 tracking-wider transition duration-300 shadow-lg shadow-brand-accent/10 button-press"
        >
          <span class="material-icons text-lg">chat</span>
          Enviar Pedido por WhatsApp
        </button>
      </div>
    </div>
  </q-dialog>
</template>
