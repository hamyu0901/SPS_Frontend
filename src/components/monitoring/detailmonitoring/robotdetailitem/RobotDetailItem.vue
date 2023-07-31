<template>
    <v-layout :class="['robot-detail-item', `robot-detail-item-${type}`]">
        <v-layout :class="['robot-detail-item__robot-status']" column v-if="datas.robotItem.robot_id">
            <img 
              :alt="'robot image'" 
              :src="renderRobotImg"
            />
        </v-layout>
        <v-layout :class="['robot-detail-item__robot-information']" column v-if="datas.robotItem.robot_id">
            <v-layout :class="['robot-detail-item__robot-information-chart']"
                v-for="(robotInfoTitleType, index) in Object.keys(datas.robotInfoTitleType)"
                :key="index"
            >
                <v-flex lg5 md5 xs5 :class="['robot-detail-item__robot-information-chart-title']">
                    <p>{{datas.robotInfoTitleType[robotInfoTitleType]}}</p>
                </v-flex>
                <v-flex lg7 md7 xs7 :class="['robot-detail-item__robot-information-chart-description']">
                    <p>{{datas.robotItem[robotInfoTitleType]}}</p>
                </v-flex>
            </v-layout>
            <v-layout :class="['robot-detail-item__robot-information-chart']">
                <v-flex lg5 md5 xs5 :class="['robot-detail-item__robot-information-chart-title']">
                    <p>{{datas.locale.robotMode}}</p>
                </v-flex>
                <v-flex lg7 md7 xs7 :class="['robot-detail-item__robot-information-chart-description']">
                    <v-chip small color="primary">{{renderPPMode}}</v-chip>
                </v-flex>
            </v-layout>
        </v-layout>    
    </v-layout>
</template>
<script>
import { getRobotImg } from '@/utils/monitoring';
export default {
    props: {
        /** 로봇 방향 타입 */
        type: {
            type: String,
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
        robotItem: {
            type: Object,
        },
    },

    data: (vm) => ({
        datas: {
            /** 로봇 아이템 */
            robotItem: vm.robotItem? vm.robotItem : {},
            /** 로봇 정보 타이틀 타입 */
            robotInfoTitleType: {
                robot_name: vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.robotName'),
                robot_model_name: vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.robotModelName'),
                rc_model_name: vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.rcModelName'),
                robot_ip: vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.robotIp')
            },
            /** 로봇 모드 */
            robotMode: '',
            /** 로봇 모드 타입 */
            robotModeType: [
                vm.$t('monitoring.detail.robotDetailItem.robotModeType.teach'),
                vm.$t('monitoring.detail.robotDetailItem.robotModeType.play'),
                vm.$t('monitoring.detail.robotDetailItem.robotModeType.remote')
            ],
            locale: {
                robotMode: vm.$t('monitoring.detail.robotDetailItem.robotMode'),
                etc: vm.$t('monitoring.detail.robotDetailItem.etc')
            }
        }
    }),

    created() {
        this.subscribeRobotStatus();
        this.subscribeRobotPPMode(); 
    },

    mounted() {},

    destroyed() {
        this.unsubscribeRobotStatus();
        this.unsubscribeRobotPPMode();
    },

    computed: {
        renderRobotImg() {
            return getRobotImg(this.datas.robotItem.tool_id, this.datas.robotItem.robot_status);
        },

        renderPPMode() {
            return this.datas.robotModeType[this.datas.robotItem.pp_mode]? this.datas.robotModeType[this.datas.robotItem.pp_mode] : this.datas.locale.etc;
        }
    },

    methods: {
        subscribeRobotStatus() {
            this.sockets.subscribe('robot_status', data => {
                this.datas.robotItem.robot_status = this.datas.robotItem.robot_id === data.robot_id ? data.robot_status : this.datas.robotItem.robot_status;
            })
        },
        subscribeRobotPPMode() {
            this.sockets.subscribe('robot_ppmode', data => {
                this.datas.robotItem.pp_mode = this.datas.robotItem.robot_id === data.robot_id ? data.pp_mode : this.datas.robotItem.pp_mode;
            })
        },
        unsubscribeRobotStatus() {
            this.sockets.unsubscribe('robot_status');
        },
        unsubscribeRobotPPMode() {
            this.sockets.unsubscribe('robot_ppmode');
        },
    }
}
</script>

<style scoped lang='scss'>
    @import './RobotDetailItem.scss';
</style>