<template>
    <div class="text-xs-center elevation-2" :color="cardColor" v-bind="getHeaderDatas, getContentDatas">
        <v-data-table
            class="spreadSheetTable"
            hide-actions
            :headers="headers"
            :items="datas"
            disable-initial-sort
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th>{{'/'}}</th>
                    <th v-for="(header, index) in props.headers" :key="index">{{ header.text }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :key="props.index" :style="{color: compareLinesColor(props)}">
                    <td class="text-xs-center lineNumber">{{props.index + 1}}</td>
                    <td class="text-xs-left codeArea" v-for="(header, index) in headers" :key="index" :style="{color: compareCodeLinesColor(props)}">{{ props.item[header.value]}}</td>
                </tr>
            </template>

        </v-data-table>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['headerDatas', 'contentDatas'],
    data() {
        return {
            cardColor: ``,
            headers: [],
            datas: []
        }
    },
    computed: {
        ...mapGetters ({
            getTheme: 'getTheme'
        }),
        getHeaderDatas() {
            if(this.headerDatas.length != 0) {
                this.headers = this.headerDatas;
            }
        },
        getContentDatas() {
            if(this.contentDatas.length != 0) {
                this.datas = [];
                this.datas = this.contentDatas;
                if(this.datas.length < 29) {
                    this.setTempDatas();
                } 
            } else {
                this.datas = [];
                this.initDatas();
            }   
        },
    },
    mounted() {
        this.initDatas();
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.cardColor = this.$style.alarm.codeTableItemCardColor;
            document.documentElement.style.setProperty("--spreadSheetTableBackgroundColor", this.$style.common.codeTableItemSpreadSheetTableBackgroundColor);
            document.documentElement.style.setProperty("--theadBackgroundColor", this.$style.alarm.codeTableItemTheadBackgroundColor);
            document.documentElement.style.setProperty("--theadBorderBottomColor", this.$style.alarm.codeTableItemTheadBorderBottomColor);
            document.documentElement.style.setProperty("--hoverBackgroundColor", this.$style.alarm.codeTableItemHoverBackgroundColor);
            document.documentElement.style.setProperty("--lineNumberBackgroundColor", this.$style.alarm.codeTableItemLineNumberBackgroundColor);
            document.documentElement.style.setProperty("--codeAreaBackgroundColor", this.$style.alarm.codeTableItemCodeAreaBackgroundColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
        },
        initDatas() {
            this.datas = [];
            let tempIndex = 0;
            let tempObj = {};
            for(let i = 0; i < this.headers.length; i++) {
                tempObj[this.headers.value] = '';
            }
            for(let i = 0; i < 29; i++) {
               this.datas.push(tempObj);
            }
        },
        compareCodeLinesColor(datas) {
            if(datas.item.jobFileContent != '' && datas.item.changeJobFileContent != '' && datas.item.undefined != '') {
                if(datas.item.jobFileContent != datas.item.changeJobFileContent) {
                    return 'red';
                } else {
                    return 'black';
                }
            }
        },
        compareLinesColor(datas) {
            if(datas.item.jobFileContent != '' && datas.item.changeJobFileContent != '' && datas.item.undefined != '') {
                if(datas.item.jobFileContent != datas.item.changeJobFileContent) {
                    return 'red';
                } else {
                    return 'white';
                }
            }
        },
        setTempDatas() {
            let tempIndex = 0;
            let tempObj = {};
            for(let i = 0; i < this.headers.length; i++) {
                tempObj[this.headers[i].value] = '';
            }
           
            tempIndex = 29 - this.datas.length;
            for(let i = 0; i < tempIndex; i++) {
                this.datas.push(tempObj);
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './codetable';
</style>
