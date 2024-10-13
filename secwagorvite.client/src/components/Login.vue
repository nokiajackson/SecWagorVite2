<template>
    <div class="login-container" v-if="userIsAuthenticated">
        <div class="form-group">
            <button type="button" @click="logout">logout</button>
        </div>
    </div>
    <div class="login-container" v-else>
        <img :src="logo" width="250" alt="">
        <h2>Login</h2>
        <form @submit.prevent="loginUser">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model="datas.username" required />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="datas.password" required />
            </div>
            <div class="form-group">
                <label for="campusDropdown">Campus</label>
                <select class="form-control" id="campusDropdown" v-model="datas.campus">
                    <option v-for="campus in campuses" :key="campus" :value="campus.id">
                        {{ campus.campusName }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <button type="submit" >Login</button>
            </div>
            <div class="error-message" v-show="errorMessage">{{ errorMessage }}</div>
        </form>
    </div>
</template>

<script>
import $axios from '@/apiClient';
import { mapState, mapActions } from 'vuex';
import router from '@/router';
import logo from '@/assets/2023 logo 1-01_0.png'; // 使用相对路径导入图片


export default {
    name: 'LoginView',
    computed: {
        ...mapState(['errorMessage'])  // 映射 Vuex 的 errorMessage
    },
    data() {
        return {
            datas: {
                username: "",
                password: "",
                captcha: "",
                campus: 1,
            },
            campuses: [],
            token: null,
            userIsAuthenticated: null,
            logo,
        };
    },
    async mounted() {
        await this.getCampusInfo();
        this.getCampuses();
    },
    methods: {
        getCampuses() {
            $axios.get('/api/Account/GetAllCampuses')
                .then((res) => {
                    this.campuses = res.data;
                })
                .catch((error) => {
                    console.error('Error fetching campuses:', error);
                });
        },
        async getCampusInfo() {
            const res = await $axios.post(`/api/Account/GetCampusInfo`);
            const { data } = res;
            this.userIsAuthenticated = data.success;
        },
        async loginUser() {
            if (this.datas.username === '' || this.datas.password === '' || this.datas.campus === '') {
                this.$store.commit('setErrorMessage', 'Please fill in all fields.');
            } else {
                const success = await this.login(this.datas);
                if (success) {
                    router.push('/entryrecord');  
                }
            }
        },
        ...mapActions(['login']),  // 引入 Vuex 的 login action
        ...mapActions(['logout']),  // 使用 Vuex 的 logout 方法

        // async logout() {
        //     const auth = useAuth();
        //     auth.logout();
        // }
    },
};
</script>

<style>
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4 !important;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.login-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
}

.login-container h2 {
    margin-bottom: 20px;
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-group button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.form-group button:hover {
    background-color: #0056b3;
}

.error-message {
    color: red;
    margin-top: 10px;
}
</style>