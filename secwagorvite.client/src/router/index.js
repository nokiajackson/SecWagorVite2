import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import MainLayout from '@/components/MainLayout.vue';
import EntryRecordBefore from '@/components/EntryRecordBefore.vue';
import EntryRecordAfter from '@/components/EntryRecordAfter.vue';
import HelloWorld from '@/components/HelloWorld.vue';
import { useAuth } from '@/composables/useAuth'; // 自訂的認證處理

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login,
      },
      {
        path: 'entryrecord',
        name: 'EntryRecordAfter',
        component: EntryRecordAfter,
      },
    ],
  },
  {
    path: '/entryrecord',
    name: 'EntryRecordBefore',
    component: EntryRecordBefore,
  },
  {
    path: '/helloWorld',
    name: 'HelloWorld',
    component: HelloWorld,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuth();
    const isAuthenticated = auth.isAuthenticated();

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});
export default router;
