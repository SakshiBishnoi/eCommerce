// Use JSON imports for products and categories
import { configureStore, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export type Product = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  categoryName: string;
  description: string;
  image: string;
  stock: number;
  createdAt: string;
};

const productsSlice = createSlice({
  name: 'products',
  initialState: [] as Product[],
  reducers: {},
});

// --- Cart Thunks ---
export const fetchCartFromBackend = createAsyncThunk(
  'cart/fetchFromBackend',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/cart', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return rejectWithValue('Failed to fetch cart');
    const data = await res.json();
    // Convert backend cart items to frontend format
    return (data.items || []).map((item: any) => ({
      id: item.product._id || item.product,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));
  }
);

export const updateCartInBackend = createAsyncThunk(
  'cart/updateInBackend',
  async (cart: { id: string; name: string; price: number; quantity: number }[], { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    // Convert frontend cart to backend format
    const items = cart.map(item => ({ product: item.id, quantity: item.quantity }));
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) return rejectWithValue('Failed to update cart');
    return cart;
  }
);

export const clearCartInBackend = createAsyncThunk(
  'cart/clearInBackend',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return rejectWithValue('Failed to clear cart');
    return [];
  }
);

export const addToCartAndSync = createAsyncThunk(
  'cart/addToCartAndSync',
  async (item: { id: string; name: string; price: number }, { getState, dispatch }) => {
    // Add to Redux cart first
    dispatch(cartSlice.actions.addToCart(item));
    // Sync to backend
    const state: any = getState();
    await dispatch(updateCartInBackend(state.cart));
    return state.cart;
  }
);

export const changeCartQuantityAndSync = createAsyncThunk(
  'cart/changeCartQuantityAndSync',
  async ({ id, quantity }: { id: string; quantity: number }, { getState, dispatch }) => {
    // Change quantity in Redux cart
    dispatch(cartSlice.actions.changeQuantity({ id, quantity }));
    // Sync to backend
    const state: any = getState();
    await dispatch(updateCartInBackend(state.cart));
    return state.cart;
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: [] as { id: string; name: string; price: number; quantity: number }[],
  reducers: {
    addToCart: (state, action: PayloadAction<{ id: string; name: string; price: number }>) => {
      const item = state.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      return state.filter(i => i.id !== action.payload);
    },
    clearCart: () => [],
    setCart: (_state, action: PayloadAction<{ id: string; name: string; price: number; quantity: number }[]>) => {
      return action.payload;
    },
    changeQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromBackend.fulfilled, (_state, action) => action.payload)
      .addCase(clearCartInBackend.fulfilled, () => [])
      .addCase(updateCartInBackend.fulfilled, (_state, action) => action.payload)
      .addCase(addToCartAndSync.fulfilled, (_state, action) => action.payload)
      .addCase(changeCartQuantityAndSync.fulfilled, (_state, action) => action.payload);
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

export const { addToCart, removeFromCart, clearCart, setCart, changeQuantity } = cartSlice.actions;
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

export { productsSlice }; 