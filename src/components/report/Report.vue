<template>
    <v-layout column>
        <v-layout style="justify-content: right">
            <v-btn flat title="존 별 리포트 출력" @click="datas.exportReportDlg = !datas.exportReportDlg">
            <img src="@/images/report/printing_white.png"/>
        </v-btn>
        </v-layout>
        <zone-report-export-dlg
            v-bind:isOpen="datas.exportReportDlg"
            v-on:clickCloseBtn="datas.exportReportDlg=false"
            v-bind:zoneInfo="datas.selectedReportItem"
        />
        <div v-for="(booth, boothIndex) in datas.boothInfo" :key="boothIndex">
            <div class="report_boothName">{{booth.booth_name}}</div>
            <div class="report_zoneBox" column v-for="(element, zoneIndex) in booth.zone" :key="zoneIndex">
                <div class="statusBtnBox">
                    <v-btn
                        v-if="element.selectedReport.current_data.status === 1 || element.selectedReport.alarm_data.status === 1 || element.selectedReport.atomizer_data.status === 1"
                        class="report_statusBtn" round color="#EF4C28" ripple>{{ui.title.alert}}
                    </v-btn>
                    <v-btn
                        v-else
                        class="report_statusBtn" round color="#2DB67C">{{ui.title.default}}
                    </v-btn>
                </div>
                <v-layout class="reportNameLayout">
                    <v-flex class="report_zoneName">{{element.zone_name}}</v-flex>
                    <v-flex class="reportlist">
                        <v-select
                            v-model="element.selectedReport"
                            :items="element.report"
                            item-text="report_name"
                            item-value="report_id"
                            :menu-props="{ maxHeight: '250px' }"
                            :return-object="true"
                            @change="changeReportList(element)"
                        >
                        </v-select>
                    </v-flex>
                    <v-flex class ="moveBtn" >
                        <v-btn
                            small
                            round
                            color="#23305A"
                            @click="clickMoveBtn(element)"
                        >{{ui.btn.move}}
                        </v-btn>
                    </v-flex>

                    <v-flex class="settingBtn">
                        <v-dialog
                            v-model="datas.reportSetDlg"
                            hide-overlay
                            width="1500"
                            :persistent="true"
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    v-on="on"
                                    round
                                    color="#5E7294"
                                    @click="clickReportDlg(element)"
                                >{{ui.btn.setReport}}
                                </v-btn>
                            </template>
                            <v-card class="text-xs-center gridTableCard" :color="ui.cardColor">
                                <v-card-title>{{ui.reportListTableHeader}}
                                    <v-spacer/>
                                    <v-btn
                                        icon
                                        dark
                                        @click="datas.reportSetDlg = false"
                                    >
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-card-title>
                                <v-data-table
                                    class="elevation-0 dataTable"
                                    :style="ui.tableDataStyle"
                                    hide-actions
                                    :headers="datas.reportListTableHeader"
                                    :items="datas.selectedZoneReport"
                                >
                                    <template slot="headers" slot-scope="props">
                                        <tr>
                                            <th :style="ui.tableHeaderStyle" v-for="(header, index) in props.headers" :key="index">
                                                <div>{{ header.text}}</div>
                                            </th>
                                        </tr>
                                    </template>
                                    <template slot="items" slot-scope="props">
                                        <tr style="height: 60px;">
                                            <td>{{ props.item.report_number}}</td>
                                            <td><span>{{ props.item.report_name }}</span></td>
                                            <td><span>{{ props.item.start_date }} ~ {{ props.item.end_date }}</span>
                                            </td>
                                            <td>{{ props.item.update_time}}</td>
                                            <td v-if="props.item.auto_flag === 0"><img src="@/images/cancel.png"/></td>
                                            <td v-else><img src="@/images/circle.png"/></td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-dialog>
                    </v-flex>
                </v-layout>
                <v-layout class="commentContainer">
                    <v-flex class="inputText">COMMENT</v-flex>
                    <v-flex class="inputContainer">
                        <v-flex class="inputBox border">
                            <v-text-field
                                :value="element.selectedReport.current_data.hardwareTitle"
                                prefix ="Hardware:"
                                readonly
                            >
                            </v-text-field>
                        </v-flex>
                        <v-flex class="inputBox border">
                            <v-text-field
                                prefix ="Alarm:"
                                :value="element.selectedReport.alarm_data.alarmTitle"
                                readonly
                            >
                            </v-text-field>
                        </v-flex>
                        <v-flex class="inputBox">
                            <v-text-field
                                prefix ="Atomizer:"
                                :value="element.selectedReport.atomizer_data.atomizer_title"
                                readonly
                            >
                            </v-text-field>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </div>
        </div>
    </v-layout>
</template>
<script>
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  const result = Array.isArray(obj) ? [] : {}

  for (let key of Object.keys(obj)) {
    result[key] = deepClone(obj[key])
  }

  return result
}

import { mapGetters } from 'vuex';
import ZoneReportExportDlg from '@/components/report/report/export/ZoneReportExportDlg.vue'

export default {
    components: {
        ZoneReportExportDlg
    },
    data(){
        return{
            ui: {
                reportListTableHeader: this.$t(`report.main.reportListTable.header`),
                cardColor: '',
                tableHeaderStyle: null,
                tableDataStyle: '',
                btn : {
                    move: this.$t(`report.main.btn.move`),
                    setReport: this.$t(`report.main.btn.setReport`),
                    add : this.$t(`report.main.btn.add`),
                    save: this.$t(`report.common.btn.save`)
                },
                title: {alert: this.$t(`report.main.reportTitle.alert`), default: this.$t(`report.main.reportTitle.default`)},
            },
            datas: {
                boothInfo: [],
                zoneInfo: [],
                reportSetDlg: false,
                reportListTableHeader: [
                    { text: 'NO', value : 'report_number', sortable: false, align: 'center'},
                    { text: this.$t(`report.main.reportListTable.report_name`), value: 'report_name', sortable: false, align: 'center'},
                    { text: this.$t(`report.main.reportListTable.report_time`), value: 'report_time', sortable: false, align: 'center'},
                    { text: this.$t(`report.main.reportListTable.update_time`), value: 'update_time', sortable: false, align: 'center'},
                    { text: this.$t(`report.main.reportListTable.auto`), value: 'auto_flag', sortable: false, align: 'center'},
                ],
                selectedZoneReport: [],
                reportData: [],
                selectedZoneInfo: {},
                exportReportDlg : false,
            }
        }
    },
    computed: {
        ...mapGetters({
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getAuth: 'getAuth',
            getTheme: 'getTheme',
        })
    },
    mounted(){
        this.datas.boothInfo = deepClone(this.getRenewBoothInfos);
        this.datas.zoneInfo = deepClone(this.getRenewZoneInfos)
        this.initData();
        this.initializeStyle();
    },
    methods: {
        async initData(){
            await this.getReportData();
            let key = 1
            this.datas.boothInfo.forEach(boothElement => {
                boothElement['key'] = key;
                key += 1;
            })
            this.datas.zoneInfo.forEach(zoneElement => {
                zoneElement['key'] = key
                key += 1;
                Object.assign(zoneElement, {report: this.datas.reportData.filter(element => element.zone_id === zoneElement.zone_id)})
                Object.assign(zoneElement, {selectedReport: zoneElement.report[0] !== undefined ? zoneElement.report[0] : {}})

                zoneElement.selectedReport.current_data = zoneElement.selectedReport.hasOwnProperty('current_data') && zoneElement.selectedReport.current_data !== null ? zoneElement.selectedReport.current_data : { hardwareTitle: '', status: 0 };
                zoneElement.selectedReport.alarm_data = zoneElement.selectedReport.hasOwnProperty('alarm_data') && zoneElement.selectedReport.alarm_data !== null ? zoneElement.selectedReport.alarm_data : { alarmTitle: '', status : 0 };
                zoneElement.selectedReport.atomizer_data = zoneElement.selectedReport.hasOwnProperty('atomizer_data') && zoneElement.selectedReport.atomizer_data !== null ? zoneElement.selectedReport.atomizer_data : { atomizer_title : '', status: 0 }
                
            })
            this.datas.selectedReportItem = deepClone(this.datas.zoneInfo)
            this.datas.boothInfo.forEach(boothElement => {
                Object.assign(boothElement, {zone: this.datas.zoneInfo.filter(element => element.disp_booth_id === boothElement.booth_id)})
                boothElement.zone.sort(function (a, b) { return a.zone_no < b.zone_no ? -1 : 1; });
            })
            this.datas.boothInfo.sort(function (a,b) {
                return a.booth_no < b.booth_no ? -1 : 1;
            })
            this.$store.dispatch('resetRenewReportZoneInfos');
        },
        initializeStyle() {
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.ui.cardColor = this.$style.common.gridTableItemCardColor;
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
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.gridTableItemBorderBottomColor);
            document.documentElement.style.setProperty("--gridTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        async getReportData(){
            await this.$http.get(`/reportview/renew/report`)
            .then((result) => {
                this.datas.reportData = result.data !== '' ? result.data : []
            })
        },
        changeReportList(reportInfo){
            let temp = [];
            temp = deepClone(this.datas.boothInfo)
            this.datas.zoneInfo.forEach(el => {
                if(el.zone_id === reportInfo.zone_id){
                    el.selectedReport.current_data == null && ( el.selectedReport.current_data = { hardwareTitle : '', status : 0 })
                    el.selectedReport.alarm_data == null && ( el.selectedReport.alarm_data = { alarmTitle : '', status : 0 })
                    el.selectedReport.atomizer_data == null && ( el.selectedReport.atomizer_data = { atomizer_title: '', status: 0 })
                }
            })
            temp.forEach(boothElement => {
                Object.assign(boothElement, {zone: this.datas.zoneInfo.filter(element => element.disp_booth_id === boothElement.booth_id)})
                boothElement.zone.sort(function (a, b) { return a.zone_no < b.zone_no ? -1 : 1;});
            })
            this.datas.boothInfo = []
            this.datas.boothInfo = temp
            this.datas.selectedReportItem = deepClone(this.datas.zoneInfo)
        },
        clickMoveBtn(zoneInfo){
            if(zoneInfo.selectedReport.report_id !== undefined){
                this.$store.dispatch('setRenewReportZoneInfos', {
                    zone_key : zoneInfo.key,
                    zone_id: zoneInfo.zone_id ,
                    report_id : zoneInfo.selectedReport.report_id
                });
                this.$router.push({
                    name: "reportresult",
                });
            }else{
                window.alert(this.$t(`report.common.window.selectReport`))
            }
        },
        async clickReportDlg(zoneInfo){
            this.datas.selectedZoneInfo = await zoneInfo
            this.getSelectedZoneReport();
        },
        async getSelectedZoneReport(){
            await this.$http.get(`/reportview/renew/report/zoneid/${this.datas.selectedZoneInfo.zone_id}`)
            .then((res)=>{
                this.datas.selectedZoneReport = res.data !== '' ? res.data : []
                this.datas.selectedZoneReport.forEach((el, index) => {
                    el.start_date = el.start_date.substr(0,10)
                    el.end_date = el.end_date.substr(0,10)
                    el.update_time = el.update_time.substr(0,10)
                    el.report_number = index + 1
                })
            })
        },
    }
}
</script>
<style lang="scss" scoped>
    @import './report';
</style>