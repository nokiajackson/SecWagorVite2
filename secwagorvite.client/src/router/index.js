import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import MainLayout from '@/components/MainLayout.vue';
import EntryRecordBefore from '@/components/EntryRecordBefore.vue';
import EntryRecordAfter from '@/components/EntryRecordAfter.vue';
import HelloWorld from '@/components/HelloWorld.vue';
import { useAuth } from '@/composables/useAuth'; // 自訂的認證處理

const routes = [
    //{
    //  path: '',
    //  name: 'Login',
    //  component: Login,
    //},
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Login1',
                component: Login,
            },
            {
                path: 'login',
                name: 'Login2',
                component: Login,
                children: [
                    {
                        path: 'entryrecord',
                        name: 'EntryRecordBefore',
                        component: EntryRecordBefore,
                    },
                ]
            },
            {
                path: 'entryrecord',
                name: 'EntryRecordAfter',
                component: EntryRecordAfter,
            },
            {
                path: 'helloWorld',
                name: 'HelloWorld',
                component: HelloWorld,
            },
        ],
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
