import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import apiClient, { setAccessToken } from "@/shared/api/apiClient";
import type { AuthState } from "../types";
import type { AuthUser } from "../types";


const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const bootstrapAuth = createAsyncThunk<
  { user: AuthUser; accessToken: string },
  void,
  { rejectValue: string }
>("auth/bootstrap", async (_, { rejectWithValue }) => {
  try {
    const refreshRes = await apiClient.post<{ accessToken: string }>(
      "/auth/refresh"
    );

    const accessToken = refreshRes.data.accessToken;

    setAccessToken(accessToken);

    const meRes = await apiClient.get<{ user: AuthUser }>("/auth/me");

    return {
      user: meRes.data.user,
      accessToken,
    };
  } catch {
    setAccessToken(null);
    return rejectWithValue("Unauthenticated");
  }
});




// export const bootstrapAuth = createAsyncThunk<
//   { user: AuthUser; accessToken: string; },
//   void,
//   { rejectValue: string }>("auth/bootstrap", async (_, { rejectWithValue }) => {
//     try {
//       const res = await apiClient.get("/auth/me", {
//         withCredentials: true,
//       });

//       return res.data;
//     } catch {
//       return rejectWithValue("Unauthenticated");
//     }
//   });


export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await apiClient.post("/auth/logout");
    setAccessToken(null);
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(bootstrapAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
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


export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
