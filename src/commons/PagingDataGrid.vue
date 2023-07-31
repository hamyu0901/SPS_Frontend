<template>
    <v-card class="text-xs-center gridTableCard" elevation="0" :color="cardColor" v-bind="initialize">
        <v-data-table class="elevation-0 dataTable" 
            hide-actions 
            :headers="headers" 
            :items="datas"
            :pagination.sync="pagination" 
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.text">
                        {{ header.text }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" @click="itemClicked(props)" :key="props.index">
                    <td class="text-xs-center tdText" v-for="header in headers" :key="header.value">
                        {{ props.item[header.value]}}</td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1">
                <v-pagination v-model="pagination.page" :length="pages" :total-visible="5" :color="paginationColor"
                    @input="onPageChange(itemNum, pagination.page)"></v-pagination>
            </div>
            <v-spacer />
            <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['headerData' ,'contentData', 'contentCount', 'highlightFlag'],
    data() {
        return {
            ui: {
                tableHeaderStyle: null
            },
            cardColor: '',
            pagination: {
                values: 1,
                rowsPerPage: 5,
            },
            paginationColor: '#237ffe !important',
            pageNum: 1,
            itemNum: '',
            headers: [],
            datas: [],
            totalCount: 0
        }   
    },
    computed: {
        ...mapGetters ({
            getFactoryId: 'getFactoryId',
        }),
        initialize() {
            this.getHeaderData();
            this.getContentCount();
            this.getContentData();
        },
        pages () {
            if(this.pagination.rowsPerPage == null || this.totalCount === 0) {
                return 0;
            } else {
                return Math.ceil(this.totalCount / this.pagination.rowsPerPage);
            }
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
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.cardColor = this.$style.common.gridTableItemCardColor;
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
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.gridTableItemBorderBottomColor);
            document.documentElement.style.setProperty("--gridTableCardBorderColor", this.$style.common.cardItemBorderColor);
           
        },
        initDataTable() {
            if (this.datas.length == 0 && this.headerData != '') {
                let tempObj = {};
                for (let i = 0; i < this.headerData.length; i++) {
                     tempObj[this.headerData[i].value] = '';
                }   
                for (let i = 0; i < this.pagination.rowsPerPage; i++) {
                    this.datas.push(tempObj);
                }
                for (let i = 0; i < Object.keys(this.$refs).length; i++) {
                    if (i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemOddBackgroundColor;
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemEvenBackgroundColor;
                    }
                }
            }
        },
        getHeaderData() {
            if(this.headerData.length != 0) {
                this.headers = this.headerData;
            }            
        },
        getContentCount() {
            if(this.contentCount !== 0) {
                this.totalCount = this.contentCount;
            } else {
                this.datas = [];
                this.initDataTable();
            }
        },
        getContentData() {
            if (this.contentData.length !== 0) {  
                if (this.contentData !== this.datas) {
                    let _this = this;
                    this.datas = [];
                    this.datas = this.contentData;
                    if(this.datas.length === 5) {
                        this.pageNum = 1;
                    }
                    this.setTempDatas();
                    setTimeout(function() {
                        _this.itemClicked(_this.datas[(_this.pageNum*5)-5]);
                    }, 500);
                } 
            } else {
                this.datas = [];
                this.initDataTable();
            }
        },
        setTempDatas() {
            let tempObj = {};
            for (let i = 0; i < this.headerData.length; i++) {
                    tempObj[this.headerData[i].value] = '';
            }
            let tempIndex = this.pagination.rowsPerPage - (this.datas.length % this.pagination.rowsPerPage);
            for (let i = 0; i < tempIndex; i++) {
                this.datas.push(tempObj);
            }
        },
       
        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);    
           
            return preDate <= currDate;
        },
        checkTargetDatas(boothId, zoneId, robotId, predate, currdate) {
            let postDatas = {'factoryid': `${this.getFactoryId}`, 'prevtime': predate , 'currtime': currdate};
            if (boothId !== undefined) {
                postDatas['boothid'] = boothId;
            }
            if (zoneId !== undefined) {
                postDatas['zoneid'] = zoneId;
            }
            if (robotId !== undefined) {
                postDatas['robotid'] = robotId;
            }
            return postDatas;
        },  

        itemClicked(workTimeInfo) {
            if (this.totalCount !== 0) {
                if (this.highlightFlag === true) {
                    if (workTimeInfo.index === undefined) {
                        this.rowHighLight(0);
                        this.$emit('getGridDataTableData', workTimeInfo);
                        this.itemNum = 0;
                    } else {
                        if (workTimeInfo.item[this.headers[0].value] !== "") {
                            this.rowHighLight(workTimeInfo.index);
                            this.$emit('getGridDataTableData', workTimeInfo.item); 
                            this.itemNum = workTimeInfo.index;
                        }
                    }
                } else {
                    if (workTimeInfo.index === undefined) {
                        this.$emit('getGridDataTableData', workTimeInfo);
                        this.itemNum = 0;
                    } else {
                        if (workTimeInfo.item[this.headers[0].value] !== "") {
                            this.$emit('getGridDataTableData', workTimeInfo.item);
                            this.itemNum = workTimeInfo.index;
                        }
                    }
                }
            }
        },
        rowHighLight(index) {
            for (let i = 0; i < Object.keys(this.$refs).length; i++){
                if (Number(Object.keys(this.$refs)[i]) === index) {
                    this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableItemHighLightColor;
                } else{
                    if (i % 2 == 0) {
                        console.log(this.$refs, this.$refs[Object.keys(this.$refs)[i]])
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyOddBGColor;
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyEvenBGColor;
                    }
                }
            }
        },
        onPageChange(itemNum, pageNum) {  
            if (this.highlightFlag === true) {
                this.pageNum = pageNum;
                this.$emit('pageNum', pageNum);
            } else {
                for (let i = 0; i < Object.keys(this.$refs).length; i++) {
                    if (i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyOddBGColor;
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyEvenBGColor;
                    }
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './gridtable';
</style>
