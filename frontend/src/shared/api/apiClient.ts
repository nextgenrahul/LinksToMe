import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
interface RefreshResponse {
  accessToken: string;
}


/* =========================
   Attach Access Token
========================= */
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

apiClient.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.set("authorization", `Bearer ${accessToken}`);
  }

  return config;
});


/* =========================
   Refresh Interceptor
========================= */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await apiClient.post<RefreshResponse>("/auth/refresh");

        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) {
          return Promise.reject(error);
        }

        setAccessToken(newAccessToken);

        return apiClient(originalRequest);
      } catch {
        setAccessToken(null);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
