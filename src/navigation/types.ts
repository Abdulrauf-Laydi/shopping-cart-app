// src/navigation/types.ts
export type RootStackParamList = {
  ProductList: undefined;
  ShoppingCart: undefined;
  Login: undefined;
  Signup: undefined;
  Checkout: undefined;
  ProductDetails: { productId: string }; // Added Product Details screen with param
  // Add other screen definitions here as the app grows
};