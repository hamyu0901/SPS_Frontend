<template>
    <v-card class="predictAlarmTableCard text-xs-center" elevation="0" :color="ui.cardColor" v-bind="getContentDatas">
        <v-card-title class="cardTitle" :style="ui.titleStyle">{{ui.cardTitle}}</v-card-title>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions
            :headers="headerDatas"
            :items="datas.contentDatas"
            :pagination.sync="datas.pagination"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.id">{{ header.title }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                 <tr :ref="props.index" :key="props.index" @click="itemClicked(props)">
                    <td class="text-xs-center tdText" v-for="header in headerDatas" :key="header.id">
                        <div>
                            {{ props.item[header.id]}}
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1 pb-1">
                <v-pagination v-model="datas.pagination.page" :length="pages" :total-visible="7" :color="ui.paginationColor" @input="onPageChange(datas.itemNum, datas.pagination.page)"></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3 tdText">{{calTotalCount}} items in {{pages}} pages</p>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    props: ['headerDatas' ,'contentDatas', 'highlightFlag'],
    data() {
        return {
            ui: {
                titleStyle: null,
                tableHeaderStyle: null,
                cardColor: "",
                paginationColor: '#237ffe !important',
                cardTitle: this.$t('alarm.listDatas.predictAlarm')
            },
            datas: {
                pagination: {
                    values: 1,
                    rowsPerPage: 18,
                },
                pageNum: 0,
                itemNum: 0,
                contentDatas: []
            }
        }
    },

    created() {

    },

    mounted() {
        this.initCSS();
        this.initializeStyle();
    },

    computed: {
        getContentDatas() {
            if(this.contentDatas.length > 0) {
               this.datas.contentDatas = this.contentDatas;
            } else {
                this.datas.contentDatas = [];
            }
        },

        pages() {
            if (this.datas.pagination.rowsPerPage == null || this.datas.pagination.totalItems == null) 
            {
                return 0;
            }
            else {
                return Math.ceil(this.datas.contentDatas.length / this.datas.pagination.rowsPerPage);
            }
        },

        calTotalCount() {
            let index = 0;
            let totalCount = 0;
            if (this.datas.contentDatas.length > 0) {    
                for (let i = 0; i < this.datas.contentDatas.length; i++) {
                    if (this.datas.contentDatas[i][this.headerDatas[0].id] == '') {
                        index++;
                    }
                }
                totalCount = this.datas.contentDatas.length - index;
            } 
            return totalCount;
        },
    },

    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.ui.cardColor = this.$style.common.tableCardBottomColor;
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
            document.documentElement.style.setProperty("--convert", this.$style.home.tableMaintenanceShowDetailTextColor);
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.tableTBodyBBColor);
            document.documentElement.style.setProperty("--gridTableWithDialogCardBorderColor", this.$style.common.cardItemBorderColor);
        },

        initCSS() {
            $("table.v-table tbody tr td").css("background-color", this.$style.alarm.gridTableWithDialogItemTableBackgroundColor);
        },

        convertCurrDate(currDate) {
            let tempCurrDate = new Date(Date.parse(currDate) + 1);

            tempCurrDate = new Date(tempCurrDate.getTime() - (tempCurrDate.getTimezoneOffset() * 60000)).toISOString();
           
            tempCurrDate = tempCurrDate.replace("T", " ");
            tempCurrDate = tempCurrDate.replace("Z", "");
            
            return tempCurrDate;
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
        },

        itemClicked(predictAlarmTableData) {
            this.$emit('predictAlarmTableData', predictAlarmTableData.item);
        }
    }
}
</script>

<style scoped lang="scss">
    @import './predictalarmtable.scss';
</style>