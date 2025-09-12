import { getProducts } from "@/app/actions/userActions/user-products";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};
export const fetchCartProduct = createAsyncThunk(
  "/fetchcartProduct",
  async (_, thunkAPI) => {
    try {
      const cartProducts = await getProducts();
      if (!cartProducts) {
        throw new Error("cart products not found!")
      }
      return cartProducts;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
)
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => item._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: string; decreaseOnly?: boolean }>
    ) => {
      const item = state.items.find((i) => i._id === action.payload.id);
      if (!item) return;

      if (action.payload.decreaseOnly) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== action.payload.id);
        }
      } else {
        state.items = state.items.filter((i) => i._id !== action.payload.id);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
