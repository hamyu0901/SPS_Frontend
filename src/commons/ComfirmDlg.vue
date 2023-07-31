<template>
    <div v-bind="[getComfirmDlgFlag, getComfirmDlgType]">
        <v-dialog v-model="comfirmFlag" :width="ui.width" persistent>
            <v-card class="comfirmDlgBackgroundColor">
                <v-card-title class="comfirmDlgTitle">
                <span>{{ui.comfirmDlgTitle}}</span><br/>
                </v-card-title>
                <v-textarea
                    class="pr-3 pl-3"
                    v-if="comfirmDlgType == 'unCheck'"
                    auto-grow
                    filled
                    :value="ui.comfirmDlgContentText"
                    :readonly="true"
                ></v-textarea>
                <v-layout>
                    <v-spacer/>
                    <v-btn class="dialogBtn mr-1" @click="comfirmBtnClicked()">
                        {{ui.comfirmDlgComfirmText}}
                    </v-btn>
                    <v-btn class="dialogBtn ml-1" @click="closeBtnClicked()">
                        {{ui.comfirmDlgCloseText}}
                    </v-btn>
                </v-layout>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: ['comfirmDlgFlag', 'comfirmDlgType', 'comfirmDlgContents'],
    data() {
        return {
            comfirmFlag: false,
            ui: {
                width: "350px",
                comfirmDlgTitle: '',
                comfirmDlgContentText: '',
                comfirmDlgComfirmText: '',
                comfirmDlgCloseText: this.$t(`comfirmDlg.comfirmDlgCloseText`)
            }
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        getComfirmDlgFlag() {
            this.comfirmFlag = this.comfirmDlgFlag;
        },

        getComfirmDlgType() {
            this.ui.width = "350px";
            if(this.comfirmDlgType == "save") {
                this.ui.comfirmDlgTitle = this.$t(`comfirmDlg.comfirmDlgSaveTitle`);
                this.ui.comfirmDlgComfirmText = this.$t(`comfirmDlg.comfirmDlgComfirmSaveText`);
            } else if(this.comfirmDlgType == "delete") {
                this.ui.comfirmDlgTitle = this.$t(`comfirmDlg.comfirmDlgDeleteTitle`);
                this.ui.comfirmDlgComfirmText = this.$t(`comfirmDlg.comfirmDlgComfirmDeleteText`);
            } else if(this.comfirmDlgType == "update") {
                this.ui.comfirmDlgTitle = this.$t(`comfirmDlg.comfirmDlgUpdateTitle`);
                this.ui.comfirmDlgComfirmText = this.$t(`comfirmDlg.comfirmDlgComfirmUpdateText`);
            } else if(this.comfirmDlgType == "jobUpdate") {
                this.ui.comfirmDlgTitle = this.$t(`comfirmDlg.comfirmDlgJobUpdateTitle`);
                this.ui.comfirmDlgComfirmText = this.$t(`comfirmDlg.comfirmDlgComfirmJobUpdateText`);
            } else if(this.comfirmDlgType === 'change') {
                this.ui.comfirmDlgTitle = this.$t(`comfirmDlg.comfirmDlgChangeTitle`);
                this.ui.comfirmDlgComfirmText = this.$t(`comfirmDlg.comfirmDlgComfirmSaveText`);
            } else if(this.comfirmDlgType == 'unCheck') {
                this.ui.width = "350px";
                this.ui.comfirmDlgTitle = this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.Title`);
                this.ui.comfirmDlgContentText = this.renderMessage(this.comfirmDlgContents);
                this.ui.comfirmDlgComfirmText = this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.unCheckText`);
            } 
        }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--comfirmDlgBackgroundColor", this.$style.common.comfirmDlgItemBackgroundColor);
            document.documentElement.style.setProperty("--comfirmDlgTitleBackgroundColr", this.$style.common.comfirmDlgItemTitleBackgroundColor);
            document.documentElement.style.setProperty("--comfirmDlgButtonBackgroundColor", this.$style.common.comfirmDlgItemButtonBackgroundColor);
        },
        renderMessage(contents) {
            if(contents.hasOwnProperty('error')) {
                let message = "\n";
                if(contents.error.length > 1) {
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.processTitle`) + contents.booth[0] + ' - ' + contents.zone[0] + ' - ' + contents.robot[0] + '\n';
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.processTitle`) + contents.booth[1] + ' - ' + contents.zone[1] + ' - ' + contents.robot[1] + '\n';
                    message += contents.error[0] 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.conditionalTitle`) + contents.robot[0] 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.robotTypeTitle`) + contents.robotType[0] 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.IsTitle`)+ "\n";
                    message += contents.error[1] 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.conditionalTitle`) + contents.robot[1] 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.robotTypeTitle`) + contents.robotType[1] 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.IsTitle`)+ "\n";
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.contentsTitle`) + "\n";
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.dxControlText`);
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.releaseTitle`) + "\n";
                }
                else {
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.processTitle`) + contents.booth + ' - ' + contents.zone + ' - ' + contents.robot + '\n';
                    message += contents.error 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.conditionalTitle`) + contents.robot 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.robotTypeTitle`) + contents.robotType 
                            + this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.IsTitle`)+ "\n";
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.contentsTitle`) + "\n";
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.dxControlText`);
                    message += this.$t(`comfirmDlg.comfirmDlgComfirmUnCheck.renderMessage.releaseTitle`) + "\n";
                }
                return message;
            }
        },

        comfirmBtnClicked()  {
            this.$emit('comfirmFlag');
        },

        closeBtnClicked() {
            this.$emit('closeFlag');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './confirmdlg';
</style>
