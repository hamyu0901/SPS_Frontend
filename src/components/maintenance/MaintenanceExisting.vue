<template>
   <v-container fluid fill-height>
        <v-layout class="maintenance">
            <v-flex lg2 class="pr-2">
                <v-layout>
                    <tree-view
                        v-on:nodeInfo="getNodeInfo"
                    ></tree-view>
                </v-layout>
            </v-flex>
            <v-flex lg12>
                <v-layout column class="ml-2">
                    <v-layout v-bind:style="ui.tabsStyle">
                        <v-tabs
                            v-model="activeMaintTab"
                            :height="ui.tabsHeight"
                            :active-class="ui.activeClass"
                            :color="ui.tabsColor"
                            hide-slider
                        >
                            <v-tab v-bind:style="ui.tabStyle" ripple key='0'  @click="robotMaintClicked">{{maintenanceTabNames.robotMaintenanceTabName}}</v-tab>
                            <v-tab v-bind:style="ui.tabStyle" ripple key='1' v-if="valveMaintFlag"  @click="valveCountClicked">{{maintenanceTabNames.valveCountMaintenanceTabName}}</v-tab>
                        </v-tabs>
                    </v-layout>
                    <v-layout column>
                        <maintenance-check-list-table
                            v-if="robotMaintFlag"
                            v-bind:headerData="maintenanceCheckListTableHeaderDatas"
                            v-bind:contentData="maintenanceCheckListTableContentDatas"
                            v-bind:highlightFlag="true"
                            v-bind:defaultClickedFlag="defaultClickedFlag"
                            v-on:pdfFile="getPdfFile"
                            v-on:selectedCheckData="getSelectedCheckData"
                            v-on:defaultClickedFlag="getDefaultClickedFlag"
                        ></maintenance-check-list-table>
                        <v-dialog v-model='dialog' width='850px' persistent @keydown.esc="dialog = false">
                            <v-btn class="mt-2 ml-2 pt-1 buttonItem" fab small fixed @click="dialog = false">
                                <v-icon class="pt-2" small>clear</v-icon>
                            </v-btn>
                            <pdf-view v-bind:pdfFile='pdfFile' v-bind:pdfViewFlag="dialog"></pdf-view>
                        </v-dialog>
                        <valve-count-table
                            v-if="!robotMaintFlag"
                            v-bind:headerData="valveCountTableHeaderDatas"
                            v-bind:contentData="valveCountTableContentDatas"
                            v-bind:highlightFlag="true"
                            v-bind:defaultClickedFlag="defaultClickedFlag"
                            v-on:pdfFile="getPdfFile"
                            v-on:selectedCheckData="getSelectedCheckData"
                            v-on:defaultClickedFlag="getDefaultClickedFlag"
                        ></valve-count-table>
                    </v-layout>
                    <v-layout class="pt-3 pb-1">
                        <p :style="ui.titleStyle">{{ui.detailCheckListTableTitle}}</p>
                        <v-spacer/>
                        <v-btn class="buttonItem elevation-0" @click="saveBtnClicked">{{ui.saveText}}</v-btn>
                        <comfirm-dlg
                            v-bind:comfirmDlgType="'save'"
                            v-bind:comfirmDlgFlag="saveComfirmFlag"
                            v-on:comfirmFlag="getSaveComfirmFlag"
                            v-on:closeFlag="getCloseComfirmFlag"
                        ></comfirm-dlg>
                    </v-layout>
                    <detail-maintenance-check-list-table
                        v-bind:headerData="detailMaintenanceCheckListTableHeaderDatas"
                        v-bind:contentData="detailMaintenanceCheckListTableContentDatas"
                        v-bind:detailMaintenanceFlag="detailMaintenanceFlag"
                        v-bind:detailMaintenanceHistoryInitFlag="detailMaintenanceHistoryInitFlag"
                        v-on:changeDetailMaintenanceFlag="changeDetailMaintenanceFlag"
                        v-on:saveDetailMaintenanceCheckListDatas="getSaveDetailMaintenanceCheckListDatas"
                        v-on:detailMaintenanceHistoryInitData="changeDetailMaintenanceHistoryInitFlag"
                        v-on:maintenanceResultflag="getMaintenanceResult"
                    ></detail-maintenance-check-list-table>
                    <v-dialog v-model="maintenanceResultFlag" width='500px' persistent>
                        <v-card class="cardBackgroundColor">
                            <v-card-title class="justify-center cardTitleColor" v-bind:style="ui.titleStyle">{{ui.lastCommentTitle}}</v-card-title>
                            <v-textarea
                                box
                                height="150px"
                                v-model="maintenanceResult"
                                :readonly="true"
                            ></v-textarea>
                            <v-layout>
                                <v-spacer/>
                                <v-btn class="dialogBtn buttonItem mr-1" @click="maintenanceResultFlag = false">
                                    {{ui.closeText}}
                                </v-btn>
                            </v-layout>
                        </v-card>
                    </v-dialog>
                </v-layout>
            </v-flex>
            <loading-dlg v-bind:loadingFlag="loadingFlag"></loading-dlg>
        </v-layout>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import TreeView from '@/commons/TreeView'
import Selector from '@/commons/Selector'
import MaintenanceCheckListTable from '@/components/maintenance/maintenance/MaintenanceCheckListTable'
import ValveCountTable from '@/components/maintenance/maintenance/ValveCountTable'
import PdfView from '@/commons/PdfView'
import DetailMaintenanceCheckListTable from '@/components/maintenance/maintenance/DetailMaintenanceCheckListTable'
import ComfirmDlg from '@/commons/ComfirmDlg'
import LoadingDlg from '@/commons/LoadingDlg'
export default {
    components: {
        TreeView,
        Selector,
        MaintenanceCheckListTable,
        ValveCountTable,
        PdfView,
        DetailMaintenanceCheckListTable,
        ComfirmDlg,
        LoadingDlg
    },
    data() {
        return {
            ui: {
                treeViewTitle: this.$t(`maintenance.treeViewTitle`),
                checkListTableTitle: this.$t(`maintenance.checkListTableTitle`),
                checkListSelectorHint: this.$t(`maintenance.checkListSelectorHint`),
                checkListInputHint: this.$t(`maintenance.checkListInputHint`),
                detailCheckListTableTitle: this.$t(`maintenance.detailCheckListTableTitle`),
                closeText: this.$t(`maintenance.close`),
                saveText: this.$t(`maintenance.save`),
                lastCommentTitle: this.$t(`maintenance.detailMaintenanceCheckListTableHeaderDatas.lastComment`),
                activeClass: '',
                titleStyle: null,
                tabsHeight: "40px",
                tabsColor: '',
                tabsStyle: {
                    borderBottom: ``,
                },
                tabStyle: {
                    marginRight: "5px",
                    color: '',
                    backgroundColor: '',
                    borderRadius: "10px 10px 0 0 /  10px 10px 0 0"
                },
            },
            robotId: '',
            zoneId: '',
            boothId: '',
            factoryId: '',
            robotMaintFlag: null,
            valveMaintFlag: null,
            activeMaintTab: null,
            defaultClickedFlag: false,
            saveComfirmFlag: false,
            maintenanceResultFlag: false,
            loadingFlag: false,
            maintenanceResult: '',
            maintenanceCheckSelectorDatas: [
                {id: 'unit',        name: this.$t(`maintenance.maintenanceCheckSelectorDatas.unit`)},
                {id: 'maint_point', name: this.$t(`maintenance.maintenanceCheckSelectorDatas.maintPoint`)}
            ],
            selectMaintenanceCheckData: '',
            maintenanceTabNames: {
                robotMaintenanceTabName: this.$t(`maintenance.maintenanceTabNames.robotMaintenanceTabName`),
                valveCountMaintenanceTabName: this.$t(`maintenance.maintenanceTabNames.valveCountMaintenanceTabName`)
            },
            maintenanceCheckListTableHeaderDatas: [
                {id: 'maint_name',          text: this.$t(`maintenance.maintenanceCheckListTableHeaderDatas.maintName`)},
                {id: 'unit',                text: this.$t(`maintenance.maintenanceCheckListTableHeaderDatas.unit`)},
                {id: 'maint_point',         text: this.$t(`maintenance.maintenanceCheckListTableHeaderDatas.maintPoint`)},
                {id: 'progress',            text: this.$t(`maintenance.maintenanceCheckListTableHeaderDatas.progress`)},
                {id: 'maint_description',   text: this.$t(`maintenance.maintenanceCheckListTableHeaderDatas.maintDesc`)},
                {id: 'maint_cycle',         text: this.$t(`maintenance.maintenanceCheckListTableHeaderDatas.maintCycle`)},
                {id: 'details',             text: this.$t(`maintenance.maintenanceCheckListTableHeaderDatas.details`)},
            ],
            maintenanceCheckListTableContentDatas: [],
            tempMaintenanceCheckListTableContentDatas: [],
            valveCountTableHeaderDatas: [
                {id: 'valve_name',          text: this.$t(`maintenance.valveCountTableHeaderDatas.valveName`)},
                {id: 'progress',            text: this.$t(`maintenance.valveCountTableHeaderDatas.progress`)},
                {id: 'valve_maint_count',   text: this.$t(`maintenance.valveCountTableHeaderDatas.valveMaintCount`)},
                {id: 'current_valvecount',  text: this.$t(`maintenance.valveCountTableHeaderDatas.currentValveCount`)},
                {id: 'details',             text: this.$t(`maintenance.valveCountTableHeaderDatas.details`)}
            ],
            valveCountTableContentDatas: [],
            dialog: false,
            pdfFile: '',
            maintCode: '',
            detailMaintenanceHistoryInitFlag: false,
            detailMaintenanceCheckListTableHeaderDatas: [
                {id: 'booth_name',          text: this.$t(`maintenance.detailMaintenanceCheckListTableHeaderDatas.booth`)},
                {id: 'zone_name',           text: this.$t(`maintenance.detailMaintenanceCheckListTableHeaderDatas.zone`)},
                {id: 'robot_name',          text: this.$t(`maintenance.detailMaintenanceCheckListTableHeaderDatas.robot`)},
                {id: 'last_check',          text: this.$t(`maintenance.detailMaintenanceCheckListTableHeaderDatas.lastCheck`)},
                {id: 'comment',             text: this.$t(`maintenance.detailMaintenanceCheckListTableHeaderDatas.lastComment`)},
                {id: 'actiontype',          text: this.$t(`maintenance.detailMaintenanceCheckListTableHeaderDatas.actionType`)},
                {id: 'history',             text: this.$t(`maintenance.detailMaintenanceCheckListTableHeaderDatas.history`)}
            ],
            detailMaintenanceCheckListTableContentDatas: [],
            saveDetailMaintenanceCheckListDatas: [],
            detailMaintenanceFlag: false
        }
    },
    computed: {
        ... mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
        })
    },
    created() {
        this.initializeUI();
    },
    mounted() {
        this.$emit('mountedTab');
        this.setLoadingFlag(true);
        this.initializeStyle();
    },
    methods: {
        initializeUI() {
            this.ui.activeClass = this.$style.common.subTabItemActiveClass;
        },
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tabsColor = this.$style.common.subTabItemTabsColor;
            this.ui.tabStyle.color = this.$style.common.subTabItemTabStyleColor;
            this.ui.tabStyle.backgroundColor = this.$style.common.subTabItemTabStyleBackgroundColor;
            this.ui.tabsStyle.borderBottom = this.$style.common.subTabItemTabsStyleBorderBottom;

            document.documentElement.style.setProperty("--cardBackgroundColor", this.$style.maintenance.maintenanceItemCardBackgroundColor);
            document.documentElement.style.setProperty("--cardTitleColor", this.$style.maintenance.maintenanceItemCardTitleColor);

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
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.tableTBodyBBColor);
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);

        },
        setLoadingFlag(loadingFlag) {
            this.loadingFlag = loadingFlag;
        },

        getDefaultClickedFlag() {
            this.defaultClickedFlag = false;
        },

        robotMaintClicked() {
            this.activeMaintTab = 0;
            this.robotMaintFlag = true;
            this.defaultClickedFlag = true;
            this.getMaintenanceCheckListDatas();
        },

        valveCountClicked() {
            this.activeMaintTab = 1;
            this.robotMaintFlag = false;
            this.getValveCountTableContentDatas();
            this.defaultClickedFlag = true;
        },

        valveCountCheck(processInfo){
            if(this.robotId == undefined || processInfo.robottype != 1) {
                this.valveMaintFlag = false;
                this.activeMaintTab = 0;
            } else {
                this.valveMaintFlag = true;
            }
        },

        getNodeInfo(nodeInfo) {
            this.factoryId = nodeInfo.factoryid;
            this.boothId = nodeInfo.boothid;
            this.zoneId = nodeInfo.zoneid;
            this.robotId = nodeInfo.robotid;
            this.valveCountCheck(nodeInfo);
            if(this.activeMaintTab == 0) {
                this.robotMaintClicked();
            } else {
                this.valveCountClicked();
            }
            this.setLoadingFlag(false);
        },

        getMaintenanceCheckListDatas() {
            let postDatas = {};
            postDatas = this.checkProcessDatas(this.factoryId, this.boothId, this.zoneId, this.robotId);
            this.$http.post(`${this.baseUrl}/maintenance/data/insp/list`, postDatas)
                .then((result) => {
                    if (result.data == '') {
                        this.$popmsg(this.$t(`maintenance.popMsg.robotInspectionList`))
                    } else {
                        this.maintenanceCheckListTableContentDatas = [];
                        this.maintenanceCheckListTableContentDatas = result.data;
                    }
                }).catch((error) => {
                    this.$log.error(error);
                })
        },

        getValveCountTableContentDatas() {
            let postDatas = {};
            postDatas = this.checkProcessDatas(undefined, this.boothId, this.zoneId, this.robotId);
            this.$http.post(`${this.baseUrl}/maintenance/data/insp/list/valve`, postDatas)
                .then((result) => {
                    if (result.data == '') {
                        this.$popmsg(this.$t(`maintenance.popMsg.valveInspectionList`))
                    } else {
                        this.valveCountTableContentDatas = [];
                        Object.keys(result.data).forEach(function eachKey(key) {
                            if (typeof Number(result.data[key].current_valvecount) === 'number' && typeof result.data[key].valve_maint_count == 'number') {
                                let progress = 100 - (result.data[key].current_valvecount / result.data[key].valve_maint_count * 100);
                                result.data[key]['progress'] = Math.floor(progress);
                            }
                            result.data[key]['details'] = '';
                            result.data[key]['maint_code'] = "M"+result.data[key]['atom_model_id']+"_"+(Number(key)+1);
                        });
                        this.valveCountTableContentDatas = result.data;
                    }
                }).catch((error) => {
                    this.$log.error(error);
                })
        },

        getPdfFile(pdfFile, flag) {
            this.pdfFile = pdfFile;
            this.dialog = flag;
        },

        getSelectedCheckData(data) {
            if(data.maint_code != undefined) {
                if(this.robotMaintFlag == true) {
                    this.maintCode = data.maint_code;
                    this.detailMaintenanceHistoryInitFlag = true;
                    this.ui.detailCheckListTableTitle = '[ '+ data.maint_name + ' ] ' + this.$t(`maintenance.getSelectedCheckData`);
                } else {
                    this.maintCode = data.maint_code;
                    this.detailMaintenanceHistoryInitFlag = true;
                    this.ui.detailCheckListTableTitle = '[ '+ data.valve_name + ' ] ' + this.$t(`maintenance.getSelectedCheckData`);
                }
                this.getDetailMaintenanceCheckListDatas();
            }
        },

        getDetailMaintenanceCheckListDatas() {
            let postDatas = {};
            postDatas = this.checkProcessDatas(this.factoryId, this.boothId, this.zoneId, this.robotId);
            postDatas['alarmcode'] = this.maintCode;
            this.$http.post(`${this.baseUrl}/maintenance/data/insp/list/detail`, postDatas)
                .then((result) => {
                    if(result.data == '') {
                        this.$popmsg(this.$t(`maintenance.popMsg.inspectionDetailList`));
                    } else {
                        this.detailMaintenanceCheckListTableContentDatas = [];
                        this.detailMaintenanceCheckListTableContentDatas = result.data;
                    }
                }).catch((error) => {
                    this.$log.error(error);
                })

        },

        saveBtnClicked() {
            this.detailMaintenanceFlag = true;
            this.saveComfirmFlag = true;
        },

        getSaveComfirmFlag() {
            setTimeout(() => {
                if(this.maintCode != '' && this.saveDetailMaintenanceCheckListDatas.length != 0) {
                    if(this.activeMaintTab == 0) {
                        for(let i = 0; i < this.saveDetailMaintenanceCheckListDatas.length; i++) {
                            if(this.saveDetailMaintenanceCheckListDatas[i]['actiontype'] != 1) {
                                this.saveDetailMaintenanceCheckListDatas[i]['maintcode'] = this.maintCode;
                                this.saveDetailMaintenanceCheckListDatas[i]['userid'] = sessionStorage.getItem('userid');
                                this.saveDetailMaintenanceCheckListDatas[i]['factoryid'] = this.getFactoryId;
                                this.$http.post(`${this.baseUrl}/maintenance/data/insp/list/execute`,  this.saveDetailMaintenanceCheckListDatas[i])
                                .then((result) => {
                                    this.getMaintenanceCheckListDatas();
                                    this.getDetailMaintenanceCheckListDatas();
                                })
                            }
                        }
                    } else {
                        for(let i = 0; i < this.saveDetailMaintenanceCheckListDatas.length; i++) {
                            if(this.saveDetailMaintenanceCheckListDatas[i]['actiontype'] != 1) {
                                this.saveDetailMaintenanceCheckListDatas[i]['maintcode'] = this.maintCode;
                                this.saveDetailMaintenanceCheckListDatas[i]['userid'] = sessionStorage.getItem('userid');
                                this.saveDetailMaintenanceCheckListDatas[i]['factoryid'] = this.getFactoryId;
                                this.saveDetailMaintenanceCheckListDatas[i]['valve'] = "valve" + this.maintCode.split("_")[1];
                                this.$http.post(`${this.baseUrl}/maintenance/data/insp/list/valve/execute`,  this.saveDetailMaintenanceCheckListDatas[i])
                                .then((result) => {
                                    this.getValveCountTableContentDatas();
                                    this.getDetailMaintenanceCheckListDatas();
                                })
                            }
                        }
                    }
                    this.$popmsg(this.$t(`maintenance.popMsg.save`));
                }
                else {
                    this.$popmsg(this.$t(`maintenance.popMsg.topItemClick`));
                }
            }, 800);
            this.saveComfirmFlag = false;
        },

        getCloseComfirmFlag() {
            this.saveComfirmFlag = false;
        },

        changeDetailMaintenanceFlag() {
            this.detailMaintenanceFlag = false;
        },

        changeDetailMaintenanceHistoryInitFlag() {
            this.detailMaintenanceHistoryInitFlag = false;
        },

        getSaveDetailMaintenanceCheckListDatas(saveDetailMaintenanceCheckListDatas) {
            this.saveDetailMaintenanceCheckListDatas = saveDetailMaintenanceCheckListDatas;
        },

        getMaintenanceResult(maintenanceResult) {
            this.maintenanceResultFlag = true;
            this.maintenanceResult = '';
            this.maintenanceResult = maintenanceResult;
        },

        checkProcessDatas(factoryid, boothid, zoneid, robotid) {
            let postDatas = {};

            if(factoryid != undefined) {
                postDatas['factoryid'] = factoryid;
            }

            if(boothid != undefined) {
                postDatas['boothid'] = boothid;
            }

            if(zoneid != undefined) {
                postDatas['zoneid'] = zoneid;
            }

            if(robotid != undefined) {
                postDatas['robotid'] = robotid;
            }

            return postDatas;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './maintenanceexisting';
</style>