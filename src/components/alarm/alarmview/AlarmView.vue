<template>
    <v-layout wrap row v-bind="getNodeInfo">
        <v-flex class="pl-2 pr-2" lg2>
            <date-picker
                v-bind:style="ui.selectorStyle"
                v-bind:placeHolder="ui.prevDate"
                v-bind:setDate="setPrevDate()"
                v-on:getDate="getPrevDate"
            ></date-picker>
        </v-flex>
        <v-flex class="pl-2 pr-2" lg2>
            <date-picker
                v-bind:style="ui.selectorStyle"
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
                v-bind:style="ui.selectorStyle"
                v-bind:selectorTitle="ui.alarmType"
                v-bind:selectorOptions="datas.alarmTypes"
                v-on:selectedTarget="getTargetAlarmTypes"
            ></selector>
        </v-flex>
        <v-flex class="pl-2 pr-2" lg2>
            <selector
                v-bind:style="ui.selectorStyle"
                v-bind:selectorTitle="ui.alarmStatus"
                v-bind:selectorOptions="datas.alarmStatus"
                v-on:selectedTarget="getTargetAlarmStatus"
            ></selector>
        </v-flex>
        <v-flex class="pl-2 pr-2">
            <multi-selector
                class="FilterSelector"
                v-bind:selectorTitle="ui.selectAlarmCode"
                v-bind:selectorOptions="datas.alarmCodes"
                v-on:selectedTargets="getTargetAlarmCodes"
            >
            </multi-selector>
        </v-flex>
        <!-- <v-flex class="ml-2 mr-2" lg1>
            <v-checkbox
                v-bind:style="ui.checkboxStyle"
                v-model="flags.isUseAlarmCode "
                @change="getAlarmCodeFlag(flags.isUseAlarmCode)"
                :label="ui.useAlarmCode"
            ></v-checkbox>
        </v-flex>
        <v-flex class="alaramInputBox pl-2" lg2>
        <div class="pl-2 lg2">
            <input
                v-bind:style="ui.inputStyle"
                @input="setAlarmCode($event.target.value)"
                :readonly="!flags.isUseAlarmCode" >
        </div>
        </v-flex> -->
        <v-spacer/>
        <v-btn v-bind:style="ui.buttonStyle"  @click="searchBtnClicked">
            <a class="pt-1"><img :src="ui.searchBtnIcon"></a>
        </v-btn>

        <v-flex xs12 lg12>
            <loading-dlg v-bind:loadingFlag="flags.loading"></loading-dlg>
            <alarm-view
                v-bind:headerData="datas.infoTableHeaderData"
                v-bind:contentData="datas.infoTableContentData"
            ></alarm-view>
        </v-flex>
        </v-layout>
</template>

<script>
import {mapGetters} from 'vuex';
import datePicker from '@/commons/DatePicker';
import selector from '@/commons/Selector';
import MultiSelector from '@/commons/MultiSelector'
import alarmView from '@/components/alarm/alarmview/alarmview/GridTableWithDialog';
import loadingDlg from '@/commons/LoadingDlg'
// import { SetLeftFeature } from 'ag-grid-community';
export default {
    components: {
        selector,
        MultiSelector,
        datePicker,
        alarmView,
        loadingDlg
    },
    props: ['nodeInfo'],
    data() {
        return {
            ui: {
                prevDate:       this.$t(`alarmView.prevDate`),
                currDate:       this.$t(`alarmView.currDate`),
                booth:          this.$t(`alarmView.booth`),
                zone:           this.$t(`alarmView.zone`),
                robot:          this.$t(`alarmView.robot`),
                alarmType:      this.$t(`alarmView.alarmType`),
                alarmStatus:    this.$t(`alarmView.alarmStatus`),
                selectAlarmCode:    this.$t(`alarmView.selectAlarmCode`),
                useAlarmCode:   this.$t(`alarmView.useAlarmCode`),
                alarmCode:      this.$t(`alarmView.alarmCode`),
                searchBtnIcon: require("@/images/search_icon.png"),
                createBtnIcon: require("@/images/create_icon.png"),
                sectorIcon: require("@/images/selector_icon.png"),
                selectorStyle: {
                    height: "34px",
                    width: "100%"
                },
                inputStyle: {
                    height: "34px",
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: '',
                    border: '',
                },
                checkboxStyle: {
                    marginTop: "0px"
                },
                buttonStyle: {
                    height: '33px',
                    backgroundColor: '',
                }
            },
            datas: {
                infoTableHeaderData: [
                    { text: this.$t(`alarmView.infoTableHeaderData.booth`),     value: 'booth',   sortable: false, align: 'center'},
                    { text: this.$t(`alarmView.infoTableHeaderData.zone`),       value: 'zone',     sortable: false, align: 'center'},
                    { text: this.$t(`alarmView.infoTableHeaderData.robot`),     value: 'robot',   sortable: false, align: 'center'},
                    { text: this.$t(`alarmView.infoTableHeaderData.alarmCode`),  value: 'alarmcode',   sortable: false, align: 'center'},
                    { text: this.$t(`alarmView.infoTableHeaderData.alarm`),     value: 'alarm',   sortable: false, align: 'center'},
                    { text: this.$t(`alarmView.infoTableHeaderData.occurTime`),  value: 'timestamp',   sortable: false, align: 'center'},
                    { text: this.$t(`alarmView.infoTableHeaderData.manual`),    value: 'manual',   sortable: false, align: 'center'}
                ],
                infoTableContentData: [],
                alarmTypes: [],
                alarmStatus: [
                    { id: 0, name: "OPEN"},
                    { id: 1, name: "CLOSE"}
                ],
                alarmCodes: [],
                searchDatas: {},
                postDatas: {}
            },
            flags: {
                loading: false,
                isUseAlarmCode: false
            }
        }
    },
    computed: {
        getNodeInfo() {
            if(Object.keys(this.nodeInfo).length > 0) {
                this.initDatas();
                this.setNodeInfo(this.nodeInfo);
            }
        },
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
        }),
    },
    mounted() {
        this.setAlarmType();
        this.initializeStyle();
        this.getAlarmCode();
    },
    methods: {
        initializeStyle() {
            this.ui.inputStyle.backgroundColor = this.$style.alarm.inputStyleBackgroundColor;
            this.ui.inputStyle.border = this.$style.alarm.inputStyleBorder;
            this.ui.buttonStyle.backgroundColor = this.$style.alarm.buttonStyleBackgroundColor;
        },
        initDatas() {
            this.datas.searchDatas = {};
            this.datas.postDatas = {};
        },
        initCSS() {
            $("table.v-table tbody tr td").css("background-color", this.$style.alarm.alarmViewItemTableBackgroundColor);
        },

        getPrevDate(prevDate) {
            this.datas.searchDatas.prevDate = prevDate;
            if(this.checkSearchDatas(this.datas.searchDatas)) {
                this.getAlarmCode(this.datas.searchDatas.prevDate, this.datas.searchDatas.currDate);
            }
        },

        getCurrDate(currDate) {
            this.datas.searchDatas.currDate = currDate;
            if(this.checkSearchDatas(this.datas.searchDatas)) {
                this.getAlarmCode(this.datas.searchDatas.prevDate, this.datas.searchDatas.currDate);
            }
        },
        getAlarmCode(prevDate, currDate){
            let postDatas = {};
            postDatas['factoryid'] = this.getFactoryId;
            postDatas['prevtime'] = prevDate;
            postDatas['currtime'] = currDate;
            this.$http.post(`${this.baseUrl}/diagnostics/alarmstatistics/data/alarm/code`, postDatas)
            .then((result) => {
                if(result.data != '') {
                    let data = [];
                    Object.keys(result.data).forEach(function eachKey(key) {
                        data.push({
                            id: key,
                            name: result.data[key].code
                        });
                    });
                    this.datas.alarmCodes = data;
                }
                else {
                    this.datas.alarmCodes = [];
                }

            }).catch((error) => {
                this.$log.error(error);
            })
        },
        getTargetAlarmCodes(selectedAlarmCodes){
            let tempAlarmCodes = '';
            for(let i = 0; i < selectedAlarmCodes.length; i++) {
                let tempdata = "'" + selectedAlarmCodes[i] + "'"
                if(i == selectedAlarmCodes.length - 1) {
                    tempAlarmCodes += tempdata;
                }
                else {
                    tempAlarmCodes += (tempdata + ',');
                }
            }
            this.datas.searchDatas['selectedAlarmCodes'] = tempAlarmCodes;
        },

        getAlarmCodeFlag(alarmCodeFlag) {
            if(alarmCodeFlag === false && this.datas.searchDatas.alarmcode !== undefined) {
                delete this.datas.searchDatas.alarmcode;
            }
        },

        setNodeInfo(nodeInfo) {
            Object.keys(nodeInfo).forEach(node => {
                if(node !== 'robottype') {
                    this.datas.searchDatas[node] = nodeInfo[node];
                }
            })
        },

        setLoadingDlg(flag) {
            this.flags.loading = flag;
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
        setAlarmType() {
            this.$http.get(`/diagnostics/alarmstatistics/data/alarm/type`)
            .then((result) => {
                if(result.data.length > 0) {
                    this.datas.alarmTypes = result.data;
                }
                else {
                    // alarmtype 없음..
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        getTargetAlarmTypes(targetAlarm) {
            if (typeof targetAlarm !== 'string') {
                this.datas.searchDatas.alarmtype = targetAlarm.target;
            } else {
                delete this.datas.searchDatas.alarmtype;
            }
        },

        setAlarmCode(code) {
            if(code !== '') {
                this.datas.searchDatas.alarmcode = code;
            } else {
                delete this.datas.searchDatas.alarmcode;
            }
        },
        getTargetAlarmStatus(status) {
            if (typeof status !== 'string') {
                this.datas.searchDatas.alarmstatus = status.target;
            } else {
                delete this.datas.searchDatas.alarmstatus;
            }
        },
        searchBtnClicked() {
            this.datas.postDatas = {};
            Object.assign(this.datas.postDatas, this.datas.searchDatas);
            this.datas.infoTableContentData = [];
            this.setLoadingDlg(true);
            this.$http.post(`/alarmview/data/gridtable`, this.datas.postDatas).then((result) => {
                if(result.data.length > 0) {
                    result.data.forEach(alarmInfo => {
                        this.datas.infoTableContentData.push(
                            {
                                booth: alarmInfo.booth_name,
                                zone: alarmInfo.zone_name,
                                robot: alarmInfo.robot_name,
                                alarmcode: alarmInfo.alarm_code,
                                alarm: (alarmInfo.alarm_name === null) ? 'null' : alarmInfo.alarm_name,
                                occur_time: (alarmInfo.update_time === null) ? 'null' : alarmInfo.update_time.replace('T', ' ').replace('Z', ''),
                                alarmid: alarmInfo.alarm_id,
                                alarmstatus: alarmInfo.alarm_status,
                                alarmtype: alarmInfo.alarm_type,
                                timestamp: (alarmInfo.time_stamp === null) ? 'null' : alarmInfo.time_stamp.replace('T', ' ').replace('Z', '')
                            }
                        )
                    })
                }
                else {
                    this.$popmsg(this.$t(`alarmView.popMsg.noSearchDatas`));
                    this.initCSS();
                }
                this.setLoadingDlg(false);

            }).catch((error) => {
                this.$log.error(error);
                this.setLoadingDlg(false);
            })
        },
        checkSearchDatas(searchDatas) {
            if(searchDatas.prevDate != undefined && searchDatas.currDate != undefined && this.dateCompare(searchDatas.prevDate, searchDatas.currDate)) {
                return true;
            }
            else {
                return false;
            }
        },
        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);
            return preDate <= currDate;
        },
    }
}
</script>

<style scoped lang="scss">
    @import './alarmview';
</style>
