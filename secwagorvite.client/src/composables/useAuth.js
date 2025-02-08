// src/composables/useAuth.js

import { ref } from 'vue';
import router from "@/router";
import $axios from '@/apiClient';

const isAuthenticated = ref(false); // 用於表示用戶是否已登錄
const antiForgeryToken = ref(null); // 全局的 Anti-Forgery Token

export function useAuth() {
    
    // 初始化 Anti-Forgery Token
    async function initializeAntiForgeryToken() {
        try {
            const response = await $axios.get('/api/Account/GetAntiForgeryToken');
            antiForgeryToken.value = response.data.token;
            localStorage.setItem('antiForgeryToken', JSON.stringify(response.data.token));
        } catch (error) {
            console.error('Failed to fetch Anti-Forgery Token:', error.response?.data || error.message);
        }
    }

    // 登錄方法
    const login = async (loginModel) => {
        try {
            if (!antiForgeryToken.value) {
                await initializeAntiForgeryToken(); // 確保 Anti-Forgery Token 已加載
            }
            const res = await $axios.post('/Api/Account/Login', loginModel, {
                headers: {
                    'RequestVerificationToken': antiForgeryToken.value,
                }
            });
            const { data } = res;
            isAuthenticated.value = data.success;

            if (data.success) {
                localStorage.setItem('authToken', data.token); // 儲存用戶的 JWT Token
            }
            return data;
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            isAuthenticated.value = false;
        }
    };

    // 登出方法
    async function logout() {
        try {
            const res = await $axios.get('/api/Account/Logout');
            if (res.data) {
                localStorage.removeItem('authToken'); // 移除本地儲存的 JWT Token
                isAuthenticated.value = false;
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
        }
    }

    // 檢查是否有有效的令牌
    function checkAuth() {
        const token = localStorage.getItem('authToken');
        isAuthenticated.value = !!token; // 簡單檢查令牌是否存在
    }

    // 初始化 Anti-Forgery Token 和檢查認證狀態
    initializeAntiForgeryToken();
    checkAuth();

    return {
        // 獲取登錄狀態
        isAuthenticated: () => isAuthenticated.value,
        // 設定狀態
        setAuthenticated: (status) => { isAuthenticated.value = status; },
        login,
        logout,
    };
}
