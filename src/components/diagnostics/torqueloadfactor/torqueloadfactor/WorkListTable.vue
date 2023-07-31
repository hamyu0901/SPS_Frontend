<template>
    <v-card class="text-xs-center workListTableCard" elevation="0" :color="cardColor" v-bind="initialize">
        <v-card-title class="cardTitle" :style="ui.titleStyle">
            {{ui.workTitle}}
        </v-card-title>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center" v-for="(header, index) in headers" :key="index">{{ header.title }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" :key="props.index">
                    <td :style="overWorkingCheck(props.item)" class="text-xs-center tdText" v-for="header in headers" :key="header.value">{{ props.item[header.id]}}</td>
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
    props: ['headerData' ,'contentData', 'configDatas'],
    data() {
        return {
            ui: {
                workTitle: this.$t(`diagnostics.torqueLoadFactor.child.workListTable.workTitle`),
                titleStyle: null,
                tableHeaderStyle: null
            },
            cardColor: '',
            pagination: {
                values: 1,
                rowsPerPage: 6,
            },
            paginationColor: '#237ffe !important',
            pageNum: 0,
            itemNum: '',
            configWorkTime: 0,
            headers: [],
            datas: [],
            contentDatas: [],
            totalCount: 0
        }   
    },
    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getFactoryId: 'getFactoryId',
        }),
        initialize() {
            this.getHeaderData();
            this.getContentData();
            this.calTotalCount();
            this.getConfigDatas();
        },
        pages () {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
                return 0;
            }
            else {
                return Math.ceil(this.datas.length / this.pagination.rowsPerPage);
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
            this.cardColor = this.$style.common.tableCardBottomColor;
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
            document.documentElement.style.setProperty("--workListTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        getHeaderData() {
            if (this.headerData.length != 0) {
                this.headers = this.headerData;
            }            
        },

        getContentData() {
            if (this.contentData.length != 0) {      
                this.datas = [];
                this.datas = this.contentData;
                if(this.datas.length % this.pagination.rowsPerPage != 0) {
                    this.setTempDatas();
                }
            } 
            else {
                this.datas = [];
                this.initDataTable();
            }
        },

        getConfigDatas() {
            if(this.configDatas.length > 0) {
               this.configWorkTime = this.configDatas[0].workingtime;
            }
            else {
                this.configWorkTime = null;
            }
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
            }
        },

        overWorkingCheck(item) {
            if(item.hasOwnProperty('undefined') != true && typeof this.configWorkTime === 'number') {
                if(item.cycle > this.configWorkTime) {
                    return this.$style.diagnostics.workListTableItemWarningStyle;
                }
            }
        },

        calTotalCount() {
            let tempIndex = 0;
            if (this.datas[0][this.headers[0].value] == '') {
                this.totalCount = 0;
            }
            else {
                for (let i = (this.datas.length-5); i < this.datas.length; i++) {
                    if (this.datas[i][this.headers[0].id] == '') {
                        tempIndex++;
                    }
                }
                this.totalCount = this.datas.length - tempIndex;
            }
        },
        setTempDatas() {
            let tempData = {timestamp: '', avg: '', cycle: ''};
            let tempIndex = this.pagination.rowsPerPage - (this.datas.length % this.pagination.rowsPerPage);
            for (let i = 0; i < tempIndex; i++) {
                this.datas.push(tempData);
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './worklisttable';
</style>
