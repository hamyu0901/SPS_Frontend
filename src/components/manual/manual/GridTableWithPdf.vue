<template>
    <v-card class="text-xs-center elevation-2" :color="cardColor" v-bind="[initTableTitle, initialize]">
        <v-card-title  class="cardTitle" v-bind:style="ui.titleStyle">
            {{ui.title}}
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
                    <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.text">
                        {{ header.text }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" @click="itemClicked(props, pagination.page)" :key="props.index">
                    <td class="text-xs-center tdText" v-if="header.value === 'manual_name'" v-for="header in headers"
                        :key="header.value" @click="setDlg(props.item)">{{ props.item[header.value]}}
                    </td>
                    <td class="text-xs-center tdText" v-if="header.value === 'file_name'" v-for="header in headers"
                        :key="header.value" @click="setDlg(props.item)">{{ props.item[header.value]}}
                    </td>
                    <td class="text-xs-center tdText" v-if="header.value === 'file_format'" v-for="header in headers"
                        :key="header.value" @click="setDlg(props.item)">{{ props.item[header.value] }}
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1 pb-1">
                <v-pagination v-model="pagination.page" :length="pages" :total-visible="7" :color="paginationColor"></v-pagination>
            </div>
            <v-spacer />
            <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
        <v-dialog v-model='dialog' width='1000px' persistent @keydown.esc="dialog = false">
            <v-btn class="mt-2 ml-2 buttonItem" fab small fixed  @click="dialog = false">
                <v-layout justify-center align-center>
                    <v-icon>clear</v-icon>
                </v-layout>
            </v-btn>
            <pdf-view v-bind:pdfFile='pdfFile' v-bind:manualtype='manualtype' v-on:closeDlg="closeDlg"></pdf-view>
        </v-dialog>
    </v-card>
</template>
    
    <script>
    import {mapGetters} from 'vuex'
    import PdfView from '@/commons/PdfView'
    export default {
        props: ['headerData' ,'contentData', 'highlightFlag', 'manualtype'],
        components : { PdfView },
        data() {
            return {
                ui: {
                    title: '',
                    close: this.$t(`manual.child.GridTableWithPdf.close`),
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
                headers: [],
                datas: [],
                totalCount: 0,
                dialog: false,
                pdfFile: ''
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
                if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
                    return 0;
                }
                else {
                    return Math.ceil(this.datas.length / this.pagination.rowsPerPage);
                }
            },
            initTableTitle() {
                if (this.manualtype === 'robot') {
                    this.ui.title = this.$t(`manual.child.GridTableWithPdf.robotManual`);
                }
                else if (this.manualtype === 'maintenance') {
                    this.ui.title = this.$t(`manual.child.GridTableWithPdf.maintenanceManual`);
                }
                else if (this.manualtype === 'trouble') {
                    this.ui.title = this.$t(`manual.child.GridTableWithPdf.troubleShootingManual`);
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
                this.ui.titleStyle = this.$style.common.titleObjectItemColor;
                this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
                this.cardColor = this.$style.manual.cardColor;
                document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
                document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
                document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);
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

            getHeaderData() {
                if (this.headerData.length != 0) {
                    this.headers = this.headerData;
                }            
            },

            getContentData() {
                if (this.contentData.length != 0) {        
                    this.datas = this.contentData;
                    if(this.datas.length % this.pagination.rowsPerPage != 0) {
                        this.insertTempDatas();
                    }
                }
            },

            insertTempDatas() {
                let tempDatas = {};
                let tempIndex = this.pagination.rowsPerPage - (this.datas.length % this.pagination.rowsPerPage);
                
                for(let i = 0; i < tempIndex; i++) {
                    for(let j = 0; j < this.headerData.length; j++) {
                        tempDatas[this.headerData[j].id] = '';
                    }
                    this.datas.push(tempDatas);
                }
            },

            calTotalCount() {
               let index = 0;
                if(this.datas.length == 0) {    
                    this.totalCount = 0;
                } 
                else {
                    for(let i = 0; i < this.datas.length; i++) {
                        if(this.datas[i][this.headers[0].id] == '') {
                            index++;
                        }
                    }
                    this.totalCount = this.datas.length - index;
                }
            },
           
            itemClicked(workTimeInfo, pageNum) {
                if(this.totalCount != 0) {
                    this.pageNum = pageNum;
                    if(this.highlightFlag == true) {
                        if (workTimeInfo.index == undefined) {
                            this.$emit('getGridDataTableData', workTimeInfo);
                            this.itemNum = 0;
                        } 
                        else {
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

            setDlg(element) {
                if (this.manualtype == 'trouble') {
                    this.pdfFile = element.manual_name;
                }
                else {
                    this.pdfFile = element.file_name;
                }
                this.dialog = true;
            },

            closeDlg() {
                this.dialog = false;
            }
        }
    }
    </script>

<style scoped lang="scss">
    @import './gridtablewithpdf';
</style>