<template>
    <v-layout column>
        <p class="pb-3" :style="ui.titleStyle">{{ui.title}}</p>
        <v-treeview
            v-if="flag.openAllFlag == true"
            class="treeView"
            :active-class="ui.activeClass"
            :items="datas.factoryInfos"
            item-key="key"

            hoverable
            transition
            :active.sync="datas.selectedItems"
            :open-all="flag.openAllFlag"
        >
            <template slot="label" slot-scope="props" >
                <v-layout column @click="nodeClicked(props.item, props)">
                    <v-layout class="treeItem" align-center>
                        <a class="pt-1"><img :src="props.item.icon"></a>
                        <p class="pt-3 pl-4">{{ props.item.name }}</p>
                    </v-layout>
                </v-layout>
            </template>
        </v-treeview>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            ui: {
                factory: '',
                booth: '',
                zone: '',
                paintingRobot: '',
                sealingRobot: '',
                openerRobot: '',
                title: this.$t('treeview.title'),
                titleStyle: null,
                activeClass: ''
            },
            flag: {
                openAllFlag: false
            },
            datas: {
                factoryName: '',
                getFactoryId: '',
                factoryInfos: [],
                getBoothInfos: [],
                getZoneInfos: [],
                getRobotInfos: [],
                selectedItems: []
            }
        }
    },

    created() {
        this.getFactoryInfos();
        this.setThemeIcons();
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters ({
            getTheme: 'getTheme'
        }),
    },

    methods: {
        initializeStyle() {
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
             this.ui.activeClass = this.$style.common.treeViewItemActiveClass;
            document.documentElement.style.setProperty("--treeViewBackgroundColor", this.$style.common.treeViewItemTreeViewBackgroundColor);
        },

        async getFactoryInfos() {
            try {
                this.datas.getFactoryId = await this.getFactoryId();
                this.datas.factoryName = await this.getFactoryName(this.datas.getFactoryId);
                this.datas.getBoothInfos = await this.getBoothInfos(this.datas.getFactoryId);
                this.datas.getZoneInfos = await this.getZoneInfos(this.datas.getFactoryId);
                this.datas.getRobotInfos = await this.getRobotInfos(this.datas.getFactoryId);
                if(this.datas.getRobotInfos.length > 0) {
                    this.setFactoryDatas();
                }
            }
            catch(error) {
                this.$log.error(error);
            }
        },
        getFactoryId() {
            return new Promise((resolve, reject) => {
                this.$http.get(`/info/factorys`).then(result => {
                    resolve(result.data);
                })
            })
        },
        getFactoryName(factoryid) {
            return new Promise((resolve, reject) => {
                this.$http.post(`/info/factory`,{factoryid: factoryid}).then(result => {
                    resolve(result.data[0].factory_name);
                })
            })
        },
        getBoothInfos(factoryid) {
            return new Promise((resolve, reject) => {
                this.$http.post(`/info/booths`,{factoryid: factoryid}).then(result => {
                    resolve(result.data);
                })
            })
        },
        getZoneInfos(factoryid) {
            return new Promise((resolve, reject) => {
                this.$http.post(`/info/zones`,{factoryid: factoryid}).then(result => {
                    resolve(result.data);
                })
            })
        },
        getRobotInfos(factoryid) {
            return new Promise((resolve, reject) => {
                this.$http.post(`/info/robots`,{factoryid: factoryid}).then(result => {
                    resolve(result.data);
                })
            })
        },

        setThemeIcons() {
            if(this.getTheme === true) {
                this.ui.factory = require('@/images/treeviewicons/factory_dark.png');
                this.ui.booth = require('@/images/treeviewicons/booth_dark.png');
                this.ui.zone = require('@/images/treeviewicons/zone_dark.png');
                this.ui.paintingRobot = require('@/images/treeviewicons/painting_robot_dark.png');
                this.ui.sealingRobot = require('@/images/treeviewicons/sealing_robot_dark.png');
                this.ui.openerRobot = require('@/images/treeviewicons/opener_robot_dark.png');
            } else {
                this.ui.factory = require('@/images/treeviewicons/factory_light.png');
                this.ui.booth = require('@/images/treeviewicons/booth_light.png');
                this.ui.zone = require('@/images/treeviewicons/zone_light.png');
                this.ui.paintingRobot = require('@/images/treeviewicons/painting_robot_light.png');
                this.ui.sealingRobot = require('@/images/treeviewicons/sealing_robot_light.png');
                this.ui.openerRobot = require('@/images/treeviewicons/opener_robot_light.png');
            }
        },

        setFactoryDatas() {
            let factoryInfos = {};
            let key = 0;
            factoryInfos['name'] = this.datas.factoryName;
            factoryInfos['key'] = key;
            factoryInfos['id'] = this.datas.getFactoryId;
            factoryInfos['icon'] = this.ui.factory;
            factoryInfos['type'] = 'factory';
            factoryInfos['children'] = [];
            key += 1;
            this.setBoothtDatas(factoryInfos, key);
        },
        setBoothtDatas(factoryInfos, key) {
            this.datas.getBoothInfos.forEach((boothInfos, index) => {
                boothInfos['icon'] = this.ui.booth;
                boothInfos['key'] = key;
                boothInfos['children'] = [];
                boothInfos['type'] = 'booth';
                factoryInfos.children.push(boothInfos);
                key += 1;
            })
            this.setZoneDatas(factoryInfos, key);
        },
        setZoneDatas(factoryInfos, key) {
            factoryInfos.children.forEach(booth => {
                this.datas.getZoneInfos.forEach((zoneInfos, index) => {
                    if(booth.id == zoneInfos.booth) {
                        zoneInfos['key'] = key;
                        zoneInfos['type'] = 'zone';
                        zoneInfos['icon'] = this.ui.zone;
                        zoneInfos['children'] = [];
                        booth.children.push(zoneInfos);
                         key += 1;
                    }
                })
            })
            this.setRobotDatas(factoryInfos, key);
        },
        setRobotDatas(factoryInfos, key) {
            factoryInfos.children.forEach(booth => {
                booth.children.forEach(zone => {
                    this.datas.getRobotInfos.forEach((robotInfos, index) => {
                        if(zone.id == robotInfos.zone) {
                            robotInfos['key'] = key;
                            robotInfos['type'] = 'robot';
                            if(robotInfos.robottype === 0) {
                                robotInfos['icon'] = this.ui.openerRobot;
                            }
                            else if(robotInfos.robottype === 1) {
                                robotInfos['icon'] = this.ui.paintingRobot;
                            }
                            else {
                                robotInfos['icon'] = this.ui.sealingRobot;
                            }
                            zone.children.push(robotInfos);
                            key += 1;
                        }
                    })
                })
            })
            this.setFactoryInfos(factoryInfos);
        },
        setFactoryInfos(factoryInfos) {
            if(this.datas.factoryInfos.length < 1) {
                this.datas.factoryInfos.push(factoryInfos);
                this.flag.openAllFlag = true;
                this.nodeClicked(factoryInfos);
            }
        }, 
        nodeClicked(data) {
            this.setSelectedItems(data.key);
            this.$emit('nodeInfo', this.setNodeInfo(data));
        },
        setNodeInfo(data) {
            let nodeInfo = {};
            if(data.type === 'factory') {
                nodeInfo['factoryid'] = data.id;
            }
            else if(data.type === 'booth') {
                nodeInfo = this.setBoothNodeInfo(data);
            }
            else if(data.type === 'zone') {
                nodeInfo = this.setZoneNodeInfo(data);
            }
            else { // data.type === 'robot'
                nodeInfo = this.setRobotInfo(data);
            }
            return nodeInfo;
        },
        setBoothNodeInfo(data) {
            let boothNodeInfo = {};
            boothNodeInfo['factoryid'] = this.datas.getFactoryId;
            boothNodeInfo['boothid'] = data.id;
            return boothNodeInfo;
        },
        setZoneNodeInfo(data) {
            let zoneNodeInfo = {};
            zoneNodeInfo['factoryid'] = this.datas.getFactoryId;
            zoneNodeInfo['boothid'] = data.booth;
            zoneNodeInfo['zoneid'] = data.id;

            return zoneNodeInfo;
        },
        setRobotInfo(data) {
            let robotNodeInfo = {};
            robotNodeInfo['factoryid'] = this.datas.getFactoryId;
            this.datas.getZoneInfos.forEach(zoneInfo => {
                if(zoneInfo.id === data.zone) {
                    robotNodeInfo['boothid'] = zoneInfo.booth;
                }
            });
            robotNodeInfo['zoneid'] = data.zone;
            robotNodeInfo['robotid'] = data.id;
            robotNodeInfo['robottype'] = data.robottype;
            return robotNodeInfo;
        },
        setSelectedItems(key) {
            if(this.datas.selectedItems.length == 0) {
                this.datas.selectedItems = [key];
            }
            else if(this.datas.selectedItems.length > 0 && this.datas.selectedItems[0] != key) {
                this.datas.selectedItems = [key];
            }
        },
    }
}
</script>

<style scoped lang="scss">
    @import './treeview';
</style>