<template>
    <v-card class="settingInfoCard elevation-2" v-bind="initialize">
        <table class="settingInfo_table">
            <tr class="settingInfo_table_row" v-for="(settingInfo, index) in settingInfos" :key="index">
                <v-layout>
                    <v-flex lg4 class="settingInfo_table_name">
                        <a><img class="pl-3 pr-2" src="@/images/table_title_icon.png"/></a>
                        <th :style="ui.tableHeaderStyle">{{settingInfo.title}}</th>
                    </v-flex>
                    <v-flex lg8 class="settingInfo_table_value">
                        <td :style="ui.tableHeaderStyle">{{settingInfo.value}}</td>
                    </v-flex>
                </v-layout>
            </tr>
        </table>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['prevDate', 'targetBoothId', 'targetZoneId', 'targetRobotId', 'searchFlag'],
    data() {
        return {
            ui: {
                tableHeaderStyle: null
            },
            settingInfos: [
               { id: 'robot_name', title: this.$t(`diagnostics.torquedata.settinginfotable.robotname`), value: '' },
               { id: 'model_name', title: this.$t(`diagnostics.torquedata.settinginfotable.modelname`), value: '' },
               { id: 'robot_model', title: this.$t(`diagnostics.torquedata.settinginfotable.robotmodel`), value: '' },
               { id: 'atom_model', title: this.$t(`diagnostics.torquedata.settinginfotable.atomizermodel`), value: '' },
               { id: 'ip_addr', title: this.$t(`diagnostics.torquedata.settinginfotable.ipaddress`), value: '' },
               { id: 'install_date', title: this.$t(`diagnostics.torquedata.settinginfotable.installdate`), value: '' }
            ],
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
        initialize() {
            this.updateSettingData();
            this.ui.tableHeaderStyle = this.$style.getTableHeaderStyle();
        }
    },
    methods: {
        updateSettingData() {
            if(this.searchFlag == true) {
                let params = {};
                if(this.prevDate != undefined && this.targetBoothId != undefined && this.targetZoneId != undefined && this.targetRobotId != undefined) {
                    params = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.prevDate);
                    this.$http.post(`${this.baseUrl}/diagnostics/torquedata/data/table`, params).then((result) => {
                            if (result.data == '') {
                                this.$popmsg(this.$t(`diagnostics.torqueRange.child.settingInfoTable.popMsg.torqueData`));
                                this.$emit('searchFlag');
                            } 
                            else {
                                this.settingInfoMap(result.data[0]);
                                this.$emit('searchFlag');
                            }
                        }).catch((error) => {
                            this.$log.error(error);
                            this.$emit('searchFlag');         
                        })
                } 
                else {
                    this.settingInfoMap([]);
                    this.$popmsg(this.$t(`diagnostics.torqueRange.child.settingInfoTable.popMsg.checkDate`));
                    this.$emit('searchFlag');
                }
            }
        },
        checkTargetDatas(boothId, zoneId, robotId, prevdate) {
            let params = {'factoryid': `${this.getFactoryId}`, 'prevtime': prevdate};
            if (boothId != undefined) {
                params['boothid'] = boothId;
            }
            if (zoneId != undefined) {
                params['zoneid'] = zoneId;
            }
            if (robotId != undefined) {
                params['robotid'] = robotId;
            }
            return params;
        },
        settingInfoMap(info) {
            let infoKeys = Object.keys(info);
            if (infoKeys.length > 0) {
                for (let i = 0; i < this.settingInfos.length; i++) {
                    for (let j = 0; j < infoKeys.length; j++) {
                        if (this.settingInfos[i].id == infoKeys[j]) {
                            if (this.settingInfos[i].id == 'robot_name') {
                                this.settingInfos[i].value = info[infoKeys[j]] + '(' + info['robot_id'] + ')';
                            }
                            else {
                                this.settingInfos[i].value = info[infoKeys[j]];
                            }
                        } 
                    }
                }
            } 
            else {
                for (let i = 0; i < this.settingInfos.length; i++) {
                    this.settingInfos[i].value = '';
                }
            }
        }     
    }
}
</script>

<style scoped lang="scss">
    @import './settinginfotable';
</style>
