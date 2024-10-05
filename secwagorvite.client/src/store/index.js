// store/index.js
import { createStore } from 'vuex';
import { useAuth } from '@/composables/useAuth'; 

const store = createStore({
    state: {
        isAuthenticated: false,  // 認證狀態
        user: null,              // 用戶信息
        errorMessage: ""         // 錯誤信息
    },
    mutations: {
        setAuthenticated(state, value) {
            state.isAuthenticated = value;
        },
        setUser(state, user) {
            state.user = user;
        },
        setErrorMessage(state, message) {
            state.errorMessage = message;
        }
    },
    actions: {
        async login({ commit }, loginData) {
            const auth = useAuth();
            const data = await auth.login(loginData);

            if (data?.success) {
                commit('setAuthenticated', true);
                commit('setUser', data.user); // 假設登錄成功返回 user 信息
                commit('setErrorMessage', "");  // 清空錯誤信息
                return true;  // 登錄成功返回 true
            } else if (data) {
                commit('setErrorMessage', data.message);  // 設置錯誤信息
                return false;  // 登錄失敗返回 false
            }
        },
        logout({ commit }) {
            commit('setAuthenticated', false);
            commit('setUser', null);
        }
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        getUser: state => state.user,
        getErrorMessage: state => state.errorMessage
    }
});

export default store;
