<template>
    <v-layout class="actionReport" column d-block v-bind="[getActionReportDialogFlag, getActionReportSaveFlag]">
        <v-layout class="pb-3">
            <v-flex lg9 class="pr-2 pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.titleText}}</v-subheader>
                        <input class="inputField" :value="actionReportTitle" @input="setTitle($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex>
            <v-flex 1g3 class="pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.userIdText}}</v-subheader>
                        <input class="inputField mr-2" :value="inputUserId" readonly/>
                    </v-layout>
                </v-form>   
            </v-flex>
        </v-layout>
        <v-layout class="pb-3" v-bind="contentFlag">
            <v-flex lg12 class="pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.typeText}}</v-subheader>
                        <selector 
                            class="actionType mr-2"
                            v-bind:selectorTitle="ui.typeHintText"
                            v-bind:selectorOptions="actionTypeDatas"
                            v-bind:selectorTarget="actionTypeId"
                            v-on:selectedTarget="getSelectedActionTypeData"
                        ></selector>
                    </v-layout>
                </v-form>  
            </v-flex>
        </v-layout>
        <robot-precaution-action-contents 
            v-if="robotPrecautionActionTypeFlag"
            v-bind:alarmInfoData="alarmInfoData"
            v-bind:actionReportDialogFlag="actionReportDialogFlag"
            v-bind:actionReportSaveFlag="actionReportSaveFlag"
            v-on:robotPrecautionActionContentDatas="getRobotPrecautionActionContentDatas"
        ></robot-precaution-action-contents>
        <general-maintenance-action-contents 
            v-if="generalMaintenanceActionTypeFlag"
            v-bind:actionReportDialogFlag="actionReportDialogFlag"
            v-bind:actionReportSaveFlag="actionReportSaveFlag"
            v-on:generalMaintenanceActionContentDatas="getGeneralMaintenanceActionContentDatas"
        ></general-maintenance-action-contents>
        <fault-report-action-contents 
            v-if="faultReportActionTypeFlag"
            v-bind:alarmInfoData="alarmInfoData"
            v-bind:actionReportDialogFlag="actionReportDialogFlag"
            v-bind:actionReportSaveFlag="actionReportSaveFlag"
            v-bind:actionReportApplySite="actionReportApplySite"
            v-on:faultReportActionContentDatas="getFaultReportActionContentDatas"
        ></fault-report-action-contents>
    </v-layout>
</template>

<script>
import Selector from '@/commons/Selector'
import RobotPrecautionActionContents from '@/commons/actionreport/RobotPrecautionActionContents'
import GeneralMaintenanceActionContents from '@/commons/actionreport/GeneralMaintenanceActionContents'
import FaultReportActionContents from '@/commons/actionreport/FaultReportActionContents'
export default {
    components: {Selector, RobotPrecautionActionContents, GeneralMaintenanceActionContents, FaultReportActionContents},
    props: ['alarmInfoData', 'actionReportDialogFlag', 'actionReportSaveFlag', 'actionReportApplySite'],
    data() {
        return {
            ui: {
                titleText: this.$t(`actionReport.titleText`),
                userIdText: this.$t(`actionReport.userIdText`),
                typeText: this.$t(`actionReport.typeText`),
                typeHintText: this.$t(`actionReport.typeHintText`)
            },
            actionReportTitle: '',
            inputUserId: '',
            actionTypeDatas: [
                {id: 1, name: this.$t(`actionReport.actionTypeDatas.generalAction`)},
                {id: 2, name: this.$t(`actionReport.actionTypeDatas.robotAlarmAction`)},
                {id: 3, name: this.$t(`actionReport.actionTypeDatas.maintenanceAction`)},
                {id: 4, name: this.$t(`actionReport.actionTypeDatas.predictAlarmAction`)},
                {id: 5, name: this.$t(`actionReport.actionTypeDatas.faultReport`)},
            ],
            actionTypeId: '',
            robotPrecautionActionTypeFlag: false,
            generalMaintenanceActionTypeFlag: false,
            faultReportActionTypeFlag: false
        }
    },

    mounted() {
        this.initializeStyle();
        this.setInputUserId();
    },

    computed: {
        getActionReportDialogFlag() {
            if(this.actionReportDialogFlag == false) {
                this.actionReportTitle = '';
                this.actionTypeId = '';
            }
        },

        contentFlag() {
            if(this.actionTypeId == 2 || this.actionTypeId == 4) {
                this.robotPrecautionActionTypeFlag = true;
                this.generalMaintenanceActionTypeFlag = false;
                this.faultReportActionTypeFlag = false;
            } else if(this.actionTypeId == 1 || this.actionTypeId == 3) {
                this.robotPrecautionActionTypeFlag = false;
                this.generalMaintenanceActionTypeFlag = true;
                this.faultReportActionTypeFlag = false;
            } else if(this.actionTypeId == 5){
                this.robotPrecautionActionTypeFlag = false;
                this.generalMaintenanceActionTypeFlag = false;
                this.faultReportActionTypeFlag = true;
            } else {
                this.robotPrecautionActionTypeFlag = false;
                this.generalMaintenanceActionTypeFlag = false;
                this.faultReportActionTypeFlag = false;
            }
        },

        getActionReportSaveFlag() {
            if(this.actionReportSaveFlag == true) {
                if(this.robotPrecautionActionTypeFlag == false && this.generalMaintenanceActionTypeFlag == false && this.faultReportActionTypeFlag == false) {
                    this.$emit('saveActionContentDatas', null);
                }
            }
        }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--inputFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--inputFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--inputFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
        },
        setInputUserId() {
            this.inputUserId = '';
            this.inputUserId = sessionStorage.getItem('userid'); 
        },

        setTitle(title) {
            this.actionReportTitle = title;
        },

        getSelectedActionTypeData(selectedActionTypeData) {
            this.actionTypeId = selectedActionTypeData.target;
        },

        getRobotPrecautionActionContentDatas(robotPrecautionActionContentDatas) {
            let saveActionContentDatas = {};
            saveActionContentDatas['userId'] = this.inputUserId;
            saveActionContentDatas['alarmCode'] = robotPrecautionActionContentDatas.alarmCode;
            saveActionContentDatas['actionTitle'] = this.actionReportTitle;
            saveActionContentDatas['actionTypeId'] = this.actionTypeId-1;
            saveActionContentDatas['actionContent'] = robotPrecautionActionContentDatas.actionContent;
            saveActionContentDatas['actionTag'] = robotPrecautionActionContentDatas.actionTag;
            this.$emit('saveActionContentDatas', saveActionContentDatas);
        },

        getGeneralMaintenanceActionContentDatas(generalMaintenanceActionContentDatas) {
            let saveActionContentDatas = {};
            saveActionContentDatas['userId'] = this.inputUserId;
            saveActionContentDatas['actionTitle'] = this.actionReportTitle;
            saveActionContentDatas['actionTypeId'] = this.actionTypeId-1;
            saveActionContentDatas['actionContent'] = generalMaintenanceActionContentDatas.actionContent;
            saveActionContentDatas['actionTag'] = generalMaintenanceActionContentDatas.actionTag;
            this.$emit('saveActionContentDatas', saveActionContentDatas);
        },

        getFaultReportActionContentDatas(faultReportActionContentDatas) {
            let saveActionContentDatas = {};
            saveActionContentDatas['userId'] = this.inputUserId;
            saveActionContentDatas['actionTitle'] = this.actionReportTitle;
            saveActionContentDatas['actionTypeId'] = this.actionTypeId-1;
            saveActionContentDatas['boothid'] = faultReportActionContentDatas.boothId;
            saveActionContentDatas['zoneid'] = faultReportActionContentDatas.zoneId;
            saveActionContentDatas['robotid'] = faultReportActionContentDatas.robotId;
            saveActionContentDatas['preDate'] = faultReportActionContentDatas.preDate;
            saveActionContentDatas['currDate'] = faultReportActionContentDatas.currDate;
            saveActionContentDatas['faultTime'] = faultReportActionContentDatas.faultTime;
            saveActionContentDatas['alarmCode'] = faultReportActionContentDatas.alarmCode;
            saveActionContentDatas['actionContent'] = faultReportActionContentDatas.actionContent;
            saveActionContentDatas['actionRemedy'] = faultReportActionContentDatas.actionRemedy;
            saveActionContentDatas['actionTag'] = faultReportActionContentDatas.actionTag;
            this.$emit('saveActionContentDatas', saveActionContentDatas);
        }
    }
}
</script>

<style scoped lang="scss">
    @import './actionreport';
</style>
