<template>
    <v-form transition="slide-x-transition">
        <v-container>
            <v-layout>
                <v-card class="dlgArea" v-bind="initialize">
                    <div>
                        <div>
                            <v-card-title primary-title><img class="pr-2" :src="ui.historyIcon">
                                <span class="headline">{{ui.title}}</span></v-card-title>
                        </div>
                        <div class="condUI">
                            <div class="pl-3">
                                <v-text-field v-bind:label="ui.date" v-bind:placeholder="datas.date" v-model="datas.date"></v-text-field>
                            </div>
                            <div class="pl-3">
                                <v-text-field v-bind:label="ui.occurTime" v-bind:placeholder="datas.occurTime" v-model="datas.occurTime"></v-text-field>
                            </div>
                            <div class="pl-3">
                                <v-text-field v-bind:label="ui.actionTime" v-bind:placeholder="datas.actionTime" v-model="datas.actionTime"></v-text-field>
                            </div>
                            <div class="pl-3">
                                <v-text-field v-bind:label="ui.dt" v-bind:placeholder="datas.dt" v-model="datas.dt"></v-text-field>
                            </div>
                            <div class="pl-3">
                                <v-text-field v-bind:label="ui.booth" v-bind:placeholder="datas.booth" v-model="datas.booth"></v-text-field>
                            </div>
                            <div class="pl-3">
                                <v-text-field v-bind:label="ui.zone" v-bind:placeholder="datas.zone" v-model="datas.zone"></v-text-field>
                            </div>
                            <div class="pl-3">
                                <v-text-field v-bind:label="ui.robot" v-bind:placeholder="datas.robot" v-model="datas.robot"></v-text-field>
                            </div>
                            <div class="pl-3">
                                <v-text-field v-bind:label="ui.alarmCode" v-bind:placeholder="datas.alarmCode" v-model="datas.alarmCode"></v-text-field>
                            </div>
                        </div>
                        <div class="causeDescUI">
                            <v-textarea
                                box
                                name="input-7-4"
                                height="400px"
                                :label="ui.causeDesc"
                                v-model="datas.causeDesc"
                                >
                            </v-textarea>
                        </div>
                        <div class="actionDescUI">
                                <v-textarea
                                box
                                name="input-7-4"
                                height="400px"
                                :label="ui.actionDesc"
                                v-model="datas.actionDesc">
                            </v-textarea>
                        </div>
                        <div class="userIDEditCtrl">
                                <v-text-field v-bind:label="ui.userID" v-bind:placeholder="datas.userID" v-model="datas.userID"></v-text-field>
                        </div>
                    </div>
                </v-card>
            </v-layout>
            <v-card class="btnArea">
                    <v-btn class="btnObject" @click="modifyHistory">
                        {{ui.customBtn}}
                    </v-btn>
                    <v-btn class="btnObject" @click="sendClose">
                        {{ui.close}}
                    </v-btn>
            </v-card>
        </v-container>
    </v-form>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
    props: ['setStatus', 'historyData', 'historyID', 'selectBooth', 'selectZone', 'selectRobot', 'selectAlarmType'],
    data() {
        return {
            status: 0,
            ui: {
                title:      this.$t(`postHistory.child.PostHistoryData.title`),
                customBtn:  '',
                close:      this.$t(`postHistory.child.PostHistoryData.close`),
                date:       this.$t(`postHistory.child.PostHistoryData.date`),
                occurTime:  this.$t(`postHistory.child.PostHistoryData.occurTime`),
                actionTime: this.$t(`postHistory.child.PostHistoryData.actionTime`),
                dt:         this.$t(`postHistory.child.PostHistoryData.dt`),
                booth:      this.$t(`postHistory.child.PostHistoryData.booth`),
                zone:       this.$t(`postHistory.child.PostHistoryData.zone`),
                robot:      this.$t(`postHistory.child.PostHistoryData.robot`),
                alarmCode:  this.$t(`postHistory.child.PostHistoryData.alarmCode`),
                causeDesc:  this.$t(`postHistory.child.PostHistoryData.causeDesc`),
                actionDesc: this.$t(`postHistory.child.PostHistoryData.actionDesc`),
                userID:     this.$t(`postHistory.child.PostHistoryData.userid`),
                historyIcon: require("@/images/history_icon.png")
            },
            datas: {
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
            }
        }
    },
    computed: {
        ...mapGetters ({
                baseUrl: 'getBaseUrl',
                getTheme: 'getTheme',
                getFactoryId: 'getFactoryId',
        }),
        initialize() {
            this.status = this.setStatus;
            if (this.status == 0) {
                this.ui.customBtn = this.$t(`postHistory.child.PostHistoryData.create`);
                this.datas = this.historyData;
            }
            else if (this.status == 1) {
                this.ui.customBtn = this.$t(`postHistory.child.PostHistoryData.modify`);
                this.datas = this.historyData;
            }
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--dlgAreaBackgroundColor", this.$style.posthistory.postHistoryDataItemDlgAreaBackgroundColor);
            document.documentElement.style.setProperty("--causeDescUIBackgroundColor", this.$style.posthistory.postHistoryDataItemCauseDescUIBackgroundColor);
            document.documentElement.style.setProperty("--actionDescUIBackgroundColor", this.$style.posthistory.postHistoryDataItemActionDescUIBackgroundColor);
            document.documentElement.style.setProperty("--btnAreaBackgroundColor", this.$style.posthistory.postHistoryDataItemBtnAreaBackgroundColor);
            document.documentElement.style.setProperty("--btnObjectBackgroundColor", this.$style.posthistory.postHistoryDataItemBtnObjectBackgroundColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
        },
        modifyHistory() {
            if (this.status == 0) {
                // 생성
                this.createRequestQuery();
                
            }
            else if (this.status == 1) {
                // 변경
                this.modifyRequestQuery();
            }
        },
        createRequestQuery() {
            let postDatas = {
                factoryid: this.getFactoryId,
                boothid: this.selectBooth,
                zoneid: this.selectZone,
                robotid: this.selectRobot,
                date: this.datas.date,
                occurtime: this.datas.occurTime,
                cleartime: this.datas.actionTime,
                deadtime: this.datas.dt,
                alarmcode: this.datas.alarmCode,
                userid: this.datas.userID,
                type: this.selectAlarmType,
                clearaction: this.datas.actionDesc,
                cause: this.datas.causeDesc
            }
            this.$http.post(`${this.baseUrl}/posthistory/data/create`, postDatas).then((result) => {
                if (result.data == '') {
                    this.$popmsg(this.$t(`postHistory.child.PostHistoryData.popMsg.createData`));
                }
                else {
                    
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },
        modifyRequestQuery() {
            let postDatas = {
                clearaction: this.datas.actionDesc,
                cause: this.datas.causeDesc,
                historyid: this.historyID
            }
            this.$http.post(`${this.baseUrl}/posthistory/data/update`, postDatas).then((result) => {
                if (result.data == '') {
                    this.$popmsg(this.$t(`postHistory.child.PostHistoryData.popMsg.modifyData`));
                }
                else {
                    
                }
            }).catch((error) => {
                this.$log.error(error);
            })
        },
        sendClose() {
            this.$emit('postHistoryDialogClosed');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './posthistorydata';
</style>