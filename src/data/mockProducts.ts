// src/data/mockProducts.ts
import { Product } from '../types/Product';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Beko Refrigerator',
    price: 15000,
    description: 'A high-quality, energy-efficient refrigerator.',
    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Beko+Fridge', // Placeholder image
    brand: 'Beko',
    countryOfOrigin: 'Turkey',
  },
  {
    id: '2',
    name: 'Vestel Smart TV',
    price: 9500,
    description: '55-inch 4K Smart TV with vibrant colors.',
    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Vestel+TV', // Placeholder image
    brand: 'Vestel',
    countryOfOrigin: 'Turkey',
  },
  {
    id: '3',
    name: 'Arcelik Washing Machine',
    price: 12000,
    description: 'Front-load washing machine with multiple programs.',
    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Arcelik+Washer', // Placeholder image
    brand: 'Arcelik',
    countryOfOrigin: 'Turkey',
  },
  {
    id: '4',
    name: 'Sony Headphones',
    price: 2500,
    description: 'Noise-cancelling over-ear headphones.',
    imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Sony+HP', // Placeholder image
    brand: 'Sony',
    countryOfOrigin: 'Other',
  },
  {
    id: '5',
    name: 'Samsung Galaxy Phone',
    price: 25000,
    description: 'Latest flagship smartphone from Samsung.',
    imageUrl: 'https://via.placeholder.com/150/00FFFF/000000?text=Samsung+Phone', // Placeholder image
    brand: 'Samsung',
    countryOfOrigin: 'Other',
  },
   {
    id: '6',
    name: 'Apple MacBook Pro',
    price: 45000,
    description: 'Powerful laptop for professionals.',
    imageUrl: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=MacBook+Pro', // Placeholder image
    brand: 'Apple',
    countryOfOrigin: 'Other',
  },
];