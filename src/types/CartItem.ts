// src/types/CartItem.ts
import { Product } from './Product';

export interface CartItem extends Product {
  quantity: number;
}