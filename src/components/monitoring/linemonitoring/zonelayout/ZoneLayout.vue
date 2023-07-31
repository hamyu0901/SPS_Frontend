<template>
    <v-layout :class="['zone-layout']" column>
        <v-layout :class="['zone-layout__site']" column>
            <v-layout :class="['zone-layout__site-left']">
                <robot-item
                  v-for="leftRobotItem in renderLeftRobots"
                  :key="leftRobotItem.robot_id"
                  :robotItem="leftRobotItem"
                  :robotMaxCount="datas.maxRobotCount"
                  :boothName="boothName"
                  :zoneName="zoneItem.zone_name"
                />
            </v-layout>
            <v-layout :class="['zone-layout__site-right']">
                <robot-item
                  v-for="rightRobotIem in renderRightRobots"
                  :key="rightRobotIem.robot_id"
                  :robotItem="rightRobotIem"
                  :robotMaxCount="datas.maxRobotCount"
                  :boothName="boothName"
                  :zoneName="zoneItem.zone_name"
                />
            </v-layout>
        </v-layout>
        <v-tooltip right color="#2E2F49" style="min-width: 300px; width: 320px">
          <template v-slot:activator="{ on }">
            <button :class="['zone-layout-title', `zone-layout-title-color-${zoneAlarmItems.length > 0 ? 'alarm' : 'normal'}`]" @click="clickZoneTitleHandler" v-on="on">
              <v-img v-if="zoneAlarmItems.length > 0" :src="datas.zoneAlarmAlertImg" min-width="23" min-height="23" max-width="23" max-height="23" />
              {{renderZoneName}}
              <span :class="['zone-layout-title-alarm-count']" v-if="zoneAlarmItems.length > 0">{{renderZoneAlarmCount}}</span>
            </button>
          </template>
            <v-timeline
              v-if="datas.timeLineItems.length > 0"
              align-top
              dense
              :class="['zone-layout-timeline']"

            >
              <v-timeline-item
                v-for="(timeLineItem, index) in datas.timeLineItems"
                :key="'imeLineItem'+index"
                fill-dot
                color="#2E2F49"
                right
              >
                  <template v-slot:icon>
                      <v-avatar>
                          <img :src="setTimeLineImg(timeLineItem.level)" style="width:23px; height:23px" alt="alarm Level">
                      </v-avatar>
                  </template>
                <v-layout pt-3>
                    <v-card :class="['zone-layout-timeline-card']">
                        <v-layout :style="`background-color:${timeLineItem.color}`" :class="['zone-layout-timeline-card__header-layout']">
                            <v-icon dark size="25">mdi-clock</v-icon>
                            <div :class="['zone-layout-timeline-card__header-layout-title']">{{timeLineItem.update_time}}</div>
                        </v-layout>
                        <v-layout column :class="['zone-layout-timeline-card__contents-layout']">
                            <div>- {{renderZoneRobotName(timeLineItem.zone_name, timeLineItem.robot_name)}}</div>
                            <div>- {{timeLineItem.type_name}}</div>
                            <div>- {{timeLineItem.contents}}</div>
                        </v-layout>
                    </v-card>
                </v-layout>
              </v-timeline-item>
            </v-timeline>
          <span v-else>{{ ui.emptyTitle }}</span>
        </v-tooltip>
    </v-layout>
</template>

<script>
import RobotItem from '../robotitem/RobotItem.vue'
import { getPredictRobotAlarmStatusItemsAPI } from '@/api/diagnostics/predictAPI';
import { convertLevelToIcon, convertToLevelColor } from "@/utils/alarm";
import { isEmpty, isNull } from "lodash";
export default {
    components: {
        RobotItem
    },

    props: {
        /** 존 아이템 */
        /** zoneItem: { booth_id, zone_id, zone_name, zone_no } */
        zoneItem: {
            type: Object,
            required: true
        },
        /** 로봇 아이템 */
        /** robotItem: {
            alarm_status, // 알람 유무
            pp_mode, // 로봇 모드 값
            rc_model_name, // 컨트롤러 이름
            robot_axis, // 로봇 축 수
            robot_id, // 로봇 id
            robot_ip, // 로봇 ip 주소
            robot_model_name, // 로봇 모델 이름
            robot_name, // 로봇 이름
            robot_no, // 로봇 위치
            robot_status, // 로봇 상태 값
            tool_id, // tool id
            zone_id // zone id
        } */
        robotItems: Array,
        /** 부스 이름 */
        boothName: String,
        /** 존 알람 아이템 */
        zoneAlarmItems: {
            type: Array
        }
    },

    data: (vm) => ({
        ui: {
            emptyTitle : vm.$t('monitoring.line.zoneItem.emptyTitle')
        },
        datas: {
            /** 한 라인에 포함되는 최대 로봇 수, props로 받을 예정 */
            /** [TODO]: 관련 API 추가 필요 */
            maxRobotCount: 12 / 2,
            /** 오른쪽 위치한 로봇 아이템 */
            rightRobotItems: [],
            /** 왼쪽 위치한 로봇 아이템 */
            leftRobotItems: [],
            /** 존 알람 발생 아이콘 */
            zoneAlarmAlertImg: require('@/images/monitoring/zone/alert.png'),
            locale: {
                count: vm.$t('monitoring.line.count')
            },
            /** 존 예지보전 로봇 알람 상태 아이템 */
            zonePredictRobotAlarmStatusItems: [],
            /** 예지보전 검색 주기 날짜 */
            predictDate: vm.$moment(vm.$moment().subtract(1, 'day').format('YYYY-MM-DD')).subtract("1", "w").format('YYYY-MM-DD'),
            timeLineItems: []
        }
    }),

    async created() {
        this.datas.zonePredictRobotAlarmStatusItems = await this.getRobotPredictAlarmStatusItems();
    },

    mounted() {

    },

    computed: {
        renderZoneName() {
            return this.zoneItem && this.zoneItem.zone_name;
        },

        renderZoneAlarmCount() {
            return this.zoneAlarmItems.length > 0 ? (this.zoneAlarmItems.length + this.datas.locale.count) : '';
        },

        renderLeftRobots() {
            this.setRenderRobotItems('leftRobotItems');
            return this.datas.leftRobotItems;
        },

        renderRightRobots() {
            this.setRenderRobotItems('rightRobotItems');
            return this.datas.rightRobotItems;
        },
        setTimeLineImg() {
            return (alarmLevel) => {
                return convertLevelToIcon(alarmLevel);
            }
        }
    },

    watch: {
      zoneAlarmItems(val) {
        this.datas.timeLineItems = val.length > 0 ? this.setTimeLineItems(val) : [];
      }
    },

    methods: {
        setRenderRobotItems(robotItems) {
            this.datas[robotItems] = Array.from({ length: Math.ceil(this.datas.maxRobotCount)}, () => new Object);
            const renderRobotItems = Array.isArray(this.robotItems) && (robotItems === 'leftRobotItems' ? this.robotItems.filter(robotItem => robotItem.robot_no % 2 !== 0) : this.robotItems.filter(robotItem => robotItem.robot_no % 2 === 0));
            renderRobotItems.forEach(renderRobotItem => {
                if( isEmpty(this.datas.zonePredictRobotAlarmStatusItems) ) {
                    renderRobotItem['alarm_status'] = 0;
                } else {
                    this.datas.zonePredictRobotAlarmStatusItems.forEach(zonePredictRobotAlarmStatusItem => {
                        renderRobotItem['alarm_status'] = renderRobotItem.robot_id === zonePredictRobotAlarmStatusItem.robot_id ? this.setRobotPredictAlarmStatus(renderRobotItem, zonePredictRobotAlarmStatusItem) : renderRobotItem['alarm_status'];
                    })
                }
                this.datas[robotItems][robotItems === 'leftRobotItems' ? Math.floor(renderRobotItem.robot_no / 2) : Math.floor(renderRobotItem.robot_no / 2) - 1] = renderRobotItem;
            });
        },

        async getRobotPredictAlarmStatusItems() {
            const zonePredictRobotAlarmStatusItems = await getPredictRobotAlarmStatusItemsAPI({zoneId: this.zoneItem.zone_id, prevDate: this.datas.predictDate});
            return isEmpty(zonePredictRobotAlarmStatusItems.data) ? [] : zonePredictRobotAlarmStatusItems.data;
        },

        setRobotPredictAlarmStatus(robotItem, predictAlarmStatusItem) {
            const exceptType = (robotItem.rc_model_id === 0 || robotItem.tool_id === 2) ? 'accum_alarm_status' : 'accum_daily_alarm_status';
            const usePredictStatusKeyItems = Object.keys(predictAlarmStatusItem).filter(key => !['robot_id', exceptType].includes(key));
            const predictAlarmStatus = usePredictStatusKeyItems.reduce((acc, cur) => (typeof predictAlarmStatusItem[acc] === 'number' ? predictAlarmStatusItem[acc] : acc) + predictAlarmStatusItem[cur], 0);
            return predictAlarmStatus % 2 === 0 ? 0 : 1;
        },

        clickZoneTitleHandler() {
            this.$router.push(`detail/zone/${this.zoneItem.zone_id}`);
        },

        renderZoneRobotName(zoneName, robotName) {
            return zoneName + (isNull(robotName) ? '' : '-' + robotName);
        },

        setTimeLineItems(alarmItems) {
            return alarmItems.sort(function(a, b) { return new Date(a.update_time) < new Date(b.update_time) ? 1 : -1 }).map(alarmItem => {
                return {
                    level: alarmItem.level,
                    update_time: this.$moment(alarmItem.update_time).utc().format('YYYY-MM-DD HH:mm:ss'),
                    zone_name: this.zoneItem.zone_name,
                    robot_name: alarmItem.robot_id ? this.robotItems.filter(robotItem => robotItem.robot_id === alarmItem.robot_id)[0].robot_name : null,
                    type_name: alarmItem.type_name,
                    contents: alarmItem.contents,
                    color: convertToLevelColor(alarmItem.level, alarmItem.type_id)
                }
            })
        },
    }
}
</script>

<style scoped lang='scss'>
    @import './ZoneLayout.scss';
</style>
