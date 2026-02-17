import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/shared/api/apiClient";

/* ================================
   TYPES
================================ */

export interface ProfileData {
  id: string;
  username: string;
  name: string;
  bio?: string;
  website?: string;
  profile_picture_url?: string;
  account_status: string;
}

interface ProfileState {
  myProfile: ProfileData | null;
  publicProfile: ProfileData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  myProfile: null,
  publicProfile: null,
  status: "idle",
  error: null,
};

/* ================================
   THUNKS
================================ */

/**
 * Fetch Logged-in User Profile
 */
export const fetchMyProfile = createAsyncThunk<
  ProfileData,
  void,
  { rejectValue: string }
>("profile/fetchMyProfile", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get("/profile/me");
    console.log(data)
    return data.data;
  } catch {
    return rejectWithValue(
      "Failed to fetch profile"
    );
  }
});

/**
 * Update Logged-in User Profile
 */
export const updateMyProfile = createAsyncThunk<
  ProfileData,
  Partial<ProfileData>,
  { rejectValue: string }
>("profile/updateMyProfile", async (updateData, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.patch("/profile/me", updateData);
    return data.data;
  } catch{
    return rejectWithValue(
      "Update failed"
    );
  }
});

/* ================================
   SLICE
================================ */

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Profile
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.status = "succeeded";
        state.myProfile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch profile";
      })

      // Update Profile
      .addCase(updateMyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMyProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.status = "succeeded";
        state.myProfile = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Update failed";
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
