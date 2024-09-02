// src/composables/useAuth.js

import { ref } from 'vue';
import axios from 'axios';

const isAuthenticated = ref(false); // �Ω��ܥΤ�O�_�w�n��

export function useAuth() {
    // ����n�����A
    function getAuthStatus() {
        return isAuthenticated.value;
    }

    // �n����k
    async function login(username, password, campus) {
        try {
            const response = await axios.post('/Api/Account/Login', {
                username,password, campus
            });

            // ���]�n�����\���ݪ�^ 200 ���A
            if (response.status === 200) {
                isAuthenticated.value = true;
                // �i�H�s�x�O�P�ΥΤ�H���쥻�a�s�x�� cookies
                localStorage.setItem('authToken', response.data.token);
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            isAuthenticated.value = false;
        }
    }

    // �n�X��k
    function logout() {
        // �M���{�Ҫ��A
        isAuthenticated.value = false;
        localStorage.removeItem('authToken');
        // �i�H�o�e�ШD���ݶi��n�X�B�z
    }

    // �ˬd�O�_�����Ī��O�P
    function checkAuth() {
        const token = localStorage.getItem('authToken');
        // �p�i�H�b�o�����ҥO�P�����ĩʡA�q�`�ݭn�o�e�ШD����
        isAuthenticated.value = !!token;
    }

    // �b�ե��l�Ʈ��ˬd�{�Ҫ��A
    checkAuth();

    return {
        isAuthenticated: getAuthStatus,
        login,
        logout
    };
}
