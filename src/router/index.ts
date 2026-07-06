import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useConfigStore } from '../stores/config';
import { useProductStore } from '../stores/product';
import { useCategoryStore } from '../stores/category';
import MainLayout from '../layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../pages/Home.vue'),
        meta: {
          title: 'Premium Motorcycle Catalog',
          description: 'Browse the exclusive product catalog of high-performance motorcycle accessories from TK Accesorios.'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

router.afterEach(async () => {
  const configStore = useConfigStore();
  const productStore = useProductStore();
  const categoryStore = useCategoryStore();

  try {
    await Promise.all([
      configStore.loadConfig(),
      productStore.loadProducts(),
      categoryStore.loadCategories()
    ]);
  } catch (err) {
    console.error('Failed to load stores for SEO tags:', err);
  }

  const storeName = configStore.config?.store_name || 'TK Accesorios';
  document.title = storeName;

  const description = configStore.config?.hero_subtitle || 'TK Accesorios digital product catalog.';
  const image = configStore.config?.logo || '';

  updateMetaTag('description', description);
  updateMetaTag('og:title', storeName);
  updateMetaTag('og:description', description);
  updateMetaTag('og:image', image);
  updateMetaTag('og:url', window.location.href);
  updateMetaTag('og:type', 'website');
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', storeName);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', image);

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', window.location.href);
});

function updateMetaTag(name: string, content: string) {
  if (!content) return;
  const attribute = name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name';
  let tag = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
