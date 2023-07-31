<template>
    <v-card class="text-xs-center gridTableCard" elevation="0" :color="ui.cardColor">
        <p class="pageText">{{ui.totalCount}} items </p>
        <v-data-table
            class="elevation-0 dataTable"
            hide-actions :headers="ui.headers"
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
                <tr @click="clickItemHandler(props.item)">
                    <td>{{ props.item.time_stamp}}</td>
                    <td>{{ props.item.alarm_type_name}}</td>
                    <td>{{ props.item.alarm_code}}</td>
                    <td>{{ props.item.alarm_name}}</td>
                    <td>{{ props.item.zone_name}}</td>
                    <td>{{ props.item.job_name}}</td>
                    <td>{{ props.item.robot_name}}</td>
                    <td v-if="props.item.level == '0'"><img src="@/images/img_alarm_low.png"/></td>
                    <td v-else-if="props.item.level == '1'"><img src="@/images/img_alarm_middle.png"/></td>
                    <td v-else-if="props.item.type_id !== 0 && props.item.level == '2'"><img src="@/images/img_alarm_high.png"/></td>
                    <td v-else-if="props.item.type_id == 0 && props.item.level == '2'"><img src="@/images/img_robot_alarm.png"/></td>
                    <td v-else></td>
                </tr>
            </template>
        </v-data-table>
    </v-card>
</template>
<script>
    export default {
    components: {
    },
    props:['headerData' ,'contentData'],
    data(){
        return{
            headers : '',
            ui: {
                headers: [],
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
        this.datas.tableData = this.contentData.length > 0 ? this.contentData : [{time_stamp: '', alarm_type_name: '', alarm_code: '', alarm_name: '', zone_name: '', robot_name: '', level: ''}]
        this.ui.headers = this.headerData
        this.ui.totalCount = this.contentData.length

    },

    watch :{
        contentData(){
            this.datas.tableData = this.datas.tableData = this.contentData.length > 0 ? this.contentData : [{time_stamp: '', alarm_type_name: '', alarm_code: '', alarm_name: '', zone_name: '', robot_name: '', level: ''}]
            this.ui.totalCount = this.contentData.length
        },
        headerData(){
            this.ui.headers = this.headerData
        }
    },
    methods: {
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
    @import './alarmselecttable';
</style>
</script>