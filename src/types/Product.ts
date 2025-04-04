// src/types/Product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  brand: string;
  countryOfOrigin: 'Turkey' | 'USA' | 'Germany' | 'Other'; // Added USA, Germany
}