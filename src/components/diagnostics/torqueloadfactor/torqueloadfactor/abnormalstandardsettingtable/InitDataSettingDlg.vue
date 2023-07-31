<template>
    <v-layout class="initDataSettingDlg" column v-bind="[getSaveSettingData, getAcceptFlag, getDialogFlag]">
        <v-form class="initDataSettingForm" v-for="(item, index) in items" :key="index" v-bind="setStdDatas">
            <v-layout class="initDataSettingForm">
                <v-subheader class="subHeader">{{item.label}}</v-subheader>
                <v-text-field
                    class="textField"
                    autocomplete="off"
                    autofocus
                    flat
                    solo
                    type="number"
                    :background-color="ui.backgroundColor"
                    v-model="item.text"
                ></v-text-field>
            </v-layout>
        </v-form>
    </v-layout>
</template>

<script>
export default {
    props: ['saveSettingData', 'acceptFlag', 'dialogFlag'],
    data() {
        return {
            checkFlag: true,
            stdDatas: {},
            items: [
                { label: this.$t(`diagnostics.torqueLoadFactor.child.initDataSettingDlg.items.summxv`), text: "" },
                // { label: this.$t(`diagnostics.torqueLoadFactor.child.initDataSettingDlg.items.summmv`), text: "" },
                { label: this.$t(`diagnostics.torqueLoadFactor.child.initDataSettingDlg.items.cycle`), text: "" },
            ],
            ui: {
                backgroundColor: ""
            }
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        setStdDatas() {
            this.stdDatas['maxsum'] = this.items[0].text;
            // this.stdDatas['minsum'] = this.items[1].text;
            this.stdDatas['workingtime'] = this.items[1].text;
        },

        getSaveSettingData() {
            for(let i = 0; i < this.saveSettingData.length; i++) {
                this.items[i].text = this.saveSettingData[i].value;
            }
        },

        getAcceptFlag() {
            if(this.acceptFlag == true) {
                if(this.stdDatas['maxsum'] != null && this.stdDatas['workingtime'] != null
                    && this.stdDatas['maxsum'] != '' && this.stdDatas['workingtime'] != ''
                ) {
                    // if(Number(this.stdDatas['maxsum']) >= Number(this.stdDatas['minsum'])) {
                        this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.child.initDataSettingDlg.popMsg.accept`));
                        this.$emit('changeSettingData', this.stdDatas);
                        this.$emit('changeDialogFlag');
                    // }
                    // else {
                    //     this.$popmsg(this.$t(`diagnostics.torqueLoadFactor.child.initDataSettingDlg.popMsg.checkInputData`));
                    // }
                }
                 this.$emit('changeAcceptFlag');
            }
        },

        getDialogFlag() {
            if(this.dialogFlag == false) {
                this.setInitData();
            }
        }
    },

    methods: {
        initializeStyle() {
            this.ui.backgroundColor = this.$style.diagnostics.initDataSettingDlgItemInputBackgroundColor;
            document.documentElement.style.setProperty("--dlgBackgroundColor", this.$style.diagnostics.initDataSettingDlgItemBackgroundColor);
            document.documentElement.style.setProperty("--subHeaderColor", this.$style.diagnostics.initDataSettingDlgItemColor);
            document.documentElement.style.setProperty("--inputBorderColor", this.$style.diagnostics.initDataSettingDlgItemInputBorderColor);

        },
        setInitData() {
            for(let i = 0; i < this.saveSettingData.length; i++) {
                this.items[i].text = this.saveSettingData[i].value;
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './initdatasettingdlg';
</style>
