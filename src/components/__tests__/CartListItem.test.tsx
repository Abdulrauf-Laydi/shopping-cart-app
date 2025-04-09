// src/components/__tests__/CartListItem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CartListItem from '../CartListItem'; 
import { CartItem } from '../../types/CartItem'; 

// Mock cart item data
const mockCartItem: CartItem = {
  id: 'cart-item-1',
  name: 'Test Cart Item',
  price: 50.00,
  description: 'Description for cart item',
  imageUrl: 'https://picsum.photos/seed/cart/150/150',
  brand: 'CartBrand',
  countryOfOrigin: 'Other',
  quantity: 2, // Start with quantity > 1 to test decrease
};

const mockCartItemQty1: CartItem = {
    ...mockCartItem,
    id: 'cart-item-qty1',
    quantity: 1,
};

describe('<CartListItem />', () => {
  it('renders item details correctly', () => {
    render(<CartListItem item={mockCartItem} />);

    expect(screen.getByText('Test Cart Item')).toBeVisible();
    expect(screen.getByText(/50\.00/)).toBeVisible(); // Check price
    expect(screen.getByText('2')).toBeVisible(); // Check quantity
    // Use getByTestId to find the image
    const image = screen.getByTestId(`cartItemImage-${mockCartItem.id}`);
    expect(image).toBeVisible();
    // Optionally check source URI
    expect(image.props.source.uri).toBe(mockCartItem.imageUrl);
  });

  it('calls onIncrease when "+" button is pressed', () => {
    const mockOnIncrease = jest.fn();
    render(<CartListItem item={mockCartItem} onIncrease={mockOnIncrease} />);

    const increaseButton = screen.getByRole('button', { name: '+' });
    fireEvent.press(increaseButton);

    expect(mockOnIncrease).toHaveBeenCalledTimes(1);
    expect(mockOnIncrease).toHaveBeenCalledWith(mockCartItem.id);
  });

  it('calls onDecrease when "-" button is pressed and quantity > 1', () => {
    const mockOnDecrease = jest.fn();
    render(<CartListItem item={mockCartItem} onDecrease={mockOnDecrease} />); // Using item with qty 2

    const decreaseButton = screen.getByRole('button', { name: '-' });
    fireEvent.press(decreaseButton);

    expect(mockOnDecrease).toHaveBeenCalledTimes(1);
    expect(mockOnDecrease).toHaveBeenCalledWith(mockCartItem.id);
  });

  it('does NOT call onDecrease when "-" button is pressed and quantity is 1', () => {
    const mockOnDecrease = jest.fn();
    render(<CartListItem item={mockCartItemQty1} onDecrease={mockOnDecrease} />); // Using item with qty 1

    const decreaseButton = screen.getByRole('button', { name: '-' });
    fireEvent.press(decreaseButton); 

    expect(mockOnDecrease).not.toHaveBeenCalled();
  });

   it('"-" button is disabled when quantity is 1', () => {
    render(<CartListItem item={mockCartItemQty1} />); // Using item with qty 1
    const decreaseButton = screen.getByRole('button', { name: '-' });
    // Check accessibility state for disabled status
    expect(decreaseButton.props.accessibilityState.disabled).toBe(true);
  });

  it('calls onRemove when "Remove" button is pressed', () => {
    const mockOnRemove = jest.fn();
    render(<CartListItem item={mockCartItem} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.press(removeButton);

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
    expect(mockOnRemove).toHaveBeenCalledWith(mockCartItem.id);
  });
});