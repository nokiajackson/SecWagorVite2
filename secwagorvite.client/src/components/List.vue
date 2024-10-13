<script setup>
    import WelcomeItem from './WelcomeItem.vue'
    import DocumentationIcon from './icons/IconDocumentation.vue'
    import ToolingIcon from './icons/IconTooling.vue'
    import EcosystemIcon from './icons/IconEcosystem.vue'
    import CommunityIcon from './icons/IconCommunity.vue'
    import SupportIcon from './icons/IconSupport.vue'


</script>

<template>
    <form class="bd-content ps-lg-4">
        <div class="row mb-3">
                <div class="col-md-4">
                    <label class="col ml-2">姓名</label>
                    <input type="text" v-model="params.FullName" class="form-control" placeholder="姓名">
                </div>
                <div class="col-md-4">
                    <label>事由</label>
                    <select v-model="params.Purpose" class="form-control">
                        <option :value=null>無</option>
                        <option v-for="item in enums.purposes" :key="item.key" :value="item.key">{{ item.name }}</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-3">
                    <label>進場時間開始</label>
                    <VueDatePicker v-model="params.EntryTimeStart" :format="'yyyy-MM-dd hh:mm'" />
                </div>
                <div class="col-md-3">
                    <label>進場時間結束</label>
                    <VueDatePicker v-model="params.EntryTimeEnd" :format="'yyyy-MM-dd hh:mm'" />
                </div>
                <div class="col-md-3">
                    <label>出場時間開始</label>
                    <VueDatePicker v-model="params.ExitTimeStart" :format="'yyyy-MM-dd hh:mm'" />
                </div>
                <div class="col-md-3">
                    <label>出場時間結束</label>
                    <VueDatePicker v-model="params.ExitTimeEnd" :format="'yyyy-MM-dd hh:mm'" />
                </div>
            </div>
            <div class="row mb-3">
                <!-- <pre>{{ params }}</pre> -->
            </div>
            <div class="row mb-3">
                <div class="col-md-12 text-center">
                    <button type="button" class="btn btn-info text-white" v-on:click="searchLogList">搜索</button>
                </div>
            </div>
    </form>
    
    <!-- 表格 -->
    <table class="table table-striped border mt-2">
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
                    <b v-if="log.exitTime">
                        {{ formatDate(log.exitTime) }}
                    </b>
                    <a v-else href="javascript:;" class="btn btn-danger text-white" v-on:click="setExitDate(log)">
                        紀錄離校時間
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
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
        data(){
            return {
                //setExitDateDiaglog:null,
                toast_msg: '',//系統訊息固定 #liveToast
                userIsAuthenticated: true, //用頁面判斷是否為登入
                enums: {
                    purposes: [],
                },
                campuses: [],
                campusInfo:{ "campusName": "", "campusId": "" },
                entryTime: null,
                entryHour: 0,
                entryMin: 0,
                exitTime: null,
                exitHour: 0,
                exitMin: 0,
                params: {
                    FullName: null,
                    Purpose: null,
                    EntryTimeStart: null,
                    EntryTimeEnd: null,
                    ExitTimeStart: null,
                    ExitTimeEnd: null,
                },
                entryLogs: [], // 存放返回的 entryLogs
                entryLogsItem: {
                    entryTime: null,
                },//存檔用
            }
        },
         async created() {            
            //this.setExitDateDiaglog = new Modal(document.getElementById('setExitDateDiaglog'));
            await this.fetchEnum();
            this.setParams();
         },
         watch:{
         
         },
         methods: {
            async fetchEnum() {
                const res = await $axios.get(`/api/Common/EnumList`);
                this.enums = res.data;
            },
            setParams(){
                const today = this.$moment().format('YYYY-MM-DD');
                this.params.EntryTimeStart = this.$moment(today).startOf('day').format('YYYY-MM-DD HH:mm:ss');
                this.params.EntryTimeEnd = this.$moment(today).endOf('day').format('YYYY-MM-DD HH:mm:ss');
                this.params.ExitTimeStart = null;
                this.params.ExitTimeEnd = null;
            },
            formatDate(date) {
                return this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            async searchLogList() {
                const params = this.params;
                
                //console.log(params)
                // 發送帶有搜索參數的 GET 請求到 API
                const res = await $axios.get(`/api/Entry/EntryLogList`, { params });
                // 更新 entryLogs 數據
                this.entryLogs = res.data;
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
            combineExitTime() {
                if (this.exitTime) {
                    const combinedTime = `${this.exitTime} ${String(this.exitHour).padStart(2, '0')}:${String(this.exitMin).padStart(2, '0')}:00`;
                    this.entryLogsItem.exitTime = this.$moment(combinedTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
                } else {
                    this.entryLogsItem.exitTime = null;
                }
            },
            setExitDate(item) {
                var setExitDateDiaglog = new Modal($('#setExitDateDiaglog'));
                setExitDateDiaglog.show();
                //需要洗過資料
                this.entryLogsItem = Object.assign({}, item);
            },
            setCurrentDateTimeToExitTime() {
                const now = this.$moment();
                this.exitTime = now.format('YYYY-MM-DD');
                this.exitHour = now.hour();
                this.exitMin = now.minute();
                this.combineExitTime(); // 合併時間並更新 datas.exitTime
            },
            async submitExitForm() {
                //this.datas
                const tt = JSON.parse(JSON.stringify(this.entryLogsItem));
                //之後再加入驗證
                try {
                        await $axios.post(`/api/Entry/UpdateExitDate`, tt).then((res) => {
                            const { data } = res;
                            if(data.success){
                                //var setExitDateDiaglog = new Modal(document.getElementById('setExitDateDiaglog'));
                                var setExitDateDiaglog = new Modal($('#setExitDateDiaglog'));
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
        }
    }
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
