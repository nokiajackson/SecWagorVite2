// apiClient.js
import axios from 'axios';

console.log(import.meta.env.VITE_API_BASE_URL)
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: parseInt(import.meta.env.VITE_AXIOS_TIMEOUT) || 1000,
    headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'foobar'
    },
    withCredentials: true // 如果需要傳送cookie
});

// 請求攔截器
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // 未授權，跳轉到登錄頁面
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
