
export type Language = 'en' | 'ky' | 'ru';

export interface Product {
  id: string;
  name: Record<Language, string>;
  category: Record<Language, string>;
  price: number;
  unit: Record<Language, string>;
  image: string;
  description: Record<Language, string>;
  stock: number;
}

export interface CartItem extends Omit<Product, 'name' | 'category' | 'unit' | 'description'> {
  name: string;
  category: string;
  unit: string;
  price: number;
  quantity: number;
}

export enum Page {
  Home = 'home',
  Catalog = 'catalog',
  Contact = 'contact',
  Calculator = 'calculator'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isGrounding?: boolean;
  groundingData?: any[];
}

export interface StoreLocation {
  name: Record<Language, string>;
  address: Record<Language, string>;
  coords: { lat: number; lng: number };
  twoGisUrl: string;
}

export interface EstimationResult {
  text: string;
  suggestedItems: Array<{
    id: string;
    quantity: number;
  }>;
}
