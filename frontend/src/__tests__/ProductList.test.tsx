import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductList from '../pages/ProductList';
import { productsSlice } from '../store';

const mockStore = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: () => [],
    orders: () => [],
    user: () => ({})
  },
  preloadedState: {
    products: [
      { id: 1, name: 'Test Product', price: 99.99, category: 'TestCat' }
    ]
  }
});

describe('ProductList', () => {
  it('renders the heading and a product', () => {
    render(
      <Provider store={mockStore}>
        <ProductList />
      </Provider>
    );
    expect(screen.getByText(/Product List/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
  });
}); 