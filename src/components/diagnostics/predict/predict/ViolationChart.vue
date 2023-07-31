<template>
    <div v-bind="initialize">
        <violation-chart-p001 v-if="getViolationType() === 'P001'"
            v-bind:chartId="chartId"
            v-bind:chartHeight="chartHeight"
            v-bind:chartDatas="chartDatas"
        ></violation-chart-p001>
        <violation-chart-p002 v-if="getViolationType() === 'P002'"
            v-bind:chartId="chartId"
            v-bind:chartHeight="chartHeight"
            v-bind:chartDatas="chartDatas"
        ></violation-chart-p002>
        <violation-chart-p003 v-if="getViolationType() === 'P003'"
            v-bind:chartId="chartId"
            v-bind:chartHeight="chartHeight"
            v-bind:chartDatas="chartDatas"
        ></violation-chart-p003>
        <violation-chart-p004 v-if="getViolationType() === 'P004'"
            v-bind:chartId="chartId"
            v-bind:chartHeight="chartHeight"
            v-bind:chartDatas="chartDatas"
        ></violation-chart-p004>
        <violation-chart-p005 v-if="getViolationType() === 'P005'"
            v-bind:chartId="chartId"
            v-bind:chartHeight="chartHeight"
            v-bind:chartDatas="chartDatas"
        ></violation-chart-p005>
    </div>
</template>

<script>
import ViolationChartP001 from '@/components/diagnostics/predict/predict/violationchart/ViolationChartP001'
import ViolationChartP002 from '@/components/diagnostics/predict/predict/violationchart/ViolationChartP002'
import ViolationChartP003 from '@/components/diagnostics/predict/predict/violationchart/ViolationChartP003'
import ViolationChartP004 from '@/components/diagnostics/predict/predict/violationchart/ViolationChartP004'
import ViolationChartP005 from '@/components/diagnostics/predict/predict/violationchart/ViolationChartP005'
export default {
    components: {ViolationChartP001, ViolationChartP002, ViolationChartP003, ViolationChartP004, ViolationChartP005},
    props: ['chartId', 'chartHeight', 'violationType', 'chartDatas'],
    data() {
        return {
            ui: {

            },
            datas: {
                violationType: ""
            }
        }
    },

    created() {

    },

    mounted() {

    },

    computed: {
        initialize() {
            this.getChartDatas();
        }
    },

    methods: {
        getChartDatas() {
            if(this.chartDatas.length >= 0) {
                this.setViolationType();
            }
        },

        initViolationType() {
            this.datas.violationType = "";
        },

        setViolationType() {
            this.datas.violationType = this.violationType;
        },

        getViolationType() {
            return this.datas.violationType;
        }

    }
}
</script>

<style lang="scss" scoped>

</style>