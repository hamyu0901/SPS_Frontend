<template>
    <v-card class="text-xs-center gridTableCard" elevation="0" :color="ui.cardColor" v-bind="initialize">
        <p class="pageText">{{ui.totalCount}} items </p>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions :headers="headers"
            :items="datas.tableData"
            :style="ui.tableDataStyle"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" v-for="header in props.headers" :key="header.value">
                        {{ header.text }}
                        <v-btn icon small @click="clickSortBtn(header)" class="sortBtn">
                            <v-icon v-if="header.sort">mdi-arrow-up-thin</v-icon>
                            <v-icon v-else>mdi-arrow-down-thin</v-icon>
                        </v-btn>
                    </th>
                </tr>
            </template>
            <template v-slot:items="props">
                <tr @click="clickItemHandler(props.item)" >
                    <td>{{ props.item.time_stamp}}</td>
                    <td>{{ props.item.alarm_type_name}}</td>
                    <td>{{ props.item.alarm_code}}</td>
                    <td>{{ props.item.alarm_name}}</td>
                    <td>{{ props.item.zone_name}}</td>
                    <td>{{ props.item.job_name}}</td>
                    <td :class="[`td-${props.item.disp_alarm_axis ? 'highlight' : ''}`]">{{ props.item.robot_name}}</td>
                    <td><img :src="props.item.level"/></td>
                </tr>
            </template>
        </v-data-table>
    </v-card>
</template>
<script>

export default {
    components: {
    },
    props:['headerData' ,'contentData','bindingCatch'],
    data(){
        return{
            headers : '',
            ui: {
                tableHeaderStyle: null,
                cardColor: '',
                tableDataStyle: '',
                selected: [],
                totalCount: 0
            },
            datas : {
                tableData: [],
            }
        }
    },
    created() {
        this.initDataTable();
    },
    mounted() {
        this.initializeStyle();
    },
    computed: {
        initialize() {
            this.getHeaderData();
            this.getContentData();
        },
    },
    watch :{
        bindingCatch(){
            this.getContentData()
        }
    },
    methods: {
        getHeaderData() {
            if(this.headerData.length != 0) {
                this.headers = this.headerData;
            }
        },
        getContentData(){
            if (this.contentData.length !== 0) {
                if (this.contentData !== this.datas.tableData) {
                    this.datas.tableData = [];
                    this.datas.tableData = this.contentData;
                }
            } else {
                this.datas.tableData = [];
                this.initDataTable();
            }
            this.ui.totalCount = this.contentData.length
            if(this.datas.tableData.length > 9){
                this.ui.tableDataStyle = 'height: 400px !important'
            }else{
                this.ui.tableDataStyle = 'height: 100% !important'
            }
        },
        initializeStyle() {
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            this.ui.cardColor = this.$style.common.gridTableItemCardColor;
            document.documentElement.style.setProperty("--tableCardTopColor", this.$style.common.tableCardTopColor);
            document.documentElement.style.setProperty("--tableTheadBackgroundColor", this.$style.common.tableTHeadBGColor);
            document.documentElement.style.setProperty("--tableTheadBorderBottomColor", this.$style.common.tableTHeadBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBackgroundColor", this.$style.common.tableTBodyOddBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrOddBorderBottomColor", this.$style.common.tableTBodyOddBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBackgroundColor", this.$style.common.tableTBodyEvenBGColor);
            document.documentElement.style.setProperty("--tableTBodyTrEvenBorderBottomColor", this.$style.common.tableTBodyEvenBBColor);
            document.documentElement.style.setProperty("--tableTBodyTrBackgroundColor", this.$style.common.tableTBodyHoverColor);
            document.documentElement.style.setProperty("--tableTBodyPaginationItem", this.$style.common.tablePaginationColor);
            document.documentElement.style.setProperty("--tdTextColor", this.$style.home.boothMonitoringCardItemTdColor);
            document.documentElement.style.setProperty("--dataTableBorderBottomColor", this.$style.common.gridTableItemBorderBottomColor);
            document.documentElement.style.setProperty("--gridTableCardBorderColor", this.$style.common.cardItemBorderColor);
        },
        initDataTable() {
            if (this.datas.tableData.length == 0 && this.headerData != '') {
                let tempObj = {};
                for (let i = 0; i < this.headerData.length; i++) {
                    tempObj[this.headerData[i].value] = '';
                }
                this.datas.tableData.push(tempObj)
                for (let i = 0; i < Object.keys(this.$refs).length; i++) {
                    if (i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemOddBackgroundColor;
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = this.$style.common.gridTableItemEvenBackgroundColor;
                    }
                }
            }
        },
        clickSortBtn(header){
            header.sort = header.sort ? false : true
            const sortData = (header, value) => {
                this.datas.tableData.sort(function (a,b) {
                    if(a[value] !== ''){
                        if(header.sort){
                            return a[value] < b[value] ? - 1: 1
                        }
                        else{
                            return a[value] > b[value] ? - 1: 1
                        }
                    }
                })
            }
            switch(header.value){
                case 'time_stamp' :
                    sortData(header, 'time_stamp')
                break;
                case 'alarm_type_name' :
                    sortData(header, 'alarm_type_name')
                break;
                case 'alarm_code' :
                    sortData(header, 'alarm_code')
                break;
                case 'alarm_name' :
                    sortData(header, 'alarm_name')
                break;
                case 'zone_name' :
                    sortData(header, 'zone_name')
                break;
                case 'robot_name' :
                    sortData(header, 'robot_name')
                break;
                case 'level' :
                    sortData(header, 'level')
                break;
            default:
            }
        },

        clickItemHandler(item) {
            this.$emit('clickedItem', item);
        }
    }
}
</script>
<style lang="scss" scoped>
    @import './alarmlisttable';
</style>