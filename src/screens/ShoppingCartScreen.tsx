import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import CartListItem from '../components/CartListItem';
import { CartItem } from '../types/CartItem';

type Props = NativeStackScreenProps<RootStackParamList, 'ShoppingCart'>;

function ShoppingCartScreen({ navigation }: Props) {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, getCartTotal } = useCart();

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
            {/* Corrected: Navigate to Checkout screen */}
            <Button title="Checkout" onPress={() => navigation.navigate('Checkout')} />
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
    backgroundColor: '#f8f8f8',
  },
  listContentContainer: {
    padding: 10,
  },
  emptyCartText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
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