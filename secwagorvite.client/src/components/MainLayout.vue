<template>
    <div>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/entryrecord">Entry Record</router-link>
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
  