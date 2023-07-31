<template>
    <v-card class="maintenanceInfoTableCard text-xs-center" elevation="0" :color="cardColor" v-bind="initialize">
        <v-card-title v-bind:style="ui.titleStyle" class="cardTitle">
            <span>{{ui.maintenanceInfoTableTitle}}</span>
            <a class="convert" @click="convertClicked">{{'['+ui.detailShowText+']'}}</a>
        </v-card-title>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
        >
            <template slot="headers">
                <tr>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center" v-for="(header, index) in headers" :key="index">{{ header.title }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" :key="props.index" >
                    <td class="text-xs-center tdText">{{ props.item.unit}}</td>
                    <td class="text-xs-center tdText">{{ props.item.maint_point}}</td>
                    <td class="text-xs-center tdText">{{ props.item.maint_name}}</td>
                    <td class="text-xs-center">
                        <v-progress-circular :color="getProgressColor(props.item.progress)" :value="100" v-if="props.item.progress != undefined">
                            {{ props.item.progress }}
                        </v-progress-circular>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1">
                <v-pagination v-model="pagination.page" :length="pages"  :total-visible="7" :color="paginationColor"></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['headerDatas' ,'contentDatas', 'highlightFlag'],
    data() {
        return {
            ui: {
                maintenanceInfoTableTitle: this.$t(String(`home.child.maintenanceInfoTable.maintenanceInfoTableTitle`)),
                detailShowText: this.$t(String(`home.showDetailPage`)),
                titleStyle: null,
                tableHeaderStyle: null
            },
            cardColor: '',
            detailDisableFlag: false,
            pagination: {
                values: 1,
                rowsPerPage: 4,
            },
            totalCount: 0,
            paginationColor: '#237ffe !important',
            pageNum: 0,
            itemNum: '',
            headers: [],
            datas: []
        }   
    },
    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'
        }),
        initialize() {
            this.getHeaderData();
            this.getContentData();
            this.calTotalCount();
        },
        pages () {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
                return 0;
            } 
            return Math.ceil(this.datas.length / this.pagination.rowsPerPage)
        }
    },
    created() {
        this.initDataTable();
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.cardColor = this.$style.common.tableCardBottomColor;
            document.documentElement.style.setProperty("--convert", this.$style.home.tableMaintenanceShowDetailTextColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.home.boothMonitoringCardItemTdColor);
            document.documentElement.style.setProperty("--maintenanceInfoTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        getHeaderData() {
            if (this.headerDatas.length != 0) {
                this.headers = this.headerDatas;    
            }            
        },
        getContentData() {
            if (this.contentDatas.length != 0) {      
                this.datas = [];
                this.datas = this.contentDatas;
                if (this.datas.length % this.pagination.rowsPerPage != 0) {
                    this.insertTempDatas();
                }
            } 
        },
        calTotalCount() {
            let tempIndex = 0;
            if (this.datas[0][this.headers[0].id] == undefined) {
                this.totalCount = 0;
            } 
            else if(this.datas.length < this.pagination.rowsPerPage) {
                this.totalCount = this.datas.length;
            } 
            else {
                for (let i = (this.datas.length-this.pagination.rowsPerPage); i < this.datas.length; i++) {  
                    if (this.datas[i][this.headers[0].id] == undefined) {
                        tempIndex++;
                    }
                }
                this.totalCount = this.datas.length - tempIndex;
            }
        },
        initDataTable() {
            if (this.datas.length == 0 && this.headerDatas != '') {
                let tempObj = {};
                for (let i = 0; i < this.headerDatas.length; i++) {
                     tempObj[this.headerDatas[i].id] = undefined;
                }   
                for (let i = 0; i < this.pagination.rowsPerPage; i++) {
                    this.datas.push(tempObj);
                }
            }
        },
        convertClicked() {
            this.$router.push('/sps/maintenance');
        },
        insertTempDatas() {
            let tempDatas = {};
            let tempIndex = this.pagination.rowsPerPage - (this.datas.length % this.pagination.rowsPerPage);
            
            for (let i = 0; i < tempIndex; i++) {
                for (let j = 0; j < this.headerDatas.length; j++) {
                    tempDatas[this.headerDatas[j].id] = undefined;
                }
                this.datas.push(tempDatas);
            }
        },
        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);    
           
            return preDate <= currDate;
        },
        checkTargetDatas(boothId, zoneId, robotId, predate, currdate) {
            let postDatas = {'factoryid': `${this.getFactoryId}`, 'prevtime': predate , 'currtime': currdate};
            if (boothId != undefined) {
                postDatas['boothid'] = boothId;
            }
            if (zoneId != undefined) {
                postDatas['zoneid'] = zoneId;
            }
            if (robotId != undefined) {
                postDatas['robotid'] = robotId;
            }
            return postDatas;
        },  
       
        getProgressColor(value) {
            if (value < 20) {
                return this.$style.home.tableMaintenanceWarningStatus.high;
            } 
            else if (value >= 20 && value <= 80) {
                return this.$style.home.tableMaintenanceWarningStatus.mid;
            } 
            else if (value > 80){
                return this.$style.home.tableMaintenanceWarningStatus.low;
            }
        },
    }
}
</script>

<style scoped lang="scss">
    @import "MaintenanceInfoTable";
</style>
