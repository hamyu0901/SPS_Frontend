<template>
    <v-card class="text-xs-center elevation-2 workTimeTableCard" :color="cardColor" v-bind="getHeaderData, getContentData, calTotalCount">
        <v-card-title primary-title class="titleColor">{{titleName}}</v-card-title>
            <v-data-table
                class="elevation-2 tableHeader"
                hide-actions
                :headers="headers"
                :items="datas"
                :pagination.sync="pagination"
            >
                <template slot="headers" slot-scope="props">
                    <tr>
                        <th v-for="header in props.headers" :key="header.text">{{ header.text }}</th>
                    </tr>
                </template>
                <template slot="items" slot-scope="props">
                    <tr :ref="props.index" @click="itemClicked(props, pagination.page)" :key="props.index">
                        <td class="text-xs-center" v-if="header.value === 'model_name'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                        <td class="text-xs-center" v-if="header.value === 'part_no'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                        <td class="text-xs-center" v-if="header.value === 'part_name'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                        <td class="text-xs-center" v-if="header.value === 'part_code'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                        <td class="text-xs-center" v-if="header.value === 'part_count'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                        <td class="text-xs-center" v-if="header.value === 'remarks'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                        <td class="text-xs-center" v-if="header.value === 'drawing_no'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                        <td class="text-xs-center" v-if="header.value === 'detail'" v-for="header in headers" :key="header.value">
                                <v-btn flat icon slot="activator" @click="setDlg(props.item.part_no), setModify(false)">
                                        <v-icon>{{iconDetail}}</v-icon>
                                    {{ props.item[header.value] }}</v-btn>
                        </td>
                        <td class="text-xs-center" v-if="header.value === 'modify'" v-for="header in headers" :key="header.value">
                                <v-btn flat icon slot="activator" @click="setDlg(props.item.part_no), setModify(true)">
                                        <v-icon>{{iconModify}}</v-icon>
                                    {{ props.item[header.value] }}</v-btn>
                        </td>
                        <td class="text-xs-center" v-if="header.value === 'delete'" v-for="header in headers" :key="header.value">
                                <v-btn flat icon slot="activator" @click="delete(props.item.delete)">
                                        <v-icon>{{iconDelete}}</v-icon>
                                    {{ props.item[header.value] }}</v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <v-layout>
                <div class="pt-1 pb-1">
                    <v-pagination v-model="pagination.page" :length="pages"  :total-visible="7" :color="paginationColor" @input="onPageChange(itemNum, pagination.page)"></v-pagination>
                </div>
                <v-spacer/>
                <p class="pt-3 pr-3">{{totalCount}} items in {{pages}} pages</p>
            </v-layout>
            <v-dialog v-model='dialog' width='770px' persistent>
                    <Spare-Part-Data v-if="getModify()" v-on:sparePartDialogClosed='sparePartDialogClosed' v-bind:setStatus="2" v-bind:partsInfo="partsDatas" v-bind:partname="partname"></Spare-Part-Data>
                    <Spare-Part-Data v-else v-on:sparePartDialogClosed='sparePartDialogClosed' v-bind:setStatus="0" v-bind:partsInfo="partsDatas" v-bind:partname="partname"></Spare-Part-Data>
                </v-dialog>
        </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import SparePartData from '@/components/sparepart/sparepart/gridtablewithdialog/SparePartData'
export default {
    props: ['headerData' ,'contentData', 'highlightFlag'],
    components: {
        SparePartData
    },
    data() {
        return {
            cardColor: '#21263a',
            pagination: {
                values: 1,
                rowsPerPage: 15,
            },
            paginationColor: '#005bac',
            pageNum: 0,
            itemNum: '',
            headers: [],
            datas: [],
            totalCount: 0,
            dialog: false,
            titleName: '파츠 목록',
            closeDlg: '닫기',
            partsDatas: {
                drawingNo: '',
                remarks: '',
                prodNo: '',
                prodName: '',
                model: '',
                mainGroup: '',
                serveGroup: '',
                usingModel: '',
                checkPeriod: '',
                changePeriod: '',
                quantity: ''
            },
            modify: false,
            partname: ''
        }
    },
    computed: {
        ...mapGetters ({
                baseUrl: 'getBaseUrl',
                getTheme: 'getTheme',
                getFactoryId: 'getFactoryId',
            }),
    
            getHeaderData() {
                if (this.headerData.length != 0) {
                    this.headers = this.headerData;
                }            
            },
    
            getContentData() {
                if (this.contentData.length != 0) {        
                    this.datas = this.contentData;
                    this.itemClicked(this.datas[0],1);
                }
            },
    
            pages () {
                if (this.pagination.rowsPerPage == null ||
                    this.pagination.totalItems == null
                ) return 0
    
                return Math.ceil(this.datas.length / this.pagination.rowsPerPage)
            },
    
        calTotalCount() {
            let tempIndex = 0;
            if (this.datas.length > 0) {
                if (this.datas[0][this.headers[0].value] == '') {
                    this.totalCount = 0;
                }
                else {
                    // for (let i = (this.datas.length-4); i < this.datas.length; i++) {
                    //         if (this.datas[i][this.headers[0].value] === '') {
                    //             tempIndex++;
                    //         }  
                    // }
                    this.totalCount = this.datas.length - tempIndex;
                }
            }
        },
        iconDetail() {
            return 'web_asset';
        },
        iconModify() {
            return 'file_copy';
        },
        iconDelete() {
            return 'delete_sweep';
        }
    },
    mounted() {
        this.initCSS();
    },
    methods: {
        initCSS() {
            $("table.v-table tbody tr td").css("background-color", "#203556");
            $("div ul li button").css("background-color", "#203556");
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
    
            dateCompare(preDate, currDate) {
                var preDate = new Date(preDate);
                var currDate = new Date(currDate);    
               
                return preDate <= currDate;
            },
    
            checkTargetDatas(boothId, zoneId, robotId, predate, currdate) {
                var postDatas = {'factoryid': `${this.getFactoryId}`, 'prevtime': predate , 'currtime': currdate};
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
            
            itemClicked(workTimeInfo, pageNum) {
                if(this.totalCount != 0) {
                    this.pageNum = pageNum;
                    if(this.highlightFlag == true) {
                        if (workTimeInfo.index == undefined) {
                            this.rowHighLight(0, pageNum);
                            this.$emit('getGridDataTableData', workTimeInfo);
                            this.itemNum = 0;
                        } 
                        else {
                            this.rowHighLight(workTimeInfo.index, pageNum);
                            this.$emit('getGridDataTableData', workTimeInfo.item);
                            this.itemNum = workTimeInfo.index;
                        }
                    }
                    else {
                        if (workTimeInfo.index == undefined) {
                            this.$emit('getGridDataTableData', workTimeInfo);
                            this.itemNum = 0;
                        } 
                        else {
                            this.$emit('getGridDataTableData', workTimeInfo.item);
                            this.itemNum = workTimeInfo.index;
                        }
                    }
                }
            },
    
            rowHighLight(index, pageNum) {
                for(let i = 0; i <Object.keys(this.$refs).length; i++){
                    if(Object.keys(this.$refs)[i] == index) {
                        if (this.getTheme == true) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#3c5d99';
                        }
                        else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#E6E6E6';
                        }
                    }
                    else{
                       if(this.getTheme == true) {
                            if (i % 2 == 0) {
                                this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                            } 
                            else {
                                this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                            }
                        }
                        else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = 'white';
                        }
                    }
                }
            },
    
            onPageChange(itemNum, pageNum) {  
                if(this.getTheme == true) {
                    if (this.pageNum == pageNum && this.highlightFlag == true) {
                        this.rowHighLight(itemNum, pageNum);
                    }
                    else {
                        for (let i = 0; i <Object.keys(this.$refs).length; i++) {
                            if (i % 2 == 0) {
                                this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                            } 
                            else {
                                this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                            }
                        }
                    }
                }
            },
            initDatas() {
                this.partsDatas = '';
            },
            createDlg() {
                this.dialog = true;
            },
            setDlg(data) {
                this.dialog = true;
                this.requstDataQuery(data);
            },
            delete() {

            },
            sparePartDialogClosed() {
                this.dialog = false;
            },
            getModify() {
                return this.modify;
            },
            setModify(flag) {
                this.modify = flag;
            },
            requstDataQuery(item) {
                this.$http.post(`${this.baseUrl}/sparepart/data/detail`, { partno: item })
                .then((result) => {
                    if(result.data == '') {

                    } 
                    else {
                        this.partsDatas = {
                            drawingNo: ' ',
                            remarks: result.data[0].remarks,
                            prodNo: result.data[0].part_no,
                            prodName: result.data[0].part_name,
                            model: ' ',
                            mainGroup: ' ',
                            serveGroup: ' ',
                            usingModel: ' ',
                            checkPeriod: ' ',
                            changePeriod: ' ',
                            quantity: result.data[0].remain_amount
                        }
                    }
                }).catch((error) => {
                    
                })
            }
    }
}
</script>

<style scoped>
    workTimeTableCard {
        
    }
    
    table.v-table thead tr {
      height: 60px;
      background-color: #21263a;
      border-bottom-color: #21263a !important;
    }

    table.v-table thead tr th {
      font-size: 14px;
    }
    
    table.v-table tbody tr {
      height: 40px; 
    }
   
    table.v-table tbody tr:nth-of-type(odd) {
      background-color: #2a2f44;
      border-bottom-color: #2a2f44;
    }

    table.v-table tbody tr:nth-of-type(even) {
      background-color: #21263a;
      border-bottom-color: #21263a;
    }

    table.v-table tbody tr:hover {
      background-color: #203556 !important;
    }
   
    .totalCount {
      vertical-align: middle;
    }

    .titleColor {
        background-color: #171A29 !important;
    }

</style>