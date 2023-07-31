<template>
    <v-card :class="['alarm-card', {'hover': alarmItems['robot_id'] || alarmItems['spc_code']}]" @click="clickAlarmCardItem(alarmItems)">
        <v-layout :class="'alarm-card__contents'" column>
            <v-layout :class="['alarm-card__contents-title']">
                <span>{{datas.contentItems.zone_name}} {{ datas.contentItems.robot_name }}</span>
                <span :class="['alarm-card__contents-title-icon']">
                    <v-img :src="renderAlarmLevelImg(datas.contentItems.level, datas.contentItems.type_id)" min-width="23" min-height="23" max-width="23" max-height="23" />
                </span>
            </v-layout>
            <v-layout :class="['alarm-card__contents-info']" column>
                <v-layout :class="['alarm-card__contents-info__container']">
                    <span :class="['alarm-card__contents-info__container-icon']">
                        <v-img :src="renderIcon('type')" min-width="23" min-height="23" max-width="23" max-height="23" />
                    </span>
                    <span>{{datas.contentItems['type_name']}}</span>
                </v-layout>
                <v-layout :class="['alarm-card__contents-info__container']">
                   <span :class="['alarm-card__contents-info__container-icon']">
                        <v-img :src="renderIcon('contents')" min-width="23" min-height="23" max-width="23" max-height="23" />
                    </span>
                    <span>{{datas.contentItems['contents']}}</span>
                </v-layout>
                <v-layout :class="['alarm-card__contents-info__container']">
                   <span :class="['alarm-card__contents-info__container-icon']">
                        <v-img :src="renderIcon('date')" min-width="23" min-height="23" max-width="23" max-height="23" />
                    </span>
                    <span>{{datas.contentItems['date']}}</span>
                </v-layout>
            </v-layout>
        </v-layout>
    </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { convertLevelToIcon } from '@/utils/alarm';
export default {
    props: {
        /**
         alarmItems: {
            alarm_id,
            zone_id,
            zone_name,
            code,
            type_id,
            type_name,
            status,
            contents,
            level,
            update_time
         }

         */
         alarmItems: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        datas: {
            icons: {
                type: require('@/images/monitoring/card/alarm.png'),
                contents: require('@/images/monitoring/card/contents.png'),
                date: require('@/images/monitoring/card/date.png'),
            },
            contentItems: {}
        }
    }),

    created() {
        this.datas.contentItems = this.alarmItems ? this.setContentItems(this.alarmItems) : {};
    },

    mounted() {
    },

    watch : {
        alarmItems: {
            handler(val){
                this.datas.contentItems = val ? this.setContentItems(val) : {};
            }
        }
    },

    destroyed() {
    },

    computed: {
        ...mapGetters({
            zoneInfos: 'getRenewZoneInfos',
            robotInfos: 'getRenewRobotInfos',
            alarmTypeItems: 'getAlarmTypeItems'
        }),

        renderIcon() {
            return (alarmKey) => {
                return this.datas.icons[alarmKey];
            }
        },

        renderAlarmLevelImg() {
            return (level, type) => {
                return convertLevelToIcon(level, type);
            }
        }
    },

    methods: {
        getZoneName(zoneId) {
            const zoneInfoArray = this.zoneInfos.filter(zoneInfo => zoneInfo.zone_id === zoneId);
            return zoneInfoArray && zoneInfoArray[0].zone_name;
        },

        getAlarmTypeName(typeId) {
            const alarmTypeItemArray = this.alarmTypeItems.filter(alarmTypeItem => alarmTypeItem.type_id === typeId);
            return alarmTypeItemArray && alarmTypeItemArray[0].type_name;
        },

        getRobotName(robotId){
            const robotInfoItemArray = this.robotInfos.filter(robotInfoItem => robotInfoItem.robot_id === robotId);
            return robotInfoItemArray && robotInfoItemArray[0].robot_name
        },

        setContentItems(alarmItems) {
            const { contents, zone_id, robot_id, type_id, update_time, level } = alarmItems;
            const date = update_time.split('T')[0];
            const time = update_time.split('T')[1].split('.')[0];
            return {
                'contents': contents,
                'zone_name': this.getZoneName(zone_id),
                'robot_name' :  robot_id ? this.getRobotName(robot_id) : null,
                'type_id' : type_id,
                'type_name': this.getAlarmTypeName(type_id),
                'date': date + ' ' + time,
                'level': level
            };
        },

        clickAlarmCardItem(alarmItem){
            (alarmItem.type_id === 0 || alarmItem['spc_code']) && this.$emit('onClickAlarmCardItemHandler', alarmItem)
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './AlarmCard';
</style>