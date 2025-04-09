// src/components/ProductItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Product } from '../types/Product';

interface ProductItemProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: (product: Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onPress, onAddToCart }) => {

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <View style={styles.container}>
      {/* Added testID */}
      <TouchableOpacity testID={`productItemTouchable-${product.id}`} onPress={onPress} activeOpacity={0.7} style={styles.detailsTouchable}>
        {/* Added testID */}
        <Image testID={`productItemImage-${product.id}`} source={{ uri: product.imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>₺{product.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {/* Added testID to the button's parent View for easier targeting if needed, though getByRole should work */}
        <View testID={`productItemAddButtonContainer-${product.id}`}>
            <Button title="Add to Cart" onPress={handleAddToCart} />
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', padding: 10, marginBottom: 10, backgroundColor: '#fff',
    borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2, alignItems: 'center',
  },
  detailsTouchable: {
    flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10,
  },
  image: {
    width: 80, height: 80, borderRadius: 4, marginRight: 15,
  },
  infoContainer: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 14, color: '#888' },
  buttonContainer: {},
});

export default ProductItem;