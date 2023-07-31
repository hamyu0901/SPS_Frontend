<template>
    <v-card class="gridTableWithDialogCard text-xs-center" elevation="0" :color="cardColor" v-bind="initialize">
        <v-card-title class="cardTitle" :style="ui.titleStyle">{{ui.titleName}}</v-card-title>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.text">{{ header.text }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr class="tdText" :ref="props.index" :key="props.index">
                    <td class="text-xs-center">{{ props.item['booth']}}</td>
                    <td class="text-xs-center">{{ props.item['zone']}}</td>
                    <td class="text-xs-center">{{ props.item['robot']}}</td>
                    <td class="text-xs-center">{{ props.item['alarmcode']}}</td>
                    <td class="text-xs-center">
                        <v-btn flat  @click="setDlg(props.item, props.index, true)">
                            {{ props.item['alarm'] }}
                        </v-btn>
                    </td>
                    <td class="text-xs-center">{{ props.item['timestamp']}}</td>                               
                    <td class="text-xs-center">
                            <v-btn flat icon slot="activator" @click="setDlg(props.item, props.index, false)">
                                <v-icon>{{iconView}}</v-icon>
                                {{ props.item['manual'] }}
                            </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1 pb-1">
                <v-pagination v-model="pagination.page" :length="pages"  :total-visible="7" :color="paginationColor" @input="onPageChange(itemNum, pagination.page)"></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
        <v-dialog class="alarmDlg" v-model='dialog' :width="ui.dialogWidth" persistent>
            <div v-if="isDetailView !== 3">
                <alarm-view-data
                    class="alarmViewData"
                    v-if="isDetailView === 0" 
                    v-bind:pieChartData="pieChartData" 
                    v-bind:alarmDesc="alarmDesc" 
                    v-bind:alarmStopData="alarmStopData"
                    v-bind:alarmInfoData="alarmInfoData"
                    v-on:closeFlag="closeDlg"
                ></alarm-view-data>
                <b001-alarm-dlg
                    v-if="isDetailView == 1"
                    v-bind:headerDatas="b001AlarmHeaderDatas"
                    v-bind:contentDatas="b001AlarmContentDatas"
                    v-bind:dialogFlag="dialog"
                    v-on:closeFlag="closeDlg"
                ></b001-alarm-dlg>
                <b002-alarm-dlg
                    v-if="isDetailView == 2"
                    v-bind:contentDatas="b002AlarmContentDatas"
                    v-bind:dialogFlag="dialog"
                    v-on:closeFlag="closeDlg"
                ></b002-alarm-dlg>
            </div>
            <div v-if="isDetailView === 3">
                <v-btn class="mt-2 ml-2" fab small fixed @click="closePdfDlg">
                    <v-icon>clear</v-icon>
                </v-btn>
                <pdf-view 
                    v-bind:pdfFile='pdfFile' 
                    v-bind:manualtype='manualtype'
                    v-on:closeDlg="closePdfDlg"
                ></pdf-view>
            </div>
        </v-dialog>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex';
import alarmViewData from '@/components/alarm/alarmview/alarmview/gridtablewithdialog/AlarmViewData';
import pdfView from '@/commons/PdfView'
import B001AlarmDlg from '@/components/alarm/alarmview/alarmview/gridtablewithdialog/B001AlarmDlg'
import B002AlarmDlg from '@/components/alarm/alarmview/alarmview/gridtablewithdialog/B002AlarmDlg'
export default {
    props: ['headerData' ,'contentData', 'highlightFlag'],
    components: {
        alarmViewData,
        pdfView,
        B001AlarmDlg,
        B002AlarmDlg
    },
    data() {
        return {
            ui: {
                titleName: this.$t(`alarmView.child.GridTableWithDialog.title`),
                closeDlg: this.$t(`alarmView.child.GridTableWithDialog.close`),
                titleStyle: null,
                tableHeaderStyle: null,
                dialogWidth: 0,
            },
            cardColor: ``,
            pagination: {
                values: 1,
                rowsPerPage: 18,
            },
            paginationColor: '#237ffe !important',
            pageNum: 0,
            itemNum: '',
            headers: [],
            datas: [],
            totalCount: 0,
            dialog: false,
            dialogWidth: '',
            pieChartData: [],
            alarmDesc: [],
            alarmStopData: [],
            isDetailView: 2,
            pdfFile: '',
            manualtype: 'alarm',
            alarmInfoData: '',
            b001AlarmHeaderDatas: [],
            b001AlarmContentDatas: [],
            b002AlarmHeaderDatas: [],
            b002AlarmContentDatas: []
        }
    },
    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos' 
        }),

        initialize() {
            this.getHeaderData();
            this.getContentData();
            this.calTotalCount();
        },

        pages() {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) 
            {
                return 0;
            }
            else {
                return Math.ceil(this.datas.length / this.pagination.rowsPerPage);
            }
        },

        iconView() {
            return 'file_copy';
        },
    },
    created() {
        
    },
    mounted() {
        this.initCSS();
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {

            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.cardColor = this.$style.common.tableCardBottomColor;
            document.documentElement.style.setProperty("--tableCardTopColor", this.$style.common.tableCardTopColor);
            document.documentElement.style.setProperty("--tableTheadBackgroundColor", this.$style.common.tableTHeadBGColor);
            document.documentElement.style.setProperty("--tableTheadBorderBottomColor", this.$style.common.tableTHeadBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBackgroundColor", this.$style.common.tableTBodyOddBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBorderBottomColor", this.$style.common.tableTBodyOddBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBackgroundColor", this.$style.common.tableTBodyEvenBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBorderBottomColor", this.$style.common.tableTBodyEvenBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrBackgroundColor", this.$style.common.tableTBodyHoverColor);
            document.documentElement.style.setProperty("--tableTBodyPaginationItem", this.$style.common.tablePaginationColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.home.boothMonitoringCardItemTdColor);
            document.documentElement.style.setProperty("--convert", this.$style.home.tableMaintenanceShowDetailTextColor);
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.tableTBodyBBColor);
            document.documentElement.style.setProperty("--gridTableWithDialogCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        initCSS() {
            $("table.v-table tbody tr td").css("background-color", this.$style.alarm.gridTableWithDialogItemTableBackgroundColor);
        },
        initDataTable() {
            this.datas = [];  
        },

        initBindDatas() {
            this.pieChartData = [];
            this.alarmDesc = [];
            this.alarmStopData = [];
            this.alarmInfoData = '';
            this.b001AlarmHeaderDatas = [];
            this.b001AlarmContentDatas = [];
            this.b002AlarmHeaderDatas = [];
            this.b002AlarmContentDatas = [];
        },

        getHeaderData() {
            if (this.headerData.length != 0) {
                this.headers = this.headerData;
            }
        },

        getContentData() {
            if (this.contentData.length != 0) {
                this.datas = this.contentData;
            } else {
                this.initDataTable();
            }
        },

        calTotalCount() {
            if (this.datas.length > 0) {
                this.totalCount = this.datas.length;
            } else {
                this.totalCount = 0;
            }
        },

        onPageChange(itemNum, pageNum) {  
            if(this.getTheme == true) {
                for (let i = 0; i <Object.keys(this.$refs).length; i++) {
                    if (i % 2 == 0) {
                        if(this.$refs[Object.keys(this.$refs)[i]].style != undefined) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemOddBackgroundColor;
                        }
                    } 
                    else {
                        if(this.$refs[Object.keys(this.$refs)[i]].style != undefined) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemEvenBackgroundColor;
                        }
                    }
                }
            }
        },

        setDlg(obj, idx, flag) {
            if (flag == true) {
                if(obj.alarmcode == 'B001' || obj.alarmcode =='B002') {
                    this.getB00Datas(obj);
                } else {
                    this.isDetailView = 0;
                    this.getPieChartData(obj.alarmcode, obj.timestamp); 
                    this.getAlarmDesc(obj.alarmcode, obj.alarmid);
                    this.getAlarmStopData(obj.alarmstatus, obj.alarmcode, obj.booth, obj.zone, obj.timestamp); 
                    this.alarmInfoData = obj;
                }
                this.ui.dialogWidth = "1700px";
            }
            else {
                this.isDetailView = 3;
                this.pdfFile = '';
                this.pdfFile = obj.alarmcode;
                this.ui.dialogWidth = "850px";
            }
            this.dialog = true;
        },
        
        getPieChartData(alarmCode, alarmOccurTime) {
            this.pieChartData = [];
            let postDatas = {
                alarmcode: alarmCode,
                factoryid: this.getFactoryId,
                selectdate: alarmOccurTime,
            }
            this.$http.post(`${this.baseUrl}/alarmview/data/detail/chart`, postDatas).then((result) => {
                if (result.data == '') {
                    this.$popmsg(this.$t(`alarmView.child.GridTableWithDialog.popMsg.alarmDataChart`));
                }
                else {
                    for (let idx = 0; idx < result.data.length; ++idx) {
                        this.pieChartData.push({
                            count: result.data[idx].count,
                            zonename: result.data[idx].name,
                        });
                    }
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        getAlarmDesc(alarmCode, alarmId) {
            let postDatas = {
                alarmid: alarmId,
            }
            this.$http.post(`${this.baseUrl}/alarmview/data/detail/info`, postDatas).then((result) => {
                if (result.data == '') {
                    this.$popmsg(this.$t(`alarmView.child.GridTableWithDialog.popMsg.alarmDataInfo`));
                }
                else {
                    let detailInfoData = {};
                    detailInfoData = result.data[0];
                    this.requestAlarmDataScript(detailInfoData);
                }
            }).catch((error) => {

            })
        },

        requestAlarmDataScript(detailInfoData) {
            let postDatas = {
                alarmcode: detailInfoData.alarm_code,
                alarmtype: detailInfoData.alarm_type
            }
          
            this.$http.post(`${this.baseUrl}/alarmview/data/detail/manual`, postDatas).then((result) => {
                if (result.data == '') {
                    this.alarmDesc = [];
                    this.alarmDesc[0] = detailInfoData;
                    this.$popmsg(this.$t(`alarmView.child.GridTableWithDialog.popMsg.alarmManual`));
                }
                else {
                    this.alarmDesc = result.data;
                    this.alarmDesc[0]['job_name'] = detailInfoData.job_name;
                    this.alarmDesc[0]['line_no'] = detailInfoData.line_no;
                    this.alarmDesc[0]['step_no'] = detailInfoData.step_no;
                    this.alarmDesc[0]['sub_code_info'] = detailInfoData.sub_code_info;
                    this.alarmDesc[0]['alarm_type'] = detailInfoData.alarm_type;
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        getAlarmStopData(alarmStatus, alarmCode, booth, zone, date) {
            this.$http.post(`${this.baseUrl}/info/boothid`, { boothname: booth }).then((result) => {
                if (result.data == '') {
                    this.$popmsg(this.$t(`alarmView.child.GridTableWithDialog.popMsg.reqBoothId`));
                }
                else {
                    booth = result.data[0].booth_id;
                    this.$http.post(`${this.baseUrl}/info/zoneid`, { zonename: zone }).then((result) => {
                        if (result.data == '') {
                            this.$popmsg(this.$t(`alarmView.child.GridTableWithDialog.popMsg.reqZoneId`));
                        }
                        else {
                            zone = result.data[0].zone_id;
                            date = date.split(' ');
                            let postDatas = {
                                alarmcode: alarmCode,
                                alarmstatus: alarmStatus,
                                boothid: booth,
                                zoneid: zone,
                                selectdate: date[0]
                            }
                            this.$http.post(`${this.baseUrl}/alarmview/data/detail/alarmstop`, postDatas).then((result) => {
                                if (result.data == '') {
                                    this.alarmStopData = [];
                                    this.$popmsg(this.$t(`alarmView.child.GridTableWithDialog.popMsg.alarmStop`));
                                }
                                else {
                                    this.alarmStopData = result.data;
                                }
                            }).catch((error) => {
                                this.$log.error(error);
                            })
                        }
                    }).catch((error) => {
                        this.$log.error(error);
                    })
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        getB00Datas(alarmDatas) {
            let postDatas = {};
            let boothInfo = '';
            let zoneInfo = '';
            let robotInfo = '';
            this.b001AlarmHeaderDatas = [];
            this.b001AlarmContentDatas = [];
            this.b002AlarmHeaderDatas = [];
            this.b002AlarmContentDatas = [];
        
            boothInfo = this.getBoothId(alarmDatas.booth);
            zoneInfo = this.getZoneId(alarmDatas.zone, boothInfo.id);
            robotInfo = this.getRobotId(alarmDatas.robot, zoneInfo.id);

            postDatas['robotid'] = robotInfo.id;
            postDatas['prevtime'] = alarmDatas.occur_time.split('.')[0];
            postDatas['currtime'] = alarmDatas.timestamp.split('.')[0];

            if(alarmDatas.alarmcode == 'B001') {
                this.isDetailView = 1;
                this.$http.post(`${this.baseUrl}/alarmview/data/detail/backup/compare/time`, postDatas).then((result) => {
                if (result.data != '') {
                    this.b001AlarmHeaderDatas.push({id: 'prevtime', text: alarmDatas.occur_time.split('.')[0].split(' ')[0], value: 'a_file'});
                    this.b001AlarmHeaderDatas.push({id: 'currtime', text: alarmDatas.timestamp.split('.')[0].split(' ')[0], value: 'b_file'});
                    this.b001AlarmContentDatas = result.data;
                }
                else {
                    this.$popmsg(this.$t(`alarmView.child.GridTableWithDialog.popMsg.alarmCompareTime`));
                }
                }).catch((error) => {
                    this.$log.error(error);
                })
            } 
            else {
                this.isDetailView = 2;
                this.$http.post(`${this.baseUrl}/alarmview/data/detail/backup/compare/file`, postDatas).then((result) => {
                if (result.data != '') {
                    this.b002AlarmContentDatas = result.data;
                }
                else {
                    this.$popmsg(this.$t(`alarmView.child.GridTableWithDialog.popMsg.alarmCompareFile`));
                }
                }).catch((error) => {
                    this.$log.error(error);
                })
            }
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

        closeDlg() {
            this.initBindDatas();
            this.dialog = false;
        },

        closePdfDlg() {
            this.dialog = false;
            this.pdfFile = '';
        }

    }
}
</script>

<style scoped lang="scss">
    @import './gridtablewithdialog';
</style>