<template>
    <v-layout column>
        <v-layout>
            <v-flex lg9 class="pr-2">
                <predict-status-table
                    v-bind:highlightFlag="true"
                    v-bind:headerDatas="predictStatusHeaderDatas"
                    v-bind:contentDatas="predictStatusContentDatas"
                    v-bind:selectDatas="selectedPredictDatas"
                    v-on:processInfo="getProcessInfo"
                    v-on:violationInfo="getViolationInfo"
                ></predict-status-table>
            </v-flex>
            <v-flex lg6 class="pl-2">
                <process-info-table
                    v-bind:headerDatas="processInfoHeaderDatas" 
                    v-bind:contentDatas="processInfoContentDatas"
                    v-bind:highlightFlag="true"
                    v-on:selectedProcessInfoData="getSelectedProcessInfoData"
                ></process-info-table>
            </v-flex>
        </v-layout>
        <v-layout class="pt-3">
            <v-flex lg12>
                <v-layout column>
                    <p v-bind:style="styleObject">{{violationChartTitle}}</p>
                    <p class="subTitle" v-if="violationChartSubTitle != ''">{{violationChartSubTitle}}</p>
                    <violation-chart
                        v-bind:chartId="'violationChart'"
                        v-bind:chartHeight="chartHeight" 
                        v-bind:chartDatas="violationChartDatas"
                        v-bind:violationType="violationType"
                    ></violation-chart>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import PredictStatusTable from '@/components/diagnostics/predict/predict/PredictStatusTable'
import ProcessInfoTable from '@/components/diagnostics/predict/predict/ProcessInfoTable'
import PredictCodeSumChart from '@/components/diagnostics/predict/predict/PredictCodeSumChart'
import ViolationChart from '@/components/diagnostics/predict/predict/ViolationChart'
export default {
    components: {PredictStatusTable, ProcessInfoTable, PredictCodeSumChart, ViolationChart},
    data() {
        return {
            ui: {
                predictCodeSumChartTitle: this.$t(`diagnostics.predict.predictCodeSumChartTitle`)
            },
            chartHeight: 540,
            predictStatusHeaderDatas: [
                {id: 'processInfo', title: this.$t(`diagnostics.predict.processInfo`), show: true},
                {id: 'p001', title: this.$t(`diagnostics.predict.predictStatusHeaderDatas.P001`), show: true},
                {id: 'p002', title: this.$t(`diagnostics.predict.predictStatusHeaderDatas.P002`), show: true},
                {id: 'p005', title: this.$t(`diagnostics.predict.predictStatusHeaderDatas.P005`), show: true},
            ],
            predictStatusContentDatas: [],
            selectedBoothId: '',
            selectedZoneId: '',
            selectedRobotId: '',
            processInfoHeaderDatas: [
                {id: 'start_time',  title: this.$t(`diagnostics.predict.processInfoHeaderDatas.startTime`)},
                {id: 'end_time',    title: this.$t(`diagnostics.predict.processInfoHeaderDatas.endTime`)},
                {id: 'content',     title: this.$t(`diagnostics.predict.processInfoHeaderDatas.content`)},
                {id: 'job_name',    title: this.$t(`diagnostics.predict.processInfoHeaderDatas.jobName`)},
                {id: 'axis',        title: this.$t(`diagnostics.predict.processInfoHeaderDatas.axis`)},
                {id: 'edit',        title: this.$t(`diagnostics.predict.processInfoHeaderDatas.edit`)},
            ],
            processInfoContentDatas: [],
            predictCodeSumChartDatas: [],
            violationInfos: [
                {code: 'P001', title: this.$t(`diagnostics.predict.violationInfos.P001`)},
                {code: 'P002', title: this.$t(`diagnostics.predict.violationInfos.P002`)},
                {code: 'P005', title: this.$t(`diagnostics.predict.violationInfos.P005`)}
            ],
            violationType: "",
            violationChartTitle: '',
            violationChartSubTitle: '',
            violationChartDatas: [],
            styleObject: null,
            selectedPredictDatas: null
        }
    },
    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos',
            getLanguage: 'getLanguage',
            getAuth: 'getAuth' 
        }),
    },
    created() {
        this.initDatas();
    },
    mounted() {
        this.initializeStyle();
        this.getPredictStatusContentDatas();
        this.getPredictOptionDatas();
    },
    methods: {
        initDatas() {
            this.changePredictStatusContentHeaderDatas();
        },

        initializeStyle() {
            this.styleObject = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--subTitleColor", this.$style.diagnostics.predictSubTitleColor);
            document.documentElement.style.setProperty("--tableCardTopColor", this.$style.common.tableCardTopColor);
            document.documentElement.style.setProperty("--tableTheadBackgroundColor", this.$style.common.tableTHeadBGColor);
            document.documentElement.style.setProperty("--tableTheadBorderBottomColor", this.$style.common.tableTHeadBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBackgroundColor", this.$style.common.tableTBodyOddBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBorderBottomColor", this.$style.common.tableTBodyOddBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBackgroundColor", this.$style.common.tableTBodyEvenBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBorderBottomColor", this.$style.common.tableTBodyEvenBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrBackgroundColor", this.$style.common.tableTBodyHoverColor);
            document.documentElement.style.setProperty("--tableTBodyPaginationItem", this.$style.common.tablePaginationColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.tableItemTdTextColor);
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.tableTBodyBBColor);
        },

        changePredictStatusContentHeaderDatas() {
            this.predictStatusHeaderDatas.forEach(predictStatusHeaderData => {
                if(predictStatusHeaderData.id === 'p005') {
                    if(Boolean(this.getAuth)) {
                        predictStatusHeaderData.show = true;
                    } else {
                        predictStatusHeaderData.show = false;
                    }
                }
            })
        },

        getPredictStatusContentDatas() {
            this.predictStatusContentDatas =[];
            this.$http.get(`${this.baseUrl}/home/predict/list`)
            .then((result) => {
                if (result.data.length != 0) {
                    result.data.forEach((predictStatusContentData, index) => {
                        if(!Boolean(this.getAuth)) {
                            // basic
                            delete predictStatusContentData.p005;  
                        } 
                        if((result.data.length - 1) === index) {
                            this.predictStatusContentDatas = result.data;   
                        }
                    })
                } 
                else {
                    this.$popmsg(this.$t(`diagnostics.predict.popMsg.predictList`));
                }
            }).catch((error) => {
                this.$log.error(error);
            }); 
        },

        getProcessInfoContentDatas() {
            this.processInfoContentDatas = [];
            let postDatas = {};
            postDatas['boothid'] = this.selectedBoothId;
            postDatas['zoneid'] = this.selectedZoneId;
            postDatas['robotid'] = this.selectedRobotId;
            let innerThis = this;
            if(postDatas.boothid != "" && postDatas.zoneid != "" && postDatas.robotid != "") {
                if(Boolean(this.getAuth)) {
                    this.$http.get(`/home/predict/list/detail/premium/factoryid/${this.getFactoryId}/boothid/${postDatas.boothid}/zoneid/${postDatas.zoneid}/robotid/${postDatas.robotid}`).then(result => {
                        if(result.data !='') {
                            Object.keys(result.data).forEach(function eachKey(key) {
                                if (typeof result.data[key].time_stamp === 'string' && typeof result.data[key].end_time === 'string') {
                                    result.data[key].time_stamp = result.data[key].time_stamp.replace("T", " ");
                                    result.data[key].time_stamp = result.data[key].time_stamp.replace("Z", "");
                                    result.data[key].full_time_stamp = result.data[key].time_stamp;
                                    result.data[key].time_stamp = result.data[key].time_stamp.split('.')[0];
                                    result.data[key].end_time = result.data[key].end_time.replace("T", " ");
                                    result.data[key].end_time = result.data[key].end_time.replace("Z", "");
                                    result.data[key].full_end_time = result.data[key].end_time;
                                    result.data[key].end_time = result.data[key].end_time.split('.')[0];
                                    result.data[key].boothid = innerThis.selectedBoothId;
                                    result.data[key].zoneid = innerThis.selectedZoneId;
                                    result.data[key].robotid = innerThis.selectedRobotId;
                                }
                            });
                            this.processInfoContentDatas = result.data;
                        } 
                        else {
                            this.$popmsg(this.$t(`diagnostics.predict.popMsg.predictListDetail`));
                        }
                        
                    }).catch((error) => {
                        this.$log.error(error);
                    });  
                } else {
                    this.$http.get(`/home/predict/list/detail/basic/factoryid/${this.getFactoryId}/boothid/${postDatas.boothid}/zoneid/${postDatas.zoneid}/robotid/${postDatas.robotid}`).then(result => {
                        if(result.data !='') {
                            Object.keys(result.data).forEach(function eachKey(key) {
                                if (typeof result.data[key].time_stamp === 'string' && typeof result.data[key].end_time === 'string') {
                                    result.data[key].time_stamp = result.data[key].time_stamp.replace("T", " ");
                                    result.data[key].time_stamp = result.data[key].time_stamp.replace("Z", "");
                                    result.data[key].full_time_stamp = result.data[key].time_stamp;
                                    result.data[key].time_stamp = result.data[key].time_stamp.split('.')[0];
                                    result.data[key].end_time = result.data[key].end_time.replace("T", " ");
                                    result.data[key].end_time = result.data[key].end_time.replace("Z", "");
                                    result.data[key].full_end_time = result.data[key].end_time;
                                    result.data[key].end_time = result.data[key].end_time.split('.')[0];
                                    result.data[key].boothid = innerThis.selectedBoothId;
                                    result.data[key].zoneid = innerThis.selectedZoneId;
                                    result.data[key].robotid = innerThis.selectedRobotId;
                                }
                            });
                            this.processInfoContentDatas = result.data;
                        } 
                        else {
                            this.$popmsg(this.$t(`diagnostics.predict.popMsg.predictListDetail`));
                        }
                        
                    }).catch((error) => {
                        this.$log.error(error);
                    });  
                }
                
            }
        },

        async getProcessInfo(processInfo) {
            await this.getSelectedBoothId(processInfo.booth_name);
            await this.getSelectedZoneId(processInfo.zone_name);
            await this.getSelectedRobotId(processInfo.robot_name);
            await this.getProcessInfoContentDatas();
        },

        async getViolationInfo(violationInfo, alarmName) {
            await this.getSelectedBoothId(violationInfo.booth_name);
            await this.getSelectedZoneId(violationInfo.zone_name);
            await this.getSelectedRobotId(violationInfo.robot_name);
            await this.getDisabledViolationAlarm(violationInfo, alarmName);
            
        },

        getSelectedBoothId(boothName) {
            this.selectedBoothId = '';
            for(let i = 0; i < this.getBoothInfos.length; i++) {
                if(this.getBoothInfos[i].name == boothName) {
                    this.selectedBoothId = this.getBoothInfos[i].id;
                }
            }
        },
        
        getSelectedZoneId(zoneName) {
            this.selectedZoneId = '';
            for(let i = 0; i < this.getZoneInfos.length; i++) {
                if(this.getZoneInfos[i].booth == this.selectedBoothId && this.getZoneInfos[i].name == zoneName) {
                    this.selectedZoneId = this.getZoneInfos[i].id;
                }
            }
        },

        getSelectedRobotId(robotName) {
            this.selectedRobotId = '';
            for(let i = 0; i < this.getRobotInfos.length; i++) {
                if(this.getRobotInfos[i].zone == this.selectedZoneId && this.getRobotInfos[i].name == robotName) {
                    this.selectedRobotId = this.getRobotInfos[i].id;
                }
            }
        },

        getSelectedProcessInfoData(selectedProcessInfoData) {
            this.violationChartDatas = [];
            if(selectedProcessInfoData != undefined) {
                let postDatas = {};
                let tempAlarmTime = selectedProcessInfoData.start_time.split(" ")[1];
                this.violationType = selectedProcessInfoData.code;
                postDatas['pcode'] = selectedProcessInfoData.code;
                postDatas['prevtime'] = selectedProcessInfoData.full_time_stamp;
                postDatas['currtime'] = selectedProcessInfoData.full_end_time;
                postDatas['factoryid'] = this.getFactoryId;
                postDatas['boothid'] = this.selectedBoothId;
                postDatas['zoneid'] = this.selectedZoneId;
                postDatas['robotid'] = this.selectedRobotId;
                postDatas['jobname'] = selectedProcessInfoData.job_name;
                postDatas['axis'] = selectedProcessInfoData.axis;
                
                this.getViolationChartTitle(selectedProcessInfoData.code);
                this.$http.get(`${this.baseUrl}/home/predict/chart/pcode/${postDatas.pcode}/factoryid/${postDatas.factoryid}/boothid/${postDatas.boothid}/zoneid/${postDatas.zoneid}/robotid/${postDatas.robotid}/jobname/${postDatas.jobname}/axis/${postDatas.axis}/starttime/${postDatas.prevtime}/endtime/${postDatas.currtime}`).then((result) => {
                    if (result.data !='') {
                        if (postDatas.pcode != 'P005') {
                            this.violationChartDatas = result.data;
                        } 
                        else {
                            let tempDatas = result.data;
                            postDatas['prevtime'] = selectedProcessInfoData.full_time_stamp.split(" ")[0];
                            postDatas['excpt'] = true;
                            delete postDatas['currtime'];
                            delete postDatas['pcode'];
                            this.$http.post(`${this.baseUrl}/diagnostics/torqueloadfactor/data`, postDatas)
                            .then((result) => {
                                if(result.data != '') {
                                    let tempViolationChartDatas = [];
                                    for(let i = 0; i < result.data.length; i++) {
                                        if(result.data[i].timestamp == tempAlarmTime) {
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
                                            this.violationChartDatas = tempViolationChartDatas;
                                        }
                                    }
                                } 
                                                    
                            })
                        }
                    } 
                    else {
                        this.$popmsg(this.$t(`diagnostics.predict.popMsg.predictChart`));
                    }
                    
                }).catch((error) => {
                    this.$log.error(error);
                });
            }
        },     
        
        getViolationChartTitle(code) {
            this.violationChartTitle = '';

            for(let i = 0; i < this.violationInfos.length; i++) {
                if(this.violationInfos[i].code == code) {
                    this.violationChartTitle = this.violationInfos[i].title;
                }
            }
        },

        getDisabledViolationAlarm(violationInfo, alarmName) {
            let postDatas = {};
            postDatas['factoryid'] = this.getFactoryId;
            postDatas['boothid'] = this.selectedBoothId;
            postDatas['zoneid'] = this.selectedZoneId;
            postDatas['robotid'] = this.selectedRobotId;
            postDatas['predicttype'] = Number(alarmName.substr(alarmName.length - 1));
            
            
            this.$http.post(`${this.baseUrl}/home/predict/data/disable`, postDatas)
            .then((result) => {
                this.getPredictStatusContentDatas();
                this.$popmsg(this.$t(`diagnostics.predict.popMsg.predictDataDisable`));
            }).catch((error) => {
                this.$log.error(error);
            }); 
        },

        getPredictOptionDatas() {
            this.selectedPredictDatas = this.$route.params.predictOptionDatas;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './predict';
</style>
