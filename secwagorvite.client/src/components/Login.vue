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
            </div>
        </div>
    </div>
</template>

<script>
    import $axios from '@/apiClient'; 

    export default {
        data() {
            return {
                datas: {
                    username: "",
                    password: "",
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
                $axios.get('/Api/Account/GetAllCampuses')
                    .then((res) => {
                        this.campuses = res.data;
                    })
                    .catch((error) => {
                        console.error('Error fetching campuses:', error);
                    });
            },
            login() {
                if (
                    this.datas.username === "" ||
                    this.datas.password === "" ||
                    this.datas.campus === ""
                ) {
                    this.errorMessage = "Please fill in all fields.";
                } else {
                    this.errorMessage = "";

                    $axios.post("/Api/Account/Login", this.datas, {
                        headers: {
                            'RequestVerificationToken': this.$antiForgeryToken
                        }
                    })
                    /*
                    this.getAntiForgeryToken()
                        .then((csrfToken) => {
                            return $axios.post("/Api/Account/Login", this.datas, {
                                headers: {
                                    "Content-Type": 'application/x-www-form-urlencoded',
                                    "RequestVerificationToken": csrfToken, // 將防偽令牌加入要求標頭
                                },
                                withCredentials: true, // 允許傳送cookie和防偽令牌
                            });
                        })
                        .then((response) => {
                            if (response.status === 200) {
                                window.location.href = "/Home/EntryRecord";
                            } else {
                                this.errorMessage = "Invalid credentials.";
                            }
                        })
                        .catch((error) => {
                            console.error("Error logging in:", error);
                            if (error.response && error.response.status === 400) {
                                this.errorMessage = "Bad request. Please check your input.";
                            } else {
                                this.errorMessage = "Error logging in.";
                            }
                        });
                        */
                }
            },
            
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