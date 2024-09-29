<template>
    <div>
      <nav>
        <router-link to="/">登入</router-link>
        <router-link to="/entryrecord">登記作業</router-link>
        <router-link to="/login/Statistic">統計</router-link>
        <router-link >登出</router-link>
      </nav>
      <main>
        <router-view />
      </main>
    </div>
  </template>
  
  <script>
  import { useAuth } from '@/composables/useAuth'; // 自訂的認證處理

  export default {
    name: 'MainLayout',
  };
  </script>
  
  <style>
  /* 加入布局相關的樣式 */
  nav {
  display: flex;
  gap: 10px;
}
  </style>
  