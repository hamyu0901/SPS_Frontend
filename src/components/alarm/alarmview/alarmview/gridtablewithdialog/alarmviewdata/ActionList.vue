<template>
    <v-card class="actionListCard" v-bind="getActionListDatas">
        <v-card-title class="justify-center cardTitle">
            <span>{{ui.title}}</span>
            <v-spacer/>
            <v-btn class="actionReportAddBtn buttonItem" small @click="actionReportAddBtnClicked">{{ui.addText}}</v-btn>
        </v-card-title>
        <v-layout class="actionList">
            <v-expansion-panel>
                <v-expansion-panel-content class="expansionPanelTitle" v-for="(data, index) in datas" :key="index">
                <template slot="header">
                    <v-layout column>
                        <v-layout>
                            <span class="actionListTitle">{{data.action_title}}</span>
                            <v-spacer/>
                            <div class="pr-2 actionListSubTitle">
                                <span>{{'useful : '}}</span>
                                <span>{{data.useful_point}}</span>
                            </div>
                            <div class="actionListSubTitle">
                                <span>{{'date : '}}</span>
                                <span>{{data.time_stamp}}</span>
                            </div>
                        </v-layout>
                        <v-layout class="pt-1">
                            <v-chip
                                class="chips" 
                                :color="ui.chipTypeNameColor" 
                                :text-color="ui.chipTextColor" 
                                small 
                                disabled
                            >{{data.type_name}}</v-chip>
                            <v-chip 
                                class="chips" 
                                v-for="(tag, tagIndex) in data.tag"
                                :key="tagIndex"
                                :color="ui.chipColor" 
                                :text-color="ui.chipTextColor" 
                                small 
                                disabled
                            >{{tag}}</v-chip>
                        </v-layout>
                    </v-layout>
                </template>
                <v-card class="expansionPanelContent">
                    <v-layout column>
                        <v-layout>
                            <span class="pt-1 pl-2">{{'contents : '}}</span>
                            <v-spacer/>
                            <div class="pt-1">
                                <span>{{'user : '}}</span>
                                <span>{{data.user_id}}</span>
                            </div>
                            <v-btn
                                class="pl-3"
                                flat 
                                icon 
                                small 
                                :color="setStarIconColor(data.useful_exist)"
                                @click="starIconClicked(data, index)"
                            >
                                <v-icon :class="'starIcon'+index">thumb_up</v-icon>
                            </v-btn>
                            <span class="pt-1 pl-3 pr-2">{{data.useful_point}}</span>
                        </v-layout>
                        <v-card-text>
                            <v-layout column>
                                <div>
                                    <span>{{'title : '}}</span>
                                    <span>{{data.action_title}}</span>
                                </div>
                                <span>{{'contents : '}}</span>
                                <span>{{data.remedy_message}}</span>
                            </v-layout>
                        </v-card-text>
                    </v-layout>
                </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props:['alarmId','actionListDatas'],
    data() {
        return {
            ui: {
                title: this.$t(`alarmView.child.actionList.title`),
                addText: this.$t(`alarmView.child.actionList.add`),
                chipTypeNameColor: 'red',
                chipColor: 'primary',
                chipTextColor: 'white',
            },
            datas: [],
            starColor: '',
            starColors: {},
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters({
            baseUrl: 'getBaseUrl'
        }),

        getActionListDatas() {
            this.datas = [];
            this.starColors = {};
            this.datas = this.actionListDatas;
            for(let i = 0; i < this.datas.length; i++) {
                if(this.datas[i].useful_exist == 0) {
                    this.starColors[i] = "white";
                }else if(this.datas[i].useful_exist == 1) {
                    this.starColors[i] = "yellow";
                }
            }
        },
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--cardBackgroundColor", this.$style.alarm.actionListItemCardBackgroundColor);
            document.documentElement.style.setProperty("--cardItemBorderColor", this.$style.common.cardItemBorderColor);
            document.documentElement.style.setProperty("--cardTitleBackgroundColor", this.$style.alarm.actionListItemCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--expansionPanelTitleBackgroundColor", this.$style.alarm.actionListItemExpansionPanelTitleBackgroundColor);
            document.documentElement.style.setProperty("--expansionPanelContentBackgroundColor", this.$style.alarm.actionListItemExpansionPanelContentBackgroundColor);
            document.documentElement.style.setProperty("--expansionPanelBorderBottomColor", this.$style.alarm.actionListItemExpansionPanelBorderBottomColor);
            document.documentElement.style.setProperty("--expansionPanelSubTitleColor", this.$style.alarm.actionListItemExpansionPanelSubTitleColor);
        },

        actionReportAddBtnClicked() {
            this.$emit('actionReportAddFlag');
        },

        setStarIconColor(useful_exist){
            if(useful_exist == 0) {
                return 'white';
            }else if(useful_exist == 1) {
                return 'primary';
            }
        },

        starIconClicked(actionListData, index) {
            let postDatas = {};
            postDatas['actionid'] = actionListData.action_id;
            postDatas['alarmid'] = this.alarmId;
            if(actionListData.useful_exist == 0) {
                this.actionListDatas[index].useful_exist = 1;
                this.actionListDatas[index].useful_point = Number(this.actionListDatas[index].useful_point) + 1;
                this.$http.post(`${this.baseUrl}/alarmview/data/detail/alarm/userful/regist`, postDatas).then((result) => {
                }).catch((error) => {
                    this.$log.error(error);
                })
            } else if(actionListData.useful_exist == 1){
                this.actionListDatas[index].useful_exist = 0;
                this.actionListDatas[index].useful_point = Number(this.actionListDatas[index].useful_point) - 1;
                this.$http.post(`${this.baseUrl}/alarmview/data/detail/alarm/useful/release`, postDatas).then((result) => {
                }).catch((error) => {
                    this.$log.error(error);
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './actionlist';
</style>
