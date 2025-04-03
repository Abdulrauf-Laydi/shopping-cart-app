import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from './src/screens/ProductListScreen';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen';
import LoginScreen from './src/screens/LoginScreen'; // Import LoginScreen
import SignupScreen from './src/screens/SignupScreen'; // Import SignupScreen
import CheckoutScreen from './src/screens/CheckoutScreen'; // Import CheckoutScreen
import ProductDetailsScreen from './src/screens/ProductDetailsScreen'; // Import ProductDetailsScreen
import { RootStackParamList } from './src/navigation/types';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider, useAuth } from './src/context/AuthContext'; // Import AuthProvider and useAuth

// Create the Stack Navigator instance
const Stack = createNativeStackNavigator<RootStackParamList>();

// Define the main App Stack (shown when logged in)
function AppStack() {
  return (
    <Stack.Navigator initialRouteName="ProductList">
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen
        name="ShoppingCart"
        component={ShoppingCartScreen}
        options={{ title: 'Shopping Cart' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      {/* Added Product Details Screen */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }} // Or dynamically set title based on product
      />
    </Stack.Navigator>
  );
}

// Define the Auth Stack (shown when logged out)
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// Root component to decide which stack to show
function RootNavigator() {
  const { user } = useAuth(); // Get user state from AuthContext

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Main App component wrapping everything with providers
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
