
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios';
import VueAxios from 'vue-axios'
import qs from 'qs';

async function getAntiForgeryToken() {
    const response = await axios.get('/Api/Account/antiforgery-token');
    return response.data.token;
}


const app = createApp(App);
app.use(VueAxios, axios)

app.config.globalProperties.$qs = qs;

getAntiForgeryToken().then(token => {
    app.config.globalProperties.$antiForgeryToken = token;
    app.use(router);
    app.mount('#app');
});

