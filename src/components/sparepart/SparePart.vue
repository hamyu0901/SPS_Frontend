<template>
    <v-container fluid fill-height>
        <v-layout wrap row>
            <a>
                <img class="pt-1 pr-2" src="@/images/selector_icon.png" />
            </a>
            <v-flex class="pl-2 pr-2" lg1>
                <selector 
                class="sparePartsSelector" 
                v-bind:selectorTitle="ui.boothTitle"
                v-bind:selectorOptions="getBoothInfos"
                v-on:selectedTarget="getTargetBoothId"></selector>
            </v-flex>
            <v-flex class="pl-2 pr-2" lg1>
                <selector 
                class="sparePartsSelector" 
                v-bind:selectorTitle="ui.zoneTitle"
                v-bind:selectorOptions="getSelectedTargetZoneInfos"
                v-on:selectedTarget="getTargetZoneId"></selector>
            </v-flex>
            <v-flex class="pl-2" lg1>
                <selector 
                class="sparePartsSelector" 
                v-bind:selectorTitle="ui.robotTitle"
                v-bind:selectorOptions="getSelectedTargetRobotInfos"
                v-on:selectedTarget="getTargetRobotId"></selector>
            </v-flex>
            <v-flex class="pl-2" lg1>
                <v-btn class="searchBtn" :color="'#237ffe'" @click="createBtnClick">
                    <a class="pt-1">
                            
                    </a>
                </v-btn>
                <v-btn class="searchBtn" :color="'#237ffe'" @click="searchBtnClick">
                    <a class="pt-1">
                        <img :src="ui.searchBtnIcon">
                    </a>
                </v-btn>
            </v-flex>
            <v-flex xs12 lg12 class="pb-3 pr-3">
                <spare-part v-bind:headerData="infoTableHeaderData" v-bind:contentData="InfoTableContentData" v-bind:highlightFlag="false">>
                </spare-part>
            </v-flex>
            <v-dialog v-if="flag" v-model='dialog' width='770px' persistent>
                <Spare-Part-Data 
                v-on:sparePartDialogClosed='sparePartDialogClosed'
                v-bind:setStatus="1"
                v-bind:partsInfo="partsDatas"></Spare-Part-Data>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import Selector from '@/commons/Selector'
import sparePart from '@/components/sparepart/sparepart/GridTableWithDialog'
import SparePartData from '@/components/sparepart/sparepart/gridtablewithdialog/SparePartData'
export default {
    components: {
        sparePart,
        Selector,
        SparePartData
    },
    data() {
        return {
            ui: {
                boothTitle: '부스 선택',
                zoneTitle: '존 선택',
                robotTitle: '로봇 선택',
                searchBtnIcon: require("@/images/search_icon.png")
            },
            infoTableHeaderData: [
                { text: '모델 명',      value: 'model_name',   sortable: false, align: 'center'},
                { text: '파트 번호',    value: 'part_no',     sortable: false, align: 'center'},
                { text: '파트 명',      value: 'part_name',   sortable: false, align: 'center'},
                { text: '파트 품번',    value: 'part_code',   sortable: false, align: 'center'},
                { text: '파트 수량',    value: 'part_count',   sortable: false, align: 'center'},
                { text: '메모',         value: 'remarks',   sortable: false, align: 'center'},
                { text: '도면',         value: 'drawing_no',   sortable: false, align: 'center'},
                { text: '자세히',       value: 'detail',   sortable: false, align: 'center'},
                { text: '수정',         value: 'modify',   sortable: false, align: 'center'},
                { text: '삭제',         value: 'delete',   sortable: false, align: 'center'}
            ],
            InfoTableContentData: [],
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
            flag: false,
            dialog: false,
            targetBoothId: '',
            targetZoneId: '',
            targetRobotId: '',
            getSelectedTargetZoneInfos: [],
            getSelectedTargetRobotInfos: [],
        }
    },
    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'     
        }),
        
    },
    mounted() {
        this.$emit('mountedTab');
        this.initDataTable();
    },
    methods: {
        initDataTable() {
            
        },
        getExceptionHandling(boothid, zoneid, robotid) {
            if (boothid == '') {
                return false;
            }
            else if (zoneid == '') {
                return false;
            }
            else if (robotid == '') {
                return false;
            }
            else {
                return true;
            }
        },
        searchBtnClick() {
            if (this.getExceptionHandling(this.targetBoothId, this.targetZoneId, this.targetRobotId)) {
                let postDatas = { boothid: this.targetBoothId, zoneid: this.targetZoneId, robotid: this.targetRobotId };
                this.$http.post(`${this.baseUrl}/sparepart/data/gridtable`, postDatas)
                    .then((result) => {
                        if (result.data == '') {
                            this.$notify({
                                group: 'pushAlarm',
                                text: '찾기 설정이 안되어 있습니다.',
                            });
                        }
                        else {
                            for (let idx = 0; idx < result.data.length; ++idx) {
                                this.InfoTableContentData.push({
                                    drawing_no: result.data[idx].drawingno,
                                    remarks: result.data[idx].remarks,
                                    part_no: result.data[idx].partno,
                                    part_name: result.data[idx].partname,
                                    model_name: result.data[idx].modelname,
                                    mainGroup: '',
                                    serveGroup: '',
                                    usingModel: '',
                                    checkPeriod: '',
                                    changePeriod: '',
                                    part_count: result.data[idx].remainamount
                                });
                            }
                        }
                    }).catch((error) => {

                    })
            }
            else {
                this.$notify({
                        group: 'pushAlarm',
                        text: '찾기 설정이 안되어 있습니다.',
                    });
                return false;
            }
        },
        createBtnClick() {
            this.flag = true;
            this.dialog = true;
        },
        sparePartDialogClosed() {
            this.dialog = false;
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
    }
}
</script>

<style scoped>
    .v-btn {
      min-width: 0;
      margin: 0;
    }

    .sparePartsSelector {
        height: 34px;
        width: 100%;
    }

    .searchBtn {
        height: 33px;
    }

</style>
