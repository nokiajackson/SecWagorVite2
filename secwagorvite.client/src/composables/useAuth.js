// src/composables/useAuth.js

import { ref } from 'vue';
import $axios from '@/apiClient';

const isAuthenticated = ref(false); // 用於表示用戶是否已登錄

export function useAuth() {
    
    // 登錄方法
    async function login(username, password, campus) {
        try {
            const res = await $axios.post('/Api/Account/Login', {
                username,password, campus
            }, {
                headers: {
                    'RequestVerificationToken': this.$antiForgeryToken
                }
            });

            // 假設登錄成功後後端返回 200 狀態
            console.log(res)
            if (res.status === 200) {
                isAuthenticated.value = true;

                // 可以存儲令牌或用戶信息到本地存儲或 cookies
                localStorage.setItem('authToken', res.data.token);
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            isAuthenticated.value = false;
        }
    }

    // 登出方法
    function logout() {
        // 清除認證狀態
        isAuthenticated.value = false;
        localStorage.removeItem('authToken');
        // 可以發送請求到後端進行登出處理
    }

    // 檢查是否有有效的令牌
    function checkAuth() {
        const token = localStorage.getItem('authToken');
        // 妳可以在這裏驗證令牌的有效性，通常需要發送請求到後端
        isAuthenticated.value = !!token;
    }

    // 在組件初始化時檢查認證狀態
    checkAuth();

    return {
        // 獲取登錄狀態
        isAuthenticated: () => isAuthenticated.value,
        // 設定狀態
        setAuthenticated: (status) => { isAuthenticated.value = status; },
        login,
        logout
    };
}
