<template>
    <v-layout :class="['vin-no-production-history']">
        <v-layout :class="['vin-no-production-history__filter']">
            <v-flex lg2 md2 xs2 :class="['vin-no-production-history__filter-search']">
                <date-picker
                  :class="['vin-no-production-history__filter-search-item']"
                  :set-date="datas.date"
                  @getDate="getDate"
                />
            </v-flex>
            <v-flex lg2 md2 xs2 :class="['vin-no-production-history__filter-search']">
                <span :class="['vin-no-production-history__filter-search-title']">{{datas.searchTitle}}</span>
                <input-message :class="['vin-no-production-history__filter-search-item']" @targetValue="getVinNo" />
            </v-flex>
            <v-btn :class="['vin-no-production-history__filter-search-button']" color="primary" icon @click="searchBtnClickHandler"><v-icon>mdi-magnify</v-icon></v-btn>
        </v-layout>
        <v-layout :class="['vin-no-production-history__chart']">
            <span :class="['vin-no-production-history__chart-title']">{{datas.chartTitle}}</span>
            <mix-chart
              :chart-id="'vin-no-production-chart'"
              :chart-items="datas.productionChartItems"
              :value-type="'production'"
              :chart-axis-y-options="{ title: 'Column(ms)' }"
              :chart-axis-y2-options="{ title: 'FLOW(cc)' }"
            ></mix-chart>
        </v-layout>
        <v-layout :class="['vin-no-production-history__contents']">
            <v-card :class="['vin-no-production-history__contents-summary', 'elevation-0']">
                <v-card-title :class="['vin-no-production-history__contents-summary-title']">{{datas.summaryTitle}}</v-card-title>
                <v-card-text :class="['vin-no-production-history__contents-summary-empty']" v-if="datas.productionItems.length === 0">
                    <P>{{datas.emptyTitle}}</P>
                </v-card-text>
                <v-card-text :class="['vin-no-production-history__contents-card-items']" v-if="datas.productionItems.length > 0">
                    <production-info-board :header-items="datas.productionSummaryHeaderItems" :contents-items="datas.productionSummaryContentsItems"/>
                </v-card-text>
            </v-card>
            <v-card :class="['vin-no-production-history__contents-card', 'elevation-0']">
                <v-card-title :class="['vin-no-production-history__contents-card-title']">{{datas.contentsTitle}}</v-card-title>
                <v-card-text :class="['vin-no-production-history__contents-card-empty']" v-if="datas.productionItems.length === 0">
                    <P>{{datas.emptyTitle}}</P>
                </v-card-text>
                <v-card-text :class="['vin-no-production-history__contents-card-items']" v-if="datas.productionItems.length > 0">
                    <v-layout :class="['vin-no-production-history__contents-card-items-item']" v-for="(boothInfo, boothInfoIndex) in boothInfos" :key="'boothInfo'+boothInfoIndex">
                        <span :class="['vin-no-production-history__contents-card-items-item-title']">{{boothInfo.booth_name}}</span>
                        <v-layout :class="['vin-no-production-history__contents-card-items-item-board']" v-for="(zoneInfo, zoneInfoIndex) in setZoneInfo(boothInfo.booth_id)" :key="'zoneInfo' + zoneInfoIndex" column>
                            <production-info-board :title="zoneInfo.zone_name" :header-items="convertToProductionHeaderItems(zoneInfo.zone_id, datas.productionItems)" :contents-items="convertToProductionContentsItems(zoneInfo.zone_id, datas.productionItems)"/>
                        </v-layout>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-layout>
    </v-layout>
</template>
<script>
import { mapGetters } from "vuex";
import DatePicker from "@/commons/DatePicker.vue";
import InputMessage from "@/commons/InputMessage.vue";
import { getProductionItemsAPI } from "@/api/extra/vinNoProductionHistoryAPI";
import { isEmpty } from "lodash";
import ProductionInfoBoard from "@/components/extra/vinnoproductionhistory/productioninfoboard/ProductionInfoBoard.vue";
import MixChart from "@/commons/chart/mixchart/MixChart.vue";

export default {
    components: {MixChart, ProductionInfoBoard, InputMessage, DatePicker},
    data: (vm) => ({
        datas: {
            searchTitle: vm.$t(`extra.child.vin-no-production-history.searchTitle`),
            chartTitle: vm.$t(`extra.child.vin-no-production-history.chartTitle`),
            summaryTitle: vm.$t(`extra.child.vin-no-production-history.summaryTitle`),
            contentsTitle: vm.$t(`extra.child.vin-no-production-history.contentsTitle`),
            emptyTitle: vm.$t(`extra.child.vin-no-production-history.emptyTitle`),
            date: vm.$moment().format('YYYY-MM-DD'),
            vinNo: '',
            vinNoStr: '',
            productionItems: [],
            productionSummaryHeaderItems: [],
            productionSummaryContentsItems: [],
            productionChartItems: []
        }
    }),
    computed: {
      ...mapGetters({
        boothInfos: 'getRenewBoothInfos',
        zoneInfos: 'getRenewZoneInfos',
        robotInfos: 'getRenewRobotInfos'
      }),
      setZoneInfo() {
        return (boothId) => {
          return this.zoneInfos.filter(zoneInfo => zoneInfo.disp_booth_id === boothId);
        }
      },
    },
    methods: {
        getDate(date) {
          this.datas.date = this.$moment(date).format('YYYY-MM-DD');
        },
        getVinNo(vinNo) {
            this.datas.vinNo = vinNo;
        },
        async searchBtnClickHandler() {
            if ( !isEmpty(this.datas.vinNo) && !isEmpty(this.datas.date) ) {
                // TODO: validation 체크 구체화
                const result = await getProductionItemsAPI({vinNo: this.datas.vinNo, date: this.datas.date});
                this.datas.productionItems = result.data.length > 0 ? result.data : [];
                this.datas.productionSummaryHeaderItems = result.data.length > 0 ? this.convertToProductionSummaryHeaderItems(result.data) : [];
                this.datas.productionSummaryContentsItems = [];
                result.data.length > 0 && this.zoneInfos.sort((a, b) => a.disp_booth_id - b.disp_booth_id).forEach(zoneInfo => {
                    this.convertToProductionSummaryContentsItems(zoneInfo.zone_id, result.data);
                })
                this.datas.productionChartItems = this.datas.productionSummaryContentsItems.length > 0 ? this.convertToProductionChartItems(this.datas.productionSummaryContentsItems) : [];
            } else {
                window.alert(this.$t(`extra.child.vin-no-production-history.alertText`));
            }
        },
        convertToProductionSummaryHeaderItems(productionItems) {
            return productionItems.length > 0 ? [{ id: 'zone', title: 'ZONE'}, ...productionItems[0]['column_name'].map((productionHeaderItemKey, productionHeaderItemKeyIndex) => {
              return (productionHeaderItemKeyIndex >= 2 && productionHeaderItemKeyIndex <= 8) && { id: productionHeaderItemKey, title: 'TOTAL ' + productionHeaderItemKey }
            }).filter(headerItem => headerItem !== false)] : [];
        },

        convertToProductionSummaryContentsItems(zoneId, productionItems) {
            const productionItem = productionItems.filter(productionItem => productionItem.zone_id === zoneId);
            if ( productionItem.length > 0 ) {
              const zoneProductionSummaryItems = {};
              zoneProductionSummaryItems['zone'] = productionItem[0].zone_name;
              productionItem.forEach((contentsItem, contentsItemIndex) => {
                contentsItem['column_name'].forEach((item, itemIndex) => {
                  this.datas.productionSummaryHeaderItems.some(productionSummaryHeaderItem => productionSummaryHeaderItem.id === item) && (zoneProductionSummaryItems[item] = (zoneProductionSummaryItems[item] | 0) + Number(contentsItem['record'][itemIndex]));
                })
                productionItem.length - 1 === contentsItemIndex && this.datas.productionSummaryContentsItems.push(zoneProductionSummaryItems);
              })
            }
        },

        convertToProductionHeaderItems(zoneId, productionItems) {
            const productionItem = productionItems.filter(productionItem => productionItem.zone_id === zoneId);
            return (productionItem.length > 0 && !isEmpty(productionItem[0]['column_name'])) ? [{ id: 'robot', title: 'ROBOT'}, ...productionItem[0]['column_name'].map(productionHeaderItemKey => {
                return { id: productionHeaderItemKey, title: productionHeaderItemKey }
              })] : [];
        },

        convertToProductionContentsItems(zoneId, productionItems) {
            const productionItem = productionItems.filter(productionItem => productionItem.zone_id === zoneId);
            const contentsItems = Array.from({ length: productionItem.length }, () => ({}));
            if ( productionItem.length > 0 ) {
                productionItem.forEach((contentsItem, contentsItemIndex) => {
                    contentsItems[contentsItemIndex]['robot'] = contentsItem.robot_name;
                    contentsItem['column_name'].forEach((item, itemIndex) => {
                      contentsItems[contentsItemIndex][item] = contentsItem['record'][itemIndex];
                    })
                })
            }
            return contentsItems;
        },

        convertToProductionChartItems(productionSummaryItems) {
            // TODO: 생산이력 HEADER 에서 사용되는 ID 값으로 비교하는 로직인데, 입력하는 곳(DATA COLLECTOR 로 추측)에서 이름을 다르게 써주면 걸러지지 않는다.. 추후 구체화 필요
            const productionChartItems = this.datas.productionSummaryHeaderItems.filter(productionSummaryHeaderItem => productionSummaryHeaderItem.id !== 'zone').map(productionSummaryHeaderItem => {
                return {
                  name: productionSummaryHeaderItem.id,
                  items: [],
                  type: productionSummaryHeaderItem.id === 'FLOW VOLUME(cc)' && 'column' ,
                  fillOpacity: productionSummaryHeaderItem.id === 'FLOW VOLUME(cc)' && .5,
                  color: productionSummaryHeaderItem.id === 'FLOW VOLUME(cc)' && '#53559BCC',
                };
            })
            productionSummaryItems.forEach(productionSummaryItem => {
                Object.keys(productionSummaryItem).forEach(productionSummaryItemKey => {
                    productionChartItems.forEach(productionChartItem => {
                        productionChartItem.name === productionSummaryItemKey && productionChartItem.items.push( { label: productionSummaryItem['zone'], y: productionSummaryItem[productionSummaryItemKey] } )
                    })
                })
            });
            return productionChartItems;
        }
    }
}
</script>
<style scoped lang="scss">
    @import "VinNoProductionHistory";
</style>
