// src/screens/ProductListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Button, Text, TextInput, Alert, Platform } from 'react-native'; // Added Platform and Alert
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import ProductItem from '../components/ProductItem';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// --- Helper function for cross-platform alerts ---
// (Consider moving to a shared utils file later)
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


type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

function ProductListScreen({ navigation }: Props) {
  const { addToCart, getCartItemCount } = useCart();
  const { logout } = useAuth(); // Get logout function
  const cartItemCount = getCartItemCount();

  const [searchQuery, setSearchQuery] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Filter and sort logic remains the same...
    const filtered = MOCK_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sorted = filtered.sort((a, b) => {
      const isATurkish = a.countryOfOrigin === 'Turkey';
      const isBTurkish = b.countryOfOrigin === 'Turkey';
      if (isATurkish) {
        if (!isBTurkish) return -1;
      } else {
        if (isBTurkish) return 1;
      }
      return a.name.localeCompare(b.name);
    });
    setDisplayedProducts(sorted);
  }, [searchQuery]);

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductItem
      product={item}
      // Corrected: Navigate to ProductDetails on press, passing productId
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      onAddToCart={addToCart}
    />
  );

  const renderCartBadge = () => {
    if (cartItemCount > 0) {
      return (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{cartItemCount}</Text>
        </View>
      );
    }
    return null;
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation happens automatically via AuthContext listener
    } catch (error) {
      console.error("Logout failed:", error);
      // Use showAlert for cross-platform compatibility
      showAlert('Logout Failed', 'Could not log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Cart and Logout */}
      <View style={styles.header}>
        <View style={styles.headerButtons}>
           <Button title="Logout" onPress={handleLogout} color="red" />
           <View style={styles.cartButtonContainer}>
             <Button
               title="Go to Cart"
               onPress={() => navigation.navigate('ShoppingCart')}
             />
             {renderCartBadge()}
           </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products or brands..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={displayedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={<Text style={styles.emptyListText}>No products found.</Text>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

// Styles remain the same...
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
    },
    header: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      // Changed alignment for multiple buttons
      flexDirection: 'row',
      justifyContent: 'flex-end', // Align button group to the right
      alignItems: 'center',
    },
    headerButtons: { // Container for all header buttons
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 15, // Add space between Logout and Cart buttons
    },
    badgeContainer: {
      backgroundColor: 'red',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: -10,
      marginTop: -10,
      zIndex: 1,
    },
    badgeText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
    searchContainer: {
      padding: 10,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    searchInput: {
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
    },
    listContentContainer: {
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    emptyListText: {
        padding: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    }
  });

export default ProductListScreen;