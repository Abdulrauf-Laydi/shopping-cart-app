// src/data/mockProducts.ts
import { Product } from '../types/Product';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Beko Refrigerator',
    price: 15000,
    description: 'A high-quality, energy-efficient refrigerator.',
    imageUrl: 'https://www.beko.com.tr/media/resize/7285520234_LO1_20210218_103817.png/2000Wx2000H/image.webp', 
    brand: 'Beko',
    countryOfOrigin: 'Turkey',
  },
  {
    id: '2',
    name: 'Vestel Smart TV',
    price: 9500,
    description: '55-inch 4K Smart TV with vibrant colors.',
    imageUrl: 'https://statics.vestel.com.tr/productimages/20278808_r1_1000_1000.jpg', 
    brand: 'Vestel',
    countryOfOrigin: 'Turkey',
  },
  {
    id: '3',
    name: 'Arcelik Washing Machine',
    price: 12000,
    description: 'Front-load washing machine with multiple programs.',
    imageUrl: 'https://productimages.hepsiburada.net/s/129/424-600/110000080281865.jpg/format:webp', 
    brand: 'Arcelik',
    countryOfOrigin: 'Turkey',
  },
  {
    id: '4',
    name: 'Sony Headphones',
    price: 2500,
    description: 'Noise-cancelling over-ear headphones.',
    imageUrl: 'https://m.media-amazon.com/images/I/51aXvjzcukL.__AC_SX300_SY300_QL70_FMwebp_.jpg', 
    brand: 'Sony',
    countryOfOrigin: 'Germany', 
  },
  {
    id: '5',
    name: 'Samsung Galaxy Phone',
    price: 25000,
    description: 'Latest flagship smartphone from Samsung.',
    imageUrl: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/144576-1-1_large.jpg', 
    brand: 'Samsung',
    countryOfOrigin: 'Other', 
  },
   {
    id: '6',
    name: 'Apple MacBook Pro',
    price: 45000,
    description: 'Powerful laptop for professionals.',
    imageUrl: 'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/1-416_large.jpg', 
    brand: 'Apple',
    countryOfOrigin: 'USA', 
  },
];