<template>
    <v-layout :class="['robot-info']" column>
        <span :class="['robot-info-title']">세부 정보</span>
        <v-card :class="['robot-info__card']">
            <v-layout>
                <v-flex :class="['robot-info__card__img']">
                    <img 
                        v-if="isOpen"
                        :alt="'robot image'" 
                        :src="renderRobotImg"
                        width="130"
                        height="150"
                    />
                </v-flex>
                <v-flex :class="['robot-info__card__contents']">
                    <v-layout column v-if="datas.robotItem.robot_id">
                        <v-layout 
                            v-for="(robotInfoTitleType, index) in Object.keys(ui.robotInfoTitleType)"
                            :key="index"
                        >
                            <v-flex lg5 md5 xs5 :class="['robot-info__card__contents-header']">
                                <span> {{ui.robotInfoTitleType[robotInfoTitleType]}} </span>
                            </v-flex>
                            <v-flex lg7 md7 xs7 :class="['robot-info__card__contents-item']">
                                <span v-if="robotInfoTitleType === 'robot_name'"> {{zoneName}} / {{datas.robotItem[robotInfoTitleType]}} </span>
                                <span v-else> {{datas.robotItem[robotInfoTitleType]}} </span>
                            </v-flex>
                        </v-layout>
                        <v-layout >
                            <v-flex lg5 md5 xs5 :class="['robot-info__card__contents-header']">
                                <span> {{ui.locale.robotMode}} </span>
                            </v-flex>
                            <v-flex lg7 md7 xs7 :class="['robot-info__card__contents-item']">
                                <span> {{renderPPMode}} </span>
                            </v-flex>
                        </v-layout>
                    </v-layout>   
                </v-flex>
            </v-layout>
        </v-card >
    </v-layout>
</template>
<script>
import { getRobotImg } from '@/utils/monitoring';
import { setRobotItems, setZoneItems } from "@/utils/utils";

    export default {
        props: {
            robotItem: {
                type: Object,
            },

            isOpen : {
                type: Boolean
            },
            
            zoneName: {

            }
        },
        data(vm){
            return {
                ui: {
                    robotInfoTitleType: {
                        // zone_name : vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.zoneName'),
                        robot_name: vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.robotName'),
                        robot_model_name: vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.robotModelName'),
                        rc_model_name: vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.rcModelName'),
                        robot_ip: vm.$t('monitoring.detail.robotDetailItem.robotInfoTitleType.robotIp'),
                    },
                    robotModeType: [
                        vm.$t('monitoring.detail.robotDetailItem.robotModeType.teach'),
                        vm.$t('monitoring.detail.robotDetailItem.robotModeType.play'),
                        vm.$t('monitoring.detail.robotDetailItem.robotModeType.remote')
                    ],
                    locale: {
                        robotMode: vm.$t('monitoring.detail.robotDetailItem.robotMode'),
                        etc: vm.$t('monitoring.detail.robotDetailItem.etc')
                    }
                },
                datas : {
                    robotItem: vm.robotItem
                }
            }
        },
        computed :{
            renderRobotImg() {
                return getRobotImg(this.datas.robotItem.tool_id, this.datas.robotItem.robot_status, 'png');
            },
            renderPPMode() {
                return this.ui.robotModeType[this.datas.robotItem.pp_mode]? this.ui.robotModeType[this.datas.robotItem.pp_mode] : this.ui.locale.etc;
            }
        },
        mounted(){
        }
    }
</script>
<style scoped lang="scss"s>
 @import './RobotInfo.scss'
</style>