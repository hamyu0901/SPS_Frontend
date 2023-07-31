<template>
    <div>
        <div v-for="(hardwareItem, hardwareIdx) in datas.hardwareData" :key="hardwareIdx" class="hardware_box">
            <div class="hardware_detail_title">{{hardwareItem.robot_name}} {{ui.headerTitle.hardware}}
                <img v-if="confirmAlertLevel(hardwareItem.current_data.axis_level)" src="@/images/report/warning.png"/>
            </div>
            <v-data-table
                class="hardware_table"
                hide-actions :headers="ui.detail_header"
                :items="hardwareItem.current_data.type"
                item-key="text"
            >
                <template v-slot:headers="props">
                    <tr>
                        <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.value">
                            <div>{{ header.text }}</div>
                        </th>
                        </tr>
                </template>
                <template v-slot:items="props">
                    <tr v-if ="props.index !== 3 && props.index !== 4">
                        <td class="text-xs-center"> {{ props.item.text }}</td>
                        <td class="text-xs-center" v-for="(item, idx) in props.item.level" :key="idx">
                            <v-btn class="statusBtn" flat :disabled="setDisabled(item)">
                                <hardware-btn-status
                                    v-bind:dataType="'level'"
                                    v-bind:axisLevel="item"
                                    v-bind:prevReport="prevReport"
                                    v-bind:exportFlag="true"
                                    v-bind:compareFlag="compareLevel(item)"
                                />
                            </v-btn>
                        </td>
                        <td v-if="props.item.prev_masterjob !== null && props.item.prev_masterjob !== '' && props.item.masterjob !== props.item.prev_masterjob" class="text-xs-center">{{props.item.prev_masterjob}}
                            <v-icon>mdi-arrow-right-bold-outline</v-icon>
                            {{ props.item.masterjob}}
                        </td>
                        <td class="text-xs-center" v-else>{{props.item.masterjob}}</td>
                    </tr>
                    <tr v-else-if ="props.index !== 4">
                        <td class="text-xs-center"> {{ props.item.text }}</td>
                        <td class="text-xs-center" v-for="(item, idx) in props.item.data" :key="idx" >
                            <hardware-btn-status
                                v-bind:dataType="'data'"
                                v-bind:axisLevel="props.item.level[idx]"
                                v-bind:axisData="item"
                                v-bind:btnStyle="'height: 30px; width: 30px; pointer-events: none;'"
                            />
                        </td>
                        <td class="text-xs-center">{{ props.item.masterjob}}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </div>
</template>
<script>
import { deepClone } from "@/utils/utils";
import HardwareBtnStatus from '@/components/report/report/HardwareBtnStatus.vue'
export default {
    components: {
        HardwareBtnStatus
    },
    props: {
        hardwareData: {
            type: Array
        },
        tableHeaderDetail:{
            type: Array
        },
        prevReport:{
            type:Array
        },
        exportFlag:{
            type: Boolean
        }
    },
    data(){
        return {
            ui : {
                tableHeaderStyle: '',
                detail_header: [],
                headerTitle: {
                    hardware: this.$t(`report.hardware.title.hardware`)
                },
            },
            datas: {
                hardwareData : [],
            }
        }
    },
    mounted(){
        this.initStyle()
        this.datas.hardwareData = deepClone(this.hardwareData)
        if(this.datas.hardwareData !== undefined && this.datas.hardwareData.length > 0) {
            this.datas.hardwareData.forEach(robot => {
                if(robot.rc_model_id === 0 || robot.tool_id === 2){
                    let temp = [];
                    temp = deepClone(robot.current_data)
                    temp.type[0] = temp.type[4]
                    robot.current_data = temp
                 }
            })
         }
    },
    watch: {
        hardwareData(){

        }
    },
    methods: {
        initStyle(){
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.ui.detail_header = this.tableHeaderDetail
            document.documentElement.style.setProperty("--tableCardTopColor", this.$style.common.tableCardTopColor);
            document.documentElement.style.setProperty("--tableTheadBackgroundColor", this.$style.common.tableTHeadBGColor);
            document.documentElement.style.setProperty("--tableTheadBorderBottomColor", this.$style.common.tableTHeadBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBackgroundColor", this.$style.common.tableTBodyOddBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBorderBottomColor", this.$style.common.tableTBodyOddBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBackgroundColor", this.$style.common.tableTBodyEvenBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBorderBottomColor", this.$style.common.tableTBodyEvenBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrBackgroundColor", this.$style.common.tableTBodyHoverColor);
            document.documentElement.style.setProperty("--tableTBodyPaginationItem", this.$style.common.tablePaginationColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.home.boothMonitoringCardItemTdColor);
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.gridTableItemBorderBottomColor);
            document.documentElement.style.setProperty("--gridTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        setDisabled(item){
            if(this.prevReport.length > 0) return item.curr_level === 2 && item.prev_level === 2
            else return item.curr_level === 2
        },
        confirmAlertLevel(levelItems){
            function findAlarLevel(levelItem){
                if(levelItem.curr_level === 1 || levelItem.prev_level === 1){
                    return true
                }
            }
           return levelItems.some(findAlarLevel)
        },
        compareLevel(levelItem){
            let compare = null
            compare = (this.prevReport.length > 0 && levelItem.curr_level === 1) || (this.prevReport.length > 0 && levelItem.prev_level === 1) ? true : false
            if(!compare){
                compare = this.prevReport.length > 0 && levelItem.curr_level !== levelItem.prev_level ? true : false
            }
            return compare
        }
    }
}
</script>
<style lang="scss" scoped>
    @import './HardwareTable.scss'
</style>