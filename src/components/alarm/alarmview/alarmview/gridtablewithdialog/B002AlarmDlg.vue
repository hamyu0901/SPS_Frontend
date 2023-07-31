<template>
    <v-card class="alarmDlg" v-bind="[getContentDatas, getDialogFlag]">
        <v-card-title class="justify-center">
            <v-layout>
                <v-flex md2/>
                <v-flex md5>
                    <v-layout class="justify-center tdText" column>
                        {{'FileName: ['+jobFileContent.fileName + ']'}}
                        <br>
                        {{ 'Date: [' +jobFileContent.date+ ']'}}
                    </v-layout>
                </v-flex>
                <v-flex md5>
                     <v-layout class="justify-center tdText" column>
                        {{'FileName: ['+changeJobFileContent.fileName +']'}}
                        <br>
                        {{ 'Date: [' +changeJobFileContent.date+ ']'}}
                    </v-layout>
                </v-flex>
            </v-layout>

        </v-card-title>
        <v-layout>
            <v-flex md2 class="pr-2">
                <v-card class="listArea" :max-height='spreadSheetCardHeight' :height="spreadSheetCardHeight">
                    <v-list class="listTile">
                        <v-list-tile 
                            class="tile tdText"
                            avatar
                            v-for="(listData, index) in listDatas" 
                            :key="index" 
                            :style="{backgroundColor:(index == listDataIndex ? ui.selectChangeListColor : ui.nonSelectChangeListColor )}"    
                            @click="listDataClicked(listData)"
                        >
                            <v-list-tile-content class="listContent">
                                <v-list-tile-title>{{listData.text}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
            <v-flex md10 class="pl-2">
                <v-card :color="subCardBackgroundColor">
                    <v-layout>
                        <code-table
                            class="codeTable"
                            v-bind:headerDatas="codeTableHeaderDatas"
                            v-bind:contentDatas="codeTableContentDatas"
                        ></code-table>
                    </v-layout>
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
import CodeTable from '@/components/alarm/alarmview/alarmview/gridtablewithdialog/b002alarmdlg/CodeTable'
export default {
    components: {CodeTable},
    props: ['contentDatas', 'dialogFlag'],
    data() {
        return {
            ui: {
                selectChangeListColor: this.$style.alarm.b002AlarmDlgItemSelectChangeListColor,
                nonSelectChangeListColor: this.$style.alarm.b002AlarmDlgItemNonSelectChangeListColor,
                closeText: this.$t(`alarmView.child.alarmViewData.close`)
            },
            cardTitle: '',
            subCardBackgroundColor: '',
            listDatas: [],
            listDataIndex: null,
            textAreaHeight: 600,
            spreadSheetCardHeight: 627,
            jobFileContent: {fileName: '', date: ''},
            changeJobFileContent: {fileName: '', date: ''},
            codeTableHeaderDatas: [
                {id: 'a_content', text: this.$t(`alarmView.child.B002AlarmDlg.beforeModify`), value: 'jobFileContent'},
                {id: 'b_content', text: this.$t(`alarmView.child.B002AlarmDlg.afterModify`), value: 'changeJobFileContent'}
            ],
            codeTableContentDatas: [],
        }
    },
    computed: {
        getContentDatas() {
            if(this.contentDatas.length != 0) {
                this.setListDatas(this.contentDatas);
            }
        },
        getDialogFlag() {
            if(this.dialogFlag == false) {
                this.listDatas = [];
                this.listDataIndex = null;
                this.codeTableContentDatas = [];
                this.jobFileContent = {fileName: '', date: ''};
                this.changeJobFileContent = {fileName: '', date: ''};
            }
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.subCardBackgroundColor = this.$style.alarm.b002AlarmDlgItemSubCardBackgroundColor;
            document.documentElement.style.setProperty("--alarmDlgBackgroundColor", this.$style.alarm.b002AlarmDlgItemAlarmDlgBackgroundColor);
            document.documentElement.style.setProperty("--listAreaBackgroundColor", this.$style.alarm.b002AlarmDlgItemListAreaBackgroundColor);
            document.documentElement.style.setProperty("--listTileBackgroundColor", this.$style.alarm.b002AlarmDlgItemListTileBackgroundColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
            document.documentElement.style.setProperty("--buttonItemBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonItemColor", this.$style.common.buttonItemColor);
        },
        setListDatas(contentDatas) {
            this.listDatas = [];
            for(let i = 0; i < contentDatas.length; i++) {
                this.listDatas.push({id: i, text: contentDatas[i].a_file});
            }
        },
        listDataClicked(listData) {
            for(let i = 0; i < this.contentDatas.length; i++) {
                if(this.contentDatas[i].a_file == listData.text) {
                    this.listDataIndex = i;
                    this.getCodeDatas(this.contentDatas[i]);
                    this.jobFileContent['fileName'] = this.contentDatas[i].a_file;
                    this.jobFileContent['date'] = this.contentDatas[i].a_time.replace('T', ' ').split('.')[0];
                    this.changeJobFileContent['fileName'] = this.contentDatas[i].b_file;
                    this.changeJobFileContent['date'] = this.contentDatas[i].b_time.replace('T', ' ').split('.')[0];
                }
            }
        },
        getCodeDatas(contentData) {
            this.codeTableContentDatas = [];
            let jobFileContent = this.base64Decode(contentData.a_content).split('\n');
            let changeJobFileContent = this.base64Decode(contentData.b_content).split('\n');
       
            for(let i = 0; i < jobFileContent.length; i++) {
                this.codeTableContentDatas.push({'jobFileContent': jobFileContent[i], 'changeJobFileContent': changeJobFileContent[i]});
            }
        },
        changeListColor(listData) {
            for(let i = 0; i < Object.keys(this.$refs).length; i++) {
                if(i == listData.id) {
                    this.$refs[i][0].$el.style.backgroundColor = this.$style.alarm.b002AlarmDlgItemSelectChangeListColor;
                } else {
                    if(this.$refs[i][0] != '') {
                        this.$refs[i][0].$el.style.backgroundColor = this.$style.alarm.b002AlarmDlgItemNonSelectChangeListColor;
                    }
                }
            }
        },
        base64Decode(base64text) {
            return Buffer.from(base64text, 'base64').toString('utf8');
        },
        closeDlg() {
            this.$emit('closeFlag');
        }
    }
}
</script>

<style scoped lang="scss">
    @import './b002alarmdlg';
</style>
