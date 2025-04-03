// src/screens/ProductDetailsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, Alert, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MOCK_PRODUCTS } from '../data/mockProducts'; // Import mock data
import { useCart } from '../context/CartContext'; // Import useCart

// --- Helper function for cross-platform alerts ---
// (Consider moving to a shared utils file later)
const showAlert = (title: string, message: string, buttons?: Array<{ text: string, onPress?: () => void }>) => {
  if (Platform.OS === 'web') {
    alert(`${title}\n${message}`);
    // Refactored condition to avoid &&
    if (buttons) {
      if (buttons.length > 0) {
        if (buttons[0].onPress) {
          buttons[0].onPress(); // Manually trigger first button's action on web
        }
      }
    }
  } else {
    // Use React Native Alert for native platforms
    Alert.alert(title, message, buttons);
  }
};

// Type definition will be fixed after updating RootStackParamList
type ProductDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

function ProductDetailsScreen({ route, navigation }: ProductDetailsScreenProps) {
  // Param type will be fixed after updating RootStackParamList
  const { productId } = route.params as { productId: string }; // Temporary type assertion
  const { addToCart } = useCart();

  // Find the product from mock data (replace with API call later)
  const product = MOCK_PRODUCTS.find(p => p.id === productId);

  if (!product) {
    // Handle case where product is not found
    return (
      <View style={styles.container}>
        <Text>Product not found!</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
      addToCart(product);
      showAlert('Added to Cart', `${product.name} has been added to your cart.`);
  };

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300, // Adjust height as needed
    resizeMode: 'contain', // Or 'cover'
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