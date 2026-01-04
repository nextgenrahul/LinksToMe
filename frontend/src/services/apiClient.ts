import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // needed for refresh token (httpOnly cookie)
});

/* =========================
   Request Interceptor
========================= */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   Response Interceptor
========================= */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
