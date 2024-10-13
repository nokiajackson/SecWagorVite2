// store/index.js
import $axios from '@/apiClient'; 
import { createStore } from 'vuex';
import { useAuth } from '@/composables/useAuth'; 

const store = createStore({
    state: {
        isAuthenticated: false,  // 認證狀態
        user: null,              // 用戶信息
        campusName: "",          // 校區
        errorMessage: ""         // 錯誤信息
    },
    mutations: {
        setAuthenticated(state, val) { state.isAuthenticated = val; },
        setUser(state, val) { state.user = val; },
        setCampusName(state, val) { state.campusName = val; },
        setErrorMessage(state, val) { state.errorMessage = val; },
    },
    actions: {
        async getCampusInfo() {
            const res = await $axios.post(`/api/Account/GetCampusInfo`);
            const { data } = res;
            return data;
        },
        async login({ commit,dispatch }, loginData) {
            const auth = useAuth();
            const data = await auth.login(loginData);

            if (data?.success) {
                commit('setAuthenticated', true);
                const user = await dispatch('getCampusInfo');//透過 dispatch 呼叫 getCampusInfo 這方法
                //console.log(user.data)
                commit('setUser', data.user); 
                commit('setCampusName', user.data.campusName); 
                commit('setErrorMessage', "");  
                return true;  
            } else if (data) {
                commit('setErrorMessage', data.message);  
                return false;  
            }
        },
        logout({ commit }) {
            const auth = useAuth();
            auth.logout();

            commit('setAuthenticated', false);
            commit('setUser', null);
            commit('setCampusName', null);
        }
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        getUser: state => state.user,
        getErrorMessage: state => state.errorMessage
    }
});

export default store;
