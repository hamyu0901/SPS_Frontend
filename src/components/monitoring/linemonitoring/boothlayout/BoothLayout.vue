<template>
    <v-layout :class="['booth-layout']">
        <v-layout :class="['booth-layout__title']">
            <v-card flat>
                <v-layout align-center justify-end fill-height column>
                    <p>{{renderBoothName}}</p>
                    <img 
                    :alt="'booth name card'"
                    :src="renderBoothCardImg"
                    />
                </v-layout>
            </v-card>
        </v-layout>
        <zone-layout 
          v-for="zoneItem in zoneItems"
          :key="zoneItem.zone_id"
          :zoneItem="zoneItem"
          :boothName="boothItem.booth_name"
          :robotItems="convertToRobotItems(zoneItem.zone_id)"
          :zone-alarm-items="convertToZoneAlarmItems(zoneItem.zone_id)"
        />
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import ZoneLayout from '../zonelayout/ZoneLayout.vue'
import { getRobotStatusAPI } from '@/api/monitoringAPI'
import { setRobotStatus } from '@/utils/monitoring'

export default {
    components: { ZoneLayout },
    props: { 
        /** 부스 아이템 */
        /** boothItem: { booth_id, booth_name, booth_no } */
        boothItem: {
            type: Object,
            required: true
        },
        /** 존 아이템 */
        /** zoneItem: { booth_id, zone_id, zone_name, zone_no } */
        zoneItems: Array,
        /** zoneAlarmItems: {} */
        zoneAlarmItems: Array
    },

    data: () => ({
        datas: {
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
            robotItems: [],
            /** 부스 카드 이미지 아이템 */
            boothNameCardImgItems: {
                /** 중상도 이미지 */
                painting: require('@/images/monitoring/booth_paint.png'),  
                /** 하도 이미지 */
                sealer: require('@/images/monitoring/booth_sealer.png')
            }
        }
    }),
    
    async created() {
        const robotItems = await this.getRobotStatus();
        this.datas.robotItems = robotItems.length > 0 ? robotItems : this.robotInfos;
    },

    mounted() {},
    
    computed: {
        ...mapGetters({
            robotInfos: 'getRenewRobotInfos'
        }),

        convertToRobotItems() {
           return (zoneId) => Array.isArray(this.datas.robotItems) && this.datas.robotItems.filter(robotItem => robotItem.zone_id === zoneId);
        },

        renderBoothCardImg () {
            return this.boothItem.booth_id < 2 ? this.datas.boothNameCardImgItems.painting : this.datas.boothNameCardImgItems.sealer;
        },

        renderBoothName() {
            return this.boothItem && this.boothItem.booth_name;
        },

        convertToZoneAlarmItems () {
            return (zone_id) => this.zoneAlarmItems.filter(zoneAlarmItem => zoneAlarmItem.zone_id === zone_id);
        }
    },

    methods: {
        async getRobotStatus() {
            try {
                const robotStatuses = await getRobotStatusAPI();
                const robotItems = await setRobotStatus(this.robotInfos, robotStatuses);
                return robotItems ? robotItems : [];
            } catch(error) {
                console.error(error);
            }
        },
    }
}
</script>

<style scoped lang='scss'>
    @import './BoothLayout.scss';
</style>