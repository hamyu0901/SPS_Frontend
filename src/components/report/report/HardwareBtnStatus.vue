<template>
    <span :class="['btnStatus']">
        <span v-if="dataType === 'data'">
            <v-btn :style="btnStyle" v-if="axisLevel.curr_level === 2" icon disabled>
                <v-icon :size="size" :color="ui.color"> {{ui.icon}}</v-icon>
            </v-btn>
            <v-btn  :style="btnStyle" v-else :color="ui.color" fab outline>
                {{ui.data}}
            </v-btn>
        </span>
        <span v-if="dataType === 'level'">
            <v-icon v-if="compareFlag" :color="ui.prev_color">{{ui.prev_icon}}</v-icon>
            <v-icon v-if="compareFlag">mdi-arrow-right-bold-outline</v-icon>
            <v-badge>
                <template v-slot:badge>
                    <img src="@/images/report/printed.png" v-if="axisLevel.print && !exportFlag"/>
                </template>
                <v-icon :size="size" :color="ui.color">{{ui.icon}}</v-icon>
            </v-badge>
            <div v-if="axisLevel.curr_level === 1 || axisLevel.prev_level === 1">
                <div v-if ="axisLevel.data_percentage < 0"><img src="@/images/report/minus.png"/> {{axisLevel.data_percentage}}%</div>
                <div v-if ="axisLevel.data_percentage > 0"><img src="@/images/report/plus.png"/> {{axisLevel.data_percentage}}%</div>
                <div v-if ="axisLevel.data_percentage == 0">{{axisLevel.data_percentage}}%</div>
            </div>
        </span>
        <span v-if="dataType === 'avg'">
            <v-layout column>
                <span v-if="prevReport.length > 0 && axisLevel.prev_level !== 2" :style="ui.preAvgStyle">{{axisLevel.prev_data_avg}}({{previolatedCount}})</span>
                <span v-if="prevReport.length > 0 && axisLevel.prev_level !== 2 && axisLevel.data_percentage == 0">
                    {{axisLevel.data_percentage}}%
                </span>
                <span v-if="prevReport.length > 0 && axisLevel.prev_level !== 2 && axisLevel.data_percentage > 0">
                    <img src="@/images/report/plus.png"/>{{axisLevel.data_percentage}}%
                </span>
                <span v-if="prevReport.length > 0 && axisLevel.prev_level !== 2 && axisLevel.data_percentage < 0">
                    <img src="@/images/report/minus.png"/>{{axisLevel.data_percentage}}%
                </span>
                <span v-if="axisLevel.curr_level !==2" :style="ui.avgStyle">{{axisLevel.data_avg}}({{violatedCount}}) <img src="@/images/report/printed.png" v-if="axisLevel.print"/></span>
            </v-layout>
            <v-btn :style="btnStyle" v-if="setDisabled(axisLevel)" icon disabled>
                <v-icon :size="size" :color="ui.color"> {{ui.icon}}</v-icon>
            </v-btn>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        prevReport : {
            default : Array
        },
        violatedCount: {
            type: Number
        },
        previolatedCount: {
            type: Number
        },
        axisLevel: {
          type: Object,
        },
         /** 컴포넌트 타입 (버튼/아이콘) */
        dataType: {
            type: String,
        },
        axisData: {
            type: Number
        },
        /** 알람 타입 (알람/정상/기본) */
        alarmType: {
            type: String,
            // default: AlarmType.default.name
        },
        /** 색상 */
        color: {
            type: String
        },
        /** 사이즈 */
        size: {
            type: Number,
            default: 30
        },
        btnStyle: {
            type: String,
            default: 'height: 30px; width: 30px;'
        },
        exportFlag: {
            type: Boolean
        },
        /** 타이틀 */
        title: String,
        /** 클랙 핸들러 */
        onClickHandler: Function,
        compareFlag: {
            type: Boolean
        }
    },
    data: () => ({
        ui: {
            icon: '',
            color: '',
            // compare: false,
            prev_icon: '',
            prev_color: '',
            avgStyle: '',
            preAvgStyle: ''
        },
    }),

    created() {
    },

    mounted() {
        this.setStatus();
    },

    destroyed() {
    },

    computed: {
    },
    watch: {
        axisLevel:{
            immediate : true,
            handler(val){
                this.setStatus();
            }
        }
    },

    methods: {
        onClick() {
            this.onClickHandler && this.onClickHandler();
        },
        setStatus(){
            switch(this.axisLevel.curr_level){
                case 0 :
                    this.ui.color = this.dataType === 'level' ? '#33CC33' : 'green'
                    this.ui.icon = 'mdi-check-circle-outline'
                    this.ui.data = this.axisData
                    this.ui.avgStyle = 'color : #33CC33'
                    break;
                case 1 :
                    this.ui.color = this.dataType === 'level' ? 'error' : 'yellow'
                    this.ui.icon = 'mdi-alert-circle-outline'
                    this.ui.data = this.axisData
                    this.ui.avgStyle = 'color : #ff5252'
                    break;
                case 2:
                    this.ui.color = '#8F8888'
                    this.ui.icon = 'mdi-minus-circle-outline'
                    this.ui.avgStyle = 'color : #8F8888'
                    break;
                default:
            }
            switch(this.axisLevel.prev_level){
                case 0 :
                    this.ui.prev_color = '#33CC33'
                    this.ui.prev_icon = 'mdi-check-circle-outline'
                    this.ui.preAvgStyle = 'color : #C5C5CE'
                    break;
                case 1 :
                    this.ui.prev_color = 'error'
                    this.ui.prev_icon = 'mdi-alert-circle-outline'
                    this.ui.preAvgStyle = 'color : #ff5252'
                    break;
                case 2:
                    this.ui.prev_color = '#8F8888'
                    this.ui.prev_icon = 'mdi-minus-circle-outline'
                    this.ui.preAvgStyle = 'color : #8F8888'
                    break;
                default:
            }
        },
        setDisabled(axisLevel){
            if(this.prevReport.length > 0) return axisLevel.curr_level === 2 && axisLevel.prev_level === 2
            else return axisLevel.curr_level === 2
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './hardwarebtnstatus';
</style>