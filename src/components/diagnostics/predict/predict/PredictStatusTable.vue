<template>
    <v-card class="text-xs-center predictStatusTableCard" elevation="0" :color="cardColor" v-bind="initialize">
        <v-card-title class="cardTitle" :style="ui.titleStyle">
            {{ui.predictStatusTableTitle}}
            <v-spacer/>
            <div class="titleText pr-3" v-for="predictStdInfo in predictStdInfos" :key="predictStdInfo.id">
                <a class="predictStdImg pr-2"><img :src='predictStdInfo.img'/></a>
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
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ headers[0].title }}</th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ headers[1].title }} </th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ui.release}}</th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ headers[2].title }} </th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions">{{ui.release}}</th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions" v-if="Boolean(getAuth)">{{ headers[3].title }} </th>
                    <th :style="ui.tableHeaderStyle" class="text-xs-center headerOptions" v-if="Boolean(getAuth)">{{ui.release}}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" :key="props.index">
                    <td class="text-xs-center tdText" @click="itemClicked(props, pagination.page)">{{ props.item.processInfo }}</td>
                    <td class="text-xs-center tdText"><a class="pr-2 predictStdImg" v-if="props.item.processInfo != ''"><img :src='setPredictStdImg(props.item.p001)'/></a></td>
                    <td class="text-xs-center tdText"><v-btn class="disableBtn" :color="(predictStdInfos[0].id === props.item.p001) ? 'primary':'red'" small v-if="props.item.processInfo != ''" @click="disableBtnClicked(props.item, 'p001')">{{ui.disableText}}</v-btn></td>
                    <td class="text-xs-center tdText"><a class="pr-2 predictStdImg" v-if="props.item.processInfo != ''"><img :src='setPredictStdImg(props.item.p002)'/></a></td>
                    <td class="text-xs-center tdText"><v-btn class="disableBtn" :color="(predictStdInfos[0].id === props.item.p002) ? 'primary':'red'"  small v-if="props.item.processInfo != ''" @click="disableBtnClicked(props.item, 'p002')">{{ui.disableText}}</v-btn></td>
                    <td class="text-xs-center tdText"  v-if="Boolean(getAuth)"><a class="pr-2 predictStdImg" v-if="props.item.processInfo != ''"><img :src='setPredictStdImg(props.item.p005)'/></a></td>
                    <td class="text-xs-center tdText"  v-if="Boolean(getAuth)"><v-btn class="disableBtn" :color="(predictStdInfos[0].id === props.item.p005) ? 'primary':'red'" small v-if="props.item.processInfo != ''" @click="disableBtnClicked(props.item, 'p005')">{{ui.disableText}}</v-btn></td>
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
import InitDataSettingDlg from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/abnormalstandardsettingtable/InitDataSettingDlg'
export default {
    components: {InitDataSettingDlg},
    props: ['headerDatas', 'contentDatas', 'selectDatas', 'highlightFlag'],
    data() {
        return {
            ui: {
                predictStatusTableTitle: this.$t(`diagnostics.predict.child.predictStatusTable.predictStatusTableTitle`),
                release: this.$t(`diagnostics.predict.child.predictStatusTable.release`),
                disableText: this.$t(`diagnostics.predict.child.predictStatusTable.disable`),
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
                {id: 0,     text: this.$t(`diagnostics.predict.child.predictStatusTable.predictStdInfos.normal`), img: require("@/images/foresight_normality.png")},
                {id: 1,     text: this.$t(`diagnostics.predict.child.predictStatusTable.predictStdInfos.alarm`), img: require("@/images/foresight_alarm.png")},
                {id: null,  text: this.$t(`diagnostics.predict.child.predictStatusTable.predictStdInfos.notSet`), img: require("@/images/foresight_offsetup.png")}
            ],
            headers: [],
            datas: []
        }   
    },
    created() {
    },
    mounted() {
        this.initDatas();
        this.initializeStyle();
    },
    computed: {
        ...mapGetters ({
            getAuth: 'getAuth'
        }),

        initialize() {
            this.getHeaderDatas();
            this.getContentDatas();
            this.calTotalCount();
            this.getSelectDatas();
        },

        pages () {
            if (this.pagination.rowsPerPage == null ||
                this.pagination.totalItems == null
            ) return 0
            return Math.ceil(this.datas.length / this.pagination.rowsPerPage)
        }
    },
    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.cardColor = this.$style.common.tableCardBottomColor;

            document.documentElement.style.setProperty("--predictStatusTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        getHeaderDatas() {
            this.headers = [];
            let tempHeaders = [];
            this.headerDatas.forEach((headerData, index) => {
                if(headerData.show === true) {
                    tempHeaders.push(headerData);
                }
                if((this.headerDatas.length - 1) === index) {
                    this.headers = tempHeaders;
                }
            })
        },
        getContentDatas() {
            if(this.contentDatas.length != 0) {
                this.settingContentDatas(this.contentDatas);
            } else {
                this.initDatas();
            }
        },
        getSelectDatas() {
            if(this.contentDatas.length > 0 && this.selectDatas !== undefined) {
                this.contentDatas.forEach((contentData, index) => {
                    if(contentData.robot_id === this.selectDatas.robotid) {
                        this.pagination.page = parseInt(index / this.pagination.rowsPerPage +1);
                        this.itemClicked({item: this.datas[index], index: parseInt(index % this.pagination.rowsPerPage)}, parseInt((index / this.pagination.rowsPerPage) + 1));
                    }
                })
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
        initDatas() {
            this.datas = [];
            for(let i = 0; i < this.pagination.rowsPerPage; i++) {
                if(Boolean(this.getAuth)) {
                    this.datas.push({processInfo: '', p001: '', p002: '', p005: '', sum: ''});
                } else {
                    this.datas.push({processInfo: '', p001: '', p002: '', sum: ''});
                }
            }
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
                    if(Boolean(this.getAuth)) {
                        this.datas.push({processInfo: '', p001: '', p002: '', p005: '', sum: ''});
                    } else {
                        this.datas.push({processInfo: '', p001: '', p002: '', sum: ''});
                    }
                }
            }
            if(this.datas[0].processInfo != '') {
                this.rowHighLight(0, 1);
                this.$emit('processInfo', this.datas[0]); 
                this.itemNum = 0;
            }
        },
        itemClicked(rowDataInfo, pageNum) {
            if(this.totalCount != 0) {
                this.pageNum = pageNum;
                if(this.highlightFlag == true) {
                    if(rowDataInfo.index == undefined) {
                        this.rowHighLight(0, pageNum);
                        this.$emit('processInfo', rowDataInfo.item);
                        this.itemNum = 0;
                    } else {   
                        this.rowHighLight(rowDataInfo.index, pageNum);
                        this.$emit('processInfo', rowDataInfo.item); 
                        this.itemNum = rowDataInfo.index;
                    }
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
        disableBtnClicked(rowDataInfo, alarmName) {
            if(rowDataInfo[alarmName] == 1) {
                this.$emit('violationInfo', rowDataInfo, alarmName);
                this.$popmsg(this.$t('diagnostics.predict.child.predictStatusTable.popMsg.releaseMsg'));
            }
            else if(rowDataInfo[alarmName] == 0){
                this.$popmsg(this.$t('diagnostics.predict.child.predictStatusTable.popMsg.normalMsg'));
            }
            else {
                this.$popmsg(this.$t('diagnostics.predict.child.predictStatusTable.popMsg.notSetMsg'));
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
        }
    }
}
</script>

<style scoped lang="scss">
    @import './predictstatustable';
</style>
