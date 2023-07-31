<template>
    <v-card class="historyListCard" elevation="0" v-bind="getHistoryListDatas">
        <v-card-title class="justify-left historyListCardTitle pb-2" :style="ui.titleStyle">
            <span>{{ui.title}}</span>
        </v-card-title>
        <v-layout class="historyList">
            <v-list class="historyListContents" three-line>
                <template  v-for="(data, index) in datas">
                    <v-list-tile :key="index" @click="historyDataClicked(data)">   
                        <v-layout column>
                            <v-layout>
                                <span class="actionListTitle tdText">{{data.action_title}}</span>
                                <v-spacer/>
                                <div class="pr-3">
                                    <span class="tdText">{{ui.writer+" : "}}</span>
                                    <span class="tdText">{{data.user_id}}</span>
                                </div>
                                <div>
                                    <span class="tdText">{{ui.date+" : "}}</span>
                                    <span class="tdText">{{data.time_stamp}}</span>
                                </div>
                            </v-layout>
                            <v-layout class="pt-1">
                                <v-chip
                                    class="chips" 
                                    :color="ui.chipTypeNameColor" 
                                    :text-color="ui.chipTextColor" 
                                    small 
                                    disabled
                                >{{data.type_name}}</v-chip>
                                <v-chip 
                                    class="chips" 
                                    v-for="(tag, tagIndex) in data.tag"
                                    :key="tagIndex"
                                    :color="ui.chipColor" 
                                    :text-color="ui.chipTextColor" 
                                    small 
                                    disabled
                                >{{tag}}</v-chip>
                            </v-layout>
                        </v-layout> 
                    </v-list-tile>
                    <v-divider :key="'divider'+index"></v-divider>
                </template>
            </v-list>
            <v-dialog v-model="reportDlgFlag" width="1000px" persistent>
                <v-card class="historyListItemDlgCard">
                    <v-card-title class="justify-center historyListItemDlgCardTitle pb-2" v-bind:style="ui.titleStyle">
                        <v-layout class="justify-center">
                            <span class="pl-5 ml-5 pt-1">{{ui.postReportTitle}}</span>
                        </v-layout>
                        <v-btn class="dialogBtn buttonItem" small @click="deleteBtnClicked">    
                            {{ui.deleteText}}
                        </v-btn>
                    </v-card-title>
                    <div class="pt-3 pr-3 pb-3 pl-3">
                        <general-maintenance-report
                            v-if="historyListData.action_type == 0 || historyListData.action_type == 2"
                            v-bind:historyData="historyListData"
                            v-bind:actionReportDialogFlag="reportDlgFlag"
                            v-bind:acceptReportFlag="acceptReportFlag"
                            v-on:acceptGeneralMaintenanceReport="getAcceptGeneralMaintenanceReport"
                            @keyDown="getKeyDown"
                        ></general-maintenance-report>
                        <robot-precaution-report
                            v-if="historyListData.action_type == 1 || historyListData.action_type == 3"
                            v-bind:historyData="historyListData"
                            v-bind:actionReportDialogFlag="reportDlgFlag"
                            v-bind:acceptReportFlag="acceptReportFlag"
                            v-on:acceptRobotPrecautionReport="getAcceptRobotPrecautionReport"
                            @keyDown="getKeyDown"
                        ></robot-precaution-report>
                        <fault-report
                            v-if="historyListData.action_type == 4"
                            v-bind:historyData="historyListData"
                            v-bind:actionReportDialogFlag="reportDlgFlag"
                            v-bind:acceptReportFlag="acceptReportFlag"
                            v-on:acceptFaultReport="getAcceptFaultReport"
                            @keyDown="getKeyDown"
                        ></fault-report>
                        <v-layout class="pt-3 pr-1">
                            <v-spacer/>
                            <v-btn class="dialogBtn buttonItem mr-1" @click="acceptBtnClicked" :disabled="flag.keyDown">
                                {{ui.acceptText}}
                            </v-btn>
                            <v-btn class="dialogBtn buttonItem mr-1" @click="onClose">
                                {{ui.closeText}}
                            </v-btn>
                        </v-layout>
                    </div>
                </v-card>
            </v-dialog>
            <comfirm-dlg
                v-bind:comfirmDlgType="comfirmDlgType"
                v-bind:comfirmDlgFlag="actionReportComfirmFlag"
                v-on:comfirmFlag="getComfirmFlag"
                v-on:closeFlag="getActionReportComfirmCloseFlag"
            ></comfirm-dlg>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import GeneralMaintenanceReport from '@/commons/actionreport/GeneralMaintenanceReport'
import RobotPrecautionReport from '@/commons/actionreport/RobotPrecautionReport'
import FaultReport from '@/commons/actionreport/FaultReport'
import ComfirmDlg from '@/commons/ComfirmDlg'
export default {
    components: {GeneralMaintenanceReport, RobotPrecautionReport, FaultReport, ComfirmDlg},
    props:['alarmId','historyListDatas'],
    data() {
        return {
            ui: {
                title: this.$t(`postHistory.child.HistoryList.title`),
                postReportTitle: this.$t(`postHistory.child.HistoryList.postReportTitle`),
                comfirmText: this.$t(`postHistory.child.HistoryList.comfirmText`),
                closeText: this.$t(`postHistory.child.HistoryList.closeText`),
                acceptText: this.$t(`postHistory.child.HistoryList.acceptText`),
                deleteText: this.$t(`postHistory.child.HistoryList.deleteText`),
                writer: this.$t(`postHistory.child.HistoryList.writer`),
                date: this.$t(`postHistory.child.HistoryList.date`),
                chipTypeNameColor: '',
                chipColor: '',
                chipTextColor: '',
                titleStyle: null
            },
            defaultDate: '1970-01-01 09:00',
            datas: [],
            historyListData: {},
            saveActionContentDatas: {},
            reportDlgFlag: false,
            actionReportComfirmFlag: false,
            acceptReportFlag: false,
            comfirmDlgType: '',
            flag: {
                keyDown: true
            }
        }
    },
    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl'
        }),
        getHistoryListDatas() {
            this.datas = [];
            this.starColors = {};
            this.datas = this.historyListDatas;
        },
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.chipTypeNameColor = this.$style.posthistory.chipTypeNameColor;
            this.ui.chipColor = this.$style.posthistory.chipColor;
            this.ui.chipTextColor = this.$style.posthistory.chipTextColor;

            document.documentElement.style.setProperty("--historyListCardBackgroundColor", this.$style.posthistory.historyListItemHistoryListCardBackgroundColor);
            document.documentElement.style.setProperty("--historyListCardBorderColor", this.$style.common.cardItemBorderColor);
            document.documentElement.style.setProperty("--historyListCardTitleBackgroundColor", this.$style.posthistory.historyListItemCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--historyListCardTitleColor", this.$style.posthistory.historyListItemCardTitleColor);
            document.documentElement.style.setProperty("--historyListContentsBackgroundColor", this.$style.posthistory.historyListItemHistoryListContentsBackgroundColor);
            document.documentElement.style.setProperty("--historyListItemDlgBackgroundColor", this.$style.posthistory.historyListItemHistoryListItemDlgBackgroundColor);
            document.documentElement.style.setProperty("--historyListItemDlgCardTitleBackgroundColor", this.$style.posthistory.historyListItemHistoryListItemDlgTitleBackgroundColor);
            document.documentElement.style.setProperty("--historyListItemDlgCardTitleColor", this.$style.posthistory.historyListItemHistoryListItemDlgTitleColor);
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);

            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
        },
        getKeyDown() {
            this.setKeyDownFlag(false);
        },

        setKeyDownFlag(flag) {
            this.flag.keyDown = flag;
        },

        historyDataClicked(data) {
            this.historyListData = {};
            let postDatas = {};
            postDatas['actionid'] = data.action_id;
            this.reportDlgFlag = true;
            this.$http.post(`${this.baseUrl}/posthistory/data/popup`, postDatas).then((result) => {
                this.historyListData = result.data[0];
                this.historyListData['tag'] = data.tag;
                this.historyListData['type_name'] = data.type_name;
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        setUpdatePostDatas() {
            let postDatas = {};
            postDatas['actionid'] = this.historyListData.action_id;
            postDatas['alarmcode'] = this.historyListData.ref_alarm_code;
            postDatas['title'] = this.saveActionContentDatas.actionTitle;
            postDatas['tags'] = this.setTagDatas();
            if(this.saveActionContentDatas.actionTypeId != 4) {
                postDatas['remedy'] = this.saveActionContentDatas.actionContent;
                postDatas['cause'] = null;
                postDatas['factoryid'] = null;
                postDatas['boothid'] = null;
                postDatas['zoneid'] = null;
                postDatas['robotid'] = null;
                postDatas['startdeadtime'] = null;
                postDatas['enddeadtime'] = null;
                postDatas['deadtime'] = null;
            }
            else {
                postDatas['remedy'] = this.saveActionContentDatas.actionRemedy;
                postDatas['cause'] = "'"+this.saveActionContentDatas.actionContent+"'";
                postDatas['factoryid'] = this.saveActionContentDatas.factoryid;
                postDatas['boothid'] = this.saveActionContentDatas.boothid;
                postDatas['zoneid'] = this.saveActionContentDatas.zoneid;
                if(this.saveActionContentDatas.robotid != '') {
                    postDatas['robotid'] = this.saveActionContentDatas.robotid;
                }
                postDatas['startdeadtime'] = "'"+this.saveActionContentDatas.startDeadTime+"'";
                postDatas['enddeadtime'] = "'"+this.saveActionContentDatas.endDeadTime+"'";
                postDatas['deadtime'] = this.saveActionContentDatas.faultTime;
            }
            return postDatas;
        },

        setTagDatas() {
            let tempTags = '';
            if(this.saveActionContentDatas.actionTag.length != 0) {
                for(let i = 0; i < this.saveActionContentDatas.actionTag.length; i++) {
                    if(i < this.saveActionContentDatas.actionTag.length - 1) {
                        tempTags += this.saveActionContentDatas.actionTag[i] + '-';
                    } else {
                        tempTags += this.saveActionContentDatas.actionTag[i];
                    }
                }
            } 
            return tempTags;
        },

        checkTagDatas() {
            return new Set(this.saveActionContentDatas.actionTag).size === this.saveActionContentDatas.actionTag.length;
        },

        checkUpdateDatas(saveActionContentDatas) {
            if(saveActionContentDatas.actionTypeId != 4) {
                return saveActionContentDatas.actionContent != '' && saveActionContentDatas.actionTitle != '';
            }
            else {
                return ( 
                    saveActionContentDatas.actionContent != '' 
                    && saveActionContentDatas.actionRemedy != '' 
                    && saveActionContentDatas.startDeadTime != this.defaultDate 
                    && saveActionContentDatas.endDeadTime != this.defaultDate
                    && saveActionContentDatas.faultTime != -1
                    && saveActionContentDatas.actionTitle != '' 
                );
            }
        },

        getComfirmFlag() {
            let postDatas = {};
            let tempTags = '';
            if(this.comfirmDlgType == "delete") {
                postDatas['actionid'] = this.historyListData.action_id;
                this.$http.post(`/posthistory/data/delete`, postDatas).then((result) => {
                    this.actionReportComfirmFlag = false;
                    this.reportDlgFlag = false;
                    this.$emit('listUpdate');
                }).catch((error) => {
                    this.$log.error(error);
                })
            } 
            else if(this.comfirmDlgType == "update") {
                postDatas = this.setUpdatePostDatas();
                if(this.checkUpdateDatas(this.saveActionContentDatas)) {
                    if(this.checkTagDatas()) {
                        this.$http.post(`/posthistory/data/modify`, postDatas).then((result) => {
                            this.actionReportComfirmFlag = false;
                            this.reportDlgFlag = false;
                            this.$emit('listUpdate');
                        }).catch((error) => {
                            this.$log.error(error);
                        })
                    }
                    else {
                        this.$popmsg(this.$t(`postHistory.child.HistoryList.popMsg.checkTagDatas`));
                    }
                }
                else {
                    this.$popmsg(this.$t(`postHistory.child.HistoryList.popMsg.checkDataList`));
                }
            } 
        },

        deleteBtnClicked() {
            if (sessionStorage.getItem('userid') == this.historyListData.user_id) {
                this.comfirmDlgType = 'delete';
                this.actionReportComfirmFlag = true;
            } 
            else {
                this.$popmsg(this.$t(`postHistory.child.HistoryList.popMsg.deleteDataList`));
            }
            this.setKeyDownFlag(true);
        },

        acceptBtnClicked() {
            if (sessionStorage.getItem('userid') == this.historyListData.user_id) {
                this.comfirmDlgType = 'update';
                this.acceptReportFlag = true;
                this.actionReportComfirmFlag = true;
            } 
            else {
                this.$popmsg(this.$t(`postHistory.child.HistoryList.popMsg.acceptDataList`));
            }
            this.setKeyDownFlag(true);
        },

        onClose() {
            this.reportDlgFlag = false;
            this.setKeyDownFlag(true);
        },

        getAcceptGeneralMaintenanceReport(acceptGeneralMaintenanceReportData) {
            this.saveActionContentDatas = {};
            this.saveActionContentDatas['actionTitle'] = acceptGeneralMaintenanceReportData.actionTitle;
            this.saveActionContentDatas['actionTypeId'] = this.historyListData.action_type;
            this.saveActionContentDatas['actionContent'] = acceptGeneralMaintenanceReportData.actionContent;
            this.saveActionContentDatas['actionTag'] = acceptGeneralMaintenanceReportData.actionTag;
            this.acceptReportFlag = false;
            this.actionReportComfirmFlag = true;
        },
        
        getAcceptRobotPrecautionReport(acceptRobotPrecautionReportData) {
            this.saveActionContentDatas = {};
            this.saveActionContentDatas['actionTitle'] = acceptRobotPrecautionReportData.actionTitle;
            this.saveActionContentDatas['actionTypeId'] = this.historyListData.action_type;
            this.saveActionContentDatas['actionContent'] = acceptRobotPrecautionReportData.actionContent;
            this.saveActionContentDatas['actionTag'] = acceptRobotPrecautionReportData.actionTag;
            this.acceptReportFlag = false;
            this.actionReportComfirmFlag = true;
        },

        getAcceptFaultReport(acceptFaultReportData) {
            this.saveActionContentDatas = {};
            this.saveActionContentDatas['actionTypeId'] = this.historyListData.action_type;
            this.saveActionContentDatas['actionTitle'] = acceptFaultReportData.actionTitle;
            this.saveActionContentDatas['actionContent'] = acceptFaultReportData.actionContent;
            this.saveActionContentDatas['actionRemedy'] = acceptFaultReportData.actionRemedy;
            this.saveActionContentDatas['factoryid'] = acceptFaultReportData.factoryid;
            this.saveActionContentDatas['boothid'] = acceptFaultReportData.boothid;
            this.saveActionContentDatas['zoneid'] = acceptFaultReportData.zoneid;
            this.saveActionContentDatas['robotid'] = acceptFaultReportData.robotid;
            this.saveActionContentDatas['startDeadTime'] = acceptFaultReportData.startDeadTime;
            this.saveActionContentDatas['endDeadTime'] = acceptFaultReportData.endDeadTime;
            this.saveActionContentDatas['faultTime'] = acceptFaultReportData.faultTime;
            this.saveActionContentDatas['actionTag'] = acceptFaultReportData.actionTag;
            this.acceptReportFlag = false;
            this.actionReportComfirmFlag = true;
        },

        getActionReportComfirmCloseFlag() {
            this.actionReportComfirmFlag = false;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './historylist';
</style>
