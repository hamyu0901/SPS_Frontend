<template>
    <v-card class = "container">
        <v-card-title>
            리포트 정보 입력
            <v-spacer/>
			<v-btn icon @click="clickCloseButton"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-form
            ref="form"
            lazy-validation
        >
            <v-text-field
                @change="changeReportName"
                :rules="[v => !!v || 'Name is required']"
                label="Report Name"
                required
            ></v-text-field>
            <v-text-field
                v-model="datas.currentDate"
                label="Today Date"
                readonly
            ></v-text-field>
            <div class= "addButton">
                <v-btn
                    @click="clickReportAddButton"
                >생성
                </v-btn>
            </div>
        </v-form>
    </v-card>
</template>
<script>


export default {
    data() {
        return {
            ui : {
                headerTitle : ''
            },
            datas: {
                reportName: '',
                currentDate: '',
                reportInfo: [],
            }
        }
    },
    mounted(){
        this.getCurrentDate();
    },
    methods: {

        clickCloseButton(){
            this.$emit('closeTorqueReportAddDlg')
        },
        getCurrentDate(){
            let today = new Date();
            let year = today.getFullYear(); // 년도
            let month = today.getMonth() + 1;  // 월
            let date = today.getDate();  // 날짜
            let hours = ('0' + today.getHours()).slice(-2);
            let minutes = ('0' + today.getMinutes()).slice(-2);
            let seconds = ('0' + today.getSeconds()).slice(-2);
            this.datas.currentDate = year + '-' + month + '-' + date
            return this.datas.currentDate + ' ' + hours +':' + minutes + ':' + seconds
        },
        clickReportAddButton(){
            if(this.datas.reportName !== ''){
                this.ui.headerTitle = this.datas.reportName
                this.$http.post(`/diagnostics/report/report`,{
                    reportName : this.ui.headerTitle,
                    timeStamp : this.getCurrentDate()
                })
                .then(() => {
                    this.getReportInfo();
                });
            }
            else {
                window.alert('Name is Required')
            }
        },
        async getReportInfo(){
            await this.$http.get(`/diagnostics/report/report`,)
                .then((response) => {
                    this.datas.reportInfo = response.data
            });
            this.$emit('clickReportAddButton',this.datas.reportInfo)
        },
        changeReportName(name){
            this.datas.reportName = name
        }
    }
}
</script>
<style scoped>
    .addButton{
        display: flex;
        justify-content: right;
    }
</style>