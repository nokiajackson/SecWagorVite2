// apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: parseInt(import.meta.env.VITE_AXIOS_TIMEOUT) || 1000,
    headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'foobar'
    },
    withCredentials: true // 如果需要傳送cookie
});

export default apiClient;
