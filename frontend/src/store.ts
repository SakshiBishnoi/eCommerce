import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  name: 'products',
  initialState: [
    { id: 1, name: 'Product 1', price: 49.99 },
    { id: 2, name: 'Product 2', price: 99.99 },
  ],
  reducers: {},
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: [] as { id: number; name: string; price: number; quantity: number }[],
  reducers: {
    addToCart: (state, action: PayloadAction<{ id: number; name: string; price: number }>) => {
      const item = state.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      return state.filter(i => i.id !== action.payload);
    },
    clearCart: () => [],
  },
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: [] as { id: number; items: any[]; total: number; date: string }[],
  reducers: {
    placeOrder: (state, action: PayloadAction<{ items: any[]; total: number }>) => {
      state.push({
        id: state.length + 1,
        items: action.payload.items,
        total: action.payload.total,
        date: new Date().toISOString(),
      });
    },
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: { isAdmin: false, name: 'Guest' },
  reducers: {
    loginAsAdmin: (state) => { state.isAdmin = true; state.name = 'Admin'; },
    loginAsUser: (state) => { state.isAdmin = false; state.name = 'User'; },
    logout: (state) => { state.isAdmin = false; state.name = 'Guest'; },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const { placeOrder } = ordersSlice.actions;
export const { loginAsAdmin, loginAsUser, logout } = userSlice.actions;

export const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
    orders: ordersSlice.reducer,
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 