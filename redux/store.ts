import { configureStore } from "@reduxjs/toolkit";
import { clearUser } from "./slices/user-slice/user-slice";

export const store = configureStore({
    reducer: {
        clearUser
    }
})

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch