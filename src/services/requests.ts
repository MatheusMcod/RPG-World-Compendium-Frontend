import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';

interface RefreshResponse {
  access: string;
  refresh?: string;
}

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | void> => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        const res = await axios.post<RefreshResponse>('http://localhost:8000/api/v1/user/', {
          refresh_token: refreshToken,
        });

        const { access, refresh } = res.data;
        localStorage.setItem('access_token', access);
        if (refresh) localStorage.setItem('refresh_token', refresh);

        processQueue(null, access);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
        }
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError, null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        router.push({ name: 'login' });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
