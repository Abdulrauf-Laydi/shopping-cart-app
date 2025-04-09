// src/components/__tests__/ProductItem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ProductItem from '../ProductItem'; 
import { Product } from '../../types/Product'; 

// Mock product data for testing
const mockProduct: Product = {
  id: 'test-1',
  name: 'Test Product',
  price: 99.99,
  description: 'A product for testing',
  imageUrl: 'https://picsum.photos/seed/test/150/150',
  brand: 'TestBrand',
  countryOfOrigin: 'Other',
};

describe('<ProductItem />', () => {
  it('renders product details correctly', () => {
    render(<ProductItem product={mockProduct} />);

    // Check if name is rendered
    expect(screen.getByText('Test Product')).toBeVisible();

    // Check if price is rendered (using regex for flexibility with currency symbol/formatting)
    expect(screen.getByText(/99\.99/)).toBeVisible();

    // Use getByTestId to find the image
    const image = screen.getByTestId(`productItemImage-${mockProduct.id}`);
    expect(image).toBeVisible();
    // Check source URI using props
    expect(image.props.source.uri).toBe(mockProduct.imageUrl);
  });

  it('calls onPress when the details area is pressed', () => {
    const mockOnPress = jest.fn(); // Jest mock function
    render(<ProductItem product={mockProduct} onPress={mockOnPress} />);

    // Use getByTestId to find the touchable area
    const touchableArea = screen.getByTestId(`productItemTouchable-${mockProduct.id}`);
    fireEvent.press(touchableArea);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('calls onAddToCart when the "Add to Cart" button is pressed', () => {
    const mockOnAddToCart = jest.fn(); // Jest mock function
    render(<ProductItem product={mockProduct} onAddToCart={mockOnAddToCart} />);

    // Find the button by its title
    const addButton = screen.getByRole('button', { name: /add to cart/i }); // Case-insensitive match
    fireEvent.press(addButton);

    // Check if the mock function was called once with the correct product
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});