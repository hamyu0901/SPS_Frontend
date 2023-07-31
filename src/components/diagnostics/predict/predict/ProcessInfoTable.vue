<template>
    <v-card class="text-xs-center processInfoTableCard" elevation="0" :color="cardColor" v-bind="initialize">
        <v-card-title 
        class="cardTitle"
        :style="ui.titleStyle">
        {{ui.processInfoTableTitle}}</v-card-title>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.text">{{ header.title }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" :key="props.index" @click="itemClicked(props, pagination.page)">
                    <td class="text-xs-center tdText" v-for="header in headers" :key="header.value">
                        <div v-if="header.id == 'edit'">
                                <v-icon @click="editPredict(props.item)" :disabled="isDisable(props.item.code)">open_in_new</v-icon>
                    </div>
                    <div v-else>
                        {{ props.item[header.id]}}
                    </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1">
                <v-pagination v-model="pagination.page" :length="pages"  :total-visible="7" :color="paginationColor" @input="onPageChange(itemNum, pagination.page)"></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import InitDataSettingDlg from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/abnormalstandardsettingtable/InitDataSettingDlg'
export default {
    components: { InitDataSettingDlg },
    props: ['headerDatas', 'contentDatas', 'highlightFlag'],
    data() {
        return {
            ui: {
                processInfoTableTitle: this.$t(`diagnostics.predict.child.processInfoTable.processInfoTableTitle`),
                titleStyle: null,
                tableHeaderStyle: null
            },
            cardColor: '',
            pagination: {
                values: 1,
                rowsPerPage: 4,
            },
            paginationColor: '#237ffe !important',
            pageNum: 0,
            itemNum: '',
            totalCount: 0,
            headers: [],
            datas: []
        }   
    },
    mounted() {
        this.initDatas();
        this.initializeStyle();
    },
    computed: {
        ...mapGetters ({
            getFactoryId: 'getFactoryId',
        }),
        initialize() {
            this.getHeaderDatas();
            this.getContentDatas();
            this.calTotalCount();
        },
        pages () {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
                return 0;
            }
            return Math.ceil(this.datas.length / this.pagination.rowsPerPage)
        }
    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.cardColor = this.$style.common.tableCardBottomColor;

            document.documentElement.style.setProperty("--processInfoTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        getHeaderDatas() {
            this.headers = this.headerDatas;
        },
        getContentDatas() {
            if (this.contentDatas.length != 0) {
                this.settingContentDatas(this.contentDatas);
            } 
            else {
                this.datas = [];
                this.initDatas();
                this.$emit('selectedProcessInfoData');
            }
        },
        calTotalCount() {
            let index = 0;
            if (this.datas.length == 0) {    
                this.totalCount = 0;
            } 
            else {
                for (let i = 0; i < this.datas.length; i++) {
                    if (this.datas[i][this.headers[0].id] == '') {
                        index++;
                    }
                }
                this.totalCount = this.datas.length - index;
            }
        },
        initDatas() {
            this.datas = [];
            for (let i = 0; i < this.pagination.rowsPerPage; i++) {
                this.datas.push({start_time: '', end_time: '', code: '', content: '', job_name: '', axis: ''});
            }
        },
        settingContentDatas(contentDatas) {
            this.datas = [];
            Object.keys(contentDatas).forEach(function eachKey(key) {
                contentDatas[key].start_time = contentDatas[key].time_stamp;
                delete contentDatas[key].temp_stamp;
            });
            this.datas = contentDatas; 
            if (this.datas.length % this.pagination.rowsPerPage != 0) {
                let index = this.pagination.rowsPerPage - this.datas.length % this.pagination.rowsPerPage;
                for (let i = 0; i < index; i++) {
                    this.datas.push({start_time: '', end_time: '', code: '', content: '', job_name: '', axis: ''});
                }
            }

            if(this.datas[0].start_time != '') {
                this.rowHighLight(0, 1);
                this.datas[0].full_end_time = this.convertCurrDate(this.datas[0].full_end_time);
                this.$emit('selectedProcessInfoData', this.datas[0]); 
                this.itemNum = 0;
            }
        },
        itemClicked(rowDataInfo, pageNum) {
            if(this.totalCount != 0) {
                this.pageNum = pageNum;
                if(this.highlightFlag == true && rowDataInfo.index != undefined && rowDataInfo.item.job_name != "") {
                    this.rowHighLight(rowDataInfo.index, pageNum);
                    rowDataInfo.item.full_end_time = this.convertCurrDate(rowDataInfo.item.full_end_time);   
                    this.$emit('selectedProcessInfoData', rowDataInfo.item);
                    this.itemNum = rowDataInfo.index;
                }
            }
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
        editPredict(prop) {
            this.movePredictPage(prop);
        },

        movePredictPage(prop) {
            this.$router.push({path: '/sps/diagnostics/torquerange', query : { 
                factoryid: this.getFactoryId,
                boothid: prop.boothid,
                zoneid: prop.zoneid,
                robotid: prop.robotid,
                axis: prop.axis,
                job: prop.job_name,
                date: String(prop.start_time).split(' ')[0]
            }});
        },
        
        isDisable(code) {
            return (code != 'P001') ? true : false;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './processinfotable';
</style>
