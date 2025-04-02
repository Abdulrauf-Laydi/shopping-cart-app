// src/components/ProductItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from 'react-native'; // Added Button
import { Product } from '../types/Product';

interface ProductItemProps {
  product: Product;
  onPress?: () => void; // Optional: for handling item clicks later (e.g., view details)
  onAddToCart?: (product: Product) => void; // Function to handle adding to cart
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onPress, onAddToCart }) => {

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    // Wrap content in a View, make TouchableOpacity only for details press if needed
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.detailsTouchable}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>₺{product.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      {/* Add to Cart Button */}
      <View style={styles.buttonContainer}>
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    alignItems: 'center',
  },
  detailsTouchable: { // Area for clicking to view details
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Takes up space left of the button
    marginRight: 10, // Space between details and button
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
  buttonContainer: {
    // Styles for the button container if needed, e.g., alignment
  },
});

export default ProductItem;