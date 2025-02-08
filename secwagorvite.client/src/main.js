import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/main.css';
import axios from 'axios';
import $axios from '@/apiClient';
import VueAxios from 'vue-axios';
import qs from 'qs';
import moment from 'moment';

import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // 導入 Vuetify 樣式
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
});

// 設置全局字體（在 main.css 中）
/* body { font-family: 'Roboto, Arial, sans-serif'; } */

const app = createApp(App);

// 全局注入插件和屬性
app.use(VueAxios, axios);
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$qs = qs;

async function initializeApp() {
    try {
        const { data } = await $axios.get('/api/Account/GetAntiForgeryToken');
        localStorage.setItem('token', JSON.stringify(data.token));
        app.config.globalProperties.$antiForgeryToken = data.token;
    } catch (error) {
        console.error('Failed to fetch anti-forgery token:', error);
    }

    app.use(store); // 使用 Vuex
    app.use(router);
    app.use(vuetify);
    app.mount('#app');
}

initializeApp();

export default app;
