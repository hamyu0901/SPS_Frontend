<template>
    <v-card class="boothMonitoringCard" v-bind="getChartDatas" :height="cardHeight" flat>
        <v-card-title class="boothStatusChartTitle">
            {{cardTitle}}
        </v-card-title>
        <div v-show="!flags.loading">
            <div :id="chartId"></div>
        </div>
        <div v-show="flags.loading">
            <pulse-loader 
                class="loading"
                :color="ui.loading.color"
            ></pulse-loader>
        </div>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import HomePieChart from '@/commons/chartjs/HomePieChart'
import pulseLoader from 'vue-spinner/src/MoonLoader.vue'
export default {
    components: { 
        HomePieChart,
        pulseLoader
    },
    props: ['cardTitle', 'cardHeight', 'chartHeight', 'boothid', 'chartId'],
    data(){
        return {
            ui: {
                loading: {
                    color: ""
                },
                default: {
                    backgroundColor: "",
                    height: this.chartHeight,
                    type: "",
                    startAngle: ""
                },
                toolTip: {
                    fontSize: ""
                },
                indexLabel: {
                    fontColor: "",
                    fontSize: ""
                },
                chartLegends: [],
                chartColors: []
            },
            
            datas: {
                chartOptions: {},
                chart: null
            },

            handle: {
                chartDatas: null
            },

            flags: {
                loading: true
            }
            
        }
    },

    created() {
        this.initializeUI();
    },

    mounted() {
        this.initializeStyle();
        this.initChartOptions();
    },

    destroyed() {
        clearInterval(this.handle.chartDatas);
    },

    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
        }),

        boothStatusChartStyles() {
            return {
                height: `${this.chartHeight}px`,
                position: 'relative'
            }  
        },
        getChartDatas() {
            this.intialize();
        }
    },
    
    methods: {
        initializeUI() {
            this.ui.loading.color = this.$style.home.boothMonitoringCardLoadingColor;

            this.ui.default.backgroundColor = this.$style.home.boothMonitoringCardColor;
            this.ui.default.height = this.chartHeight+2;
            this.ui.default.type = "pie";
            this.ui.default.startAngle = 240;

            this.ui.toolTip.fontSize = 20;
           
            this.ui.indexLabel.fontColor = this.$style.home.boothMonitoringCardChartIndexLabelFontColor;
            this.ui.indexLabel.fontSize = 15;
                
            this.ui.chartLegends = [
                this.$t(`home.robotStatus.offline`),    // 0
                this.$t(`home.robotStatus.ready`),      // 1
                this.$t(`home.robotStatus.action`),     // 2
                this.$t(`home.robotStatus.alarm`),      // 3 2019.08.20 홀드 정지는 사용 안됨. 
                this.$t(`home.robotStatus.alarm`)       // 4
            ];
            
            this.ui.chartColors = [
                this.$style.home.boothMonitoringCardChartOfflineColor, 
                this.$style.home.boothMonitoringCardChartReadyColor, 
                this.$style.home.boothMonitoringCardChartActionColor, 
                this.$style.home.boothMonitoringCardChartAlarmColor, 
                this.$style.home.boothMonitoringCardChartAlarmColor
            ];
        },

        initializeStyle() {
            document.documentElement.style.setProperty("--boothMonitoringCardBackgroundColor", this.$style.home.boothMonitoringCardColor);
            document.documentElement.style.setProperty("--boothMonitoringCardBorderColor", this.$style.home.boothMonitoringCardBorderColor);
            document.documentElement.style.setProperty("--boothStatusChartTitleColor", this.$style.home.boothMonitoringCardFontColor);
        },

        intialize() {
            this.handle.chartDatas = setInterval(this.update, 3000);
        },

        initChartOptions() {
            this.datas.chartOptions = {
                backgroundColor: this.ui.default.backgroundColor,
                height: this.ui.default.height,
                toolTip: {
                    fontSize: this.ui.toolTip.fontSize
                },
                data: []
            }
        },

        update() {
            let params = {
                boothid: this.boothid
            }
            this.$http.post(`${this.baseUrl}/home/status/info`, params).then((result) => {
                if (result.data == '') {

                }
                else {
                    let boothDatas = [0, 0, 0, 0, 0];
                    for (let idx = 0; idx < result.data.length; ++idx) {
                        if (result.data[idx].robot_status == 0) {
                            boothDatas[0] = Number(result.data[idx].count);
                        }
                        else if (result.data[idx].robot_status == 1) {
                            boothDatas[1] = Number(result.data[idx].count);
                        }
                        else if (result.data[idx].robot_status == 2) {
                            boothDatas[2] = Number(result.data[idx].count);
                        }
                        else if (result.data[idx].robot_status == 3) {
                            boothDatas[3] = Number(result.data[idx].count);
                        }
                        else if (result.data[idx].robot_status == 4) {
                            boothDatas[4] = Number(result.data[idx].count);
                        }
                    }
                    this.setChartDatas(boothDatas);
                }
            }).catch((error) => {
                this.$log.error(error);
            }); 
        },

        renderChart() {
            this.$nextTick(() => {
                if(this.datas.chart === null) {
                    this.datas.chart = new this.$chart.Chart(this.chartId, this.datas.chartOptions);
                }
                this.datas.chart.render();
            })
        },

        setDataPoints(boothDatas) {
            let dataPoints = [];
            boothDatas.forEach((boothData, index) => {
                dataPoints.push(
                    {y: boothData, label: this.ui.chartLegends[index], color: this.ui.chartColors[index]}
                )
            })
            return dataPoints;
        },

        setChartDatas(boothDatas) {
            let dataPoints = this.setDataPoints(boothDatas);
            if(this.datas.chartOptions.data.length === 0) {
                this.flags.loading = false;
                this.datas.chartOptions.data.push(
                    {
                        type: this.ui.default.type,
                        startAngle: this.ui.default.startAngle,
                        indexLabelFontColor: this.ui.indexLabel.fontColor,
                        indexLabelFormatter: function (e) {
                            if(e.dataPoint.y !== undefined && e.dataPoint.y !== 0) {
                                return e.dataPoint.label + " " + e.dataPoint.y;  
                            }
                            else {
                                return "";
                            }
                        },
                        indexLabelFontSize: this.ui.indexLabel.fontSize,
                        dataPoints: dataPoints
                    }
                )
            }
            this.renderChart();
        }
    }
}
</script>

<style scoped lang="scss">
    @import "BoothStatusChart";
</style>
