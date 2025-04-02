// src/types/Product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string; // URL to the product image
  brand: string; // To help with the bonus requirement
  countryOfOrigin: 'Turkey' | 'Other'; // To help with sorting/filtering
}