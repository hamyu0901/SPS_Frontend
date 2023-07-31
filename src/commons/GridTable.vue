<template>
    <v-card class="text-xs-center gridTableCard" elevation="0" :color="cardColor" v-bind="initialize">
        <v-data-table class="elevation-0 dataTable" hide-actions :headers="headers" :items="datas"
            :pagination.sync="pagination">
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.value">
                        {{ header.text }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" @click="itemClicked(props, pagination.page)" :key="props.index">
                    <td class="text-xs-center tdText" v-for="(header, headerIdx) in headers" :key="header.value">
                      <span v-if="header.type === 'text'">{{ props.item[header.value]}}</span>
                      <img v-if="header.type === 'img' && props.item[header.value] !== null" :alt="header.text + headerIdx" :src="props.item[header.value]" />
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-layout class="grid_page_content">
            <div class="pt-1">
                <v-pagination v-model="pagination.page" :length="pages" :total-visible="7" :color="paginationColor"
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
    props: ['headerData' ,'contentData', 'highlightFlag', 'autoClicked'],
    data() {
        return {
            ui: {
                tableHeaderStyle: null
            },
            cardColor: '',
            pagination: {
                descending: true,
                values: 1,
                rowsPerPage: 6,
            },
            paginationColor: '#237ffe !important',
            pageNum: 0,
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
            this.getContentData();
        },
        pages () {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
                return 0;
            } else {
                return Math.ceil(this.datas.length / this.pagination.rowsPerPage)
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
                     tempObj[this.headerData[i].value] = null;
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
        getContentData() {
            if (this.contentData.length !== 0) {
                if (this.contentData !== this.datas) {
                    let _this = this;
                    this.datas = [];
                    this.datas = this.contentData;
                    if(this.datas.length % this.pagination.rowsPerPage != 0) {
                        this.setTempDatas();
                    } else {
                        this.totalCount = this.datas.length;
                    }
                    const autoClicked = this.autoClicked;
                    setTimeout(function() {
                        autoClicked !== false && _this.itemClicked(_this.datas[0],1);
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
                    tempObj[this.headerData[i].value] = null;
            }
            let tempIndex = this.pagination.rowsPerPage - (this.datas.length % this.pagination.rowsPerPage);
            for (let i = 0; i < tempIndex; i++) {
                this.datas.push(tempObj);
                if( i ===  tempIndex - 1) {
                    this.totalCount = this.datas.length - tempIndex;
                }
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

        itemClicked(workTimeInfo, pageNum) {
            if (this.totalCount !== 0) {
                this.pageNum = pageNum;
                if (this.highlightFlag === true) {
                    if (workTimeInfo.index === undefined) {
                        this.rowHighLight(0, pageNum);
                        this.$emit('getGridDataTableData', workTimeInfo);
                        this.$emit('torqueRangeGridDatasTableData', workTimeInfo);
                        this.itemNum = 0;
                    } else {
                        if (workTimeInfo.item[this.headers[0].value] !== "") {
                            this.rowHighLight(workTimeInfo.index, pageNum);
                            this.$emit('getGridDataTableData', workTimeInfo.item);
                            this.$emit('torqueRangeGridDatasTableData', workTimeInfo);
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
        rowHighLight(index, pageNum) {
            for (let i = 0; i < Object.keys(this.$refs).length; i++){
                if (Number(Object.keys(this.$refs)[i]) === index) {
                    this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableItemHighLightColor;
                } else{
                    if (i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyOddBGColor;
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyEvenBGColor;
                    }
                }
            }
        },
        onPageChange(itemNum, pageNum) {
            if (this.pageNum === pageNum && this.highlightFlag === true) {
                this.rowHighLight(itemNum, pageNum);
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
