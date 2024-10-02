<template>
    <div>
      <nav>
        <router-link to="/">登入</router-link>
        <router-link to="/entryrecord">登記作業</router-link>
        <router-link to="/login/Statistic" v-if="userIsAuthenticated">統計</router-link>
        <a href="javascript:;"  :click="logout">登出</a>
      </nav>
      <main>
        <router-view :key="$route.fullPath"/>
      </main>
    </div>
  </template>
  
  <script>
  import { useAuth } from '@/composables/useAuth'; // 自訂的認證處理
  import $axios from '@/apiClient'; 

  import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

  export default {
    name: 'MainLayout',
    data() {
        return {
          userIsAuthenticated:null,
        };
    },
    methods: {
      async logout() {
          const auth = useAuth();
          auth.logout();
      },
      async getCampusInfo() {
                const res = await $axios.post(`/api/Account/GetCampusInfo`);
                const { data } = res;
                this.userIsAuthenticated = data.success;
            },
      async mounted() {
          await this.getCampusInfo();
      },
    }
  };
  </script>
  
  <style>
  /* 加入布局相關的樣式 */
  nav {
  display: flex;
  gap: 10px;
}
  </style>
  