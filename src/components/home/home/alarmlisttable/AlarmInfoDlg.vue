<template>
    <v-dialog
        v-model="alarmInfoDlgFlag"
        v-bind="getAlarmRateDatas, getAlarmContentDatas, getAlarmStopDatas"
        persistent
        max-width="1000"
    >
        <v-card :color="mainCardBackgroundColor">
            <v-card-title>{{ui.aggregateByDate}}</v-card-title>
            <v-layout class="pb-2">
                <v-flex lg6 class="pl-3 pr-2">
                    <v-card :color="subCardBackgroundColor">
                        <v-card-title class="justify-center">{{ui.alarmRatio}}</v-card-title>
                        <pie-chart :chartData="pieChartDataCollections" :options="pieChartOptions" :styles="alarmInfoDlgStyles"></pie-chart>
                    </v-card>
                </v-flex>
                <v-flex lg6 class="pl-2 pr-3">
                    <v-card :color="subCardBackgroundColor">
                        <v-card-title class="justify-center">{{ui.alarmInfo}}</v-card-title>
                        <v-textarea box readonly :height="textAreaHeight" :value="alarmContents"></v-textarea>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout class="pt-2 pb-2">
                <v-flex lg12 class="pl-2 pr-3">
                    <v-card :color="subCardBackgroundColor">
                        <v-card-title class="justify-center">{{ui.alarmStopTime}}</v-card-title>
                        <mixed-chart :chartData="mixedChartDataCollections" :options="mixedChartOptions" :styles="alarmInfoDlgStyles" ></mixed-chart>
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
import MixedChart from '@/commons/chartjs/MixedChart'
import PieChart from '@/commons/chartjs/PieChart'
export default {
    components: {MixedChart, PieChart},
    props: ['alarmInfoDlgFlag', 'alarmRateDatas', 'alarmContentDatas', 'alarmStopDatas'],
    data() {
        return {
            ui: {
                aggregateByDate: this.$t(String(`home.child.alarmInfoDlg.aggregateByDate`)),
                alarmRatio: this.$t(String(`home.child.alarmInfoDlg.alarmRatio`)),
                alarmInfo: this.$t(String(`home.child.alarmInfoDlg.alarmInfo`)),
                alarmStopTime: this.$t(String(`home.child.alarmInfoDlg.alarmStopTime`)),
                confirm: this.$t(String(`home.child.alarmInfoDlg.confirm`))
            },
            mainCardBackgroundColor: '#171a29',
            subCardBackgroundColor: '#2a2f43',
            textAreaHeight: 273,
            chartHeight: 300,
            alarmCode: '',
            alarmContents: '',
            mixedChartDataCollections: [],
            pieChartDataCollections: [],
            mixedChartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        id: 'deadtime',
                        position: 'left',
                        scaleLabel: {   
                            display: true,
                            labelString: this.$t(String(`home.child.alarmChart.deadtime`)),
                        },
                        gridLines: {
                            color: "#4f5575",
                            zeroLineColor: '#4f5575',
                            drawTicks: false,
                            drawBorder: false,
                            borderDash: [2, 4],
                            zeroLineBorderDash: [2, 4]
                        },
                        ticks: {
                            fontColor: '#bdc2dc'
                        }
                    }, {
                        id: 'count',
                        position: 'right',
                        scaleLabel: {
                            display: true,
                            labelString: this.$t(String(`home.child.alarmChart.count`))
                        },
                        ticks: {
                            fontColor: '#bdc2dc'
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            color: "#4f5575",
                            drawOnChartArea: false,
                            drawTicks: false,
                            drawBorder: false,
                        },
                        ticks: {
                            fontColor: '#bdc2dc',
                            padding: 10
                        }
                    }],
                }
            },
            pieChartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true
                },
                elements: {
                    arc: {
                        borderWidth: 0
                    },
                }
            },
        }
    },

    computed: {
        alarmInfoDlgStyles() {
            return {
                height: `${this.chartHeight}px`,
                position: 'relative'
            }  
        },

        getAlarmRateDatas() {
            if(this.alarmRateDatas.length > 0) {
                let labels = [];
                let datas = [];
                
                for(let i = 0; i < this.alarmRateDatas.length; i++) {
                    labels.push(this.alarmRateDatas[i].name);
                    datas.push(this.alarmRateDatas[i].count);
                }
                this.setPieChartDatas(labels, datas);
            } 
        },

        getAlarmContentDatas() {
            if(this.alarmContentDatas.length > 0) {
                this.setAlarmContentDatas(this.alarmContentDatas);
            } else {
                this.alarmContents = this.$t(String(`home.child.alarmInfoDlg.noDesc`));
            }
        },

        getAlarmStopDatas() {
            if(this.alarmStopDatas.length > 0) {
                let labels = [];
                let deadtimeDatas = [];
                let countDatas = [];
                
                for(let i = 0; i < this.alarmStopDatas.length; i++) {
                    labels.push(this.alarmStopDatas[i].time_stamp);
                    deadtimeDatas.push(this.alarmStopDatas[i].deadtime);
                    countDatas.push(this.alarmStopDatas[i].count);
                }
                this.setMixedChartDatas(labels, deadtimeDatas, countDatas);
            } 
        },
    },

    methods: {
        setMixedChartDatas(labels, deadtimeDatas, countDatas) {
            this.mixedChartDataCollections = {
                type: 'bar',
                labels: labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'DEADTIME',
                        yAxisID:'deadtime',
                        data: deadtimeDatas,
                        borderColor: 'white',
                        fill: false,
                        lineTension: 0
                    },

                    {
                        label: 'COUNT',
                        yAxisID: 'count',
                        data: countDatas,
                        backgroundColor: '#0ca889'
                    },
                ]
            }       
        },

        setPieChartDatas(labels, datas) {
            this.pieChartDataCollections = {
                labels: labels,
                datasets: [
                    {
                        backgroundColor: ['#0A68B6', '#2195F3', '#0A68B6', '#A3D2FA', '#E7F3FE'],
                        data: datas
                    }
                ]
            }
        },

        setAlarmContentDatas(alarmContentDatas) {
            this.alarmContents = '';
            let update_time = '';
            if(alarmContentDatas[1][0].update_time != null) {
                update_time = alarmContentDatas[1][0].update_time.split('T')[0];
            } else {
                update_time = null;
            }
            
            if(alarmContentDatas[0][0].alarm_code != undefined) {
                this.alarmContents += 
                                    '공정 정보 : ' + alarmContentDatas[1][0].booth_name + '-' + alarmContentDatas[1][0].zone_name + '-' + alarmContentDatas[1][0].robot_name + '\n' +
                                    '알람 코드 : ' + alarmContentDatas[0][0].alarm_code + '\n' +
                                    '서브 코드 : ' + alarmContentDatas[0][0].sub_code + '\n' +
                                    '발생 날짜 : ' + alarmContentDatas[1][0].time_stamp.split('T')[0] + '\n' +
                                    '해결 날짜 : ' + update_time + '\n' +
                                    '알람 이름 : ' + alarmContentDatas[0][0].alarm_name + '\n' + 
                                    '알람 내용 : ' + alarmContentDatas[0][0].contents + '\n\n' +
                                    '원인 : ' + alarmContentDatas[0][0].cause + '\n' + 
                                    '의미 : ' + alarmContentDatas[0][0].meaning + '\n' + 
                                    '해결 방안 : '+ '\n' + alarmContentDatas[0][0].remedy + '\n';     
            } else {
                // plc 알람 시 처리 부분      
                this.alarmContents +=
                                    '공정 정보 : ' + alarmContentDatas[1][0].booth_name + '-' + alarmContentDatas[1][0].zone_name + '-' + alarmContentDatas[1][0].robot_name + '\n' +
                                    '알람 코드 : ' + alarmContentDatas[1][0].alarm_code + '\n' + 
                                    '서브 코드 : ' + alarmContentDatas[1][0].alarm_sub_code + '\n' + 
                                    '발생 날짜 : ' + alarmContentDatas[1][0].time_stamp.split('T')[0] + '\n' +
                                    '해결 날짜 : ' + update_time + '\n' +
                                    '알람 이름 : ' + alarmContentDatas[1][0].alarm_name + '\n' + 
                                    '알람 내용 : ' + alarmContentDatas[1][0].alarm_content + '\n\n' +
                                    '원인 : ' + alarmContentDatas[0][0].cause + '\n' + 
                                    '의미 : ' + alarmContentDatas[0][0].message + '\n' + 
                                    '해결 방안 : '+ '\n' + alarmContentDatas[0][0].remedy + '\n';                 
            }            
        },

        exitBtnClicked() {
            this.$emit('changeAlarmInfoDlgFlag');
        }
    }
}
</script>

<style scoped>
    .alarmEventArea {
      width: 100%;
      height: 300px !important;
      background-color: #343A54;
      resize: none;
    }
</style>
