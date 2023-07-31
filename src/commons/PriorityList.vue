<template>
    <v-card class="priorityListCard" elevation="0" v-bind="initialize" >
        <v-card-title :style="ui.tableHeaderStyle" class="priorityListTitle justify-center">{{priorityTitle}}</v-card-title>
        <v-data-table hide-actions :headers="priorityListTitle" :items="datas[itemNum]" :style="ui.tableDataStyle">
            <template slot="headers" slot-scope="props">
                <tr>
                    <th :style="ui.tableHeaderStyle" class="priority-list-header" v-for="(header, index) in props.headers" :key="index">
                        <div v-if="header.name == 'list'">
                            리스트 추가
                            <v-btn  @click="allRowClickBtn(datas, header)" icon>
                                <v-icon v-if="header.check == 'false'">mdi-checkbox-blank-outline</v-icon>
                                <v-icon v-if="header.check == 'true'">mdi-checkbox-outline</v-icon>
                            </v-btn>
                        </div>
                        <div v-else>{{ header.name }}</div>
                    </th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr>
                    <td v-if="screenType !== undefined" class="checkboxBtn">
                        <v-btn @click="rowClick(props, datas, priorityListTitle)" icon>
                            <v-icon v-if="(props.item.check == 'false')">mdi-checkbox-blank-outline</v-icon>
                            <v-icon v-if="(props.item.check == 'true')">mdi-checkbox-outline</v-icon>
                        </v-btn>
                    </td>
                    <td v-if="props.item.option != ''"><v-btn @click="itemClicked(props)" flat round outline  >{{ props.item.option}}</v-btn></td>
                    <td v-else>{{ props.item.option}}</td>
                    <td>{{ props.item.alarm_type_name}}</td>
                    <td>{{ props.item.alarm_name}}</td>
                    <td>{{ props.item.value}}</td>
                    <td>{{props.item.robot_name}}</td>
                    <td>{{ props.item.valueOption}}</td>
                    <!-- <td v-if ="props.item.valueOption == '상'"><img src="@/images/img_alarm_high.png"/></td> -->
                    <td v-if ="props.item.level == '상'"><img src="@/images/img_alarm_high.png"/></td>
                    <td v-else-if ="props.item.level == '중'"><img src="@/images/img_alarm_middle.png"/></td>
                    <td v-else-if="props.item.level == '하'"><img src="@/images/img_alarm_low.png"/></td>
                    <td v-else></td>
                </tr>
            </template>
        </v-data-table>
        <!-- <v-list class="priorityList">
            <v-list-tile class="priorityListTile pt-5" v-for="(data, index) in datas[itemNum]" :key="index">
                <v-list-tile-content class="tileContent">
                  <v-list-tile-title class="tileDatas">
                      <v-btn class="tileDatasBtn" flat round v-if="data.option != ''" @click="itemClicked(data)">{{data.option}}
                      </v-btn>
                    </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-avatar class="body-1 pt-1">{{data.value}}</v-list-tile-avatar>
                <v-list-tile-avatar class="body-1 pt-1">{{data.alarm_type_name}}</v-list-tile-avatar>
                <v-list-tile-avatar class="body-alarm-name pt-1">{{data.alarm_name}}</v-list-tile-avatar>
                <v-list-tile-avatar class="body-option pt-1" v-if="data.valueOption == '상'"><img src="@/images/img_alarm_high.png" style="width:25px; height:20px"/></v-list-tile-avatar>
                <v-list-tile-avatar class="body-option pt-1" v-else>{{data.valueOption}}</v-list-tile-avatar>
            </v-list-tile>
        </v-list> -->
        <v-layout class="priority_page_content">
            <div class="pt-1">
                <v-pagination
                    v-model="pagination.values"
                    :length="pages"
                    :total-visible="7"
                    :color="paginationColor"
                    @input="inputPage"

                ></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3 tdText">{{totalCount}} items in {{pageNum}} pages</p>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    props: ['priorityTitle', 'priorityDatas', 'dataValue','valueOption','option','priorityListTitle','paginationColor','screenType'],
    data() {
        return {
            ui: {
                tableHeaderStyle: null,
                tableDataStyle: ""
            },
            datas: [],
            pagination: {
                values: 1,
                rowsPerPage: 5,
            },
            pages: '',
            itemNum: 0,
            totalCount: 0,
            pageNum: 1,
        }
    },
    mounted() {
        this.initializeStyle();
        this.initDatas();
    },
    computed: {
        initialize() {
            this.getPriorityDatas();
            this.setPages();
        },
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
        },
        initDatas() {
            for (let i = 0; i < 5; i++) {
                this.datas.push({'option': '', 'value': '', 'valueOption': ''});
            }
        },
        getPriorityDatas() {
            // this.itemNum = 0;
            if (this.priorityDatas.length != 0) {
                this.datas = [];
                for (let i = 0; i < this.priorityDatas.length; i++) {
                    for (let j = 0; j < Object.keys(this.priorityDatas[i]).length; j++) {
                        if (Object.keys(this.priorityDatas[i])[j] != this.dataValue) {
                            this.datas.push({
                                'option': this.priorityDatas[i]['alarm_code'],
                                'value': this.priorityDatas[i]['zone_name'],
                                'valueOption': this.priorityDatas[i][this.valueOption],
                                alarm_type: this.priorityDatas[i]['alarm_type'],
                                alarm_name: this.priorityDatas[i]['alarm_name'],
                                alarm_type_name: this.priorityDatas[i]['alarm_type_name'],
                                check: this.priorityDatas[i]['check'],
                                level: this.priorityDatas[i]['level'],
                                zone_id: this.priorityDatas[i]['zone_id'],
                                robot_name: this.priorityDatas[i]['robot_name']
                                });
                            break;
                        }
                    }
                }
            }
            else {
                this.datas = [];
                for (let i = 0; i < 5; i++) {
                    this.datas.push({'option': '', 'value': '', 'valueOption': ''});
                }
            }
            let tempIndex = 0;
            let size = 5;
            let result = [];
            while(this.datas.length > 0){
                let sliced = this.datas.splice(0, size);
                 result.push(sliced.concat(
                    new Array(size - sliced.length).fill({'option': '', 'value': '', 'valueOption': ''})
                ))
            }
            this.datas = result;
            this.totalCount = this.priorityDatas.length
            this.pageNum = this.priorityDatas.length > 0 ? Math.ceil(this.priorityDatas.length / this.pagination.rowsPerPage) : 1
            // if(this.datas.length > 5){
            //     this.ui.tableDataStyle = 'height: 250px !important'
            // }else{
            //     this.ui.tableDataStyle = 'height: 100% !important'
            //     if(this.datas.length % 5 != 0){
            //         tempIndex = 5 - this.datas.length % 5;
            //         for(let i = 0; i < tempIndex; i++){
            //             // this.datas.push({option: '', value: '', valueOption: '', alarm_type: '', alarm_name: '', alarm_type_name: '', check: '', level: '', zone_id : ''})
            //             this.datas.push({option: '', value: '', valueOption: ''})
            //         }
            //     }
            // }
        },
        setPages(){
            if(this.priorityDatas.length > 0){
                this.pages = Math.ceil(this.priorityDatas.length / this.pagination.rowsPerPage)
            }else{
                this.pages = 1
            }
        },
        inputPage(itemNum){
            this.itemNum = itemNum-1
        },
        itemClicked(data) {
        //    this.$emit('selectedPriorityData', data);
        //    this.$emit('priorityFlag', this.priorityTitle);
            this.$emit('selectedPriorityData', data.item);
            this.$emit('priorityFlag', this.priorityTitle);
        },
        rowClick(row,datas){
            let header = null;
            // let temp = [];
            if(row.item.hasOwnProperty('check')){
                (row.item.check == 'true') ? row.item.check = 'false' : row.item.check = 'true'
            }
            let temp = datas.reduce(function (acc, cur) {
                return acc.concat(cur)
            })
            temp = temp.filter(el => el.hasOwnProperty('check'))
            if(this.isConfirmBoolean(temp)){
                header = 'true'
            }else{
                header = 'false'
            }
            this.$emit('selectedRowData', {
                data: row,
                header: header
            })
        },
        allRowClickBtn(rows, header){
            (header.check == 'true') ? header.check = 'false' : header.check = 'true'
            if(Array.isArray(rows)){
                rows.forEach(el => {
                    if(Array.isArray(el)){
                        el.forEach(item => {
                            if(item.hasOwnProperty('check')){
                                (header.check == 'true') ? item.check = 'true' : item.check = 'false'
                            }
                        })
                    }
                })
            }
            let temp = rows.reduce(function (acc, cur) {
                return acc.concat(cur)
            })
            if(rows[0][0].zone_id !== undefined){
                this.$emit('selectedAllRowData', {
                    data: temp,
                    check: header.check
                })
            }
        },
        isConfirmBoolean(arr2)  {
            let arr1 = (el) => el.check === 'true'
            if(arr2.every(arr1)){
                return true;
            }
            return false;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './prioritylist';
</style>
