// src/screens/ProductListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Button, Text, TextInput, Alert, Platform, TouchableOpacity, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import ProductItem from '../components/ProductItem';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth

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

// Define possible filter values (including 'All')
type CountryFilter = 'All' | Product['countryOfOrigin'];
const filterCountries: CountryFilter[] = ['All', 'Turkey', 'USA', 'Germany', 'Other'];

// Define possible sort options
type SortOption = 'default' | 'price-asc' | 'price-desc';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

function ProductListScreen({ navigation }: Props) {
  const { addToCart, getCartItemCount } = useCart();
  const { logout } = useAuth(); // Get logout function
  const cartItemCount = getCartItemCount();

  const [searchQuery, setSearchQuery] = useState('');
  // Add state for selected country filter
  const [selectedCountry, setSelectedCountry] = useState<CountryFilter>('All');
  // Add state for selected sort option
  const [selectedSort, setSelectedSort] = useState<SortOption>('default');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // --- Apply search filter ---
    let filtered = MOCK_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- Apply country filter (if not 'All') ---
    if (selectedCountry !== 'All') {
        filtered = filtered.filter(product => product.countryOfOrigin === selectedCountry);
    }

    // --- Apply sorting ---
    let sorted = [...filtered]; 

    // 1. Default sort (Country priority if 'All' selected, then name)
    sorted.sort((a, b) => {
      if (selectedCountry === 'All') {
          const isATurkish = a.countryOfOrigin === 'Turkey';
          const isBTurkish = b.countryOfOrigin === 'Turkey';
          if (isATurkish) {
              if (!isBTurkish) return -1; // a comes first
          } else {
              if (isBTurkish) return 1; // b comes first
          }
      }
      return a.name.localeCompare(b.name); // Default sort by name
    });

    // 2. Apply price sort if selected
    if (selectedSort === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price); // Low to High
    } else if (selectedSort === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price); // High to Low
    }

    setDisplayedProducts(sorted);
  }, [searchQuery, selectedCountry, selectedSort]); // Add selectedSort to dependencies

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductItem
      product={item}
      
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

  // Function to cycle through sort options
  const cycleSortOption = () => {
      if (selectedSort === 'default') {
          setSelectedSort('price-asc');
      } else if (selectedSort === 'price-asc') {
          setSelectedSort('price-desc');
      } else {
          setSelectedSort('default');
      }
  };

  // Get text for the sort button
  const getSortButtonText = () => {
      if (selectedSort === 'price-asc') return 'Sort: Price Low-High';
      if (selectedSort === 'price-desc') return 'Sort: Price High-Low';
      return 'Sort: Default';
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

      {/* Filter & Sort Controls */}
      <View style={styles.controlsContainer}>
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {filterCountries.map((country) => (
              <TouchableOpacity
                key={country}
                // Refactored conditional style using ternary
                style={[
                  styles.filterButton,
                  selectedCountry === country ? styles.filterButtonSelected : null
                ]}
                onPress={() => setSelectedCountry(country)}
              >
                <Text
                  // Refactored conditional style using ternary
                  style={[
                    styles.filterButtonText,
                    selectedCountry === country ? styles.filterButtonTextSelected : null
                  ]}
                >
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Sort Button */}
          <Pressable style={styles.sortButton} onPress={cycleSortOption}>
              <Text style={styles.sortButtonText}>{getSortButtonText()}</Text>
          </Pressable>
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


const styles = StyleSheet.create({
    
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    header: {
      paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#fff',
      borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row',
      justifyContent: 'flex-end', alignItems: 'center',
    },
    headerButtons: { flexDirection: 'row', alignItems: 'center' },
    cartButtonContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
    badgeContainer: {
      backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 6,
      paddingVertical: 2, marginLeft: -10, marginTop: -10, zIndex: 1,
    },
    badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    searchContainer: { padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    searchInput: {
      height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 8,
      paddingHorizontal: 10, backgroundColor: '#fff',
    },
    controlsContainer: { // Container for filters and sort
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Distribute buttons evenly
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    filterButtonSelected: {
        backgroundColor: '#007bff', // Example selected color
        borderColor: '#007bff',
    },
    filterButtonText: {
        color: '#333',
    },
    filterButtonTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sortButton: { // Style for the sort button
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#e7e7e7', // Slightly different background
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    sortButtonText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    listContentContainer: { paddingHorizontal: 10, paddingBottom: 10 },
    emptyListText: { padding: 20, textAlign: 'center', fontSize: 16, color: '#666' }
});

export default ProductListScreen;