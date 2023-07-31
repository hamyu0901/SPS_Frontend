<template>
    <v-card class="text-xs-center elevation-2 workTimeTableCard" :color="cardColor" v-bind="initialize">
        <v-card-title 
        v-bind:style="styleObject"
        class="cardTitle">
            {{ui.violationRecord}}
            <v-spacer/>
            <v-btn small flat class="titleBtn" @click="listBtnClicked"><v-icon>list</v-icon></v-btn>
            <v-dialog
                max-width='900px'
                v-model="dialog"
                >
                <v-card class="dialogContent" max-height="1000px">
                    <v-card-title class="headline">{{ui.searchViolationRecord}}</v-card-title>

                    <v-layout>
                        <v-flex class="pl-2 pr-2" lg3>
                            <date-picker v-on:getDate="getPrevDate"></date-picker>
                        </v-flex>
                        
                        <v-flex class="pr-2" lg3>
                            <date-picker v-bind:conditionalDate="prevDate" v-on:getDate="getCurrDate"></date-picker>
                        </v-flex>
                        <v-flex lg2>
                            <selector 
                                class="dialogContentSelector pl-2 pr-2" 
                                v-bind:selectorTitle="ui.searchCondition" 
                            ></selector>
                        </v-flex>
                        <v-flex lg3>
                        </v-flex>
                        <v-btn class="dialogSearchBtn" :color="'#237ffe'" @click="dialogSearchBtnClicked"><a class="pt-1"><img :src="searchBtnIcon"></a></v-btn>
                    </v-layout>
                    <v-layout>
                        <v-flex lg12>
                            <violation-detail-record-table 
                                class="pt-2 pl-2 pr-2"
                                v-bind:headerData="headerData"
                            ></violation-detail-record-table>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                    <v-spacer/>
                    <v-btn
                        :color="'#237ffe'"
                        flat="flat"
                        @click="dialog = false"
                    >
                        {{ui.finish}}
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-title>
        <v-data-table
            class="elevation-2 tableHeader"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th class="text-xs-center" v-for="(header, index) in headers" :key="index">{{ header.title }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" :key="props.index">
                    <td class="text-xs-center" v-for="header in headers" :key="header.value">{{ props.item[header.id]}}</td>
                </tr>
            </template>        
        </v-data-table>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import DatePicker from '@/commons/DatePicker'
import Selector from '@/commons/Selector'
import InputMessage from '@/commons/InputMessage'
import ViolationDetailRecordTable from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/violationrecordtable/ViolationDetailRecordTable'
export default {
    components: {DatePicker, Selector, InputMessage, ViolationDetailRecordTable},
    props: ['headerData' ,'contentData', 'highlightFlag'],
    data() {
        return {
            ui: {
                violationRecord: this.$t(`diagnostics.torqueLoadFactor.child.violationRecordTable.violationRecord`),
                searchViolationRecord: this.$t(`diagnostics.torqueLoadFactor.child.violationRecordTable.searchViolationRecord`),
                searchCondition: this.$t(`diagnostics.torqueLoadFactor.child.violationRecordTable.searchCondition`),
                finish: this.$t(`diagnostics.torqueLoadFactor.child.violationRecordTable.finish`)
            },
            dialog: false,
            prevDate: '',
            currDate: '',
            searchBtnIcon: require("@/images/search_icon.png"),
            cardColor: '',
            pagination: {
                values: 1,
                rowsPerPage: 5,
            },
            paginationColor: '',
            pageNum: 0,
            itemNum: '',
            headers: [],
            datas: [],
            styleObject: null
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
            this.styleObject = this.$style.getTitleStyle();
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
            this.cardColor = this.$style.diagnostics.cardColor;
            this.paginationColor = this.$style.diagnostics.paginationColor;
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
            }
        },
        initDataTable() {
            if(this.datas.length == 0 && this.headerData != '') {
                let tempObj = {};
                for(let i = 0; i < this.headerData.length; i++) {
                     tempObj[this.headerData[i].value] = '';
                }   
                for(let i = 0; i < this.pagination.rowsPerPage; i++) {
                    this.datas.push(tempObj);
                }
            }
        },
        
        getPrevDate(prevDate) {
            this.prevDate = prevDate;
        },

        getCurrDate(currDate) {
            this.currDate = currDate;
        },

        dialogSearchBtnClicked() {
            
        },


        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);    
           
            return preDate <= currDate;
        },

        checkTargetDatas(boothId, zoneId, robotId, predate, currdate) {
            var postDatas = {'factoryid': `${this.getFactoryId}`, 'prevtime': predate , 'currtime': currdate};
            if(boothId != undefined) {
                postDatas['boothid'] = boothId;
            }
            
            if(zoneId != undefined) {
                postDatas['zoneid'] = zoneId;
            }
            
            if(robotId != undefined) {
                postDatas['robotid'] = robotId;
            }
            return postDatas;
        },  
 
        rowHighLight(index, pageNum) {
            for(let i = 0; i <Object.keys(this.$refs).length; i++){
                if(Object.keys(this.$refs)[i] == index) {
                    if(this.getTheme == true) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#3c5d99';
                    }else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#E6E6E6';
                    }
                }else{
                   if(this.getTheme == true) {
                        if(i % 2 == 0) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                        } else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                        }
                    }else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = 'white';
                    }
                }
            }
        },

        onPageChange(itemNum, pageNum) {  
            if(this.getTheme == true) {
                if(this.pageNum == pageNum && this.highlightFlag == true) {
                    this.rowHighLight(itemNum, pageNum);
                }else {
                    for(let i = 0; i <Object.keys(this.$refs).length; i++) {
                        if(i % 2 == 0) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                        } else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                        }
                    }
                }
            }
        },

        listBtnClicked() {
            this.dialog = true;
        }

    }
}
</script>

<style scoped lang="scss">
    @import './violationrecordtable';
</style>
