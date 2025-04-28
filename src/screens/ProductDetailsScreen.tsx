// src/screens/ProductDetailsScreen.tsx
import React, { useState, useEffect } from 'react'; // Removed useContext
import { View, Text, StyleSheet, Image, Button, ScrollView, Alert, Platform, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'; // Remove FlatList import
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
// import { MOCK_PRODUCTS } from '../data/mockProducts'; 
import { useCart } from '../context/CartContext';
import { Product } from '../types/Product'; // Import Product type
import { db } from '../config/firebaseConfig'; // Import db instance
import { ref, onValue, off, push, serverTimestamp, query, orderByChild } from 'firebase/database'; // Import RTDB functions for writing and querying
import { useAuth } from '../context/AuthContext'; // Import useAuth hook instead of AuthContext

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

// Define Review type
interface Review {
    id: string;
    userId: string; // Or userName if you prefer
    rating: number;
    comment: string;
    timestamp: number;
}

type ProductDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

function ProductDetailsScreen({ route, navigation }: ProductDetailsScreenProps) {
  const { productId } = route.params; // Get productId from route params 
  const { addToCart } = useCart();
  const { user } = useAuth(); // Use the useAuth hook

  // State for the fetched product, loading, and error
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // State for new review input
  const [newRating, setNewRating] = useState<number>(0); // 0 means no rating selected
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Effect to fetch single product data from Firebase
  useEffect(() => {
    const productRef = ref(db, `products/${productId}`); // Reference to the specific product node
    setIsLoading(true);
    setError(null);

    const listener = onValue(productRef, (snapshot) => {
      if (snapshot.exists()) {
        // Add the id back into the product object since it's the key in RTDB
        setProduct({ id: snapshot.key, ...snapshot.val() } as Product);
      } else {
        console.log(`Product with ID ${productId} not found in Firebase.`);
        setError("Product not found!");
        setProduct(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error(`Firebase read failed for product ${productId}: `, error);
      setError("Failed to fetch product details.");
      setIsLoading(false);
    });

    // --- Fetch Reviews ---
    const reviewsRef = query(ref(db, `reviews/${productId}`), orderByChild('timestamp')); // Order by timestamp
    setIsLoadingReviews(true);
    setReviewError(null);

    const reviewListener = onValue(reviewsRef, (snapshot) => {
        const loadedReviews: Review[] = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                loadedReviews.push({ id: childSnapshot.key!, ...childSnapshot.val() });
            });
            // Sort descending by timestamp (newest first)
            loadedReviews.sort((a, b) => b.timestamp - a.timestamp);
        }
        setReviews(loadedReviews);
        setIsLoadingReviews(false);
    }, (error) => {
        console.error(`Firebase read failed for reviews of product ${productId}: `, error);
        setReviewError("Failed to load reviews.");
        setIsLoadingReviews(false);
    });

    // Cleanup listeners on unmount
    return () => {
        off(productRef, 'value', listener); // Existing cleanup
        off(reviewsRef, 'value', reviewListener); // Cleanup review listener
    };

  }, [productId]); // Re-run if productId changes 

  const handleAddToCart = () => {
      if (product) { // Ensure product is loaded before adding
          addToCart(product);
          showAlert('Added to Cart', `${product.name} has been added to your cart.`);
      }
  };

  // --- Handle Review Submission ---
  const handleAddReview = async () => {
      if (!user) {
          showAlert('Login Required', 'You must be logged in to leave a review.');
          // Optional: navigate to Login screen
          // navigation.navigate('Login');
          return;
      }
      if (newRating === 0) {
          showAlert('Rating Required', 'Please select a star rating.');
          return;
      }
      if (!newComment.trim()) {
          showAlert('Comment Required', 'Please enter a comment.');
          return;
      }

      setIsSubmittingReview(true);
      const reviewsRef = ref(db, `reviews/${productId}`);
      try {
          await push(reviewsRef, {
              userId: user.uid, // Store user ID
              // userName: user.displayName || user.email, // Optionally store display name/email
              rating: newRating,
              comment: newComment.trim(),
              timestamp: serverTimestamp(), // Use server timestamp
          });
          setNewRating(0); // Reset form
          setNewComment('');
          showAlert('Review Submitted', 'Thank you for your feedback!');
      } catch (err) {
          console.error("Error submitting review: ", err);
          showAlert('Submission Failed', 'Could not submit your review. Please try again.');
      } finally {
          setIsSubmittingReview(false);
      }
  };

  // --- Render Star Rating Input ---
  const renderRatingInput = () => (
      <View style={styles.ratingInputContainer}>
          <Text style={styles.reviewLabel}>Your Rating:</Text>
          <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                      <Text style={[styles.star, newRating >= star ? styles.starSelected : {}]}>★</Text>
                  </TouchableOpacity>
              ))}
          </View>
      </View>
  );

  // --- Render Single Review Item ---
  const renderReviewItem = ({ item }: { item: Review }) => (
      <View style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
              <Text style={styles.reviewUser}>User: {item.userId.substring(0, 6)}...</Text> {/* Show partial ID */}
              <Text style={styles.reviewRating}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
          </View>
          <Text style={styles.reviewComment}>{item.comment}</Text>
          <Text style={styles.reviewTimestamp}>{new Date(item.timestamp).toLocaleDateString()}</Text>
      </View>
  );

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Details...</Text>
      </View>
    );
  }

  // --- Render Error or Not Found State ---
  if (error || !product) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || "Product not found!"}</Text>
      </View>
    );
  }

  // --- Render Product Details ---
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>Brand: {product.brand}</Text>
        <Text style={styles.price}>₺{product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>

      {/* --- Review Section --- */}
      <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>Reviews</Text>

          {/* --- Add Review Form --- */}
          {user && ( // Only show form if logged in
              <View style={styles.addReviewContainer}>
                  <Text style={styles.addReviewTitle}>Leave a Review</Text>
                  {renderRatingInput()}
                  <Text style={styles.reviewLabel}>Your Comment:</Text>
                  <TextInput
                      style={styles.commentInput}
                      placeholder="Tell us what you think..."
                      value={newComment}
                      onChangeText={setNewComment}
                      multiline
                  />
                  <Button
                      title={isSubmittingReview ? "Submitting..." : "Submit Review"}
                      onPress={handleAddReview}
                      disabled={isSubmittingReview}
                  />
              </View>
          )}
          {!user && (
               <Text style={styles.loginPrompt}>Please log in to leave a review.</Text>
          )}

          {/* --- Display Reviews --- */}
          {isLoadingReviews ? (
              <ActivityIndicator size="small" color="#555" style={{ marginTop: 20 }}/>
          ) : reviewError ? (
              <Text style={styles.errorText}>{reviewError}</Text>
          ) : reviews.length === 0 ? (
              <Text style={styles.noReviewsText}>No reviews yet. Be the first!</Text>
          ) : (
              // Replace FlatList with map
              <View>
                  {reviews.map((item) => (
                      // Use renderReviewItem logic directly or call it
                      <View key={item.id} style={styles.reviewItem}>
                          <View style={styles.reviewHeader}>
                              <Text style={styles.reviewUser}>User: {item.userId.substring(0, 6)}...</Text>
                              <Text style={styles.reviewRating}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
                          </View>
                          <Text style={styles.reviewComment}>{item.comment}</Text>
                          <Text style={styles.reviewTimestamp}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                      </View>
                  ))}
              </View>
          )}
      </View>
    </ScrollView>
  );
}

// --- Updated Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: { // Added style for centering loading/error
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, 
  },
  errorText: { // Added style for error message
    color: 'red',
    fontSize: 14, // Smaller for reviews section
    textAlign: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 20,
    paddingBottom: 0, // Remove bottom padding to connect with reviews section
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  brand: {
      fontSize: 16,
      color: '#555',
      marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#888',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20, // Keep margin before button
  },

  // --- Review Section Styles ---
  reviewsSection: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#eee',
      marginTop: 20,
  },
  reviewsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
  },
  addReviewContainer: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#eee',
  },
  addReviewTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
  },
  reviewLabel: {
      fontSize: 14,
      color: '#333',
      marginBottom: 5,
  },
  ratingInputContainer: {
      marginBottom: 10,
  },
  starsContainer: {
      flexDirection: 'row',
      marginBottom: 10,
  },
  star: {
      fontSize: 28,
      color: '#ccc',
      marginRight: 5,
  },
  starSelected: {
      color: '#FFD700', // Gold color for selected star
  },
  commentInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 10,
      marginBottom: 10,
      minHeight: 80,
      textAlignVertical: 'top', // For Android multiline
      backgroundColor: '#fff',
  },
  loginPrompt: {
      textAlign: 'center',
      marginVertical: 15,
      color: '#555',
      fontStyle: 'italic',
  },
  noReviewsText: {
      textAlign: 'center',
      marginVertical: 15,
      color: '#777',
  },
  reviewItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
  },
  reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
  },
  reviewUser: {
      fontWeight: 'bold',
      fontSize: 14,
  },
  reviewRating: {
      fontSize: 14,
  },
  reviewComment: {
      fontSize: 14,
      color: '#333',
      marginBottom: 5,
  },
  reviewTimestamp: {
      fontSize: 12,
      color: '#999',
      textAlign: 'right',
  },
});

export default ProductDetailsScreen;