<template>
    <v-layout column v-bind="[getActionReportDialogFlag, getActionReportSaveFlag]">
        <v-layout>
            <v-flex lg12 class="pl-2">
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.alarmCodeText}}</v-subheader>
                        <input v-if="alarmInfoData != undefined" class="inputField mr-2" :value="alarmInfoData.alarmcode" readonly/>
                        <input v-else class="inputField mr-2" :value="alarmCode" @input="setAlarmCode($event.target.value)"/>
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
                    <textarea class="inputContentField" :value="robotPrecautionActionContent" @input="setContent($event.target.value)"/>
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout>
            <v-flex lg12 class="pl-2">
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.tagText}}</v-subheader>
                        <input class="inputField mr-2" :value="robotPrecautionActionTag" @input="setTag($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex> 
        </v-layout>
    </v-layout>
</template>

<script>
export default {
    props: ['alarmInfoData', 'actionReportDialogFlag', 'actionReportSaveFlag'],
    data() {
        return {
            ui: {
                alarmCodeText: this.$t(`actionReport.RobotPrecautionActionContents.alarmCodeText`),
                contentsText: this.$t(`actionReport.RobotPrecautionActionContents.contentsText`),
                tagText: this.$t(`actionReport.RobotPrecautionActionContents.tagText`)
            },
            alarmCode: '',
            robotPrecautionActionContent: '',
            robotPrecautionActionTag: []
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
       getActionReportDialogFlag() {
           if(this.actionReportDialogFlag == false) {
               this.alarmCode = '';
               this.robotPrecautionActionContent = '';
               this.robotPrecautionActionTag = [];
           }
       },

       getActionReportSaveFlag() {
            if(this.actionReportSaveFlag == true) {
                for(let i = 0; i < this.robotPrecautionActionTag.length; i++) {
                    if(this.robotPrecautionActionTag[i] == '') {
                        this.robotPrecautionActionTag.splice(i,1);
                    }
                }
                if(this.alarmInfoData != undefined) {
                    this.$emit('robotPrecautionActionContentDatas', {alarmCode: this.alarmInfoData.alarmcode, actionContent: this.robotPrecautionActionContent, actionTag: this.robotPrecautionActionTag});
                } else {
                    this.$emit('robotPrecautionActionContentDatas', {alarmCode: this.alarmCode, actionContent: this.robotPrecautionActionContent, actionTag: this.robotPrecautionActionTag});
                }
                
            }
       }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--inputFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--inputFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--inputFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
            document.documentElement.style.setProperty("--inputContentFieldColor", this.$style.common.actionReportItemInputFieldColor);
            document.documentElement.style.setProperty("--inputContentFieldBackgroundColor", this.$style.common.actionReportItemInputFieldBackgroundColor);
            document.documentElement.style.setProperty("--inputContentFieldBorderColor", this.$style.common.actionReportItemInputFieldBorderColor);
        },
        setAlarmCode(alarmCode) {
            this.alarmCode = alarmCode;
        },

        setContent(actionContent) {
            this.robotPrecautionActionContent = actionContent;
        },

        setTag(actionTag) {
            this.robotPrecautionActionTag = actionTag.replace(' ', '').split(',');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './robotprecautionActionContents';
</style>
