<template>
    <v-card class="alarmDlg" v-bind="[getHeaderDatas, getContentDatas, getDialogFlag]">
        <v-card-title class="justify-center">
            <v-layout>
                <v-flex md4/>
                <v-flex md8>
                    <v-layout class="justify-center">
                        {{cardTitle}}
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-layout>
            <v-flex md4 class="pr-2">
                <v-card class="spreadSheet" :max-height='spreadSheetCardHeight'>
                    <spread-sheet-table
                        v-bind:headerDatas="headers"
                        v-bind:contentDatas="datas"
                        v-bind:dialogFlag="dialogFlag"
                        v-on:selectedDatas="getSelectedDatas"
                    ></spread-sheet-table>
                </v-card>
            </v-flex>
            <v-flex md8 class="pl-2">
                <v-card :color="subCardBackgroundColor">
                    <v-textarea box readonly :height="textAreaHeight" :value="jobFileContent"></v-textarea>
                </v-card>
            </v-flex>
        </v-layout>
        <v-card-actions>
            <v-spacer/>
            <v-btn class="buttonItem" @click="closeDlg">
                {{ui.closeText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import SpreadSheetTable from '@/commons/SpreadSheetTable'
export default {
    components: {SpreadSheetTable},
    props: ['headerDatas', 'contentDatas', 'dialogFlag'],
    data() {
        return {
            ui: {
                closeText: this.$t(`alarmView.child.alarmViewData.close`)
            },
            cardTitle: '',
            subCardBackgroundColor: '',
            headers: [],
            datas: [],
            textAreaHeight: 600,
            spreadSheetCardHeight: 627,
            jobFileContent: ''
        }
    },
    computed: {
        getHeaderDatas() {
            if(this.headerDatas.length != 0) {
                this.headers = this.headerDatas;
            }
        },

        getContentDatas() {
            if(this.contentDatas.length != 0) {
                this.datas = this.contentDatas;
            }
        },

        getDialogFlag() {
            if(this.dialogFlag == false) {
                this.defaultCardTitle();
                this.jobFileContent = '';
            }
        }
    },
    created() {
        this.defaultCardTitle();
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.subCardBackgroundColor = this.$style.alarm.b001AlarmDlgItemSubCardBackgroundColor;
            document.documentElement.style.setProperty("--alarmDlgBackgroundColor", this.$style.alarm.b001AlarmDlgItemAlarmDlgBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemColor", this.$style.common.buttonItemColor);
        },
        getSelectedDatas(selectedDatas) {
            this.jobFileContent = '';
            this.setCardTitle(selectedDatas);
            if(selectedDatas.a_file != null) {
                this.jobFileContent = this.base64Decode(selectedDatas.a_content);
            } else if(selectedDatas.b_file != null) {
                this.jobFileContent = this.base64Decode(selectedDatas.b_content);
            }
        },

        base64Decode(base64text) {
            return Buffer.from(base64text, 'base64').toString('utf8');
        },

        defaultCardTitle() {
            this.cardTitle = '';
            this.cardTitle += this.$t(`alarmView.child.B001AlarmDlg.workFile`) + "[.JBI] Contents"
        },

        setCardTitle(selectedDatas) {
            this.cardTitle = '';
            if(selectedDatas.a_file != null) {
                this.cardTitle += this.$t(`alarmView.child.B001AlarmDlg.deleteWorkFile`) + '\n' + '[ ' + selectedDatas.a_file + ' ] Contents';  
            } else if(selectedDatas.b_file != null) {
                this.cardTitle += this.$t(`alarmView.child.B001AlarmDlg.addWorkFile`) + '\n' + '[ ' + selectedDatas.b_file + ' ] Contents';  
            }
        },

        closeDlg() {
            this.$emit('closeFlag');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './b001alarmdlg';
</style>
