<template>
    <v-layout column v-bind="[getAlarmInfoData, getActionReportDialogFlag, getActionReportSaveFlag]">
        <v-layout class="pb-2 pl-2">
            <v-flex lg1>
                <v-subheader class="specificHeader">{{ui.processInfoText}}</v-subheader>
            </v-flex>
            <v-flex lg2 class="pr-2">
                <selector 
                    class="actionType"
                    v-if="actionReportApplySite == 'posthistory'"
                    v-bind:selectorTitle="ui.selectorBoothHintText"
                    v-bind:selectorOptions="getBoothInfos"
                    v-on:selectedTarget="getTargetBoothId"
                ></selector>
                <input 
                    class="inputField" 
                    v-if="actionReportApplySite == 'alarmview'"
                    :value="alarmInfoData.booth"
                    readonly
                />
            </v-flex>
             <v-flex lg2 class="pr-2 pl-2">
                <selector 
                    class="actionType"
                    v-if="actionReportApplySite == 'posthistory'"
                    v-bind:selectorTitle="ui.selectorZoneHinttext"
                    v-bind:selectorOptions="getSelectedTargetZoneInfos"
                    v-on:selectedTarget="getTargetZoneId"
                ></selector>
                <input 
                    class="inputField" 
                    v-if="actionReportApplySite == 'alarmview'"
                    :value="alarmInfoData.zone"
                    readonly
                />
            </v-flex>
             <v-flex lg2 class=" pr-2 pl-2">
                <selector 
                    class="actionType"
                    v-if="actionReportApplySite == 'posthistory'"
                    v-bind:selectorTitle="ui.selectorRobotHintText"
                    v-bind:selectorOptions="getSelectedTargetRobotInfos"
                    v-on:selectedTarget="getTargetRobotId"
                ></selector>
                <input 
                    class="inputField" 
                    v-if="actionReportApplySite == 'alarmview'"
                    :value="alarmInfoData.robot"
                    readonly
                />
            </v-flex>
            <v-flex lg1/>
            <v-flex lg4>
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="specificHeader">{{ui.alarmCodeText}}</v-subheader>
                        <input v-if="alarmInfoData != undefined " class="inputField mr-2" :value="alarmInfoData.alarmcode" readonly/>
                        <input v-else class="inputField mr-2" :value="alarmCode" @input="setAlarmCode($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex>
        </v-layout>
        <v-layout class="pl-2">
            <v-flex lg1>
                <v-subheader class="subHeader">{{ui.failurePeriodText}}</v-subheader>
            </v-flex>
            <v-flex lg7>
                <v-layout>
                    <date-time-picker
                        class="dateTimePicker pr-2"
                        v-on:getDate="getPrevDate"
                    ></date-time-picker>
                    <date-time-picker
                        class="dateTimePicker pr-2 pl-2"
                        v-bind:conditionalDate="prevDate"
                        v-on:getDate="getCurrDate"
                    ></date-time-picker>
                </v-layout>
            </v-flex>
            <v-flex lg4>
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="specificHeader">{{ui.failureTimeText}}</v-subheader>
                        <input class="inputField mr-2" :value="calFaultTime" readonly/>
                    </v-layout>
                </v-form>  
            </v-flex>
        </v-layout>
        <v-layout class="pb-2 pl-2" column>
            <v-layout>
                <v-subheader class="subHeader">{{ui.contentsText}}</v-subheader>
            </v-layout>
            <v-layout>
                <v-flex lg1/>
                <v-flex lg11 class="mr-2">
                    <textarea class="inputContentField" :value="faultReportActionContent" @input="setContent($event.target.value)"/>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout class="pb-2 pl-2" column>
            <v-layout>
                <v-subheader class="subHeader">{{ui.remedyText}}</v-subheader>
            </v-layout>
            <v-layout class="pb-2">
                <v-flex lg1/>
                <v-flex lg11 class="mr-2">
                    <textarea class="inputContentField" :value="faultReportActionRemedy" @input="setRemedy($event.target.value)"/>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout>
            <v-flex lg12 class="pl-2">
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.tagText}}</v-subheader>
                        <input class="inputField mr-2" :value="faultReportActionTag" @input="setTag($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex> 
        </v-layout>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import Selector from '@/commons/Selector'
import DateTimePicker from '@/commons/DateTimePicker'
export default {
    components: {Selector, DateTimePicker},
    props: ['alarmInfoData', 'actionReportDialogFlag' ,'actionReportSaveFlag', 'actionReportApplySite'],
    data() {
        return {
            ui: {
                processInfoText: this.$t(`actionReport.FaultReportActionContents.processInfoText`),
                selectorBoothHintText: this.$t(`actionReport.FaultReportActionContents.selectorBoothHintText`),
                selectorZoneHinttext: this.$t(`actionReport.FaultReportActionContents.selectorZoneHinttext`),
                selectorRobotHintText: this.$t(`actionReport.FaultReportActionContents.selectorRobotHintText`),
                alarmCodeText: this.$t(`actionReport.FaultReportActionContents.alarmCodeText`),
                failurePeriodText: this.$t(`actionReport.FaultReportActionContents.failurePeriodText`),
                failureTimeText: this.$t(`actionReport.FaultReportActionContents.failureTimeText`),
                contentsText: this.$t(`actionReport.FaultReportActionContents.contentsText`),
                remedyText: this.$t(`actionReport.FaultReportActionContents.remedyText`),
                tagText: this.$t(`actionReport.FaultReportActionContents.tagText`)
            },
            prevDate: '',
            currDate: '',
            faultTime: 0,
            alarmCode: '',
            targetBoothId: '',
            targetZoneId: '',
            targetRobotId: '',
            getSelectedTargetZoneInfos: [],
            getSelectedTargetRobotInfos: [],
            faultReportActionContent: '',
            faultReportActionRemedy: '',
            faultReportActionTag: []
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'    
        }),

        getAlarmInfoData() {
           if(this.alarmInfoData != undefined && this.actionReportApplySite == 'alarmview') {
                let boothInfo = '';
                let zoneInfo = '';
                let robotInfo = '';
                boothInfo = this.getBoothId(this.alarmInfoData.booth);
                zoneInfo = this.getZoneId(this.alarmInfoData.zone, boothInfo.id);
                robotInfo = this.getRobotId(this.alarmInfoData.robot, zoneInfo.id);

                this.targetBoothId = boothInfo.id;
                this.targetZoneId = zoneInfo.id;
                if(robotInfo != undefined) {
                    this.targetRobotId = robotInfo.id;
                }
           }
        },

        getActionReportDialogFlag() {
           if(this.actionReportDialogFlag == false) {
                this.alarmCode = '';
                this.targetBoothId = '';
                this.targetZoneId = '';
                this.targetRobotId = '';
                this.prevDate = '';
                this.currDate = '';
                this.faultTime = 0;
                this.faultReportActionContent = '';
                this.faultReportActionRemedy = '';
                this.robotPrecautionActionTag = [];
           }
       },

        calFaultTime() {
            if(this.prevDate != '' && this.currDate != '' && this.dateCompare(this.prevDate, this.currDate) == true) {
                let prevDate = new Date(this.prevDate);
                let currDate = new Date(this.currDate);
                let faultTime = currDate.getTime() - prevDate.getTime();
                faultTime = faultTime / 1000 / 60;
                this.faultTime = faultTime;
                return faultTime;
            } else {
                if(this.prevDate == '' && this.currDate == '') {
                    this.faultTime = 0;
                    return 0;
                } else {
                    this.faultTime = -1;
                    return 'error';
                }
            }
        },

        getActionReportSaveFlag() {
           if(this.actionReportSaveFlag == true) {
               for(let i = 0; i < this.faultReportActionTag.length; i++) {
                    if(this.faultReportActionTag[i] == '') {
                        this.faultReportActionTag.splice(i,1);
                    }
                }
                if(this.alarmInfoData != undefined) {
                    this.$emit('faultReportActionContentDatas', {
                        preDate: this.prevDate, 
                        currDate: this.currDate,
                        faultTime: this.faultTime,
                        boothId: this.targetBoothId,
                        zoneId: this.targetZoneId,
                        robotId: this.targetRobotId, 
                        alarmCode: this.alarmInfoData.alarmcode,
                        actionContent: this.faultReportActionContent, 
                        actionRemedy: this.faultReportActionRemedy, 
                        actionTag: this.faultReportActionTag}
                    );
                } else {
                    this.$emit('faultReportActionContentDatas', {
                        preDate: this.prevDate, 
                        currDate: this.currDate,
                        faultTime: this.faultTime,
                        boothId: this.targetBoothId,
                        zoneId: this.targetZoneId,
                        robotId: this.targetRobotId, 
                        alarmCode: this.alarmCode,
                        actionContent: this.faultReportActionContent, 
                        actionRemedy: this.faultReportActionRemedy, 
                        actionTag: this.faultReportActionTag}
                    );
                }
           }
       }

    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--inputFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--inputFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--inputFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
            document.documentElement.style.setProperty("--inputContentFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--inputContentFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--inputContentFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
        },

        getPrevDate(prevDate) {
            this.prevDate = prevDate;
        },

        getCurrDate(currDate) {
            this.currDate = currDate;
        },

        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);    
           
            return preDate <= currDate;
        },

        getTargetBoothId(targetId) {
            this.getSelectedTargetZoneInfos = [];
            this.targetBoothId = targetId.target;
            for(let i = 0; i < this.getZoneInfos.length; i++) {
                if(this.getZoneInfos[i].booth == this.targetBoothId) {
                    this.getSelectedTargetZoneInfos.push(this.getZoneInfos[i]);
                }
            }
        },

        getTargetZoneId(targetId) {
            this.getSelectedTargetRobotInfos = [];
            this.targetZoneId = targetId.target;
            for(let i = 0; i < this.getRobotInfos.length; i++) {
                if(this.getRobotInfos[i].zone == this.targetZoneId) {
                    this.getSelectedTargetRobotInfos.push(this.getRobotInfos[i]);
                }
            }
        },

        getTargetRobotId(targetId) {
            this.targetRobotId = targetId.target;
        },

        getBoothId(boothName) {
            for(let i = 0; i < this.getBoothInfos.length; i++) {
                if(this.getBoothInfos[i].name == boothName) {
                    return this.getBoothInfos[i];
                }
            }
        },

        getZoneId(zoneName, boothId) {
           for(let i = 0; i < this.getZoneInfos.length; i++) {
               if(this.getZoneInfos[i].name == zoneName && this.getZoneInfos[i].booth == boothId) {
                   return this.getZoneInfos[i];
               }
           }
        },

        getRobotId(robotName, zoneId) {
            for(let i = 0; i < this.getRobotInfos.length; i++) {
               if(this.getRobotInfos[i].name == robotName && this.getRobotInfos[i].zone == zoneId) {
                   return this.getRobotInfos[i];
               }
           }
        },

        setAlarmCode(alarmCode) {
            this.alarmCode = alarmCode;
        },

        setContent(actionContent) {
            this.faultReportActionContent = actionContent;
        },

        setRemedy(actionRemedy) {
            this.faultReportActionRemedy = actionRemedy;
        },

        setTag(actionTag) {
            this.faultReportActionTag = actionTag.replace(' ', '').split(',');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './faultreportactioncontents';
</style>
