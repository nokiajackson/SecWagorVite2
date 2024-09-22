// apiClient.js
import axios from 'axios';

//console.log(import.meta.env.VITE_API_BASE_URL)

// 檢查當前環境是否是內部網路，例如通過判斷域名或者 IP
const isInternalNetwork = () => {
    const hostname = window.location.hostname;
    // 假設內部網路 IP 是 192.168. 或者 localhost
    return hostname.startsWith('192.168.') || hostname === 'localhost';
};


const apiClient = axios.create({
    baseURL: isInternalNetwork() ? 'http://192.168.0.66:8050' : import.meta.env.VITE_API_BASE_URL,
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
