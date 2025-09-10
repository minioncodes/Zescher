import { configureStore } from "@reduxjs/toolkit";
import userReducer from '@/redux/slices/user-slice/user-slice'
import cartReducer from '@/redux/slices/user-slice/cartSlice'
              
export const store = configureStore({
    reducer: {
        user:userReducer,
        cart: cartReducer
    }
})

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch