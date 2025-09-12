// store.ts
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import cartReducer from "./slices/user-slice/cartSlice";
import userReducer from '@/redux/slices/user-slice/user-slice'

// persist config
const persistConfig = {
  key: "root",
  storage,
};

// combine reducers (important if you add more reducers later)
const rootReducer = combineReducers({
  cart: cartReducer,
  user:userReducer
});

// wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);

// ✅ Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
