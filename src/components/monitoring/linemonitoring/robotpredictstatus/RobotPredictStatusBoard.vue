<template>
    <v-layout :class="['robot-predict-status-board']" column>
        <span :class="['robot-predict-status-board-title']">로봇 예지 보전 상태</span>
        <v-card :class="['robot-predict-status-board__contents']">
            <table :class="['robot-predict-status-board__contents-table']">
                <thead>
                    <tr>
                        <th v-for="headerItem in tableHeaderItems" :key="headerItem.id"> {{headerItem.title}} </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="robotStatusItem in robotStatusItems" :key="robotStatusItem.robot_id">
                        <td> {{robotItem.robot_name}} </td>
                        <td :class="[`robot-predict-status-board__contents-table__td-${predictType === 'accum_alarm_status' || predictType === 'accum_daily_alarm_status' ? 'highlight' : 'normal'}`]">
                            <alarm-status-container
                                :component-type="'button'"
                                :alarm-type="renderAlarmType(checkAlarmType(robotStatusItem[checkAccumType])? robotStatusItem[checkAccumType] : 0)"
                                :onClickHandler="()=>{alarmStatusButtonClickHandler(checkAccumType, robotItem)}"
                                :size="30"
                            />
                        </td>
                        <td :class="[`robot-predict-status-board__contents-table__td-${predictType === 'pmtorque_alarm_status' ? 'highlight' : 'normal'}`]">
                            <alarm-status-container
                                :component-type="'button'"
                                :alarm-type="renderAlarmType(checkAlarmType(robotStatusItem.pmtorque_alarm_status)? robotStatusItem.pmtorque_alarm_status : 2)"
                                :onClickHandler="()=>{alarmStatusButtonClickHandler(tableHeaderItems[2].id, robotItem)}"
                                :size="30"
                            />
                        </td>
                        <td :class="[`robot-predict-status-board__contents-table__td-${predictType === 'temperature_alarm_status' ? 'highlight' : 'normal'}`]">
                            <alarm-status-container
                                :component-type="'button'"
                                :alarm-type="renderAlarmType(checkAlarmType(robotStatusItem.temperature_alarm_status)? robotStatusItem.temperature_alarm_status : 0)"
                                :onClickHandler="()=>{alarmStatusButtonClickHandler(tableHeaderItems[3].id, robotItem)}"
                                :size="30"
                            />
                        </td>
                        <td :class="[`robot-predict-status-board__contents-table__td-${predictType === 'atomizer_alarm_status' ? 'highlight' : 'normal'}`]">
                            <alarm-status-container
                                :component-type="'button'"
                                :alarm-type="renderAlarmType(checkAlarmType(robotStatusItem.atomizer_alarm_status)? robotStatusItem.atomizer_alarm_status : 0)"
                                :onClickHandler="()=>{alarmStatusButtonClickHandler(tableHeaderItems[4].id, robotItem)}"
                                :size="30"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </v-card>
    </v-layout>
    
</template>
<script>
import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer";
export default {
    components : { AlarmStatusContainer },
    props: {
        robotItem: {
            type: Object,
        },
        robotStatusItems: {
            type: Array
        },
        
        tableHeaderItems : {
            type : Array
        },
        predictType: {
            type : String
        }

    },
    data(vm){
        return {
            datas: {
                alarmTypeItems: ['normal', 'alarm', 'default'],
                predictType : vm.predictType ,
            }
        }
    },
    computed : {
        checkAlarmType() {
            return (checkAlarmType) => {
                return typeof checkAlarmType === 'number'? true : false;
            }
        },

        renderAlarmType() {
            return (type) => {
                return this.datas.alarmTypeItems[type];
            }
        },
        
        checkAccumType() {
            return (this.robotItem.rc_model_id === 0 || this.robotItem.tool_id === 2) ? 'accum_daily_alarm_status' : 'accum_alarm_status'    
        }
    },

    methods: {
        alarmStatusButtonClickHandler(predictType, robotItem){
            this.$emit('onStatusButtonClickHandler', {
                predictType: predictType,
                robotItem : robotItem
            })
        },

    }
}

</script>
<style scoped lang="scss">
    @import './RobotPredictStatusBoard.scss'
</style>