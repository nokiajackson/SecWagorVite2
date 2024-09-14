<template>
    <div class="login-container">
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
                <button type="button" class="btn btn-outline-primary" @click="logout">Log out</button>
            </div>
        </div>
    </div>
</template>

<script>
    import $axios from '@/apiClient'; 
    import { useRouter } from 'vue-router';

    export default {
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
            };
        },
        mounted() {
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
            login() {
                const router = useRouter();
                console.log(this.$antiForgeryToken)
                if (
                    this.datas.username === "" ||
                    this.datas.password === "" ||
                    this.datas.campus === ""
                ) {
                    this.errorMessage = "Please fill in all fields.";
                } else {
                    this.errorMessage = "";

                    const res = $axios.post("/api/Account/Login", this.datas, {
                        headers: {
                            'RequestVerificationToken': this.$antiForgeryToken
                        }
                    });
                    console.log(res.data)
                    if (res.data) {
                        router.push('/dashboard'); // 或其他需要跳轉的路由
                    }
                }
            },
            async logout() {
                try {
                // 發送登出請求到後端
                await axios.post('/api/Account/Logout');

                // 清除本地存儲的 token 或用戶信息
                localStorage.removeItem('token'); // 如果使用 localStorage 儲存 JWT token
                this.$router.push('/login'); // 重定向到登錄頁面

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