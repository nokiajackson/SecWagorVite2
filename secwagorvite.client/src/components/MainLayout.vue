<template>
  <v-app>
    <v-app-bar app color="primary" flat>
        <v-container class="d-flex align-center">
          <v-btn icon @click="drawer = !drawer" class="d-sm-none">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          
          <v-spacer></v-spacer>
          <v-btn text to="/" v-if="!isAuthenticated">登入</v-btn>
          <v-btn text to="/entryrecord">登記作業</v-btn>
          <v-btn text to="/login/list" v-if="isAuthenticated">列表</v-btn>
          <v-btn text v-if="isAuthenticated" @click="logout">登出</v-btn>
          <span class="text-h6 ml-4 text-blue-lighten-4">{{ CampusName }}</span>
        </v-container>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" app temporary>
        <v-list>
          <v-list-item-group>
            <v-list-item to="/" v-if="!isAuthenticated">登入</v-list-item>
            <v-list-item to="/entryrecord">登記作業</v-list-item>
            <v-list-item to="/login/list" v-if="isAuthenticated">列表</v-list-item>
            <v-list-item v-if="isAuthenticated" @click="logout">登出</v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-main class="d-flex align-center justify-center" style="min-height: 300px; margin-top: 15rem;">
        <v-container fluid>
          <router-view :key="$route.fullPath" />
        </v-container>
      </v-main>

    
  </v-app>
</template>

<script setup>
  import { mapState, mapActions } from 'vuex';
  import $axios from '@/apiClient';
  

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
  