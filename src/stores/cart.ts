import {defineStore} from 'pinia';
import type {CartItem, Product} from '../types';
import {formatPrice} from '../utils';
import {useConfigStore} from './config';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  actions: {
    loadCart ()
    {
      try
      {
        const cached = localStorage.getItem('tk_cart');
        if (cached)
        {
          this.items = JSON.parse(cached);
        }
      } catch (error)
      {
        console.error('Failed to load cart:', error);
      }
    },
    saveCart ()
    {
      try
      {
        localStorage.setItem('tk_cart', JSON.stringify(this.items));
      } catch (error)
      {
        console.error('Failed to save cart:', error);
      }
    },
    addToCart (product: Product, quantity = 1)
    {
      this.loadCart();
      const existing = this.items.find(item => item.product.sku === product.sku);
      if (existing)
      {
        const newQty = existing.quantity + quantity;
        existing.quantity = product.stock > 0 ? Math.min(newQty, product.stock) : newQty;
      } else
      {
        this.items.push({product, quantity: product.stock > 0 ? Math.min(quantity, product.stock) : quantity});
      }
      this.saveCart();
    },
    updateQuantity (sku: string, quantity: number)
    {
      this.loadCart();
      const item = this.items.find(item => item.product.sku === sku);
      if (item)
      {
        item.quantity = Math.max(1, item.product.stock > 0 ? Math.min(quantity, item.product.stock) : quantity);
        this.saveCart();
      }
    },
    removeFromCart (sku: string)
    {
      this.loadCart();
      this.items = this.items.filter(item => item.product.sku !== sku);
      this.saveCart();
    },
    clearCart ()
    {
      this.items = [];
      this.saveCart();
    },
    generateWhatsAppUrl (): string
    {
      const configStore = useConfigStore();
      const rawNumber = configStore.config?.whatsapp_number || '';
      const phone = rawNumber.replace(/[^0-9]/g, '');

      let message = `Hola,\n\nMe gustaría pedir los siguientes productos:\n\n`;

      this.items.forEach(item =>
      {
        message += `• ${item.product.name}\n`;
        message += `  Cantidad: ${item.quantity}\n`;
        message += `  Precio: ${formatPrice(item.product.price)}\n\n`;
      });

      message += `Total Estimado:\n${formatPrice(this.totalPrice)}\n\n`;
      message += `Muchas gracias.`;

      const encodedMessage = encodeURIComponent(message);

      return `https://wa.me/+${phone}?text=${encodedMessage}`;
    }
  },
  getters: {
    totalItems: (state) =>
    {
      return state.items.reduce((acc, item) => acc + item.quantity, 0);
    },
    totalPrice: (state) =>
    {
      return state.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    }
  }
});
