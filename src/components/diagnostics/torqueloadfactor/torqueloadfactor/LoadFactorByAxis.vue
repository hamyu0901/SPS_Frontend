<template>
    <v-card elevation="0" v-bind="getChartDatas" :color="ui.cardBackgroundColor">
        <v-card-title class="cardTitle pb-2" v-bind:style="ui.cardTitleStyle">
            <v-flex>
                {{chartTitle}}
            </v-flex>
            <div class="jobText">Most Worked Job: </div> <div class="masterJobName">{{mostJobName}}</div>
            <div class="jobText">{{ui.accumAvgText}}:</div> <div class="accumAVG">{{accumAvgText}}</div>
            <v-spacer/>
            <v-layout style="justify-content: right">
                <span style="font-size: 13px; align-items: center; display: flex; font-weight: normal;">{{ ui.showAlert }}</span>
                <v-btn :icon="true" @click="clickAlertBtnHandler"><v-icon color="red">{{ alertFlagIcon  }}</v-icon></v-btn>
            </v-layout>
            <v-btn-toggle v-model ="ui.torquedataToggle" class="toggleBtn">
                <v-btn v-for="(text, index) in ui.torquedataText" :key="index" @click="clickDailyAvgBtn(index)">{{text}}</v-btn>
            </v-btn-toggle>
        </v-card-title>
        <div :id="chartId"></div>
    </v-card>
</template>

<script>
export default {
    props: {
        chartId: {
            type: String
        },
        chartTitle: {
            type: String
        },
        chartHeight: {
            type: Number
        },
        chartDatas: {
            type: Array
        },
        configDatas: {
            type: Array
        },
        mostJobName: {
            type: String
        },
        accumAvgText: {
            type: String,
        },
        dailyAvgToggle: {
            type: Boolean | Number
        },
        showAlertFlag: {
            type: Boolean
        }
    },
    data() {
        return {
            ui: {
                torquedataToggle : false,
                torquedataText: [this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.sumChartTitle`),this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.dailyAccumAvgText`)],
                accumAvgText : this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.accumAvgText`),
                showAlert: this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.showAlert`),
                masterJobName : "",
                cardBackgroundColor: "",
                cardTitleStyle: null,
                default: {
                    text: "",
                    verticalAlign : "",
                    backgroundColor: "",
                    fontColor: "",
                    fontWeight: "",
                    fontSize: ""
                },
                title: {
                    text: "",
                    fontSize: "",
                    fontColor: "",
                    verticalAlign: "",
                    horizontalAlign: "",
                    padding: {
                        bottom: ""
                    },
                },
                axis: {
                    tickLength: "",
                    tickThickness: "",
                    labelFontColor: "",
                    labelFontSize: "",
                    axisX: {
                        title: "",
                        titleFontWeight: "",
                        lineColor: "",
                        labelWrap: "",
                        labelAutoFit: "",
                        labelFormatter: function(e){
                            let label = e.label;
                            if(label !== null){
                                return label.slice(0,16)
                            }
                            else{
                                return label
                            }
			            }
                    },
                    axisY: {
                        title: "",
                        lineThickness: "",
                        gridDashType: "",
                        gridColor: "",
                    },
                },
                legend: {
                    verticalAlign: "",
                    fontColor: "",
                },
                dataPoints: {
                    type: "",
                    xValueType: "",
                    lineThickness: "",
                    markerBorderThickness: "",
                    color: {
                        torque: "",
                        maxConfig: "",
                        minConfig: "",
                        violate: ""
                    },
                    name: {
                        torque: "",
                        maxConfig: "",
                        minConfig: ""
                    }
                }
            },
            datas: {
                chartOptions: {},
                configDatas: {},
                chart: null
            }
        }
    },

    created() {
        this.initializeUI();
        this.initChartOptions();
    },

    mounted() {
        this.initializeStyle();
    },

    watch: {
        dailyAvgToggle(){
            this.ui.torquedataToggle = this.dailyAvgToggle;
        }
    },

    destroyed() {
        this.destroyChart();
    },

    computed: {
        getChartDatas() {
            if(this.chartDatas.length > 0 && this.configDatas.length < 1) {
                this.datas.chartOptions.data = [];
                let dataPoints = [];
                dataPoints = this.setTorqueAccumDatas(this.chartDatas);
                this.setChartDatas(dataPoints);
            }
            else if(this.chartDatas.length > 0 && this.configDatas.length > 0) {
                this.datas.chartOptions.data = [];
                let dataPoints = [];
                dataPoints = this.setTorqueAccumDatas(this.chartDatas);
                let configDatas = this.setConfigDatas(this.configDatas);
                this.setAllChartDatas(dataPoints, configDatas);
            }
            else {
                this.initChartDatas();
            }
        },

        alertFlagIcon() {
            return this.showAlertFlag ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline';
        },

    },

    methods: {
        initializeUI() {
            this.ui.cardBackgroundColor = this.$style.common.tableCardBottomColor;;
            this.ui.cardTitleStyle = this.$style.common.titleObjectItemColor;

            this.ui.default.text = this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.defaultTextMessage`);
            this.ui.default.verticalAlign = "center";
            this.ui.default.backgroundColor = this.$style.diagnostics.torqueAccumChartBackgroundColor;
            this.ui.default.fontColor = this.$style.diagnostics.torqueAccumChartFontColor;
            this.ui.default.fontWeight = "lighter";
            this.ui.default.fontSize = 20;

            this.ui.axis.tickLength = 15;
            this.ui.axis.tickThickness = 0;
            this.ui.axis.labelFontColor = this.$style.diagnostics.torqueAccumChartAxisLabelFontColor;
            this.ui.axis.labelFontSize = 13;

            this.ui.axis.axisX.title = this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.xAxisTitle`);
            this.ui.axis.axisX.titleFontWeight = 'bold'
            this.ui.axis.axisX.lineColor = this.$style.diagnostics.torqueAccumChartAxisXLineColor;
            this.ui.axis.axisX.labelWrap = true;
            this.ui.axis.axisX.labelAutoFit = true;

            this.ui.axis.axisY.title = this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.yAxisTitle`);
            this.ui.axis.axisY.lineThickness = 0;
            this.ui.axis.axisY.gridDashType = "dash";
            this.ui.axis.axisY.gridColor = this.$style.diagnostics.torqueAccumChartAxisYGridColor;

            this.ui.legend.verticalAlign = "top";
            this.ui.legend.fontColor = this.$style.diagnostics.torqueAccumChartLegendFontColor;

            this.ui.dataPoints.type = "line";
            this.ui.dataPoints.xValueType = "dateTime";
            this.ui.dataPoints.lineThickness = 2;
            this.ui.dataPoints.markerBorderThickness = 2;
            this.ui.dataPoints.color.torque = this.$style.diagnostics.torqueAccumChartDataPointsColor.torque;
            this.ui.dataPoints.color.maxConfig = this.$style.diagnostics.torqueAccumChartDataPointsColor.maxConfig;
            // this.ui.dataPoints.color.minConfig = this.$style.diagnostics.torqueAccumChartDataPointsColor.minConfig;  //최소 설정값
            this.ui.dataPoints.color.violate = this.$style.diagnostics.torqueAccumChartDataPointsColor.violate;
            this.ui.dataPoints.name.torque = this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.torqueAccumLabel`);
            this.ui.dataPoints.name.maxConfig = this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.torqueWarningMaxLabel`);
            // this.ui.dataPoints.name.minConfig = this.$t(`diagnostics.torqueLoadFactor.child.loadFactorByAxis.torqueWarningMinLabel`);  //최소 설정값

        },

        initializeStyle() {
            const chartStyle = document.querySelector("#"+this.chartId);
            chartStyle.style.height = String(this.chartHeight)+"px";
            chartStyle.style.width = "100%";
            chartStyle.style.border = "solid 1px " + this.$style.common.cardItemBorderColor;
        },

        initChartOptions() {
            this.datas.chartOptions = {
                backgroundColor:this.ui.default.backgroundColor,
                subtitles: [],
                axisX: {
                    title: this.ui.axis.axisX.title,
                    titleFontSize: 15,
                    titleFontColor: '#495982',
                    titleFontWeight: "bold",
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineColor: this.ui.axis.axisX.lineColor,
                    labelFontColor: this.ui.axis.labelFontColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                    labelWrap: this.ui.axis.axisX.labelWrap,
                    labelAutoFit: this.ui.axis.axisX.labelAutoFit,
                    labelFormatter: this.ui.axis.axisX.labelFormatter,
                },
                axisY: {
                    title: this.ui.axis.axisY.title,
                    titleFontSize: 15,
                    titleFontColor: this.ui.axis.labelFontColor,
                    tickLength: this.ui.axis.tickLength,
                    tickThickness: this.ui.axis.tickThickness,
                    lineThickness: this.ui.axis.axisY.lineThickness,
                    labelFontColor: this.ui.axis.labelFontColor,
                    labelFontSize: this.ui.axis.labelFontSize,
                    gridDashType: this.ui.axis.axisY.gridDashType,
                    gridColor: this.ui.axis.axisY.gridColor
                },
                legend: {
                    verticalAlign: this.ui.legend.verticalAlign,
                    fontColor: this.ui.legend.fontColor
                },
                data: []
            }
        },

        setTorqueAccumDatas(torqueDatas) {
            let dataPoints = [];
            torqueDatas.forEach(torqueData => {
                dataPoints.push(
                    {label: torqueData.timestamp, y: torqueData.sum}
                );
            });
            return dataPoints;
        },

        setConfigDatas(configDatas) {
            let dataPoints = {};
            if(configDatas[0].maxsum === null) {
                dataPoints['maxsum'] = undefined;
            }
            else {
                dataPoints['maxsum'] = Number(configDatas[0].maxsum);
            }

            if(configDatas[0].minsum === null) {
                dataPoints['minsum'] = undefined;
            }
            else {
                dataPoints['minsum'] = Number(configDatas[0].minsum);
            }

            return dataPoints;
        },

        setSubTitle() {
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.subtitles.push({
                    text: this.ui.default.text,
                    verticalAlign : this.ui.default.verticalAlign,
                    fontColor: this.ui.default.fontColor,
                    fontWeight: this.ui.default.fontWeight,
                    fontSize: this.ui.default.fontSize
                })
            }
            else {
                this.datas.chartOptions.subtitles = [];
            }
        },

        renderChart() {
            this.$nextTick(() => {
                this.setSubTitle();
                if(this.datas.chart === null) {
                    this.datas.chart = new this.$chart.Chart(this.chartId, this.datas.chartOptions);
                }
                this.datas.chart.render();
            })
        },

        destroyChart() {
            this.datas.chart.destroy();
            this.datas.chart = null;
        },

        initChartDatas() {
            this.datas.chartOptions.data = [];
            this.renderChart();
        },

        initConfigDatas() {
            this.datas.configDatas = {};
        },

        setChartConfigDatas(chartDatas, configDatas) {
            return new Promise((resolve, reject) => {
                let chartConfigDatas = {maxSumDatas: [], minSumDatas: []};
                chartDatas.forEach(chartData => {
                    chartConfigDatas.maxSumDatas.push({label: chartData.label, y: configDatas.maxsum});
                    chartConfigDatas.minSumDatas.push({label: chartData.label, y: configDatas.minsum});
                })
                resolve(chartConfigDatas);
            })
        },

        setViolatePoints(chartDatas, configDatas) {
            return new Promise((resolve, reject) => {
                chartDatas.forEach(chartData => {
                    if(typeof configDatas.maxsum !== undefined && chartData.y > configDatas.maxsum) {
                        chartData['markerBorderColor'] = this.ui.dataPoints.color.violate;
                        chartData['indexLabelFontColor'] = this.ui.dataPoints.color.violate;
                    }
                    else if(typeof configDatas.minsum !== undefined && chartData.y < configDatas.minsum) {
                        chartData['markerBorderColor'] = this.ui.dataPoints.color.violate;
                        chartData['indexLabelFontColor'] = this.ui.dataPoints.color.violate;
                    }
                })
                resolve(chartDatas);
            })
        },

        setChartDatas(chartDatas) {
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        xValueType: this.ui.dataPoints.xValueType,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.torque,
                        name: this.ui.dataPoints.name.torque,
                        dataPoints: chartDatas
                    }
                )
                this.renderChart();
            }
        },

        async setAllChartDatas(chartDatas, configDatas) {
            let chartConfigDatas = await this.setChartConfigDatas(chartDatas, configDatas);
            let chartAccumDatas = await this.setViolatePoints(chartDatas, configDatas);
            if(this.datas.chartOptions.data.length === 0) {
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.dataPoints.type,
                        xValueType: this.ui.dataPoints.xValueType,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        markerBorderThickness: this.ui.dataPoints.markerBorderThickness,
                        indexLabelFormatter: function (e) {
                            if(e.dataPoint.markerBorderColor !== undefined && e.dataPoint.markerBorderColor !== "") {
                                return e.dataPoint.y;
                            }
                            else {
                                return "";
                            }
                        },
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.torque,
                        name: this.ui.dataPoints.name.torque,
                        dataPoints: chartAccumDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        xValueType: this.ui.dataPoints.xValueType,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.maxConfig,
                        name: this.ui.dataPoints.name.maxConfig,
                        dataPoints: chartConfigDatas.maxSumDatas
                    },
                    {
                        type: this.ui.dataPoints.type,
                        xValueType: this.ui.dataPoints.xValueType,
                        lineThickness: this.ui.dataPoints.lineThickness,
                        showInLegend: true,
                        visible: true,
                        color: this.ui.dataPoints.color.minConfig,
                        name: this.ui.dataPoints.name.minConfig,
                        dataPoints: chartConfigDatas.minSumDatas
                    }
                )
            }
            this.renderChart();
        },

        clickDailyAvgBtn(index){
            this.$emit('clickDailyAvgBtn', index)
        },

        clickAlertBtnHandler(){
            this.$emit('clickAlertBtnHandler', this.showAlertFlag)
        }
    }
}
</script>

<style scoped lang="scss">
    @import './loadfactorbyaxis';
</style>

