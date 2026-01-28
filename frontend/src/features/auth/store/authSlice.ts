import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import apiClient from "@/shared/api/apiClient";
import type { AuthUser } from "../types";

/* =========================
   State
========================= */
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // app bootstraps auth
  error: null,
};

/* =========================
   Thunk: Bootstrap Session
========================= */
export const bootstrapAuth = createAsyncThunk<
  { user: AuthUser },
  void,
  { rejectValue: string }
>("auth/bootstrap", async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get("/auth/me");
    return res.data; // { user }
  } catch {
    return rejectWithValue("Unauthenticated");
  }
});

/* =========================
   Thunk: Logout
========================= */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await apiClient.post("/auth/logout"); // clears cookies server-side
  }
);

/* =========================
   Slice
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Bootstrap
      .addCase(bootstrapAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(bootstrapAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload ?? null;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;

/* =========================
   Selectors
========================= */
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
