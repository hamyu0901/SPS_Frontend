<template>
    <div id="zoneCurrentBox">
        <v-layout>
        <div class="dataInfo">현재 데이터</div>
        <loading-spinner v-if="isLoading"></loading-spinner>
        <div id="zoneDataBox">
            <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="700px"
                min-width="290px"
                >
                <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="zonePeriod"
                        hide-details
                        readonly
                        prepend-icon="event"
                        v-on="on"
                    ></v-text-field>
                </template>
                <date-from-to-vue :dialog.sync="menu" @updatePeriod="updatePeriod"></date-from-to-vue>
            </v-menu>
        </div>
        </v-layout>
        <div id="zoneTableBox">
            <table-vue ref="table" :withRowHeaders="true" :isEditable="true" :propsColumn_x="column_x" :propsColumn_y="robots" :propsData="tableData" :propsTheme="'dark'" :propsFormat="`°c`" @onSave="onSave"/>
        </div>
        <div id="opinionBox">
            <zone-opinion-vue :disable="disableTextArea" :opinionInput="opinionInput" @updateText="updateText"></zone-opinion-vue>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import DateFromToVue from '../../../../../../commons/DateFromTo.vue';
import LoadingSpinnerVue from '../../../../../../commons/LoadingSpinner.vue';
import TableVue from '../../../../../../commons/Table.vue'
import zoneOpinionVue from './zoneOpinion.vue';
import LoadingSpinner from '../../../../../../commons/LoadingSpinner.vue';

export default {
    props:['zoneInfo', 'robotInfo', 'quickPeriod','loadingSwitch'],
    components: {
    tableVue: TableVue,
    DateFromToVue: DateFromToVue,
    zoneOpinionVue: zoneOpinionVue,
    loadingSpinner: LoadingSpinnerVue,
    LoadingSpinner
},
    data(){
        return{
            isLoading:false,
            opinionInput: '',
            report_id:null,
            zonePeriod:null,
            menu:false,
            boothId: null,
            zoneId: null,
            disableTextArea:true,
            zoneName: null,
            tableData:[
                // {
                //     robot_id: 1,
                //     avg_temperature:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     violation:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     severity: 1,
                //     comment:'특이사항 없음'

                // },
                // {
                //     robot_id: 2,
                //     avg_temperature:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     violation:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     severity: 0,
                //     comment:'특이사항 없음'

                // },
                // {
                //     robot_id: 3,
                //     avg_temperature:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     violation:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     severity: 1,
                //     comment:'특이사항 없음'

                // },
                // {
                //     robot_id: 4,
                //     avg_temperature:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     violation:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     severity: 0,
                //     comment:'특이사항 없음'

                // },
                // {
                //     robot_id: 41,
                //     avg_temperature:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     violation:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     severity: 1,
                //     comment:'특이사항 없음'

                // },
                // {
                //     robot_id: 42,
                //     avg_temperature:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     violation:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     severity: 0,
                //     comment:'특이사항 없음'

                // },
                // {
                //     robot_id: 43,
                //     avg_temperature:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     violation:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     severity: 0,
                //     comment:'특이사항 없음'

                // },
                // {
                //     robot_id: 44,
                //     avg_temperature:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     violation:[
                //         {
                //             axis1: 1,
                //             axis2: 1,
                //             axis3: 1,
                //             axis4: 1,
                //             axis5: 1,
                //             axis6: 1,
                //             axis7: 1,
                //         }
                //     ],
                //     severity: 0,
                //     comment:'특이사항 없음'

                // }
            ],
            column_x:[
                {
                    colname: '1축',
                    array_key: 'axis1',
                    key: ['avg_temperature', 'violation'],
                    colWidth: 5,
                },
                {
                    colname: '2축',
                    array_key: 'axis2',
                    key: ['avg_temperature', 'violation'],
                    colWidth: 5,
                },
                {
                    colname: '3축',
                    array_key: 'axis3',
                    key: ['avg_temperature', 'violation'],
                    colWidth: 5,
                },
                {
                    colname: '4축',
                    array_key: 'axis4',
                    key: ['avg_temperature', 'violation'],
                    colWidth: 5,
                },
                {
                    colname: '5축',
                    array_key: 'axis5',
                    key: ['avg_temperature', 'violation'],
                    colWidth: 5,
                },
                {
                    colname: '6축',
                    array_key: 'axis6',
                    key: ['avg_temperature', 'violation'],
                    colWidth: 5,
                },
                {
                    colname: '7축',
                    array_key: 'axis7',
                    key: ['avg_temperature', 'violation'],
                    colWidth: 5,
                },
                {
                    colname: '위험도',
                    key:'severity',
                    colWidth: 11,
                },
                {
                    colname: '의견',
                    key:'comment',
                    colWidth: 25,
                }
            ],
            column_y:[
                {
                    colname: 'L1',
                    key: 'robot_id',
                    value: 0
                },
                {
                    colname: 'R1',
                    key: 'robot_id',
                    value: 1
                },
                {
                    colname: 'L2',
                    key: 'robot_id',
                    value: 2
                },
                {
                    colname: 'R2',
                    key: 'robot_id',
                    value: 3
                },
                {
                    colname: 'L3',
                    key: 'robot_id',
                    value: 4
                },
                {
                    colname: 'R3',
                    key: 'robot_id',
                    value: 5
                },
                {
                    colname: 'L4',
                    key: 'robot_id',
                    value: 6
                },
                {
                    colname: 'R4',
                    key: 'robot_id',
                    value: 7
                }
            ],
            testList: [
                ],
            datas:{
                loadingSwitch : null,
            }

        }
    },
    created(){
        this.setThisZone();
        this.initializeReportData();

    },
    computed:{
        robots(){
            if(this.column_y.length !== 0){
                this.column_y.splice(0);
            }

            for(const robot of this.robotInfo){
                this.column_y.push(robot);
            }
            return this.column_y;
        },
        reportDatas(){
            return this.$store.state.reportItems.selectedReport;
        },
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
            getReportItems: 'getReportItems',
        }),
    },
    watch:{
        quickPeriod(){
            var quickDate;
            var date = new Date();
            var form_date = this.formatDate(date)
            var quick_today = (this.quickPeriod.quickYear.toString()+"-"+this.quickPeriod.quickMonth.toString());

            if(form_date === quick_today){
                quickDate = (("00"+ date.getDate())).slice(-2);
            }else{
                switch(this.quickPeriod.quickMonth){
                    case '01':
                    case '03':
                    case '05':
                    case '07':
                    case '08':
                    case '10':
                    case '12':{
                        quickDate = 31;
                        break;
                    }
                    case '02':{
                        if( (this.quickPeriod.quickYear%4 == 0 && this.quickPeriod.quickYear%100 != 0) || this.quickPeriod.quickYear%400 == 0 ) {
                            quickDate= 29 ;
                        }
                        else {
                            quickDate= 28 ;
                        }
                        break;
                    }
                    default:{
                        quickDate = 30;
                        break;
                    }

                }
            }

            this.zonePeriod = `${this.quickPeriod.quickYear}-${this.quickPeriod.quickMonth}-01 ~ ${this.quickPeriod.quickYear}-${this.quickPeriod.quickMonth}-${quickDate}`;
            var dateFrom = `${this.quickPeriod.quickYear}-${this.quickPeriod.quickMonth}-01 00:00:00`;
            var dateTo = `${this.quickPeriod.quickYear}-${this.quickPeriod.quickMonth}-${quickDate} 23:59:59`;
            this.findZoneData(dateFrom, dateTo);
        },
        loadingSwitch(){
            this.datas.loadingSwitch = this.loadingSwitch
            if(this.datas.loadingSwitch == false){
                this.isLoading = false
            }
        },
        reportDatas(){
            this.report_id = this.getReportItems.selectedReport.report_id;
            this.opinionInput = '';
        },
        async report_id(){
            this.isLoading = true;
            const variable ={
                report_id: this.report_id,
                factory_id: 2,
                booth_id: this.boothId,
                zone_id: this.zoneId
            };
            var start_date = null;
            var end_date = null;
            var prev_id_list = [];
            await this.$http.post(`/diagnostics/datareport/temperature/analyzeHasReport`, variable).then(result => {
                if(result.data !== 'no data'){
                    this.$emit('getViolatedData',result.data.length)
                    if(this.tableData.length !== 0){
                        this.tableData.splice(0);
                    }
                    for(const list of result.data){
                        this.tableData.push(list.robot_info);

                        if(start_date === null){
                            start_date = list.start_date;
                        }

                        if(end_date === null){
                            end_date = list.end_date;
                        }

                        prev_id_list.push(list.prev_data_id);

                        if(this.opinionInput.length === 0){
                            this.opinionInput = list.comment;
                        }
                    }
                    this.disableTextArea = false;
                    this.zonePeriod = `${start_date} ~ ${end_date}`

                }else{
                    this.zonePeriod = null;
                    this.tableData.splice(0);
                    this.$emit('changeLoading')
                }

            });
            this.isLoading = false;
            this.$emit('sendDataIdList', prev_id_list)
        }
    },
    methods:{
        initializeReportData(){
            this.report_id = this.getReportItems.selectedReport.report_id;
        },
        formatDate(date){
            let formatted_date = date.getFullYear() + "-" + (("00"+ (date.getMonth() + 1))).slice(-2)
            return formatted_date;
        },
        updateText(txt){
            this.opinionInput = txt;
        },
        childFunc(){
            this.$refs.table.childFunc();
        },
        getRobotList(){
            var list = [];
            for(const robot of this.robots){
                list.push(robot.robot_id);
            }
            return list;
        },
        onSave(tableData) {
            var value = {
                report_id: this.getReportItems.selectedReport.report_id,
                report_type: 1,
                factory_id: this.getFactoryId,
                booth_id: this.boothId,
                zone_id: this.zoneId,
                robot_id_list:this.getRobotList(),
                data_list:tableData,
                start_date : this.zonePeriod.substr(0,10),
                end_date : this.zonePeriod.substr(13,23),
                comment:this.opinionInput,
            }

            this.$emit('onSave', value)
        },
        setThisZone(){
            this.zoneId = this.zoneInfo.zone_id;
            this.boothId = this.zoneInfo.booth_id;
            this.zoneName = this.zoneInfo.zone_name;
        },
        findZoneData(dateFrom, dateTo){
            const variable ={
                report_id: null,
                factory_id: 2,
                booth_id: this.boothId,
                zone_id: this.zoneId,
                fromDate: dateFrom,
                toDate: dateTo
            }
            this.isLoading = true;
            this.$http.post(`/diagnostics/datareport/temperature/analyzeNoReport`, variable)
            .then(result => {
                this.$emit('getViolatedData',result.data.length)
                if(this.tableData.length !== 0){
                    this.tableData.splice(0);
                }

                for(const list of result.data){
                    this.tableData.push(list.robot_info);
                }
                this.disableTextArea = false;
            })
            this.opinionInput = '';
            // this.isLoading = this.loadingSwitch;
        },
        updatePeriod(period){
            this.isLoading = true;
            this.zonePeriod = period;
            var dateFrom = `${this.zonePeriod.substr(0,10)} 00:00:00`;
            var dateTo = `${this.zonePeriod.substr(13,23)} 23:59:59`;
            this.findZoneData(dateFrom, dateTo);
        }
    }

}
</script>

<style lang="scss" scoped>
#zoneCurrentBox{
    width: inherit; display: flex; flex-direction: column; position: relative;
    #zoneDataBox{
        width: 260px;
        height: 40px;
        display: flex;
        align-items: center;
        border: 2px solid #b8bac6;
        border-radius: 3px !important;
    }
     #zoneDataBox >>> .v-text-field{
         padding: 0 !important;
         margin: 0 !important;
     }
    #zoneDataBox >>> input{
        cursor: pointer !important;
        width: 200px !important;
    }
    #zoneDataBox >>> .v-input__slot:before, #zoneDataBox >>> .v-input__slot:after{
        display: none;
    }
    .dataInfo {
        float: left;
        font-weight: bold;
        color: #2f86ff;
        font-size: 16px;
        margin-right: 18px;
        margin-top: 10px;
    }
}

</style>