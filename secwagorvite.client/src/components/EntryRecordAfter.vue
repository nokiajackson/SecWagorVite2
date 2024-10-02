<template>
    <form>
        <div class="row">
            <!-- Left Column -->
            <div class="col-md-4">
                <div class="form-group mb-3">
                    <label class="form-label">校區</label>
                    <select class="form-select" v-model="datas.campusId" v-if="!userIsAuthenticated">
                        <option :value="0">請選擇校區</option>
                        <option v-for="campus in campuses" :key="campus.id" :value="campus.id">{{ campus.campusName }}</option>
                    </select>
                    <div v-else class="form-select-text">{{ campusInfo.campusName }}</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">姓名</label>
                    <input type="text" class="form-control" v-model="datas.fullName">
                </div>
                <div class="mb-3">
                    <label class="form-label">電話</label>
                    <input type="text" class="form-control" v-model="$data.datas.phoneNumber">
                </div>
                <div class="mb-3">
                    <label class="form-label">人數</label>
                    <input type="number" class="form-control" v-model.number="datas.numberOfPeople">
                </div>
                <div class="mb-3">
                    <label class="form-label">受訪人</label>
                    <input type="text" class="form-control" v-model="datas.interviewee">
                </div>
            </div>

            <!-- Right Column -->
            <div class="col-md-8">
                <div class="mb-3">
                    <label class="form-label">事由 : </label>
                    <label class="form-check form-check-inline"
                           v-for="option in enums.purposes" :key="option.Key">
                        <input class="form-check-input" type="radio" v-model="datas.purpose" :value="option.key">
                        <span class="form-check-label">{{ option.name }}</span>
                    </label>
                    <div class="form-check form-check-inline col">
                        <input type="text" class="form-control" v-model="datas.otherDescription" placeholder="其他說明">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">備註</label>
                    <textarea class="form-control" v-model="datas.note" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">換證號碼</label>
                    <input type="text" class="form-control" v-model="datas.replacementNumber">
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="entryTime" class="form-label">入校日期</label>
                        <VueDatePicker v-model="entryTime" :format="'yyyy-MM-dd'" />
                        <button type="button" class="btn btn-sm btn-outline-primary mt-2" v-on:click="setCurrentDateTime">帶入現在時間</button>
                    </div>
                    <div class="col-6">
                        <label for="entryTime" class="form-label">入校時間</label>
                        <div class="input-group">
                            <input type="number" class="form-control" placeholder="時" v-model.number="entryHour" v-on:change="combineEntryTime">
                            <input type="number" class="form-control" placeholder="分" v-model.number="entryMin" v-on:change="combineEntryTime">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-end">
            <button type="button" class="btn btn-primary" v-on:click="submitForm">送出</button>
        </div>
    </form>

    <!-- Table for authenticated users -->
    <div class="row mt-4" v-if="userIsAuthenticated">
        <table class="table table-striped border">
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>電話</th>
                    <th>人數</th>
                    <th>受訪人</th>
                    <th>事由</th>
                    <th>備註</th>
                    <th>換證號碼</th>
                    <th>入校時間</th>
                    <th>離校時間</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="log in entryLogs" :key="log.id">
                    <td>{{ log.fullName }}</td>
                    <td>{{ log.phoneNumber }}</td>
                    <td class="text-center">{{ log.numberOfPeople }}</td>
                    <td>{{ log.interviewee }}</td>
                    <td>{{ findPurpose(log.purpose) }}</td>
                    <td>{{ log.note }}</td>
                    <td>{{ log.replacementNumber }}</td>
                    <td><b>{{ formatDate(log.entryTime) }}</b></td>
                    <td>
                        <b v-if="log.exitTime">{{ formatDate(log.exitTime) }}</b>
                        <button v-else class="btn btn-danger text-white" v-on:click="setExitDate(log)">紀錄離校時間</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal for setting exit time -->
    <div class="modal fade" id="setExitDateDiaglog" tabindex="-1" aria-labelledby="setExitDateDiaglogLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="setExitDateDiaglogLabel">離校時間</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-6">
                            <label for="exitTime" class="form-label">離校日期</label>
                            <input type="text" class="form-control" id="exitTime" v-model="exitTime" v-on:change="combineExitTime">
                            <button type="button" class="btn btn-sm btn-outline-primary mt-2" v-on:click="setCurrentDateTimeToExitTime">帶入現在時間</button>
                        </div>
                        <div class="col-6">
                            <label for="exitTime" class="form-label">離校時間</label>
                            <div class="input-group">
                                <input type="number" class="form-control" placeholder="時" v-model.number="exitHour" v-on:change="combineExitTime">
                                <input type="number" class="form-control" placeholder="分" v-model.number="exitMin" v-on:change="combineExitTime">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" v-on:click="submitExitForm">保存變更</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import $axios from '@/apiClient';
    import $ from 'jquery';
    import { Modal } from 'bootstrap'


    export default {
        data() {
            return {
                toast_msg: '',//系統訊息固定 #liveToast
                userIsAuthenticated: true, //用頁面判斷是否為登入
                enums: {
                    purposes: [],
                },
                campuses: [],
                campusInfo:{ "campusName": "", "campusId": "" },
                params: {
                    FullName: null,
                    Purpose: null,
                    EntryTimeStart: null,
                    EntryTimeEnd: null,

                },
                entryLogs: [], // 存放返回的 entryLogs
                entryTime: null,
                entryHour: 0,
                entryMin: 0,
                exitTime: null,
                exitHour: 0,
                exitMin: 0,
                datas: {
                    id: 0,
                    campusId: 0,
                    phoneNumber: '',
                    fullName: '',
                    numberOfPeople: 0,
                    interviewee: '',//受訪人
                    purpose: 0,
                    otherDescription: '',
                    note: '',
                    replacementNumber: '',
                    entryTime: null,
                    exitTime: null,
                },
                entryLogsItem: {
                    entryTime: null,
                },//存檔用
            };
        },
        async created() {
            await this.fetchEnum();
            await this.getCampuses();
            await this.getCampusInfo();

            if (this.userIsAuthenticated) {
                await this.searchLogList();
            }
        },
        watch: {
            'entryHour': function (newVal) {
                if (newVal < 0) {
                    this.entryHour = 0;
                } else if (newVal > 23) {
                    this.entryHour = 23;
                }
            },
            'entryMin': function (newVal) {
                if (newVal < 0) {
                    this.entryMin = 0;
                } else if (newVal > 59) {
                    this.entryMin = 59;
                }
            },
            'exitHour': function (newVal) {
                if (newVal < 0) {
                    this.exitHour = 0;
                } else if (newVal > 23) {
                    this.exitHour = 23;
                }
            },
            'exitMin': function (newVal) {
                if (newVal < 0) {
                    this.exitMin = 0;
                } else if (newVal > 59) {
                    this.exitMin = 59;
                }
            }
        },
        methods: {
            toastMsg(msg) {
                this.toast_msg = msg;
                $('#liveToast').toast('show');
            },
            setCurrentDateTime() {
                const now = this.$moment();
                this.entryTime = now.format('YYYY-MM-DD');
                this.entryHour = now.hour();
                this.entryMin = now.minute();
                this.combineEntryTime(); // 合併時間並更新 datas.entryTime
            },
            setCurrentDateTimeToExitTime() {
                const now = this.$moment();
                this.exitTime = now.format('YYYY-MM-DD');
                this.exitHour = now.hour();
                this.exitMin = now.minute();
                this.combineExitTime(); // 合併時間並更新 datas.exitTime
            },
            combineEntryTime() {
                if (this.entryTime) {
                    const combinedTime = `${this.entryTime} ${String(this.entryHour).padStart(2, '0')}:${String(this.entryMin).padStart(2, '0')}:00`;
                    this.datas.entryTime = this.$moment(combinedTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
                } else {
                    this.datas.entryTime = null;
                }
            },
            combineExitTime() {
                if (this.exitTime) {
                    const combinedTime = `${this.exitTime} ${String(this.exitHour).padStart(2, '0')}:${String(this.exitMin).padStart(2, '0')}:00`;
                    this.entryLogsItem.exitTime = this.$moment(combinedTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
                } else {
                    this.entryLogsItem.exitTime = null;
                }
            },
            async submitForm() {
                const tt = JSON.parse(JSON.stringify(this.datas));
                // console.log(`/api/Entry/Update`, JSON.stringify(this.datas))
                //之後再加入驗證
                try {
                    await $axios.post(`/api/Entry/Update`, tt).then((res) => {
                            const { data } = res;
                            if(data.success)
                                alert('提交成功');
                        });
                    this.searchLogList();
                } catch (error) {
                    console.error('提交失敗:', error);
                    //alert('提交失敗');
                }
            },
            async submitExitForm() {
                //this.datas
                const tt = JSON.parse(JSON.stringify(this.entryLogsItem));
                //之後再加入驗證
                try {
                        await $axios.post(`/api/Entry/UpdateExitDate`, tt).then((res) => {
                            const { data } = res;
                            if(data.success){
                                var setExitDateDiaglog = new Modal(document.getElementById('setExitDateDiaglog'));
                                setExitDateDiaglog.hide();
                            }
                            //alert('提交成功');
                        });
                    this.searchLogList();
                } catch (error) {
                    console.error('提交失敗:', error);
                    //alert('提交失敗');
                }
            },
            async getCampuses() {
                // 發送 AJAX GET 請求以獲取所有校區數據
                const res = await $axios.get(`/api/Account/GetAllCampuses`)
                this.campuses = res.data
            },
            async fetchEnum() {
                const res = await $axios.get(`/api/Common/EnumList`);
                this.enums = res.data;
            },
            async getCampusInfo() {
                const res = await $axios.post(`/api/Account/GetCampusInfo`);
                const { data } = res;
                this.userIsAuthenticated = data.success;
                if(data.success){
                    this.campusInfo = data.data;
                    this.datas.campusId = data.data.campusId;
                }
            },
            async searchLogList() {
                const params = this.params;
                const today = this.$moment().format('YYYY-MM-DD');
                params.EntryTimeStart = this.$moment(today).startOf('day').format('YYYY-MM-DD HH:mm:ss');
                params.EntryTimeEnd = this.$moment(today).endOf('day').format('YYYY-MM-DD HH:mm:ss');
                params.ExitTimeStart = null;
                params.ExitTimeEnd = null;
                //console.log(params)
                // 發送帶有搜索參數的 GET 請求到 API
                const res = await $axios.get(`/api/Entry/EntryLogList`, { params });
                // 更新 entryLogs 數據

                this.entryLogs = res.data;
            },
           
            formatDate(date) {
                return this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            findPurpose(val) {
                if (this.enums.purposes.length > 0 && val) {
                    const tt = this.enums.purposes.find(x => x.key == val);
                    if (tt) {
                        return tt.name;
                    }
                    return '無';
                }
            },
            setExitDate(item) {
                var setExitDateDiaglog = new Modal($('#setExitDateDiaglog'));
                setExitDateDiaglog.show();
                //需要洗過資料
                this.entryLogsItem = Object.assign({}, item);
            },
        }
    };
</script>


<style scoped>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px;
        border: 1px solid black;
    }

    h1 {
        text-align: center;
    }
    /* Form Layout Styles */
.form-label {
    font-weight: bold;
    margin-bottom: 5px;
}

.form-select, .form-control {
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
}

.form-select-text {
    padding: 10px;
    background-color: #f1f1f1;
    border-radius: 5px;
    font-size: 14px;
}

/* Row and Column Layout */
.row {
    margin-top: 20px;
}

.col-md-4, .col-md-8 {
    padding: 10px;
}

.mb-3 {
    margin-bottom: 15px;
}

/* Buttons */
.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    padding: 10px 20px;
}

.btn-outline-primary {
    padding: 5px 10px;
}

/* Table Styles */
.table-striped {
    margin-top: 20px;
}

.table th, .table td {
    text-align: center;
    vertical-align: middle;
}

.table .btn-danger {
    padding: 5px 10px;
}

/* Modal Styles */
.modal-title {
    font-size: 18px;
    font-weight: bold;
}

.modal-footer .btn {
    padding: 5px 15px;
}

</style>
