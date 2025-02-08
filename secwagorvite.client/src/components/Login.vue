<template>
    <v-container class="login-container">
      <!-- 已登入 -->
      <div v-if="userIsAuthenticated">
        <v-card class="pa-4">
          <v-btn color="primary" class="text-black" @click="logout">Logout</v-btn>
        </v-card>
      </div>
  
      <!-- 未登入 -->
      <div v-else>
        <v-card class="pa-4" elevation="2">
          <v-img :src="logo" min-width="350" class="mx-auto mb-4"></v-img>
          <v-card-title class="text-center">Login</v-card-title>
          <v-form @submit.prevent="loginUser" ref="form">
            <v-text-field
              v-model="datas.username"
              label="Username"
              outlined
              dense
              required
            ></v-text-field>
            <v-text-field
              v-model="datas.password"
              label="Password"
              type="password"
              outlined
              dense
              required
            ></v-text-field>
            <v-select
            label="Campus"
              v-model="datas.campus"
              :items="campuses"
              item-title="campusName"
              item-value="id"
              outlined
              dense
            ></v-select>
            <v-btn type="submit" color="primary" block class="mt-4">
              Login
            </v-btn>
            <v-alert
              v-show="errorMessage"
              type="error"
              outlined
              class="mt-4"
            >
              {{ errorMessage }}
            </v-alert>
          </v-form>
        </v-card>
      </div>
    </v-container>
  </template>
  
<script>
import $axios from '@/apiClient';
import { mapState, mapActions } from 'vuex';
import router from '@/router';
import logo from '@/assets/2023 logo 1-01_0.png'; 

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
                campus: { "id": 1, "campusName": "北屯校區" },
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
                  this.campuses = res.data.map(({ id, campusName }) => ({ id, campusName }));
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