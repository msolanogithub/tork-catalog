export interface Config {
  store_name: string;
  hero_title: string;
  hero_subtitle: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  cache_minutes: number;
  hero_image: string;
  logo: string;
  primary_color: string;
  secondary_color: string;
}

export interface Category {
  name: string;
  description: string;
  display_order: number;
  active: boolean;
  // Programmatically generated for app compatibility
  id: string;
  slug: string;
}

export interface Product {
  category_name: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  display_order: number;
  main_image: string;
  // Programmatically generated for app compatibility
  sku: string;
  slug: string;
  category_id: string;
  brand: string;
  previous_price: number | null;
  new: boolean;
  featured: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  button_text: string;
  button_link: string;
  active: boolean;
  display_order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CachePayload<T> {
  data: T;
  timestamp: number;
  version: string;
  ttl: number;
}
