<template>
    <div id="zonePrevBox" class="zonePrevBox">
        <div>
            <div class="dataInfo">이전 데이터</div>
        <loading-spinner v-if="isLoading"></loading-spinner>
        <div id="zoneComboBox">
            <selector-vue class ="test" ref="selector" :noDataText="'조회 가능한 리포트가 없습니다.'" :items="reportList" @selectItem="selectItem" :type="'prev_report_selection'"></selector-vue>
            <div class="fieldBox">
                <v-text-field
                    v-model="zonePeriod"
                    hide-details
                    readonly
                    prepend-icon="event"
                ></v-text-field>
            </div>
        </div>
        </div>
        <div id="zoneTableBox" class="zoneTableBox">
            <zone-prev-table :withRowHeaders="true" :isEditable="false" :propsColumn_x="column_x" :propsColumn_y="robots" :propsData="tableData" :propsTheme="'dark'" :propsFormat="`°c`"/>
            <!-- <table-vue :withRowHeaders="true" :isEditable="false" :propsColumn_x="column_x" :propsColumn_y="robots" :propsData="tableData" :propsTheme="'dark'" :propsFormat="`°c`"/> -->
        </div>
        <div id="opinionBox">
            <zone-prev-opinion :disabled="true" :opinionInput="opinionInput"/>
            <!-- <zone-opinion-vue :disabled="true" :opinionInput="opinionInput"></zone-opinion-vue> -->
        </div>
    </div>
</template>
<script>
import DateFromToVue from '../../../../../../commons/DateFromTo.vue';
import report_selectorVue from '../../../../../../commons/report_selector.vue';
// import TableVue from '../../../../../../commons/Table.vue'
// import zoneOpinionVue from './zoneOpinion.vue';
import zonePrevOpinion from './zonePrevOpinion.vue'
import zonePrevTable from './zonePrevTable.vue'
import {mapGetters} from 'vuex';
import LoadingSpinnerVue from '../../../../../../commons/LoadingSpinner.vue';
export default {
    props:['robotInfo', 'zoneInfo'],
    components: {
        selectorVue: report_selectorVue,
        // tableVue: TableVue,
        DateFromToVue: DateFromToVue,
        // zoneOpinionVue: zoneOpinionVue,
        loadingSpinner: LoadingSpinnerVue,
        zonePrevTable,
        zonePrevOpinion
    },
    data(){
        return{
            isLoading: false,
            opinionInput: null,
            dataIdList:[],
            report_id :null,
            reportList:[],
            zonePeriod:null,
            menu:false,
            booth_id: null,
            zone_id: null,
            zone_name: null,
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

            tableData: [],
            testList: [
                ],
        }
    },
    created(){
        this.setThisZone();
        this.initializeReportId();
        this.initializeItems();
    },
    mounted(){
        this.initializeStyle();
    },
    computed:{
        ...mapGetters({
            getReportItems: 'getReportItems',
            getFactoryId: 'getFactoryId',
        }),
        reportId(){
            return this.$store.state.reportItems.selectedReport;
        },
        robots(){
            if(this.column_y.length !== 0){
                this.column_y.splice(0);
            }

            for(const robot of this.robotInfo){
                this.column_y.push(robot);
            }
            return this.column_y;
        }
    },
    watch:{
        reportId(){
            this.report_id = this.getReportItems.selectedReport.report_id;

            var param = {
                current_report_id: this.report_id,
            }
            this.$http.post(`/diagnostics/datareport/temperature/reports`, param).then(result => {
                if(this.reportList !== null){
                    this.reportList.splice(0);
                }
                for(const item of result.data){
                    this.reportList.push({report_id: item[0], name: item[1]});
                }

            });
        },
    },
    methods:{
        async updataDataId(s){
            this.isLoading = true;
            var param = {
                factory_id: this.getFactoryId,
                booth_id: this.booth_id,
                zone_id: this.zone_id,
                data_id_list: s
            };
            var report_data = null;

            await this.$http.post(`/diagnostics/datareport/temperature/reportDetailfromCurr`, param).then(result => {
                if(result.data !== 'no data'){
                    report_data = result.data[0][0].report_id;
                    this.selectItem({report_id: report_data});
                    this.$refs.selector.updateReport(report_data)

                }else{
                    this.zonePeriod = null;
                    this.tableData.splice(0);
                    if(this.$refs.selector !== undefined){
                        this.$refs.selector.updateReport(null)
                    }
                    this.opinionInput = '';
                }
            });
            this.isLoading = false;
        },
        getRobotList(){
            var list = [];
            for(const robot of this.robots){
                list.push(robot.robot_id);
            }
            return list;
        },
        async selectItem(report_id){
            this.isLoading = true;
            this.opinionInput = '';
            var param = {
                report_id: report_id.report_id,
                factory_id: this.getFactoryId,
                booth_id: this.booth_id,
                zone_id: this.zone_id
            };
            var start_date = null;
            var end_date = null;
            await this.$http.post(`/diagnostics/datareport/temperature/reportDetail`, param).then(result => {
                if(this.tableData.length !== 0){
                    this.tableData.splice(0);
                }

                if(this.dataIdList.length !== 0){
                    this.dataIdList.splice(0);
                }

                for(const list of result.data){
                    this.tableData.push(list[0]);
                    if(start_date === null){
                        start_date = list[2];
                    }

                    if(end_date === null){
                        end_date = list[3];
                    }
                    this.dataIdList.push(list[1]);
                    if(this.opinionInput === ''){
                        this.opinionInput = list[4];
                    }
                }
                this.zonePeriod = `${start_date} ~ ${end_date}`
            });

            var list = [];
            for(var i = 0; i < this.tableData.length; i++){
                var obj = {
                    robot_id: this.tableData[i].robot_id,
                    data_id: this.dataIdList[i],
                }
                list.push(obj);
            }
            this.isLoading = false;
            this.$emit('updateDataId', list);
        },
        initializeStyle(){
            // 조건문으로 스타일 변경해야함

            // let table = document.getElementsByClassName('zonePrevBox').children
            // let tableId = document.getElementById('zonePrevBox')
            // let zoneTable = Array.prototype.slice.call((tableId).children);
        },
        initializeReportId(){
            this.report_id = this.getReportItems.selectedReport.report_id;
        },
        setThisZone(){
            this.zone_id = this.zoneInfo.zone_id;
            this.booth_id = this.zoneInfo.booth_id;
            this.zone_name = this.zoneInfo.zone_name;
        },
        initializeItems(){
            var param = {
                current_report_id: this.report_id,
            }
            this.$http.post(`/diagnostics/datareport/temperature/reports`, param).then(result => {
                if(this.reportList !== null){
                    this.reportList.splice(0);
                }

                for(const item of result.data){
                    this.reportList.push({report_id: item[0], name: item[1]});
                }
            });
        },
        findZoneData(){
            //zone_id, booth_id 그리고 factory_id로 리포트 타입에 맞게 찾는다.
            if(this.tableData.length !== 0){
                this.tableData.splice(0);
            }

            this.zonePeriod = '2022-01-01 ~ 2021-01-21';

            for(const list of this.testList){
                this.tableData.push(list);
            }
        },
        updatePeriod(period){
            this.zonePeriod = period;
        }
    }

}
</script>

<style lang="scss" scoped>
#zonePrevBox{
    width: inherit;
    display: flex;
    flex-direction: column;
    #zoneComboBox{
        height: 50px;
        display: flex;
        align-items: center;
    }
    #zoneComboBox > div{
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        padding:0 !important;
    }

    #zoneComboBox > div:first-child{
        padding:13px 30px 0 0 !important;
    }

    #zoneComboBox >>> input{
        cursor: default !important;
    }

    #zoneComboBox >>> .primary--text{
        color: white !important;
        caret-color: white !important;
    }

    #zoneComboBox >>> .v-input__slot:before, #zoneComboBox >>> .v-input__slot:after{
        display: none;
    }
    #zoneComboBox >>> .v-select__slot {
        display: inline-block !important;
    }
}
.dataInfo {
    float: left;
    font-weight: bold;
    color: #0ca889;
    font-size: 16px;
    margin-right: 18px;
    margin-top: 15px;
}
#zoneTableBox {
    margin-top: -6px;
}
.fieldBox {
    height: 36px;
    display: flex;
    align-items: center;
    border: 2px solid #4e546c;
    border-radius: 3px !important;
    margin-right: 70px;
    margin-top: 10px;
}

</style>