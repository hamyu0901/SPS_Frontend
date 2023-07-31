<template>
    <v-card 
        elevation="0"
        :color="ui.cardColor"
        v-bind="[initRender, printAlarmDesc, getDatePeriod]"
    >
        <v-card-title class="pb-2" v-bind:style="ui.titleStyle">{{ui.title}}</v-card-title>
        <v-layout column>
            <v-layout>
                <v-flex lg6 class="pr-2 pl-2">
                    <v-card class="cardArea">
                        <v-card-title class="justify-center cardTitle">{{ui.alarmDescTitle}}</v-card-title>
                        <v-textarea
                            box
                            class="alarmDesc"
                            :height="'323'"
                            :label="ui.alarmDesc"
                            :value="datas.alarmDesc"
                            :readonly="true"
                        ></v-textarea>
                    </v-card>     
                </v-flex>
                <v-flex lg6 class="pr-2 pl-2">
                    <action-list
                        v-bind:actionListDatas="datas.actionListDatas"
                        v-bind:alarmId="alarmInfoData.alarmid"
                        v-on:actionReportAddFlag="getActionReportAddFlag"
                    ></action-list>
                </v-flex>
            </v-layout>
            <v-layout class="pt-2">
                <v-flex lg4 class="pr-2 pl-2">
                    <v-card class="cardArea">
                        <v-card-title class="justify-center cardTitle">
                            <v-layout class="subTitleContent" column>
                                <div>{{ui.alarmPieChart}}</div>
                                <div>{{ui.datePeriod}}</div>
                            </v-layout>
                        </v-card-title>
                        <alarm-view-data-pie-chart
                            v-bind:chartId="'alarmViewDataPieChart'"
                            v-bind:chartHeight="ui.height"
                            v-bind:chartDatas="pieChartData"
                        ></alarm-view-data-pie-chart>
                    </v-card>
                </v-flex>
                <v-flex lg8 class="pr-2 pl-2">
                    <v-card class="cardArea">
                        <v-card-title class="justify-center cardTitle">
                            <v-layout class="subTitleContent" column>
                                <div>{{ui.alarmMixedChart}}</div>
                                <div>{{ui.datePeriod}}</div>
                            </v-layout>
                        </v-card-title>
                        <alarm-view-data-mixed-chart
                            v-bind:chartId="'alarmViewDataMixedChart'"
                            v-bind:chartHeight="ui.height"
                            v-bind:chartDatas="alarmStopData"
                        ></alarm-view-data-mixed-chart>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-dialog v-model="actionReportDialogFlag" width='1000px' persistent>
            <v-card class="cardArea">
                <v-card-title class="justify-center cardTitle">
                    <span>{{ui.actionReportTitle}}</span>
                </v-card-title>
                <action-report
                    class="pt-3 pr-3 pb-3 pl-3"
                    v-bind:alarmInfoData="alarmInfoData"
                    v-bind:actionReportDialogFlag="actionReportDialogFlag"
                    v-bind:actionReportSaveFlag="actionReportSaveFlag"
                    v-bind:actionReportApplySite="'alarmview'"
                    v-on:saveActionContentDatas="getSaveActionContentDatas"
                ></action-report>
                <v-layout>
                    <v-spacer/>
                    <v-btn class="dialogBtn buttonItem mr-1" @click="saveBtn">
                        {{ui.saveText}}
                    </v-btn>
                    <v-btn class="dialogBtn buttonItem ml-1" @click="actionReportDialogFlag = false">
                        {{ui.closeText}}
                    </v-btn>
                </v-layout>
            </v-card>
        </v-dialog>
        <comfirm-dlg
            v-bind:comfirmDlgType="'save'"
            v-bind:comfirmDlgFlag="actionReportSaveComfirmFlag"
            v-on:comfirmFlag="getComfirmFlag"
            v-on:closeFlag="getActionReportComfirmCloseFlag"
        ></comfirm-dlg>
        <v-card-actions>
            <v-spacer/>
            <v-btn class="buttonItem" @click="closeDlg">
                {{ui.closeText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex';
import AlarmViewDataPieChart from '@/components/alarm/alarmview/alarmview/gridtablewithdialog/alarmviewdata/AlarmViewDataPieChart'
import AlarmViewDataMixedChart from '@/components/alarm/alarmview/alarmview/gridtablewithdialog/alarmviewdata/AlarmViewDataMixedChart'
import ActionList from '@/components/alarm/alarmview/alarmview/gridtablewithdialog/alarmviewdata/ActionList'
import ActionReport from '@/commons/ActionReport'
import ComfirmDlg from '@/commons/ComfirmDlg'
export default {
    props: ['pieChartData','alarmDesc', 'alarmStopData', 'alarmInfoData'],
    components: {
        AlarmViewDataPieChart,
        AlarmViewDataMixedChart,
        ActionList,
        ActionReport,
        ComfirmDlg
    },
    data() {
        return {
            actionReportDialogFlag: false,
            actionReportSaveFlag: false,
            actionReportSaveComfirmFlag: false,
            ui: {
                title:              this.$t(`alarmView.child.alarmViewData.title`),
                close:              this.$t(`alarmView.child.alarmViewData.close`),
                booth:              this.$t(`alarmView.child.alarmViewData.booth`),
                zone:               this.$t(`alarmView.child.alarmViewData.zone`),
                robot:              this.$t(`alarmView.child.alarmViewData.robot`),
                alarmPieChart:      this.$t(`alarmView.child.alarmViewData.alarmPieChart`),
                alarmDescTitle:     this.$t(`alarmView.child.alarmViewData.alarmDescTitle`),
                alarmDesc:          '',
                alarmMixedChart:    this.$t(`alarmView.child.alarmViewData.alarmMixedChart`),
                actionReportTitle:  this.$t(`alarmView.child.alarmViewData.actionReportTitle`),
                saveText:           this.$t(`alarmView.child.alarmViewData.save`),
                closeText:          this.$t(`alarmView.child.alarmViewData.close`),
                condition:          true,
                none:               this.$t(`alarmView.child.alarmViewData.none`),
                cardColor:          "",
                datePeriod:         "",
                height:             300,
                titleStyle:         null
            },
            datas: {
                booth: '',
                zone: '',
                robot: '',
                alarmDesc: '',
                inspData: '',
                actionListDatas: []
            },
            alarmDescription : {
                alarmcode:          this.$t(`alarmView.child.alarmViewData.alarmDescription.alarmCode`),
                alarmname:          this.$t(`alarmView.child.alarmViewData.alarmDescription.alarmName`),
                alarmcontents:      this.$t(`alarmView.child.alarmViewData.alarmDescription.alarmContents`),
                cause:              this.$t(`alarmView.child.alarmViewData.alarmDescription.cause`),
                contents:           this.$t(`alarmView.child.alarmViewData.alarmDescription.contents`),
                meaning:            this.$t(`alarmView.child.alarmViewData.alarmDescription.meaning`),
                remedy:             this.$t(`alarmView.child.alarmViewData.alarmDescription.remedy`),
                subcode:            this.$t(`alarmView.child.alarmViewData.alarmDescription.subcode`),
                subcodeinfo:        this.$t(`alarmView.child.alarmViewData.alarmDescription.subcodeinfo`),
                processinfo:        this.$t(`alarmView.child.alarmViewData.alarmDescription.processinfo`),
                occurtime:          this.$t(`alarmView.child.alarmViewData.alarmDescription.occurtime`),
                endtime:            this.$t(`alarmView.child.alarmViewData.alarmDescription.endtime`),
                jobname:            this.$t(`alarmView.child.alarmViewData.alarmDescription.jobname`),
                lineno:             this.$t(`alarmView.child.alarmViewData.alarmDescription.lineno`),
                stepno:             this.$t(`alarmView.child.alarmViewData.alarmDescription.stepno`)
            },
            saveActionContentDatas: {},
            datacollections: null
        }
    },
    computed: {
        ...mapGetters ({
                baseUrl: 'getBaseUrl',
                getTheme: 'getTheme',
                getFactoryId: 'getFactoryId',
        }),

        initRender() {
            this.ui.title = "";
            if(this.alarmInfoData != '') {
                this.ui.title += "  [" + this.alarmInfoData.alarm + "]";
                this.getActionlistDatas(this.alarmInfoData);
            }
        },

        printAlarmDesc() {
            let result = '';
            let dataStr = '';
            if (this.alarmDesc.length > 0) {
                if(this.alarmDesc[0].alarm_type == 0) {
                    for (let idx = 0; idx < this.alarmDesc.length; ++idx) {
                        dataStr = this.alarmDescription.alarmcode + " : ";
                        dataStr += "  " + this.alarmDesc[idx].alarm_code + "\n";
                        dataStr += this.alarmDescription.alarmname + " : ";
                        dataStr += "  " + this.alarmDesc[idx].alarm_name + "\n";
                        dataStr += this.alarmDescription.subcode + " : ";
                        dataStr += "  " + this.alarmDesc[idx].sub_code + "\n";
                        dataStr += this.alarmDescription.subcodeinfo + " : ";
                        if(this.alarmDesc[idx].sub_code_info != null) {
                            dataStr += "  " + this.alarmDesc[idx].sub_code_info + "\n";
                        }else {
                            dataStr += this.ui.none +"\n";
                        }
                        dataStr += this.alarmDescription.processinfo + " : ";
                        dataStr += "  " + this.alarmInfoData.booth + "-" + this.alarmInfoData.zone + "-"+ this.alarmInfoData.robot + "\n";
                        dataStr += this.alarmDescription.lineno + " : ";
                        dataStr += "  " + this.alarmDesc[idx].line_no + "\n";
                        dataStr += this.alarmDescription.stepno + " : ";
                        dataStr += "  " + this.alarmDesc[idx].step_no + "\n";
                        dataStr += this.alarmDescription.occurtime + " : ";
                        dataStr += "  " + this.alarmInfoData.timestamp + "\n";
                        dataStr += this.alarmDescription.endtime + " : ";
                        if(this.alarmInfoData.occur_time != 'null' && this.alarmInfoData.occur_time != undefined) {
                            dataStr += "  " + this.alarmInfoData.occur_time + "\n";
                        }else {
                            dataStr += this.ui.none +"\n";
                        }
                        dataStr += "-------------------------------------------------------\n";
                        dataStr += this.alarmDescription.cause + " : ";
                        dataStr += "  " + this.alarmDesc[idx].cause + "\n";
                        dataStr += this.alarmDescription.contents + " : ";
                        dataStr += "  " + this.alarmDesc[idx].contents + "\n";
                        dataStr += this.alarmDescription.meaning + " : ";
                        dataStr += "  " + this.alarmDesc[idx].meaning + "\n";
                        dataStr += this.alarmDescription.remedy + " : ";
                        dataStr += "  " + this.alarmDesc[idx].remedy + "\n";
                        dataStr += "\n-------------------------------------------------------\n";
                        result += dataStr;
                    }
                } else {
                    for(let idx = 0; idx < this.alarmDesc.length; ++idx) {
                        dataStr = this.alarmDescription.alarmcode + " : ";
                        dataStr += "  " + this.alarmInfoData.alarmcode + "\n";
                        dataStr += this.alarmDescription.alarmname + " : ";
                        dataStr += "  " + this.alarmInfoData.alarm + "\n";
                        dataStr += this.alarmDescription.subcode + " : ";
                        dataStr += this.ui.none + "\n";
                        dataStr += this.alarmDescription.subcodeinfo + " : ";
                        if(this.alarmDesc[idx].sub_code_info != null && this.alarmDesc[idx].sub_code_info != '') {
                            dataStr += "  " + this.alarmDesc[idx].sub_code_info + "\n";
                        }else {
                            dataStr += this.ui.none +"\n";
                        }
                        dataStr += this.alarmDescription.processinfo + " : ";
                        if(this.alarmInfoData.robot != null) {
                            dataStr += "  " + this.alarmInfoData.booth + "-" + this.alarmInfoData.zone + "-"+ this.alarmInfoData.robot + "\n";    
                        } else {
                             dataStr += "  " + this.alarmInfoData.booth + "-" + this.alarmInfoData.zone + "\n";
                        }
                        dataStr += this.alarmDescription.lineno + " : ";
                        if(this.alarmDesc[idx].line_no != null) {
                            dataStr += "  " + this.alarmDesc[idx].line_no + "\n";
                        } else {
                            dataStr += this.ui.none +"\n";
                        }
                        dataStr += this.alarmDescription.stepno + " : ";
                        if(this.alarmDesc[idx].line_no != null) {
                            dataStr += "  " + this.alarmDesc[idx].step_no + "\n";
                        } else {
                            dataStr += this.ui.none +"\n";
                        }
                        dataStr += this.alarmDescription.occurtime + " : ";
                        dataStr += "  " + this.alarmInfoData.timestamp + "\n";
                        dataStr += this.alarmDescription.endtime + " : ";
                        if(this.alarmInfoData.endtime != null) {
                            dataStr += "  " + this.alarmInfoData.endtime + "\n";
                        }
                        else {
                            dataStr += this.ui.none +"\n";
                        }
                        dataStr += "-------------------------------------------------------\n";
                        dataStr += this.alarmDescription.cause + " : ";
                        if(this.alarmDesc[idx].cause != null) {
                            dataStr += "  " + this.alarmDesc[idx].cause + "\n";
                        } else {
                            dataStr += this.ui.none + "\n";
                        }
                        dataStr += this.alarmDescription.alarmcontents + " : ";
                        if(this.alarmDesc[idx].message != null) {
                            dataStr += "  " + this.alarmDesc[idx].message + "\n";
                        }
                        else {
                            dataStr += this.ui.none + "\n";
                        }
                        dataStr += this.alarmDescription.remedy + " : ";
                        if(this.alarmDesc[idx].remedy != null) {
                            dataStr += "  " + this.alarmDesc[idx].remedy + "\n";
                        } else {
                            dataStr += this.ui.none + "\n";
                        }
                        dataStr += "\n-------------------------------------------------------\n";
                        result += dataStr;
                    }
                }
            }
            else {
                result = this.$t(`alarmView.child.alarmViewData.emptyDesc`);
            }
            this.datas.alarmDesc = result;
        },

        getDatePeriod() {
            let weekDate = [];
            let labels = [];
            if (this.alarmStopData.length > 0) {
                weekDate = this.setDefaultDate(this.alarmStopData);
                if(weekDate !== undefined && weekDate.length > 0) {
                    this.ui.datePeriod = weekDate[0] + ' ~ ' + weekDate[weekDate.length-1];
                } else {
                    this.ui.datePeriod = "";
                }
            } 
        }
        
    },
    created() {
        this.initializeStyle();
    },
    mounted() {
        
    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.cardColor = this.$style.alarm.alarmViewDataItemCardBackgroundColor;
            
            document.documentElement.style.setProperty("--cardItemBorderColor", this.$style.common.cardItemBorderColor);
            document.documentElement.style.setProperty("--cardAreaBackgroundColor", this.$style.alarm.alarmViewDataItemCardBackgroundColor);
            document.documentElement.style.setProperty("--cardTitleBackgroundColor", this.$style.alarm.alarmViewDataItemCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--alarmDescBackgroundColor", this.$style.alarm.alarmViewDataItemAlarmDescBackgroundColor);
            document.documentElement.style.setProperty("--alarmDescColor", this.$style.alarm.alarmViewDataItemAlarmDescColor);
            document.documentElement.style.setProperty("--buttonItemBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemColor", this.$style.common.buttonItemColor);
        },
        getActionReportAddFlag() {
            this.actionReportDialogFlag = true;
        },

        saveBtn() {
            this.actionReportSaveFlag = true;
        },

        getActionlistDatas(alarmInfoData) {
            this.datas.actionListDatas = [];
            let postDatas = {};
            postDatas['alarmid'] = alarmInfoData.alarmid;
            postDatas['alarmcode'] = alarmInfoData.alarmcode;
            postDatas['actiontype'] = 1;
            this.$http.get(`${this.baseUrl}/alarmview/data/detail/alarm/action/from`, {
                params: postDatas
            }).then((result) => {
                if(result.data.length > 0) {
                    for(let i = 0; i < result.data.length; i++) {
                        result.data[i].time_stamp = result.data[i].time_stamp.split('T')[0];
                        if(result.data[i].tag != null && result.data[i].tag != '') {
                            result.data[i].tag = result.data[i].tag.split(',');
                        }
                    }
                    this.datas.actionListDatas = result.data;
                }
            }).catch((error) => {
                this.$log.error(error);
            })
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

        getComfirmFlag() {
            let postDatas = {};
            let tempTags = '';
            if(this.saveActionContentDatas.actionTypeId == 0 || this.saveActionContentDatas.actionTypeId == 2) {
                if(this.saveActionContentDatas.actionContent != '' 
                && this.saveActionContentDatas.actionTitle != ''
                && this.saveActionContentDatas.actionTypeId >= 0 
                && this.saveActionContentDatas.userId != '')
                {
                    postDatas['remedymessage'] = this.saveActionContentDatas.actionContent;
                    postDatas['actiontitle'] = this.saveActionContentDatas.actionTitle;
                    postDatas['userid'] = this.saveActionContentDatas.userId;
                    postDatas['actiontype'] = this.saveActionContentDatas.actionTypeId;
                    if(this.saveActionContentDatas.actionTag.length != 0) {
                        for(let i = 0; i < this.saveActionContentDatas.actionTag.length; i++) {
                            if(i < this.saveActionContentDatas.actionTag.length - 1) {
                                tempTags += this.saveActionContentDatas.actionTag[i] + '-';
                            } else {
                                tempTags += this.saveActionContentDatas.actionTag[i];
                            }
                        }
                        postDatas['tags'] = tempTags;
                    }
                    this.$http.post(`${this.baseUrl}/alarmview/data/detail/alarm/action/general/to`, postDatas).then((result) => {
                        this.actionReportSaveComfirmFlag = false;
                        this.actionReportDialogFlag = false;
                    }).catch((error) => {
                        this.$log.error(error);
                    })
                } else {
                    this.$popmsg(this.$t(`alarmView.child.alarmViewData.popMsg.getComfirmFlag`));
                }
            } else if(this.saveActionContentDatas.actionTypeId == 1 || this.saveActionContentDatas.actionTypeId == 3) {
                if(this.saveActionContentDatas.actionContent != '' 
                && this.saveActionContentDatas.alarmCode != ''
                && this.saveActionContentDatas.actionTitle != ''
                && this.saveActionContentDatas.actionTypeId >= 0
                && this.saveActionContentDatas.userId != '')
                {
                    postDatas['remedymessage'] = this.saveActionContentDatas.actionContent;
                    postDatas['actiontitle'] = this.saveActionContentDatas.actionTitle;
                    postDatas['userid'] = this.saveActionContentDatas.userId;
                    postDatas['alarmcode'] = this.saveActionContentDatas.alarmCode;
                    postDatas['actiontype'] = this.saveActionContentDatas.actionTypeId;
                    if(this.saveActionContentDatas.actionTag.length != 0) {
                        for(let i = 0; i < this.saveActionContentDatas.actionTag.length; i++) {
                            if(i < this.saveActionContentDatas.actionTag.length - 1) {
                                tempTags += this.saveActionContentDatas.actionTag[i] + '-';
                            } else {
                                tempTags += this.saveActionContentDatas.actionTag[i];
                            }
                        }
                        postDatas['tags'] = tempTags;
                    }
                    this.$http.post(`${this.baseUrl}/alarmview/data/detail/alarm/action/to`, postDatas).then((result) => {
                        this.actionReportSaveComfirmFlag = false;
                        this.actionReportDialogFlag = false;
                        this.getActionlistDatas(this.alarmInfoData);
                    }).catch((error) => {
                        this.$log.error(error);
                    })
                } else {
                     this.$popmsg(this.$t(`alarmView.child.alarmViewData.popMsg.getComfirmFlag`));
                }
            } else if(this.saveActionContentDatas.actionTypeId == 4) {
                if(this.saveActionContentDatas.actionContent != ''
                && this.saveActionContentDatas.actionRemedy != ''
                && this.saveActionContentDatas.boothid != ''
                && this.saveActionContentDatas.zoneid != ''
                && this.saveActionContentDatas.preDate != ''
                && this.saveActionContentDatas.currDate != ''
                && this.saveActionContentDatas.faultTime != ''
                && this.saveActionContentDatas.alarmCode != ''
                && this.saveActionContentDatas.actionTitle != ''
                && this.saveActionContentDatas.actionTypeId >= 0 
                && this.saveActionContentDatas.userId != '')
                {
                    postDatas['remedymessage'] = this.saveActionContentDatas.actionRemedy;
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
                    postDatas['actiontitle'] = this.saveActionContentDatas.actionTitle;
                    postDatas['userid'] = this.saveActionContentDatas.userId;
                    postDatas['alarmcode'] = this.saveActionContentDatas.alarmCode;
                    postDatas['actiontype'] = this.saveActionContentDatas.actionTypeId;
                    if(this.saveActionContentDatas.actionTag.length != 0) {
                        for(let i = 0; i < this.saveActionContentDatas.actionTag.length; i++) {
                            if(i < this.saveActionContentDatas.actionTag.length - 1) {
                                tempTags += this.saveActionContentDatas.actionTag[i] + '-';
                            } else {
                                tempTags += this.saveActionContentDatas.actionTag[i];
                            }
                        }
                        postDatas['tags'] = tempTags;
                    }
                    this.$http.post(`${this.baseUrl}/alarmview/data/detail/alarm/action/fault/to`, postDatas).then((result) => {
                        this.actionReportSaveComfirmFlag = false;
                        this.actionReportDialogFlag = false;
                    }).catch((error) => {
                        this.$log.error(error);
                    })
                } else {
                     this.$popmsg(this.$t(`alarmView.child.alarmViewData.popMsg.getComfirmFlag`));
                }
            }
        },

        getActionReportComfirmCloseFlag() {
            this.actionReportSaveComfirmFlag = false;
        },

        setDefaultDate(alarmInfoData) {
            let selectedDate = new Date(alarmInfoData[alarmInfoData.length-1].time_stamp.split('T')[0]);
            let year = selectedDate.getFullYear();
            let month = selectedDate.getMonth();
            let date = selectedDate.getDate();
            let weekDate = [];

            for(let i=0; i<7; i++) {
            let resultDay = new Date(year, month, date-i);
            let yyyy = resultDay.getFullYear();
            let mm = Number(resultDay.getMonth()) + 1;
            let dd = resultDay.getDate();
            
            mm = String(mm).length === 1 ? '0' + mm : mm;
            dd = String(dd).length === 1 ? '0' + dd : dd;
            
            weekDate[i] = yyyy + '-' + mm + '-' + dd;
            }
            
            return weekDate.reverse();
 
        },

        closeDlg() {
            this.$emit('closeFlag');
        }

    }
}
</script>

<style scoped lang="scss">
    @import './alarmviewdata';
</style>
