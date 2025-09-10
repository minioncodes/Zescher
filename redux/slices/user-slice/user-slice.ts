import { IUser } from "@/models/User";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { getUserId } from "@/app/actions/userActions/user-auth";
import { getCompleteUser } from "@/app/actions/userActions/user-auth";
import { IUserPlain } from "@/types/user_types";

interface userReduxState {
    user: IUserPlain|null;
    userId: string | null;
    loading: boolean;
    err: string | null;
}
const initialState: userReduxState = {
    user: null,
    userId: null,
    loading: false,
    err: null
}
export const fetchUser = createAsyncThunk(
    "user/fetchuser",
    async (_, thunkAPI) => {
        try {
            const id = await getUserId();
            if (!id) throw new Error("no userr id found");
            const details = await getCompleteUser();
            if (!details) {
                throw new Error("user details not found");
            }
            console.log("details from the async thunk api = ",details);
            return { id, details };
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || "sorry we are not able to fetch user");
        }
    }
);
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.userId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(
                fetchUser.fulfilled,
                (state, action: PayloadAction<{ id: string; details: IUserPlain | null }>) => {
                    state.userId = action.payload.id;
                    state.user=action.payload.details;
                    state.loading = false;
                }
            )
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload as string;
            })

    }
});
export const { clearUser } = userSlice.actions
export default userSlice.reducer