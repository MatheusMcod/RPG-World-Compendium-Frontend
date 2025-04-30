import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
import { userAuthStore } from '@/stores/userAuthStore';

interface RefreshResponse {
  access: string;
}

interface FailedRequest {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: unknown) => void;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(config => {
  const authStore = userAuthStore();
  const token = authStore.accessToken;

  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | void> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        } catch (queueError) {
          return Promise.reject(queueError);
        }
      }

      isRefreshing = true;

      try {

        const refresh = localStorage.getItem('refresh');
        console.log(refresh)
        const { data } = await axiosInstance.post<RefreshResponse>('user/auth/refresh/', { refresh });

        const { access } = data;

        const authStore = userAuthStore();
        authStore.setAccessToken(access);

        processQueue(null, access);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        const authStore = userAuthStore();
        authStore.clearToken();
        router.push({ name: 'login' });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
