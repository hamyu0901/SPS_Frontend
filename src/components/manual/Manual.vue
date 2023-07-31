<template>
    <v-container fluid fill-height>
        <v-layout wrap row>
            <v-flex xs12 lg6 class="pb-3 pr-3">
                    <robot-manual-data-table
                    v-bind:headerData="infoTableHeaderData"
                    v-bind:contentData="robotInfoTableContentData"
                    v-bind:manualtype="robot"    
                    v-bind:highlightFlag="false" >
                    </robot-manual-data-table>
            </v-flex>
            <v-flex xs12 lg6 class="pb-3 pr-3">
                    <maintenance-manual-data-table
                    v-bind:headerData="infoTableHeaderData"
                    v-bind:contentData="maintenanceInfoTableContentData"
                    v-bind:manualtype="maintenance"    
                    v-bind:highlightFlag="false" >
                    </maintenance-manual-data-table>
            </v-flex>
            <v-flex xs12 lg6 class="pb-3 pr-3">
                    <video-manual-data-table
                    v-bind:headerData="infoTableHeaderData"
                    v-bind:contentData="videoInfoTableContentData"
                    v-bind:highlightFlag="false">
                    </video-manual-data-table>
            </v-flex>
            <v-flex xs12 lg6 class="pb-3 pr-3">
                    <trouble-shooting-manual-data-table
                    v-bind:headerData="infoTableHeaderData"
                    v-bind:contentData="troubleShootingInfoTableContentData"
                    v-bind:manualtype="trouble"    
                    v-bind:highlightFlag="false">
                    </trouble-shooting-manual-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>
    
<script>
import {mapGetters} from 'vuex'
import RobotManualDataTable from '@/components/manual/manual/GridTableWithPdf'
import MaintenanceManualDataTable from '@/components/manual/manual/GridTableWithPdf'
import VideoManualDataTable from '@/components/manual/manual/GridTableWithVideo'
import TroubleShootingManualDataTable from '@/components/manual/manual/GridTableWithPdf'

export default {
    components: {
        RobotManualDataTable, 
        MaintenanceManualDataTable,
        VideoManualDataTable,
        TroubleShootingManualDataTable
    },
    data() {
        return {
            infoTableHeaderData: [
                { text: this.$t(`manual.infoTableHeaderData.manualName`),  value: 'manual_name',   sortable: false, align: 'center'},
                { text: this.$t(`manual.infoTableHeaderData.fileName`),    value: 'file_name',     sortable: false, align: 'center'},
                { text: this.$t(`manual.infoTableHeaderData.fileFormat`),  value: 'file_format',   sortable: false, align: 'center'}
            ],
            robotInfoTableContentData: [],
            maintenanceInfoTableContentData: [],
            videoInfoTableContentData: [],
            troubleShootingInfoTableContentData: [],
            robot: 'robot',
            maintenance : 'maintenance',
            trouble: 'trouble',
            manualtype: {
                robot: 1,
                maintenance: 2,
                video: 3,
                trouble: 4
            }
        }
    },
    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl'
        }),  
    },
    mounted() {
        this.$emit('mountedTab');
        this.initializeStyle();
        this.getRobotManualData();
        this.getMaintenanceManualData();
        this.getVideoManualData();
        this.getTroubleShootingData();
    },
    methods: {
        initializeStyle() {
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
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.tableTBodyBBColor);
        },
        getRobotManualData() {
            let data;
            this.$http.post(`${this.baseUrl}/extra/manual/type`, {
                category: this.manualtype.robot
            }).then((result) => {
                for (let cnt = 0; cnt < result.data.length; cnt++) {
                    this.robotInfoTableContentData.push(data = {
                        manual_name: result.data[cnt].display_name,
                        file_name: String(result.data[cnt].file_name),
                        file_format: 'PDF'
                    });
                    this.totalCount = result.data.length;
                }
            }).catch((error) => {
                this.$log.error(error)
            })     
        },
        getMaintenanceManualData() {
            let data;
            this.$http.post(`${this.baseUrl}/extra/manual/type`, {
                category: this.manualtype.maintenance
            }).then((result) => {
                for (let cnt = 0; cnt < result.data.length; cnt++) {
                    this.maintenanceInfoTableContentData.push(data = {
                        manual_name: result.data[cnt].display_name,
                        file_name: String(result.data[cnt].file_name),
                        file_format: 'PDF'
                    });
                }
            }).catch((error) => {
                this.$log.error(error)
            })        
        },
        getVideoManualData() {
            let data = null;
            this.$http.get(`${this.baseUrl}/extra/manual/type/video/list`).then((result) => {
                let getData = result.data;
                if (typeof getData === 'object') {
                    let length = null;
                    let getKeys = null;
                    let getValues = null;
                    if (this.$i18n.locale == 'kr') {
                        length = Object.keys(getData.korean).length;
                        getKeys = Object.keys(getData.korean);
                        getValues = Object.values(getData.korean);
                    }
                    else if (this.$i18n.locale == 'en') {
                        length = Object.keys(getData.english).length;
                        getKeys = Object.keys(getData.english);
                        getValues = Object.values(getData.english);
                    }
                    else if (this.$i18n.locale == 'cn') {
                        // 중문 준비 안되있는 관계로 영문으로 진행 1.0.7
                        length = Object.keys(getData.english).length;
                        getKeys = Object.keys(getData.english);
                        getValues = Object.values(getData.english);
                    }
                    for (let cnt = 0; cnt < length; cnt++) {
                        this.videoInfoTableContentData.push(data = {
                            manual_name: getKeys[cnt],
                            file_name: getValues[cnt],
                            file_format: 'mp4'
                        });
                        this.totalCount = length;
                    }
                }
            }).catch((error) => {
                this.$log.error(error)
            })   
        },
        getTroubleShootingData() {
            let data;
            this.$http.post(`${this.baseUrl}/extra/manual/type`, {
                category: this.manualtype.trouble
            }).then((result) => {
                for (let cnt = 0; cnt < result.data.length; cnt++) {
                    this.troubleShootingInfoTableContentData.push(data = {
                        manual_name: result.data[cnt].display_name,
                        file_name: String(result.data[cnt].file_name),
                        file_format: 'PDF'
                    });
                }
            }).catch((error) => {
                this.$log.error(error)
            })   
        }
    }
}
</script>

<style scoped>

</style>