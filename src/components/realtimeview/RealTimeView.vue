<template>
   <v-container fluid fill-height>
        <v-layout>
            <v-flex lg2>
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
                            <v-tab v-bind:style="ui.tabStyle" v-for="tabItem in datas.tabItems" ripple :key="tabItem.id" :to="tabItem.path">
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
                    <div id="realtimeContents">
                        <v-layout class="pt-2" justify-center align-center fill-height>
                            <router-view v-show="flags.robotSelectionFlag" v-bind:nodeInfos="datas.robotInfos"/>
                            <div v-show="!flags.robotSelectionFlag" style="text-align:center">
                                <img :src="getRobotSearchImg"/>
                                <p class="robotSelectText">{{ui.searchErrorText}}</p>
                            </div>
                        </v-layout>
                    </div>
                </v-layout> 
            </v-flex>            
        </v-layout>
   </v-container>
</template>
<script>
import {mapGetters} from 'vuex'
import TreeView from '@/commons/TreeView.vue'
import Selector from '@/commons/Selector'
export default {
    components: {TreeView, Selector},
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
                searchErrorText: this.$t(`realtime.searchErrorText`)
            },

            datas: {
                tabItems: [
                    {
                        id: "realTimeTorque", 
                        title: this.$t(`realtime.tabItems.title.realTimeTorque`), 
                        overImg: require("@/images/subtabicons/subtab_realtimetorque_over.png"), 
                        normalImg: require("@/images/subtabicons/subtab_realtimetorque_normal.png"), 
                        path: "/sps/realtime/torque"
                    }
                ],
                robotInfos: {
                    selectedRobotInfo: {},
                    relationRobotInfo: {},
                },
            },
            flags: {
                robotSelectionFlag: false 
            }
        }
    },

    created() {
        this.initializeUI();
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters ({
            robotInfos: 'getRobotInfos',
            getTheme: 'getTheme'
        }),

        getRobotSearchImg() {
            if(this.getTheme === true) {
                return require("@/images/robot_search.png");
            } else {
                return require("@/images/robot_search_light.png");
            }
        },
    },

    methods: {
        initializeUI() {
            this.ui.activeClass = this.$style.realtime.realTimeItemActiveClass;
        },

        initializeStyle() {
            const realtimeContents = document.querySelector("#realtimeContents");
            realtimeContents.style.height = "905px";

            this.ui.tabsColor = this.$style.realtime.realTimeItemTabsColor; 
            this.ui.tabStyle.color = this.$style.realtime.realTimeItemTabStyleColor; 
            this.ui.tabStyle.backgroundColor = this.$style.realtime.realTimeItemTabStyleBackgroundColor;
            this.ui.tabsStyle.borderBottom = this.$style.realtime.realTimeItemTabsStyleBorderBottom;

            document.documentElement.style.setProperty("--robotSelectTextColor", this.$style.realtime.realTimeItemRobotSelectTextColor);
        },

         setIconHighLight(tabItem) {
            if(tabItem.path === window.location.pathname){
                return true;
            }
            else {
                return false;
            }
        },

        getNodeInfo(nodeInfo) {
            if(nodeInfo.robotid !== undefined) {
                this.flags.robotSelectionFlag = true;
                this.getRelationRobot(nodeInfo);
            }
            else {
                this.$popmsg(this.$t(`realtime.popMsg.selectedError`));
                this.flags.robotSelectionFlag = false;
                this.datas.robotInfos.selectedRobotInfo = {};
                this.datas.robotInfos.relationRobotInfo = {};
            }
        },

        getRelationRobot(nodeInfo) {
            this.robotInfos.forEach(robotInfo => {
                if(nodeInfo.zoneid === robotInfo.zone && nodeInfo.robotid === robotInfo.id) {
                    nodeInfo['robotname'] = robotInfo.name;
                    let relationRobotInfo = {};
                    if(robotInfo.id % 2 !== 0) {
                        this.robotInfos.forEach(findInfo => {
                            if(Number(robotInfo.id) + 1 === findInfo.id && this.checkRobotName(nodeInfo.robotname, findInfo.name)) {
                                relationRobotInfo = this.setRelationRobotInfo(nodeInfo, findInfo);
                            }
                        })
                    }  
                    else {
                        this.robotInfos.forEach(findInfo => {
                            if(Number(robotInfo.id) - 1 === findInfo.id && this.checkRobotName(nodeInfo.robotname, findInfo.name)) {
                                relationRobotInfo = this.setRelationRobotInfo(nodeInfo, findInfo);
                            }
                        })
                    }  
                    this.setRobotInfos(nodeInfo, relationRobotInfo);
                }
            });
        },

        checkRobotName(selectRobot, relationRobot) {
            let selectRobotWords = String(selectRobot).split('');
            let relationRobotWords = String(relationRobot).split('');
            if(selectRobotWords[0] !== relationRobotWords[0] && selectRobotWords[1] === relationRobotWords[1]) {
                return true;
            }
            else {
                return false;
            }
        },

        setRelationRobotInfo(selectRobot, findRobot) {
            let relationRobotInfo = {};
            relationRobotInfo['factoryid'] = selectRobot.factoryid;
            relationRobotInfo['boothid'] = selectRobot.boothid;
            relationRobotInfo['zoneid'] = selectRobot.zoneid;
            relationRobotInfo['robotid'] = findRobot.id;
            relationRobotInfo['robottype'] = findRobot.robottype;
            relationRobotInfo['robotname'] = findRobot.name;
            
            return relationRobotInfo;
        },

        setRobotInfos(selectedRobotInfo, relationRobotInfo) {
            this.datas.robotInfos.selectedRobotInfo = {};
            this.datas.robotInfos.relationRobotInfo = {};
            Object.assign(this.datas.robotInfos.selectedRobotInfo, selectedRobotInfo);
            Object.assign(this.datas.robotInfos.relationRobotInfo, relationRobotInfo);
        },
    }
}
</script>

<style scoped lang="scss">
   @import "./realtimeview";
</style>