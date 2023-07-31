<template>
    <div>
        <v-layout v-for="(booth, index) in datas.boothInfo" :key="index" column>
            <v-layout class="mt-3 mb-3 mr-2 ml-2">
                <v-flex><div class="maintenance_boothName">{{booth.booth_name}}</div></v-flex>
                <v-flex class="maintenance_zoneList">
                    <v-select
                        v-model="datas.selectedZoneInfo[index]"
                        :items="booth.zone"
                        item-text="zone_name"
                        item-value="zone_id"
                        :return-object="true"
                        :menu-props="{ maxHeight: '250px' }"
                        @change="selectZone"
                    >
                    </v-select>
                </v-flex>
            </v-layout>
            <v-data-table
                hide-actions
                :headers="datas.selectedZoneInfo[index].zone_header"
                :items="datas.selectedZoneInfo[index].robot"
                class="hardwarelifetable"
            >
                <template v-slot:items="props">
                    <td>{{ props.item.robot_name }}</td>
                    <td class="text-xs-center" v-for="(item, idx) in props.item.motor" :key="idx" >
                        <v-btn class="lifeBtn" v-if="item > 70" fab outline color="#33CC33">{{item}}</v-btn>
                        <v-btn class="lifeBtn" v-else-if="item > 0 && item <= 70" fab outline color="yellow">{{item}}</v-btn>
                        <v-btn class="lifeBtn" v-else icon><v-icon> mdi-minus-circle-outline</v-icon></v-btn>
                    </td>
                    <td class="text-xs-center" v-for="(item, fan_index) in props.item.coolingfan" :key="`o-${fan_index}`" >
                        <v-btn class="lifeBtn"
                            v-if="props.item.coolingfan[fan_index] <= 70 && props.item.coolingfan[fan_index] > 0"
                            fab outline color="yellow">{{props.item.coolingfan[fan_index]}}
                        </v-btn>
                        <v-btn class="lifeBtn"
                            v-else-if="props.item.coolingfan[fan_index] > 70" fab outline color="#33CC33">
                            {{props.item.coolingfan[fan_index]}}
                        </v-btn>
                        <v-btn class="lifeBtn" v-else icon ><v-icon>mdi-minus-circle-outline</v-icon></v-btn>
                    </td>
                    <td class="text-xs-center">
                        <v-btn class="lifeBtn"
                            v-if="props.item.capacitor > 70"
                            fab outline color="#33CC33">{{props.item.capacitor}}
                         </v-btn>
                        <v-btn class="lifeBtn"
                            v-else-if="props.item.capacitor <= 70 && props.item.capacitor > 0"
                            fab outline color="yellow"
                        >{{props.item.capacitor}}
                        </v-btn>
                        <v-btn class="lifeBtn" icon v-else>
                            <v-icon>mdi-minus-circle-outline</v-icon>
                        </v-btn>
                    </td>
                </template>
            </v-data-table>
        </v-layout>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  const result = Array.isArray(obj) ? [] : {}

  for (let key of Object.keys(obj)) {
    result[key] = deepClone(obj[key])
  }

  return result
}
import { getPmHardAPI } from '@/api/diagnostics/maintenanceAPI'
export default {
    data() {
        return {
            datas: {
                selectedMaintenanceType: null,
                boothInfo : [],
                zoneInfo : [],
                robotInfo : [],
                selectedZoneInfo : [],
                selectedRobotInfo: [],
                violatedPmhard: [],
                robotAxis: null,
            }
        }
    },
    computed: {
        ... mapGetters({
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
        })
    },
    created() {
    },
    mounted() {
        this.initData();
    },
    methods: {
        clickReportType(type){
            this.datas.selectedMaintenanceType = type === 0 ? 0 : 1
        },
        async initData(){
            this.datas.selectedMaintenanceType = 0;
            this.datas.selectedZoneInfo = [];
            this.datas.selectedRobotInfo = [];
            this.datas.boothInfo = deepClone(this.getRenewBoothInfos)
            this.datas.zoneInfo = deepClone(this.getRenewZoneInfos)
            this.datas.robotInfo = deepClone(this.getRenewRobotInfos)
            this.datas.robotInfo.forEach(robot => {
                let header = [];
                for(let i = 0; i < robot.robot_axis; i++){
                    header.push({text: `${i+1}${this.$t(`report.hardware.tableHeader.header.axis`)}`})
                }
                Object.assign(robot, {robot_header : header})
                Object.assign(robot, {capacitor : 0})
                Object.assign(robot, {coolingfan : [0,0,0,0]})
                Object.assign(robot, {motor : Array(robot.robot_axis).fill(0)})
            })
            let tempIndex = 0;
            let tempNumber = 0;
            this.datas.zoneInfo.forEach(zone => {
                Object.assign(zone, {robot : this.datas.robotInfo.filter(robot => robot.zone_id === zone.zone_id)})
                let maxRobotAxis = Math.max(...zone.robot.map(e => e.robot_axis))
                let header = [];
                header.push({text: zone.zone_name, value: 'zone_name'})
                for(let i = 0; i < maxRobotAxis; i ++){
                    header.push({text: `${i+1}${this.$t(`report.hardware.tableHeader.header.axis`)}(Motor)`, value: `${i+1}axis`})
                }
                header.push(
                    { text: 'ControlBox(%)', value: 'cotrol_box'},
                    { text: 'Manipulation(%)', value: 'manipulation'},
                    { text: 'Cps(%)', value: 'cps'},
                    { text: 'Resernative_Fan(%)', value: 'resernative_fan'},
                    { text: 'Capacitor(%)', value: 'capacitor'},
                )
                Object.assign(zone, {zone_header: header})
                zone.robot.forEach(robot => {
                    if(robot.motor.length % maxRobotAxis != 0){
                        tempIndex = maxRobotAxis - robot.motor.length % maxRobotAxis;
                        for(let i = 0; i < tempIndex; i++){
                            robot.motor.push(0)
                        }
                    }
                })
            })
            this.datas.boothInfo.forEach((booth,index) => {
                Object.assign(booth, {zone : this.datas.zoneInfo.filter(zone => zone.disp_booth_id === booth.booth_id)})
                this.datas.selectedZoneInfo.push(booth.zone[0])
            })
            this.datas.selectedZoneInfo.forEach(zz => {
                zz.robot.forEach(rr => {
                    this.datas.selectedRobotInfo.push(rr)
                })
            })
            await this.getViolatedPmhard();
            this.datas.selectedZoneInfo.forEach(ll => {
                let maxRobotAxis = Math.max(...ll.robot.map(e => e.robot_axis))
                ll.robot.sort(function (a, b) {
                    return a.robot_no < b.robot_no ? -1: 1;
                })
                ll.robot.forEach(rr => {
                    this.datas.violatedPmhard.forEach(vv => {
                        if(rr.robot_id === vv.robot_id){
                            rr.coolingfan = vv.coolingfan
                            rr.capacitor = vv.capacitor
                            rr.motor = vv.motor
                        }
                        if(rr.motor.length % maxRobotAxis != 0){
                                tempNumber = maxRobotAxis - rr.motor.length % maxRobotAxis;
                                for(let i = 0; i < tempNumber; i++){
                                rr.motor.push(0)
                            }
                        }
                    })
                })
            })
            let temp = [];
            temp = deepClone(this.setSelectedZoneInfo(this.datas.selectedZoneInfo));
            this.datas.selectedZoneInfo = [];
            this.datas.selectedZoneInfo = temp;
        },
        async getViolatedPmhard(){
            let robot_id = ''
            robot_id = this.setRobotId();
            this.datas.violatedPmhard = []
            const result = await getPmHardAPI(robot_id)
            if(result.data !== ''){
                let fan_data = this.setCoolingFan(result.data.filter(el => el.data_type === 0));
                let capacitor_data = this.setCapacitor(result.data.filter(el => el.data_type === 2))
                let motor_data = this.setMotor(result.data.filter(el => el.data_type === 4))
                fan_data.forEach(el => {
                    capacitor_data.forEach(item => {
                        if(el.robot_id === item.robot_id){
                            el.capacitor = item.capacitor
                        }
                    })
                    motor_data.forEach(element => {
                        if(el.robot_id === element.robot_id){
                            el.motor = element.motor
                        }
                    })
                })
                this.datas.violatedPmhard = fan_data
            }
        },
        setCoolingFan(fan_data){
            let result = fan_data.reduce((acc, {robot_id, fan_type, percentage}) => {
            const item = acc.some(o => o.robot_id == robot_id) ? acc.filter(o => o.robot_id == robot_id)[0] : {robot_id, coolingfan: []}
            if (item.coolingfan.length < fan_type) {
                const addCnt = fan_type - item.coolingfan.length
                const newArray = Array(addCnt).fill(0)
                item.coolingfan = [...item.coolingfan, ...newArray]
            }
            if(!item.coolingfan[fan_type]){
                if(fan_type !== -1){
                    item.coolingfan[fan_type] = parseInt(percentage)
                }
            }
            if (acc.some(o => o.robot_id == robot_id)) {
                return acc.map(o => o.robot_id == robot_id ? item : o)
            } else {
                acc.push(item)
                return acc
            }
            }, [])
            return result
        },
        setCapacitor(capacitor_data){
            let result = capacitor_data.reduce((acc, {robot_id, percentage}) => {
            const item = acc.some(o => o.robot_id == robot_id) ? acc.filter(o => o.robot_id == robot_id)[0] : {robot_id, capacitor: 0}
            item.capacitor = parseInt(percentage)
            if (acc.some(o => o.robot_id == robot_id)) {
                return acc.map(o => o.robot_id == robot_id ? item : o)
            } else {
                acc.push(item)
                return acc
            }
            }, [])
            return result
        },
        setMotor(motor_data){
            let result = motor_data.reduce((acc, {robot_id, axis_type, percentage}) => {
            const item = acc.some(o => o.robot_id == robot_id) ? acc.filter(o => o.robot_id == robot_id)[0] : {robot_id, motor: []}

            if (item.motor.length < axis_type) {
                const addCnt = axis_type - item.motor.length
                const newArray = Array(addCnt).fill(0)
                item.motor = [...item.motor, ...newArray]
            }
            if(!item.motor[axis_type-1]){
                if(axis_type !== -1){
                    item.motor[axis_type-1] = parseInt(percentage)
                }
            }
            if (acc.some(o => o.robot_id == robot_id)) {
                return acc.map(o => o.robot_id == robot_id ? item : o)
            } else {
                acc.push(item)
                return acc
            }
            }, [])
            return result
        },
        setRobotId(){
            let robot_id = ''
            for(let i = 0; i < this.datas.selectedRobotInfo.length; i++){     // 선택된 존에 robot_id
                let tempdata = "'" + this.datas.selectedRobotInfo[i].robot_id + "'"
                if(i == this.datas.selectedRobotInfo.length - 1) {
                    robot_id += tempdata
                }
                else {
                    robot_id += (tempdata + ',');
                }
            }
            return robot_id
        },
        async selectZone(zone){
            let tempNumber = 0
            this.datas.selectedRobotInfo = [];
            this.datas.selectedZoneInfo.forEach(zz => {
                if(zz.booth_id === zone.booth_id){zz = zone}
                zz.robot.forEach(rr => {
                    this.datas.selectedRobotInfo.push(rr)
                })
            })
            await this.getViolatedPmhard();
            this.datas.selectedZoneInfo.forEach(ll => {
                let maxRobotAxis = Math.max(...ll.robot.map(e => e.robot_axis))
                ll.robot.sort(function (a, b) {
                    return a.robot_no < b.robot_no ? -1: 1;
                })
                ll.robot.forEach(rr => {
                    this.datas.violatedPmhard.forEach(vv => {
                        if(rr.robot_id === vv.robot_id){
                            rr.coolingfan = vv.coolingfan
                            rr.capacitor = vv.capacitor
                            rr.motor = vv.motor
                        }
                        if(rr.motor.length % maxRobotAxis != 0){
                                tempNumber = maxRobotAxis - rr.motor.length % maxRobotAxis;
                                for(let i = 0; i < tempNumber; i++){
                                rr.motor.push(0)
                            }
                        }
                    })
                })
            })
            let result = [];
            result = deepClone(this.setSelectedZoneInfo(this.datas.selectedZoneInfo));
            this.datas.selectedZoneInfo = [];
            this.datas.selectedZoneInfo = result;
        },
        setSelectedZoneInfo(array){
            let result = [];
            let tempIndex = 0
            array.forEach(ll => {
                let maxRobotAxis = Math.max(...ll.robot.map(e => e.robot_axis))
                ll.robot.sort(function (a, b) {
                    return a.robot_no < b.robot_no ? -1: 1;
                })
                ll.robot.forEach(rr => {
                    this.datas.violatedPmhard.forEach(vv => {
                        if(rr.robot_id === vv.robot_id){
                            rr.coolingfan = vv.coolingfan
                            rr.capacitor = vv.capacitor
                            rr.motor = vv.motor
                        }
                        if(rr.motor.length % maxRobotAxis != 0){
                                tempIndex = maxRobotAxis - rr.motor.length % maxRobotAxis;
                                for(let i = 0; i < tempIndex; i++){
                                rr.motor.push(0)
                            }
                        }
                    })
                })
            })
            result = array
            return result
        }
    }
  }
</script>
<style lang="scss">
    @import "./hardwarelifetimetable"
</style>