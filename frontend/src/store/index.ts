import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import { injectStore } from '@/shared/api/apiClient';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Future features will be added here:
    // feed: feedReducer,
    // messages: messageReducer,
  },
  // DevTools are enabled by default in development
});

injectStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;