<template>
    <v-layout :class="['predict']" column fill-height>
        <v-layout :class="['predict__info']" column>
            <v-layout :class="['predict__info-alarm-status']">
               <alarm-status-container
                    v-for="alarmStatusInfo in datas.alarmStatusInfos"
                    :key="alarmStatusInfo.alarmType"
                    :component-type="alarmStatusInfo.componentType"
                    :alarm-type="alarmStatusInfo.alarmType"
                    :size="alarmStatusInfo.size"
                    :title="alarmStatusInfo.title"
               />
            </v-layout>
            <v-layout :class="['predict__info-date']">
                <date-picker
                    :set-date="datas.prevDate"
                    v-on:getDate="getPrevDate"
                    :not-after-date="datas.fixedDate"
                />
                <span>{{renderFixedDate}}</span>
            </v-layout>
        </v-layout>
        <v-layout style="overflow-y: auto;" column fill-height>
            <BoothLayout
                v-for="boothInfo in boothInfos"
                :key="boothInfo.booth_id"
                :prev-date="datas.prevDate"
                :booth-item="boothInfo"
                :zone-items="getZoneItems(boothInfo.booth_id)"
            />
        </v-layout>
    </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { setZoneItems } from "@/utils/utils";
import BoothLayout from "@/components/diagnostics/predict/predict/BoothLayout";
import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer";
import DatePicker from "@/commons/DatePicker";
export default {
    components: { BoothLayout, AlarmStatusContainer, DatePicker },
    data: (vm) => ({
        datas: {
            /** 알람 상태 아이템 목록 */
            alarmStatusInfos: [
                { alarmType: 'normal', componentType: 'icon', size: 35, title: vm.$t('diagnostics.predict.main.alarmStatusInfos.normal') },
                { alarmType: 'alarm', componentType: 'icon', size: 35, title: vm.$t('diagnostics.predict.main.alarmStatusInfos.alarm') },
                { alarmType: 'default', componentType: 'icon', size: 35, title: vm.$t('diagnostics.predict.main.alarmStatusInfos.default') }
            ],
            fixedDate: vm.$moment().subtract(1, 'day').format('YYYY-MM-DD'),
            /** 이전 날짜 (검색 범위 ) */
            prevDate: vm.$moment(vm.$moment().subtract(1, 'day').format('YYYY-MM-DD')).subtract("1", "w").format('YYYY-MM-DD'),
        }
    }),

    created() {},

    mounted() {},

    destroyed() {},

    computed: {
        ...mapGetters({
            boothInfos: 'getRenewBoothInfos',
            zoneInfos: 'getRenewZoneInfos'
        }),

        renderFixedDate() {
            return ' - ' + this.datas.fixedDate;
        },
    },

    methods: {
        getPrevDate(date) {
            this.datas.prevDate = date === undefined ? this.$moment(this.datas.fixedDate).subtract("1", "w").format('YYYY-MM-DD') : date;
        },

        getZoneItems(boothId) {
            const zoneItems = setZoneItems(this.zoneInfos, boothId);
            return zoneItems ? zoneItems : [];
        }
    }
};
</script>

<style scoped lang="scss">
    @import "./DYPredict";
</style>
