import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getMyLinksApi, createLinkApi, deleteLinkApi } from "../api/links.api";
import { getLinkAnalyticsApi } from "../api/analytics.api";
import type { UserLink, CreateLinkPayload } from "../types";
import type { LinkAnalytics } from "../types/analytics.types";

/* ================================
   STATE
================================ */

interface LinksState {
    items: UserLink[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;

    // Single-link analytics
    analytics: LinkAnalytics | null;
    analyticsStatus: "idle" | "loading" | "succeeded" | "failed";
    analyticsError: string | null;
}

const initialState: LinksState = {
    items: [],
    status: "idle",
    error: null,

    analytics: null,
    analyticsStatus: "idle",
    analyticsError: null,
};

/* ================================
   THUNKS
================================ */

/**
 * Fetch all links for the logged-in user
 */
export const fetchMyLinks = createAsyncThunk<
    UserLink[],
    void,
    { rejectValue: string }
>("links/fetchMyLinks", async (_, { rejectWithValue }) => {
    try {
        return await getMyLinksApi();
    } catch {
        return rejectWithValue("Failed to fetch links");
    }
});

/**
 * Create a new link
 */
export const createLink = createAsyncThunk<
    UserLink,
    CreateLinkPayload,
    { rejectValue: string }
>("links/createLink", async (payload, { rejectWithValue }) => {
    try {
        return await createLinkApi(payload);
    } catch {
        return rejectWithValue("Failed to create link");
    }
});

/**
 * Delete a link by ID
 */
export const deleteLink = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("links/deleteLink", async (linkId, { rejectWithValue }) => {
    try {
        await deleteLinkApi(linkId);
        return linkId;
    } catch {
        return rejectWithValue("Failed to delete link");
    }
});

/**
 * Fetch analytics for a specific link
 */
export const fetchLinkAnalytics = createAsyncThunk<
    LinkAnalytics,
    { linkId: string; token: string },
    { rejectValue: string }
>("links/fetchLinkAnalytics", async ({ linkId, token }, { rejectWithValue }) => {
    try {
        return await getLinkAnalyticsApi(linkId, token);
    } catch {
        return rejectWithValue("Failed to load analytics");
    }
});

/* ================================
   SLICE
================================ */

const linksSlice = createSlice({
    name: "links",
    initialState,
    reducers: {
        clearLinksError: (state) => {
            state.error = null;
        },
        clearAnalytics: (state) => {
            state.analytics = null;
            state.analyticsStatus = "idle";
            state.analyticsError = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // ─── Fetch My Links ────────────────────────────────────────────────
            .addCase(fetchMyLinks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMyLinks.fulfilled, (state, action: PayloadAction<UserLink[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchMyLinks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch links";
            })

            // ─── Create Link ──────────────────────────────────────────────────
            .addCase(createLink.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createLink.fulfilled, (state, action: PayloadAction<UserLink>) => {
                state.status = "succeeded";
                state.items.push(action.payload);
            })
            .addCase(createLink.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to create link";
            })

            // ─── Delete Link ──────────────────────────────────────────────────
            .addCase(deleteLink.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteLink.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "succeeded";
                state.items = state.items.filter((link) => link.id !== action.payload);
            })
            .addCase(deleteLink.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to delete link";
            })

            // ─── Fetch Link Analytics ─────────────────────────────────────────
            .addCase(fetchLinkAnalytics.pending, (state) => {
                state.analyticsStatus = "loading";
            })
            .addCase(fetchLinkAnalytics.fulfilled, (state, action: PayloadAction<LinkAnalytics>) => {
                state.analyticsStatus = "succeeded";
                state.analytics = action.payload;
            })
            .addCase(fetchLinkAnalytics.rejected, (state, action) => {
                state.analyticsStatus = "failed";
                state.analyticsError = action.payload || "Failed to load analytics";
            });
    },
});

export const { clearLinksError, clearAnalytics } = linksSlice.actions;
export default linksSlice.reducer;
