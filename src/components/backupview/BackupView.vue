<template>
    <v-container fluid>
        <v-layout column v-bind="initialize">
            <v-layout>
                <v-flex class="pr-2" lg2>
                    <date-picker :setDate="setPrevDate()" v-on:getDate="getPrevDate"></date-picker>
                </v-flex>
                <v-flex class="pl-2 pr-2" lg2>
                    <date-picker :setDate="setCurrDate()" v-on:getDate="getCurrDate"></date-picker>
                </v-flex>
                <a><img class="pt-1 pl-2 pr-1" :src="ui.sectorIcon"/></a>
                
                <v-flex class="pl-2 pr-2" lg2>
                    <selector 
                    class="backupViewSelector" 
                    v-bind:selectorTitle="$t(String(`selector.booth`))" 
                    v-bind:selectorOptions="getBoothInfos"
                    v-on:selectedTarget="getTargetBoothId"
                    ></selector>
                </v-flex>
                
                <v-flex class="pl-2 pr-2" lg2>
                    <selector 
                    class="backupViewSelector" 
                    v-bind:selectorTitle="$t(String(`selector.zone`))" 
                    v-bind:selectorOptions="getSelectedTargetZoneInfos"
                    v-on:selectedTarget="getTargetZoneId"
                    ></selector>
                </v-flex>
                
                <v-flex class="pl-2 pr-2" lg2>
                    <selector 
                    class="backupViewSelector" 
                    v-bind:selectorTitle="$t(String(`selector.robot`))" 
                    v-bind:selectorOptions="getSelectedTargetRobotInfos"
                    v-on:selectedTarget="getTargetRobotId"
                    ></selector>
                </v-flex>

                <v-btn class="ml-2 searchBtn" :color="'#237ffe'" @click="searchBtnClicked">
                    <a class="pt-1"><img :src="ui.searchBtnIcon"></a>
                </v-btn>  
            </v-layout>
            <v-layout class="pt-4" column>
                <v-flex xs12 lg12>
                    <backup-data-table 
                    v-bind:prevDate="prevDate" 
                    v-bind:currDate="currDate" 
                    v-bind:targetBoothId="targetBoothId" 
                    v-bind:targetZoneId="targetZoneId"
                    v-bind:targetRobotId="targetRobotId" 
                    v-bind:searchFlag="searchFlag" 
                    v-on:searchFlag="changeSearchFlag" 
                    v-bind:headerData="infoTableHeaderData"
                    v-bind:contentData="infoTableContentData"></backup-data-table>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>

</template>

<script>
import {mapGetters} from 'vuex'
import DatePicker from '@/commons/DatePicker'
import Selector from '@/commons/Selector'
import BackupDataTable from '@/components/backupview/backupview/BackupDataTable'
export default {
    components: {DatePicker, Selector, BackupDataTable},
    data() {
        return {
            searchFlag: false,
            prevDate: '',
            currDate: '',
            targetBoothId: '',
            targetZoneId: '',
            targetRobotId: '',
            getSelectedTargetZoneInfos: [],
            getSelectedTargetRobotInfos: [],
            infoTableHeaderData: [
                { text: this.$t(`backupview.timestamp`), value: 'time_stamp', sortable: false, align: 'center' },
                { text: this.$t(`backupview.booth`), value: 'booth_name', sortable: false, align: 'center' },
                { text: this.$t(`backupview.zone`), value: 'zone_name', sortable: false, align: 'center' },
                { text: this.$t(`backupview.robot`), value: 'robot_name', sortable: false, align: 'center' },
                { text: this.$t(`backupview.save`), value: 'save', sortable: false, align: 'center' }
            ],
            infoTableContentData: [],
            ui: {
                searchBtnIcon: require("@/images/search_icon.png"),
                sectorIcon: require("@/images/selector_icon.png"),
                date: null
            }
        }
    },
    created() {
        
    },
    mounted() {
        this.$emit('mountedTab');
        this.initializeStyle();
    },
    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'     
        }),

        initialize() {
            this.initPage();
        }
    },

    methods: {
        initializeStyle() {
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
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.tableTBodyBBColor);
        },

        getPrevDate(prevDate) {
            this.prevDate = prevDate;
        },

        getCurrDate(currDate) {
            this.currDate = currDate;
        },

        setPrevDate() {
            let nowDate = new Date()
            let dayOfMonth = nowDate.getDate()
            nowDate.setDate(dayOfMonth - 7);

            let month = '' + (nowDate.getMonth() + 1);
            let day = '' + nowDate.getDate();
            let year = nowDate.getFullYear();
            let prevDate = year + "-" + month + "-" + day;

            return prevDate;
        },

        setCurrDate() {
            let nowDate = new Date();
            let month = '' + (nowDate.getMonth() + 1);
            let day = '' + nowDate.getDate();
            let year = nowDate.getFullYear();
            let currDate = year + "-" + month + "-" + day;
            return currDate;
        },

        initCSS() {
            $("table.v-table tbody tr td").css("background-color", this.$style.backup.backupDataTableItemNoDataAvailable);
        },

        initPage() {
            let time = new Date();
            let date = time.getUTCFullYear() + "-" + (time.getUTCMonth()+1) + "-" + time.getUTCDate();
            this.ui.date = date;
            let params = {
                factoryid: this.getFactoryId,
                prevtime: date,
                currtime: date
            }
            if(params.factoryid != '') {
                this.$http.post(`${this.baseUrl}/backupview/grid`, params).then((result) => {
                    if (result.data == '') {
                        this.$popmsg(this.$t(`backupview.popMsg.backupData`));
                    }
                    else {
                        for (let idx = 0; idx < result.data.length; ++idx) {
                            this.infoTableContentData.push({
                                time_stamp: result.data[idx].time_stamp,
                                booth_name: result.data[idx].booth_name,
                                zone_name: result.data[idx].zone_name,
                                robot_name: result.data[idx].robot_name,
                                detail: '',
                                save: ''
                            });
                        }
                    }
                }).catch((error) => {
                    this.$log.error(error);
                })
            }
        },
        
        getTargetBoothId(targetId) {
            this.getSelectedTargetZoneInfos = [];
            this.targetBoothId = targetId.target;
            for(let i = 0; i < this.getZoneInfos.length; i++) {
                if(this.getZoneInfos[i].booth == this.targetBoothId) {
                    this.getSelectedTargetZoneInfos.push(this.getZoneInfos[i]);
                }
            }
        },

        getTargetZoneId(targetId) {
            this.getSelectedTargetRobotInfos = [];
            this.targetZoneId = targetId.target;
            for(let i = 0; i < this.getRobotInfos.length; i++) {
                if(this.getRobotInfos[i].zone == this.targetZoneId) {
                    this.getSelectedTargetRobotInfos.push(this.getRobotInfos[i]);
                }
            }
        },

        getTargetRobotId(targetId) {
            this.targetRobotId = targetId.target;
        },

        searchBtnClicked() {
            this.infoTableContentData = [];
            let postDatas = {
                factoryid: this.getFactoryId,
                prevtime: this.prevDate,
                currtime: this.currDate,
                boothid: this.targetBoothId,
                zoneid: this.targetZoneId,
                robotid: this.targetRobotId
            }
            this.$http.post(`${this.baseUrl}/backupview/grid`, postDatas).then((result) => {
                if (result.data == '') {
                    this.$popmsg(this.$t(`backupview.popMsg.backupData`));
                    this.initCSS();
                }
                else {
                    for (let idx = 0; idx < result.data.length; ++idx) {
                        this.infoTableContentData.push({
                            time_stamp: result.data[idx].time_stamp,
                            booth_name: result.data[idx].booth_name,
                            zone_name: result.data[idx].zone_name,
                            robot_name: result.data[idx].robot_name,
                            detail: '',
                            save: ''
                        });
                    }
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        changeSearchFlag() {
            this.searchFlag = false;
        }
    }
}
</script>

<style scoped lang="scss">
    @import "./backupview"; 
</style>
