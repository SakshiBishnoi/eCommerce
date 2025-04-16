import { cartSlice, addToCart, removeFromCart, clearCart } from '../store';

const cartReducer = cartSlice.reducer;

describe('cart reducer', () => {
  const initialState: any[] = [];

  it('should handle addToCart', () => {
    const action = addToCart({ id: 1, name: 'Test', price: 10 });
    const state = cartReducer(initialState, action);
    expect(state).toEqual([{ id: 1, name: 'Test', price: 10, quantity: 1 }]);
  });

  it('should increment quantity if product already in cart', () => {
    const stateWithItem = [{ id: 1, name: 'Test', price: 10, quantity: 1 }];
    const action = addToCart({ id: 1, name: 'Test', price: 10 });
    const state = cartReducer(stateWithItem, action);
    expect(state[0].quantity).toBe(2);
  });

  it('should handle removeFromCart', () => {
    const stateWithItem = [{ id: 1, name: 'Test', price: 10, quantity: 1 }];
    const action = removeFromCart(1);
    const state = cartReducer(stateWithItem, action);
    expect(state).toEqual([]);
  });

  it('should handle clearCart', () => {
    const stateWithItems = [
      { id: 1, name: 'Test', price: 10, quantity: 1 },
      { id: 2, name: 'Test2', price: 20, quantity: 2 },
    ];
    const action = clearCart();
    const state = cartReducer(stateWithItems, action);
    expect(state).toEqual([]);
  });
}); 