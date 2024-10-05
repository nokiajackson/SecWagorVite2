// src/composables/useAuth.js

import { ref } from 'vue';
import router from "@/router";
import { useRouter } from 'vue-router';
import $axios from '@/apiClient';
import { globalToken } from '@/main'; // 引入全局 token

const isAuthenticated = ref(false); // 用於表示用戶是否已登錄

export function useAuth() {
    
    // 登錄方法
    const login = async (loginModel) =>{
        try {
            //const token = JSON.parse(localStorage.getItem('token'));
            console.log(loginModel,globalToken)
            const res = await $axios.post('/Api/Account/Login', loginModel, {
                headers: {
                    'RequestVerificationToken': globalToken
                }
            });
            const {data}=res;
            isAuthenticated.value = data.success;
            return data;
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            isAuthenticated.value = false;
        }
    }

    // 登出方法
    async function logout() {
        const res = await $axios.get('/api/Account/Logout');
        
        if (res.data) {
            localStorage.removeItem('token'); // 如果使用 localStorage 儲存 JWT token
            router.push('/login');
    
        }
       
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
