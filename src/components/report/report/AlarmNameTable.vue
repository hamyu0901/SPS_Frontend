<template>
    <v-card class="priorityListCard" >
        <v-card-title class="priorityListTitle justify-center" :style="ui.cardHeaderStyle" v-if="title">{{title}}</v-card-title>
        <v-data-table
            hide-actions
            :headers="datas.header"
            :items="datas.alarmNameData"
            :pagination.sync="pagination"
        >
            <template slot="headers" slot-scope="props">
                <tr>
                    <th v-for="(header, index) in datas.header" :key="index" :style="ui.tableHeaderStyle" class="priority-list-header">
                        {{ header.text }}
                        <v-btn v-if="!header.check" icon small @click="clickSortBtn(header,type)" class="sortBtn">
                            <v-icon v-if="header.sort">mdi-arrow-up-thin</v-icon>
                            <v-icon v-else>mdi-arrow-down-thin</v-icon>
                        </v-btn>
                        <v-btn v-if="header.check" icon>
                            <v-icon v-if="header.check == 'false'" @click="clickAllCheckBox(header, type)">mdi-checkbox-blank-outline</v-icon>
                            <v-icon v-if="header.check == 'true'" @click="clickAllCheckBox(header, type)">mdi-checkbox-outline</v-icon>
                        </v-btn>
                    </th>
                </tr>
            </template>
            <template v-slot:items="props">
                <tr :title="props.item.alarm_code">
                    <td v-if="props.item.hasOwnProperty('check')">
                        <v-btn icon >
                            <v-icon v-if="props.item.check == 'false'" @click="clickRowCheckBox(props.item, type)">mdi-checkbox-blank-outline</v-icon>
                            <v-icon v-if="props.item.check == 'true'" @click="clickRowCheckBox(props.item, type)">mdi-checkbox-outline</v-icon>
                        </v-btn>
                    </td>
                    <td v-if="type === 'robot'">{{props.item.alarm_code}}</td>
                    <td v-if="type === 'zone'">{{ props.item.alarm_type_name }}</td>
                    <td >
                        {{ props.item.alarm_name}}
                    </td>
                    <td >{{ props.item.zone_name }}</td>
                    <td  v-if="type === 'robot'">{{ props.item.robot_name }}</td>
                    <td >{{ props.item.sum }}</td>
                    <td v-if="props.item.level == 0 && props.item.level !== ''"><img src="@/images/img_alarm_low.png"/></td>
                    <td v-else-if="props.item.level == 1"><img src="@/images/img_alarm_middle.png"/></td>
                    <td v-else-if="props.item.level == 2"><img src="@/images/img_alarm_high.png"/></td>
                    <td v-else-if="props.item.level == ''"></td>
                </tr>
            </template>
        </v-data-table>
        <v-layout class="priority_page_content">
            <div class="pt-1">
                <v-pagination v-model="pagination.page" :length="pages"  :total-visible="7" :color="paginationColor"></v-pagination>
            </div>
            <v-spacer />
            <p v-if="!exportFlag" class="pt-3 pr-3 tdText">{{ui.totalCount}} items in {{pages}} pages</p>
        </v-layout>
    </v-card>

</template>
<script>
import { fromPairs, map } from 'lodash';
function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj
    }

    const result = Array.isArray(obj) ? [] : {}

    for (let key of Object.keys(obj)) {
        result[key] = deepClone(obj[key])
    }

    return result
}
export default {
    props: ['title','header','alarmNameData','type','exportFlag'],
    /** title : type: String / Table card title*/
    /** header : type: Array / Table Header */
    /** alarmNameData : type: Array / Table Data/
    /** type : type: String / 존, 로봇 판단*/
    components : {
    },
    data(){
        return {
            /** Pagination data */
           pagination: {
                values: 1,
                rowsPerPage: 5,
            },
            paginationColor: '#237ffe !important',
             /** Table style*/
            ui : {
                tableHeaderStyle: ';',
                cardColor: '',
                cardHeaderStyle: '',
                totalCount: 0,
            },
            datas: {
                /** Table data*/
                alarmNameData: [],
                /** Table header*/
                header: []
            }
        }
    },
    computed:{
        pages () {
            if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null)
            {
                return 0;
            }
            else {
                return Math.ceil(this.alarmNameData.length / this.pagination.rowsPerPage);
            }
        },
    },
    mounted(){
        this.initializeStyle()
        this.datas.header = this.header;
        this.datas.alarmNameData = this.initAlarmNameData(this.alarmNameData);
        this.setSum();
    },
    watch: {
        alarmNameData(val){
            this.datas.alarmNameData = this.initAlarmNameData(val);
            this.setSum();
        },
        header(){
            this.datas.header = this.header
        }
    },
    methods: {
        initializeStyle() {
            this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
            document.documentElement.style.setProperty("--priorityListBackgroundColor", this.$style.common.priorityListItemBackgroundColor);
            document.documentElement.style.setProperty("--priorityListTitleBackgroundColor", this.$style.common.priorityListItemTitleBackgroundColor);
            document.documentElement.style.setProperty("--priorityListColor", this.$style.common.priorityListItemColor);
            document.documentElement.style.setProperty("--priorityListButtonBorderColor", this.$style.common.priorityListItemButtonBorderColor);
            document.documentElement.style.setProperty("--priorityListButtonHoverColor", this.$style.common.priorityListItemButtonHoverColor);
            document.documentElement.style.setProperty("--priorityListActiveButtonBackgroundrColor", this.$style.common.priorityListItemButtonHoverBackgroundColor);
            document.documentElement.style.setProperty("--priorityListCardBorderColor", this.$style.common.cardItemBorderColor);
            document.documentElement.style.setProperty("--tableTBodyPaginationItem", this.$style.common.tablePaginationColor);
            this.ui.cardHeaderStyle = this.type == 'zone' ? 'color:white;' : 'color:#F66C1F;'
        },

        initAlarmNameData(items) {
            const emptyItemCount = items.length % this.pagination.rowsPerPage !== 0 ? this.pagination.rowsPerPage - (items.length % this.pagination.rowsPerPage) : (items.length > 0 ? 0 : 5);
            const headerItem = fromPairs(map(this.datas.header, ({ value }) => [value, '']));
            const emptyItems = Array.from({ length: emptyItemCount }, () => {
              return {...headerItem}
            })
            return items.concat(emptyItems);
        },

        setSum(){
            let sum = 0;
            if(this.datas.alarmNameData.length > 0){
                this.datas.alarmNameData.filter(el => el.alarm_type_name !== ('' || undefined)).forEach(item => {
                    sum += Number(item.sum)
                })
            }
            this.ui.totalCount = sum
        },
        clickItem(item){
            this.$emit('clickItem', item)
        },
        clickSortBtn(header){
            header.sort = header.sort ? false : true
            const sortData = (header, value) => {
                this.datas.alarmNameData.sort(function (a,b) {
                    if(a[value] !== ('' || undefined)){
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
                case 'alarm_code' :
                    sortData(header, 'alarm_code')
                break;
                case 'alarm_type' :
                    sortData(header,'alarm_type_name')
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
                    sortData(header,'level')
                break;
                case 'sum' :
                    this.datas.alarmNameData.sort(function (a,b) {
                        if(a.sum !== ''){
                            if(header.sort){
                                return Number(a.sum) < Number(b.sum) ? - 1: 1
                            }
                            else{
                                return  Number(a.sum) > Number(b.sum)  ? - 1: 1
                            }
                        }
                    })
                break;
            default:
            }
        },
        clickAllCheckBox(header, type){
            header.check = header.check === 'true' ? 'false' : 'true'
            if(header.check == 'true'){
                this.datas.alarmNameData.forEach(el => {
                    if(el.check !== ''){
                        el.check = 'true'
                    }
                })
            }else{
                this.datas.alarmNameData.forEach(el => {
                    if(el.check !== ('' || undefined)){
                        el.check = 'false'
                    }
                })
            }
            this.$emit('clickAllCheckBox', {
                checkbox: 'all',
                header: header,
                type : type,
                data : this.datas.alarmNameData
            })

        },
        clickRowCheckBox(item, type){
            let temp = [];
            let tempArr = [];
            temp = deepClone(this.datas.alarmNameData)
            item.check  = item.check === 'true' ? 'false' : 'true'
            if(type === 'zone'){
                temp.forEach(el => {
                    if(el.alarm_code === item.alarm_code && el.alarm_name === item.alarm_name && el.type_id === item.type_id){
                        if(item.check == 'true'){
                            if(el.check !== ''){
                                el.check = 'true'
                            }
                        }else{
                            if(el.check !== ''){
                                el.check = 'false'
                            }
                        }
                    }
                })
            }
            else{
                temp.forEach(el => {
                    if(el.alarm_code === item.alarm_code && el.alarm_name === item.alarm_name && el.robot_id === item.robot_id){
                        if(item.check == 'true'){
                            if(el.check !== ''){
                                el.check = 'true'
                            }
                        }else{
                            if(el.check !== ''){
                                el.check = 'false'
                            }
                        }
                    }
                })
            }

            this.datas.alarmNameData = temp
            tempArr = deepClone(temp.filter(el => el.check !== ''))
            if(tempArr.every(el => el.check === 'true')){
                this.datas.header[0].check = 'true'
             }else{
                this.datas.header[0].check = 'false'
            }
            this.$emit('clickRowCheckBox', {
                checkbox: 'row',
                header : {
                    check: this.datas.header[0].check,
                },
                type : type,
                row : item,
                data : this.datas.alarmNameData
            })
        },
    }
}

</script>
<style lang="scss" scoped>
    @import './alarmnametable';
</style>
