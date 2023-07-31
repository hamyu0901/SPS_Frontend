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
                                <td class="text-xs-center" v-if="header.value === 'occur_date'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                                <td class="text-xs-center" v-if="header.value === 'occur_time'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                                <td class="text-xs-center" v-if="header.value === 'action_tod'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                                <td class="text-xs-center" v-if="header.value === 'booth'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                                <td class="text-xs-center" v-if="header.value === 'zone'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                                <td class="text-xs-center" v-if="header.value === 'robot'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                                <td class="text-xs-center" v-if="header.value === 'alarm_desc'" v-for="header in headers" :key="header.value">
                                        <v-btn flat @click="setDlg(props.item, props.index)">
                                            {{ props.item[header.value] }}</v-btn>
                                </td>
                                <td class="text-xs-center" v-if="header.value === 'action_desc'" v-for="header in headers" :key="header.value"><p>{{ props.item[header.value]}}</p></td>
                                <td class="text-xs-center" v-if="header.value === 'alarm_code'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                                <td class="text-xs-center" v-if="header.value === 'dead_time'" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                                <td class="text-xs-center" v-if="header.value === 'view'" v-for="header in headers" :key="header.value">
                                        <v-btn flat icon slot="activator" @click="setDlg(props.item, props.index)">
                                                <v-icon>{{iconView}}</v-icon>
                                            {{ props.item[header.value] }}</v-btn>
                                </td>
                                <td class="text-xs-center" v-if="header.value === 'delete'" v-for="header in headers" :key="header.value">
                                        <v-btn flat icon slot="activator" @click="deleteItem(props.item, props.index)">
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
                        <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pages}} pages</p>
                    </v-layout>
                    <v-dialog v-model='dialog' width='770px' persistent>
                        <post-history-data 
                        v-on:postHistoryDialogClosed='postHistoryDialogClosed'
                        v-bind:setStatus="1"
                        v-bind:historyID="historyid"
                        v-bind:historyData="sendDatas"></post-history-data>
                    </v-dialog>
                </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import postHistoryData from '@/components/posthistory/posthistory/gridtablewithdialog/PostHistoryData';
export default {
    props: ['headerData' ,'contentData', 'highlightFlag', 'status'],
    components: {
        postHistoryData
    },
    data() {
        return {
            condStatus: 0,
            cardColor: '',
            pagination: {
                values: 1,
                rowsPerPage: 15,
            },
            paginationColor: '',
            pageNum: 0,
            itemNum: '',
            headers: [],
            datas: [],
            totalCount: 0,
            dialog: false,
            titleName: this.$t(`postHistory.child.GridTableWithDialog.title`),
            closeDlg: this.$t(`postHistory.child.GridTableWithDialog.close`),
            sendDatas: {
                date: ' ',
                occurTime: ' ',
                actionTime: ' ',
                dt: ' ',
                booth: ' ',
                zone: ' ',
                robot: ' ',
                alarmCode: ' ',
                causeDesc: ' ',
                actionDesc: ' ',
                userID: ' '
            },
            historyid: ''
        }
    },
    computed: {
        ...mapGetters({
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
                this.itemClicked(this.datas[0], 1);
            }
        },
        pages() {
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
                    this.totalCount = this.datas.length - tempIndex;
                }
            }
        },
        iconView() {
            return 'file_copy';
        },
        iconDelete() {
            return 'delete_sweep';
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.cardColor = this.$style.posthistory.cardColor;
            this.paginationColor = this.$style.posthistory.paginationColor;
            $("table.v-table tbody tr td").css("background-color", this.$style.posthistory.tableBackgroundColor);
            $("div ul li button").css("background-color", this.$style.posthistory.buttonBackgroundColor);
            document.documentElement.style.setProperty("--theadBackgroundColor", this.$style.common.gridTableItemTheadBackgroundColor);
            document.documentElement.style.setProperty("--oddBackgroundColor", this.$style.common.gridTableItemOddBackgroundColor);
            document.documentElement.style.setProperty("--evenBackgroundColor", this.$style.common.gridTableItemEvenBackgroundColor);
            document.documentElement.style.setProperty("--paginationBackgroundColor", this.$style.common.gridTableItemPaginationBackgroundColor);
            document.documentElement.style.setProperty("--hoverBackgroundColor", this.$style.posthistory.tableBackgroundColor);
            document.documentElement.style.setProperty("--titleColor", this.$style.posthistory.gridTableWithDialogItemTitleColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
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
            this.condStatus = this.status;
        },
        dateCompare(prevDate, currDate) {
                let prevTime = new Date(prevDate);
                let currTime = new Date(currDate);    
               
                return prevDate <= currDate;
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
                if (Object.keys(this.$refs)[i] == index) {
                    this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemRowHighLightBackgroundColor;
                }
                else {
                    if (i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemOddBackgroundColor;
                    } 
                    else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemEvenBackgroundColor;
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
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemOddBackgroundColor;
                        } 
                        else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemEvenBackgroundColor;
                        }
                    }
                }
            }
        },
        setDlg(row, idx) {
            this.condStatus = 1;

            this.sendDatas.date = row.occur_date;
            this.sendDatas.occurTime = row.occur_time;
            this.sendDatas.actionTime = row.action_tod;
            this.sendDatas.dt = row.dead_time;
            this.sendDatas.booth = row.booth;
            this.sendDatas.zone = row.zone;
            this.sendDatas.robot = row.robot;
            this.sendDatas.alarmCode = row.alarm_code;
            this.sendDatas.causeDesc = row.alarm_desc;
            this.sendDatas.actionDesc = row.action_desc;
            this.sendDatas.userID = ' ';
            this.historyid = this.datas[idx].historyID;
            
            this.dialog = true;
        },
        deleteItem(row, idx) {
            this.$http.post(`${this.baseUrl}/posthistory/data/delete`, { historyid: this.datas[idx].historyID }).then((result) => {
                if (result.data == '') {
                    this.$popmsg(this.$t(`postHistory.child.GridTableWithDialog.popMsg.deleteDate`));
                    this.$emit('refresh');
                }
                else {
                    
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },
        getModify() {
            return this.condStatus;
        },
        postHistoryDialogClosed() {
            this.$emit('refresh');
            this.dialog = false;
            this.condStatus = 0;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './gridtablewithdialog';
</style>