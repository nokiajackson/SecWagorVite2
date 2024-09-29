<template>
    <div class="login-container" v-if="userIsAuthenticated">
        <div class="form-group">
                <button type="button" @click="logout">logout</button>
            </div>
    </div>
    <div class="login-container" v-else>
        <h2>Login</h2>
        <div>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model="datas.username" required />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password"
                            id="password"
                            v-model="datas.password"
                            required />
            </div>
            <div class="form-group">
                <label for="campusDropdown">Campus</label>
                <select class="form-control" id="campusDropdown" v-model="datas.campus">
                    <option v-for="campus in campuses" :key="campus" :value="campus.id">
                        {{ campus.campusName }}
                    </option>
                </select>
            </div>
            <div class="error-message" v-show="errorMessage">{{ errorMessage }}</div>
            <div class="form-group">
                <button type="button" @click="login">Login</button>
            </div>
        </div>
    </div>
    <router-view />
</template>

<script>
    import $axios from '@/apiClient'; 
    import router from "@/router";
    import { useRouter } from 'vue-router';
    import { useAuth } from '@/composables/useAuth'; // 自訂的認證處理
    

    export default {
        name: 'LoginView',
        data() {
            return {
                datas: {
                    username: "",
                    password: "",
                    captcha: "",
                    campus: 1,
                },
                campuses: [],
                errorMessage: "",
                token: null,
                userIsAuthenticated:null,
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
            async login() {
                if (
                    this.datas.username === "" ||
                    this.datas.password === "" ||
                    this.datas.campus === ""
                ) {
                    this.errorMessage = "Please fill in all fields.";
                } else {
                    this.errorMessage = "";

                    // 可以移到 useAuth.js
                    // this.$antiForgeryToken 可以直接取用
                    const auth = useAuth();
                    auth.login(this.datas);

                    /*const router = useRouter();
                    const res = await $axios.post("/api/Account/Login", this.datas, {
                        headers: {
                            'RequestVerificationToken': this.$antiForgeryToken
                        }
                    });
                    if (res.data) {
                        
                        auth.setAuthenticated(true); 
                        //console.log(auth.isAuthenticated())
                        //this.$router.push(this.$route.query.redirect || '/');
                        router.push('/login/entryrecord');
                    } else {
                        this.errorMessage = "登入失敗.";
                    }*/
                }
            },
            async getCampusInfo() {
                const res = await $axios.post(`/api/Account/GetCampusInfo`);
                const { data } = res;
                this.userIsAuthenticated = data.success;
            },
            async logout() {
                try {
                    await $axios.get('/api/Account/Logout');

                    localStorage.removeItem('token'); // 如果使用 localStorage 儲存 JWT token
                    router.push('/login');
                } catch (error) {
                    console.error("Logout failed", error);
                }
            }
        },
        
    };
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
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