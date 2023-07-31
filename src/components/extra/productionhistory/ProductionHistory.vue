<template>
    <div :class="['production']">
        <v-layout :class="['production__layout']">
            <v-flex class="pr-2" lg2>
                <date-picker
                    v-on:getDate="selectedStartDate"
                    v-bind:setDate="datas.selectedItems.startDate"
                ></date-picker>
            </v-flex>
            <v-flex class="pr-2" lg2>
                <date-picker
                    v-on:getDate="selectedEndDate"
                    v-bind:setDate="datas.selectedItems.endDate"
                ></date-picker>
            </v-flex>
            <v-flex lg2>
                <selector
                    :class="['production__layout-selector']"
                    v-bind:selectorTitle="$t(String(`selector.zone`))"
                    v-bind:selectorOptions="datas.zoneInfo"
                    v-bind:defaultValue="datas.zoneInfo[0]"
                    v-on:selectedTarget="selectedZoneInfo"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector
                    :class="['production__layout-selector']"
                    v-bind:selectorTitle="$t(String(`selector.robot`))"
                    v-bind:selectorOptions="datas.selectedRobotInfos"
                    v-on:selectedTarget="selectedRobotInfo"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector
                    :class="['production__layout-selector']"
                    v-bind:selectorTitle="$t(String(`selector.model`))"
                    v-bind:selectorOptions="datas.modelItems"
                    v-on:selectedTarget="selectedModelInfo"
                ></selector>
            </v-flex>
            <v-flex lg2>
                <selector
                    :class="['production__layout-selector']"
                    v-bind:selectorTitle="$t(String(`selector.color`))"
                    v-bind:selectorOptions="datas.colorItems"
                    v-on:selectedTarget="selectedColorInfo"
                ></selector>
            </v-flex>
            <v-spacer/>
            <v-btn class="smallBtn" color="primary" icon @click="clickSearchBtn"><v-icon>mdi-magnify</v-icon></v-btn>
        </v-layout>
        <loading-dlg :loading-flag="datas.isLoading" />
        <v-layout style="width: 100%; height: 400px" v-if="!isEmpty(datas.robotProductionChartItems)" column>
            <div :class="['production-title']">{{$t(String(`extra.child.production.chart-title`))}}</div>
            <mix-chart
                :chart-id="'robot-production-mix-chart'"
                :chart-items="datas.robotProductionChartItems"
                :value-type="'production'"
                :chart-axis-y-options="{ title: 'Column(ms)' }"
                :chart-axis-y2-options="{ title: 'FLOW(cc)'}"
            ></mix-chart>
        </v-layout>
        <v-layout column>
            <div :class="['production-title']">{{$t(String(`extra.child.production.title`))}}</div>
            <base-table
                v-show="!isEmpty(datas.productionTableItems)"
                :class="['production-table']"
                :style="!isEmpty(datas.robotProductionChartItems) ? 'height: 350px;' : 'height: 500px'"
                :header-items="datas.productionTableHeaderItems"
                :content-items="datas.productionTableItems"
                :has-initial-sort="false"
            >
            </base-table>
            <div v-if="isEmpty(datas.productionTableItems)" :class="['production-table-empty']">{{$t(String(`extra.child.production.msg.noData`))}}</div>
            <div v-show="!isEmpty(datas.resultTableItems)" :class="['production-title']">{{$t(String(`extra.child.production.result-title`))}} </div>
            <base-table
                v-show="!isEmpty(datas.resultTableItems)"
                :class="['production-table-result']"
                :header-items="datas.resultTableHeaderItems"
                :content-items="datas.resultTableItems"
                :has-initial-sort="false"
            >
            </base-table>
        </v-layout>
    </div>
</template>

<script>

import { mapGetters } from "vuex";
import { cloneDeep, isEmpty } from "lodash";
import {
    convertToProductionChartItems,
    getCalculateProductionValues,
    setProductionItems
} from "@/utils/extra/production-history";
import { getProductionInfoItemsAPI } from "@/api/extra/production-historyAPI";
import Selector from "@/commons/Selector.vue";
import DatePicker from '@/commons/DatePicker'
import BaseTable from "@/commons/basetable/BaseTable";
import LoadingDlg from "@/commons/LoadingDlg.vue";
import MixChart from "@/commons/chart/mixchart/MixChart.vue";

export default {
    components: {
        MixChart,
        LoadingDlg,
        Selector,
        DatePicker,
        BaseTable
    },
    data(){
        return{
            ui: {

            },
            datas: {
                isLoading: false,
                zoneInfo: [],
                robotInfo: [],
                modelItems: [],
                colorItems: [],
                selectedItems: {
                    startDate: null,
                    endDate: null,
                    zone_id: null,
                    robot_id: null,
                    model: null,
                    color: null
                },
                selectedRobotInfos:[],
                productionTableHeaderItems: [],
                productionTableItems:[],
                resultTableHeaderItems: [],
                resultTableItems: [],
                robotProductionChartItems: []
            }
        }
    },

    created(){

    },

    mounted(){
        this.initDate();
        this.initFactoryInfos()
    },

    computed:{
        ...mapGetters({
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
        })
    },

    watch: {},

    methods: {
        isEmpty,
        initDate() {
            const year = new Date().getFullYear();
            const month = String(new Date().getMonth() + 1).padStart(2, '0');
            const day = String(new Date().getDate()).padStart(2, '0');
            this.datas.selectedItems.startDate = `${year}-${month}-${day}`;
            this.datas.selectedItems.endDate = `${year}-${month}-${day}`;
        },

        initFactoryInfos() {
            this.datas.robotInfo = cloneDeep(this.getRenewRobotInfos);
            this.datas.zoneInfo = this.getRenewZoneInfos.map(zoneInfo => ({
                id: zoneInfo.zone_id,
                name: zoneInfo.zone_name,
                zone_no: zoneInfo.zone_no,
                booth_no: zoneInfo.disp_booth_id
            })).sort((a, b) => a.booth_no === b.booth_no ? a.zone_no - b.zone_no : a.booth_no - b.booth_no);
        },

        selectedStartDate(date) {
            this.datas.selectedItems.startDate = date && date
        },

        selectedEndDate(date) {
            this.datas.selectedItems.endDate = date && date
        },

        selectedZoneInfo(zoneItem) {
            this.datas.selectedItems.zone_id = zoneItem !== '' ? zoneItem.target : null;
            this.datas.selectedRobotInfos = this.datas.robotInfo.filter(robotInfo => robotInfo.zone_id === zoneItem.target).map(filteredRobotInfo => ({
                id: filteredRobotInfo.robot_id,
                name: filteredRobotInfo.robot_name,
                robot_no: filteredRobotInfo.robot_no
            })).sort((a, b) => a.robot_no - b.robot_no);
            this.datas.modelItems = Array.from({ length: 20 }, (_, index) => ({
                id: index,
                name: `Model${index}`
            }));
            this.datas.colorItems = Array.from({ length: 24 }, (_, index) => ({
                id: index,
                name: `Color${index}`
            }));
        },

        selectedRobotInfo(robotItem) {
            this.datas.selectedItems.robot_id = robotItem !== '' ? robotItem.target : null;
            this.datas.modelItems = Array.from({ length: 20 }, (_, index) => ({
                id: index,
                name: `Model${index}`
            }));
            this.datas.colorItems = Array.from({ length: 24 }, (_, index) => ({
                id: index,
                name: `Color${index}`
            }));
        },

        selectedModelInfo(modelItem) {
            this.datas.selectedItems.model = modelItem !== '' ? modelItem.target : null;
        },

        selectedColorInfo(colorItem) {
            this.datas.selectedItems.color = colorItem !== '' ? colorItem.target : null;
        },

        async clickSearchBtn() {
            this.datas.isLoading = true;
            this.datas.productionTableHeaderItems = [];
            this.datas.productionTableItems = [];
            this.datas.resultTableHeaderItems = [];
            this.datas.resultTableItems = [];
            this.datas.robotProductionChartItems = [];
            const { zone_id, robot_id, startDate, endDate, model, color } = this.datas.selectedItems;
            const productionResultItems = await getProductionInfoItemsAPI({
                zoneId: zone_id,
                robotId: robot_id,
                startDate: startDate,
                endDate: endDate,
                model: model,
                color: color
            });

            if(productionResultItems && !isEmpty(productionResultItems.data)){
                const productionItem = productionResultItems.data.map(item => item.item);
                if(!robot_id){
                    const filteredRobotInfos = this.datas.robotInfo.filter(robotInfo => robotInfo.zone_id === zone_id).sort((a, b) => a.robot_no - b.robot_no);
                    this.datas.productionTableHeaderItems = [
                        { text: 'MODEL', value: 'model', align: 'center', type: 'text' },
                        { text: 'Color', value: 'color', align: 'center', type: 'text' },
                        { text: 'Total Flow(cc)', value: 'total', align: 'center', type: 'text' },
                        ...filteredRobotInfos.map(robotInfo => ({
                            text: `${robotInfo.robot_name} Total Flow(cc)`,
                            value: `${robotInfo.robot_name}_flow`,
                            align: 'center',
                            type: 'text',
                        })),
                    ];
                    this.datas.productionTableItems = setProductionItems(productionResultItems.data).sort((a, b) => a.model === b.model ? a.color - b.color : a.model - b.model);

                }else {
                    this.datas.productionTableItems = productionItem;
                    this.datas.productionTableHeaderItems = productionResultItems.data[0].header.map((text) => ({
                        text,
                        value: text,
                        type: 'text',
                        align: 'center'
                    }));

                    this.datas.resultTableHeaderItems = [
                        { text: 'Result', value: 'result', type: 'text', align: 'center' },
                        { text: '', value: 'empty1', type: 'text', align: 'center' },
                        { text: '', value: 'empty2', type: 'text', align: 'center' },
                        ...this.datas.productionTableHeaderItems.slice(3)
                    ];

                    this.datas.resultTableItems = [
                        {
                            result: 'Average',
                            ...getCalculateProductionValues('average', productionItem),
                        },
                        {
                            result: 'SUM',
                            ...getCalculateProductionValues('sum', productionItem),
                        },
                        {
                            result: 'MAX',
                            ...getCalculateProductionValues('max', productionItem),
                        },
                        {
                            result: 'MIN',
                            ...getCalculateProductionValues('min', productionItem),
                        },
                    ];
                    if(robot_id && model && color){
                        const filteredProductionItem = productionItem.map(({ COLOR, MODEL, ...rest }) => rest);
                        this.datas.robotProductionChartItems = convertToProductionChartItems(filteredProductionItem);
                    }
                }
            }

            this.datas.isLoading = false;
        },
    }
}
</script>

<style lang="scss">
  @import "ProductionHistory";
</style>