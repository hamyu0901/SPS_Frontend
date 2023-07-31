<template>
    <div style="width:100%;">
        <v-layout>
            <v-flex class="zoneList">
                <v-card>
                    <v-toolbar
                        color="#2D2E53"
                        dark
                        tabs
                    >
                        <v-toolbar-title class="alarmlistTitle">{{ui.title.cardTitle}}</v-toolbar-title>
                        <v-dialog
                            v-model="datas.alarmFileDialog"
                            width="600"
                            :persistent="true"
                        >
                            <template v-slot:activator="{ on }">
                                <v-layout column >
                                    <button v-on ="on"><img src="@/images/import.png"/></button>
                                    <span class="fileButtonText">import</span>
                                </v-layout>
                            </template>
                            <v-card class="fileInsertBox">
                                <v-card-title>{{datas.selectedZoneName}}</v-card-title>
                                <div class="filebox">
                                    <input class="upload-name" id="fileUpload" type="file" accept=".xlsx" @change="importFile" label="File input" />
                                </div>
                                <div class="f_btn">
                                    <v-btn color="teal" @click="saveAlarmFile">{{ui.btn.insert}}</v-btn>
                                    <v-btn color="teal" @click="alarmFileDialog">{{ui.btn.close}}</v-btn>
                                </div>
                            </v-card>
                        </v-dialog>
                        <v-layout column>
                            <button><img src="@/images/export.png" @click="clickExport"/></button>
                            <span class="fileButtonText">export</span>
                        </v-layout>
                        <template v-slot:extension>
                            <v-tabs
                                class="zoneTab"
                                v-model="tab"
                                color="#2D2E53"
                                grow
                            >
                                <v-tabs-slider color="#f0c94b"></v-tabs-slider>
                                <v-tab
                                    v-for="item in datas.zoneInfo"
                                    :key="item.zone_id"
                                    @click="clickZone(item)"
                                >
                                    {{ item.zone_name }}
                                </v-tab>
                            </v-tabs>
                        </template>
                    </v-toolbar>
                    <div class="btnContainer">
                        <button @click="clickSaveBtn">
                            <img src="@/images/save.png"/>
                        </button>
                        <p>save</p>
                    </div>
                    <!-- <v-layout class="btnContainer">
                        <v-btn icon class="rowBtn" @click="addRow"><v-icon>mdi-plus-box-outline</v-icon></v-btn>
                        <v-btn icon class="rowBtn" @click="deleteRow"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
                    </v-layout> -->
                    <v-tabs-items v-model="tab">
                        <v-tab-item
                            v-for="item in datas.zoneInfo"
                            :key="item.zone_id"
                        >
                            <loading-dlg v-bind:loadingFlag="datas.loadingFlag"></loading-dlg>
                            <v-alert
                                v-if="datas.gridDataFlag"
                                :value="true"
                                color="#21976a"
                                >
                                <div class="alartText">{{ui.title.addAlarm}}<v-icon>mdi-file-import-outline</v-icon></div>
                            </v-alert>
                            <v-card flat color="#2D2E53" v-if="!datas.gridDataFlag">
                                <v-flex style="height: 500px" class="ag-grid-container" >
                                    <ag-grid-vue
                                        style="width: 100%; height: 100%"
                                        class="ag-theme-alpine"
                                        @gridReady="onGridReady"
                                        :enableRangeSelection="true"
                                        :enterMovesDown="true"
                                        :undoRedoCellEditing="true"
                                        :animateRows="true"
                                        :rowSelection="rowSelection"
                                        :columnDefs="datas.aggridColumnDefs"
                                        :defaultColDef="defaultColDef"
                                        :rowData="datas.gridData"
                                        @row-selected="onRowSelected"
                                        :rowMultiSelectWithClick="true"
                                    >
                                    </ag-grid-vue>
                                </v-flex>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import xlsx from "xlsx";
import 'ag-grid-enterprise';
import { AgGridVue } from "ag-grid-vue";
import '@/commons/alarmsettableaggrid.css';
import AlarmLevelRenderComponent from '@/commons/AlarmLevelRenderComponent.vue';
import AlarmTypeRenderComponent from '@/commons/AlarmTypeRenderComponent.vue';
import AlarmWarningTypeRenderComponent from '@/commons/AlarmWarningTypeRenderComponent.vue';
import LoadingDlg from '@/commons/LoadingDlg';
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
export default {
    components: {
        AlarmLevelRenderComponent,
        AlarmTypeRenderComponent,
        AlarmWarningTypeRenderComponent,
        AgGridVue,
        LoadingDlg
    },
    data(){
        return {
            tab: null,
            rowSelection: 'single',
            ui : {
                tabHeader: [],
                title: {
                    cardTitle: this.$t(`settingDlg.datas.reportItems.title`),
                    addAlarm: this.$t(`settingDlg.datas.reportItems.addAlarm`)
                },
                btn: {
                    insert: this.$t(`common.btn.insert`),
                    close: this.$t(`common.btn.close`),
                }
            },
            datas: {
                zoneInfo: [],
                alarmFileDialog : false,
                file: [],
                gridData: [],
                gridDataFlag : false,
                alarmList: [],
                selectedRow: [],
                aggridColumnDefs: [
                    {headerName: 'Code', field: 'code', sortable:true},
                    {headerName: 'Contents', field: 'contents', sortable:true},
                    {headerName: 'Level', field: 'level', sortable:true, cellEditor: 'agSelectCellEditor',
                        cellRenderer: 'AlarmLevelRenderComponent',
                        cellEditorParams: { values: [] },},
                    {headerName: 'Type', field: 'type', sortable:true, cellEditor: 'agSelectCellEditor',
                        cellRenderer: 'AlarmTypeRenderComponent',
                        cellEditorParams: {values: []}
                    },
                    {headerName: 'Warning', field: 'warning', sortable:true, cellEditor: 'agSelectCellEditor',
                        cellRenderer: 'AlarmWarningTypeRenderComponent', cellEditorParams: {values: [true, false]}
                    },
                ],
                selectedZoneId: '',
                selectedZoneName: '',
                gridApi : null,
                columnApi : null,
                loadingFlag: false
            },
            defaultColDef: {
                flex: 1,
                resizable: true,
                editable: true,
                singleClickEdit: true,
            },
        }
    },
    computed:{
        ...mapGetters({
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
            getLanguage: 'getLanguage'
        })
    },
    created(){
    },
    mounted(){
        this.initData();
    },
    methods: {
        initData(){
            this.ui.tabHeader = [];
            this.datas.selectedZoneId = '';
            this.datas.zoneInfo = deepClone(this.getRenewZoneInfos)
            this.datas.zoneInfo.sort(function (a, b){
                if(a.booth_id < b.booth_id) return -1;
                if(a.booth_id > b.booth_id) return 1;
                if(a.zone_no < b.zone_no) return -1;
                if(a.zone_no > b.zone_no) return 1;
                return 0;
            })
            this.datas.zoneInfo.forEach(el => {
                this.ui.tabHeader.push(el.zone_name)
            })
            this.getAlarmList(this.datas.zoneInfo[0].zone_id);
            this.datas.selectedZoneId = this.datas.zoneInfo[0].zone_id
            this.datas.selectedZoneName = this.datas.zoneInfo[0].zone_name
            this.datas.aggridColumnDefs[2].cellEditorParams.values = this.$t(`settingDlg.datas.reportItems.alarmLevel`)
            this.datas.aggridColumnDefs[3].cellEditorParams.values = this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)
        },
        onGridReady(params){
            this.datas.gridApi = params.api;
            this.datas.columnApi = params.columnApi;
        },
        importFile(event){
            let input = event.target;
            let reader = new FileReader();
            let temp = [];
            reader.onload = async() => {
                let data = reader.result;
                let workbook = xlsx.read(data, {type: 'binary'});
                workbook.SheetNames.forEach(sheetName => {
                    let rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    rows = this.switchData(rows)
                    temp = JSON.stringify(rows)
                })
                this.datas.file = temp
            }
            reader.readAsBinaryString(input.files[0])
        },
        async saveAlarmFile(){
            if(window.confirm(this.$t(`common.window.insert`))){
            await this.updateAlarmList({
                data : this.datas.file,
                zoneid: this.datas.selectedZoneId
            })
            await this.getAlarmList(this.datas.selectedZoneId);
            this.datas.alarmFileDialog = false
            }
        },
        alarmFileDialog(){
            this.datas.alarmFileDialog = false
            this.ui.fileName = null
        },
        async getAlarmList(zone_id){
            this.datas.loadingFlag = true;
            await this.$http.get(`/diagnostics/alarmstatistics/renew/zone/${zone_id}/file/alarm/data`)
            .then((res) => {
                if(res.data[0].alarm_list !== null){
                    res.data[0].alarm_list.forEach(item => {
                       switch (item.level){
                            case 0:
                                item.level = this.$t(`settingDlg.datas.reportItems.alarmLevel`)[2]  //상
                            break;
                            case 1:
                                item.level = this.$t(`settingDlg.datas.reportItems.alarmLevel`)[1]  //중
                            break;
                            case 2:
                                item.level = this.$t(`settingDlg.datas.reportItems.alarmLevel`)[0]  //하
                            break;
                            default:
                        }
                    })
                    res.data[0].alarm_list.forEach(item => {
                       switch (item.type){
                            case 1:
                                item.type = this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[0]   // 시스템
                            break;
                            case 2:
                                item.type = this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[1]   // 도장기
                            break;
                            case 3:
                                item.type = this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[2]   // 존로봇
                            break;
                            case 4:
                                item.type = this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[3]   // 비전
                            break;
                            case 99:
                                item.type = this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[4]   // 기타
                            default:
                        }
                    })
                    this.datas.gridData = res.data[0].alarm_list
                    this.datas.gridDataFlag = false
                }else{
                    this.datas.gridData = [];
                    this.datas.gridDataFlag = true;
                }
                this.datas.loadingFlag = false;
            })
        },
        updateAlarmList(item){
            this.$http.post(`/diagnostics/alarmstatistics/renew/file/alarm/data`, {
                alarmlist : item.data,
                zoneid: item.zoneid
            })
        },
        deleteFile(){

        },
        clickZone(info){
            this.getAlarmList(info.zone_id)
            this.datas.selectedZoneId = info.zone_id
            this.datas.selectedZoneName = info.zone_name
        },
        onRowSelected(row){
            let temp = [];
            if(row.node.selected === true){
                temp.push(row.data)
                this.datas.selectedRow = temp
            }
        },
        // addRow(){
        //     this.datas.gridData.unshift({
        //         code: '',
        //         type: this.$t(`report.common.title.zoneAlarmType`)[1],  // 도장기
        //         contents: '',
        //         level : this.$t(`report.common.title.alarmLevel`)[2]  // 하
        //     })
        // },
        // async deleteRow(){
        //     if(this.datas.selectedRow.length > 0){
        //         if(window.confirm('선택하신 행을 삭제하시겠습니까?')){
        //             let data = deepClone(this.datas.gridData)
        //             let temp = this.datas.selectedRow[0]
        //             data = data.filter(el => !(el.code === temp.code && el.contents === temp.contents && el.level === temp.level))
        //             data = this.switchData(data)
        //             await this.updateAlarmList({
        //                 data : JSON.stringify(data),
        //                 zoneid: this.datas.selectedZoneId
        //             })
        //             await this.getAlarmList(this.datas.selectedZoneId)
        //         }
        //     }else{
        //         window.alert('삭제할 행을 선택해주세요')
        //     }
        // },
        async clickSaveBtn(){
            this.datas.alarmList = [];
            this.datas.gridApi.forEachNode(this.getNode)
            if(this.datas.alarmList.length > 0){
                if(window.confirm(`${this.datas.selectedZoneName} ${this.$t(`common.window.save`)}`)){
                    this.datas.alarmList = this.switchData(this.datas.alarmList)
                    await this.updateAlarmList({
                        data : JSON.stringify(this.datas.alarmList),
                        zoneid: this.datas.selectedZoneId
                    })
                    await this.getAlarmList(this.datas.selectedZoneId)
                }
            }
        },
        getNode(item){
            this.datas.alarmList.push(item.data)
        },
        switchData(data){
            function keysToLowerCase(item){
                Object.keys(item).forEach(function (key) {
                    var k = key.toLowerCase();

                    if (k !== key) {
                        item[k] = item[key];
                        delete item[key];
                    }
                });
                return (item);
            }
            data.forEach(item => {
                keysToLowerCase(item)
                switch (item.type){
                    case this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[0]: // 시스템
                        item.type = 1
                    break;
                    case this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[1]: // 도장기
                        item.type = 2
                    break;
                    case this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[2]: case this.$t(`settingDlg.datas.reportItems.robotAlarmType`) : // 존로봇/ 로봇
                        item.type = 3
                    break;
                    case this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[3]: // 비전
                        item.type = 4
                    break;
                    case this.$t(`settingDlg.datas.reportItems.zoneAlarmType`)[4]: // 기타
                        item.type = 99
                default:
                }
                switch (item.level){
                    case this.$t(`settingDlg.datas.reportItems.alarmLevel`)[2]:   // 하
                        item.level = 0
                    break;
                    case this.$t(`settingDlg.datas.reportItems.alarmLevel`)[1]:   // 중
                        item.level = 1
                    break;
                    case this.$t(`settingDlg.datas.reportItems.alarmLevel`)[0]:  // 상
                        item.level = 2
                    break;
                default:
                }
            })
            return data
        },
        clickExport(){
            if(window.confirm(`${this.datas.selectedZoneName} ${this.$t(`settingDlg.datas.reportItems.exportAlarm`)}`)){
                this.datas.gridApi.exportDataAsExcel();
            }
        }

    }
}

</script>
<style scoped lang="scss">
  @import './alarmlevelsettable';
</style>