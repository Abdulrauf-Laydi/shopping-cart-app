// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
// Import Platform
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// --- Helper function for cross-platform alerts ---
// (Copied - consider moving to a shared utils file later)
const showAlert = (title: string, message: string, buttons?: Array<{ text: string, onPress?: () => void }>) => {
  if (Platform.OS === 'web') {
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
    Alert.alert(title, message, buttons);
  }
};

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

function SignupScreen({ navigation }: SignupScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth(); // Get signup function from context

  const handleSignup = async () => {
    // Use showAlert for validation messages
    if (!email || !password || !confirmPassword) {
      showAlert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Error', 'Passwords do not match.');
      return;
    }
    // Basic password validation (e.g., minimum length)
    if (password.length < 6) {
       showAlert('Error', 'Password should be at least 6 characters long.');
       return;
    }

    setLoading(true);
    try {
      await signup(email, password); // Call the signup function from context
      // Navigation happens automatically via AuthContext listener in App.tsx
    } catch (error: any) {
      // Use showAlert for error message
      // Improve error handling based on Firebase error codes if needed
      // e.g., check for 'auth/email-already-in-use'
      showAlert('Signup Failed', error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min. 6 characters)" // Added hint
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title={loading ? 'Signing up...' : 'Sign Up'} onPress={handleSignup} disabled={loading} />
       <View style={styles.linkContainer}>
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}

// Styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
   linkContainer: {
      marginTop: 20,
  }
});

export default SignupScreen;