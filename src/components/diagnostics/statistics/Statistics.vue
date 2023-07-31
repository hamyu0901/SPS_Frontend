//<template>
    <v-layout :class="['statistics']">
        <v-layout :class="['statistics__filter']">
            <v-flex :class="['statistics__filter-item']" lg3 md3 sm3>
                <date-picker :set-date="datas.prevDate" @getDate="getPrevDate" />
            </v-flex>
            <v-flex :class="['statistics__filter-item']" lg3 md3 sm3>
                <date-picker :set-date="datas.currDate" @getDate="getCurrDate" />
            </v-flex>
            <v-spacer />
            <a><img class="pt-1 pr-2" alt="process filter icon" src="@/images/selector_icon.png"/></a>
            <v-flex :class="['statistics__filter-item']" lg2 md2 sm2>
                <selector
                  :selectorTitle="$t('selector.booth')"
                  :selector-options="datas.boothInfoItems"
                  @selectedTarget="selectedBoothInfoHandler"
                />
            </v-flex>
            <v-flex :class="['statistics__filter-item']" lg2 md2 sm2>
                <selector
                  :selectorTitle="$t('selector.zone')"
                  :selector-options="datas.zoneInfoItems"
                  @selectedTarget="selectedZoneInfoHandler"
                />
            </v-flex>
            <v-flex :class="['statistics__filter-item']" lg2 md2 sm2>
                <selector
                  :selectorTitle="$t('selector.robot')"
                  :selector-options="datas.robotInfoItems"
                  @selectedTarget="selectedRobotInfoHandler"
                />
            </v-flex>
        </v-layout>
        <v-layout :class="['statistics__filter']">
            <v-flex :class="['statistics__filter-item']" lg2 md2 sm2>
                <selector
                  :selectorTitle="$t('selector.alarm')"
                  :selector-options="datas.alarmTypeItems"
                  @selectedTarget="selectedAlarmTypeHandler"
                />
            </v-flex>
            <v-flex :class="['statistics__filter-item']" lg2 md2 sm2>
                <alarm-level-selector @clickAlarmLevel="selectedAlarmLevelHandler"/>
            </v-flex>
            <v-btn :class="['statistics__filter-button']" color="primary" @click="searchBtnClickHandler"><v-icon>mdi-magnify</v-icon></v-btn>
        </v-layout>
        <v-layout :class="['statistics__chart']">
            <span :class="['statistics-title']">{{datas.statisticsChartTitle}}</span>
            <multi-bar-chart
              :class="['statistics__chart-item']"
              chart-id="statistics-chart"
              :chart-items="datas.statisticsChartItems"
              bg-color="#171A29"
              :axis-y-title="datas.statisticsChartAxisYTitle"
            />
        </v-layout>
        <v-layout :class="['statistics__summary-alarm']">
            <v-flex :class="['statistics__summary-alarm-table']" lg6 md6 sm6>
              <span :class="['statistics-title']">{{datas.zoneAlarmTableTitle}}</span>
              <alarm-name-table
                :class="['statistics__summary-alarm-table-item']"
                :type="'zone'"
                :header="datas.zoneAlarmTableHeaderItems"
                :alarm-name-data="datas.zoneAlarmTableContentsItems"
              />
            </v-flex>
            <v-flex :class="['statistics__summary-alarm-table']" lg6 md6 sm6>
              <span :class="['statistics-title']">{{datas.robotAlarmTableTitle}}</span>
              <alarm-name-table
                :class="['statistics__summary-alarm-table-item']"
                :type="'robot'"
                :header="datas.robotAlarmTableHeaderItems"
                :alarm-name-data="datas.robotAlarmTableContentsItems"
                @onClickBaseTableItem="selectedAlarmItem"
              />
            </v-flex>
        </v-layout>
        <v-layout :class="['statistics__entire-alarm']">
            <span :class="['statistics-title']">{{datas.entireAlarmTableTitle}}</span>
            <base-table
              :class="['statistics__entire-alarm-table']"
              :header-items="datas.entireAlarmTableHeaderItems"
              :content-items="datas.entireAlarmTableContentsItems"
              has-click
              @onClickBaseTableItem="selectedAlarmItem"
            />
            <common-alarm-modal
              :title="datas.commonAlarmDlgTitle"
              :is-open="datas.isCommonAlarmDigOpen"
              :alarm-info-item="datas.commonAlarmInfosItem"
              :alarm-chart-items="datas.commonAlarmCountItems"
              @onCloseModal="datas.isCommonAlarmDigOpen = false"
            />
            <robot-alarm-modal
              :title="datas.robotAlarmDlgTitle"
              :is-open="datas.isRobotAlarmDlgOpen"
              :info-items="datas.robotInfosItems"
              :torque-items="datas.robotTorqueItems"
              :accum-trend-items="datas.robotAccumTrendItems"
              :accum-gap-items="datas.robotAccumGapItems"
              :temperature-trend-items="datas.robotTemperatureTrendItems"
              :temperature-gap-items="datas.robotTemperatureGapItems"
              @onCloseModal="datas.isRobotAlarmDlgOpen = false"
            />
            <atomizer-alarm-modal
              :title="datas.atomizerAlarmDlgTitle"
              :is-open="datas.isAtomizerAlarmDlgOpen"
              :info-items="datas.atomizerInfosItems"
              :trend-items="datas.atomizerTrendItems"
              :list-items="datas.atomizerListItems"
              :entire-list-items="datas.atomizerEntireListItems"
              @onClickAtomizerListItem="selectedAtomizerListItemHandler"
              @onCloseModal="datas.isAtomizerAlarmDlgOpen = false"
            />
        </v-layout>
        <loading-dlg :loading-flag="datas.isLoading" />
    </v-layout>
</template>
<script>
import { mapGetters } from "vuex";
import DatePicker from '@/commons/DatePicker';
import Selector from "@/commons/Selector.vue";
import AlarmLevelSelector from "@/components/report/report/AlarmLevelSelector.vue";
import MultiBarChart from "@/commons/chart/multibarchart/MultiBarChart.vue";
import AlarmNameTable from "@/components/report/report/AlarmNameTable.vue";
import BaseTable from "@/commons/basetable/BaseTable.vue";
import LoadingDlg from "@/commons/LoadingDlg.vue";
import RobotAlarmModal from "@/commons/alarm/robotalarmmodal/RobotAlarmModal.vue";
import AtomizerAlarmModal from "@/commons/alarm/atomizeralarmmodal/AtomizerAlarmModal.vue";
import CommonAlarmModal from "@/commons/alarm/commonalarmmodal/CommonAlarmModal.vue";
import {
  getAlarmTypeAPI,
  getStatisticsChartAPI,
  getStatisticsSumRobotAlarmAPI,
  getStatisticsSumZoneAlarmAPI,
  getStatisticsEntireAlarmAPI
} from "@/api/diagnostics/statisticsAPI";
import {
  atomizerEntireListAPI,
  atomizerInfoAPI,
  atomizerListAPI,
  atomizerTrendAPI, getCommonAlarmDateCountAPI, getCommonAlarmInfoAPI, robotAccumGapAPI, robotAccumTrendAPI,
  robotInfoAPI, robotTemperatureGapAPI, robotTemperatureTrendAPI,
  robotTorqueAPI
} from "@/api/alarmAPI";
import { uniq } from "lodash";
import { convertLevelToIcon } from '@/utils/alarm';

export default {
    components: {
        CommonAlarmModal,
        AtomizerAlarmModal,
        RobotAlarmModal,
        LoadingDlg,
        BaseTable,
        AlarmNameTable,
        DatePicker,
        Selector,
        AlarmLevelSelector,
        MultiBarChart
    },
    data: (vm) => ({
        datas: {
            prevDate: vm.$moment().subtract(1, 'week').format('YYYY-MM-DD'),
            currDate: vm.$moment().format('YYYY-MM-DD'),
            boothInfoItems: [],
            zoneInfoItems: [],
            robotInfoItems: [],
            alarmTypeItems: [],
            selectedBoothId: '',
            selectedZoneId: '',
            selectedRobotId: '',
            selectedAlarmType: '',
            selectedAlarmLevel: [],
            statisticsChartTitle: vm.$t('diagnostics.statistics.statisticsChartTitle'),
            statisticsChartAxisYTitle: vm.$t('diagnostics.statistics.statisticsChartAxisYTitle'),
            statisticsChartItems: [],
            zoneAlarmTableHeaderItems: [
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.alarmtypename`), value: 'alarm_type', sort: false},
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.alarmname`), value: 'alarm_name', sort: false},
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.zonename`), value: 'zone_name', sort: false},
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.sum`), value: 'sum', sort: false},
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.level`), value: 'level', sort: false}
            ],
            zoneAlarmTableContentsItems: [],
            zoneAlarmTableTitle: vm.$t('diagnostics.statistics.zoneAlarmTableTitle'),
            robotAlarmTableHeaderItems: [
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.alarmcode`), value: 'alarm_code', sort: false},
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.alarmname`), value: 'alarm_name', sort: false},
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.zoneAlarmNameHeader.zonename`), value: 'zone_name', sort: false},
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.robotname`), value: 'robot_name', sort: false},
              {text: vm.$t(`diagnostics.alarmstatistics.alarmContents.title.robotAlarmNameHeader.sum`), value: 'sum', sort: false}
            ],
            robotAlarmTableContentsItems: [],
            robotAlarmTableTitle: vm.$t('diagnostics.statistics.robotAlarmTableTitle'),
            entireAlarmTableHeaderItems: [
              { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.date`), value: 'time_stamp', type: 'text', sortable: false, align: 'center'},
              { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmtypename`), value: 'alarm_type_name', type: 'text', sortable: false, align: 'center'},
              { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmcode`), value: 'alarm_code', type: 'text', sortable: false, align: 'center'},
              { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmname`), value: 'alarm_name', type: 'text', sortable: false, align: 'center'},
              { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.zonename`), value: 'zone_name', type: 'text', sortable: false, align: 'center'},
              { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.jobname`), value: 'job_name', type: 'text', sortable: false, align: 'center'},
              { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.robotname`), value: 'robot_name', type: 'text', sortable: false, align: 'center'},
              { text: vm.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.level`), value: 'level', type: 'img', sortable: false, align: 'center'}
            ],
            entireAlarmTableContentsItems: [],
            entireAlarmTableTitle: vm.$t('diagnostics.statistics.entireAlarmTableTitle'),
            isCommonAlarmDigOpen: false,
            isRobotAlarmDlgOpen: false,
            isAtomizerAlarmDlgOpen: false,
            isLoading: false,
            commonAlarmDlgTitle: '',
            commonAlarmInfosItem: {},
            commonAlarmCountItems: [],
            atomizerAlarmDlgTitle: vm.$t('diagnostics.statistics.atomizerAlarmDlgTitle'),
            atomizerInfosItems: [],
            atomizerTrendItems: [],
            atomizerListItems: [],
            atomizerEntireListItems: [],
            robotAlarmDlgTitle: vm.$t('diagnostics.statistics.robotAlarmDlgTitle'),
            robotInfosItems: [],
            robotTorqueItems: [],
            robotAccumTrendItems: [],
            robotAccumGapItems: [],
            robotTemperatureTrendItems: [],
            robotTemperatureGapItems: [],

        }
    }),
    async created() {
        this.datas.boothInfoItems = this.boothInfos.map(boothInfo => { return { id: boothInfo.booth_id, name: boothInfo.booth_name } });
        const alarmTypeResult = await getAlarmTypeAPI();
        this.datas.alarmTypeItems = alarmTypeResult.data.length > 0 ? alarmTypeResult.data : [];
    },
    computed: {
        ...mapGetters({
          boothInfos: 'getRenewBoothInfos',
          zoneInfos: 'getRenewZoneInfos',
          robotInfos: 'getRenewRobotInfos'
        }),
        changeSearchData() {
          const { prevDate, currDate, selectedBoothId, selectedZoneId, selectedRobotId, selectedAlarmType, selectedAlarmLevel } = this.datas;
          return { prevDate, currDate, selectedBoothId, selectedZoneId, selectedRobotId, selectedAlarmType, selectedAlarmLevel };
        },
    },
    watch: {
        changeSearchData: {
            handler() {
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
        selectedAlarmTypeHandler(alarmType) {
            this.datas.selectedAlarmType = alarmType.target;
        },
        selectedAlarmLevelHandler(alarmLevel) {
            this.datas.selectedAlarmLevel = alarmLevel;
        },
        setAlarmLevel(alarmLevelItems) {
          return '(' + alarmLevelItems.map(level=> `'${level}'`).join(',') + ')';
        },
        setLoadingDialog(isLoading) {
          this.datas.isLoading = isLoading;
        },
        convertToAlarmParams(params) {
            const {prevDate, currDate, alarmType, alarmLevel, boothId, zoneId, robotId} = params;
            const alarmInfoParams = {};
            boothId && (alarmInfoParams['boothId'] = boothId);
            zoneId && (alarmInfoParams['zoneId'] = zoneId);
            robotId && (alarmInfoParams['robotId'] = robotId);
            prevDate && (alarmInfoParams['prevDate'] = prevDate);
            currDate && (alarmInfoParams['currDate'] = currDate);
            alarmType !== 100 && (alarmInfoParams['alarmType'] = alarmType);
            alarmLevel && (alarmInfoParams['alarmLevel'] = this.setAlarmLevel(alarmLevel));
            return alarmInfoParams;
        },
        checkStatisticsChartItems(items) {
            return (items.zone.length > 0 || items.robot.length > 0);
        },
        convertToStatisticsChartItems(items) {
          const statisticsChartItems = [ { name: this.$t('diagnostics.statistics.statisticsChartItems.zoneAlarmCountTitle'), color:  '#03B7FA', items: [] }, { name: this.$t('diagnostics.statistics.statisticsChartItems.robotAlarmCountTitle'), color: '#58DE97', items: [] } ];
          const statisticsChartLabels = uniq([...items.zone.map(z => z.date), ...items.robot.map(r => r.date)]).sort();
          statisticsChartLabels.length > 0 && statisticsChartLabels.forEach(statisticsChartLabel => {
            const zoneIdx = items.zone.findIndex(z => statisticsChartLabel === z.date);
            const robotIdx = items.robot.findIndex(r => statisticsChartLabel === r.date);
            const zoneChartItem = zoneIdx !== -1 ? { label: items.zone[zoneIdx].date, y: Number(items.zone[zoneIdx].count) } : { label: statisticsChartLabel, y: null };
            const robotChartItem = robotIdx !== -1 ? { label: items.robot[robotIdx].date, y: Number(items.robot[robotIdx].count) } : { label: statisticsChartLabel, y: null };
            statisticsChartItems[0].items.push(zoneChartItem);
            statisticsChartItems[1].items.push(robotChartItem);
          })
          return statisticsChartItems;
        },
        convertToEntireAlarmItems(items) {
            return items.map(item => {
              return {...item, level: convertLevelToIcon(item.level, item.type_id)}
            });
        },
        async searchBtnClickHandler() {
            this.setLoadingDialog(true);
            const searchParams = this.convertToAlarmParams({prevDate: this.datas.prevDate, currDate: this.datas.currDate, boothId: this.datas.selectedBoothId, zoneId: this.datas.selectedZoneId, robotId: this.datas.selectedRobotId, alarmType: this.datas.selectedAlarmType, alarmLevel: this.datas.selectedAlarmLevel});
            const statisticsChartsResult = await getStatisticsChartAPI(searchParams);
            this.datas.statisticsChartItems = this.checkStatisticsChartItems(statisticsChartsResult.data) ? this.convertToStatisticsChartItems(statisticsChartsResult.data) : [];
            const zoneAlarmTableContentsItemsResult = await getStatisticsSumZoneAlarmAPI(searchParams);
            this.datas.zoneAlarmTableContentsItems = zoneAlarmTableContentsItemsResult.data.length > 0 ? zoneAlarmTableContentsItemsResult.data : [];
            const robotAlarmTableContentsItemsResult = await getStatisticsSumRobotAlarmAPI(searchParams);
            this.datas.robotAlarmTableContentsItems = robotAlarmTableContentsItemsResult.data.length > 0 ? robotAlarmTableContentsItemsResult.data : [];
            const entireAlarmTableContentsItemsResult = await getStatisticsEntireAlarmAPI(searchParams);
            this.datas.entireAlarmTableContentsItems = entireAlarmTableContentsItemsResult.data.length > 0 ? this.convertToEntireAlarmItems(entireAlarmTableContentsItemsResult.data) : [];
            this.setLoadingDialog(false);
        },

        getAtomizerAlarmItems(item) {
            Promise.all([atomizerInfoAPI(item), atomizerTrendAPI(item), atomizerListAPI(item), atomizerEntireListAPI(item)])
            .then(([atomizerInfoRes, atomizerTrendRes, atomizerListRes, atomizerEntireListRes]) => {
                this.datas.atomizerInfosItems = atomizerInfoRes.data.length > 0 ? atomizerInfoRes.data : [];
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
        getRobotAlarmItems(item) {
            Promise.all([robotInfoAPI(item), robotTorqueAPI(item), robotAccumTrendAPI(item), robotAccumGapAPI(item), robotTemperatureTrendAPI(item), robotTemperatureGapAPI(item)])
            .then(([robotInfoRes, robotTorqueRes, robotAccumTrendRes, robotAccumGapRes, robotTemperatureTrendRes, robotTemperatureGapRes]) => {
                this.datas.robotInfosItems = robotInfoRes.data.length > 0 ? robotInfoRes.data : [];
                this.datas.robotTorqueItems = robotTorqueRes.data.length > 0 ? robotTorqueRes.data : [];
                this.datas.robotAccumTrendItems = robotAccumTrendRes.data.length > 0 ? robotAccumTrendRes.data: [];
                this.datas.robotAccumGapItems = robotAccumGapRes.data.length > 0 ? robotAccumGapRes.data : [];
                this.datas.robotTemperatureTrendItems = robotTemperatureTrendRes.data.length > 0 ? robotTemperatureTrendRes.data : [];
                this.datas.robotTemperatureGapItems = robotTemperatureGapRes.data.length > 0 ? robotTemperatureGapRes.data : [];
            })
            .then(() => {
                this.setLoadingDialog(false);
                this.datas.isRobotAlarmDlgOpen = true;
            })
            .catch((error) => {
                this.setLoadingDialog(false);
                console.error(error);
            })
        },

        getAtomizerEntireAlarmItems(item) {
            Promise.all([atomizerInfoAPI(item), atomizerTrendAPI(item), atomizerListAPI(item), atomizerEntireListAPI(item)])
            .then(([atomizerInfoRes, atomizerTrendRes ]) => {
                this.datas.atomizerInfosItems = atomizerInfoRes.data.length > 0 ? atomizerInfoRes.data : [];
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
        getCommonAlarmItems(item) {
            Promise.all([getCommonAlarmInfoAPI(item), getCommonAlarmDateCountAPI(item)])
            .then(([commonAlarmInfoRes, commonAlarmDateCountRes]) => {
                this.datas.commonAlarmInfosItem = commonAlarmInfoRes.data.length > 0 ? commonAlarmInfoRes.data[0] : {};
                this.datas.commonAlarmDlgTitle = item.alarm_type_name;
                this.datas.commonAlarmCountItems = commonAlarmDateCountRes.data.length > 0 ? commonAlarmDateCountRes.data : [];
            })
            .then(() => {
                this.setLoadingDialog(false);
                this.datas.isCommonAlarmDigOpen = true;
            })
            .catch((error) => {
                this.setLoadingDialog(false);
                console.error(error);
            })
        },
        checkAlarmType(item) {
          if( item.type_id === 2 ) {
            this.getAtomizerAlarmItems(item);
          } else if (item.type_id === 0 && item.disp_alarm_axis) {
            this.getRobotAlarmItems(item);
          }else {
            this.getCommonAlarmItems(item);
          }
        },
        selectedAlarmItem(alarmItem) {
            this.setLoadingDialog(true);
            this.checkAlarmType(alarmItem);
        },
        selectedAtomizerListItemHandler(atomizerListItem) {
            this.setLoadingDialog(true);
            this.getAtomizerEntireAlarmItems(atomizerListItem);
        }
    }
}
</script>
<style scoped lang="scss">
    @import 'Statistics';
</style>
