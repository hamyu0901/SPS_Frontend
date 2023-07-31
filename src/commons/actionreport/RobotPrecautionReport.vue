<template>
    <v-layout column v-bind="getAcceptReportFlag">
        <v-layout class="pt-2 pb-3">
            <v-flex lg9 class="pr-2 pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.titleText}}</v-subheader>
                        <input class="textField" :value="historyData.action_title" @input="setTitle($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex>
            <v-flex 1g3 class="pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.userIdText}}</v-subheader>
                        <input class="textField mr-2" :value="historyData.user_id" readonly/>
                    </v-layout>
                </v-form>   
            </v-flex>
        </v-layout>
        <v-layout class="pb-3">
            <v-flex lg12 class="pl-2">
                <v-form>
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.typeText}}</v-subheader>
                        <input class="textField mr-2" :value="historyData.type_name" readonly/>
                    </v-layout>
                </v-form>  
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex lg12 class="pl-2"> 
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.alarmCodeText}}</v-subheader>
                        <input class="textField mr-2" :value="historyData.ref_alarm_code" readonly/>
                    </v-layout>
                </v-form>   
            </v-flex>
        </v-layout>
        <v-layout class="pb-2 pl-2" column>
            <v-layout>
                <v-subheader class="subHeader">{{ui.contentsText}}</v-subheader>
            </v-layout>
            <v-layout>
                <v-flex lg1/>
                <v-flex lg11 class="mr-2">
                    <textarea class="textContentField" :value="historyData.remedy_message" @input="setRemedy($event.target.value)"/>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout>
            <v-flex lg12 class="pl-2">
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.tagText}}</v-subheader>
                        <input class="textField mr-2" :value="datas.tags" @input="setTag($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex> 
        </v-layout>
    </v-layout>
</template>

<script>
export default {
    props: ['historyData', 'acceptReportFlag'],
    data() {
        return {
            ui: {
                alarmCodeText: this.$t(`actionReport.RobotPrecautionReport.alarmCodeText`),
                contentsText: this.$t(`actionReport.RobotPrecautionReport.contentsText`),
                tagText: this.$t(`actionReport.RobotPrecautionReport.tagText`),
                titleText: this.$t(`actionReport.RobotPrecautionReport.titleText`),
                userIdText: this.$t(`actionReport.RobotPrecautionReport.userIdText`),
                typeText: this.$t(`actionReport.RobotPrecautionReport.typeText`),
                typeHintText: this.$t(`actionReport.RobotPrecautionReport.typeHintText`)
            },
            datas: {
                tags: ''
            }
        }
    },
    created() {
        this.getHistoryData();
    },
    mounted() {
        this.initializeStyle();
    },
    computed: {
        getAcceptReportFlag() {
            if(this.acceptReportFlag == true) {
                if(typeof this.datas.tags === 'string') {
                    this.datas.tags = this.datas.tags.replace(' ', '').split(',');
                }
                for(let i = 0; i < this.datas.tags.length; i++) {
                    if(this.datas.tags[i] == '') {
                        this.datas.tags.splice(i,1);
                    }
                }
                this.$emit('acceptRobotPrecautionReport', {
                    actionTitle: this.historyData.action_title,
                    actionContent: this.historyData.remedy_message, 
                    actionTag: this.datas.tags
                })
            }
        }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--textFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--textFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--textFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
            document.documentElement.style.setProperty("--textContentFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--textContentFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--textContentFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
        },

         getHistoryData() {
            if(this.historyData.tag != undefined) {
                this.datas.tags = '';
                for(let i = 0; i < this.historyData.tag.length; i++) {
                    if(i != this.historyData.tag.length - 1) {
                        this.datas.tags += this.historyData.tag[i] + ', ';
                    } else {
                        this.datas.tags += this.historyData.tag[i];
                    }
                }
            }
        },
        setTitle(title) {
            this.historyData.action_title = title;
            this.$emit('keyDown');
        },
        setRemedy(remedy) {
            this.historyData.remedy_message = remedy;
            this.$emit('keyDown');
        },
        setTag(tag) {
            this.datas.tags = tag.replace(' ', '').split(',');
            this.$emit('keyDown');
        },
    }
}
</script>

<style scoped lang="scss">
    @import "./robotprecautionreport";
</style>
