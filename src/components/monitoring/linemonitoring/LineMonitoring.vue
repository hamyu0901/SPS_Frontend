<template>
    <v-layout :class="['line-monitoring']" column fill-height>
        <p :class="['line-monitoring-title']">{{datas.factoryName}}</p>
        <v-layout :class="['line-monitoring__information']">
            <card-carousel
                :title="datas.carouselTitle"
                :items="datas.alarmItems"
                :multiple-item-count="3"
                @onClickTodayAlarmBtnHandler="clickTodayAlarmBtn"
            >
                <template #cardItem="items">
                    <alarm-card v-for="(item, index) in items" :key="'alarmCard' + index" :alarm-items="item" @onClickAlarmCardItemHandler="clickAlarmCard"/>
                </template>
            </card-carousel>
            <v-img
                :max-width="500"
                :max-height="240"
                :min-width="500"
                :min-height="240"
                :class="['line-monitoring__information-image']"
                :alt="'alarm status information bard'"
                :src="datas.informationBoardImg"
            />
        </v-layout>
        <base-modal
            :title="datas.alarmInfoModalTitle"
            :is-open="datas.isAlarmCardOpen"
            @onCloseModal="closeRobotAlarmModalHandler"
        >
            <base-alarm-info-list :robot-alarm-info-items="datas.alarmInfoItems"/>
        </base-modal>
        <base-modal
            :title="datas.todyAlarmModalTitle"
            :is-open="datas.isTodayAlarmListOpen"
            @onCloseModal="closeTodayAlarmModalHandler"
            :width="1700"
        >
            <v-btn-toggle v-model="datas.isAlarmOccurrenceType" mandatory style="background-color: #26233E">
              <v-btn v-for="alarmOccurrenceType in datas.alarmOccurrenceType" :key="alarmOccurrenceType.type" :value="alarmOccurrenceType.type" style="background-color: #333A5F">
                {{alarmOccurrenceType.title}}
              </v-btn>
            </v-btn-toggle>
            <base-table
                :class="['line-monitoring-table']"
                :header-items="datas.alarmInfoTableHeaderData"
                :content-items="occurrenceTypeAlarmItems"
                :has-initial-sort="false"
            />
        </base-modal>
        <v-layout :class="['line-monitoring__layout']" column>
            <booth-layout
              v-for="boothInfo in boothInfos"
              :key="boothInfo.disp_booth_id"
              :boothItem="boothInfo"
              :zoneItems="convertToZoneItems(boothInfo.booth_id)"
              :zone-alarm-items="datas.zoneAlarmItems"
            />
        </v-layout>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { getFactoryNameAPI, getLineZoneAlarmItemsAPI, getHisAlarmItemsAPI, getLineRobotAlarmRemedyItemsAPI } from '@/api/monitoringAPI'
import { convertLevelToIcon } from '@/utils/alarm';
import { checkAlarm, judgeZoneAlarm, removeItems } from '@/utils/monitoring';
import { map, difference, filter, includes, get } from "lodash";
import { getSpcAlarmListAPI } from "@/api/alarmAPI";
import BoothLayout from './boothlayout/BoothLayout.vue'
import AlarmCard from "@/components/monitoring/linemonitoring/alarmcard/AlarmCard";
import CardCarousel from "@/components/monitoring/linemonitoring/cardcarousel/CardCarousel";
import BaseModal from '@/commons/basemodal/BaseModal';
import BaseTable from "@/commons/basetable/BaseTable";
import BaseAlarmInfoList from "@/commons/basealarminfolist/BaseAlarmInfoList.vue";

export default {
    components: { BoothLayout, AlarmCard, CardCarousel, BaseModal, BaseTable , BaseAlarmInfoList },
    data: (vm) => ({
        datas: {
            /** 타이머 */
            timer: null,
            /** 리로드 체크 시간 (1시간) */
            intervalTime: 3600000, // [TODO]: 추후 설정할 수 있도록 반영 예정
            /**  공장 이름  */
            factoryName: '',
            /** 로봇 상태 표시판 이미지 */
            informationBoardImg: '',
            /** 실시간 존 알람 목록 */
            zoneAlarmItems: [],
            /** 실시간 알람 목록 */
            alarmItems: [],
            /** 실시간 알람 이력 타이틀 */
            carouselTitle: vm.$t('monitoring.line.title.carouselTitle'),
            /** 오늘 알람 이력 모달 타이틀 */
            todyAlarmModalTitle : vm.$t('monitoring.line.title.alarmTableTitle'),
            /** 실시간 로봇 알람 모달 타이틀 */
            alarmInfoModalTitle: vm.$t('monitoring.line.title.alarmInfo'),
            /** 알람 모달 */
            isTodayAlarmListOpen : false,
            isAlarmCardOpen : false,
            /** 존, 로봇 알람 이력 목록 */
            hisAlarmItems: [],
            alarmInfoItems: [],
            alarmInfoTableHeaderData: [
                { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.date`), value: 'date', type: 'text', align: 'center'},
                { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmtypename`), value: 'type', type: 'text', align: 'center'},
                { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmcode`), value: 'code', type: 'text', align: 'center'},
                { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmname`), value: 'contents', type: 'text', align: 'center'},
                { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.zonename`), value: 'zone_name', type: 'text', align: 'center'},
                { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.jobname`), value: 'job_name', type: 'text', align: 'center'},
                { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.robotname`), value: 'robot_name', type: 'text', align: 'center'},
                { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.level`), value: 'level', type: 'img', align: 'center'}
            ],
            alarmOccurrenceType: [
              { type: 'occurrence', title: vm.$t('monitoring.line.cardCarousel.modal.btn.occurAlarm') },
              { type: 'release', title: vm.$t('monitoring.line.cardCarousel.modal.btn.nonOccurAlarm') }
            ],
            isAlarmOccurrenceType: 'occurrence',
            releaseAlarmItems: [],
        }
    }),

    async created() {
        this.datas.factoryName = await this.getFactoryName();
        this.datas.alarmItems = await this.getLineZoneAlarmItems();
        this.datas.zoneAlarmItems = this.datas.alarmItems.filter(alarm => alarm.type_id !== 0)
        this.datas.informationBoardImg = this.setRobotBoardImage();
        this.socketRobotStatusEmit();
        this.socketZoneAlarmEmit();
        this.subscribeZoneAlarm();
    },

    mounted() {
        this.setTimeInterval();
    },

    destroyed() {
        this.unsubscribeZoneAlarm();
        this.clearTimeInterval();
    },

    computed: {
        ...mapGetters({
            boothInfos: 'getRenewBoothInfos',
            zoneInfos: 'getRenewZoneInfos',
            robotInfos: 'getRenewRobotInfos',
            language: 'getLanguage'
        }),

        convertToZoneItems() {
            return (boothId) => Array.isArray(this.zoneInfos) && this.zoneInfos.filter(zoneInfo => zoneInfo.disp_booth_id === boothId);
        },

        occurrenceTypeAlarmItems() {
            return this.datas.isAlarmOccurrenceType === this.datas.alarmOccurrenceType[0].type ? this.setOccurrenceTypeAlarmItems(this.datas.alarmOccurrenceType[0].type) : this.datas.releaseAlarmItems;
        }
    },

    watch: {
        'datas.isAlarmOccurrenceType'(val) {
            this.datas.releaseAlarmItems = val === this.datas.alarmOccurrenceType[1].type ? this.setOccurrenceTypeAlarmItems(this.datas.alarmOccurrenceType[1].type) : [];
        }
    },

    methods: {
        reloadPage() {
            this.clearTimeInterval();
            this.$router.go();
        },

        setTimeInterval() {
            this.datas.timer = setInterval(() => {
                this.reloadPage();
            }, this.datas.intervalTime);
        },

        clearTimeInterval() {
            clearInterval(this.datas.timer);
            this.datas.timer = null;
        },

        async getFactoryName() {
            const result = await getFactoryNameAPI();
            return result.data && result.data[0].factory_name;
        },

        getRobotName(robotId){
            const robotInfoItemArray = this.robotInfos.filter(robotInfoItem => robotInfoItem.robot_id === robotId);
            return robotInfoItemArray && robotInfoItemArray[0].robot_name
        },

        getZoneName(zoneId){
            const zoneInfoItemArray = this.zoneInfos.filter(zoneInfoItem => zoneInfoItem.zone_id === zoneId)
            return zoneInfoItemArray && zoneInfoItemArray[0].zone_name
        },

        async getLineZoneAlarmItems() {
            const result = await getLineZoneAlarmItemsAPI();
            return result.data ? result.data : [];
        },

        setRobotBoardImage() {
            return require(`@/images/monitoring/board/robot_status_board_${this.language}.png`);
        },

        socketRobotStatusEmit() {
            this.$socket.emit("robot_status_emit");
        },

        socketZoneAlarmEmit() {
            this.$socket.emit("zone_alarm_emit");
        },

        subscribeZoneAlarm() {
            this.sockets.subscribe('zone_alarm', data => {
                /** 알람 발생/해제 여부 판단 */
                const check = checkAlarm(data);
                const judge = judgeZoneAlarm(data, this.datas.alarmItems);
                check && (judge ? this.datas.alarmItems = removeItems(data, this.datas.alarmItems) : this.datas.alarmItems.unshift(data));
                this.datas.zoneAlarmItems = this.datas.alarmItems.filter(alarm => alarm.type_id !== 0)
            })
        },

        unsubscribeZoneAlarm() {
            this.sockets.unsubscribe('zone_alarm');
        },

        async getHisAlarmItems() {
            const alarmItems = await getHisAlarmItemsAPI();
            this.datas.hisAlarmItems = alarmItems.data.length > 0 ? alarmItems.data.map(alarmItem => {alarmItem.level = convertLevelToIcon(alarmItem.level, alarmItem.type_id); return alarmItem}) : []
        },

        clickTodayAlarmBtn(){
            this.datas.isTodayAlarmListOpen = true
            this.getHisAlarmItems()
        },

        closeTodayAlarmModalHandler(){
            this.datas.isAlarmOccurrenceType = this.datas.alarmOccurrenceType[0].type;
            this.datas.isTodayAlarmListOpen = false
        },

        async clickAlarmCard(item){
            this.datas.isAlarmCardOpen = true;
            let remedyItemsResult = [];
            if(item.robot_id){
                const rcModel = this.robotInfos.filter(robotInfo => robotInfo.robot_id === item.robot_id)[0].rc_model_id;
                remedyItemsResult = await getLineRobotAlarmRemedyItemsAPI({
                    code : item.code,
                    rcModel: rcModel
                });
            }else {
                remedyItemsResult = await getSpcAlarmListAPI(item);
            }
            const alarmRemedyItems = remedyItemsResult.data.length > 0 ? remedyItemsResult.data.map(alarmRemedyItem => { return {
                alarm_sub_code: alarmRemedyItem.alarm_sub_code,
                alarm_index: alarmRemedyItem.alarm_index,
                alarm_message: alarmRemedyItem.alarm_message,
                alarm_message_data: alarmRemedyItem.alarm_message_data,
                alarm_cause: alarmRemedyItem.alarm_cause,
                alarm_solution: alarmRemedyItem.alarm_solution
            }}): [];
            this.datas.alarmInfoItems = [{
                alarm_id : item.alarm_id,
                code : item.code,
                spc_code: item.spc_code || 0,
                contents: item.contents,
                level : item.level,
                robot_id : item.robot_id,
                name : item.robot_id ? `${this.getZoneName(item.zone_id)} / ${this.getRobotName(item.robot_id)}` : `${this.getZoneName(item.zone_id)}`,
                sub_code : item.sub_code || 0,
                type_name : item.type_name,
                solution: alarmRemedyItems
            }];
        },

        closeRobotAlarmModalHandler(){
            this.datas.isAlarmCardOpen = false
            this.datas.alarmInfoItems = []
        },

        setOccurrenceTypeAlarmItems(occurrenceAlarmType) {
            const alarmItemsKeys = map(this.datas.alarmItems, 'alarm_id');
            const hisAlarmItemsKeys = map(this.datas.hisAlarmItems, 'alarm_id');
            const releaseKeys = difference(hisAlarmItemsKeys, alarmItemsKeys);
            return filter(this.datas.hisAlarmItems, item => occurrenceAlarmType === this.datas.alarmOccurrenceType[0].type ? !includes(releaseKeys, get(item, 'alarm_id')) : includes(releaseKeys, get(item, 'alarm_id')));
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './LineMonitoring.scss';
</style>
