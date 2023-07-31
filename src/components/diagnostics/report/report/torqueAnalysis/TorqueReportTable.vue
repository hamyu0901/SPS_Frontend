<template>
    <div>
        <div class="saveButton"><v-btn color="#237ffe" @click="clickSaveButton"><v-icon>file_upload</v-icon><label>저장</label></v-btn></div>
        <v-layout>
            <v-flex class="reportHeader">{{ui.header}}</v-flex>
            <v-flex class="prevAllSelectBox">
                <DxSelectBox class="prevSelectContent"
                    :data-source="datas.selectBoxReportList"
                    display-expr="report_name"
                    width="300"
                    @item-click="changeAllSelectBox"
                >
                </DxSelectBox>
            </v-flex>
        </v-layout>
        <loading-dlg
            :loadingFlag="datas.loadingFlag"
        />
        <div v-for="(booth, boothIndex) in datas.boothInfo" :key="boothIndex">
            <div class="boothName">{{booth.name}}</div>
            <v-layout class="zoneBox" column v-for="(element, zoneIndex) in booth.zone" :key="zoneIndex">
                    <div class="zoneName">{{element.name}}</div>
                    <div class="picker">
                        <div class="currentDataName">현재 데이터</div>
                        <div class="currentPicker">
                            <torque-picker
                                v-bind:robotInfo="element.robot"
                                @updateDatePeriod="updateDatePeriod($event,boothIndex,zoneIndex)"
                                v-bind:bindingCatch="bindingCatch"
                            />
                        </div>
                        <div class="prevDataName">이전 데이터</div>
                        <div class="prevPicker">
                            <torque-prev-picker
                                v-bind:robotInfo="element.robot"
                                v-bind:bindingCatch="bindingCatch"
                            />
                        </div>
                    </div>
                    <!-- <v-layout>
                        <v-flex class="currentDataName">현재 데이터</v-flex>
                        <div class="currentPicker">
                            <torque-picker
                                v-bind:robotInfo="element.robot"
                                @updateDatePeriod="updateDatePeriod($event,boothIndex,zoneIndex)"
                                v-bind:bindingCatch="bindingCatch"
                            />
                        </div>
                        <v-layout>
                            <div class="prevDataName">이전 데이터</div>
                            <div class="prevPicker">
                                <torque-prev-picker
                                    v-bind:robotInfo="element.robot"
                                    v-bind:bindingCatch="bindingCatch"
                                />
                            </div>
                            <div>
                                <DxSelectBox class="prevSelectContent"
                                    :width="300"
                                    :data-source="datas.selectBoxReportList"
                                    display-expr="report_name"
                                    value-expr="report_id"
                                    :value="datas.selectAllReportIndexs[boothIndex][zoneIndex] !== null ? datas.selectBoxReportList[datas.selectAllReportIndexs[boothIndex][zoneIndex]].report_id : null"
                                    @opened="setSelectBox"
                                    @item-click="changeSelectBox($event,boothIndex,zoneIndex)"
                                />
                            </div>
                        </v-layout>
                    </v-layout> -->

                <v-layout>
                    <v-flex class="currentDataGrid">
                        <!-- <torque-add-report-table/> -->
                        <DxDataGrid
                            ref="currentContainer"
                            :data-source="element.robot"
                            key-expr="id"
                            :show-borders="true"
                            :show-column-lines="true"
                            :show-row-lines="true"
                            :rowAlternationEnabled="true"
                            @content-ready="contentReady"
                            :onRowCollapsed="closeExpand"
                            id="grid"

                        >
                            <DxColumn data-field="name" caption="" :width="55" css-class="robot-highlighted"/>
                            <DxColumn data-field="violation_value.current_data.master_job_name" caption="경고 설정 잡" :width="105" css-class="master-highlighted" :customize-text="customizeText"/>
                            <DxColumn data-field="violation_value.current_data.violation_count[0]" caption="1축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="violation_value.current_data.violation_count[1]" caption="2축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="violation_value.current_data.violation_count[2]" caption="3축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="violation_value.current_data.violation_count[3]" caption="4축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="violation_value.current_data.violation_count[4]" caption="5축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="violation_value.current_data.violation_count[5]" caption="6축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="violation_value.current_data.violation_count[6]" caption="7축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn caption="위험도"
                                data-field="violation_value.current_data.danger_level"
                                cell-template="dangerTemplate"

                                alignment="center"
                                css-class="danger-highlighted"
                            >
                                <!-- <DxLookup
                                    :data-source="datas.danger_level"
                                    display-expr="name"
                                    value-expr="id"
                                /> -->
                            </DxColumn>
                            <template
                                #dangerTemplate="{data}"
                            >
                                <v-menu
                                    offset-x
                                >
                                    <template v-slot:activator="{on, attrs }">
                                        <button
                                            v-bind="attrs"
                                            v-on="on"
                                        >
                                            <v-layout column>
                                                <img
                                                    src="@/images/img_medium.png"
                                                    v-if="data.data.violation_value.current_data.danger_level == 1"
                                                />
                                                <img
                                                    src="@/images/img_high.png"
                                                    v-else-if="data.data.violation_value.current_data.danger_level == 2"
                                                />
                                                <img
                                                    src="@/images/img_low.png"
                                                    v-else
                                                />
                                                <div v-if="data.data.violation_value.current_data.danger_level == 1">중</div>
                                                <div v-else-if="data.data.violation_value.current_data.danger_level == 2">상</div>
                                                <div v-else>하</div>
                                            </v-layout>
                                        </button>
                                    </template>
                                    <v-list>
                                        <v-list-tile
                                            v-for="(item, index) in datas.danger_level"
                                            :key="index"
                                            @click="clickDangerButton(data,item)"
                                        >
                                        <v-list-tile-title>{{item.name}}</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </template>

                            <!-- <DxColumn
                                caption="의견"
                                data-field ="violation_value.current_data.comment"
                                alignment="center"
                                css-class="comment-highlighted"
                                cell-template="commentTemplate"
                            >
                            </DxColumn>
                            <template
                                 #commentTemplate="{data}"
                            >
                                <div>
                                    <div class="commentClass">
                                        <v-text-field
                                            color="#3c78fa"
                                            :value="data.data.violation_value.current_data.comment"
                                            @change="inputRobotComment($event,data)"
                                        >
                                        </v-text-field>
                                    </div>
                                </div>
                            </template> -->
                            <DxMasterDetail
                                :enabled="true"
                                template="detailTemplate"
                            />
                            <template #detailTemplate="{data}">
                                <div class="robotCommentParent">
                                    <div class="robotCommentText"> {{data.data.name}} 의견:</div>
                                    <div class="robotCommentData">
                                        <v-text-field
                                            color="#3c78fa"
                                            :value="data.data.violation_value.current_data.comment"
                                            @change="inputRobotComment($event,data)"
                                        ></v-text-field>
                                    </div>
                                </div>
                            </template>
                        </DxDataGrid>
                        <div>
                            <zone-opinion
                                @inputZoneOpinion="inputZoneOpinion($event,boothIndex,zoneIndex)"
                                v-bind:robotInfo="element.robot"
                            />
                        </div>
                    </v-flex>
                    <v-flex class="compareDataGrid">
                        <!-- <torque-ag-prev-grid/> -->
                        <DxDataGrid
                            ref="prevContainer"
                            :data-source="element.robot"
                            key-expr="id"
                            :show-borders="true"
                            :show-column-lines="true"
                            :show-row-lines="true"
                            :rowAlternationEnabled="true"
                            @content-ready="prevContentReady"
                        >
                            <DxColumn data-field="name" caption="" :width="55" css-class="prevRobot-highlighted" />
                            <DxColumn data-field="previolation_value.current_data.master_job_name" caption="경고 설정 잡" :width="105" css-class="master-highlighted" :customize-text="customizeText"/>
                            <DxColumn data-field="previolation_value.current_data.violation_count[0]" caption="1축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="previolation_value.current_data.violation_count[1]" caption="2축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="previolation_value.current_data.violation_count[2]" caption="3축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="previolation_value.current_data.violation_count[3]" caption="4축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="previolation_value.current_data.violation_count[4]" caption="5축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="previolation_value.current_data.violation_count[5]" caption="6축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn data-field="previolation_value.current_data.violation_count[6]" caption="7축" :width="70" css-class="axis-highlighted"/>
                            <DxColumn
                                caption="위험도"
                                data-field="previolation_value.current_data.danger_level"
                                cell-template="dangerPrevTemplate"
                                alignment="center"
                                css-class="danger-highlighted"
                            />
                            <template
                                #dangerPrevTemplate="{data}"
                            >
                                <v-menu
                                    offset-x
                                >
                                    <template v-slot:activator="{on, attrs }">
                                        <button
                                            v-bind="attrs"
                                            v-on="on"
                                            disabled
                                            class="classtest"
                                        >
                                            <v-layout column>
                                                <img
                                                    src="@/images/img_medium.png"
                                                    v-if="data.data.previolation_value.current_data.danger_level == 1"
                                                />
                                                <img
                                                    src="@/images/img_high.png"
                                                    v-else-if="data.data.previolation_value.current_data.danger_level == 2"
                                                />
                                                <img
                                                    src="@/images/img_low.png"
                                                    v-else
                                                />
                                                <div v-if="data.data.previolation_value.current_data.danger_level == 1">중</div>
                                                <div v-else-if="data.data.previolation_value.current_data.danger_level == 2">상</div>
                                                <div v-else>하</div>
                                        </v-layout>
                                        </button>
                                    </template>
                                    <!-- <v-list>
                                        <v-list-tile
                                            v-for="(item, index) in datas.danger_level"
                                            :key="index"
                                            @click="clickPrevDangerButton(data,item)"
                                        >
                                        <v-list-tile-title>{{item.name}}</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list> -->
                                </v-menu>
                            </template>
                            <!-- <DxColumn
                                caption="의견"
                                data-field="previolation_value.current_data.comment"
                                alignment="center"
                                css-class="comment-highlighted"
                                cell-template="commentPrevTemplate"
                            >
                            </DxColumn>
                            <template
                                 #commentPrevTemplate="{data}"
                            >
                                <div>
                                    <div class="commentClass">
                                    <v-text-field
                                        color="#21976a"
                                        :value="data.data.previolation_value.current_data.comment"
                                        readonly
                                        @change="inputRobotComment($event,data)"
                                    >
                                    </v-text-field>
                                </div>
                                </div>

                            </template> -->
                            <DxMasterDetail
                                :enabled="true"
                                template="detailTemplate"

                            />
                            <template #detailTemplate="{data}">
                                        <div class="robotCommentParent">
                                            <div class="robotPrevCommentText"> {{data.data.name}} 의견:</div>
                                            <div class="robotCommentData">
                                                <v-text-field
                                                    color="#21976a"
                                                    :value="data.data.previolation_value.current_data.comment"
                                                    readonly
                                                ></v-text-field>
                                            </div>
                                        </div>

                                    <!-- </div> -->

                            </template>
                        </DxDataGrid>
                        <zone-prev-opinion
                            @inputPrevZoneOpinion="inputPrevZoneOpinion($event,boothIndex,zoneIndex)"
                            v-bind:robotInfo="element.robot"
                            v-bind:bindingCatch="bindingCatch"
                        />
                    </v-flex>
                </v-layout>
            </v-layout>
        </div>
    </div>
</template>
<script>
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  const result = Array.isArray(obj) ? [] : {}

  for (let key of Object.keys(obj)) {
    result[key] = deepClone(obj[key])
  }

  return result
}
function getKeyIndex(arr, obj){
    for(let i=0; i < arr.length; i++){
        if(arr[i].robot_id == obj.robot_id){
            return i;
        }
    }
    return -1;
}
import{
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxLookup,
    DxSelectBoxButton,
    DxMasterDetail,
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';

import {mapGetters} from 'vuex';
// import TorqueAnalysisDateTimeBox from '@/components/diagnostics/report/report/torqueAnalysis/TorqueAnalysisDateTimeBox';
import zoneOpinion from '@/components/diagnostics/report/report/torqueAnalysis/zoneOpinion';
import zonePrevOpinion from '@/components/diagnostics/report/report/torqueAnalysis/zonePrevOpinion';
import TorquePicker from '@/components/diagnostics/report/report/torqueAnalysis/TorquePicker';
import TorquePrevPicker from './TorquePrevPicker.vue'
import EventBus from "@/commons/EventBus"
import LoadingDlg from "@/commons/LoadingDlg.vue"

export default {
    components: {
        DxDataGrid,
        DxColumn,
        DxEditing,
        DxLookup,
        DxSelectBox,
        zoneOpinion,
        zonePrevOpinion,
        TorquePicker,
        TorquePrevPicker,
        DxSelectBoxButton,
        LoadingDlg,
        DxMasterDetail,
    },
    props:['selectedReport','reports','torqueAnalysisReportDetail','bindingCatch','selectedMonth','selectedYear'],
    data() {
        return {
            array: [{text: 1}],
            ui : {
                header : ''
            },
            datas : {
                selectedMonth: null,
                selectedYear: null,
                selectAllReportIndexs: [],
                selectedReport: {},
                boothInfo: [],
                robotInfo: [],
                zoneInfo: [],
                danger_level:[
                    {id: 0, name: '하'},
                    {id: 1, name: '중'},
                    {id: 2, name: '상'},
                ],
                selectBoxReportList : [],
                prevReport: [],
                reports: [],
                allReportDetail: [],
                filteredCurrentData: [],
                filteredPrevData: [],
                torqueAnalysisReportDetail:[],
                violatedAccumulation: [],
                filteredViolatedAccum: [],
                allReportId: [],
                successSave: false,
                loadingFlag : false,
                masterJobData : [],
                accumAvgData : []
            }
        }
    },
    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos',
        }),
    },
    created(){
    },
    mounted(){
        this.resetData();
    },
    watch: {
        async selectedReport(){
            await this.resetData();
        },
        async selectedMonth(){
            await this.resetData();
        },
        async torqueAnalysisReportDetail(){
            await this.resetData();
        }
    },
    methods: {
        async resetData(){
            this.datas.selectedReport = deepClone(this.selectedReport)
            if(this.reports.length !==0){
                this.datas.reports = deepClone(this.reports)
            }
            this.datas.selectedMonth = this.selectedMonth
            this.datas.selectedYear = this.selectedYear
            this.datas.torqueAnalysisReportDetail = deepClone(this.torqueAnalysisReportDetail)
            this.setReportHeader();
            await this.getReport();
        },
        clickDangerButton(data,item){
            switch (item.name){
                case '하':
                    data.data.violation_value.current_data.danger_level = 0
                break;
                case '중':
                    data.data.violation_value.current_data.danger_level = 1
                break;
                case '상':
                    data.data.violation_value.current_data.danger_level = 2
                break;
            default:
            }
        },
        clickPrevDangerButton(data,item){
            switch (item.name){
                case '하':
                    data.data.previolation_value.current_data.danger_level = 0
                break;
                case '중':
                    data.data.previolation_value.current_data.danger_level = 1
                break;
                case '상':
                    data.data.previolation_value.current_data.danger_level = 2
                break;
            default:
            }
        },
        inputRobotComment(text,data){
            data.data.violation_value.current_data.comment = text
        },
        inputZoneOpinion(opinion,bIndex,zIndex){
            this.datas.boothInfo[bIndex].zone[zIndex].robot.forEach(robot => {
                robot.violation_value.comment = opinion
            })
        },
        inputPrevZoneOpinion(prevOpinion,bIndex,zIndex){
            this.datas.boothInfo[bIndex].zone[zIndex].robot.forEach(robot => {
                robot.previolation_value.comment = prevOpinion
            })
        },

        async getReport(){
             //뷰엑스 설정하고 수정필요
            this.datas.boothInfo = [];
            this.datas.zoneInfo = [];
            this.datas.robotInfo = [];
            await this.getDetail();
            this.setBoothInfo();
        },
        async getDetail(){
            let reportType = 0
            this.datas.allReportDetail = []
            await this.$http.get(`diagnostics/report/report/detail/type/${reportType}`)
            .then((response) => {
                this.datas.allReportDetail = deepClone(response.data)
            })
            .catch((err) => {
                console.log(err)
            })
        },
        setReportHeader(){
            this.ui.header = this.datas.selectedReport.report_name
        },
        async setBoothInfo(){
            let temp = []
            this.datas.boothInfo = deepClone(this.getBoothInfos)
            this.datas.zoneInfo = deepClone(this.getZoneInfos)
            this.datas.robotInfo = deepClone(this.getRobotInfos)
            let tempReportId = [];
            let reportSwitch = null // report_detail 테이블에 저장되어있는지 안했는지 표시
            if(this.datas.allReportDetail !== ""){
                this.datas.allReportDetail.forEach(el => {
                    tempReportId.push(el.report_id)
                    if(tempReportId.includes(this.datas.selectedReport.report_id)){
                        reportSwitch = 1
                    }else{
                        reportSwitch = 0
                    }
                    this.datas.torqueAnalysisReportDetail.forEach(element => {
                        if(el.data_id === element.prev_data_id) {
                            temp.push(el)
                        }
                    })
                })
            }
            else{
                reportSwitch = 0
            }
             this.datas.torqueAnalysisReportDetail.forEach(element => {
                if(element.prev_data_id == null){
                    temp.push(element)
                }
            })
            this.datas.prevReport = deepClone(temp);
            if(reportSwitch == 0){
                if(this.datas.selectedMonth !== null){
                    await this.getViolatedAccumulation();
                }
            }
            this.setSelectBoxReportList(tempReportId)
            this.datas.robotInfo.forEach(robotElement => {
                Object.assign(robotElement, { booth: this.datas.zoneInfo.filter(zone=> zone.id === robotElement.zone)[0].booth})
                // Object.assign(robotElement, { master_job_name : this.datas.masterJobData.filter(master => master.robot_id === robotElement.id)[0]})
                if(reportSwitch == 0){
                    if(this.datas.selectedMonth == null){
                        robotElement.violation_value = {
                            current_start_date : null,
                            current_end_date: null,
                            current_data : {
                                violation_count : [null,null,null,null,null,null,null],
                                master_job_name : 'undefined',
                                comment: null,
                                danger_level: null,
                            },
                        }
                    }
                    else{
                        this.setCurrentViolatedData(robotElement);
                        // MASTER JOB INSERT
                        if(this.datas.masterJobData.filter(master => master.robot_id == robotElement.id)[0] == undefined){
                            Object.assign(robotElement.violation_value.current_data, { master_job_name: null})
                        }
                        else{
                            Object.assign(robotElement.violation_value.current_data, { master_job_name: this.datas.masterJobData.filter(master => master.robot_id == robotElement.id)[0].job_name})
                        }
                    }
                }
                else{
                    Object.assign(robotElement, { violation_value: this.datas.torqueAnalysisReportDetail.filter(element => element.robot_id === robotElement.id)[0]})
                    if(robotElement.violation_value == undefined){
                        robotElement.violation_value = {
                            current_start_date : null,
                            current_end_date: null,
                            current_data : {
                                master_job_name : null,
                                violation_count : [null,null,null,null,null,null,null],
                                comment: null,
                                danger_level: null,
                            },
                        }
                    }
                }
                if(this.datas.prevReport.length !== 0){
                    Object.assign(robotElement, { previolation_value: this.datas.prevReport.filter(element => element.robot_id === robotElement.id)[0]})
                }
                if(robotElement.previolation_value == undefined || robotElement.violation_value.prev_data_id == null){
                    robotElement.previolation_value = {
                        comment : null,
                        current_start_date : null,
                        current_end_date: null,
                        current_data : {
                            master_job_name: 'undefined',
                            violation_count : [null,null,null,null,null,null,null],
                            comment: null,
                            danger_level: null,
                        },
                    }
                }
            })
            this.datas.zoneInfo.forEach(zoneElement => {
                Object.assign(zoneElement, {robot: this.datas.robotInfo.filter(element => zoneElement.id === element.zone)})
            })
            this.datas.boothInfo.forEach(boothElement => {
                Object.assign(boothElement, {zone: this.datas.zoneInfo.filter(element => element.booth === boothElement.id)})
                boothElement.zone.sort(function (a, b) {

	                return a.id < b.id ? -1 : 1;

                });
            })

            this.datas.prevReport.sort(function (a,b) {
                return a.zone_id < b.zone_id ? -1 : 1;
            })
            let numTest = 0;
            let tempArr = [];
            this.datas.selectAllReportIndexs = [];
            this.datas.boothInfo.forEach((b)=>{
                tempArr = []
                b.zone.forEach((z, zIndex)=>{
                    if(this.datas.prevReport.length !==0){
                        if(this.datas.prevReport[numTest] !== undefined){
                            tempArr.push(this.datas.selectBoxReportList.findIndex(el => el.report_id == this.datas.prevReport[numTest].report_id))
                        }
                        else{
                            tempArr.push(null)
                        }
                    }
                    else{
                        tempArr.push(null)
                    }
                    numTest += z.robot.length
                    if(tempArr[zIndex] == -1){tempArr[zIndex] = null}
                })
                this.datas.selectAllReportIndexs.push(tempArr)
            })

        },
        setCurrentViolatedData(robotElement){
            let cnt1 = 0, cnt2 = 0, cnt3 = 0, cnt4 = 0, cnt5 = 0, cnt6 = 0, cnt7 = 0
            let month = this.datas.selectedMonth.substr(0, 2)
            let month_last_date = new Date(this.datas.selectedYear, month, 0).getDate();
            Object.assign(robotElement, { violation_value : this.datas.filteredViolatedAccum.filter(element => element.robot_id == robotElement.id)[0]},)
            if(robotElement.violation_value == undefined){
                robotElement.violation_value = {
                    axis: {axis1:0,axis2:0,axis3:0,axis4:0,axis5:0,axis6:0,axis7:0},
                    current_start_date : `${this.datas.selectedYear}-${month}-01 00:00:00`,
                    current_end_date : `${this.datas.selectedYear}-${month}-${month_last_date} 00:00:00`,
                    current_data : {
                        violation_count : [null,null,null,null,null,null,null],
                        comment: null,
                        danger_level: null,
                    },
                }
            }
            cnt1 = robotElement.violation_value.axis.axis1 ? cnt1 + robotElement.violation_value.axis.axis1 : cnt1
            cnt2 = robotElement.violation_value.axis.axis2 ? cnt2 + robotElement.violation_value.axis.axis2 : cnt2
            cnt3 = robotElement.violation_value.axis.axis3 ? cnt3 + robotElement.violation_value.axis.axis3 : cnt3
            cnt4 = robotElement.violation_value.axis.axis4 ? cnt4 + robotElement.violation_value.axis.axis4 : cnt4
            cnt5 = robotElement.violation_value.axis.axis5 ? cnt5 + robotElement.violation_value.axis.axis5 : cnt5
            cnt6 = robotElement.violation_value.axis.axis6 ? cnt6 + robotElement.violation_value.axis.axis6 : cnt6
            cnt7 = robotElement.violation_value.axis.axis7 ? cnt7 + robotElement.violation_value.axis.axis7 : cnt7
            robotElement.violation_value = {
                current_start_date : `${this.datas.selectedYear}-${month}-01 00:00:00`,
                current_end_date : `${this.datas.selectedYear}-${month}-${month_last_date} 00:00:00`,
                current_data : {
                    violation_count : [null,null,null,null,null,null,null],
                    comment: null,
                    danger_level: null,
                },
            }
            if(this.datas.accumAvgData.filter(element => element.robot_id == robotElement.id)[0] !== undefined){
                Object.assign(robotElement.violation_value,
                    {axis1: this.datas.accumAvgData.filter(element => element.robot_id == robotElement.id)[0].axis1},
                    {axis2: this.datas.accumAvgData.filter(element => element.robot_id == robotElement.id)[0].axis2},
                    {axis3: this.datas.accumAvgData.filter(element => element.robot_id == robotElement.id)[0].axis3},
                    {axis4: this.datas.accumAvgData.filter(element => element.robot_id == robotElement.id)[0].axis4},
                    {axis5: this.datas.accumAvgData.filter(element => element.robot_id == robotElement.id)[0].axis5},
                    {axis6: this.datas.accumAvgData.filter(element => element.robot_id == robotElement.id)[0].axis6},
                    {axis7: this.datas.accumAvgData.filter(element => element.robot_id == robotElement.id)[0].axis7},
                )
            }else{
                Object.assign(robotElement.violation_value, {axis1: ''},{axis2: ''},{axis3: ''},{axis4: ''},{axis5: ''},{axis6: ''},{axis7: ''})
            }

            robotElement.violation_value.current_data.violation_count[0] = `${cnt1}(${robotElement.violation_value.axis1})`; cnt1 = 0;
            robotElement.violation_value.current_data.violation_count[1] = `${cnt2}(${robotElement.violation_value.axis2})`; cnt2 = 0;
            robotElement.violation_value.current_data.violation_count[2] = `${cnt3}(${robotElement.violation_value.axis3})`; cnt3 = 0;
            robotElement.violation_value.current_data.violation_count[3] = `${cnt4}(${robotElement.violation_value.axis4})`; cnt4 = 0;
            robotElement.violation_value.current_data.violation_count[4] = `${cnt5}(${robotElement.violation_value.axis5})`; cnt5 = 0;
            robotElement.violation_value.current_data.violation_count[5] = `${cnt6}(${robotElement.violation_value.axis6})`; cnt6 = 0;
            robotElement.violation_value.current_data.violation_count[6] = `${cnt7}(${robotElement.violation_value.axis7})`; cnt7 = 0;
        },
        setSelectBox(){
            let tempReportId = [];
            if(this.datas.allReportDetail !== ""){
                this.datas.allReportDetail.forEach(el => {
                    tempReportId.push(el.report_id)        // his_report_detail db에 있는 report_id
                })
            }
            this.setSelectBoxReportList(tempReportId);
        },
        setSelectBoxReportList(allreportid){
            let set = [...new Set(allreportid)]
            let notIncludeReportDetail = this.datas.reports.filter(el => !set.includes(el.report_id))
            this.datas.selectBoxReportList = this.datas.reports.filter(el => el.report_id !== this.datas.selectedReport.report_id)
            if(this.datas.selectBoxReportList.length !==0){
                notIncludeReportDetail.forEach(nonReport => {
                    this.datas.selectBoxReportList.forEach((el,index) => {
                        if(nonReport.report_id == el.report_id){
                            this.datas.selectBoxReportList.splice(index,1)
                        }
                    })
                })
            }
        },
        // async getViolatedAccumulation(){
        //     this.datas.violatedAccumulation = [];
        //     let month = this.datas.selectedMonth.substr(0, 2)
        //     let month_last_date = new Date(this.datas.selectedYear, month, 0).getDate();
        //     let start_date = `${this.datas.selectedYear}-${month}-01`
        //     let end_date = `${this.datas.selectedYear}-${month}-${month_last_date}`
        //     let dangerData = [];
        //     await this.$http.get(`/torquemonitoring/factory/${this.getFactoryId}/startdate/${start_date}/enddate/${end_date}`)
        //     .then((response) => {
        //         dangerData = deepClone(response.data)
        //         this.datas.violatedAccumulation = dangerData.reduce((acc, {robot_id, axis})=> {
        //             let axisKey = `axis${axis}`;
        //             let item = acc.find((el) => el.robot_id === robot_id);
        //             if(item) {
        //                 if(Object.keys(item.axis).includes(axisKey)){
        //                     item.axis[axisKey] += 1;
        //                 } else {
        //                     item.axis[axisKey] = 1;
        //                 }
        //                 return acc.map((el) => el.robot_id === robot_id ? {robot_id, axis: item.axis}: el);
        //             } else {
        //                 return [...acc, {robot_id, axis: {[axisKey]: 1}}];
        //             }
        //         }, []);
        //         if(response.data == ""){
        //             window.alert('not data')
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
        // },
        async getViolatedAccumulation(){
            this.datas.filteredViolatedAccum = [];
            this.datas.violatedAccumulation = [];
            this.datas.masterJobData = [];
            this.datas.accumAvgData = [];
            let month = this.datas.selectedMonth.substr(0, 2)
            let month_last_date = new Date(this.datas.selectedYear, month, 0).getDate();
            let start_date = `${this.datas.selectedYear}-${month}-01 00:00:00`
            let end_date = `${this.datas.selectedYear}-${month}-${month_last_date} 00:00:00`
            await this.$http.get(`/diagnostics/accum/masterjob/startdate/${start_date}/enddate/${end_date}`) // 적산 설정 잡 조회
            .then(async (res) => {
                this.datas.masterJobData = res.data !== '' ? res.data : []
                await this.getAccumAvg(start_date, end_date);
            })
            this.datas.loadingFlag = true;
            await this.$http.get(`/diagnostics/accum/startdate/${start_date}/enddate/${end_date}`)
            .then(async (response) => { // 적산 값 조회
                if(response.data !== ''){
                    this.datas.violatedAccumulation = deepClone(response.data)
                     this.datas.filteredViolatedAccum = this.datas.violatedAccumulation.reduce((acc, {robot_id, axis})=> {
                        let axisKey = `axis${axis}`;
                        let item = acc.find((el) => el.robot_id === robot_id);
                        if(item) {
                            if(Object.keys(item.axis).includes(axisKey)){
                                item.axis[axisKey] += 1;
                            } else {
                                item.axis[axisKey] = 1;
                            }
                            return acc.map((el) => el.robot_id === robot_id ? {robot_id, axis: item.axis}: el);
                        } else {
                            return [...acc, {robot_id, axis: {[axisKey]: 1}}];
                        }
                    }, []);
                }
                this.datas.loadingFlag = false;
            })
            .catch((err) => {
                console.log(err)
            })
            // this.getAccumAvg(start_date, end_date);
        },
        async getAccumAvg(start_date, end_date){
            if(this.datas.masterJobData.length !== 0){
                await this.$http.post(`/diagnostics/accum/test/avg/startdate/${start_date}/enddate/${end_date}` , {
                    data: this.datas.masterJobData,
                }).then((res) => {
                    this.datas.accumAvgData = deepClone(res.data) // 적산 평균 값 조회
                })
            }
        },
        async changeAllSelectBox(selectReport){
            let selectedReportIndex = null;
            this.datas.selectBoxReportList.forEach((item, index) => {
                if(item.report_id === selectReport.itemData.report_id){
                    selectedReportIndex = index
                }
            })
            this.datas.selectAllReportIndexs = [];
            let tempArr = []

            this.datas.boothInfo.forEach((b)=>{
                tempArr = [];
                b.zone.forEach((z)=>{
                    tempArr.push(selectedReportIndex)
                })
                this.datas.selectAllReportIndexs.push(tempArr)
            })                                                    /// 전체 비교 리포트 select box 설정

            let temp = [];
            this.datas.allReportDetail.forEach(el => {
                if(el.report_id === selectReport.itemData.report_id) {
                    temp.push(el)
                }
            })
            await this.setPrevReport(temp);
            this.datas.prevReport = temp
            this.$refs.prevContainer.forEach(item => {
                item.instance.getDataSource().reload()
            })
            await this.datas.robotInfo.forEach(robotElement => {
                delete robotElement.previolation_value
                if(this.datas.prevReport.length !== 0){
                    robotElement.violation_value.prev_data_id = this.datas.prevReport.filter(element => element.robot_id === robotElement.id)[0].data_id
                    Object.assign(robotElement, { previolation_value: this.datas.prevReport.filter(element => element.robot_id === robotElement.id)[0]})
                }
            })
            this.$emit('bindingCatch') //하위 컴포넌트에 watch를 활성화 시키기 위해 이벤트 발송
        },
        setPrevReport(temp){
            this.datas.prevReport = temp
        },
        async changeSelectBox(selectReport,selectedboothIndex,selectedZoneIndex){
            this.datas.selectBoxReportList.forEach((item, index) => {
                if(item.report_id === selectReport.itemData.report_id){
                    this.datas.selectAllReportIndexs[selectedboothIndex][selectedZoneIndex] = index
                }
            })
            let temp = [];
            let tempArr = [];
            this.datas.allReportDetail.forEach(el => {
                if(el.report_id === selectReport.itemData.report_id) {
                    temp.push(el)
                }
            })

            let array = [];
            this.datas.boothInfo[selectedboothIndex].zone[selectedZoneIndex].robot.forEach(el => {
               array = temp.filter(robotElement => robotElement.zone_id == el.zone)
            })

            if(this.datas.prevReport.length !== 0){
                this.datas.prevReport.forEach(el => {
                array.forEach(arrayElement => {
                    if(el.robot_id == arrayElement.robot_id){
                        el = arrayElement
                    }
                })
                tempArr.push(el)
            })
            this.datas.prevReport = tempArr
            }
            else{
                this.datas.prevReport = temp
            }

            this.$refs.prevContainer.forEach(item => {
                item.instance.getDataSource().reload()
            })
            this.datas.boothInfo.forEach((booth,bIndex) => {
                booth.zone.forEach((zone,zIndex) => {
                    if(selectedboothIndex == bIndex && selectedZoneIndex == zIndex){
                        zone.robot.forEach(robotElement => {
                            delete robotElement.previolation_value
                            if(this.datas.prevReport.length !== 0){
                                robotElement.violation_value.prev_data_id = this.datas.prevReport.filter(element => element.robot_id === robotElement.id)[0].data_id
                                Object.assign(robotElement, { previolation_value: this.datas.prevReport.filter(element => element.robot_id === robotElement.id)[0]})
                            }
                        })
                    }
                })
            })
            this.$emit('bindingCatch')
        },

        // async updateDatePeriod(period,bIndex,zIndex){
        //     this.datas.boothInfo[bIndex].zone[zIndex].robot.forEach(robotElement => {
        //         robotElement.violation_value.current_start_date = period.start_date
        //         robotElement.violation_value.current_end_date = period.end_date
        //     })
        //     let zone_id = this.datas.boothInfo[bIndex].zone[zIndex].robot[0].zone
        //     let resultArr = [];

        //     resultArr = await this.updateViolatedAccum(period,zone_id);

        //     this.$refs.currentContainer.forEach(item => {
        //         item.instance.getDataSource().reload()
        //     })
        //     resultArr.forEach(el => {
        //         this.datas.robotInfo.forEach(robotElement => {
        //             if(el.robot_id == robotElement.id){
        //                 robotElement.violation_value.current_data.violation_count = el.current_data.violation_count
        //             }
        //         })
        //     })
        //     this.datas.loadingFlag = false;
        //     this.$emit('bindingCatch')
        // },
        // async updateViolatedAccum(period,zone_id){
        //     this.datas.loadingFlag = true;
        //     let temp = []
        //     let tempArr = []
        //     let start_date = new Date(`${period.start_date} 00:00:00`);
        //     let end_date = new Date(`${period.end_date} 23:59:59`)
        //     let resultArr = [];
        //     this.datas.robotInfo.forEach(el => {
        //         if(el.zone == zone_id){
        //             resultArr.push({
        //                 robot_id: el.id,
        //                 current_data: {violation_count: [0,0,0,0,0,0,0]}
        //             })
        //         }
        //     })
        //     await this.$http.get(`/diagnostics/accum/startdate/${period.start_date}/enddate/${period.end_date}`)
        //     .then((response)=> {
        //         tempArr = response.data.filter(el => el.maxsum !== null && el.minsum !== null && (el.maxsum <= el.sum || el.minsum >= el.sum))
        //         tempArr.forEach(el => {
        //             el.time_stamp = this.$moment(el.time_stamp).format('YYYY-MM-DD hh:mm:ss');
        //             el.e_time = this.$moment(el.e_time).format('YYYY-MM-DD hh:mm:ss');
        //         })
        //     })

        //     temp = tempArr.filter(el => new Date(el.time_stamp) >= start_date && new Date(el.e_time) <= end_date && el.zone_id == zone_id)
        //     if(temp.length !== 0){
        //         temp.forEach(el => {
        //             resultArr.forEach(item => {
        //                 if(el.robot_id == item.robot_id){
        //                     switch(el.axis){
        //                         case 1:
        //                             item.current_data.violation_count[0] += 1
        //                         break;
        //                         case 2:
        //                             item.current_data.violation_count[1] += 1
        //                         break;
        //                         case 3:
        //                             item.current_data.violation_count[2] += 1
        //                         break;
        //                         case 4:
        //                             item.current_data.violation_count[3] += 1
        //                         break;
        //                         case 5:
        //                             item.current_data.violation_count[4] += 1
        //                         break;
        //                         case 6:
        //                             item.current_data.violation_count[5] += 1
        //                         break;
        //                         case 7:
        //                             item.current_data.violation_count[6] += 1
        //                         break;
        //                     default:
        //                     }

        //                 }
        //             })
        //         })
        //     }

        //     return resultArr
        // },
        getFilteredReportDetail(){
            EventBus.$emit('getFilteredReportDetail',this.datas.selectedReport.report_id);
        },
        async clickSaveButton(){
            this.datas.successSave = false;
            if (window.confirm("저장하시겠습니까?")){
                this.datas.filteredCurrentData = [];
                this.datas.filteredPrevData = [];
                await this.getRowData();
                this.datas.allReportId = [];
                if(this.datas.allReportDetail !== ""){
                    this.datas.allReportDetail.forEach(el => {
                        this.datas.allReportId.push(el.report_id)
                    })
                }
                this.datas.filteredCurrentData = await this.datas.filteredCurrentData.filter(el => el.rowType !== 'detail')
                this.datas.filteredPrevData = await this.datas.filteredPrevData.filter(el => el.rowType !== 'detail')
                await this.updateCurrentReport();
                await this.updatePrevReport();
                await this.getFilteredReportDetail();
            }
            this.datas.successSave ? window.alert('저장되었습니다.') : window.alert('실패하였습니다.')
        },
        async getRowData(){
            await this.$refs.currentContainer.forEach(el => {
                el.instance.getVisibleRows().forEach(item => this.setCurrentData(item))
            })
            if(this.$refs.prevContainer !== undefined){
                await this.$refs.prevContainer.forEach(el => {
                    el.instance.getVisibleRows().forEach(item => this.setPrevData(item))
                })
            }
        },
        setCurrentData(row){
           this.datas.filteredCurrentData.push(row)
        },
        setPrevData(row){
            this.datas.filteredPrevData.push(row)
        },
        async updateCurrentReport(){
            for await(let row of this.datas.filteredCurrentData){
                let report_id = this.datas.selectedReport.report_id
                let reportSwitch = null;
                let booth_id = row.data.booth
                let zone_id = row.data.zone
                let report_type = 0
                let robot_id = row.key
                let prev_data_id = null;
                let comment = row.data.violation_value.comment
                let data_id = row.data.violation_value.data_id
                let current_start_date = row.data.violation_value.current_start_date
                let current_end_date = row.data.violation_value.current_end_date
                if(row.data.violation_value.current_data.danger_level == null){
                    row.data.violation_value.current_data.danger_level = 0
                }
                if(row.data.violation_value.current_data.master_job_name == "undefined"){
                    row.data.violation_value.current_data.master_job_name = null
                }
                let current_data= {
                    danger_level: row.data.violation_value.current_data.danger_level,
                    violation_count : [
                        row.data.violation_value.current_data.violation_count[0],
                        row.data.violation_value.current_data.violation_count[1],
                        row.data.violation_value.current_data.violation_count[2],
                        row.data.violation_value.current_data.violation_count[3],
                        row.data.violation_value.current_data.violation_count[4],
                        row.data.violation_value.current_data.violation_count[5],
                        row.data.violation_value.current_data.violation_count[6],
                    ],
                    comment: row.data.violation_value.current_data.comment,
                    master_job_name : row.data.violation_value.current_data.master_job_name
                }

                if(row.data.previolation_value.hasOwnProperty('prev_data_id')!==true){
                    prev_data_id = null
                }
                else{
                    prev_data_id = row.data.previolation_value.data_id
                }
                if(this.datas.allReportId.includes(this.datas.selectedReport.report_id)){
                    reportSwitch = 1
                }else{
                    reportSwitch = 0
                }
                if(reportSwitch == 1){
                    await this.updateReport({
                        report_id,
                        booth_id,
                        zone_id,
                        robot_id,
                        report_type,
                        current_data,
                        prev_data_id,
                        data_id,
                        comment,
                        current_start_date,
                        current_end_date
                    })
                }
                else{
                    await this.createReport({
                        report_id,
                        booth_id,
                        zone_id,
                        robot_id,
                        report_type,
                        current_data,
                        prev_data_id,
                        comment,
                        current_start_date,
                        current_end_date
                    })
                }
            }
        },
        async updatePrevReport(){
            for await(let row of this.datas.filteredPrevData){
                let report_id = row.data.previolation_value.report_id
                let reportSwitch = null;
                let booth_id = row.data.booth
                let zone_id = row.data.zone
                let report_type = 0
                let robot_id = row.key
                let prev_data_id = null;
                let comment = row.data.previolation_value.comment
                let data_id = row.data.previolation_value.data_id
                let current_start_date = row.data.previolation_value.current_start_date
                let current_end_date = row.data.previolation_value.current_end_date
                if(row.data.previolation_value.current_data.danger_level == null){
                    row.data.violation_value.current_data.danger_level = 0
                }
                if(row.data.previolation_value.current_data.master_job_name == "undefined"){
                    row.data.previolation_value.current_data.master_job_name = null
                }
                let current_data= {
                    danger_level: row.data.previolation_value.current_data.danger_level,
                    violation_count : [
                        row.data.previolation_value.current_data.violation_count[0],
                        row.data.previolation_value.current_data.violation_count[1],
                        row.data.previolation_value.current_data.violation_count[2],
                        row.data.previolation_value.current_data.violation_count[3],
                        row.data.previolation_value.current_data.violation_count[4],
                        row.data.previolation_value.current_data.violation_count[5],
                        row.data.previolation_value.current_data.violation_count[6],
                    ],
                    comment: row.data.previolation_value.current_data.comment,
                    master_job_name : row.data.previolation_value.current_data.master_job_name
                }
                if(row.data.previolation_value.hasOwnProperty('prev_data_id')!==true){
                    prev_data_id = null
                }
                else{
                    prev_data_id = row.data.previolation_value.prev_data_id
                }
                if(this.datas.allReportId.includes(row.data.previolation_value.report_id)){
                    reportSwitch = 1
                }else{
                    reportSwitch = 0
                }
                if(reportSwitch == 1){
                    await this.updateReport({
                        report_id,
                        booth_id,
                        zone_id,
                        robot_id,
                        report_type,
                        current_data,
                        prev_data_id,
                        data_id,
                        comment,
                        current_start_date,
                        current_end_date
                    })
                }
                else{
                    await this.createReport({
                        report_id,
                        booth_id,
                        zone_id,
                        robot_id,
                        report_type,
                        current_data,
                        prev_data_id,
                        comment,
                        current_start_date,
                        current_end_date
                    })
                }
            }
        },
        async updateReport(item){
            if(item.report_id !== undefined){
                await this.$http.put(`/diagnostics/report/report/${item.report_id}`, {
                    factory_id: this.getFactoryId,
                    booth_id : item.booth_id,
                    zone_id : item.zone_id,
                    robot_id : item.robot_id,
                    report_type : item.report_type,
                    current_data : item.current_data,
                    prev_data_id : item.prev_data_id,
                    data_id : item.data_id,
                    comment : item.comment,
                    current_start_date : item.current_start_date,
                    current_end_date : item.current_end_date
                })
                .then(() => {
                    this.datas.successSave = true;

                })
                .catch((err) => {
                    console.log(err)
                    this.datas.successSave = false;
                })
            }
        },
        async createReport(item){
            if(item.report_id !==undefined){
                await this.$http.post(`/diagnostics/report/report/${item.report_id}`, {
                    factory_id: this.getFactoryId,
                    booth_id : item.booth_id,
                    zone_id : item.zone_id,
                    robot_id : item.robot_id,
                    report_type : item.report_type,
                    current_data : item.current_data,
                    prev_data_id : item.prev_data_id,
                    comment : item.comment,
                    current_start_date : item.current_start_date,
                    current_end_date : item.current_end_date
                })
                .then(() => {
                    this.datas.successSave = true;
                })
                .catch((err) => {
                    console.log(err)
                    this.datas.successSave = false;
                })
            }
        },
        customizeText(value){
            if(value.value == 'undefined'){
                return ``
            }
            else if(value.value == null){
                return 'null'
            }
            else{
                return `${value.value}`
            }
        },
        contentReady(e){
            if (!e.component.getSelectedRowKeys().length) {
                e.component.getVisibleRows().forEach(el => {
                    if(el.data.violation_value.current_data.comment !== null && el.data.violation_value.current_data.comment !== ""){
                        e.component.expandRow(el.key)
                    }
                })
            }
        },
        prevContentReady(e){
            if (!e.component.getSelectedRowKeys().length) {
                e.component.getVisibleRows().forEach(el => {
                    if(el.data.previolation_value.current_data.comment!== null && el.data.previolation_value.current_data.comment !== ""){
                        e.component.expandRow(el.key)
                    }
                })
            }
        },
        closeExpand(e){
            if(!e.expanded){
                e.component.getDataSource()._items.forEach(el => {
                    if(e.key === el.id){
                        if(el.violation_value.current_data.comment !== null && el.violation_value.current_data.comment !== ""){
                            window.alert('텍스트를 지워주세요')
                        }
                    }
                })
            }
        }
    },
}
</script>

<style>
    .reportHeader{
        margin-top: 20px;
        font-size: 2rem;
        font-weight: bold;
    }
    .picker{
        width: 100%;
    }
    .currentDataName{
        color: #2f86ff;
        font-weight: bold;
        font-size: 15px;
        float: left;
        width: 130px;
        margin-top: 10px !important;
        padding-left: 15px;
    }
    @media (min-width: 1900px) {
        .currentDataName{
           color: #2f86ff;
            font-weight: bold;
            font-size: 15px;
            float: left;
            width: 130px;
            margin-top: 10px !important;
            padding-left: 30px;
        }
    }
    .currentDataGrid{
        width: 470px;
        padding: 30px 5px 30px 15px;
    }
    @media (min-width: 1900px) {
        .currentDataGrid{
            width: 470px;
            padding: 30px 30px 30px 30px;
        }
    }
    .prevDataName{
        color: #21976a;
        font-weight: bold;
        font-size: 15px;
        margin-top: 10px;
        float: left;
        width: 100px;
    }
    .currentPicker{
        float: left;
        width: 660px;
    }
    @media (min-width: 1900px) {
        .currentPicker{
            float: left;
            width: 700px;
        }
    }
    .prevAllSelectBox{
        display: flex;
        justify-content: right;
        margin-right: 35px !important;
        margin: auto;
    }

    .prevAllSelectBox .v-input .v-input__control .v-input__slot{
        min-height:0 !important;
    }
    .prevAllSelectBox .v-input .v-input__control .v-input__slot .v-select__slot{
        height: 30px;
    }
    .prevAllSelectBox .v-select__slot .v-label{
        position: absolute;
        left: 10px;
        top: 5px;
        font-size: 15px;
        color: #6c738f;
    }
    .prevAllSelectBox .v-input__append-inner {
        margin: 4px !important;
    }
    .compareDataGrid{
        width: 470px;
        padding: 30px 10px 30px 15px;
    }
    @media (min-width: 1900px) {
        .compareDataGrid{
            width: 470px;
            padding: 30px 30px 30px 30px;
        }
    }
    .zoneBox{
        margin-top: 30px;
        border: 2px solid #4e546c;
        border-radius: 12px;
    }
    .zoneName {
        font-size: 23px !important;
        font-weight: 600;
        margin-bottom: 20px;
        color: white;
        padding-top: 30px;
        padding-left: 15px;
    }
    @media (min-width: 1900px) {
        .zoneName{
            font-size: 23px !important;
            font-weight: 600;
            margin-bottom: 20px;
            color: white;
            padding-top: 30px;
            padding-left: 30px;
        }
    }
    .boothName{
        width: 100px;
        height: 42px;
        font-size: 22px;
        font-weight: bold;
        background-color: #34394f;
        border-radius: 30px;
        text-align: center;
        line-height: 42px;
        margin-top: 30px;
    }
    .dateBox{
        margin: auto;
    }
    .saveButton{
        display: flex;
        justify-content: right;
        margin-right: 35px;
    }
    .saveButton .v-btn {
        width: 100px;
        height: 40px;
        border-radius: 4px !important;
        font-size: 16px;
    }
    .prevPicker{
        margin-right: 10px;
        float: left;
        width: 20%;
    }
    .dx-data-row .robot-highlighted {
        background-color: #2159aa!important;
        text-align: center!important;
    }
    .dx-data-row .prevRobot-highlighted {
        background-color: #21976a!important;
        text-align: center!important;
    }
     .dx-data-row .master-highlighted {
        font-size: 12px;
    }

    .prevSelectContent .dx-selectbox-container .dx-texteditor-container  {
        background: #191d2b;
    }
    .prevSelectContent .dx-button-content {
        background-color: #21976a!important;
    }
    .dx-header-row .master-highlighted{
        text-align: center!important;
        color: orange;
    }
    .dx-header-row .axis-highlighted {
        text-align: center!important;
        color: white;
    }
    .dx-data-row .axis-highlighted {
        font-size: 12px;
    }
    .dx-header-row .danger-highlighted {
        text-align: center!important;
        font-size: 12px;
        color: white;
    }
    .robotCommentParent{
        width: 100%;
    }
    .robotCommentText{
        color: #2674e1;
        font-weight: bold;
        float: left;
        padding-top: 5px;
        width: 10%;
        box-sizing: border-box;
    }
    .robotPrevCommentText{
        color: #26e190;
        font-weight: bold;
        float: left;
        padding-top: 5px;
        width: 10%;
        box-sizing: border-box;
    }
    .robotCommentData{
        float: right;
        width: 90%;
        box-sizing: border-box;
    }
    .robotCommentData .v-input__slot::before {
        border-style: none !important;
    }
    .robotCommentData .v-input__control {
        height: 20px;
    }
    .robotCommentData .v-text-field{
        padding-top: 0px !important;
        margin: auto;
        font-size: 13px !important;
    }
    .robotCommentData .v-text-field .v-input{
        padding-bottom: 10px;
    }
    .dx-master-detail-row .dx-master-detail-cell{
        padding-bottom: 10px !important;
        padding-top: 10px !important

    }


</style>