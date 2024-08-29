
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
//import Login from './components/Login.vue';
import axios from 'axios';
import VueAxios from 'vue-axios'

const app = createApp(App);
app.use(VueAxios, axios)

// 將 apiClient 掛載到全域屬性上
console.log(import.meta.env.VITE_API_BASE_URL);

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: parseInt(import.meta.env.VITE_AXIOS_TIMEOUT) || 1000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Custom-Header': 'foobar'
    }
});

app.config.globalProperties.$apiClient = apiClient;

app.use(router);
app.mount('#app');