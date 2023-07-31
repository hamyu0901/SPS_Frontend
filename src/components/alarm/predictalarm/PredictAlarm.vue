<template>
    <v-layout column fill-height>
        <v-layout>
            <v-flex class="pl-2 pr-2" lg2>
                <date-picker
                    v-bind:style="ui.selectorStyle"
                    v-bind:placeHolder="ui.date.start"
                    v-bind:setDate="setDefaultDate('start')"
                    v-on:getDate="getStartDate"
                ></date-picker>
            </v-flex>
            <v-flex class="pl-2 pr-2" lg2>
                <date-picker
                    v-bind:style="ui.selectorStyle"
                    v-bind:placeHolder="ui.date.end" 
                    v-bind:setDate="setDefaultDate('end')"
                    v-on:getDate="getEndDate"
                ></date-picker>
            </v-flex>
            <a>
                <img class="pt-1 pl-4 pr-1" :src="ui.sectorIcon"/>
            </a>
            <v-flex class="pl-2 pr-2" lg2>
                <selector
                    v-bind:style="ui.selectorStyle"
                    v-bind:selectorTitle="ui.alarmType"
                    v-bind:selectorOptions="setPredictTypes"
                    v-on:selectedTarget="setTargetAlarmTypes"
                ></selector>
            </v-flex>
            <v-btn v-bind:style="ui.buttonStyle" @click="searchBtnClicked">
                <a class="pt-1"><img :src="ui.searchBtnIcon"></a>
            </v-btn>
        </v-layout>
        <v-layout class="pt-2">
            <v-flex lg12>
                <predict-alarm-table
                    v-bind:headerDatas="datas.historyPredictHeaderDatas" 
                    v-bind:contentDatas="datas.historyPredictContentDatas"
                    v-on:predictAlarmTableData="getPredictAlarmTableData"
                ></predict-alarm-table>
            </v-flex>
            <loading-dlg v-bind:loadingFlag="flags.loading"></loading-dlg>
            <v-dialog
                v-model="flags.violationDlg"
                :width="ui.dialogWidth"
            >
                <v-card class="violationDlgCard">
                    <v-card-title :style="ui.titleStyle" class="violationDlgCardTitle">{{setViolationDlgTitle}}</v-card-title>
                    <violation-chart
                        v-bind:chartId="'violationChart'"
                        v-bind:chartHeight="ui.violationChartHeight"
                        v-bind:chartDatas="datas.violationChartDatas"
                        v-bind:violationType="datas.violationType"
                    ></violation-chart>
                    <v-layout>
                        <v-spacer/>
                        <v-btn v-bind:style="ui.buttonStyle" class="dialogBtn" @click="violaitonDlgCloseBtnClicked()">
                            {{ui.closeBtnText}}
                        </v-btn>
                    </v-layout>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import DatePicker from '@/commons/DatePicker';
import Selector from '@/commons/Selector';
import PredictAlarmTable from '@/components/alarm/predictalarm/predictalarm/PredictAlarmTable';
import ViolationChart from '@/components/diagnostics/predict/predict/ViolationChart';
import loadingDlg from '@/commons/LoadingDlg'
export default {
    components: {DatePicker, Selector, PredictAlarmTable, ViolationChart, loadingDlg},
    props: ['nodeInfo'],
    data() {
        return {
            ui: {
                alarmType: this.$t('alarm.child.predictAlarm.ui.alarmType'), 
                closeBtnText: this.$t('alarm.child.predictAlarm.ui.closeBtnText'), 
                sectorIcon: require("@/images/selector_icon.png"),
                searchBtnIcon: require("@/images/search_icon.png"),
                dialogWidth: '1700px',
                violationChartHeight: 800,
                titleStyle: this.$style.common.titleObjectItemColor,
                selectorStyle: {
                    height: "34px",
                    width: "100%"
                },
                buttonStyle: {
                    height: '33px',
                    backgroundColor: this.$style.alarm.buttonStyleBackgroundColor,
                },
                date: {
                    start: this.$t('alarm.child.predictAlarm.ui.date.start'), 
                    end: this.$t('alarm.child.predictAlarm.ui.date.end'),
                }
            },
            datas: {
                predictTypes: [],
                historyPredictHeaderDatas: [
                    {id: 'start_time',  title: this.$t(`diagnostics.predict.processInfoHeaderDatas.startTime`)},
                    {id: 'end_time',    title: this.$t(`diagnostics.predict.processInfoHeaderDatas.endTime`)},
                    {id: 'content',     title: this.$t(`diagnostics.predict.processInfoHeaderDatas.content`)},
                    {id: 'job_name',    title: this.$t(`diagnostics.predict.processInfoHeaderDatas.jobName`)},
                    {id: 'axis',        title: this.$t(`diagnostics.predict.processInfoHeaderDatas.axis`)}
                    // {id: 'edit',        title: this.$t(`diagnostics.predict.processInfoHeaderDatas.edit`)},
                ],
                historyPredictContentDatas: [],
                violationChartDatas: [],
                violationType: "",
                searchDatas: {},
                filterDatas: {}
            },
            flags: {
                loading: false,
                violationDlg: false
            }
        }
    },

    created() {
        
    },

    mounted() {
    },

    computed: {
        ...mapGetters({
            getAuth: 'getAuth'
        }),

        setPredictTypes() {
            this.datas.predictTypes = [
                {id: 'P001', name: this.$t('alarm.child.predictAlarm.datas.predictTypes.p001') },
                {id: 'P002', name: this.$t('alarm.child.predictAlarm.datas.predictTypes.p002') },
                {id: 'P005', name: this.$t('alarm.child.predictAlarm.datas.predictTypes.p005') }
            ]
            return this.datas.predictTypes;
        },

        setViolationDlgTitle() {
            let violationDlgTitle = "";
            this.datas.predictTypes.forEach(predictType => {
                if(this.datas.violationType === predictType.id) {
                    violationDlgTitle = predictType.name;
                }
            })
            return violationDlgTitle;
        }
    },

    methods: {
        setDefaultDate(type) {
            let nowDate = new Date()
            if(type === 'start') {
                let dayOfMonth = nowDate.getDate();
                nowDate.setDate(dayOfMonth - 7);
            }
            let month = '' + (nowDate.getMonth() + 1);
            let day = '' + nowDate.getDate();
            let year = nowDate.getFullYear();
            let defaultDate = year + "-" + month + "-" + day;

            return defaultDate;
        },

        getStartDate(startDate) {
            this.datas.searchDatas['startdate'] = startDate;
        },

        getEndDate(endDate) {
            this.datas.searchDatas['enddate'] = endDate;
        },


        setTargetAlarmTypes(alarmType) {
            this.datas.filterDatas['alarmtype'] = null;    
            this.datas.filterDatas['alarmtype'] = alarmType.target;
        },

        setTargetProcessInfo(targetProcessInfos) {
            return new Promise((resolve, reject) => {
                let processInfos = null;
                if(Object.keys(targetProcessInfos).length > 0) {    
                    processInfos = targetProcessInfos;
                } 
                resolve(processInfos)
            }).catch(error => {
                reject(error);
            })
           
        },

        getHistoryPredictDatas(filterDatas, searchDatas) {
            this.datas.historyPredictContentDatas = [];
            this.flags.loading = true;
            this.$http.get(`/alarmview/predict/history/startdate/${searchDatas.startdate}/enddate/${searchDatas.enddate}`).then(result => {
                if(result.data.length > 0) {
                    let tempHistoryPredictDatas = [];
                    result.data.forEach((historyPredictData, index) => {
                        if(this.checkHistoryPredictDatas(filterDatas, historyPredictData)) {
                            if (typeof historyPredictData.time_stamp === 'string' && typeof historyPredictData.end_time === 'string') {
                                    historyPredictData.time_stamp = historyPredictData.time_stamp.replace("T", " ");
                                    historyPredictData.time_stamp = historyPredictData.time_stamp.replace("Z", "");
                                    historyPredictData.full_time_stamp = historyPredictData.time_stamp;
                                    historyPredictData.time_stamp = historyPredictData.time_stamp.split('.')[0];
                                    historyPredictData.start_time = historyPredictData.time_stamp.split('.')[0];
                                    historyPredictData.end_time = historyPredictData.end_time.replace("T", " ");
                                    historyPredictData.end_time = historyPredictData.end_time.replace("Z", "");
                                    historyPredictData.full_end_time = historyPredictData.end_time;
                                    historyPredictData.end_time =historyPredictData.end_time.split('.')[0];
                            }
                            tempHistoryPredictDatas.push(historyPredictData);
                        }
                        if((result.data.length-1) === index) {
                            this.datas.historyPredictContentDatas = tempHistoryPredictDatas;
                            this.flags.loading = false;
                        }
                    })
                } else {
                    this.flags.loading = false;
                }
            }).catch(error => {
                this.flags.loading = false;
                this.$log.error(error);
            })
        },

        checkHistoryPredictDatas(filterDatas, historyPredictData) {
            let checkFlag = true;
            if(typeof filterDatas.alarmtype !== 'undefined' && filterDatas.alarmtype !== historyPredictData.code) {
                checkFlag = false;
            } 
            if(typeof filterDatas.processInfos.boothid !== 'undefined' && filterDatas.processInfos.boothid !== historyPredictData.booth_id) {
                checkFlag = false;
            } 
            if(typeof filterDatas.processInfos.zoneid !== 'undefined' && filterDatas.processInfos.zoneid !== historyPredictData.zone_id) {
                checkFlag = false;
            }
            if(typeof filterDatas.processInfos.robotid !== 'undefined' && filterDatas.processInfos.robotid !== historyPredictData.robot_id) {
                checkFlag = false;
            }
            return checkFlag;
        },

        setHistoryPredictDatas(filterDatas, historyPredictDatas) {
            let tempHistoryPredictDatas = [];
            historyPredictDatas.forEach((historyPredictData, index) => {
                if(this.checkHistoryPredictDatas(filterDatas, historyPredictData)) {
                    tempHistoryPredictDatas.push(historyPredictData);
                }
                if((historyPredictDatas.length-1) === index) {
                    this.datas.historyPredictContentDatas = tempHistoryPredictDatas;
                }
            })
        },

        async searchBtnClicked() {
            this.datas.filterDatas['processInfos'] = await this.setTargetProcessInfo(this.nodeInfo);
            this.getHistoryPredictDatas(this.datas.filterDatas, this.datas.searchDatas);
        },

        getPredictAlarmTableData(predictAlarmTableData) {
            this.datas.violationChartDatas = [];
            this.flags.loading = true;
            this.$http.get(`/home/predict/chart/pcode/${predictAlarmTableData.code}/factoryid/${predictAlarmTableData.factory_id}/boothid/${predictAlarmTableData.booth_id}/zoneid/${predictAlarmTableData.zone_id}/robotid/${predictAlarmTableData.robot_id}/jobname/${predictAlarmTableData.job_name}/axis/${predictAlarmTableData.axis}/starttime/${predictAlarmTableData.full_time_stamp}/endtime/${predictAlarmTableData.full_end_time}`).then(result => {
                if(result.data.length > 0) {
                    this.datas.violationType = predictAlarmTableData.code;
                    if (predictAlarmTableData.code != 'P005') {
                        this.datas.violationChartDatas = result.data;
                        this.flags.violationDlg = true;
                        this.flags.loading = false;
                    } else {
                        let tempDatas = result.data;
                        predictAlarmTableData['prevtime'] = predictAlarmTableData.full_time_stamp.split(" ")[0];
                        predictAlarmTableData['excpt'] = true;
                        predictAlarmTableData['factoryid'] = predictAlarmTableData.factory_id;
                        predictAlarmTableData['boothid'] = predictAlarmTableData.booth_id;
                        predictAlarmTableData['zoneid'] = predictAlarmTableData.zone_id;
                        predictAlarmTableData['robotid'] = predictAlarmTableData.robot_id;
                        predictAlarmTableData['jobname'] = predictAlarmTableData.job_name;
                        this.$http.post(`/diagnostics/torqueloadfactor/data`, predictAlarmTableData)
                        .then((result) => {
                            if(result.data != '') {
                                let tempViolationChartDatas = [];
                                for(let i = 0; i < result.data.length; i++) {
                                    if(result.data[i].timestamp == predictAlarmTableData.start_time.split(" ")[1]) {
                                        for(let j = i; j >= 0; j--) {
                                            tempViolationChartDatas.push(result.data[j]);
                                            if(tempViolationChartDatas.length == 5) {
                                                break;
                                            }
                                        }
                                        tempViolationChartDatas = tempViolationChartDatas.reverse();
                                        tempViolationChartDatas[0]['accumtype'] = tempDatas[0].accum_type;
                                        tempViolationChartDatas[0]['config_value'] = tempDatas[0].config_value;
                                        tempViolationChartDatas[0]['type_name'] = tempDatas[0].type_name;
                                        this.datas.violationChartDatas = tempViolationChartDatas;
                                    }
                                }
                                this.flags.violationDlg = true;
                            } 
                            this.flags.loading = false;
                        }).catch(error => {
                            this.$log.error(error);
                            this.flags.loading = false;
                        })
                    }
                } else {
                    this.flags.loading = false;
                }
            }).catch(error => {
                this.$log.error(error);
                this.flags.loading = false;
            })
        },

        violaitonDlgCloseBtnClicked() {
            this.flags.violationDlg = false;
        }

    }

}
</script>

<style scoped lang="scss">
    @import './predictalarm';
</style>

