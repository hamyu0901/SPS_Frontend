<template>
    <v-card color="white">
        <v-layout>
            <v-spacer></v-spacer>
            <v-btn
                icon
                @click="clickCloseBtn"
                color="black"
                flat
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn
                icon
                @click="clickSaveBtn"
                color="black"
                flat
            >
                <v-icon>mdi-export</v-icon>
            </v-btn>
        </v-layout>
        <v-layout class="container">
            <div class="contentbox" ref="zone_report_content">
                <div class="title"><p>{{datas.factoryName}} 존 별 종합 요약</p></div>
                <div>
                    <zone-report-content-title
                        v-bind:filteredInputBox="datas.filteredInputBox"
                        v-bind:inputBox="datas.inputBox"
                        v-bind:alarmStatusReport="datas.alarmStatusReport"
                        v-bind:nonAlarmStatusReport="datas.nonAlarmStatusReport"
                    />
                </div>
                <div class="extraBox" v-bind:class="[{'line_top': datas.filteredInputBox}]">
                    <v-layout v-if="datas.filteredInputBox">
                        <v-flex><div style="background-color:#EF4C28" class="statusBtn">상세 점검 요망</div></v-flex>
                        <v-flex><div style="background-color:#2DB67C" class="statusBtn">이상 없음</div></v-flex>
                     </v-layout>
                    <v-layout v-for="(i,index) in datas.maxReportLength" :key="index" >
                        <v-flex class="flex_half">
                            <div v-if="datas.alarmStatusReport[index+1]">
                                <v-layout v-for="(reportItem, index) in datas.alarmStatusReport[index+1]" :key="index">
                                    <zone-status
                                        v-bind:reportItem="reportItem"
                                    />
                                </v-layout>
                            </div>
                        </v-flex>
                        <v-flex class="flex_half" >
                            <div v-if="datas.nonAlarmStatusReport[index+1]">
                                <v-layout v-for="(reportItem, index) in datas.nonAlarmStatusReport[index+1]" :key="index">
                                    <zone-status
                                        v-bind:reportItem="reportItem"
                                    />
                                </v-layout>
                            </div>
                        </v-flex>
                    </v-layout>
                </div>
            </div>
        </v-layout>
    </v-card>
</template>
<script>
import html2pdf from 'html2pdf.js';
import ZoneReportContentTitle from '@/components/report/report/export/ZoneReportContentTitle.vue'
import ZoneStatus from '@/components/report/report/export/ZoneStatus.vue'
import { getFactoryNameAPI } from '@/api/monitoringAPI'
    export default {
        components: {
            ZoneReportContentTitle,
            ZoneStatus
        },
        props: {
            zoneInfo : {
                type: Array
            }
        },
        data(){
            return {
                datas : {
                    factoryName: '',
                    inputBox : true,
                    filteredInputBox : false,
                    alarmStatusReport: [],
                    nonAlarmStatusReport: [],
                    selectedZoneReportItem: [],
                    maxReportLength: null,
                }
            }
        },
        async created(){
            this.datas.factoryName = await this.getFactoryName();
        },

        watch: {
            zoneInfo(){
                this.setReportItem()
            }
        },

        methods: {
            async getFactoryName() {
                const result = await getFactoryNameAPI();
                return result.data && result.data[0].factory_name;
            },

            clickCloseBtn(){
                this.$emit('clickCloseBtn')
            },

            setReportItem(){
                this.datas.selectedZoneReportItem = [];
                let alarmStatusItem = [];
                let nonAlarmStatusItem = [];
                this.zoneInfo.forEach(el => {
                    this.datas.selectedZoneReportItem.push({
                        zone_id : el.zone_id,
                        zone_name: el.zone_name,
                        zone_no : el.zone_no,
                        disp_booth_id : el.disp_booth_id,
                        report_name : el.selectedReport.report_name,
                        alarm_title : el.selectedReport.alarm_data.alarmTitle,
                        alarm_status : el.selectedReport.alarm_data.status,
                        hardware_title : el.selectedReport.current_data.hardwareTitle,
                        hardware_status : el.selectedReport.current_data.status,
                        atomizer_status : el.selectedReport.atomizer_data.status,
                        atomizer_title : el.selectedReport.atomizer_data.atomizer_title
                    })
                })

                this.datas.selectedZoneReportItem.forEach(item => {
                    item.alarm_status === 1 || item.hardware_status === 1 || item.atomizer_status === 1 ? alarmStatusItem.push(item) : nonAlarmStatusItem.push(item)
                })
                this.setStatusItem(alarmStatusItem, nonAlarmStatusItem);
            },
            setStatusItem(alarmStatusItem,nonAlarmStatusItem){
                this.datas.alarmStatusReport = [];
                this.datas.nonAlarmStatusReport = [];
                let size = 4
                let addSize = 8
                for(let i = 0; i < alarmStatusItem.length; i ++){
                    let value = alarmStatusItem.splice(0,size)
                    this.datas.alarmStatusReport.push(value)
                }

                for(let i = 0; i < nonAlarmStatusItem.length; i++){
                    let value = nonAlarmStatusItem.splice(0,size)
                    this.datas.nonAlarmStatusReport.push(value)
                }

                this.datas.alarmStatusReport.forEach(alarm => {
                    alarm.sort(function (a, b){
                        if(a.disp_booth_id === b.disp_booth_id){
                            return a.zone_no < b.zone_no ? -1: 1;
                        }
                        else{
                            return a.disp_booth_id < b.disp_booth_id ? -1: 1;
                        }

                    })
                })
                this.datas.nonAlarmStatusReport.forEach(nonAlarm => {
                    nonAlarm.sort(function (a, b) {
                        if(a.disp_booth_id === b.disp_booth_id){
                            return a.zone_no < b.zone_no ? -1: 1;
                        }
                        else{
                            return a.disp_booth_id < b.disp_booth_id ? -1: 1;
                        }
                    })
                })

                this.datas.maxReportLength = this.datas.alarmStatusReport.length > this.datas.nonAlarmStatusReport.length ? this.datas.alarmStatusReport.length : this.datas.nonAlarmStatusReport.length
            },
            clickSaveBtn(){
                this.datas.inputBox = false,
                this.datas.filteredInputBox = true;
                if(window.confirm('출력하시겠습니까?')){
                    html2pdf(this.$refs.zone_report_content, {
                        margin: 10,
                        filename: `zone.pdf`,
                        image: { type: 'jpeg', quality: 1 },
                        html2canvas: { scrollY: 0, scale : 1, dpi: 300 , letterRendering: true },
                        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait', compressPDF: true},
			        })

                }
                setTimeout(() => {
                    this.datas.inputBox = true
                    this.datas.filteredInputBox = false
                }, 1500)
                //orientation : 방향 -> portrait : '세로', landcape : '가로'
                // unit : 단위
                // format : 형식 'letter', 'a4', 'legal'
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './zonereportexportcontent.scss'
</style>