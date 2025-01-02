<template>
  <div>
    <div class="navbar navbar-expand-sm navbar-dark bd-navbar shadow rounded">
      <div class="container-fluid flex-wrap flex-md-nowrap ">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <nav class="collapse navbar-collapse">
          <router-link to="/" v-if="!isAuthenticated">登入</router-link>
          <router-link to="/entryrecord" >登記作業</router-link>
          <router-link to="/login/list" v-if="isAuthenticated">列表</router-link>
          <!-- <router-link to="/login/statistic" v-if="isAuthenticated">統計</router-link> -->
          <a href="javascript:;"  v-if="isAuthenticated" @click="logout">登出</a>
          <span class="navbar-text d-flex text-right p-2 text-danger">{{CampusName}}</span>
        </nav>
        
      </div>
    </div>
    <div class="container-xxl my-md-4 bd-layout">
      <main class="bd-main order-1 overflow-auto" >
        <router-view :key="$route.fullPath"/>
      </main>
    </div>
  </div>
</template>

<script setup>
  import { mapState, mapActions } from 'vuex';
  import $axios from '@/apiClient';
  
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';

</script>

<script>
  export default {
    name: 'MainLayout',
    data() {
        return {
          userIsAuthenticated: null,
        };
    },
    computed: {
      ...mapState({
        isAuthenticated: state => state.isAuthenticated, // 獲取認證狀態
        CampusName : state => state.campusName, 
      })
    },
    methods: {
      // async logout() {
      //     const auth = useAuth();
      //     await auth.logout();
      // },
      ...mapActions(['logout']),  // 使用 Vuex 的 logout 方法
      async getCampusInfo() {
            const res = await $axios.post(`/api/Account/GetCampusInfo`);
            const { data } = res;
            this.userIsAuthenticated = data.success;
        },
    },
    async mounted() {
        await this.getCampusInfo();
    },
  };
  </script>
  
  <style>
  /* 加入布局相關的樣式 */
  nav {
  display: flex;
  gap: 10px;
}
  </style>
  