<script setup lang="ts">
import { useConfigStore } from '../stores/config';

const configStore = useConfigStore();
</script>

<template>
  <footer class="bg-brand-dark border-t border-brand-border py-8 px-4 text-center">
    <div class="flex items-center justify-center gap-4 mb-4">
      <a 
        v-if="configStore.config?.facebook_url" 
        :href="configStore.config.facebook_url" 
        target="_blank" 
        class="flex h-9 w-9 items-center justify-center rounded border border-brand-border bg-brand-card text-brand-gray hover:text-brand-accent transition"
      >
        <span class="material-icons text-lg">facebook</span>
      </a>
      <a 
        v-if="configStore.config?.instagram_url" 
        :href="configStore.config.instagram_url" 
        target="_blank" 
        class="flex h-9 w-9 items-center justify-center rounded border border-brand-border bg-brand-card text-brand-gray hover:text-brand-accent transition"
      >
        <span class="material-icons text-lg">camera_alt</span>
      </a>
    </div>
    <p class="text-xs text-brand-gray font-mono uppercase tracking-wider">
      &copy; {{ new Date().getFullYear() }} {{ configStore.config?.store_name || 'TK ACCESORIOS' }}
    </p>
  </footer>
</template>
