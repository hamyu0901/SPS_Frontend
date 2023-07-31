<template>
    <v-container fluid fill-height>
        <v-layout>
            <v-flex lg2 v-if="flags.treeViewFlag" class="pr-2">
                <v-layout>
                    <tree-view
                        v-on:nodeInfo="getNodeInfo"
                    ></tree-view>
                </v-layout>
            </v-flex>
            <v-flex lg12>
                <v-layout column>
                    <v-layout class="ml-2" v-bind:style="ui.tabsStyle">
                        <v-tabs :active-class="ui.activeClass" hide-slider :color="ui.tabsColor" :height="ui.tabsHeight">
                            <v-tab v-bind:style="ui.tabStyle" v-for="tabItem in datas.tabItems" ripple :key="tabItem.id" :to="tabItem.path" @click="tabClicked(tabItem)">
                                <v-layout>
                                    <a class="pr-2">
                                        <img v-if="setIconHighLight(tabItem)" :src="tabItem.overImg"/>
                                        <img v-else :src="tabItem.normalImg"/>
                                    </a>
                                    {{tabItem.title}}
                                </v-layout>
                            </v-tab>
                        </v-tabs>
                    </v-layout>
                    <v-layout class="pt-2">
                        <router-view v-bind:nodeInfo="datas.nodeInfo"/>
                    </v-layout>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import TreeView from '@/commons/TreeView'
export default {
    components: {TreeView},
    data() {
        return {
            ui: {
                tabsColor: '',
                tabsHeight: "40px",
                tabStyle: {
                    marginRight: "5px",
                    color: '',
                    backgroundColor: '',
                    borderRadius: "10px 10px 0 0 /  10px 10px 0 0"
                },
                tabsStyle: {
                    borderBottom: ``,
                },
                activeClass: ``,
            },
            flags: {
                treeViewFlag: true
            },
            datas: {
                tabItems: [
                    {
                        id: "alarmView", 
                        title: this.$t('alarm.listDatas.alarmView'), 
                        overImg: require("@/images/subtabicons/subtab_alarmview_over.png"), 
                        normalImg: require("@/images/subtabicons/subtab_alarmview_normal.png"), 
                        path: "/sps/alarm/alarmview"
                    },
                    {
                        id: "predictAlarm",
                        title: this.$t('alarm.listDatas.predictAlarm'), 
                        overImg: require("@/images/subtabicons/subtab_alarmview_over.png"), 
                        normalImg: require("@/images/subtabicons/subtab_alarmview_normal.png"),
                        path: "/sps/alarm/predictalarm"
                    },
                    {
                        id: "alarmInfo", 
                        title: this.$t('alarm.listDatas.alarmInfos'), 
                        overImg: require("@/images/subtabicons/subtab_alarminfo_over.png"), 
                        normalImg: require("@/images/subtabicons/subtab_alarminfo_normal.png"), 
                        path: "/sps/alarm/alarminfos"
                    },
                    {
                        id: "alarmManual", 
                        title: this.$t('alarm.listDatas.alarmManual'), 
                        overImg: require("@/images/subtabicons/subtab_alarmmanual_over.png"), 
                        normalImg: require("@/images/subtabicons/subtab_alarmmanual_normal.png"), 
                        path: "/sps/alarm/alarmmanual"
                    }
                ],
                nodeInfo: {}
            }
        }
    },
    created() {
        this.initializeUI();
    },

    mounted() {
        this.$emit('mountedTab');
        this.initializeStyle();
    },

    methods: {
        initializeUI() {
            this.ui.activeClass = this.$style.alarm.alarmItemActiveClass;
        },

        initializeStyle() {
            this.ui.tabsColor = this.$style.alarm.alarmItemTabsColor; 
            this.ui.tabStyle.color = this.$style.alarm.alarmItemTabStyleColor; 
            this.ui.tabStyle.backgroundColor = this.$style.alarm.alarmItemTabStyleBackgroundColor;
            this.ui.tabsStyle.borderBottom = this.$style.alarm.alarmItemTabsStyleBorderBottom;
        },

        getNodeInfo(nodeInfo) {
            this.datas.nodeInfo = nodeInfo;
        },

        tabClicked(item) {
            this.checkTreeViewFlag(item);
        },

        setIconHighLight(tabItem) {
            if(tabItem.path === window.location.pathname){
                this.checkTreeViewFlag(tabItem);
                return true;
            }
            else {
                return false;
            }
        },

        checkTreeViewFlag(item) {
            if(item.id === 'alarmView' || item.id === 'predictAlarm') {
                this.flags.treeViewFlag = true;
            }
            else {
                this.flags.treeViewFlag = false;
            }
        }

    }
}
</script>

<style scoped lang="scss">
    @import "./alarm";
</style>