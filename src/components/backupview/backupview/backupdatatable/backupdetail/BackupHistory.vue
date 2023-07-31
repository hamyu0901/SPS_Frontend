<template>
    <div class='backupHistoryTable' v-bind="[getHistoryDatas]">
        <v-data-table
             hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
            class="elevation-0 dataTable"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center" v-for="(header, index) in props.headers" :key="index">{{ header.text }}</th>
                </tr>
            </template>
            <template slot='items' slot-scope='props'>
                <tr :ref="props.index" @click="historyDataClicked(props, pagination.page)" :key="props.index">
                    <td class="text-xs-center tdText">{{props.item.file_name}}</td>
                    <td class="text-xs-center tdText">{{props.item.time_stamp}}</td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1">
                <v-pagination v-model="pagination.page" :length="pages" :total-visible="7" :color="paginationColor"
                    @input="onPageChange(itemNum, pagination.page)"></v-pagination>
            </div>
        </v-layout>
    </div>
</template>

<script>
    import LoadingDlg from '@/commons/LoadingDlg'
    export default {
        components: {LoadingDlg},
        props: ['historyDatas'],
        data() {
            return {
                ui: {
                    tableHeaderStyle: null
                },
                search: '',
                pagination: {
                    values: 1,
                    rowsPerPage: 12,
                },
                paginationColor: '#237ffe !important',
                totalCount: 0,
                pageNum: 0,
                itemNum: 0,
                headers: [
                    { text: this.$t(String(`backupview.backupdatatable.backupdetail.backuphistory.filename`)), align: 'center', sortable: false, value: 'file_name' },
                    { text: this.$t(String(`backupview.backupdatatable.backupdetail.backuphistory.datetime`)), align: 'center', sortable: false, value: 'time_stamp' }
                ],
                datas: []
            }
        },
        computed: {
            pages() {
                if (this.pagination.rowsPerPage == null ||
                    this.pagination.totalItems == null
                ) return 0

                return Math.ceil(this.historyDatas.length / this.pagination.rowsPerPage)
            },

            getHistoryDatas() {
                if(this.historyDatas.length != 0) {
                    this.datas = this.historyDatas;
                    if(this.datas.length % this.pagination.rowsPerPage != 0) {
                        this.setTempDatas();
                    }
                    this.initShowJobFile();
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
                this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            },
            setTempDatas() {
                let index = this.pagination.rowsPerPage - this.datas.length % this.pagination.rowsPerPage;
                for(let i = 0; i < index; i++) {
                    this.datas.push({file_content: '', file_name: '', time_stamp: ''});
                }
            },

            initShowJobFile() {
                let historyData = {item: [], index: undefined};
                historyData['item'] = this.datas[0];
                this.historyDataClicked(historyData, 1);
            },

            historyDataClicked(historyData, pageNum) {
                this.pageNum = pageNum;
                if (historyData.index == undefined) {
                    this.itemNum = 0;
                    this.$emit('getJobFile', { jobFile_name: historyData.item.file_name, jobFile_content: this.base64Decode(historyData.item.file_content) });
                    this.rowHighLight(0, pageNum);
                } 
                else {
                    if (historyData.item[this.headers[0].value] != "") {
                        this.rowHighLight(historyData.index, pageNum);
                        this.itemNum = historyData.index;
                        this.$emit('getJobFile', { jobFile_name: historyData.item.file_name, jobFile_content: this.base64Decode(historyData.item.file_content) });
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
            },

            base64Decode(base64text) {
                return Buffer.from(base64text, 'base64').toString('utf8');
            }
        }
    }
</script>

<style scoped lang="scss">
    @import './backuphistory';
</style>
