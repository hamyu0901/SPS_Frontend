<template>
     <v-dialog
        v-if="priorityFlag"
        v-model="priorityFlag"
        persistent
        max-width="1000"
        @keydown.esc="exitBtnClicked"
    >
        <v-card class="codeAggregationDlgCard">
            <v-card-title v-bind:style="ui.styleObject">{{ui.totalCode}}</v-card-title>
            <v-layout class="pt-2">
                <v-flex lg6 class="pl-3 pr-2">
                    <v-card class="codeAggregationDlgSubCard">
                        <v-card-title class="codeAggregationDlgSubCardTitle justify-center">{{ui.codeAlarmEvent}}</v-card-title>
                        <code-aggregation-chart
                            v-bind:chartId="'codeAlarmChart'"
                            v-bind:chartHeight="chartHeight"
                            v-bind:chartDatas="codeAlarmDatas"
                        ></code-aggregation-chart>
                    </v-card>
                </v-flex>
                <v-flex lg6 class="pl-2 pr-3">
                    <v-card class="codeAggregationDlgSubCard">
                        <v-card-title class="codeAggregationDlgSubCardTitle justify-center">{{ui.codeStopTime}}</v-card-title>
                        <code-aggregation-chart
                            v-bind:chartId="'codeStopChart'"
                            v-bind:chartHeight="chartHeight"
                            v-bind:chartDatas="codeStopDatas"
                        ></code-aggregation-chart>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout class="pt-2 pb-2">
                <v-flex lg6 class="pl-3 pr-2">
                    <v-card class="codeAggregationDlgSubCard">
                        <v-card-title class="codeAggregationDlgSubCardTitle justify-center">{{ui.alarmTypeEvent}}</v-card-title>
                        <code-aggregation-chart
                            v-bind:chartId="'alarmEventChart'"
                            v-bind:chartHeight="chartHeight"
                            v-bind:chartDatas="alarmEventDatas"
                        ></code-aggregation-chart>
                    </v-card>
                </v-flex>
                <v-flex lg6 class="pl-2 pr-3">
                    <v-card class="codeAggregationDlgSubCard">
                        <v-card-title class="codeAggregationDlgSubCardTitle justify-center">{{ui.alarmTypeStopTime}}</v-card-title>
                        <code-aggregation-chart
                            v-bind:chartId="'alarmstopChart'"
                            v-bind:chartHeight="chartHeight"
                            v-bind:chartDatas="alarmStopDatas"
                        ></code-aggregation-chart>
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
import CodeAggregationChart from '@/components/diagnostics/alarmstatistics/alarmstatistics/codeaggregationdlg/CodeAggregationChart'
export default {
    components: {CodeAggregationChart},
    props:['priorityFlag', 'codeAlarmDatas', 'codeStopDatas', 'alarmEventDatas', 'alarmStopDatas'],
    data() {
        return {
            ui: {
                totalCode: this.$t(`diagnostics.alarmstatistics.child.codeAggregationDlg.totalCode`),
                codeAlarmEvent: this.$t(`diagnostics.alarmstatistics.child.codeAggregationDlg.codeAlarmEvent`),
                codeStopTime: this.$t(`diagnostics.alarmstatistics.child.codeAggregationDlg.codeStopTime`),
                alarmTypeEvent: this.$t(`diagnostics.alarmstatistics.child.codeAggregationDlg.alarmTypeEvent`),
                alarmTypeStopTime: this.$t(`diagnostics.alarmstatistics.child.codeAggregationDlg.alarmTypeStopTime`),
                confirm: this.$t(`diagnostics.alarmstatistics.child.codeAggregationDlg.confirm`),
                styleObject: null
            },
            mainCardBackgroundColor: '',
            mainCardTitleBackgroundColor: '',
            subCardBackgroundColor: '',
            chartHeight: 300,
            dataBackgroundColor: [],
        }
    },

    mounted() {
        this.initializeStyle();
    },
   
    methods: {
        initializeStyle() {
            this.ui.styleObject = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--codeAggreagationDlgCardBackgroundColor", this.$style.diagnostics.codeAggregationDlgItemMainCardBackgroundColor);
            document.documentElement.style.setProperty("--codeAggregationDlgSubCardBackgroundColor", this.$style.diagnostics.codeAggregationDlgItemSubCardBackgroundColor);
            document.documentElement.style.setProperty("--codeAggreagationDlgSubCardTitleBackgroundColor", this.$style.diagnostics.codeAggregationDlgItemSubCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--codeAggregationDlgSubCardTitleColor", this.$style.diagnostics.codeAggregationDlgItemSubCardTitleColor);
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);
            document.documentElement.style.setProperty("--cardItemBorderColor", this.$style.common.cardItemBorderColor);
        },

        exitBtnClicked() {
            this.$emit('changePriorityFlag');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './codeaggregationdlg';
</style>
