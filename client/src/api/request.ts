import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from '../constants';

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(
                `HTTP error ${error.response.status}:`,
                error.response.data || error.response.statusText
            );
        } else {
            console.error('Network error:', error.message);
        }
        return Promise.reject(error);
    }
);

export interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: unknown;
    params?: Record<string, string | number>;
    headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
    data: T;
}

export const request = async <T = unknown>(
    options: RequestOptions
): Promise<ApiResponse<T>> => {
    const { url, method = 'GET', data, params, headers } = options;

    try {
        const response = await api.request<T>({
            url,
            method,
            data,
            params,
            headers,
        });
        return { data: response.data };
    } catch (error) {
        console.error(`API request failed for ${url}:`, error);
        throw error;
    }
};

export default api;
