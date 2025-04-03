// src/screens/CheckoutScreen.tsx
import React, { useState } from 'react';
// Import Platform
import { View, Text, StyleSheet, Button, ScrollView, Alert, TextInput, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';

type CheckoutScreenProps = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

// --- Helper function for cross-platform alerts ---
const showAlert = (title: string, message: string, buttons?: Array<{ text: string, onPress?: () => void }>) => {
  if (Platform.OS === 'web') {
    // Simple browser alert for web (doesn't support titles or buttons well)
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


function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const isValidName = (value: string) => value.trim().length > 0;
  const isValidAddress = (value: string) => value.trim().length > 0;
  const isValidCity = (value: string) => value.trim().length > 0;
  const isValidPostalCode = (value: string) => /^\d+$/.test(value.trim());
  const isValidCardNumber = (value: string) => /^\d{16}$/.test(value.replace(/\s/g, ''));
  const isValidExpiryDate = (value: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim());
  const isValidCvv = (value: string) => /^\d{3,4}$/.test(value.trim());

  const handlePlaceOrder = () => {
    // --- Use showAlert helper for validation ---
    if (!isValidName(name)) { showAlert('Invalid Input', 'Please enter a valid name.'); return; }
    if (!isValidAddress(address)) { showAlert('Invalid Input', 'Please enter a valid address.'); return; }
    if (!isValidCity(city)) { showAlert('Invalid Input', 'Please enter a valid city.'); return; }
    if (!isValidPostalCode(postalCode)) { showAlert('Invalid Input', 'Please enter a valid postal code (digits only).'); return; }
    if (!isValidCardNumber(cardNumber)) { showAlert('Invalid Input', 'Please enter a valid 16-digit card number.'); return; }
    if (!isValidExpiryDate(expiryDate)) { showAlert('Invalid Input', 'Please enter a valid expiry date in MM/YY format.'); return; }
    if (!isValidCvv(cvv)) { showAlert('Invalid Input', 'Please enter a valid 3 or 4 digit CVV.'); return; }

    console.log('Placing order with validated details:', { /* ... details ... */ });

    // --- Use showAlert helper for success message ---
    showAlert(
        'Order Placed (Simulated)',
        'Your order has been successfully placed.',
        [{ text: 'OK', onPress: () => {
            clearCart();
            navigation.popToTop();
            navigation.navigate('ProductList');
        }}]
    );
  };

  // Rest of the component remains the same...
  if (cartItems.length === 0) {
      if (navigation.canGoBack()) {
          navigation.goBack();
          return null;
      } else {
          return (
              <View style={[styles.container, styles.centerContent]}>
                  <Text>Your cart is empty. Add items before checking out.</Text>
              </View>
          );
      }
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Checkout</Text>

      {/* Order Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.map(item => (
          <View key={item.id} style={styles.summaryItem}>
            <Text style={styles.summaryItemText}>{item.name} (x{item.quantity})</Text>
            <Text style={styles.summaryItemText}>₺{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.summaryTotal}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalText}>₺{getCartTotal().toFixed(2)}</Text>
        </View>
      </View>

      {/* Shipping Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" maxLength={5} />
      </View>

      {/* Payment Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method (Simulation)</Text>
        <TextInput style={styles.input} placeholder="Card Number (16 digits)" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" maxLength={19} />
        <TextInput style={styles.input} placeholder="Expiry Date (MM/YY)" value={expiryDate} onChangeText={setExpiryDate} maxLength={5} />
        <TextInput style={styles.input} placeholder="CVV (3 or 4 digits)" value={cvv} onChangeText={setCvv} keyboardType="numeric" secureTextEntry maxLength={4} />
      </View>

      <Button title="Place Order (Simulated)" onPress={handlePlaceOrder} />
      {/* Correctly formatted comment */}
      <View style={{ height: 50 }} />{/* Add some padding at the bottom */}

    </ScrollView>
  );
}

// Styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
   centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
   summaryItemText: {
    fontSize: 14,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default CheckoutScreen;