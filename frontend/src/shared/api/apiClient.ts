import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { Store } from "@reduxjs/toolkit";
import { setAuth, clearAuth } from "../../features/auth/store/authSlice";

let store: Store | null = null;
export const injectStore = (_store: Store) => {
  store = _store;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
type FailedQueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve(token)
  );
  failedQueue = [];
};

/* REQUEST */
apiClient.interceptors.request.use((config) => {
  const token = store?.getState()?.auth?.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* RESPONSE */
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 🔥 BYPASS refresh endpoint
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string | null) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await apiClient.post("/auth/refresh");
      const { token, user } = data;

      store?.dispatch(setAuth({ user, token }));
      processQueue(null, token);

      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      store?.dispatch(clearAuth());
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;

