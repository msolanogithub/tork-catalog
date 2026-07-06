<script setup lang="ts">
import {useConfigStore} from '../stores/config';

const configStore = useConfigStore();

</script>

<template>
  <header class="bg-gradient-to-b from-[#0f0f0f] to-[#080808]">
    <router-link
        to="/"
        class="mx-auto flex max-w-md flex-col items-center pb-8 px-6"
    >
      <img
          v-if="configStore.config?.logo"
          :src="configStore.config.logo"
          alt="Logo"
          class="h-50 w-auto drop-shadow-[0_0_20px_rgba(132,255,0,0.25)] rounded-b-full"
      />

      <h3
          class="mt-4 text-xl text-center font-black uppercase tracking-[0.35em] text-white"
      >
        {{ configStore.config?.store_name }}
      </h3>

      <p
          v-if="configStore.config?.hero_subtitle"
          class="mt-2 max-w-xs text-center text-sm text-zinc-400"
      >
        {{ configStore.config.hero_subtitle }}
      </p>

    </router-link>
  </header>
</template>
