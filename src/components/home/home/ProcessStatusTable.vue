<template>
    <v-card class="processStatusTableCard text-xs-center" elevation="0" :color="cardColor" v-bind="initialize">
        <v-card-title :style="ui.titleStyle" class="cardTitle">
            <span>{{ui.processStatusTableTitle}}</span>
            <a class="convert" @click="convertClicked">{{'['+ui.detailShowText+']'}}</a>
            <v-spacer/>
            <div class="pr-3" v-for="predictStdInfo in predictStdInfos" :key="predictStdInfo.id">
                <a class="pr-2 predictStdImg"><img :src='predictStdInfo.img'/></a>
                {{predictStdInfo.text}}
            </div>
        </v-card-title>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
        >
            <template slot="headers" >
                <tr>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ headers[0].title }}</th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ headers[1].title }}</th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ headers[2].title }}</th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ headers[3].title }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" :key="props.index">
                    <td class="text-xs-center tdText">{{ props.item.processInfo }}</td>
                    <td class="text-xs-center"><a class="pr-2 predictStdImg" v-if="props.item.processInfo != ''"><img :src='setPredictStdImg(props.item.p001)'/></a></td>
                    <td class="text-xs-center"><a class="pr-2 predictStdImg" v-if="props.item.processInfo != ''"><img :src='setPredictStdImg(props.item.p002)'/></a></td>
                    <td class="text-xs-center"><a class="pr-2 predictStdImg" v-if="props.item.processInfo != ''"><img :src='setPredictStdImg(props.item.p005)'/></a></td>
                </tr> 
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1">
                <v-pagination v-model="pagination.page" :length="pages"  :total-visible="7" :color="paginationColor"></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import InitDataSettingDlg from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/abnormalstandardsettingtable/InitDataSettingDlg'
export default {
    components: {InitDataSettingDlg},
    props: ['headerDatas', 'contentDatas', 'highlightFlag'],
    data() {
        return {
            ui: {
                processStatusTableTitle: this.$t(`home.child.processStatusTable.processStatusTableTitle`),
                detailShowText: this.$t(`home.showDetailPage`),
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
            predictStdInfos: [
                {id: 0,     text: this.$t(`home.child.processStatusTable.normal`), img: require("@/images/foresight_normality.png")},
                {id: 1,     text: this.$t(`home.child.processStatusTable.alarm`), img: require("@/images/foresight_alarm.png")},
                {id: null,  text: this.$t(`home.child.processStatusTable.notSet`), img: require("@/images/foresight_offsetup.png")}
            ],
            headers: [],
            datas: [],
        }   
    },

    created() {
        this.initializeStyle();
    },

    mounted() {
        this.initDatas();
    },

    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos',
            getAuth: 'getAuth'
        }),
        initialize() {
            this.getHeaderDatas();
            this.getContentDatas();
            this.calTotalCount();
        },
        pages () {
            if (this.pagination.rowsPerPage == null ||
                this.pagination.totalItems == null
            ) return 0
            return Math.ceil(this.datas.length / this.pagination.rowsPerPage)
        },

    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.cardColor = this.$style.common.tableCardBottomColor;
            document.documentElement.style.setProperty("--convert", this.$style.home.tableMaintenanceShowDetailTextColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.home.boothMonitoringCardItemTdColor);
            document.documentElement.style.setProperty("--processStatusTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        initDatas() {
            this.datas = [];
            for(let i = 0; i < this.pagination.rowsPerPage; i++) {
                this.datas.push({processInfo: '', p001: '', p002: '', p005: '', sum: ''});
            }
        },

        getHeaderDatas() {
            if(this.headerDatas.length > 0) {
                this.headers = this.headerDatas;
            }
        },

        getContentDatas() {
            if(this.contentDatas.length != 0) {
                this.settingContentDatas(this.contentDatas);
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
        convertClicked() {
            this.$router.push('/sps/diagnostics/predict')
        },

        settingContentDatas(contentDatas) {
            this.datas = [];
            Object.keys(contentDatas).forEach(function eachKey(key) {
                contentDatas[key]['processInfo'] = contentDatas[key].booth_name + "-" + contentDatas[key].zone_name + '-' + contentDatas[key].robot_name;
                contentDatas[key].booth_name;
                contentDatas[key].zone_name;
                contentDatas[key].robot_name;
            });
            this.datas = contentDatas;   
            if(this.datas.length % this.pagination.rowsPerPage != 0) {
                let index = this.pagination.rowsPerPage - this.datas.length % this.pagination.rowsPerPage;
                for(let i = 0; i < index; i++) {
                    this.datas.push({processInfo: '', p001: '', p002: '', p005: '', sum: ''});
                }
            }
        },
        setPredictStdImg(value) {
            for(let i = 0; i < this.predictStdInfos.length; i++) {
                if(this.predictStdInfos[i].id == value) {
                    return this.predictStdInfos[i].img;
                }
            }
        },
    }
}
</script>

<style scoped lang="scss">
    @import "ProcessStatusTable";
</style>
