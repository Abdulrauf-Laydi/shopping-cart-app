// src/screens/ProductDetailsScreen.tsx
import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Image, Button, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
// import { MOCK_PRODUCTS } from '../data/mockProducts'; 
import { useCart } from '../context/CartContext';
import { Product } from '../types/Product'; // Import Product type
import { db } from '../config/firebaseConfig'; // Import db instance
import { ref, onValue, off } from 'firebase/database'; // Import RTDB functions

// --- Helper function for cross-platform alerts ---
const showAlert = (title: string, message: string, buttons?: Array<{ text: string, onPress?: () => void }>) => {
  if (Platform.OS === 'web') {
    alert(`${title}\n${message}`);
    if (buttons) {
      if (buttons.length > 0) {
        if (buttons[0].onPress) {
          buttons[0].onPress();
        }
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

type ProductDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

function ProductDetailsScreen({ route, navigation }: ProductDetailsScreenProps) {
  const { productId } = route.params; // Get productId from route params 
  const { addToCart } = useCart();

  // State for the fetched product, loading, and error
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch single product data from Firebase
  useEffect(() => {
    const productRef = ref(db, `products/${productId}`); // Reference to the specific product node
    setIsLoading(true);
    setError(null);

    const listener = onValue(productRef, (snapshot) => {
      if (snapshot.exists()) {
        // Add the id back into the product object since it's the key in RTDB
        setProduct({ id: snapshot.key, ...snapshot.val() } as Product);
      } else {
        console.log(`Product with ID ${productId} not found in Firebase.`);
        setError("Product not found!");
        setProduct(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error(`Firebase read failed for product ${productId}: `, error);
      setError("Failed to fetch product details.");
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => off(productRef, 'value', listener);

  }, [productId]); // Re-run if productId changes 

  const handleAddToCart = () => {
      if (product) { // Ensure product is loaded before adding
          addToCart(product);
          showAlert('Added to Cart', `${product.name} has been added to your cart.`);
      }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Details...</Text>
      </View>
    );
  }

  // --- Render Error or Not Found State ---
  if (error || !product) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || "Product not found!"}</Text>
      </View>
    );
  }

  // --- Render Product Details ---
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>Brand: {product.brand}</Text>
        <Text style={styles.price}>₺{product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>
    </ScrollView>
  );
}

// --- Updated Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: { // Added style for centering loading/error
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, 
  },
  errorText: { // Added style for error message
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  brand: {
      fontSize: 16,
      color: '#555',
      marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#888',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
});

export default ProductDetailsScreen;