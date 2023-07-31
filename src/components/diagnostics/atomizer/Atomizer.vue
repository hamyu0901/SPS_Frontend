<template>
    <v-layout :class="['atomizer']">
        <v-layout :class="['atomizer__filter']">
            <v-flex :class="['atomizer__filter-item']" lg4 md4 sm4>
                <date-picker :set-date="datas.prevDate" @getDate="getPrevDate" />
            </v-flex>
            <v-flex :class="['atomizer__filter-item']" lg4 md4 sm4>
                <date-picker :set-date="datas.currDate" @getDate="getCurrDate" />
            </v-flex>
            <v-flex :class="['atomizer__filter-item']" lg3 md3 sm3>
                <selector
                  :selectorTitle="$t(String(`selector.booth`))"
                  :selector-options="datas.boothInfoItems"
                  @selectedTarget="selectedBoothInfoHandler"
                />
            </v-flex>
            <v-flex :class="['atomizer__filter-item']" lg3 md3 sm3>
                <selector
                  :selectorTitle="$t(String(`selector.zone`))"
                  :selector-options="datas.zoneInfoItems"
                  @selectedTarget="selectedZoneInfoHandler"
                />
            </v-flex>
            <v-flex :class="['atomizer__filter-item']" lg3 md3 sm3>
                <selector
                  :selectorTitle="$t(String(`selector.robot`))"
                  :selector-options="datas.robotInfoItems"
                  @selectedTarget="selectedRobotInfoHandler"
                />
            </v-flex>
            <v-spacer/>
            <v-btn :class="['atomizer__filter-button']" color="primary" icon @click="searchBtnClickHandler"><v-icon>mdi-magnify</v-icon></v-btn>
        </v-layout>
        <v-layout :class="['atomizer__contents']">
            <v-layout :class="['atomizer__contents__filter']">
                <span :class="['atomizer__contents__filter-title']">{{datas.title.chart}}</span>
                <v-spacer />
                <v-btn-toggle v-model="datas.selectedAtomizerTypeValue" :class="['atomizer__contents__filter-btn-items-toggle']" @change="changeAtomizerTypeValue">
                    <v-btn :class="['atomizer__contents__filter-btn-items-toggle-item']" v-for="atomizerTypeValueItem in datas.atomizerTypeValueItems" :key="atomizerTypeValueItem.id" flat :value="atomizerTypeValueItem.value" :disabled="datas.atomizerTypeValueItemDisabled">
                        <v-layout :class="['atomizer__contents__filter-btn-items-toggle-item__layout']">
                            <span :class="['atomizer__contents__filter-btn-items-toggle-item__layout-span']">{{atomizerTypeValueItem.title}}</span>
                        </v-layout>
                    </v-btn>
                </v-btn-toggle>
            </v-layout>
            <v-layout :class="['atomizer__contents-chart']" v-if="datas.selectedAtomizerTypeValue !== datas.atomizerTypeValueItems[3].id">
                <mix-chart
                  :chart-id="'atomizer-data-chart'"
                  :chart-items="datas.atomizerChartItems"
                  :value-type="'atomizer-type'"
                  :bg-color="'#171A29'"
                  :chartAxisYOptions="{ title: 'ERROR RATE(%)', titleFontSize: 23, labelFontSize: 18 }"
                  :chart-axis-y2-options="{ titleFontSize: 23, labelFontSize: 18 }"
                  :chart-legend-options="{ fontSize: 16 }"
                />
            </v-layout>
            <v-layout :class="['atomizer__contents-chart']" v-else>
                <mix-chart
                  v-for="(atomizerHVChartItem, atomizerHVChartItemIdx) in datas.atomizerChartItems"
                  :key="'atomizerHVChartItem'+atomizerHVChartItemIdx"
                  :chart-id="'atomizer-hv-'+atomizerHVChartItemIdx+'-avg-sub-chart'"
                  :chart-items="[...atomizerHVChartItem]"
                  :value-type="'atomizer-type'"
                  :bg-color="'#171A29'"
                  :chartAxisYOptions="{ titleFontSize: 23 }"
                  :chart-axis-y2-options="{ titleFontSize: 23, labelFontSize: 18 }"
                  :chart-legend-options="{ fontSize: 16 }"
                />
            </v-layout>
            <span :class="['atomizer__contents__filter-title']">{{datas.title.table}}</span>
            <base-table
              :class="['atomizer__contents-table']"
              :header-items="datas.atomizerAlarmListHeaderItems"
              :content-items="datas.atomizerAlarmListItems"
            />
        </v-layout>
    </v-layout>
</template>
<script>
import { mapGetters } from 'vuex';
import Selector from "@/commons/Selector.vue";
import DatePicker from '@/commons/DatePicker';
import { some, isUndefined, isNull, cloneDeep } from "lodash";
import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer.vue";
import { getAtomizerAlarmListAPI, getAtomizerChartItemsAPI } from "@/api/diagnostics/atomizerAPI";
import {convertToAtomizerChartItems, convertToAtomizerHVChartItems} from "@/utils/diagnostics/predict";
import MixChart from "@/commons/chart/mixchart/MixChart.vue";
import BaseTable from "@/commons/basetable/BaseTable.vue";
import {convertLevelToIcon} from "@/utils/alarm";

export default {
    components: {BaseTable, MixChart, AlarmStatusContainer, Selector, DatePicker },
    data: (vm) => ({
        datas: {
            prevDate: vm.$moment().subtract(1, 'week').format('YYYY-MM-DD'),
            currDate: vm.$moment().subtract(1, 'day').format('YYYY-MM-DD'),
            boothInfoItems: [],
            zoneInfoItems: [],
            robotInfoItems: [],
            selectedBoothId: '',
            selectedZoneId: '',
            selectedRobotId: '',
            selectedAtomizerTypeValue: null,
            selectedAtomizerTypeNo: 0,
            passParams: {},
            atomizerTypeValueItemDisabled: false,
            atomizerTypeValueItems: [
              { id: 'turbine', title: 'TURBINE', value: 'turbine' },
              { id: 'sa_s', title: 'SA_S', value: 'sa_s' },
              { id: 'sa_v', title: 'SA_V', value: 'sa_v' },
              { id: 'hv', title: 'HIGH-VOLTAGE', value: 'hv' },
            ],
            title: {
                chart: vm.$t('diagnostics.atomizer.title.chart'),
                table: vm.$t('diagnostics.atomizer.title.table'),
            },
            atomizerAlarmListHeaderItems: [
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.update_time'), value: 'update_time', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.code'), value: 'code', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.name'), value: 'name', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.job_name'), value: 'job_name', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.step_no'), value: 'step_no', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.level'), value: 'level', type: 'img', align: 'center' },
            ],
            atomizerAlarmListItems: [],
            atomizerChartItems: []
        }
    }),
    created() {
        this.datas.boothInfoItems = this.boothInfos.map(boothInfo => { return { id: boothInfo.booth_id, name: boothInfo.booth_name } });
    },
    computed: {
        ...mapGetters({
            boothInfos: 'getRenewBoothInfos',
            zoneInfos: 'getRenewZoneInfos',
            robotInfos: 'getRenewRobotInfos'
        }),
        changeSearchData() {
            const { prevDate, currDate, selectedBoothId, selectedZoneId, selectedRobotId } = this.datas;
            return { prevDate, currDate, selectedBoothId, selectedZoneId, selectedRobotId };
        },
        renderDatePeriod() {
          return this.datas.prevDate + ' - ' + this.datas.currDate;
        },
    },
    watch: {
      changeSearchData: {
        handler() {
          this.datas.atomizerTypeValueItemDisabled = true;
          this.datas.selectedAtomizerTypeValue = null;
        },
        deep: true
      }
    },
    methods: {
        getPrevDate(prevDate) {
            this.datas.prevDate = prevDate;
        },
        getCurrDate(currDate) {
            this.datas.currDate = currDate;
        },
        selectedBoothInfoHandler(boothInfo) {
            this.datas.selectedBoothId = boothInfo.target;
            this.datas.zoneInfoItems = this.zoneInfos.filter(zoneInfo => zoneInfo.disp_booth_id === boothInfo.target).sort((a,b) => a.zone_no - b.zone_no).map(zoneInfo => { return { id: zoneInfo.zone_id, name: zoneInfo.zone_name }});
        },
        selectedZoneInfoHandler(zoneInfo) {
            this.datas.selectedZoneId = zoneInfo.target;
            this.datas.robotInfoItems = this.robotInfos.filter(robotInfo => robotInfo.zone_id === zoneInfo.target).sort((a,b) => a.robot_no - b.robot_no).map(robotInfo => { return { id: robotInfo.robot_id, name: robotInfo.robot_name} });
        },
        selectedRobotInfoHandler(robotInfo) {
            this.datas.selectedRobotId = robotInfo.target;
        },
        async searchBtnClickHandler() {
            const pass = this.checkPassParams(this.datas.prevDate, this.datas.currDate, this.datas.selectedBoothId, this.datas.selectedZoneId, this.datas.selectedRobotId);
            if (pass) {
                this.datas.selectedAtomizerTypeNo = 0;
                this.datas.selectedAtomizerTypeValue = this.datas.atomizerTypeValueItems[0].id;
                this.datas.atomizerTypeValueItemDisabled = false;
                const atomizerAlarmListItemsResult = await getAtomizerAlarmListAPI({robotId: this.datas.passParams.robotId, prevDate: this.datas.passParams.prevDate, currDate: this.datas.passParams.currDate });
                this.datas.atomizerAlarmListItems = atomizerAlarmListItemsResult.data.length > 0 ? this.convertToRobotAlarmListItems(atomizerAlarmListItemsResult.data) : [];
                const atomizerChartItemsResult = await getAtomizerChartItemsAPI({robotId: this.datas.passParams.robotId, type: this.datas.selectedAtomizerTypeValue, typeNo: this.datas.selectedAtomizerTypeNo, prevDate: this.datas.passParams.prevDate, currDate: this.datas.passParams.currDate });
                this.datas.atomizerChartItems = atomizerChartItemsResult.data.length > 0 ? (this.datas.selectedAtomizerTypeValue === this.datas.atomizerTypeValueItems[3].id ? convertToAtomizerHVChartItems(atomizerChartItemsResult.data) : convertToAtomizerChartItems(atomizerChartItemsResult.data)) : [];
            } else {
                window.alert(this.$t('diagnostics.atomizer.alertText'));
            }
        },
        checkPassParams(...params) {
            const pass = !some(params, (value) => isUndefined(value) || isNull(value));
            pass && (this.datas.passParams = cloneDeep({prevDate: this.datas.prevDate, currDate: this.datas.currDate, boothId: this.datas.selectedBoothId, zoneId: this.datas.selectedZoneId, robotId: this.datas.selectedRobotId}));
            return pass;
        },
        async changeAtomizerTypeValue(e) {
            this.datas.selectedAtomizerTypeNo = this.datas.atomizerTypeValueItems.findIndex(atomizerTypeValueItem => atomizerTypeValueItem.value === e);
            const atomizerChartItemsResult = await getAtomizerChartItemsAPI({robotId: this.datas.passParams.robotId, type: this.datas.selectedAtomizerTypeValue, typeNo: this.datas.selectedAtomizerTypeNo, prevDate: this.datas.passParams.prevDate, currDate: this.datas.passParams.currDate });
            this.datas.atomizerChartItems = atomizerChartItemsResult.data.length > 0 ? (this.datas.selectedAtomizerTypeValue === this.datas.atomizerTypeValueItems[3].id ? convertToAtomizerHVChartItems(atomizerChartItemsResult.data) : convertToAtomizerChartItems(atomizerChartItemsResult.data)) : [];
        },
        convertToRobotAlarmListItems(robotAlarmListItems) {
            return robotAlarmListItems.map(robotAlarmListItem => {
                return { ...robotAlarmListItem, level: convertLevelToIcon(robotAlarmListItem.level) };
            })
        }
    }
}
</script>
<style scoped lang="scss">
    @import "Atomizer";
</style>
