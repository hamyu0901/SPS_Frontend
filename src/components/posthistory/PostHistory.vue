<template>
    <v-container fluid fill-height>
        <v-layout column>
            <v-layout>
                <v-flex class="pl-2 pr-2" lg2>
                    <date-picker
                        class="postHistorySelector"
                        v-bind:placeHolder="ui.prevDate"
                        v-bind:setDate="setPrevDate()"
                        v-on:getDate="getPrevDate"
                    ></date-picker>
                </v-flex>
                <v-flex class="pl-2 pr-2" lg2>
                    <date-picker  
                        class="postHistorySelector"
                        v-bind:placeHolder="ui.currDate"
                        v-bind:setDate="setCurrDate()"
                        v-on:getDate="getCurrDate"
                    ></date-picker>
                </v-flex>
                <a>
                    <img class="pt-1 pl-4 pr-1" :src="ui.sectorIcon"/>
                </a>
                <v-flex class="pl-2 pr-2" lg2>
                    <selector
                        class="postHistorySelector" 
                        v-bind:selectorTitle="ui.searchHintText"
                        v-bind:selectorOptions="searchTypes"
                        v-on:selectedTarget="getTargetSearchCondition"
                    ></selector>
                </v-flex>
                <v-flex class="pl-2 pr-2" lg2>
                    <selector
                        v-show="datas.searchType == searchTypes[1].id"
                        class="postHistorySelector" 
                        v-bind:selectorTitle="ui.selectTypeHintText"
                        v-bind:selectorOptions="typeInfos"
                        v-on:selectedTarget="getTargetActionType"
                    ></selector>
                    <input 
                        v-show="datas.searchType != searchTypes[1].id"
                        class="inputAlarmCode"
                        v-model="datas.searchContent"
                        v-bind:placeholder="ui.inputHintText"
                    >
                </v-flex>
                <v-btn class="searchBtn buttonItem ml-3 mr-1" @click="addActionReportBtnClicked">
                    <a class="pt-1">
                        <img :src="ui.createBtnIcon">
                    </a>
                </v-btn>
                <v-btn class="searchBtn buttonItem" @click="searchBtnClick">
                    <a class="pt-1">
                        <img :src="ui.searchBtnIcon">
                    </a>
                </v-btn>
                <v-dialog v-model='actionReportDialogFlag' width='1000px' persistent>
                        <v-card class="actionReportDlgCard">
                            <v-card-title class="actionReportDlgCardTitle justify-center pb-2" v-bind:style="ui.titleStyle">
                                <span class="pt-1">{{ui.actionReportTitle}}</span>
                            </v-card-title>
                            <div class="pt-3 pr-3 pb-3 pl-3">
                                <action-report
                                    v-bind:alarmInfoData="undefined"
                                    v-bind:actionReportDialogFlag="actionReportDialogFlag"
                                    v-bind:actionReportSaveFlag="actionReportSaveFlag"
                                    v-bind:actionReportApplySite="'posthistory'"
                                    v-on:saveActionContentDatas="getSaveActionContentDatas"
                                ></action-report>
                                <v-layout class="pt-3 pr-1">
                                    <v-spacer/>
                                    <v-btn class="dialogBtn buttonItem mr-1" @click="saveBtn">    
                                        {{ui.saveText}}
                                    </v-btn>
                                    <v-btn class="dialogBtn buttonItem mr-1" @click="actionReportDialogFlag = false">
                                        {{ui.closeText}}
                                    </v-btn>
                                </v-layout>
                            </div>
                        </v-card>
                </v-dialog>
                <comfirm-dlg
                    v-bind:comfirmDlgType="'save'"
                    v-bind:comfirmDlgFlag="actionReportSaveComfirmFlag"
                    v-on:comfirmFlag="getComfirmFlag"
                    v-on:closeFlag="getActionReportComfirmCloseFlag"
                ></comfirm-dlg>
            </v-layout>
            <v-layout class="pt-3">
                <v-flex xs12 lg12>
                    <history-list
                        v-bind:historyListDatas="sendDatas.historyListDatas"
                        v-on:listUpdate="searchBtnClick"
                    ></history-list>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex';
import datePicker from '@/commons/DatePicker';
import selector from '@/commons/Selector';
import HistoryList from '@/components/posthistory/posthistory/HistoryList'
import ActionReport from '@/commons/ActionReport'
import ComfirmDlg from '@/commons/ComfirmDlg'
export default {
    components: {
        selector,
        datePicker,
        HistoryList,
        ActionReport,
        ComfirmDlg
    },
    data() {
        return {
            actionReportDialogFlag: false,
            actionReportSaveFlag: false,
            actionReportSaveComfirmFlag: false,
            ui: {
                prevDate:           this.$t(`postHistory.prevDate`),
                currDate:           this.$t(`postHistory.currDate`),
                booth:              this.$t(`postHistory.booth`),
                zone:               this.$t(`postHistory.zone`),
                robot:              this.$t(`postHistory.robot`),
                alarmcode:          this.$t(`postHistory.alarmCode`),
                codesearch:         this.$t(`postHistory.codeSearch`),
                searchHintText:     this.$t(`postHistory.searchHintText`),
                inputHintText:      this.$t(`postHistory.inputHintText`),
                selectTypeHintText: this.$t(`postHistory.selectTypeHintText`),
                actionReportTitle:  this.$t(`postHistory.actionReportTitle`),
                saveText:           this.$t(`postHistory.saveText`),
                closeText:          this.$t(`postHistory.closeText`),
                searchBtnIcon:      require("@/images/search_icon.png"),
                createBtnIcon:      require("@/images/create_icon.png"),
                sectorIcon:         require("@/images/selector_icon.png"),
                color: {
                    vbtn: ``,
                },
                titleStyle: null
            },
            infoTableHeaderData: [
                { text: this.$t(`postHistory.infoTableHeaderData.occurDate`),    value: 'occur_date',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.occurTime`),    value: 'occur_time',     sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.actionTime`),    value: 'action_tod',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.booth`),         value: 'booth',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.zone`),           value: 'zone',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.robot`),         value: 'robot',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.alarmDesc`),    value: 'alarm_desc',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.actionDesc`),    value: 'action_desc',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.alarmCode`),    value: 'alarm_code',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.deadTime`),    value: 'dead_time',   sortable: false, align: 'center'},
                { text: this.$t(`postHistory.infoTableHeaderData.delete`),         value: 'delete',   sortable: false, align: 'center'}
            ],
            infoTableContentData: [],
            flag: false,
            dialog: false,
            defaultDate: '1970-01-01 09:00',
            searchTypes: [
                {id: 'alarmcode', name: this.$t(`postHistory.searchTypes.alarmcode`)},
                {id: 'typename', name: this.$t(`postHistory.searchTypes.typename`)},
                {id: 'title', name: this.$t(`postHistory.searchTypes.title`)},
                {id: 'tag', name: this.$t(`postHistory.searchTypes.tag`)},
                {id: 'userid', name: this.$t(`postHistory.searchTypes.userid`)},
            ],
            typeInfos: [
                {id: 0, name: this.$t(`actionReport.actionTypeDatas.generalAction`)},
                {id: 1, name: this.$t(`actionReport.actionTypeDatas.robotAlarmAction`)},
                {id: 2, name: this.$t(`actionReport.actionTypeDatas.maintenanceAction`)},
                {id: 3, name: this.$t(`actionReport.actionTypeDatas.predictAlarmAction`)},
                {id: 4, name: this.$t(`actionReport.actionTypeDatas.faultReport`)},
            ],
            datas: {
                prevTime: '',
                currTime: '',
                searchType: '',
                searchContent: '',
                booth: '',
                zone: '',
                robot: ''
            },
            sendDatas: {
                date: ' ',
                occurTime: ' ',
                actionTime: ' ',
                dt: ' ',
                booth: ' ',
                zone: ' ',
                robot: ' ',
                causeDesc: ' ',
                actionDesc: ' ',
                userID: ' ',
                historyListDatas: []
            },
        }
    },
    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'     
        }),
    },
    mounted() {
        this.initializeStyle();
        this.$emit('mountedTab');
        this.searchBtnClick();
    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);
            document.documentElement.style.setProperty("--inputBackgroundColor", this.$style.posthistory.postHistoryItemInputAlarmCodeBackgroundColor);
            document.documentElement.style.setProperty("--inputColor", this.$style.posthistory.postHistoryItemInputAlarmCodeColor);
            document.documentElement.style.setProperty("--inputBorderColor", this.$style.posthistory.postHistoryItemInputAlarmCodeBorderColor);
            document.documentElement.style.setProperty("--actionReportDlgCardBackgroundColor", this.$style.posthistory.postHistoryItemActionReportDlgCardBackgroundColor);
            document.documentElement.style.setProperty("--actionReportDlgCardTitleBackgroundColor", this.$style.posthistory.postHistoryItemActionReportDlgCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--actionReportDlgCardTitleColor", this.$style.posthistory.postHistoryItemActionReportDlgCardTitleColor);
            
        },
        getTargetSearchCondition(targetSearchCondition) {
            this.datas.searchType = targetSearchCondition.target;
        },

        getTargetActionType(targetActionType) {
            this.datas.searchContent = targetActionType.name;
        },

        addActionReportBtnClicked() {
            this.actionReportDialogFlag = true;
        },
        saveBtn() {
            this.actionReportSaveFlag = true;
        },
        getSaveActionContentDatas(saveActionContentDatas) {
            if(saveActionContentDatas == null) {
                this.actionReportSaveFlag = false;
                this.$popmsg(this.$t(`alarmView.child.alarmViewData.popMsg.getSaveActionContentDatas`));
            } else {
                this.saveActionContentDatas = {};
                this.saveActionContentDatas = saveActionContentDatas;
                this.actionReportSaveFlag = false;
                this.actionReportSaveComfirmFlag = true;
            }
        },
        getActionReportComfirmCloseFlag() {
            this.actionReportSaveComfirmFlag = false;
        },

        setSavePostDatas() {
            let postDatas = {};
            postDatas['actiontitle'] = this.saveActionContentDatas.actionTitle;
            postDatas['userid'] = this.saveActionContentDatas.userId;
            postDatas['actiontype'] = this.saveActionContentDatas.actionTypeId;
            postDatas['tags'] = this.setTagDatas();
            if(this.saveActionContentDatas.actionTypeId == 0 || this.saveActionContentDatas.actionTypeId == 2) {
                postDatas['remedymessage'] = this.saveActionContentDatas.actionContent;
            }
            else if(this.saveActionContentDatas.actionTypeId == 1 || this.saveActionContentDatas.actionTypeId == 3) {
                postDatas['remedymessage'] = this.saveActionContentDatas.actionContent;
                postDatas['alarmcode'] = this.saveActionContentDatas.alarmCode;
            }
            else {
                postDatas['remedymessage'] = this.saveActionContentDatas.actionRemedy;
                postDatas['alarmcode'] = this.saveActionContentDatas.alarmCode;
                postDatas['causemessage'] = this.saveActionContentDatas.actionContent;
                postDatas['factoryid'] = this.getFactoryId;
                postDatas['boothid'] = this.saveActionContentDatas.boothid;
                postDatas['zoneid'] = this.saveActionContentDatas.zoneid;
                if(this.saveActionContentDatas.robotid != '') {
                    postDatas['robotid'] = this.saveActionContentDatas.robotid;
                }
                postDatas['startdt'] = this.saveActionContentDatas.preDate;
                postDatas['enddt'] = this.saveActionContentDatas.currDate;
                postDatas['dt'] = this.saveActionContentDatas.faultTime;
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

        checkSavePostDatas() {
            if(this.saveActionContentDatas.actionTypeId == 0 || this.saveActionContentDatas.actionTypeId == 2) {
                return this.saveActionContentDatas.actionContent != '' && this.saveActionContentDatas.actionTitle != '';
            }
            else if(this.saveActionContentDatas.actionTypeId == 1 || this.saveActionContentDatas.actionTypeId == 3) {
                return this.saveActionContentDatas.actionContent != '' && this.saveActionContentDatas.alarmCode != '' && this.saveActionContentDatas.actionTitle != '';
            }
            else {
                return (
                    this.saveActionContentDatas.actionContent != ''
                    && this.saveActionContentDatas.actionRemedy != ''
                    && this.saveActionContentDatas.boothid != undefined
                    && this.saveActionContentDatas.zoneid != undefined
                    && this.saveActionContentDatas.preDate != ''
                    && this.saveActionContentDatas.currDate != ''
                    && this.saveActionContentDatas.preDate != this.defaultDate
                    && this.saveActionContentDatas.currDate != this.defaultDate
                    && this.saveActionContentDatas.faultTime != -1
                    && this.saveActionContentDatas.alarmCode != ''
                    && this.saveActionContentDatas.actionTitle != ''
                );
            }
        },

        getComfirmFlag() {
            let postDatas = {};
            if(this.checkSavePostDatas()) {
                postDatas = this.setSavePostDatas();
                if(this.checkTagDatas()) {
                    if(this.saveActionContentDatas.actionTypeId == 0 || this.saveActionContentDatas.actionTypeId == 2) {
                        this.$http.post(`/alarmview/data/detail/alarm/action/general/to`, postDatas).then((result) => {
                            this.actionReportSaveComfirmFlag = false;
                            this.actionReportDialogFlag = false;
                        }).catch((error) => {
                            this.$log.error(error);
                        })
                    } else if(this.saveActionContentDatas.actionTypeId == 1 || this.saveActionContentDatas.actionTypeId == 3) {
                        this.$http.post(`/alarmview/data/detail/alarm/action/to`, postDatas).then((result) => {
                            this.actionReportSaveComfirmFlag = false;
                            this.actionReportDialogFlag = false;
                        }).catch((error) => {
                            this.$log.error(error);
                        })
                    } else if(this.saveActionContentDatas.actionTypeId == 4) {
                        this.$http.post(`/alarmview/data/detail/alarm/action/fault/to`, postDatas).then((result) => {
                            this.actionReportSaveComfirmFlag = false;
                            this.actionReportDialogFlag = false;
                        }).catch((error) => {
                            this.$log.error(error);
                        })
                    }
                    this.searchBtnClick();
                }
                else {
                    this.$popmsg(this.$t(`postHistory.popMsg.checkTagDatas`));
                }
            }
            else {
                this.$popmsg(this.$t(`postHistory.popMsg.checkDataList`));
            }
        },
        getPrevDate(prevDate) {
            this.datas.prevTime = prevDate;
        },
        getCurrDate(currDate) {
            this.datas.currTime = currDate;
        },

        setPrevDate() {
            let nowDate = new Date()
            let dayOfMonth = nowDate.getDate()
            nowDate.setDate(dayOfMonth - 7);

            let month = '' + (nowDate.getMonth() + 1);
            let day = '' + nowDate.getDate();
            let year = nowDate.getFullYear();
            let prevDate = year + "-" + month + "-" + day;

            return prevDate;
        },

        setCurrDate() {
            let nowDate = new Date();
            let month = '' + (nowDate.getMonth() + 1);
            let day = '' + nowDate.getDate();
            let year = nowDate.getFullYear();
            let currDate = year + "-" + month + "-" + day;
            return currDate;
        },
        
        searchBtnClick() {
            let postDatas = {};
            this.sendDatas.historyListDatas = [];
            if(this.datas.prevTime != '' && this.datas.currTime != '') {
                postDatas['prevtime'] = this.datas.prevTime;
                postDatas['currtime'] = this.datas.currTime;
                if(this.datas.searchType != undefined && this.datas.searchContent != '') {
                    postDatas[this.datas.searchType] = this.datas.searchContent;
                }
                this.$http.post(`${this.baseUrl}/posthistory/data/search`, postDatas).then((result) => {
                    if(result.data.length > 0) {
                        for(let i = 0; i < result.data.length; i++){
                            result.data[i].time_stamp = result.data[i].time_stamp.split('T')[0];
                            if(result.data[i].tag != null && result.data[i].tag != '') {
                                result.data[i].tag = result.data[i].tag.split(',');
                            }
                        }
                        this.sendDatas.historyListDatas = result.data;
                    } else {
                        this.sendDatas.historyListDatas = [];
                    }
                }).catch((error) => {
                    this.$log.error(error);
                })
            } else {
                
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './posthistory';
</style>
