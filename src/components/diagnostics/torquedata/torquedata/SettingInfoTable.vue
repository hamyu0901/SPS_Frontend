<template>
    <v-card class="settingInfoTableCard" elevation="0" v-bind="initialize">
        <table class="settingInfo_table">
            <tr class="settingInfo_table_row" v-for="(settingInfo, index) in settingInfos" :key="index">
                <v-layout>
                    <v-flex lg4 class="settingInfo_table_name">
                        <a><img class="pl-4 pr-4" src="@/images/table_title_icon.png"/></a>
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
export default {
    props: ['contentDatas'],
    data() {
        return {
            ui: {
                tableHeaderStyle: null
            },
            settingInfos: [
               { id: 'robot_name',      title: this.$t(`diagnostics.torquedata.settinginfotable.robotname`), value: '' },
               { id: 'rc_name',      title: this.$t(`diagnostics.torquedata.settinginfotable.modelname`), value: '' },
               { id: 'robot_model',     title: this.$t(`diagnostics.torquedata.settinginfotable.robotmodel`), value: '' },
               { id: 'ip_addr',         title: this.$t(`diagnostics.torquedata.settinginfotable.ipaddress`), value: '' },
            ],
        }
    },
    computed: {
        initialize() {
            this.getContentDatas();
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            document.documentElement.style.setProperty("--settingInfoTableNameBackgroundColor", this.$style.diagnostics.settingInfoTableItemTableNameBackgroundColor);
            document.documentElement.style.setProperty("--settingInfoTableValueBackgroundColor", this.$style.diagnostics.settingInfoTableItemTableValueBackgroundColor);
            document.documentElement.style.setProperty("--settingInfoTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        getContentDatas() {
            if(this.contentDatas.length > 0) {
                this.settingInfoMap(this.contentDatas[0]);
            }
            else {
               this.initSettingInfoTable();
            }
        },

        initSettingInfoTable() {
            for (let i = 0; i < this.settingInfos.length; i++) {
                this.settingInfos[i].value = '';
            }
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
        }     
    }
}
</script>

<style scoped lang="scss">
    @import './settinginfotable';
</style>
