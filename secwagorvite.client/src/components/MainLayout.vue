<template>
  <div>
    <div class="navbar navbar-expand-md navbar-dark bd-navbar shadow rounded">
      <div class="container-xxl flex-wrap flex-md-nowrap ">
        <nav class="collapse navbar-collapse">
          <router-link to="/">登入</router-link>
          <router-link to="/entryrecord" >登記作業</router-link>
          <router-link to="/login/list" v-if="isAuthenticated">列表</router-link>
          <!-- <router-link to="/login/statistic" v-if="isAuthenticated">統計</router-link> -->
          <a href="javascript:;"  @click="logout">登出</a>
        </nav>
        <ul class="navbar-nav flex-row flex-wrap ms-md-auto">
          <li class="nav-item col-6 col-md-auto">
            <span class="nav-link p-2 text-danger">{{CampusName}}</span>
          </li>
        </ul>

      </div>
    </div>
    <div class="container-xxl my-md-4 bd-layout">
      <main class="bd-main order-1" >
        <router-view :key="$route.fullPath"/>
      </main>
    </div>
  </div>
</template>

<script setup>
  import { mapState, mapActions } from 'vuex';

  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.bundle.min.js'
</script>

<script>
  export default {
    name: 'MainLayout',
    data() {
        return {
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
      
    },
    async mounted() {
        //await this.getCampusInfo();
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
  