<template>
    <v-dialog
        v-if="priorityFlag"
        v-model="priorityFlag"
        persistent
        max-width="1000"
        @keydown.esc="exitBtnClicked"
    >
        <v-card class="dateAggregationDlgCard">
            <v-card-title v-bind:style="ui.styleObject">{{ui.totalDate}}</v-card-title>
            <v-layout class="pt-2">
                <v-flex lg6 class="pl-3 pr-2">
                    <v-card class="dateAggregationDlgSubCard">
                        <v-card-title class="dateAggregationDlgSubCardTitle justify-center">
                            <v-layout class="subTitleContent" column>
                                <div>{{ui.processAlarmEventRatio}}</div>
                                <div>{{getDatePeriod()}}</div>
                            </v-layout>
                        </v-card-title>
                        <date-aggregation-pie-chart
                            v-bind:chartId="'dateAggreagationPieChart'"
                            v-bind:chartHeight="chartHeight"
                            v-bind:chartDatas="dateAggregationDatas"
                        ></date-aggregation-pie-chart>
                    </v-card>
                </v-flex>
                <v-flex lg6 class="pl-2 pr-3">
                    <v-card class="dateAggregationDlgSubCard">
                        <v-card-title class="dateAggregationDlgSubCardTitle justify-center">{{ui.alarmInfo}}</v-card-title>
                        <v-textarea class="alarmInfos" box readonly :height="textAreaHeight" :value="getAlarmCodeDatas"></v-textarea>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout class="pt-2 pb-2">
                <v-flex lg12 class="pl-2 pr-3">
                    <v-card >
                        <v-card-title class="justify-center dateAggregationDlgSubCardTitle">
                            <v-layout class="subTitleContent" column>
                                <div>{{ui.alarmTypeStopTime}}</div>
                                <div>{{getDatePeriod()}}</div>
                            </v-layout>
                        </v-card-title>
                        <alarm-mixed-chart
                            v-bind:chartId="'dateAggregationMixedChart'"
                            v-bind:chartBackgroundColor="ui.chartBackgroundColor"
                            v-bind:chartHeight="chartHeight"
                            v-bind:alarmMixedChartDatas="alarmNameDatas"
                        ></alarm-mixed-chart>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-card-actions>
                <v-spacer/>
                <v-btn class="exitBtn" @click="exitBtnClicked">{{ui.confirm}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import DateAggregationPieChart from '@/components/diagnostics/alarmstatistics/alarmstatistics/dateaggregationdlg/DateAggregationPieChart'
import AlarmMixedChart from '@/components/diagnostics/alarmstatistics/alarmstatistics/AlarmMixedChart'
export default {
    components: {DateAggregationPieChart, AlarmMixedChart},
    props: ['priorityFlag', 'alarmNameDatas', 'alarmCodeDatas', 'alarmType', 'dateAggregationDatas', 'datePeriod'],
    data() {
        return {
            ui: {
                totalDate: this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.totalDate`),
                processAlarmEventRatio: this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.processAlarmEventRatio`),
                alarmInfo: this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.alarmInfo`),
                alarmTypeStopTime: this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.alarmTypeStopTime`),
                confirm: this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.confirm`),
                styleObject: null,
                chartBackgroundColor: ''
            },
            textAreaHeight: 293,
            chartHeight: 300,
            alarmCode: '',
            alarmContents: ''
        }
    },

    created() {
        this.initializeUI();
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        dateAggregationStyles() {
            return {
                height: `${this.chartHeight}px`,
                position: 'relative'
            }
        },
        getAlarmCodeDatas() {
            if (this.alarmCodeDatas.length > 0) {
                if (this.alarmCodeDatas[0].alarm_name != undefined) {
                    this.alarmCode = this.alarmCodeDatas.alarm_code;
                    this.alarmContents = String(this.alarmCodeDatas[0].alarm_name).split('[')[0];
                    return this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.alarmDescription.alarmCode`) + this.alarmCode + '\n' + this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.alarmDescription.alarmDesc`) + this.alarmContents;
                }
                else {
                    let fullContents = '';
                    fullContents += this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.alarmDescription.alarmCode`) + this.alarmCodeDatas.alarm_code + '\n';
                    for(let i = 0; i < this.alarmCodeDatas.length; i++) {
                        fullContents+= this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.alarmDescription.alarmName`);
                        if(this.alarmCodeDatas[i][3] != null) {
                            fullContents+= this.alarmCodeDatas[i][3] + '\n';
                        } else {
                            fullContents+= this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.alarmDescription.alarmNoData`) + '\n';
                        }
                        fullContents+= 'SUB CODE : ';
                        if(this.alarmCodeDatas[i][2] != null) {
                            fullContents+= this.alarmCodeDatas[i][2] + '\n';
                        } else {
                            fullContents+= this.$t(`diagnostics.alarmstatistics.child.dateAggregationDlg.alarmDescription.alarmNoData`) + '\n';
                        }
                    }
                    return fullContents;
                }
            }
        }
    },

    methods: {
        initializeUI() {
            this.ui.chartBackgroundColor = this.$style.diagnostics.dateAggregationDlgItemSubCardBackgroundColor;
        },

        initializeStyle() {
            this.ui.styleObject = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--dateAggreagationDlgCardBackgroundColor", this.$style.diagnostics.dateAggregationDlgItemMainCardBackgroundColor);
            document.documentElement.style.setProperty("--dateAggregationDlgSubCardBackgroundColor", this.$style.diagnostics.dateAggregationDlgItemSubCardBackgroundColor);
            document.documentElement.style.setProperty("--dateAggreagationDlgSubCardTitleBackgroundColor", this.$style.diagnostics.dateAggregationDlgItemSubCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--dateAggregationDlgSubCardTitleColor", this.$style.diagnostics.dateAggregationDlgItemSubCardTitleColor);
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);
            document.documentElement.style.setProperty("--cardItemBorderColor", this.$style.common.cardItemBorderColor);
        },

        getDatePeriod() {
            if(this.datePeriod != undefined) {
                return this.datePeriod[0] + ' ~ ' + this.datePeriod[1];
            } else {
                return " ";
            }
        },

        exitBtnClicked() {
            this.$emit('changePriorityFlag');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './dateaggregationdlg';
</style>
