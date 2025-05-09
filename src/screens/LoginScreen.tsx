// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
// Import Platform
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// --- Helper function for cross-platform alerts ---
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

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Get login function from context

  const handleLogin = async () => {
    if (!email || !password) {
      // Use showAlert
      showAlert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password); // Call the login function from context
      // Navigation happens automatically via AuthContext listener in App.tsx
    } catch (error: any) {
      // Use showAlert
      // Improve error handling based on Firebase error codes if needed
      showAlert('Login Failed', error.message || 'An unknown error occurred.');
    } finally {
      // Ensure loading is set to false even if login fails
      setLoading(false);
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <View style={styles.linkContainer}>
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </View>
  );
}


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

export default LoginScreen;