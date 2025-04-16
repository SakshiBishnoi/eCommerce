import { store } from '../store';
import { fetchCartFromBackend } from '../store';

// Initialize cart from backend when user is logged in
export const initializeCart = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await store.dispatch(fetchCartFromBackend() as any);
    } catch (error) {
      console.error('Failed to initialize cart:', error);
    }
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
}; 