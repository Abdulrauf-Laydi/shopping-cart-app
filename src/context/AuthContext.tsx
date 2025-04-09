// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,   // Import login function
  createUserWithEmailAndPassword, // Import signup function
  signOut                         // Import logout function
} from 'firebase/auth';
import { app, getAuth } from '../config/firebaseConfig';
import { FirebaseApp } from 'firebase/app';

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>; // Add login type
  signup: (email: string, pass: string) => Promise<void>; // Add signup type
  logout: () => Promise<void>; // Add logout type
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create a custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authInstance = getAuth(app as FirebaseApp); // Get auth instance once

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [authInstance]); // Depend on authInstance

  // --- Auth functions ---
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(authInstance, email, pass);
    // User state will be updated by onAuthStateChanged listener
  };

  const signup = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(authInstance, email, pass);
    // User state will be updated by onAuthStateChanged listener
  };

  const logout = async () => {
    await signOut(authInstance);
    // User state will be updated by onAuthStateChanged listener
  };

  // --- Provide Context Value ---
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};