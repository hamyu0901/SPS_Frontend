<template>
    <v-card class="settingDlgCard"
        height="850px"
    >
        <v-layout column fill-height>
            <v-layout fill-height>
                <v-flex lg2>
                    <v-list expand class="settingDlgList">
                        <v-layout column>
                            <div v-for="listItem in datas.listItems" :key="listItem.id">
                                <v-list-tile
                                    v-if="listItem.show"
                                    class="settingDlgListTile"
                                    active-class="dy_blue_dark"
                                    v-model="listItem.active"
                                    ripple
                                    @click="clickListItem(listItem.title)"
                                >
                                    <v-list-tile-title v-if="listItem.show">{{listItem.title}}</v-list-tile-title>
                                </v-list-tile>
                            </div>

                        </v-layout>
                    </v-list>
                </v-flex>
                <v-flex lg12>
                    <div class="closeButton"><v-btn icon @click="closeBtnClicked"><v-icon color="primary">mdi-close</v-icon></v-btn></div>
                    <v-layout v-if="flags.language === true || flags.theme === true" column>
                        <user-set-view
                            v-bind:userSetId="flags.language === true? datas.listItems[0].id : datas.listItems[1].id"
                            v-bind:userSetTitle="flags.language === true? datas.listItems[0].title : datas.listItems[1].title"
                            v-bind:userSetItems="flags.language === true? datas.languageItems : datas.themeItems"
                            v-bind:saveFlag="flags.language === true? flags.save.language : flags.save.theme"
                            v-on:saveUserSetData="getSaveUserSetData($event, flags.language === true? datas.listItems[0].id : datas.listItems[1].id)"
                        ></user-set-view>
                    </v-layout>
                    <v-layout v-if="flags.accum === true || flags.range === true" column>
                        <warning-set-view
                            v-bind:warningSetViewTitle="flags.accum === true? datas.listItems[2].title: datas.listItems[3].title"
                            v-on:startDate="getDate($event, 'startdate')"
                            v-on:endDate="getDate($event, 'enddate')"
                            v-on:warningRate="getWarningRate"
                            v-on:search="getSearchItem(flags.accum === true? 'accum':'range')"
                        >
                            <v-layout v-if="flags.accum === true">
                                <v-flex lg12>
                                    <warning-set-table
                                        v-bind:tableId="'accum'"
                                        v-bind:headerDatas="datas.historyAccumHeaders"
                                        v-bind:contentDatas="datas.historyAccumDatas"
                                        v-bind:warningRate="datas.warningRate"
                                        v-bind:saveFlag="flags.save.accum"
                                        v-on:saveWarningDatas="getSaveWarningDatas($event, 'accum')"
                                    ></warning-set-table>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else>
                                <v-flex lg8>
                                    <warning-set-table
                                        v-bind:tableId="'range'"
                                        v-bind:headerDatas="datas.historyRangeHeaders"
                                        v-bind:contentDatas="datas.historyRangeDatas"
                                        v-bind:warningRate="datas.warningRate"
                                        v-bind:saveFlag="flags.save.range"
                                        v-bind:renderFlag="flags.render"
                                        v-bind:cancelFlag="flags.cancel"
                                        v-on:selectedDetailRangeData="getRangeDetailHistoryData"
                                        v-on:rangeOnAutoSetBtnClicked="getRangeAutoSetDetailHistoryData"
                                        v-on:saveWarningDatas="getSaveWarningDatas($event, 'range')"
                                        v-on:renderFlag="flags.render = false"
                                        v-on:cancelFlag="flags.cancel = false"
                                    ></warning-set-table>
                                </v-flex>
                                <v-flex lg4>
                                    <detail-warning-set-table
                                        v-bind:headerDatas="datas.historyRangeDetailHeaders"
                                        v-bind:contentDatas="datas.historyRangeDetailDatas"
                                        v-on:changeDetailWarningSetDatas="getChangeDetailWarningSetDatas"
                                        v-on:detailWarningSetDatas="getDetailWarningSetDatas"
                                    ></detail-warning-set-table>
                                </v-flex>
                            </v-layout>
                        </warning-set-view>
                    </v-layout>
                    <v-layout v-if="flags.applicatordata === true" column>
                        <v-layout>
                            <p class="settingDlgTitle mt-2"> {{datas.listItems[4].title}}</p>
                            <v-flex lg2>
                                <selector
                                    class="settingDlgSelector pl-2 pr-2 pt-2"
                                    v-bind:selectorTitle="$t(String(`selector.booth`))"
                                    v-bind:selectorOptions="getBoothInfos"
                                    v-on:selectedTarget="getTargetBoothId"
                                ></selector>
                            </v-flex>
                            <v-flex lg2>
                                <selector
                                    class="settingDlgSelector pl-2 pr-2 pt-2"
                                    v-bind:selectorTitle="$t(String(`selector.zone`))"
                                    v-bind:selectorOptions="datas.applicatorInfos.selectedTargetZoneInfos"
                                    v-on:selectedTarget="getTargetZoneId"
                                ></selector>
                            </v-flex>
                        </v-layout>
                        <v-layout column>
                            <div class="applicatorNum" v-for="applicatorData in datas.applicatorInfos.applicatorDatas" :key="applicatorData.id">
                                <span>{{applicatorData.id}}</span>
                                <input class="applicatorInput px-2" solo :value="applicatorData.value" @input="applicatorData.value = $event.target.value"/>
                            </div>
                        </v-layout>
                    </v-layout>
                    <v-layout v-if="flags.menu === true" fill-height>
                        <menu-set-view
                            v-if="flags.menu === true"
                            v-bind:saveFlag="flags.save.menu"
                            v-on:saveMenuItems="getSaveMenuItems"
                        ></menu-set-view>
                    </v-layout>
                    <v-layout v-if="flags.alarm === true">
                        <alarm-level-set-table/>
                    </v-layout>
                </v-flex>
                <comfirm-dlg
                    v-bind:comfirmDlgType="datas.comfirm.type"
                    v-bind:comfirmDlgFlag="datas.comfirm.flag"
                    v-on:comfirmFlag="getComfirmFlag"
                    v-on:closeFlag="closeComfirmFlag"
                ></comfirm-dlg>
                <torque-report />
                <loading-dlg v-bind:loadingFlag="flags.loading"></loading-dlg>
            </v-layout>
            <v-layout class="pt-2">
                <v-spacer/>
                <div v-if="flags.alarm !== true">
                    <v-btn class="buttonItem" depressed @click="saveBtnClicked()">{{ui.text.save}}</v-btn>
                </div>
            </v-layout>
        </v-layout>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import Selector from '@/commons/Selector';
import UserSetView from '@/commons/UserSetView';
import WarningSetView from '@/commons/WarningSetView';
import WarningSetTable from '@/commons/WarningSetTable';
import MenuSetView from '@/commons/MenuSetView';
import ComfirmDlg from '@/commons/ComfirmDlg';
import DetailWarningSetTable from '@/commons/DetailWarningSetTable';
import LoadingDlg from '@/commons/LoadingDlg';
import AlarmSetTable from '@/commons/AlarmSetTable'
import AlarmLevelSetTable from '@/commons/AlarmLevelSetTable'
import TorqueReport from '@/components/diagnostics/report/report/torqueAnalysis/TorqueReport';
export default {
    components: {Selector, UserSetView, WarningSetView, WarningSetTable, MenuSetView, ComfirmDlg, DetailWarningSetTable, LoadingDlg,AlarmSetTable, TorqueReport, AlarmLevelSetTable},
    data() {
        return {
            ui: {
                color: {
                    background: "",
                    listHover: "",
                    button: "",
                    warningTextColor: "",
                    defaultTextColor: ""
                },
                text: {
                    save: this.$t(`settingDlg.ui.text.save`),
                    close: this.$t(`settingDlg.ui.text.close`)
                }
            },
            datas: {
                date: {
                    start: "",
                    end: ""
                },
                comfirm: {
                type: "",
                    flag: false
                },
                warningRate: {
                    min: 10,
                    max: 10
                },
                listItems: [
                    {id: "language", title: this.$t(`settingDlg.datas.listItems.language`), active: true, show: true},
                    // {id: "theme", title: this.$t(`settingDlg.datas.listItems.theme`), active: false, show: true},
                    // {id: "accum", title: this.$t(`settingDlg.datas.listItems.accum`), active: false, show: true},
                    // {id: "range", title: this.$t(`settingDlg.datas.listItems.range`), active: false, show: true},
                    // {id: "applicatordata", title: this.$t(`settingDlg.datas.listItems.applicatordata`), active: false, show: true},
                    // {id: "menu", title: this.$t(`settingDlg.datas.listItems.menu`), active: false, show: false},
                    {id: "alarm", title: this.$t(`settingDlg.datas.listItems.alarm`), active: false, show: true},

                ],
                languageItems: {
                    value: "",
                    items: [
                        {id: 'kr', title: this.$t(`settingDlg.datas.languageItems.kr`)},
                        {id: 'en', title: this.$t(`settingDlg.datas.languageItems.en`)},
                        {id: 'cn', title: this.$t(`settingDlg.datas.languageItems.cn`)}
                    ]
                },
                themeItems: {
                    value: "",
                    items: [
                        {id: 'dark', title: this.$t(`settingDlg.datas.themeItems.dark`), value: true},
                        {id: 'light', title: this.$t(`settingDlg.datas.themeItems.light`), value: false}
                    ]
                },
                historyAccumHeaders: [
                    {field: "boothname", name: this.$t(`settingDlg.datas.historyAccumHeaders.boothname`), readonly: true},
                    {field: "zonename", name: this.$t(`settingDlg.datas.historyAccumHeaders.zonename`), readonly: true},
                    {field: "robotname", name: this.$t(`settingDlg.datas.historyAccumHeaders.robotname`), readonly: true},
                    {field: "axis", name: this.$t(`settingDlg.datas.historyAccumHeaders.axis`), readonly: true},
                    {field: "jobname", name: this.$t(`settingDlg.datas.historyAccumHeaders.jobname`), readonly: true},
                    {field: "maxsum", name: this.$t(`settingDlg.datas.historyAccumHeaders.maxsum`), readonly: true},
                    {field: "minsum", name: this.$t(`settingDlg.datas.historyAccumHeaders.minsum`), readonly: true},
                    {field: "avgsum", name: this.$t(`settingDlg.datas.historyAccumHeaders.avgsum`), readonly: true},
                    {field: "avgcycle", name: this.$t(`settingDlg.datas.historyAccumHeaders.avgcycle`), readonly: true},
                    {field: "maxwarning", name: this.$t(`settingDlg.datas.historyAccumHeaders.maxwarning`), readonly: false, style(rec) {return {color: Number(rec.maxsum) > Number(rec.maxwarning)? 'red': '#ffffff'}}},
                    {field: "minwarning", name: this.$t(`settingDlg.datas.historyAccumHeaders.minwarning`), readonly: false, style(rec) {return {color: Number(rec.minsum) < Number(rec.minwarning)? 'red': '#ffffff'}}},
                    {field: "cyclewarning", name: this.$t(`settingDlg.datas.historyAccumHeaders.cyclewarning`), readonly: false}
                ],
                historyAccumDatas: [],
                historyRangeHeaders: [
                    {field: "boothname", name: this.$t(`settingDlg.datas.historyRangeHeaders.boothname`), readonly: true},
                    {field: "zonename", name: this.$t(`settingDlg.datas.historyRangeHeaders.zonename`), readonly: true},
                    {field: "robotname", name: this.$t(`settingDlg.datas.historyRangeHeaders.robotname`), readonly: true},
                    {field: "axis", name: this.$t(`settingDlg.datas.historyRangeHeaders.axis`), readonly: true},
                    {field: "jobname", name: this.$t(`settingDlg.datas.historyRangeHeaders.jobname`), readonly: true},
                    {field: "violationstep", name: this.$t(`settingDlg.datas.historyRangeHeaders.violationstep`), readonly: true, style(rec) {return {color: Number(rec.violationstep) > 0 ? 'red': '#ffffff'}}}
                ],
                historyRangeDetailHeaders: [
                    {field: "stepno", name: this.$t(`settingDlg.datas.historyRangeDetailHeaders.stepno`), readonly: true},
                    {field: "max", name: this.$t(`settingDlg.datas.historyRangeDetailHeaders.max`), readonly: true},
                    {field: "min", name: this.$t(`settingDlg.datas.historyRangeDetailHeaders.min`), readonly: true},
                    {field: "maxwarning", name: this.$t(`settingDlg.datas.historyRangeDetailHeaders.maxwarning`), readonly(rec) { return rec.max !== undefined? false : true }, style(rec) {return {color: Number(rec.max) > Number(rec.maxwarning) ? 'red': '#ffffff'}}},
                    {field: "minwarning", name: this.$t(`settingDlg.datas.historyRangeDetailHeaders.minwarning`), readonly(rec) { return rec.min !== undefined? false : true }, style(rec) {return {color: Number(rec.min) < Number(rec.minwarning) ? 'red': '#ffffff'}}},
                ],
                historyRangeDatas: [],
                historyRangeDetailDatas: [],
                tempHistoryRangeDetailDatas: {},
                changeDetailWarningSetDatas: [],
                saveDatas: {
                    language: "",
                    theme: "",
                    accum: [],
                    range: [],
                    applicatordata: [],
                    menu: []
                },
                applicatorInfos: {
                    boothid: "",
                    zoneid: "",
                    selectedTargetZoneInfos: [],
                    applicatorDatas: {}
                },
                tempViolationStep: 0
            },
            flags: {
                language: true,
                theme: false,
                accum: false,
                range: false,
                applicatordata: false,
                menu: false,
                autoSet: false,
                loading: false,
                render: false,
                cancel: false,
                save: {
                    language: false,
                    theme: false,
                    accum: false,
                    range: false,
                    change: false,
                    applicatordata: false,
                    menu: false
                }
            }
        }
    },
    created() {

    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters({
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getAuth: 'getAuth'
        })
    },

    methods: {
        initializeStyle() {
            this.ui.color.warningTextColor = this.$style.common.settingDlgItemCardWarningTextColor;
            this.ui.color.defaultTextColor = this.$style.common.settingDlgItemCardDefaultTextColor;
            document.documentElement.style.setProperty("--buttonItemBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemColor", this.$style.common.buttonItemColor);
            document.documentElement.style.setProperty("--settingDlgCardBackgroundColor", this.$style.common.settingDlgItemCardBackgroundColor);
            document.documentElement.style.setProperty("--settingDlgListBackgroundColor", this.$style.common.settingDlgItemListBackgroundColor);
            document.documentElement.style.setProperty("--settingDlgListTileHoverColor", this.$style.common.settingDlgItemListTileHoverColor);
            document.documentElement.style.setProperty("--applicatorNumColor", this.$style.common.settingDlgItemApplicatorNumColor);
            document.documentElement.style.setProperty("--applicatorInputBorderColor", this.$style.common.settingDlgItemApplicatorInputBorderColor);
        },

        initializeUI() {

        },

        initSettingDlg() {
            let keys = Object.keys(this.flags);
            keys.forEach(key => {
                if(key === 'language') {
                    this.flags[key] = true;
                } else {
                    if(key !== 'save') {
                        this.flags[key] = false;
                    } else {
                        Object.keys(this.flags.save).forEach(saveKey => {
                            this.flags.save[saveKey] = false;
                        })
                    }
                }
            })
        },

        initListItems() {
            this.datas.listItems.forEach(listItem => {
                if(listItem.id === 'language') {
                    listItem.active = true;
                } else {
                    listItem.active = false;
                }
            })
        },

        getWarningRate(warningRate) {
            this.datas.warningRate = warningRate;
        },

        getDate(date, type) {
            if(type === 'startdate') {
                this.datas.date.start = date;
            } else if(type === 'enddate') {
                this.datas.date.end = date;
            }
        },

        checkDate(date = null) {
            let checkdate = "";
            if(date !== null) {
                checkdate = date;
            } else {
                let today = new Date();
                checkdate = this.$moment(today).format('YYYY-MM-DD');
            }
            return checkdate;
        },

        getTargetBoothId(targetId) {
            this.datas.applicatorInfos.selectedTargetZoneInfos = [];
            this.datas.applicatorInfos.boothid = targetId.target;
            for(let i = 0; i < this.getZoneInfos.length; i++) {
                if(this.getZoneInfos[i].booth == targetId.target) {
                    this.datas.applicatorInfos.selectedTargetZoneInfos.push(this.getZoneInfos[i]);
                }
            }
        },

        getTargetZoneId(targetId) {
           this.datas.applicatorInfos.zoneid = targetId.target;
           if(this.datas.applicatorInfos.boothid !== undefined && this.datas.applicatorInfos.zoneid !== undefined) {
               this.getApplicatorHeaderDatas(this.datas.applicatorInfos);
           } else {
               this.datas.applicatorInfos.applicatorDatas = [];
           }
        },

        getSearchItem(type) {
            if(type === 'accum') {
                if(this.datas.date.start !== undefined && this.datas.date.end !== undefined) {
                    this.getAccumHistoryDatas(this.datas.date.start, this.datas.date.end);
                } else {
                    this.getAccumHistoryDatas();
                }
            } else if(type === 'range') {
                if(this.datas.date.start !== undefined && this.datas.date.end !== undefined) {
                    this.getRangeHistoryDatas(this.datas.date.start, this.datas.date.end);
                    this.datas.historyRangeDetailDatas = [];
                } else {
                    this.getRangeHistoryDatas();
                    this.datas.historyRangeDetailDatas = [];
                }
            }
        },

        clickListItem(title) {
            this.datas.listItems.forEach(listItem => {
                if(listItem.title === title) {
                    this.flags[listItem.id] = true;
                    listItem.active = true;
                    if(listItem.id === 'accum') {
                        this.getAccumHistoryDatas();
                    } else if(listItem.id === 'range') {
                        this.getRangeHistoryDatas();
                        this.datas.historyRangeDetailDatas = [];
                    }
                } else {
                    this.flags[listItem.id] = false;
                    listItem.active = false;
                }
            });
        },

        getAccumHistoryDatas(startdate = null, enddate = null) {
            let startDate = this.checkDate(startdate);
            let endDate = this.checkDate(enddate);
            this.flags.loading = true;
            this.$http.get(`/diagnostics/torqueloadfactor/data/history/accum/startdate/${startDate}/enddate/${endDate}`).then(result => {
                if(result.data.length > 0) {
                    let tempHistoryAccumDatas = [];
                    result.data.forEach(historyAccumData => {
                        for(let i = 1; i <= 7; i++) {
                            tempHistoryAccumDatas.push({
                                factoryid: historyAccumData.factory_id,
                                boothid: historyAccumData.booth_id,
                                boothname: historyAccumData.booth_name,
                                zoneid: historyAccumData.zone_id,
                                zonename: historyAccumData.zone_name,
                                robotid: historyAccumData.robot_id,
                                robotname: historyAccumData.robot_name,
                                jobname: historyAccumData.job_name,
                                axis: i,
                                avgcycle: String(historyAccumData.avg_cycle),
                                maxsum: String(historyAccumData['max_sum_'+i]),
                                minsum: String(historyAccumData['min_sum_'+i]),
                                avgsum: String(historyAccumData['avg_sum_'+i]),
                                maxwarning: String(historyAccumData['max_warning_'+i]),
                                minwarning: String(historyAccumData['min_warning_'+i]),
                                cyclewarning: String(historyAccumData['cycle_warning_'+i]),
                                flag: (Number(historyAccumData['avg_sum_'+i]) > Number(historyAccumData['max_warning_'+i]) || Number(historyAccumData['avg_sum_'+i]) < Number(historyAccumData['min_warning_'+i]))? true : false
                            })
                        }
                    })
                    this.datas.historyAccumDatas = tempHistoryAccumDatas;
                } else {
                    this.datas.historyAccumDatas = [];
                    this.flags.loading = false;
                }
            }).then(() => {
                this.datas.historyAccumDatas = this.datas.historyAccumDatas.sort(historyAccumData => {
                    return historyAccumData.flag === true? -1 : 1;
                })
                this.flags.loading = false;
            }).catch(error => {
                this.flags.loading = false;
                this.$log.error(error);
            })
        },

        getRangeHistoryDatas(startdate = null, enddate = null) {
            let startDate = this.checkDate(startdate);
            let endDate = this.checkDate(enddate);
            let tempHistoryRangeDatas = [];
            this.flags.loading = true;
            this.$http.get(`/diagnostics/torquerange/data/history/range/startdate/${startDate}/enddate/${endDate}`).then(res => {
                if(res.data.length > 0) {
                    res.data.forEach(rangeHistoryData => {
                        let tempHistoryRangeData = {};
                        tempHistoryRangeData['factoryid'] = rangeHistoryData.factory_id;
                        tempHistoryRangeData['boothid'] = rangeHistoryData.booth_id;
                        tempHistoryRangeData['boothname'] = rangeHistoryData.booth_name;
                        tempHistoryRangeData['zoneid'] = rangeHistoryData.zone_id;
                        tempHistoryRangeData['zonename'] = rangeHistoryData.zone_name;
                        tempHistoryRangeData['robotid'] = rangeHistoryData.robot_id;
                        tempHistoryRangeData['robotname'] = rangeHistoryData.robot_name;
                        tempHistoryRangeData['axis'] = rangeHistoryData.axis;
                        tempHistoryRangeData['jobname'] = rangeHistoryData.job_name;
                        tempHistoryRangeData['stepno'] = rangeHistoryData.stepno;
                        tempHistoryRangeData['max'] = rangeHistoryData.max;
                        tempHistoryRangeData['min'] = rangeHistoryData.min;
                        tempHistoryRangeData['check'] = false;
                        let violationstep = 0;
                        if(rangeHistoryData.max !== undefined && rangeHistoryData.min !== undefined) {
                            tempHistoryRangeData['maxwarning'] = rangeHistoryData.maxwarning;
                            tempHistoryRangeData['minwarning'] = rangeHistoryData.minwarning;
                            rangeHistoryData.stepno.forEach((stepno, index) => {
                                if(rangeHistoryData.max[index] !== null && rangeHistoryData.min[index] !== null) {
                                    if(Number(rangeHistoryData.max[index]) > Number(rangeHistoryData.maxwarning[index]) || Number(rangeHistoryData.min[index]) < Number(rangeHistoryData.minwarning[index])) {
                                        violationstep++;
                                    }
                                }
                            })
                        } else {
                            tempHistoryRangeData['maxwarning'] = [];
                            tempHistoryRangeData['minwarning'] = [];
                        }
                        tempHistoryRangeData['violationstep'] = String(violationstep);
                        tempHistoryRangeDatas.push(tempHistoryRangeData);
                    })
                }
            })
            .then(()=> {
                if(tempHistoryRangeDatas.length > 0) {
                    this.datas.historyRangeDatas = tempHistoryRangeDatas.sort((a, b) => {
                        if (Number(a.violationstep) < Number(b.violationstep)) {
                            return 1;
                        }
                        if (Number(a.violationstep) > Number(b.violationstep)) {
                            return -1;
                        }
                        return 0;
                    })
                } else {
                    this.datas.historyRangeDatas = [];
                }
                this.flags.loading = false;
            })
            .catch(error => {
                this.flags.loading = false;
                this.$log.error(error);
            })
        },

        getSaveUserSetData(saveUserData, type) {
            //saveUserData = kr, type = language 식으로 나옴
            this.datas.saveDatas[type] = saveUserData;
            if(type === this.datas.listItems[0].id) {
                this.datas.comfirm.type = 'save';
                this.datas.saveDatas.language = saveUserData;
            }
            if(type === this.datas.listItems[1].id) {
                this.datas.comfirm.type = 'save';
                this.datas.saveDatas.theme = saveUserData;
            }
        },

        getRangeDetailHistoryData(rangeHistoryData) {
            this.datas.tempHistoryRangeDetailDatas = rangeHistoryData;
            if(this.checkChangeDetailDatas(this.datas.historyRangeDetailDatas[this.datas.historyRangeDetailDatas.length-1], this.datas.changeDetailWarningSetDatas)) {
                this.datas.comfirm.type = 'change';
                this.datas.comfirm.flag = true;
            } else {
                if(this.flags.autoSet === true) {
                    this.datas.comfirm.type = 'change';
                    this.datas.comfirm.flag = true;
                    this.flags.autoSet = false;
                } else {
                    this.datas.historyRangeDetailDatas = [];
                    this.datas.historyRangeDatas.forEach(historyRangeData => {
                        if(historyRangeData.boothid === rangeHistoryData.boothid && historyRangeData.zoneid === rangeHistoryData.zoneid && historyRangeData.robotid === rangeHistoryData.robotid &&
                        historyRangeData.axis === rangeHistoryData.axis && rangeHistoryData.jobname === historyRangeData.jobname
                        ) {
                            this.datas.historyRangeDetailDatas.push(historyRangeData);
                        }
                    })
                }
            }

        },

        getRangeAutoSetDetailHistoryData(autoSetRangeHistoryData) {
            this.flags.autoSet = true;
            this.datas.historyRangeDetailDatas = [];
            this.datas.historyRangeDetailDatas.push(autoSetRangeHistoryData);
        },

        getApplicatorHeaderDatas(infos) {
            this.flags.loading = true;
            this.$http.get(`/diagnostics/atomizerData/data/gridtable/headers/factoryid/${this.getFactoryId}/boothid/${infos.boothid}/zoneid/${infos.zoneid}`).then(res => {
                if(res.data.length > 0) {
                    this.datas.applicatorInfos.applicatorDatas = [];
                    res.data.forEach(datas => {
                        datas.applicatordata_header.forEach((applicatorDataHeader, index) => {
                            this.datas.applicatorInfos.applicatorDatas.push(
                                {id: index, value: applicatorDataHeader}
                            )
                        })
                    })
                    this.flags.loading = false;
                }
            }).catch(error => {
                this.flags.loading = false;
                this.$log.error(error);
            })
        },

        getSaveWarningDatas(saveWarningDatas, type) {
            if(type === 'accum') {
                this.datas.comfirm.type = 'save';
                this.datas.saveDatas.accum = saveWarningDatas;
            }
            if(type === 'range') {
                this.datas.comfirm.type = 'save';
                this.datas.saveDatas.range = saveWarningDatas;
            }
        },

        getSaveMenuItems(saveMenuItems) {
            this.datas.comfirm.type = 'save';
            this.datas.saveDatas.menu = saveMenuItems;
        },

        saveMenuDatas(saveMenuDatas) {
            this.$store.dispatch('setMainMenuItems', saveMenuDatas.mainMenuItems);
            this.$store.dispatch('setDiagnosticsMenuItems', saveMenuDatas.diagnosticsMenuItems);
        },

        async saveAccumDatas(saveAccumDatas) {
            this.flags.loading = true;
            let index = 0;
            for (let saveAccumData of saveAccumDatas) {
                await this.$http.post(`/diagnostics/torqueloadfactor/data/set/warning`, {
                    factoryid: saveAccumData.factoryid,
                    boothid: saveAccumData.boothid,
                    zoneid: saveAccumData.zoneid,
                    robotid: saveAccumData.robotid,
                    jobname: saveAccumData.jobname,
                    axis: saveAccumData.axis,
                    workingtime: saveAccumData.cyclewarning,
                    configdata: {
                        maxsum: saveAccumData.maxwarning,
                        minsum: saveAccumData.minwarning
                    }
                }).then(result => {
                    if(saveAccumDatas.length-1 == index) {
                        this.flags.loading = false;
                        this.getAccumHistoryDatas(this.datas.date.start, this.datas.date.end);
                    } else {
                        index++;
                    }
                }).catch(error => {
                     this.$log.error(error);
                })
            }
        },

        checkStepNoData(saveRangeData) {
            return new Promise((resolve, reject) => {
                try {
                    let cloneSaveRangeData = JSON.parse(JSON.stringify(saveRangeData));
                    cloneSaveRangeData.stepno.forEach((stepno, index) => {
                        if(cloneSaveRangeData.max[index] === null && cloneSaveRangeData.min[index] === null) {
                            cloneSaveRangeData.stepno.splice(index,1);
                            cloneSaveRangeData.max.splice(index,1);
                            cloneSaveRangeData.min.splice(index,1);
                            cloneSaveRangeData.maxwarning.splice(index,1);
                            cloneSaveRangeData.minwarning.splice(index,1);
                        }
                    })
                    resolve(cloneSaveRangeData);
                }
                catch(error) {
                    reject(error);
                }
            })
        },
        async saveRangeDatas(saveRangeDatas) {
            this.flags.loading = true;
            let index = 0;
            for (let tempSaveRangeData of saveRangeDatas) {
                let saveRangeData = await this.checkStepNoData(tempSaveRangeData);
                await this.$http.post(`/diagnostics/torquerange/data/table/warning/to`, {
                    factoryid: saveRangeData.factoryid,
                    boothid: saveRangeData.boothid,
                    zoneid: saveRangeData.zoneid,
                    robotid: saveRangeData.robotid,
                    axis: saveRangeData.axis,
                    jobname: saveRangeData.jobname,
                    stepnoarr: `'{${saveRangeData.stepno}}'`,
                    minvalarr: `'{${saveRangeData.minwarning.map(i=>Number(i))}}'`,
                    maxvalarr: `'{${saveRangeData.maxwarning.map(i=>Number(i))}}'`
                }).then(result => {
                    if(saveRangeDatas.length-1 == index) {
                        this.flags.loading = false;
                        this.getRangeHistoryDatas(this.datas.date.start, this.datas.date.end);
                    } else {
                        index++;
                    }
                }).catch(error => {
                    this.flags.loading = false;
                    this.$log.error(error);
                })
            }
        },

        saveApplicatorDatas(saveApplicatorDatas) {
            this.flags.loading = true;
            this.$http.put(`/diagnostics/atomizerdata/data/gridtable/headers`, {
                boothid: saveApplicatorDatas.boothid,
                zoneid: saveApplicatorDatas.zoneid,
                applicatordataheader: `{${saveApplicatorDatas.applicatorDatas.map(i=>String(i.value))}}`
            }).then(res =>{
                this.flags.loading = false;
            }).catch(error => {
                this.$log.error(error);
            })
        },

        saveBtnClicked() {

            // this.datas.comfirm.type = 'save';
            // this.datas.saveDatas.language = saveUserData;
            //listItem.active는 설정창 왼쪽 세로 메뉴에서 선택된 (active) 상태의 item을 뜻함

            this.datas.listItems.forEach(listItem => {
                if(listItem.active === true) {
                    this.flags.save[listItem.id] = true;
                    if(listItem.id === 'applicatordata') {
                        this.datas.saveDatas.applicatordata = this.datas.applicatorInfos;
                    }
                    this.datas.comfirm.flag = true;
                } else {
                    this.flags.save[listItem.id] = false;
                }
            });


        },

        getComfirmFlag() {
            if(this.datas.comfirm.type === 'change') {
                Object.keys(this.flags.save).forEach(key => {
                    if(key === 'change') {
                        this.flags.save[key] = true;
                    } else {
                        this.flags.save[key] = false;
                    }
                })
            }
            Object.keys(this.flags.save).forEach(key => {
                if(this.flags.save[key] === true) {
                    if(key === this.datas.listItems[0].id) {
                        sessionStorage.setItem('language', this.datas.saveDatas[key]);
                        this.$store.dispatch('setLanguage', this.datas.saveDatas[key]);
                        this.flags.save[key] = false;
                        location.reload();
                    } else if(key === this.datas.listItems[1].id) {
                        this.datas.themeItems.items.forEach(themeItem => {
                            if(themeItem.id === this.datas.saveDatas[key]) {
                                sessionStorage.setItem('theme', themeItem.value);
                                this.$store.dispatch('changeTheme', themeItem.value);
                                this.flags.save[key] = false;
                                location.reload();
                            }
                        })
                        this.flags.save[key] = false;
                    } else if(key === this.datas.listItems[2].id) {
                        this.saveAccumDatas(this.datas.saveDatas[key]);
                        this.flags.save[key] = false;
                        this.flags.autoSet = false;
                    } else if(key === this.datas.listItems[3].id) {
                        if(Object.keys(this.datas.changeDetailWarningSetDatas).length > 0) {
                            this.saveRangeDatas([this.setChangeRangeDatas(this.datas.historyRangeDetailDatas[this.datas.historyRangeDetailDatas.length-1], this.datas.changeDetailWarningSetDatas)]);
                            this.datas.changeDetailWarningSetDatas = [];
                            this.datas.historyRangeDetailDatas = [];
                        } else {
                            this.saveRangeDatas(this.datas.saveDatas[key]);
                            this.datas.historyRangeDetailDatas = [];
                        }
                        this.flags.save[key] = false;
                        this.flags.autoSet = false;
                    } else if(key === this.datas.listItems[4].id) {
                        this.saveApplicatorDatas(this.datas.saveDatas[key]);
                        this.flags.save[key] = false;
                    } else if(key === this.datas.listItems[5].id) {
                        this.saveMenuDatas(this.datas.saveDatas[key]);
                        this.flags.save[key] = false;
                    } else if(key === 'change') {
                        this.saveRangeDatas([this.setChangeRangeDatas(this.datas.historyRangeDetailDatas[this.datas.historyRangeDetailDatas.length-1], this.datas.changeDetailWarningSetDatas)]);
                        this.datas.historyRangeDetailDatas = [];
                        this.datas.historyRangeDetailDatas.push(this.datas.tempHistoryRangeDetailDatas);
                        this.datas.changeDetailWarningSetDatas = [];
                        this.flags.save[key] = false;
                    }
                }
            })
            this.datas.comfirm.type = "";
            this.datas.comfirm.flag = false;
        },

        getChangeDetailWarningSetDatas(changeDetailWarningSetDatas) {
            this.setViolationStep(changeDetailWarningSetDatas.configDatas,this.getViolationStep(changeDetailWarningSetDatas.changeDatas));
            this.datas.changeDetailWarningSetDatas = changeDetailWarningSetDatas;
        },

        getViolationStep(changeDetailWarningSetDatas) {
            let violationStep = 0;
            changeDetailWarningSetDatas.forEach(changeData => {
                if(Number(changeData.max) > Number(changeData.maxwarning) || Number(changeData.min) < Number(changeData.minwarning)) {
                    violationStep++;
                }
            })
            return violationStep;
        },

        setViolationStep(configData, violationStep = null) {
            this.datas.historyRangeDatas.forEach(historyRangeData => {
                if(historyRangeData.boothid === configData.boothid && historyRangeData.zoneid === configData.zoneid && historyRangeData.robotid === configData.robotid &&
                historyRangeData.axis === configData.axis && historyRangeData.jobname === configData.jobname
                ) {
                    if(violationStep !== null) {
                        this.datas.tempViolationStep = historyRangeData.violationstep;
                        historyRangeData.violationstep = String(violationStep);
                    }
                    else {
                        historyRangeData.violationstep = String(this.datas.tempViolationStep);
                    }
                    this.flags.render = true;
                }
            });
        },

        getDetailWarningSetDatas(detailWarningSetDatas) {
            let changeFlag = false;
            let index = "";
            this.datas.historyRangeDatas.forEach((historyRangeData, historyRangeDataIndex) => {
                if(historyRangeData.boothid === detailWarningSetDatas.config.boothid && historyRangeData.zoneid === detailWarningSetDatas.config.zoneid && historyRangeData.robotid === detailWarningSetDatas.config.robotid &&
                historyRangeData.axis === detailWarningSetDatas.config.axis && historyRangeData.jobname === detailWarningSetDatas.config.jobname) {
                    index = historyRangeDataIndex;
                    historyRangeData.stepno.forEach((historyRangeDataStepNo, stepIndex) => {
                        if(Number(historyRangeData.maxwarning[historyRangeDataStepNo-1]) !== Number(detailWarningSetDatas.datas[stepIndex].maxwarning)) {
                            changeFlag = true;
                            historyRangeData.maxwarning[historyRangeDataStepNo-1] = detailWarningSetDatas.datas[stepIndex].maxwarning;
                        }
                        if(Number(historyRangeData.minwarning[historyRangeDataStepNo-1]) !== Number(detailWarningSetDatas.datas[stepIndex].minwarning)) {
                            changeFlag = true;
                            historyRangeData.minwarning[historyRangeDataStepNo-1] = detailWarningSetDatas.datas[stepIndex].minwarning;
                        }
                    })
                }
            })
            if(changeFlag === true) {
                this.datas.comfirm.type = 'save';
                this.datas.saveDatas.range = tempHistoryRangeDatas[index];
                this.flags.save.range = true;
                this.datas.comfirm.flag = true;
            } else {

            }
            this.flags.checkRangeDetailData = false;
        },

        isEmptyObject(param) {
            return Object.keys(param).length === 0;
        },

        sortChangeDatas(changeDatas) {
            changeDatas.sort((a,b) => {
                if (a.stepno > b.stepno) {
                    return 1;
                }
                if (a.stepno < b.stepno) {
                    return -1;
                }
            })
        },

        checkChangeDetailDatas(originalDatas, compareDatas) {
            let changeFlag = false;
            if(this.isEmptyObject(compareDatas) === false) {
                if(originalDatas.boothid === compareDatas.configDatas.boothid && originalDatas.zoneid === compareDatas.configDatas.zoneid && originalDatas.robotid === compareDatas.configDatas.robotid &&
                originalDatas.axis === compareDatas.configDatas.axis && originalDatas.jobname === compareDatas.configDatas.jobname) {
                    originalDatas.stepno.forEach((historyRangeDataStepNo, stepIndex) => {
                        compareDatas.changeDatas.forEach((changeData, changeIndex) => {
                            if(historyRangeDataStepNo === changeData.stepno) {
                                if(originalDatas.maxwarning[historyRangeDataStepNo-1] !== changeData.maxwarning) {
                                    changeFlag = true;
                                    return false;
                                }
                                if(originalDatas.minwarning[historyRangeDataStepNo-1] !== changeData.minwarning) {
                                    changeFlag = true;
                                    return false;
                                }
                            }
                        })
                    })
                }
            }
            return changeFlag;
        },

        setChangeRangeDatas(originalDatas, compareDatas) {
            this.sortChangeDatas(compareDatas.changeDatas);
            originalDatas.stepno.forEach((historyRangeDataStepNo, stepIndex) => {
                compareDatas.changeDatas.forEach((changeData, changeIndex) => {
                    if(historyRangeDataStepNo === changeData.stepno) {
                        if(originalDatas.maxwarning[historyRangeDataStepNo-1] !== changeData.maxwarning) {
                            originalDatas.maxwarning[historyRangeDataStepNo-1] = changeData.maxwarning;
                        }
                        if(originalDatas.minwarning[historyRangeDataStepNo-1] !== changeData.minwarning) {
                            originalDatas.minwarning[historyRangeDataStepNo-1] = changeData.minwarning;
                        }
                    }
                })
            })
            return originalDatas;
        },

        closeComfirmFlag() {
            if(this.datas.comfirm.type === 'change') {
                this.flags.cancel = true;
                this.setViolationStep(this.datas.historyRangeDetailDatas[this.datas.historyRangeDetailDatas.length-1]);
                this.datas.historyRangeDetailDatas = [];
                this.datas.historyRangeDetailDatas.push(this.datas.tempHistoryRangeDetailDatas);
                this.datas.changeDetailWarningSetDatas = [];
            }
            this.datas.comfirm.type = "";
            this.datas.comfirm.flag = false;
        },

        closeBtnClicked() {
            this.initSettingDlg();
            this.initListItems();
            this.$emit('closeSettingDlg');
        }
    }
}
</script>

<style scoped lang="scss">
   @import'./settingdlg.scss';
    .settingDlgTitle {
      font-weight: bold;
      font-size: 20px;
    }
    .settingDlgSelector {
      height: 34px;
      width: 100%;
    }
    .settingDlgCard {
      height: 800px;
      background-color: var(--settingDlgCardBackgroundColor) !important;
    }
    .settingDlgList {
      background-color: var(--settingDlgListBackgroundColor) !important;
    }
    .v-list__tile__title {
      font-weight: bold;
    }
    .settingDlgListTile:hover {
      background-color: var(--settingDlgListTileHoverColor) !important;
    }
    .applicatorNum {
      margin-top: 20px;
      margin-left: 50px;
      color: var(--applicatorNumColor) !important;
      font-size: 16px;
      font-weight: bold;
    }
    .applicatorInput {
      height: 48px;
      margin-left: 15px;
      background-color: #ffffff;
      border: solid 2px var(--applicatorInputBorderColor) !important;
      border-radius: 2px;
    }
</style>