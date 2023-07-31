<template>
    <v-layout class="chartContainer">
        <v-flex class="chartBox" v-if="prevReport.length > 0">
            <v-layout class="prevchartLayout">
                <v-card class="chartInfo">
                    <v-layout v-for="(item,index) in ui.title.cardList" :key="index" class="listBox" column>
                        <v-layout class="listDetailBox">
                            <v-flex class="listTitle">{{item}}</v-flex>
                            <v-flex class="listBetween">:</v-flex>
                            <v-flex class="prevlistContents">
                                {{datas.prevItem[index]}}
                            </v-flex>
                        </v-layout>
                    </v-layout>
                </v-card>
                <v-flex class="prevCircleBox">
                    <span class="circleText">{{ui.title.alertCounting}}</span>
                    <v-progress-circular
                        :size="120"
                        :width="20"
                        :value=80
                        color="#F5443B"
                    >
                    {{chartInfo.previolatedCount}}
                    </v-progress-circular>
                </v-flex>
            </v-layout>
        </v-flex>
        <img src="@/images/report/chart_right_arrow.png" v-if="prevReport.length > 0"/>
        <v-flex class="chartBox">
            <v-layout class="chartLayout">
                <v-card class="chartInfo">
                    <v-layout v-for="(item,index) in ui.title.cardList" :key="index" class="listBox" column>
                        <v-layout class="listDetailBox">
                            <v-flex class="listTitle">{{item}}</v-flex>
                            <v-flex class="listBetween">:</v-flex>
                            <v-flex class="listContents">
                                {{datas.item[index]}}
                                <span v-if="datas.value[index] !== null && datas.value[index] > 0">
                                    <img src="@/images/report/plus.png"/>
                                    ({{datas.value[index]}}%)
                                </span>
                                <span v-if="datas.value[index] !== null && datas.value[index] < 0">
                                    <img src="@/images/report/minus.png"/>
                                    ({{datas.value[index]}}%)
                                </span>
                                <span v-if="datas.value[index] !== null && datas.value[index] === 0">
                                    ({{datas.value[index]}}%)
                                </span>
                            </v-flex>
                        </v-layout>
                    </v-layout>
                </v-card>
                <v-flex class="currCircleBox">
                    <span class="circleText">{{ui.title.alertCounting}}</span>
                    <v-progress-circular
                        :size="120"
                        :width="20"
                        :value=80
                        color="#F5443B"
                    >
                        {{chartInfo.violatedCount}}
                    </v-progress-circular>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>
<script>
    export default {
        props:['chartInfo','chartData','prevReport','prevChartData','selectedZoneReport','item','value','prevItem'],
        components: {

        },
        data () {
            return {
                ui: {
                    title: {
                        cardList: [this.$t(`report.hardware.title.reportName`), this.$t(`report.hardware.tableHeader.header.settingJob`),this.$t(`report.hardware.title.wargingValue`),this.$t(`report.hardware.title.dataAvg`)],
                        alertCounting: this.$t(`report.hardware.title.alertCounting`)
                    }

                },
                datas : {
                    item : [],
                    value : [],
                    prevItem: [],
                }
            }
        },
        mounted(){
            setTimeout(() => {this.initData()}, 500);
        },
        watch:{
            chartData(){
                setTimeout(() => {this.initData()}, 500);
            }
        },
        methods: {
            initData(){
                this.datas.item = this.item
                this.datas.value = this.value
                this.datas.prevItem = this.prevItem
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './reportchartinfocard';
</style>