// src/components/CartListItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { CartItem } from '../types/CartItem';

interface CartListItemProps {
  item: CartItem;
  onIncrease?: (id: string) => void; // Function to increase quantity
  onDecrease?: (id: string) => void; // Function to decrease quantity
  onRemove?: (id: string) => void;   // Function to remove item
}

const CartListItem: React.FC<CartListItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {

  // Define handler functions separately
  const handleDecrease = () => {
    if (onDecrease) {
      onDecrease(item.id);
    }
  };

  const handleIncrease = () => {
    if (onIncrease) {
      onIncrease(item.id);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₺{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        {/* Use defined handler functions */}
        <Button title="-" onPress={handleDecrease} disabled={item.quantity <= 1} />
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Button title="+" onPress={handleIncrease} />
      </View>
      {/* Use defined handler function */}
      <Button title="Remove" color="red" onPress={handleRemove} />
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 12,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
    minWidth: 20, // Ensure space for quantity
    textAlign: 'center',
  },
});

export default CartListItem;