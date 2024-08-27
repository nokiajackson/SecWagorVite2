
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
//import Login from './components/Login.vue';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const app = createApp(App);

// 將 apiClient 掛載到全域屬性上
app.config.globalProperties.$apiClient = apiClient;

app.use(router);
app.mount('#app');