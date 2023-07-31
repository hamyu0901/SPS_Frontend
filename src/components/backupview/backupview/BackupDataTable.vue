<template>
    <v-card class="text-xs-center elevation-2" :color="ui.cardColor" v-bind="initialize">
        <v-card-title class="cardTitle" v-bind:style="ui.titleStyle">{{ui.title}}</v-card-title>
        <v-data-table 
            class="elevation-0 dataTable" 
            hide-actions
            :headers="headers" 
            :items="datas" 
            :pagination.sync="pagination"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center tdText" v-for="(header, index) in headers" :key="index">{{ header.text }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" @click="setDlg(props.item)" :key="props.index">
                    <td class="text-xs-center tdText">{{ props.item.time_stamp}}</td>
                    <td class="text-xs-center tdText">{{ props.item.booth_name}}</td>
                    <td class="text-xs-center tdText">{{ props.item.zone_name }}</td>
                    <td class="text-xs-center tdText">{{ props.item.robot_name}}</td>
                    <td class="text-xs-center">
                        <v-btn flat icon slot="activator" v-if="props.item.time_stamp != ''" @click.stop="saveClicked(props.item)"><v-icon>{{iconView}}</v-icon></v-btn>
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
        <v-dialog v-model='dialog' width='1000px' persistent @keydown.esc="dialog = false">
            <backup-detail v-bind:detailInfos="backupDatas.item" v-bind:dialogFlag="dialog" v-on:detailDialogClosed='detailDialogClosed'></backup-detail>
        </v-dialog>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import jsZip from 'jszip'
import BackupDetail from '@/components/backupview/backupview/backupdatatable/BackupDetail'
export default {
    props: ['prevDate', 'currDate', 'targetBoothId', 'targetZoneId', 'targetRobotId', 'searchFlag', 'headerData', 'contentData'],
    components: {
        BackupDetail
        },
    data() {
        return {
            ui: {
                title: this.$t(`backupview.child.backupDataTable.title`),
                closeDlg: this.$t(`backupview.child.backupDataTable.close`),
                cardColor: '',
                titleStyle: null,
                tableHeaderStyle: null,
            },
            dialog: false,
            headers: [],
            datas: [],
            historyDatas: [],
            pagination: {
                values: 1,
                rowsPerPage: 15,
            },
            paginationColor: '#237ffe !important',
            pageNum: 0,
            itemNum: '',
            totalCount: 0,
            backupDatas: {
                item: ''
            }
        }
    },
    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'
        }),

        initialize() {
            this.getHeaderData();
            this.getContentData();
            this.calTotalCount();
        },

        pages() {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
                return 0;
            }
            else {
                return Math.ceil(this.datas.length / this.pagination.rowsPerPage);
            }
        },

        iconView() {
            return 'file_copy';
        },

        iconDelete() {
            return 'file_copy';
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.ui.cardColor = this.$style.backup.backupDataTableItemCardColor;
            $("table.v-table tbody tr td").css("background-color", this.$style.alarm.gridTableWithDialogItemTableBackgroundColor);
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
                    this.setTempDatas();
                }
            }
            else {
                this.datas = [];
            }
        },

        setTempDatas() {
            let index = this.pagination.rowsPerPage - this.datas.length % this.pagination.rowsPerPage;
            for(let i = 0; i < index; i++) {
                this.datas.push({booth_name: '', detail: '', robot_name: '', save: '', time_stamp: '', zone_name: ''});
            }
        },

        calTotalCount() {
            let tempIndex = 0;
            if (this.datas.length > 0) {
                for(let i = (this.datas.length- this.pagination.rowsPerPage); i < this.datas.length; i++) {
                    if(this.datas[i][this.headers[0].value] == '') {
                        tempIndex++;
                    }
                }
                this.totalCount = this.datas.length - tempIndex;
            }
            else {
                this.totalCount = 0;
            }
        },

        setDlg(item) {
            if(item.booth_name != '') {
                this.backupDatas.item = item;
                this.dialog = true;   
            }
        },
       
        onPageChange(itemNum, pageNum) {  
            if(this.getTheme == true) {
                for (let i = 0; i <Object.keys(this.$refs).length; i++) {
                    if (i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                    } 
                    else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                    }
                }
            }
        },

        checkCompressionDatas(infos) {
            var compressionDatas = {};
            for(let i = 0; i < this.getBoothInfos.length; i++) {
                if(this.getBoothInfos[i].name == infos.booth_name) {
                    compressionDatas['boothid'] = this.getBoothInfos[i].id;
                }
            }

            for(let i = 0; i < this.getZoneInfos.length; i++) {
                if(this.getZoneInfos[i].name == infos.zone_name && this.getZoneInfos[i].booth == compressionDatas.boothid) {
                    compressionDatas['zoneid'] = this.getZoneInfos[i].id;
                }
            }

            for(let i = 0; i < this.getRobotInfos.length; i++) {
                if(this.getRobotInfos[i].name == infos.robot_name && this.getRobotInfos[i].zone == compressionDatas.zoneid) {
                    compressionDatas['robotid'] = this.getRobotInfos[i].id;
                }
            }

            return compressionDatas;
        },

        saveClicked(infos) {
            let compressionDatas = this.checkCompressionDatas(infos);
            this.$http.get(`${this.baseUrl}/backupview/download/detail/time/${infos.time_stamp}/factory/${this.getFactoryId}/booth/${compressionDatas.boothid}/zone/${compressionDatas.zoneid}/robot/${compressionDatas.robotid}`, {responseType: 'blob'})
            .then((res) => {
                const timeInfo = new Date();
                    const makeTime = timeInfo.getFullYear() + "-" + (timeInfo.getMonth()+1) + "-" + timeInfo.getDate()
                        + "-" + timeInfo.getHours() + "" + timeInfo.getMinutes() + "" + timeInfo.getSeconds();
                    let downFileName = 'Backup_archive-' + makeTime + '.zip';
                this.$saveAs(res.data, downFileName);
            });
        },
      
        detailDialogClosed() {
            this.dialog = false;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './backupdatatable';
</style>

