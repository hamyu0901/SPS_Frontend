<template>
    <v-card class="detailMaintenanceCheckListTableCard text-xs-center" elevation="0" :color="cardColor" v-bind="[initialize, getDetailMaintenanceHistoryInitFlag, saveDatas]">
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
                <tr :ref="props.index" :key="props.index">
                    <td class="text-xs-center tdText">{{ props.item.booth_name}}</td>
                    <td class="text-xs-center tdText">{{ props.item.zone_name}}</td>
                    <td class="text-xs-center tdText">{{ props.item.robot_name}}</td>
                    <td class="text-xs-center tdText">{{ props.item.last_check}}</td>
                    <td class="text-xs-center tdText">
                        <v-layout align-center justify-center> 
                            <div>
                                {{ maintenanceResultEllipsis(props.item.comment)}}
                                <v-btn 
                                    flat 
                                    icon
                                    v-if="props.item.hasOwnProperty('comment') && 
                                          props.item.comment != null && 
                                          props.item.comment != '' && 
                                          props.item.comment.length > 10" 
                                    @click="maitenanceResultClicked(props.item.comment)">
                                    <v-icon small>more_vert</v-icon>
                                </v-btn>
                            </div>
                        </v-layout>
                    </td>
                    <td class="text-xs-center">
                        <v-btn-toggle mandatory v-model="props.item.action_type" v-if="dataStatus(props)"> 
                            <div v-for="(actionType, index) in actionTypes" :key="index">
                                <v-btn 
                                    class="buttonItem elevation-0"
                                    :value="actionType.value" 
                                    @click="setActionType(props.item, actionType.value)"
                                >
                                    {{actionType.name}}
                                </v-btn>
                            </div>
                        </v-btn-toggle>
                    </td>
                    <td class="text-xs-center tdText">
                        <input class="commentInput" v-if="dataStatus(props)" :value="props.item.history_data" @input="setHistory(props.item,$event.target.value)"/>
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
    props: ['headerData' ,'contentData', 'highlightFlag', 'detailMaintenanceFlag', 'detailMaintenanceHistoryInitFlag'],
    data() {
        return {
            ui: {
                tableHeaderStyle: null
            },
            cardColor: '',
            detailTitle: this.$t(`maintenance.child.detailMaintenanceCheckListTable.view`),
            pagination: {
                values: 1,
                rowsPerPage: 10,
            },
            itemNum: '',
            headers: [],
            datas: [],
            actionTypes: [
                 {value: 0, name: 'Y'},
                 {value: 1, name: 'N'},
            ],
            paginationColor: '#237ffe !important',
            pageNum: 0,
            totalCount: 0,
            saveDetailMaintenanceCheckListDatas: []
        }   
    },
    computed: {
        ...mapGetters ({
            getTheme: "getTheme",
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getFactoryId: 'getFactoryId',
        }),
        initialize() {
            this.getHeaderData();
            this.getContentData();
            this.calTotalCount();
        },
        getDetailMaintenanceHistoryInitFlag() {
            if(this.detailMaintenanceHistoryInitFlag == true) {
                for(let i = 0; i < this.datas.length; i++) {
                    if(this.datas[i].hasOwnProperty("undefined") == false) {
                        this.datas[i].history_data = '';
                        this.datas[i].action_type = 0;
                    }
                }
                this.$emit('detailMaintenanceHistoryInitData');
            }
        },
        saveDatas() {
            if(this.detailMaintenanceFlag == true) {
                this.saveDetailMaintenanceCheckListDatas = [];
                for(let i = 0; i < this.datas.length; i++) {
                    if(this.datas[i].hasOwnProperty("undefined") == false) {
                        this.saveDetailMaintenanceCheckListDatas.push(this.settingSaveDatas(this.datas[i]));
                        this.datas[i].history_data = '';
                        this.datas[i].action_type = 0;
                    }
                }
                this.$emit('saveDetailMaintenanceCheckListDatas', this.saveDetailMaintenanceCheckListDatas);
                this.$emit('changeDetailMaintenanceFlag');
            }
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
        
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.cardColor = this.$style.maintenance.detailMaintenanceCheckListTableItemCardColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;

            document.documentElement.style.setProperty("--detailMaintenanceCheckListTableCardBorderColor", this.$style.common.cardItemBorderColor);
            document.documentElement.style.setProperty("--inputBackgroundColor", this.$style.maintenance.detailMaintenanceCheckListTableItemInputBackgroundColor);
            document.documentElement.style.setProperty("--inputColor", this.$style.maintenance.detailMaintenanceCheckListTableItemInputColor);
            document.documentElement.style.setProperty("--inputBorderColor", this.$style.maintenance.detailMaintenanceCheckListTableItemInputBorderColor);
        },
        maintenanceResultEllipsis(result) {
            if(result != null && result != "" && result.length > 10) {
                let tempResult = result.substring(0,10) + "...";
                return tempResult;
            } else {
                return result;
            }
        },

        maitenanceResultClicked(maintnanceResult){
            this.$emit("maintenanceResultflag", maintnanceResult)
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
        getHeaderData() {
            if (this.headerData.length != 0) {
                this.headers = this.headerData;
            }            
        },
        getContentData() {
            if (this.contentData.length != 0) {    
                this.datas = [];
                let tempObj = {};
                let tempIndex = 0;
                this.datas = this.contentData;
                this.setMaintCheckData();
                tempIndex = this.datas.length % this.pagination.rowsPerPage;
                
                if (tempIndex != 0) {
                    let index = this.pagination.rowsPerPage - tempIndex;
                    for (let i = 0; i < this.headerData.length; i++) {
                        tempObj[this.headerData[i].value] = '';
                    } 
                    for (let i = 0; i < index; i++) {
                        this.datas.push(tempObj);
                    }
                }
            } 
            else {
                this.datas=[];
                this.initDataTable();
            } 
        },
        calTotalCount() {
            let tempIndex = 0;
            if (this.datas[0][this.headers[0].id] == undefined) {
                this.totalCount = 0;
            } 
            else if (this.datas.length < this.pagination.rowsPerPage) {
                this.totalCount = this.datas.length;
            } 
            else {
                for (let i = (this.datas.length- this.pagination.rowsPerPage); i < this.datas.length; i++) {  
                    if (this.datas[i][this.headers[0].id] == undefined) {
                        tempIndex++;
                    }
                }
                this.totalCount = this.datas.length - tempIndex;
            }
        },
        setMaintCheckData() {
            for(let i = 0; i < this.datas.length; i++) {
                if(this.datas[i].hasOwnProperty("undefined") == false) {
                    this.datas[i].history_data = '';
                    this.datas[i].action_type = 0;
                }
            }
        },
        setActionType(data, actionType) {
            data.action_type = actionType;
            this.$forceUpdate();
        },
        setHistory(data,historyData) {
            data.history_data = historyData;
        },
        onPageChange(itemNum, pageNum) {  
            if (this.getTheme == true) {
                for (let i = 0; i <this.pagination.rowsPerPage; i++) {
                    if (i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemOddBackgroundColor;
                    } 
                    else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemEvenBackgroundColor;
                    }
                }
            }
        },
        dataStatus(data) {
            if (data.item.hasOwnProperty("undefined")) {
                return false;
            }
            else {
                return true;
            }
        },
        settingSaveDatas(datas) {
            let saveData = {};
            saveData['boothid'] = datas.booth_id;
            saveData['zoneid'] = datas.zone_id;
            saveData['robotid'] = datas.robot_id;
            saveData['actiontype'] = datas.action_type;
            saveData['comment'] = datas.history_data;
           
            return saveData;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './detailmaintenancechecklisttable';
</style>
