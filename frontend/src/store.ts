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
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];

      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return rejectWithValue(errorData?.message || 'Failed to fetch cart');
      }
      
      const data = await res.json();
      // Convert backend cart items to frontend format
      return (data.items || []).map((item: any) => ({
        id: item.product._id || item.product,
        name: item.product.name || 'Unknown Product',
        price: item.product.price || 0,
        quantity: item.quantity,
      }));
    } catch (error) {
      return rejectWithValue('Network error while fetching cart');
    }
  }
);

export const updateCartInBackend = createAsyncThunk(
  'cart/updateInBackend',
  async (cart: { id: string; name: string; price: number; quantity: number }[], { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return cart; // Just return the cart if not logged in
      
      // Convert frontend cart to backend format
      const items = cart.map(item => ({ product: item.id, quantity: item.quantity }));
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ items }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return rejectWithValue(errorData?.message || 'Failed to update cart');
      }
      
      return cart;
    } catch (error) {
      return rejectWithValue('Network error while updating cart');
    }
  }
);

export const clearCartInBackend = createAsyncThunk(
  'cart/clearInBackend',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return []; // Return empty cart if not logged in
      
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return rejectWithValue(errorData?.message || 'Failed to clear cart');
      }
      
      return [];
    } catch (error) {
      return rejectWithValue('Network error while clearing cart');
    }
  }
);

export const addToCartAndSync = createAsyncThunk(
  'cart/addToCartAndSync',
  async (item: { id: string; name: string; price: number }, { getState, dispatch, rejectWithValue }) => {
    try {
      // Add to Redux cart first
      dispatch(cartSlice.actions.addToCart(item));
      
      // Sync to backend
      const state: any = getState();
      const result = await dispatch(updateCartInBackend(state.cart));
      
      // Check if the backend update was successful
      if (updateCartInBackend.rejected.match(result)) {
        // If backend update failed, return to the previous cart state
        return rejectWithValue(result.payload || 'Failed to add to cart');
      }
      
      return state.cart;
    } catch (error) {
      return rejectWithValue('Error adding to cart');
    }
  }
);

export const changeCartQuantityAndSync = createAsyncThunk(
  'cart/changeCartQuantityAndSync',
  async ({ id, quantity }: { id: string; quantity: number }, { getState, dispatch, rejectWithValue }) => {
    try {
      // Change quantity in Redux cart
      dispatch(cartSlice.actions.changeQuantity({ id, quantity }));
      
      // Sync to backend
      const state: any = getState();
      const result = await dispatch(updateCartInBackend(state.cart));
      
      // Check if the backend update was successful
      if (updateCartInBackend.rejected.match(result)) {
        // If backend update failed, return to the previous cart state
        return rejectWithValue(result.payload || 'Failed to update cart quantity');
      }
      
      return state.cart;
    } catch (error) {
      return rejectWithValue('Error updating cart quantity');
    }
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
      .addCase(fetchCartFromBackend.rejected, (state) => {
        // On error, keep the current state
        return state;
      })
      .addCase(clearCartInBackend.fulfilled, () => [])
      .addCase(clearCartInBackend.rejected, (state) => {
        // On error, keep the current state
        return state;
      })
      .addCase(updateCartInBackend.fulfilled, (_state, action) => action.payload)
      .addCase(updateCartInBackend.rejected, (state) => {
        // On error, keep the current state
        return state;
      })
      .addCase(addToCartAndSync.fulfilled, (_state, action) => action.payload)
      .addCase(addToCartAndSync.rejected, (state) => {
        // On error, keep the current state
        return state;
      })
      .addCase(changeCartQuantityAndSync.fulfilled, (_state, action) => action.payload)
      .addCase(changeCartQuantityAndSync.rejected, (state) => {
        // On error, keep the current state
        return state;
      });
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