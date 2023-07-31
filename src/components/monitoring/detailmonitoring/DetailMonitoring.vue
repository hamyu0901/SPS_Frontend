<template>
    <v-layout :class="['detail-monitoring']" column fill-height>
       <v-layout :class="['detail-monitoring__filters']">
            <v-layout :class="['detail-monitoring__filters-process']">
                <v-text-field
                  :class="['detail-monitoring__filters-process-booth']"
                  :label="'BOOTH'"
                  :value="datas.boothName"
                  readonly
                />
                <selector
                  :class="['detail-monitoring__filters-process-zone']"
                  :id="'zone-input'"
                  :label="'ZONE'"
                  :defaultValue="datas.defaultZoneItemValue"
                  :items="datas.zoneItems"
                  :options="datas.zoneOptions"
                  @changedValue="changedZoneValue"
                />
            </v-layout>
        </v-layout>
       <v-layout :class="['detail-monitoring__zone-layout']" column>
            <v-layout :class="['detail-monitoring__zone-layout-left']" v-if="datas.loading">
                <robot-detail-item
                    v-for="leftRobotItem in datas.leftRobotItems"
                    :key="leftRobotItem.robot_no"
                    :type="datas.robotDirectionType.left"
                    :robotItem="leftRobotItem"
                />
            </v-layout>
            <v-layout :class="['detail-monitoring__zone-layout-right']" v-if="datas.loading">
                <robot-detail-item
                    v-for="rightRobotItem in datas.rightRobotItems"
                    :key="rightRobotItem.robot_no"
                    :type="datas.robotDirectionType.right"
                    :robotItem="rightRobotItem"
                />
            </v-layout>
       </v-layout>
       <v-layout :class="['detail-monitoring__zone-information']">
            <v-flex lg6 :class="['detail-monitoring__zone-information-alarm']">
                <v-layout column>
                    <p :class="['detail-monitoring__zone-information-alarm-title']">{{datas.locale.zoneAlarmItemsTitle}}</p>
                    <grid-table
                        :headerData="datas.zoneAlarmHeaderItems"
                        :contentData="datas.zoneAlarmItems"
                        :autoClicked="false"
                    />
                </v-layout>
                <date-aggregation-dlg
                  :priorityFlag="datas.zoneAlarmDigIsOpen"
                  :alarmNameDatas="datas.alarmMixCountItems"
                  :alarmCodeDatas="datas.alarmInfoItems"
                  :dateAggregationDatas="datas.boothAlarmCountItems"
                  @changePriorityFlag="datas.zoneAlarmDigIsOpen = false"
                />
            </v-flex>
            <v-flex lg6 :class="['detail-monitoring__zone-information-production']">
                <v-layout column>
                    <p :class="['detail-monitoring__zone-information-production-title']">{{datas.locale.productionItemsTitle}}</p>
                    <grid-table
                        :headerData="datas.productionInfoHeaderItems"
                        :contentData="datas.productionInfoItems"
                        :autoClicked="false"
                    />
                </v-layout>
            </v-flex>
       </v-layout>
        <loading-dlg :loading-flag="datas.isLoading" />
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { getRobotStatusAPI, getZoneAlarmItemsAPI, getProductionInfoItemsAPI, getAlarmMixCountItemsAPI, getBoothAlarmCountItemsAPI } from '@/api/monitoringAPI'
import { setDirectionRobotItems, setRobotStatus } from '@/utils/monitoring';
import Selector from '@/commons/selector/Selector';
import RobotDetailItem from './robotdetailitem/RobotDetailItem';
import GridTable from '@/commons/GridTable';
import DateAggregationDlg from '@/components/diagnostics/alarmstatistics/alarmstatistics/DateAggregationDlg';
import LoadingDlg from "@/commons/LoadingDlg";
import { convertLevelToIcon } from '@/utils/alarm';
export default {
    components: { Selector, RobotDetailItem, GridTable, DateAggregationDlg, LoadingDlg },
    data: (vm) => ({
        datas: {
            /** 선택된 존 정보 */
            defaultZoneItemValue: {},
            /** 존 정보 목록 */
            zoneItems: [],
            /** 선택된 존의 부스 이름 */
            boothName: '',
            /** 존 정보 목록(selector) 옵션 */
            zoneOptions: {
                'item-text': "zone_name",
                'item-value': 'zone_id',
            },
            /** 존 알람 테이블 아이템 */
            zoneAlarmItems: [],
            /** 존 알람 테이블 헤더 */
            zoneAlarmHeaderItems: [
                { id: 'type_name', text: vm.$t('monitoring.detail.zoneAlarmHeaderItems.text.typeName'), value: 'type_name', sortable: false, type: 'text' },
                { id: 'level_name', text: vm.$t('monitoring.detail.zoneAlarmHeaderItems.text.levelName'), value: 'level_name', sortable: false, type: 'img' },
                { id: 'contents', text: vm.$t('monitoring.detail.zoneAlarmHeaderItems.text.contents'), value: 'contents', sortable: false, type: 'text' },
                { id: 'update_time', text: vm.$t('monitoring.detail.zoneAlarmHeaderItems.text.updateTime'), value: 'update_time', sortable: true, type: 'text' },
            ],
            /** 생산 이력 테이블 아이템 */
            productionInfoItems: [],
            /** 생산 이력 테이블 헤더 아이템 */
            productionInfoHeaderItems: [
                {id: 'update_time', text: vm.$t('monitoring.detail.productionHeaderItems.text.updateTime'), value: 'update_time', sortable: true, type: 'text'},
                {id: 'parameter', text: vm.$t('monitoring.detail.productionHeaderItems.text.parameter'), value: 'parameter', sortable: false, type: 'text' }
            ],
            /** 로봇 구성을 위한 좌/우측 로봇 최대 수 */
            maxRobotCount: 12 / 2,
            /** 전체 로봇 아이템 목록 */
            robotItems: [],
            /** 우측 로봇 아이템 목록 */
            rightRobotItems: [],
            /** 좌측 로봇 아이템 목록 */
            leftRobotItems: [],
            /** 로봇 방향 타입 */
            robotDirectionType: {
                left: 'left',
                right: 'right'
            },
            /** 존 레이아웃 렌더 관련 flag */
            loading: false,
            zoneAlarmDigIsOpen: false,
            /** 알람 종류 별 정지 시간 */
            alarmMixCountItems: [],
            /** 알람 정보 */
            alarmInfoItems: [],
            /** 공정 간 경보 발생 비율 */
            boothAlarmCountItems: [],
            /** 다국어 */
            locale: {
                zoneAlarmItemsTitle: vm.$t('monitoring.detail.zoneAlarmItemsTitle'),
                productionItemsTitle:  vm.$t('monitoring.detail.productionItemsTitle'),
                productionHeaderItems: {
                    vinNo: vm.$t('monitoring.detail.productionHeaderItems.text.vinNo'),
                    updateTime: vm.$t('monitoring.detail.productionHeaderItems.text.updateTime')

                }
            },
            /** 로딩바 상태값 */
            isLoading: false
        }
    }),

    created() {
        this.socketRobotStatusEmit();
        this.socketRobotModeEmit();
    },

    mounted() {
    },

    destroyed() {},

    watch: {
        $route: {
            handler() {
                this.datas.loading = false;
                this.datas.robotItems = this.setRobotItems();
                this.datas.zoneItems = this.setZoneItems();
                this.datas.defaultZoneItemValue = this.setDefaultZoneItemValue();
                this.datas.boothName = this.datas.defaultZoneItemValue && this.setBoothName(this.datas.defaultZoneItemValue.disp_booth_id);
               this.setDirectionRobotItems();
               this.getFetchItems();
            },
            immediate: true
        },
    },

    computed: {
        ...mapGetters({
            boothInfos: 'getRenewBoothInfos',
            zoneInfos: 'getRenewZoneInfos',
            robotInfos: 'getRenewRobotInfos'
        })
    },

    methods: {
        socketRobotStatusEmit() {
            this.$socket.emit("robot_status_emit");
        },

        socketRobotModeEmit() {
            this.$socket.emit("robot_mode_emit");
        },

        setIsLoading(isLoading) {
            this.datas.isLoading = isLoading;
        },

        async getRobotStatus() {
            const robotStatuses = await getRobotStatusAPI();
            const robotStatusItems = await setRobotStatus(this.datas.robotItems, robotStatuses);
            return robotStatusItems ? robotStatusItems : this.datas.robotItems;
        },


        async getFetchItems() {
            this.setIsLoading(true);
            this.datas.zoneAlarmItems = await this.getZoneAlarmItems();
            this.datas.productionInfoItems = await this.getProductionInfoItems();
            this.datas.productionInfoHeaderItems = this.setProductionHeaderItems();
        },

        convertToZoneAlarmItems(zoneAlarmItems) {
            return zoneAlarmItems.map(zoneAlarmItem => {
              return zoneAlarmItem.alarm_id ? {...zoneAlarmItem, level_name: convertLevelToIcon(zoneAlarmItem.level, zoneAlarmItem.type_id) } : {...zoneAlarmItem};
            })
        },

        async getZoneAlarmItems() {
            const zoneAlarmItems = await getZoneAlarmItemsAPI(this.$route.params.zoneId);
            return zoneAlarmItems.data.length > 0 ? this.convertToZoneAlarmItems(zoneAlarmItems.data) : [];
        },

        async getProductionInfoItems() {
            const productionInfoItems = await getProductionInfoItemsAPI(this.$route.params.zoneId);
            if ( productionInfoItems.data.length > 0 ) {
                this.setIsLoading(false);
                return productionInfoItems.data;
            } else {
                this.setIsLoading(false);
                return [];
            }
        },

        setZoneItems() {
            return this.zoneInfos.sort((a,b) => { return a.disp_booth_id - b.disp_booth_id });
        },

        setRobotItems() {
            return this.robotInfos.filter(robotInfo => robotInfo.zone_id === Number(this.$route.params.zoneId));
        },

        async setDirectionRobotItems() {
            const robotItems = await this.getRobotStatus();
            this.datas.leftRobotItems = setDirectionRobotItems(this.datas.maxRobotCount, robotItems, this.datas.robotDirectionType.left);
            this.datas.rightRobotItems = setDirectionRobotItems(this.datas.maxRobotCount, robotItems, this.datas.robotDirectionType.right);
            this.datas.loading = true;
        },

        setDefaultZoneItemValue() {
            const defaultZoneItemValue = this.zoneInfos.filter(zoneInfo => zoneInfo.zone_id === Number(this.$route.params.zoneId));
            return defaultZoneItemValue.length > 0 && typeof defaultZoneItemValue[0] === 'object' && defaultZoneItemValue[0];
        },

        setProductionHeaderItems() {
            const productionHeaderItems = [];
            if(this.datas.productionInfoItems.length > 0) {
                const productionInfoKeys = Object.keys(this.datas.productionInfoItems[0]).filter(key => !['vin_no','column_name','record', 'column_name_length'].includes(key));
                productionInfoKeys.forEach(productionInfoKey => {
                    productionHeaderItems.push({id: productionInfoKey, text: productionInfoKey.toUpperCase(), value: productionInfoKey, type: 'text'});
                })
            } else {
                productionHeaderItems.push(
                    {id: 'update_time', text: this.$t('monitoring.detail.productionHeaderItems.text.updateTime'), value: 'update_time', sortable: true , type: 'text'},
                    {id: 'parameter', text: this.$t('monitoring.detail.productionHeaderItems.text.parameter'), value: 'parameter', sortable: false, type: 'text'}
                )
            }
            return productionHeaderItems;
        },

        setBoothName(boothId) {
            const boothItem = this.boothInfos.filter(boothInfo => boothInfo.booth_id === boothId);
            return boothItem.length > 0 && typeof boothItem[0] === 'object' && boothItem[0].booth_name;
        },

        changedZoneValue(e) {
            e.toString() !== this.$router.currentRoute.params.zoneId && this.$router.push(`${e}`);
        },

        async getZoneAlarmDlgItem(zoneAlarmViewItem) {
            // 기능 HIDE
            this.datas.zoneAlarmDigIsOpen = true;
            this.datas.alarmMixCountItems = await this.getAlarmMixCountItems(zoneAlarmViewItem);
            this.datas.alarmInfoItems = this.getAlarmInfoItems(zoneAlarmViewItem);
            this.datas.boothAlarmCountItems = await this.getBoothAlarmCountItems(zoneAlarmViewItem);
        },

        async getAlarmMixCountItems (zoneAlarmItem) {
            /** 알람 종류 별 정지 시간 */
            const { zone_id: zoneId, code, update_time } = zoneAlarmItem;
            const date = update_time.split(" ")[0];
            const params = {};
            params['zoneId'] = zoneId;
            params['code'] = code;
            params['prevDate'] = date;
            params['currDate'] = date;
            const alarmMixCountItems = await getAlarmMixCountItemsAPI(params);
            return alarmMixCountItems.data ? alarmMixCountItems.data : [];
        },

        getAlarmInfoItems (zoneAlarmItem) {
            /** 알람 정보 */
            const alarmInfoItems = [{alarm_name: zoneAlarmItem.contents}];
            alarmInfoItems['alarm_code'] = zoneAlarmItem.code;
            return alarmInfoItems;
        },

        async getBoothAlarmCountItems (zoneAlarmItem) {
            /** 공정 간 경보 발생 비율 */
            const { code, update_time } = zoneAlarmItem;
            const date = update_time.split(" ")[0];
            const params = {};
            params['code'] = code;
            params['prevDate'] = date;
            params['currDate'] = date;
            const boothAlarmCountItems = await getBoothAlarmCountItemsAPI(params);
            return boothAlarmCountItems.data ? boothAlarmCountItems.data : [];
        }

    }
}
</script>

<style scoped lang='scss'>
    @import './DetailMonitoring.scss';
</style>
