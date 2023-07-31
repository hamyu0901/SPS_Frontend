<template>
    <v-card class="maintenanceCheckListTableCard text-xs-center" elevation="0" :color="cardColor" v-bind="initialize">
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center" v-for="(header, index) in headers" :key="index">{{ header.text }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" :key="props.index" @click="rowClicked(props.index, props.item)">
                    <td class="text-xs-center tdText">{{ props.item.maint_name }}</td>
                    <td class="text-xs-center tdText">{{ props.item.unit }}</td>
                    <td class="text-xs-center tdText">{{ props.item.maint_point }}</td>
                    <td class="text-xs-center tdText">
                        <v-progress-circular v-if="props.item.progress != undefined" :color="getProgressColor(props.item.progress)" :value="100">
                            {{ props.item.progress }}
                        </v-progress-circular>
                    </td>
                    <td class="text-xs-center tdText">{{ props.item.maint_description }}</td>
                    <td class="text-xs-center tdText">
                        <span v-if="props.item.maint_cycle != undefined">{{ props.item.maint_cycle + 'M' }}</span>
                        <span v-if="props.item.maint_cycle == undefined">{{ props.item.maint_cycle}}</span>
                    </td>
                    <td class="text-xs-center tdText">
                        <v-btn 
                            class="buttonItem"
                            small 
                            @click="detailBtnClicked(props)" 
                            v-if="props.item.maint_name != undefined"
                        >
                            {{ detailTitle }}
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1">
                <v-pagination v-model="pagination.page" :length="pages"  :total-visible="7" :color="paginationColor" @input="onPageChange(itemNum, pagination.page)"></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['headerData' ,'contentData', 'highlightFlag', 'defaultClickedFlag'],
    data() {
        return {
            ui: {
                tableHeaderStyle: null
            },
            cardColor: '',
            progressValue: '',
            detailTitle: this.$t(`maintenance.child.maintenanceCheckListTable.view`),
            detailDisableFlag: false,
            pagination: {
                values: 1,
                rowsPerPage: 5,
            },
            totalCount: 0,
            paginationColor: '#237ffe !important',
            pageNum: 0,
            itemNum: '',
            headers: [],
            datas: [],
            contentDatas: [],
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
        },

        pages () {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) 
            { 
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
        this.rowClicked(0, this.datas[0]);
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.cardColor = this.$style.maintenance.cardColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            document.documentElement.style.setProperty("--maintenanceCheckListTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        getHeaderData() {
            if(this.headerData.length != 0) {
                this.headers = this.headerData;    
            }            
        },
        getContentData() {
            if(this.contentData.length != 0) { 
                this.datas = [];
                this.datas = this.contentData;
                if(this.datas.length % this.pagination.rowsPerPage != 0) {
                    this.insertTempDatas();
                }
                if(this.defaultClickedFlag == true) {
                    this.pageNum = 0;
                    this.pagination.page = 1;
                    this.rowClicked(0, this.datas[0]);
                    this.$emit('defaultClickedFlag');
                }
            } else {
                this.datas = [];
                this.initDataTable();
            }
        },
        calTotalCount() {
            let tempIndex = 0;
            if(this.datas[0][this.headers[0].id] == undefined) {
                this.totalCount = 0;
            } else if(this.datas.length < 5) {
                this.totalCount = this.datas.length;
            } else {
                for(let i = (this.datas.length-5); i < this.datas.length; i++) {  
                    if(this.datas[i][this.headers[0].id] == undefined) {
                        tempIndex++;
                    }
                }
                this.totalCount = this.datas.length - tempIndex;
            }
        },
        initDataTable() {
            if(this.datas.length == 0 && this.headerData != '') {
                let tempObj = {};
                for(let i = 0; i < this.headerData.length; i++) {
                     tempObj[this.headerData[i].id] = undefined;
                }   
                for(let i = 0; i < this.pagination.rowsPerPage; i++) {
                    this.datas.push(tempObj);
                }
            }
        },
        insertTempDatas() {
            let tempDatas = {};
            let tempIndex = this.pagination.rowsPerPage - (this.datas.length % this.pagination.rowsPerPage);
            
            for(let i = 0; i < tempIndex; i++) {
                for(let j = 0; j < this.headers.length; j++) {
                    tempDatas[this.headers[j].id] = undefined;
                }
                this.datas.push(tempDatas);
            }
        },
        rowHighLight(index) {
            for (let i = 0; i < Object.keys(this.$refs).length; i++){
                if (Object.keys(this.$refs)[i] == index) {
                    this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyHoverColor;
                } else {
                    if (i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyOddBGColor;
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyEvenBGColor;
                    }
                }
            }
        },
        onPageChange(itemNum, pageNum) {  
            if (this.getTheme == true) {
                if (this.highlightFlag == true) {
                    let index = this.pagination.rowsPerPage * pageNum - this.pagination.rowsPerPage;
                    this.rowClicked(0, this.datas[index]);
                } else {
                    for (let i = 0; i < Object.keys(this.$refs).length; i++) {
                        if(i % 2 == 0) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyOddBGColor;
                        } else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.tableTBodyEvenBGColor;
                        }
                    }
                }
            }
        },
        getProgressColor(value) {
            if(value < 20) {
                return this.$style.home.tableMaintenanceWarningStatus.high;
            } else if(value >= 20 && value <= 80) {
                return this.$style.home.tableMaintenanceWarningStatus.mid;
            } else if(value > 80){
                return this.$style.home.tableMaintenanceWarningStatus.low;
            }
        },
        rowClicked(index, data) {
            if(data.maint_name != undefined) {
                this.rowHighLight(index);
                this.$emit('selectedCheckData', data);
            }
        },
        detailBtnClicked(data) {
            let pdfFile = '';
            pdfFile = data.item.file_name.split('.')[0];
            
            if(data.item.file_name != '') {
                this.$emit('pdfFile', pdfFile, true);
            }
        },
    }
}
</script>

<style scoped lang="scss">
    @import './maintenancechecklisttable';
</style>
