<script setup lang="ts">
import { useConfigStore } from '../stores/config';

const configStore = useConfigStore();
</script>

<template>
  <header class="w-full border-b border-brand-border bg-brand-dark/95 py-4 flex justify-center">
    <router-link to="/" class="flex items-center gap-2">
      <img 
        v-if="configStore.config?.logo"
        :src="configStore.config.logo"
        alt="Logo" 
        class="h-10 w-auto object-contain"
      />
      <span class="font-display font-black tracking-widest text-lg text-white uppercase">
        {{ configStore.config?.store_name || 'TK ACCESORIOS' }}
      </span>
    </router-link>
  </header>
</template>
