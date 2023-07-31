<template>
    <div class="text-xs-center elevation-2" :color="cardColor" v-bind="getHeaderDatas, getContentDatas, getDialogFlag">
        <v-data-table
            class="spreadSheetTable"
            hide-actions
            :headers="headers"
            :items="datas"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th>{{'/'}}</th>
                    <th class="tdText" v-for="(header, index) in props.headers" :key="index">{{ header.text }}</th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index"  @click="itemClicked(props)" :key="props.index">
                    <td class="text-xs-center tdText">{{props.index + 1}}</td>
                    <td class="text-xs-center tdText" v-for="header in headers" :key="header.value">{{ props.item[header.value]}}</td>
                </tr>
            </template>

        </v-data-table>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['headerDatas', 'contentDatas', 'dialogFlag'],
    data() {
        return {
            cardColor: '',
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
                this.datas = this.contentDatas;
                if(this.datas.length < 20) {
                    this.setTempDatas();
                }
            }
        },
        getDialogFlag() {
            if(this.dialogFlag == false) {
                this.defaultRowHighLight();
            }
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.cardColor = this.$style.common.spreadSheetTableItemCardColor;
            document.documentElement.style.setProperty("--spreadSheetTableBackgroundColor", this.$style.common.spreadSheetTableItemSpreadSheetTableBackgroundColor);
            document.documentElement.style.setProperty("--theadBackgroundColor", this.$style.common.gridTableItemTheadBackgroundColor);
            document.documentElement.style.setProperty("--oddBackgroundColor", this.$style.common.gridTableItemOddBackgroundColor);
            document.documentElement.style.setProperty("--evenBackgroundColor", this.$style.common.gridTableItemEvenBackgroundColor);
            document.documentElement.style.setProperty("--paginationBackgroundColor", this.$style.common.gridTableItemPaginationBackgroundColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
        },
        itemClicked(selectedDatas) {
            if(selectedDatas.item.a_file != null || selectedDatas.item.b_file != null) {
                this.rowHighLight(selectedDatas.index);
                this.$emit('selectedDatas', selectedDatas.item);
            }
        },

        setTempDatas() {
            let tempIndex = 0;
            let tempObj = {};
            let headerKeys = Object.keys(this.headers[0]);
            for(let i = 0; i < headerKeys.length; i++) {
                tempObj[headerKeys[i]] = null;
            }

            tempIndex = 20 - this.datas.length;
            for(let i = 0; i < tempIndex; i++) {
               this.datas.push(tempObj);
            }
        },

        defaultRowHighLight() {
            for(let i = 0; i < Object.keys(this.$refs).length; i++) {
                if(this.getTheme == true) {
                    if(i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemOddBackgroundColor;
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemEvenBackgroundColor;
                    }
                }
            }
        },

        rowHighLight(index) {
            for(let i = 0; i <Object.keys(this.$refs).length; i++){
                if (Object.keys(this.$refs)[i] == index) {
                    this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.commmon.gridTableItemRowHighLightBackgroundColor;
                } else{
                    if(i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemOddBackgroundColor;
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemEvenBackgroundColor;
                    }
                }
            }
        },
    }
}
</script>

<style scoped lang="scss">
    @import './spreadsheettable';
</style>
