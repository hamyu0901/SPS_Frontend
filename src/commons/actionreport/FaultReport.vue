<template>
    <v-layout column v-bind="getAcceptReportFlag">
        <v-layout class="pt-2 pb-3">
            <v-flex lg9 class="pr-2 pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.titleText}}</v-subheader>
                        <input class="textField" :value="historyData.action_title" @input="setTitle($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex>
            <v-flex 1g3 class="pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.userIdText}}</v-subheader>
                        <input class="textField mr-2" :value="historyData.user_id" readonly/>
                    </v-layout>
                </v-form>   
            </v-flex>
        </v-layout>
        <v-layout class="pb-3">
            <v-flex lg12 class="pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.typeText}}</v-subheader>
                        <input class="textField mr-2" :value="historyData.type_name" readonly/>
                    </v-layout>
                </v-form>  
            </v-flex>
        </v-layout>
        <v-layout class="pb-2 pl-2">
            <v-flex lg1>
                <v-subheader class="specificHeader">{{ui.processInfoText}}</v-subheader>
            </v-flex>
            <v-flex lg2 class="pr-2">
                <input 
                    class="textField" 
                    :value="datas.boothName"
                    readonly
                />
            </v-flex>
             <v-flex lg2 class="pr-2 pl-2">
                <input 
                    class="textField" 
                    :value="datas.zoneName"
                    readonly
                />
            </v-flex>
             <v-flex lg2 class=" pr-2 pl-2">
                <input 
                    class="textField" 
                    :value="datas.robotName"
                    readonly
                />
            </v-flex>
            <v-flex lg1/>
            <v-flex lg4>
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="specificHeader">{{ui.alarmCodeText}}</v-subheader>
                        <input class="textField mr-2" :value="historyData.ref_alarm_code" readonly/>
                    </v-layout>
                </v-form>   
            </v-flex>
        </v-layout>
        <v-layout class="pt-2 pl-2">
            <v-flex lg1>
                <v-subheader class="subHeader">{{ui.failurePeriodText}}</v-subheader>
            </v-flex>
            <v-flex lg7 class="failurePeriod">
                <v-layout>
                    <date-time-picker
                        class="dateTimePicker pr-2"
                        v-bind:savedDate="datas.tempPrevDate"
                        v-on:getDate="getPrevDate"
                    ></date-time-picker>
                    <date-time-picker
                        class="dateTimePicker pl-2"
                        v-bind:savedDate="datas.tempCurrDate"
                        v-on:getDate="getCurrDate"
                    ></date-time-picker>
                </v-layout>
            </v-flex>
            <v-flex lg4>
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="specificHeader">{{ui.failureTimeText}}</v-subheader>
                        <input class="textField mr-2" :value="calFaultTime" readonly/>
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
                    <textarea class="textContentField" :value="historyData.cause_message" @input="setContent($event.target.value)"/>
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
                    <textarea class="textContentField" :value="historyData.remedy_message" @input="setRemedy($event.target.value)"/>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout>
            <v-flex lg12 class="pl-2">
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.tagText}}</v-subheader>
                        <input class="textField mr-2" :value="datas.tags" @input="setTag($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex> 
        </v-layout>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import DateTimePicker from '@/commons/DateTimePicker'
export default {
    components: {DateTimePicker},
    props: ['historyData', 'acceptReportFlag'],
    data() {
        return {
            ui: {
                processInfoText: this.$t(`actionReport.FaultReport.processInfoText`),
                selectorBoothHintText: this.$t(`actionReport.FaultReport.selectorBoothHintText`),
                selectorZoneHinttext: this.$t(`actionReport.FaultReport.selectorZoneHinttext`),
                selectorRobotHintText: this.$t(`actionReport.FaultReport.selectorRobotHintText`),
                alarmCodeText: this.$t(`actionReport.FaultReport.alarmCodeText`),
                failurePeriodText: this.$t(`actionReport.FaultReport.failurePeriodText`),
                failureTimeText: this.$t(`actionReport.FaultReport.failureTimeText`),
                contentsText: this.$t(`actionReport.FaultReport.contentsText`),
                remedyText: this.$t(`actionReport.FaultReport.remedyText`),
                tagText: this.$t(`actionReport.FaultReport.tagText`),
                titleText: this.$t(`actionReport.FaultReport.titleText`),
                userIdText: this.$t(`actionReport.FaultReport.userIdText`),
                typeText: this.$t(`actionReport.FaultReport.typeText`),
                typeHintText: this.$t(`actionReport.FaultReport.typeHintText`)
            },
            datas: {
                boothName: '',
                zoneName: '',
                robotName: '',
                failurePeriod: '',
                faultTime: '',
                tags: '',
                tempPrevDate: '',
                tempCurrDate: '',
                prevDate: '',
                currDate: ''
            },
        }
    },

    created() {
        this.getHistoryData();
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters ({
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'     
        }),
    
        calFaultTime() {
            if(this.datas.prevDate != '' && this.datas.currDate != '' && this.dateCompare(this.datas.prevDate, this.datas.currDate) == true) {
                let prevDate = new Date(this.datas.prevDate);
                let currDate = new Date(this.datas.currDate);
                let faultTime = currDate.getTime() - prevDate.getTime();
                faultTime = faultTime / 1000 / 60;
                this.datas.faultTime = faultTime;
                this.$emit('keyDown');
                return faultTime;
            } else {
                if(this.datas.prevDate == '' && this.datas.currDate == '') {
                    this.datas.faultTime = 0;
                    return 0;
                } else {
                    this.datas.faultTime = -1;
                    return 'error';
                }
            }
        },

        getAcceptReportFlag() {
            if(this.acceptReportFlag == true) {
                if(typeof this.datas.tags === 'string') {
                    this.datas.tags = this.datas.tags.replace(' ', '').split(',');
                }
                for(let i = 0; i < this.datas.tags.length; i++) {
                    if(this.datas.tags[i] == '') {
                        this.datas.tags.splice(i,1);
                    }
                }
                this.$emit('acceptFaultReport', {
                    actionTitle: this.historyData.action_title,
                    actionContent: this.historyData.cause_message, 
                    actionRemedy: this.historyData.remedy_message,
                    factoryid: this.historyData.factory_id,
                    boothid: this.historyData.booth_id,
                    zoneid: this.historyData.zone_id,
                    robotid: this.historyData.robot_id,
                    startDeadTime: this.datas.prevDate,
                    endDeadTime: this.datas.currDate,
                    faultTime: this.datas.faultTime,
                    actionTag: this.datas.tags
                })
            }
        }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--textFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--textFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--textFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
            document.documentElement.style.setProperty("--textContentFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--textContentFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--textContentFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
        },

        getHistoryData() {
            if(this.historyData.tag != undefined) {
                this.datas.tags = '';
                for(let i = 0; i < this.historyData.tag.length; i++) {
                    if(i != this.historyData.tag.length - 1) {
                        this.datas.tags += this.historyData.tag[i] + ', ';
                    } else {
                        this.datas.tags += this.historyData.tag[i];
                    }
                }
            }
            this.datas.tempPrevDate = this.getTempDate(this.historyData.start_deadtime);
            this.datas.tempCurrDate = this.getTempDate(this.historyData.end_deadtime);
            this.datas.failurePeriod += this.historyData.start_deadtime.split('T')[0] + ' - ';
            this.datas.failurePeriod += this.historyData.end_deadtime.split('T')[0];
            if(this.historyData.booth_id != null) {
                this.getBoothName(this.historyData.booth_id);
            }
            if(this.historyData.zone_id != null) {
                this.getZoneName(this.historyData.booth_id, this.historyData.zone_id);
            }
            if(this.historyData.robot_id != null) {
                this.getRobotName(this.historyData.zone_id, this.historyData.robot_id);
            } 
            
        },

       getBoothName(boothid) {
           for(let i = 0; i < this.getBoothInfos.length; i++) {
               if(this.getBoothInfos[i].id == boothid) {
                   this.datas.boothName = this.getBoothInfos[i].name;
               }
           }
       },
        getZoneName(boothid, zoneid) {
            for(let i = 0; i < this.getZoneInfos.length; i++) {
                if(this.getZoneInfos[i].booth == boothid && this.getZoneInfos[i].id == zoneid) {
                    this.datas.zoneName = this.getZoneInfos[i].name;
                }
            }
        },
        getRobotName(zoneid, robotid) {
            for(let i = 0; i < this.getRobotInfos.length; i++) {
                if(this.getRobotInfos[i].zone == zoneid && this.getRobotInfos[i].id == robotid) {
                    this.datas.robotName = this.getRobotInfos[i].name;
                }
            }
        },
        getTempDate(date) {
            let tempDate = '';
            tempDate = date.split('T')[0] + ' ';
            tempDate += (date.split('T')[1].split(':')[0] +':'+ date.split('T')[1].split(':')[1]);
            return tempDate;
        },
        getPrevDate(prevDate) {
            this.datas.prevDate = prevDate;
        },
        getCurrDate(currDate) {
            this.datas.currDate = currDate;
        },
        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);    
            
            return preDate <= currDate;
        },
        setTitle(title) {
            this.historyData.action_title = title;
            this.$emit('keyDown');
        },
        setContent(content) {
            this.historyData.cause_message = content;
            this.$emit('keyDown');
        },
        setRemedy(remedy) {
            this.historyData.remedy_message = remedy;
            this.$emit('keyDown');
        },
        setTag(tag) {
            this.datas.tags = tag.replace(' ', '').split(',');
            this.$emit('keyDown');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './faultreport';
</style>
