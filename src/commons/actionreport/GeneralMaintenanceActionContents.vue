<template>
    <v-layout column v-bind="[getActionReportDialogFlag, getActionReportSaveFlag]">
        <v-layout column class="pl-2">
            <v-layout>
                <v-subheader class="subHeader">{{ui.contentsText}}</v-subheader>
            </v-layout>
        </v-layout>
        <v-layout class="pb-2 pl-2">
             <v-flex lg1/>
            <v-flex lg11 class="mr-2">
                <textarea class="inputContentField" :value="generalMaintenanceActionContent" @input="setContent($event.target.value)"/>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex lg12 class="pl-2">
                <v-form class="actionForm">
                    <v-layout>
                        <v-subheader class="subHeader">{{ui.tagText}}</v-subheader>
                        <input class="inputField mr-2" :value="generalMaintenanceActionTag" @input="setTag($event.target.value)"/>
                    </v-layout>
                </v-form>   
            </v-flex> 
        </v-layout>
    </v-layout>
</template>

<script>
export default {
    props: ['actionReportDialogFlag', 'actionReportSaveFlag'],
    data() {
        return {
            ui: {
                contentsText: this.$t(`actionReport.GeneralMaintenanceActionContents.contentsText`),
                tagText: this.$t(`actionReport.GeneralMaintenanceActionContents.tagText`)
            },
            generalMaintenanceActionContent: '',
            generalMaintenanceActionTag: []
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        getActionReportDialogFlag() {
            if(this.actionReportDialogFlag == false) {

                this.generalMaintenanceActionContent = '';
                this.generalMaintenanceActionTag = [];
            }
        },

        getActionReportSaveFlag() {
            if(this.actionReportSaveFlag == true) {
                for(let i = 0; i < this.generalMaintenanceActionTag.length; i++) {
                    if(this.generalMaintenanceActionTag[i] == '') {
                        this.generalMaintenanceActionTag.splice(i,1);
                    }
                }
                this.$emit('generalMaintenanceActionContentDatas', {actionContent: this.generalMaintenanceActionContent, actionTag: this.generalMaintenanceActionTag});
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

        setContent(actionContent) {
            this.generalMaintenanceActionContent = actionContent;
        },

        setTag(actionTag) {
            this.generalMaintenanceActionTag = actionTag.replace(' ', '').split(',');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './generalmaintenanceactioncontents';
</style>
