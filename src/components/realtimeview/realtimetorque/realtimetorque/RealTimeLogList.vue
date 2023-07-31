<template>
    <div class="realTimeLogList" v-bind="getLogListDatas">
        <v-list class="logList" dense>
            <div v-for="(logItem, index) in datas.logItems" :key="index">
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title v-bind:style="setTextColor(logItem)">
                            {{setLogListInfo(logItem)}}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider/>
            </div>
        </v-list>
    </div>
</template>

<script>
export default {
    props: ['logListDatas'],
    data() {
        return {
            ui: {
                textColor: {
                    warning: this.$style.realtime.realTimeLogListItemListWarningColor,
                    violation: this.$style.realtime.realTimeLogListItemListViolationColor
                },
            },
            datas: {
                logItems: []
            }
        }
    },

    created() {},

    mounted() {
        this.initializeStyle();
    },

    computed: {
        getLogListDatas() {
            if(this.logListDatas.length > 0) {
                this.setLogItems(this.logListDatas);
            }
            else {
                this.initLogItems();
            }
        }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--realTimeLogListBackgroundColor", this.$style.realtime.realTimeLogListItemBackgroundColor);    
            document.documentElement.style.setProperty("--realTimeLogListBorderColor", this.$style.realtime.realTimeLogListItemBorderColor);
            document.documentElement.style.setProperty("--logListBackgroundColor", this.$style.realtime.realTimeLogListItemListBackgroundColor);
        },

        initLogItems() {
            this.datas.logItems = [];
        },

        setLogItems(logListDatas) {
            this.initLogItems();
            this.datas.logItems = logListDatas;
        },

        setLogListInfo(logItem) {
            let args = {
                robotName: this.getRobotName(logItem.robotid),
                timeStamp: logItem.timestamp
            };

            if(logItem.forwardwarning !== null || logItem.reversewarning !== null) {
                args['warning'] = logItem.forwardwarning !== null ? logItem.forwardwarning : logItem.reversewarning;
                return this.$t('realtime.child.realTimeLogList.logItemInfo.warning', args);
            }
            else if(logItem.forwardviolation !== null || logItem.reverseviolation !== null) {
                args['violation'] = logItem.forwardviolation !== null ? logItem.forwardviolation : logItem.reverseviolation;
                return this.$t('realtime.child.realTimeLogList.logItemInfo.violation', args);
            }
        },

        setTextColor(logItem) {
            if(logItem.forwardwarning !== null || logItem.reversewarning !== null) {
                return {
                    'color': this.ui.textColor.warning
                }
            }
            else if(logItem.forwardviolation !== null || logItem.reverseviolation !== null){
                return {
                    'color': this.ui.textColor.violation
                }
            }
        },

        getRobotName(robotId) {
            let robotName = '';
            this.$store.getters.getRobotInfos.forEach(robotInfo => {
                if(robotInfo.id === robotId) {
                    robotName = robotInfo.name;
                }
            })
            return robotName;
        }
    }
}
</script>

<style lang="scss" scoped>
   @import './realtimeloglist';
</style>