<template>
    <v-layout :class="['atomizer']" column>
        <v-layout v-for="(robotItem, robotIndex) in datas.robotItems"
            :key="robotItem.robot_id"
            :class="['atomizer__robotInfo']">
            <p>{{robotItem.robot_name}}</p>
            <atomizer-board
                :reportItem="reportItem"
                :prevReport="prevReport"
                :selectedZoneItem="datas.zoneItem[0]"
                :selectedBoothItem="datas.boothItem[0]"
                :robotItem="robotItem"
                :atomizerReportItem="datas.atomizerReportItems.reportAtomizerItem.data[robotIndex]"
                v-on:onCloseAtomizerPredictModalHandler="closeAtomizerPredictModal"
            />
        </v-layout>
        <v-card :class="['atomizer__card']">
            <v-layout>
                <v-flex :class="['atomizer__card-title']">
                    <p>도장기 알람 리스트</p>
                </v-flex>
                <v-flex :class="['atomizer__card-icon']"><v-icon>mdi-arrow-down</v-icon></v-flex>
            </v-layout>
        </v-card>
        <alarm-list-table
            v-bind:headerData="headerItem"
            v-bind:contentData="datas.atomizerAlarmItems"
            v-on:clickedItem="clickedItemHandler"
        />
        <atomizer-alarm-modal
            :title="ui.atomizerAlarmDlgTitle"
            :is-open="datas.isAtomizerAlarmDlgOpen"
            :info-items="datas.atomizerInfoItems"
            :trend-items="datas.atomizerTrendItems"
            :list-items="datas.atomizerListItems"
            :entire-list-items="datas.atomizerEntireListItems"
            v-on:onClickAtomizerListItem="getClickedAtomizerListItem"
            v-on:onCloseModal="datas.isAtomizerAlarmDlgOpen = false"
        />
        <v-dialog v-model="datas.event.dialog" hide-overlay persistent width="300">
            <v-card color="indigo" dark>
                <v-card-text>
                    Loading...
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>

import { deepClone, setRobotItems } from "@/utils/utils";
import { convertLevelToIcon } from '@/utils/alarm';
import { mapGetters } from "vuex";
import AtomizerBoard from "@/components/report/report/Atomizer/AtomizerBoard.vue";
import AlarmListTable from '@/components/diagnostics/report/report/alarmAnalysis/AlarmListTable';
import AtomizerAlarmModal from "@/commons/alarm/atomizeralarmmodal/AtomizerAlarmModal";
import ReportZoneOpinion from '@/components/report/report/ReportZoneOpinion.vue'
import {
    atomizerInfoAPI,
    atomizerTrendAPI,
    atomizerListAPI,
    atomizerEntireListAPI
} from '@/api/alarmAPI';
export default {
    components: { AtomizerBoard , AlarmListTable, AtomizerAlarmModal, ReportZoneOpinion },
    props: {
        /** 선택된 존 아이템 목록 */
        reportItem : {
            type: Object,
            required: true
        },
        prevReport : {
            type: Object,
            default : {}
        },
        headerItem : {
            type: Array
        },
        reportAtomizerData : {

        }

    },
    data(){
        return {
            ui : {
                atomizerAlarmDlgTitle: '도장기 알람 상세'
            },
            datas : {
                robotItems : [],
                zoneItem : [],
                boothItem : [],
                atomizerInfoItems: [],
                atomizerTrendItems: [],
                atomizerListItems: [],
                atomizerEntireListItems: [],
                event: {
                    dialog: false
                },
                isAtomizerAlarmDlgOpen: false,
                atomizerReportItems: {},
                atomizerAlarmItems : []
            }
        }
    },
    computed: {
        ...mapGetters({
            'boothInfos': 'getRenewBoothInfos',
            'zoneInfos': 'getRenewZoneInfos',
            'robotInfos': 'getRenewRobotInfos',
            'getLanguage': 'getLanguage'
        }),
    },
    watch: {
        reportItem: {
            immediate: true,
            deep : true,
            handler(reportItem) {
                this.setFactoryInfo(reportItem);
            }
        },
        reportAtomizerData : {
            immediate: true,
            handler(val){
                this.setAtomizerReportItem(val);
            }
        }
    },
    created() {
        this.setFactoryInfo(this.reportItem);
    },


    methods: {
        setFactoryInfo(reportItem){
            const robotItems = setRobotItems(this.robotInfos, reportItem.zone_id);
            this.datas.robotItems = robotItems ? robotItems.sort(function (a,b){return a.robot_no < b.robot_no ? -1 : 1}) : [];
            this.datas.zoneItem = this.zoneInfos.filter(zone => zone.zone_id === reportItem.zone_id)
            this.datas.boothItem = this.boothInfos.filter(booth => booth.booth_id === this.datas.zoneItem[0].booth_id)
            this.setAtomizerReportItem(this.reportAtomizerData);
            this.getAtomizerAlarm(reportItem);
        },

        setAtomizerReportItem(reportAtomizerData){
            const reportAtomizerItem = deepClone(reportAtomizerData)
            this.datas.atomizerReportItems = ({reportAtomizerItem, ...this.datas.zoneItem[0]})
        },

        async getAtomizerAlarm(reportItem){
            const reportData = {
                language : this.getLanguage,
                alarmlevel : "'1','2'",
                zoneid : reportItem.zone_id,
                startdate : reportItem.start_date,
                enddate : reportItem.end_date
            }

            await this.$http.post(`/diagnostics/alarmstatistics/renew/zone/data/gridtable`, reportData)
            .then((zoneAlarm) => {
                this.datas.atomizerAlarmItems =  zoneAlarm.data && zoneAlarm.data !== '' && Array.isArray(zoneAlarm.data) ? (
                    zoneAlarm.data.forEach(zoneAlarmItem => { zoneAlarmItem.level = convertLevelToIcon(zoneAlarmItem.level)}),
                    zoneAlarm.data.filter(zoneAlarmItem => zoneAlarmItem.type_id === 2)) : []
            })
            .catch((err) => {
                console.log(err)
                this.datas.atomizerAlarmItems = [];
            })
        },

        closeAtomizerPredictModal(data){
            this.$emit('onCloseAtomizerPredictModal', data)
        },

        clickedItemHandler(item) {
            this.setLoadingDialog(true);
            this.getAtomizerAlarmItems(item);
        },

        getAtomizerAlarmItems(item) {
            Promise.all([atomizerInfoAPI(item), atomizerTrendAPI(item), atomizerListAPI(item), atomizerEntireListAPI(item)])
            .then(([atomizerInfoRes, atomizerTrendRes, atomizerListRes, atomizerEntireListRes]) => {
                this.datas.atomizerInfoItems = atomizerInfoRes.data.length > 0 ? atomizerInfoRes.data : [];
                this.datas.atomizerTrendItems = atomizerTrendRes.data.length > 0 ? atomizerTrendRes.data : [];
                this.datas.atomizerListItems = atomizerListRes.data.length > 0 ? atomizerListRes.data : [];
                this.datas.atomizerEntireListItems = atomizerEntireListRes.data.length > 0 ? atomizerEntireListRes.data : [];
            })
            .then(() => {
                this.setLoadingDialog(false);
                this.datas.isAtomizerAlarmDlgOpen = true;
            })
            .catch((error) => {
                this.setLoadingDialog(false);
                console.error(error);
            })
        },

        getAtomierEntireAlarmItems(item) {
            Promise.all([atomizerInfoAPI(item), atomizerTrendAPI(item), atomizerListAPI(item), atomizerEntireListAPI(item)])
                .then(([atomizerInfoRes, atomizerTrendRes ]) => {
                    this.datas.atomizerInfoItems = atomizerInfoRes.data.length > 0 ? atomizerInfoRes.data : [];
                    this.datas.atomizerTrendItems = atomizerTrendRes.data.length > 0 ? atomizerTrendRes.data : [];
                })
                .then(() => {
                    this.setLoadingDialog(false);
                    this.datas.isAtomizerAlarmDlgOpen = true;
                })
                .catch((error) => {
                    this.setLoadingDialog(false);
                    console.error(error);
                })
        },

        getClickedAtomizerListItem(item) {
            this.getAtomierEntireAlarmItems(item);
        },

        setLoadingDialog(flag) {
            this.datas.event.dialog = flag;
        },


    }
}
</script>
<style lang="scss" scoped>
    @import './AtomizerAnalysis.scss'
</style>