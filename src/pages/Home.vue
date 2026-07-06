<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useProductStore} from '../stores/product';
import {useCategoryStore} from '../stores/category';
import SearchBar from '../components/SearchBar.vue';
import ProductGrid from '../components/ProductGrid.vue';

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const activeCategory = ref('');
const chipsRow = ref<HTMLElement | null>(null);

const categories = computed(() => categoryStore.categories);
const searchQuery = computed(() => productStore.searchQuery);
const showSearchMode = computed(() => searchQuery.value.trim().length > 0);

const searchResults = computed(() => productStore.getFilteredProducts());

const categoryProducts = computed(() =>
{
  const map: Record<string, any[]> = {};
  categories.value.forEach(cat =>
  {
    const list = productStore.products.filter(
        p => p.category_name.toLowerCase().trim() === cat.name.toLowerCase().trim()
    );
    map[cat.id] = list;
  });
  return map;
});

const visibleCategories = computed(() =>
{
  return categories.value.filter(cat =>
  {
    const list = categoryProducts.value[cat.id];
    return list && list.length > 0;
  });
});

const scrollToCategory = (catId: string) =>
{
  const el = document.getElementById(`category-${catId}`);
  if (el)
  {
    const yOffset = -50;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
    activeCategory.value = catId;
  }
};

const handleScroll = () =>
{
  if (showSearchMode.value || visibleCategories.value.length === 0) return;

  const scrollPos = window.scrollY + 100;

  for (const cat of visibleCategories.value)
  {
    const el = document.getElementById(`category-${cat.id}`);
    if (el)
    {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height)
      {
        activeCategory.value = cat.id;

        const chipEl = document.getElementById(`chip-${cat.id}`);
        if (chipEl && chipsRow.value)
        {
          chipsRow.value.scrollTo({
            left: chipEl.offsetLeft - 16,
            behavior: 'smooth'
          });
        }
        break;
      }
    }
  }
};

onMounted(() =>
{
  window.addEventListener('scroll', handleScroll);
  if (visibleCategories.value.length > 0)
  {
    activeCategory.value = visibleCategories.value[0].id;
  }
});

onUnmounted(() =>
{
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="space-y-6 bg-deep-radial pb-12">
    <!-- Search Bar -->
    <section>
      <SearchBar/>
    </section>

    <!-- Normal Mode -->
    <template v-if="!showSearchMode">
      <!-- Sticky Category chips -->
      <div
          v-if="visibleCategories.length > 0"
          ref="chipsRow"
          class="sticky top-0 z-[90] bg-[#050505]/95 py-2 -mx-4 px-4 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-hide"
      >
        <button
            v-for="cat in visibleCategories"
            :key="cat.id"
            :id="`chip-${cat.id}`"
            @click="scrollToCategory(cat.id)"
            class="px-3 py-1 rounded-full text-[9px] font-display font-black uppercase tracking-wider transition-editorial border select-none button-press"
            :class="activeCategory === cat.id
            ? 'bg-brand-accent border-brand-accent text-black font-black' 
            : 'bg-[#0B0B0B] border-brand-border/60 text-brand-gray hover:text-white'"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Categories Feed -->
      <div class="space-y-8 px-4">
        <section
            v-for="cat in visibleCategories"
            :key="cat.id"
            class="space-y-4"
        >
          <div :id="`category-${cat.id}`" class="pt-6 pb-2 flex flex-col gap-1.5">
            <h5 class="text-[9px] md:text-[10px] font-display font-black uppercase tracking-[0.3em] text-white">
              {{ cat.name }}
            </h5>
            <div class="w-full h-[1px] bg-brand-border/50"></div>
            <p v-if="cat.description" class="text-[10px] text-brand-gray leading-relaxed font-sans font-light">
              {{ cat.description }}
            </p>
          </div>

          <ProductGrid :products="categoryProducts[cat.id] || []"/>
        </section>
      </div>
    </template>

    <!-- Search Mode -->
    <template v-else>
      <section class="space-y-4 px-4">
        <div class="flex items-center justify-between border-b border-brand-border/40 pb-3">
          <h6 class="text-[9px] md:text-[10px] font-display font-black uppercase tracking-[0.2em] text-brand-gray flex items-center gap-2">
            <span class="material-icons text-brand-accent text-sm">search</span>
            Resultados de: <span class="text-white italic font-normal">"{{ searchQuery }}"</span>
          </h6>
          <span class="text-[8px] font-display font-black tracking-widest text-brand-gray uppercase">{{
              searchResults.length
            }} items</span>
        </div>
        <ProductGrid :products="searchResults"/>
      </section>
    </template>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
