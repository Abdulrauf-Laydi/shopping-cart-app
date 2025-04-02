import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native'; // Added FlatList, Button
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext'; // Import useCart hook
import CartListItem from '../components/CartListItem'; // Import CartListItem
import { CartItem } from '../types/CartItem'; // Import CartItem type

// Define props type
type Props = NativeStackScreenProps<RootStackParamList, 'ShoppingCart'>;

function ShoppingCartScreen({ navigation }: Props) {
  // Get cart data and functions from context
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, getCartTotal } = useCart();

  // Function to render each cart item
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <CartListItem
      item={item}
      onIncrease={increaseQuantity}
      onDecrease={decreaseQuantity}
      onRemove={removeFromCart}
    />
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ₺{getCartTotal().toFixed(2)}</Text>
            <Button title="Checkout" onPress={() => { /* Implement checkout later */ console.log('Proceed to checkout'); }} />
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Match ProductList background
  },
  listContentContainer: {
    padding: 10,
  },
  emptyCartText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center', // Center text vertically
    fontSize: 18,
    color: '#666',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShoppingCartScreen;