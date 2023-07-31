<template>
    <v-card class="alarmListTableCard text-xs-center" elevation="0" :color="cardColor" v-bind="initialize">
        <v-card-title class="cardTitle" v-bind:style="ui.titleStyle">
            {{ui.alarmListTableTitle}}
            <a class="convert" @click="convertClicked">{{'['+ui.detailShowText+']'}}</a>
        </v-card-title>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
        >
            <template slot="headers" >
                <tr>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center" v-for="header in headers" :key="header.id">{{ header.title }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" :key="props.index" @click="setDlg(props.item, true)">
                    <td class="text-xs-center tdText" v-for="header in headers" :key="header.id">
                        {{ props.item[header.id] }}
                    </td>
                </tr> 
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1">
                <v-pagination  v-model="pagination.page" :length="pages"  :total-visible="7" :color="paginationColor"></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
        <v-dialog class="alarmDlg" v-model='dialog' width='1700px' persistent>
            <alarm-view-data
                class="alarmViewData"
                v-if="isDetailView === 0" 
                v-bind:pieChartData="pieChartData" 
                v-bind:alarmDesc="alarmDesc" 
                v-bind:alarmStopData="alarmStopData"
                v-bind:alarmInfoData="alarmInfoData"
                v-on:alarmViewDialogClosed='alarmViewDialogClosed'
                v-on:closeFlag="dialog=false"
            ></alarm-view-data>
            <b001-alarm-dlg
                v-if="isDetailView == 1"
                v-bind:headerDatas="b001AlarmHeaderDatas"
                v-bind:contentDatas="b001AlarmContentDatas"
                v-bind:dialogFlag="dialog"
            ></b001-alarm-dlg>
            <b002-alarm-dlg
                v-if="isDetailView == 2"
                v-bind:contentDatas="b002AlarmContentDatas"
                v-bind:dialogFlag="dialog"
            ></b002-alarm-dlg>
            <div v-if="isDetailView === 3">
                <pdf-view 
                    v-bind:pdfFile='pdfFile' 
                    v-bind:manualtype='manualtype'
                ></pdf-view>
            </div>
        </v-dialog>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import alarmViewData from '../../../components/alarm/alarmview/alarmview/gridtablewithdialog/AlarmViewData.vue';
import B001AlarmDlg from '../../../components/alarm/alarmview/alarmview/gridtablewithdialog/B001AlarmDlg.vue'
import B002AlarmDlg from '../../../components/alarm/alarmview/alarmview/gridtablewithdialog/B002AlarmDlg.vue'
export default {
    components: {alarmViewData, B001AlarmDlg, B002AlarmDlg},
    props: ['headerDatas', 'contentDatas', 'highlightFlag'],
    data() {
        return {
            ui: {
                alarmListTableTitle: this.$t(`home.child.alarmListTable.alarmListTableTitle`),
                detailShowText: this.$t(`home.showDetailPage`),
                closeDlg: this.$t(`alarmView.child.GridTableWithDialog.close`),
                titleStyle: null,
                tableHeaderStyle: null
            },
            titleObject: {
                
            },
            headers: [],
            datas: [],
            dialog: false,
            pieChartData: [],
            alarmDesc: [],
            alarmStopData: [],
            isDetailView: 2,
            cardColor: '',
            pagination: {
                values: 1,
                rowsPerPage: 4,
            },
            paginationColor: '#237ffe !important',
            pageNum: 0,
            itemNum: '',
            totalCount: 0,
            alarmInfoData: '',
            b001AlarmHeaderDatas: [],
            b001AlarmContentDatas: [],
            b002AlarmHeaderDatas: [],
            b002AlarmContentDatas: []
        }
    },
    mounted() {
        this.initDatas();
        this.initializeStyle();
    },
    computed: {
        ...mapGetters({
            getTheme: 'getTheme',
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos' 
        }),
        initialize() {
            this.getHeaderDatas();
            this.getContentDatas();
            this.calTotalCount();
        },
        pages () {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
                return 0;
            }
            else {
                return Math.ceil(this.datas.length / this.pagination.rowsPerPage);
            }
        }
    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.cardColor = this.$style.common.tableCardBottomColor;

            document.documentElement.style.setProperty("--alarmListTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        getHeaderDatas() {
            if(this.headerDatas.length != 0) {
                this.headers = this.headerDatas;
            }
        },
        getContentDatas() {
            if(this.contentDatas.length != 0) {
                this.datas = this.contentDatas;
                if(this.datas.length % this.pagination.rowsPerPage != 0) {
                    this.insertTempDatas();
                }
            }
            else {
                this.datas = [];
                this.initDatas();
            }
        },
        calTotalCount() {
            let index = 0;
            if(this.datas.length == 0) {    
                this.totalCount = 0;
            } 
            else {
                for(let i = 0; i < this.datas.length; i++) {
                    if(this.datas[i][this.headers[0].id] == '') {
                        index++;
                    }
                }
                this.totalCount = this.datas.length - index;
            }
        },
        initDatas() {
            for(let i = 0; i < this.pagination.rowsPerPage; i++) {
                this.datas.push({process_info: '', time_stamp: '', alarm_code: '', alarm_type: '', alarm_content: ''});
            }
        },
        insertTempDatas() {
            let tempDatas = {};
            let tempIndex = this.pagination.rowsPerPage - (this.datas.length % this.pagination.rowsPerPage);
            
            for(let i = 0; i < tempIndex; i++) {
                for(let j = 0; j < this.headerDatas.length; j++) {
                    tempDatas[this.headerDatas[j].id] = '';
                }
                this.datas.push(tempDatas);
            }
        },
        switchClicked () {
            this.$router.push('/sps/alarmview');
        },
        itemClicked(rowData, pageNum) {
            if(this.totalCount != 0) {
                this.pageNum = pageNum;
                if(this.highlightFlag == true && rowData.item.process_info != '') {
                        this.rowHighLight(rowData.index, pageNum);
                        this.$emit('selectAlarmListData', rowData.item); 
                        this.itemNum = rowData.index;
                }
            }
        },
        setDlg(obj,  flag) {
            if(obj.alarm_code != '' && obj.hasOwnProperty('alarm_code')) {
                if (flag == true) {
                    if(obj.alarm_code == 'B001' || obj.alarm_code =='B002') {
                        this.getB00Datas(obj);
                    } else {
                        this.isDetailView = 0;
                        this.getPieChartData(obj.alarmcode, obj.timestamp); 
                        this.getAlarmDesc(obj.alarmcode, obj.alarmid);
                        this.getAlarmStopData(obj.alarmstatus, obj.alarmcode, obj.booth, obj.zone, obj.timestamp); 
                        this.alarmInfoData = obj;
                        this.alarmInfoData['alarm'] = obj.alarm_name;
                    }
                }
                else {
                    this.isDetailView = 3;
                    this.pdfFile = obj.alarmcode;
                }
                this.dialog = true;
            }
        },
        convertClicked() {
            this.$router.push('/sps/alarm/alarmview');
        },
        rowHighLight(index, pageNum) {
            for(let i = 0; i <Object.keys(this.$refs).length; i++){
                if(Object.keys(this.$refs)[i] == index) {
                    if(this.getTheme == true) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#3c5d99';
                    }else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#E6E6E6';
                    }
                }else {
                    if(this.getTheme == true) {
                        if(i % 2 == 0) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                        } else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                        }
                    }else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = 'white';
                    }
                }
            }
        },
        onPageChange(itemNum, pageNum) {  
            if(this.getTheme == true) {
                if(this.pageNum == pageNum && this.highlightFlag == true) {
                    this.rowHighLight(itemNum, pageNum);
                }else {
                    for(let i = 0; i <Object.keys(this.$refs).length; i++) {
                        if(i % 2 == 0) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                        } else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                        }
                    }
                }
            }
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

        base64Decode(base64text) {
            return Buffer.from(base64text, 'base64').toString('utf8');
        },

        alarmViewDialogClosed() {
            this.dialog = false;
        }
    }
}
</script>

<style scoped lang="scss">    
    @import "alarmlist";
</style>
