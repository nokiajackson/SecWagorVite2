<template>
    <div>
      <nav>
        <router-link to="/">登入</router-link>
        <router-link to="/entryrecord">登記作業</router-link>
      </nav>
      <main>
        <router-view />
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MainLayout',
  };
  </script>
  
  <style>
  /* 加入布局相關的樣式 */
  </style>
  