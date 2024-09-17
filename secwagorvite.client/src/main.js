
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios';
import $axios from '@/apiClient';
import VueAxios from 'vue-axios'
import qs from 'qs';
import moment from 'moment';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

async function getAntiForgeryToken() {
    const response = await $axios.get('/api/Account/GetAntiForgeryToken');
    const { token} = response.data;
    localStorage.setItem('token', JSON.stringify(token))
    return token;
}


const app = createApp(App);
app.use(VueAxios, axios)
app.component('VueDatePicker', VueDatePicker);

app.config.globalProperties.$moment = moment;
app.config.globalProperties.$qs = qs;

getAntiForgeryToken().then(token => {

    app.config.globalProperties.$antiForgeryToken = token;
    app.use(router);
    app.mount('#app');
});

