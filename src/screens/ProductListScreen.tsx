// src/screens/ProductListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Button, Text, TextInput, Alert, Platform, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
// import { MOCK_PRODUCTS } from '../data/mockProducts'; 
import ProductItem from '../components/ProductItem';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
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

  // State for fetched products, loading, and errors
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Raw data from Firebase
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Filtered/sorted data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect 1: Fetch data from Firebase Realtime Database
  useEffect(() => {
    const productsRef = ref(db, 'products/'); // Reference to the '/products' node
    setIsLoading(true);
    setError(null);

    const listener = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert the object received from Firebase into an array
        const productsArray: Product[] = Object.keys(data).map(key => ({
          id: key, // Use the key from Firebase as the id
          ...data[key]
        }));
        setAllProducts(productsArray);
      } else {
        console.log("No products found in Firebase.");
        setAllProducts([]); // Set to empty array if no data
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firebase read failed: ", error);
      setError("Failed to fetch products. Please try again later.");
      setIsLoading(false);
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => off(productsRef, 'value', listener);

  }, []); // Empty dependency array: run only once on mount

  // Effect 2: Filter and sort data whenever filters, sort, or fetched data changes
  useEffect(() => {
    let processedProducts = [...allProducts];

    // Apply search filter
    if (searchQuery) {
        processedProducts = processedProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Apply country filter
    if (selectedCountry !== 'All') {
        processedProducts = processedProducts.filter(product => product.countryOfOrigin === selectedCountry);
    }

    // Apply sorting
    // 1. Default sort (Country priority if 'All' selected, then name)
    processedProducts.sort((a, b) => {
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
        processedProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
        processedProducts.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(processedProducts);

  }, [allProducts, searchQuery, selectedCountry, selectedSort]); // Re-run when any of these change


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
    } catch (error) {
      console.error("Logout failed:", error);
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

  // --- Render Loading or Error State ---
  if (isLoading) {
      return (
          <View style={[styles.container, styles.centerContent]}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading Products...</Text>
          </View>
      );
  }

  if (error) {
      return (
          <View style={[styles.container, styles.centerContent]}>
              <Text style={styles.errorText}>{error}</Text>
              {/* Optionally add a retry button */}
          </View>
      );
  }

  // --- Render Main Content ---
  return (
    <View style={styles.container}>
      {/* Header */}
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
                style={[
                  styles.filterButton,
                  selectedCountry === country ? styles.filterButtonSelected : null
                ]}
                onPress={() => setSelectedCountry(country)}
              >
                <Text
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
        data={displayedProducts} // Use the filtered/sorted state
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={<Text style={styles.emptyListText}>No products match your criteria.</Text>} 
      />
      <StatusBar style="auto" />
    </View>
  );
}

// ---  Styles ---
const styles = StyleSheet.create({
    
    centerContent: { // Added style for centering loading/error
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: { // Added style for error message
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
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