<template>
    <v-container fluid>
      <v-form>
        <v-row>
          <v-col cols="12" md="4" sm="12">
            <v-select v-if="!userIsAuthenticated" v-model="datas.campusId" :items="campuses" item-title="campusName" item-value="id" label="校區" outlined></v-select>
            <v-text-field v-else v-model="campusInfo.campusName" label="校區" readonly outlined></v-text-field>
            <v-text-field v-model="datas.fullName" label="姓名" outlined></v-text-field>
            <v-text-field v-model="datas.phoneNumber" label="電話" outlined></v-text-field>
            <v-text-field v-model.number="datas.numberOfPeople" label="人數" type="number" outlined></v-text-field>
            <v-text-field v-model="datas.interviewee" label="受訪人" outlined></v-text-field>
            <v-text-field v-model="datas.replacementNumber" label="換證號碼" outlined></v-text-field>
            <!-- <v-radio-group v-model="datas.purpose" row label="事由" inline>
                <v-radio v-radio v-for="option in enums.purposes" color="secondary" :key="option.Key" :label="option.name" :value="option.key"></v-radio>
            </v-radio-group> -->
            <v-select
            label="事由"
              v-model="datas.purpose"
              :items="enums.purposes"
              item-title="name"
              item-value="key"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="12" md="8" sm="12">
            <v-text-field v-model="datas.otherDescription" label="其他說明" outlined></v-text-field>
            <v-textarea v-model="datas.note" label="備註" rows="3" outlined></v-textarea>
            
            <v-row>
              <v-col cols="6">
                <VDatePicker v-model="entryTime" mode="dateTime" label="入校日期" is-required is24hr  :masks="masks"/>
                <v-btn color="primary" @click="setCurrentDateTime">帶入現在時間</v-btn>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model.number="entryHour" label="入校時間 (時)" type="number" outlined></v-text-field>
                <v-text-field v-model.number="entryMin" label="入校時間 (分)" type="number" outlined></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-btn color="primary" @click="submitForm">送出</v-btn>
        </v-row>
      </v-form>
      <v-table v-if="userIsAuthenticated" class="mt-4">
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
                <td>{{ log.numberOfPeople }}</td>
                <td>{{ log.interviewee }}</td>
                <td>{{ findPurpose(log.purpose) }}</td>
                <td>{{ log.note }}</td>
                <td>{{ log.replacementNumber }}</td>
                <td><b>{{ formatDate(log.entryTime) }}</b></td>
                <td>
                <b v-if="log.exitTime">{{ formatDate(log.exitTime) }}</b>
                <v-btn v-else color="red" @click="setExitDate(log)">紀錄離校時間</v-btn>
                </td>
            </tr>
        </tbody>
      </v-table>
    </v-container>
    <v-dialog v-model="dialogVisible" max-width="500px">
        <v-card>
            <v-card-title>請確認離校時間</v-card-title>
            <v-card-text>
            <VDatePicker  v-model="exitTime" label="離校時間" type="time" outlined></VDatePicker>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="dialogVisible = false">取消</v-btn>
            <v-btn color="primary" text @click="confirmExitTime">確定</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
    import $axios from '@/apiClient';
    import $ from 'jquery';


    export default {
        data() {
            return {
                exitDateDiaglog:{},
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
            //this.exitDateDiaglog = new Modal(this.$refs.setExitDateDiaglog);
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
                this.entryTime = new Date();
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
                                this.exitDateDiaglog.hide();
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
                this.exitDateDiaglog.show();
                //需要洗過資料
                this.entryLogsItem = Object.assign({}, item);
            },
            setExitDateDiaglogToggle(){
                this.exitDateDiaglog.show();
            },
            setExitDateDiaglogHide(){
                this.exitDateDiaglog.hide();
            }
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
