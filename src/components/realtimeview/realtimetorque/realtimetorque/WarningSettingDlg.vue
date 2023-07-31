<template>
    <v-dialog
        v-bind="getWarningSettingDatas"
        v-model="warningSettingDlgFlag"
        :width="ui.dialog.width"
        persistent
    >
        <v-card class="warningSetDlgCard">
            <v-card-title class="warningSetDlgCardTitle pb-2" v-bind:style="ui.titleStyle">{{ui.dlgTitle}}</v-card-title>
            <div v-for="(settingItem, index) in datas.settingItems" :key="index">
                <v-layout class="pb-2">
                    <v-flex lg6 class="pl-3"><p class="settingTitles">{{settingItem.legend}}</p></v-flex>
                    <v-flex lg6 class="pr-3"><input class="settingInputs" v-model="settingItem.value"/></v-flex>
                </v-layout>
            </div>
            <v-card-actions>
                <v-spacer/>
                <v-btn
                    class="buttonItem"
                    @click="saveButtonClicked"
                >
                    {{ui.saveText}}
                </v-btn>
                <v-btn
                    class="buttonItem"
                    @click="closeDlgButtonClicked"
                >
                    {{ui.closeText}}
                </v-btn>
            </v-card-actions>
        </v-card>   
    </v-dialog>
</template>

<script>
export default {
    props: ['warningSettingDlgFlag','warningSettingDatas'],
    data() {
        return {
            ui: {
                dialog: {
                    width: ""
                },
                button: {
                    color: ""
                },
                titleStyle: null,
                dlgTitle: this.$t(`realtime.child.realTimeTorque.child.warningSettingDlg.dlgTitle`),
                saveText: this.$t(`realtime.child.realTimeTorque.child.warningSettingDlg.saveText`),
                closeText:this.$t(`realtime.child.realTimeTorque.child.warningSettingDlg.closeText`),
            },

            datas: {
                settingItems: [
                    {id: "forwardWarning", legend: this.$t(`realtime.legends.forwardWarning`), value: ""},
                    {id: "forwardViolation", legend: this.$t(`realtime.legends.forwardViolation`), value: ""},
                    {id: "reverseWarning", legend: this.$t(`realtime.legends.reverseWarning`), value: ""},
                    {id: "reverseViolation", legend: this.$t(`realtime.legends.reverseViolation`), value: ""}
                ],
                configs: {
                    maxConfig: 300,
                    minConfig: -300
                }
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
        getWarningSettingDatas() {
            if(this.warningSettingDatas.length > 0) {
               this.datas.settingItems.forEach(settingItem => {
                    this.warningSettingDatas.forEach(warningSettingData => {
                        if(settingItem.id === warningSettingData.id) {
                            settingItem.value = warningSettingData.value;
                        }
                    })
               })
            }
            else {
                this.datas.settingItems.forEach(settingItem => {
                    settingItem.value = "";
                })
            }
        }
    },

    methods: {
        initializeUI() {
            this.ui.dialog.width = 270;
            this.ui.button.color = "#237ffe";
        },

        initializeStyle() {
          
            this.ui.titleStyle = this.$style.common.titleObjectItemColor;
            document.documentElement.style.setProperty("--buttonItemBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemColor", this.$style.common.buttonItemColor);

            document.documentElement.style.setProperty("--warningSetDlgCardBackgroundColor", this.$style.realtime.warningSettingDlgItemBackgroundColor);
            document.documentElement.style.setProperty("--warningSetDlgCardColor", this.$style.realtime.warningSettingDlgItemColor);
            document.documentElement.style.setProperty("--warningSetDlgCardBorderColor", this.$style.realtime.warningSettingDlgItemBorderColor);
            document.documentElement.style.setProperty("--inputBackgroundColor", this.$style.realtime.warningSettingDlgItemInputBackgroundColor);
            document.documentElement.style.setProperty("--inputBorderColor", this.$style.realtime.torqueRangeDetailSetDlgItemInputBorderColor);
        },

        saveButtonClicked() {
            if(this.checkSettingItemValue() && this.compareSettingItemValue()) {
                this.$emit("warningValue", this.datas.settingItems);
            }
            else {
                this.$popmsg(this.$t(`realtime.child.realTimeTorque.child.warningSettingDlg.popMsg.inputError`));
            }
        },

        checkSettingItemValue() {
            let checkFlag = true;
            this.datas.settingItems.forEach(settingItem => {
                if(settingItem.value !== "" && this.checkSettingItemType(settingItem.value) && this.checkSettingItemRange(settingItem.value)) {
                    settingItem.value = Number(settingItem.value);
                }
                else {
                    checkFlag = false;
                }
            })
            return checkFlag;
        },

        checkSettingItemType(value) {
            const regex = /^(-?)[0-9]+$/;
            return regex.test(value);
        },

        checkSettingItemRange(value) {
            if(Number(value) >= this.datas.configs.minConfig && Number(value) <= this.datas.configs.maxConfig) {
                return true;
            }
            else {
                return false;
            }
        },

        compareSettingItemValue() {
            let compareFlag = true;

            if(!this.checkCompareValue('forward', this.datas.settingItems)) {
                compareFlag = false;
            } 
            else if(!this.checkCompareValue('reverse', this.datas.settingItems)) {
                compareFlag = false;
            }

            return compareFlag;
        },

        checkCompareValue(compareType, settingItems) {
            let checkCompareFlag = true;
            if(compareType === 'forward') {
                if(Number(settingItems[0].value) < 0 || Number(settingItems[1].value) < 0) {
                    checkCompareFlag = false;
                }
                else if(Number(settingItems[0].value) < Number(settingItems[1].value)) {
                    checkCompareFlag = false;
                }
            }
            else if(compareType === 'reverse') {
                if(Number(settingItems[2].value) > 0 || Number(settingItems[3].value) > 0) {
                    checkCompareFlag = false;
                }
                else if(Number(settingItems[2].value) > Number(settingItems[3].value)) {
                    checkCompareFlag = false;
                }
            }

            return checkCompareFlag;
        },

        closeDlgButtonClicked() {
            this.$emit("closeDlg");
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './warningsettingdlg';
</style>
