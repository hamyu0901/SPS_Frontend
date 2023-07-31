<template>
    <v-card class="backUpDetailCard" v-bind="getDetailInfos">
        <v-layout column>
            <v-layout>
                <v-flex class="pt-2 pl-4" lg7>
                    <v-card class="backUpSubCard">
                        <v-card-title primary-title class="backUpSubCardTitle">{{$t(`backupview.backupdatatable.backupdetail.backuphistory.title`)}}</v-card-title>
                        <backup-history v-bind:historyDatas="historyDatas" v-on:getJobFile="getJobFile"></backup-history>
                    </v-card>
                </v-flex>
                <v-flex class="pt-2 pr-2 pl-2" lg5>
                    <v-card class="backUpSubCard">
                        <v-card-title primary-title class="backUpSubCardTitle">
                            <v-layout>
                                <v-flex lg9>{{$t(`backupview.backupdatatable.backupdetail.downloadtitle`)}}</v-flex>
                                <v-flex lg3><a class="fileDownload" ref="fileDownload" v-on:click="fileDownloadClicked">{{$t(`backupview.backupdatatable.backupdetail.downloadlink`)}}</a></v-flex>    
                            </v-layout>
                        </v-card-title> 
                        <v-card class="pt-1 pr-4 pb-4 pl-4 backUpSubCard" justify-center>
                            <v-card-text ref="jobFileContentArea" class="jobFileContentArea">
                                {{jobFileContent}}
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-spacer/>
                <v-btn class="closeBtn buttonItem" flat @click="closeClicked">{{$t(`backupview.backupdatatable.backupdetail.close`)}}</v-btn>
            </v-layout>   
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import BackupHistory from '@/components/backupview/backupview/backupdatatable/backupdetail/BackupHistory'
export default {
    props: ['detailInfos', 'dialogFlag'],
    components: {BackupHistory},
    data() {
        return {
            ui: {
                cardColor: '',
                titleStyle: null,
            },
            cardHistoryTitle: 'Backup History',
            highlightFlag: true,
            cardDownloadTitle: this.$t(`backupview.child.backupDetail.fileDownload`),
            historyDatas: [],
            jobFileName: '',
            jobFileContent: ''
        }
    },
    computed: {
        ...mapGetters ({
            getTheme: 'getTheme',
            factoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'
        }),

        getDetailInfos() {
            if(this.dialogFlag == true) {
                this.getHistoryDatas();
            }
        }
    },
    mounted() {
        // if(this.getTheme == true) {
        //     this.$refs.jobFileContentArea.style.color="black";
        // } else {
        //     this.$refs.jobFileContentArea.style.color="white"
        // }
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.ui.cardColor = this.$style.backup.backupDetailItemCardColor;
            document.documentElement.style.setProperty("--backUpDetailCardBackgroundColor", this.$style.backup.backUpDetailItemBackUpDetailCardBackgroundColor);
            document.documentElement.style.setProperty("--backUpSubCardBackgroundColor", this.$style.backup.backUpDetailItemBackUpSubCardBackgroundColor);
            document.documentElement.style.setProperty("--backUpSubCardTitleBackgroundColor", this.$style.backup.backUpDetailItemBackUpSubCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--backUpSubCardTitleColor", this.$style.backup.backUpDetailItemBackUpSubCardTitleColor);
            document.documentElement.style.setProperty("--jobFileContentAreaBackgroundColor", this.$style.backup.backupDataTableItemJobFileContentAreaBackgroundColor);
            document.documentElement.style.setProperty("--titleColorBackgroundColor", this.$style.backup.backupDataTableItemTitleColorBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemColor", this.$style.common.buttonItemColor);
            document.documentElement.style.setProperty("--cardTitleColor", this.$style.backup.backupDataTableItemCardTitleColor);
            document.documentElement.style.setProperty("--jobTextColor", this.$style.backup.backupDataTableItemJobTextColor);
        },
        getHistoryDatas() {
            this.historyDatas = [];
            let postDatas = this.checkPostDatas(this.detailInfos);
            this.$http.get(`/backupview/grid/detail`,{params: postDatas}
            ).then((result) => {
                for (let idx = 0; idx < result.data.length; ++idx) {
                    this.historyDatas.push( {
                        file_content: result.data[idx].file_content,
                        file_name: result.data[idx].file_name,
                        time_stamp: ((result.data[idx].time_stamp).replace('T', ' ')).replace('Z', '')
                    })
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        checkPostDatas(detailDatas) {
            let postDatas = { 'factoryid': this.factoryId, 'selecttime': detailDatas.time_stamp };
            for (let i = 0; i < this.getBoothInfos.length; i++) {
                if (this.getBoothInfos[i].name == detailDatas.booth_name) {
                    postDatas['boothid'] = this.getBoothInfos[i].id;
                }
            }

            for (let i = 0; i < this.getZoneInfos.length; i++) {
                if (this.getZoneInfos[i].booth == postDatas['boothid'] && this.getZoneInfos[i].name == detailDatas.zone_name) {
                    postDatas['zoneid'] = this.getZoneInfos[i].id;
                }
            }

            for (let i = 0; i < this.getRobotInfos.length; i++) {
                if (this.getRobotInfos[i].zone == postDatas['zoneid'] && this.getRobotInfos[i].name == detailDatas.robot_name) {
                    postDatas['robotid'] = this.getRobotInfos[i].id;
                }
            }
            return postDatas;
        },

        fileDownloadClicked() {
            let blob = new Blob([this.jobFileContent], {type: 'jbi; charset=ASCII'});
            this.$saveAs(blob, this.jobFileName);
        },

        getJobFile(jobFiles) {
            this.jobFileContent = '';
            this.jobFileName = '';

            this.jobFileContent = jobFiles.jobFile_content;
            this.jobFileName = jobFiles.jobFile_name;
        },

        closeClicked() {
            this.jobFileContent = '';
            this.jobFileName = '';

            this.$emit('detailDialogClosed');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './backupdetail';
</style>
