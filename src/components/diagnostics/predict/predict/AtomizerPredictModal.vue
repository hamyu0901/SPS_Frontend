<template>
    <base-modal :class="['atomizer-predict-modal']" :title="title" :is-open="isOpen" :width="width" @onCloseModal="closeModalHandler">
        <v-layout :class="['atomizer-predict-modal__contents']" column>
            <v-layout :class="['atomizer-predict-modal__contents-info']"></v-layout>
            <v-layout :class="['atomizer-predict-modal__contents-data']" column>
                <v-layout :class="['atomizer-predict-modal__contents-data__btn-items']">
                    <v-btn-toggle mandatory v-model="datas.atomizerTypeValue" :class="['atomizer-predict-modal__contents-data__btn-items-toggle']" @change="changeAtomizerTypeValue">
                        <v-btn v-for="atomizerTypeValueItem in datas.atomizerTypeValueItems" :key="atomizerTypeValueItem.id" flat :value="atomizerTypeValueItem.value">
                            <v-layout align-center justify-center>
                                <span class="mr-1">{{atomizerTypeValueItem.title}}</span>
                                <v-layout justify-center class="ml-1">
                                    <alarm-status-container
                                        :component-type="'icon'"
                                        :alarm-type="renderAtomizerStatus(atomizerTypeValueItem.value)"
                                    />
                                </v-layout>
                            </v-layout>
                        </v-btn>
                    </v-btn-toggle>
                    <img  v-if="listItem" :class="['atomizer-predict-modal__contents-data__btn-items-print']" :src="datas.img.print" alt="atomizer predict modal print" @click="clickAtomizerPrintBtn"/>
                </v-layout>

                <v-layout v-if="(datas.atomizerTypeValue !== datas.atomizerTypeValueItems[3].value && datas.atomizerTypeValue !== datas.atomizerTypeValueItems[4].value) || datas.atomizerPredictItems.length === 0" :class="['atomizer-predict-modal__contents-data__chart']" >
                    <v-flex v-if="chartPrevTitle" :class="['atomizer-predict-modal__contents-data__chart__box sub']">
                        <mix-chart
                            :chart-id="'atomizer-avg-sub-chart'"
                            :chart-title="chartPrevTitle"
                            :chart-sub-title="chartSubTitle"
                            :chart-items="datas.atomizerPredictSubItems"
                            :value-type="'atomizer-type'"
                            :chart-axis-y-options="{ title: 'ERROR RATE(%)' }"
                        >
                            <list-card
                                v-if="listItem"
                                :title="listTitleItem"
                                :item="listItem.sub.item"
                                :config="listItem.sub.config"
                                :count="listItem.sub.count"
                                :id="'sub'"
                            />
                        </mix-chart>
                    </v-flex>
                    <v-flex :class="['atomizer-predict-modal__contents-data__chart__box', listItem ? 'main' : '']">
                        <mix-chart
                            :chart-id="'atomizer-avg-chart'"
                            :chart-title="chartTitle"
                            :chart-sub-title="chartSubTitle"
                            :chart-items="datas.atomizerPredictItems"
                            :value-type="'atomizer-type'"
                            :chart-axis-y-options="{ title: 'ERROR RATE(%)' }"
                        >
                            <list-card
                                v-if="listItem"
                                :title="listTitleItem"
                                :item="listItem.main.item"
                                :config="listItem.main.config"
                                :count="listItem.main.count"
                                :percentItem="listItem.percent"
                                :id="'main'"
                            />
                        </mix-chart>
                    </v-flex>
                </v-layout>
                <v-layout v-if="datas.atomizerTypeValue === datas.atomizerTypeValueItems[3].value && datas.atomizerPredictItems.length > 0"  :class="['atomizer-predict-modal__contents-data__chart']">
                    <v-flex v-if="chartPrevTitle" :class="['atomizer-predict-modal__contents-data__chart__box sub']" >
                        <mix-chart
                            v-for="(atomizerPredictSubItem, atomizerPredictSubItemIdx) in datas.atomizerPredictSubItems"
                            :key="'atomizerSubPredictItem'+atomizerPredictSubItemIdx"
                            :chart-id="'atomizer-hv-'+atomizerPredictSubItemIdx+'-avg-sub-chart'"
                            :chart-title="chartPrevTitle"
                            :chart-sub-title="chartSubTitle"
                            :chart-items="[...atomizerPredictSubItem]"
                            :value-type="'atomizer-type'"
                        >
                            <list-card
                                v-if="listItem"
                                :title="listTitleItem"
                                :item="listItem.sub.item[atomizerPredictSubItemIdx]"
                                :config="listItem.sub.config[atomizerPredictSubItemIdx]"
                                :count="listItem.sub.count"
                                :id="'sub'"
                            />
                        </mix-chart>
                    </v-flex>
                    <v-flex :class="['atomizer-predict-modal__contents-data__chart__box', listItem ? 'main' : '']">
                        <mix-chart
                            v-for="(atomizerPredictItem, atomizerPredictItemIdx) in datas.atomizerPredictItems"
                            :key="'atomizerPredictItem'+ atomizerPredictItemIdx"
                            :chart-id="'atomizer-hv-'+atomizerPredictItemIdx+'-avg-chart'"
                            :chart-title="chartTitle"
                            :chart-sub-title="chartSubTitle"
                            :chart-items="[...atomizerPredictItem]"
                            :value-type="'atomizer-type'"
                        >
                            <list-card
                                v-if="listItem"
                                :title="listTitleItem"
                                :item="listItem.main.item[atomizerPredictItemIdx]"
                                :config="listItem.main.config[atomizerPredictItemIdx]"
                                :count="listItem.main.count"
                                :percentItem="listItem.percent[atomizerPredictItemIdx]"
                                :id="'main'"
                            />
                        </mix-chart>
                    </v-flex>
                </v-layout>
                <v-layout v-if="datas.atomizerTypeValue === datas.atomizerTypeValueItems[4].value && datas.atomizerPredictItems.length > 0" :class="['atomizer-predict-modal__contents-data__chart']" column>
                    <base-table
                      :class="['atomizer-predict-modal__contents-data__chart-table']"
                      :header-items="datas.atomizerAlarmListHeaderItems"
                      :content-items="atomizerAlarmListItems"
                    />
                    <v-flex :class="['atomizer-predict-modal__contents-data__chart__alarm-box', listItem ? 'main' : '']">
                        <mix-chart
                          :chart-id="'atomizer-avg-chart'"
                          :chart-title="chartTitle"
                          :chart-sub-title="chartSubTitle"
                          :chart-items="atomizerAlarmListItems.length > 0 ? datas.atomizerPredictItems : []"
                          :value-type="'atomizer-type'"
                        />
                    </v-flex>
                 </v-layout>
            </v-layout>
        </v-layout>
    </base-modal>
</template>

<script>
import { setAtomizerChartItems } from "@/utils/report"
import BaseModal from "@/commons/basemodal/BaseModal";
import BaseTable from "@/commons/basetable/BaseTable.vue";
import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer";
import MultiLineChart from "@/commons/chart/multilinechart/MultiLineChart";
import MultiBarChart from "@/commons/chart/multibarchart/MultiBarChart.vue";
import ListCard from "@/components/report/report/ListCard"
import MixChart from "@/commons/chart/mixchart/MixChart";
import {
  convertToAtomizerAlarmChartItems,
  convertToAtomizerChartItems,
  convertToAtomizerHVChartItems
} from '@/utils/diagnostics/predict';
export default {
    components: {
        BaseTable,
        BaseModal,
        AlarmStatusContainer,
        MultiLineChart,
        ListCard,
        MixChart,
        MultiBarChart
    },
    props: {
        /** 모달 넓이 */
        width: {
            type: Number
        },
        /** 모달 오픈 여부 */
        isOpen: {
            type: Boolean,
            required: true
        },
        /** 모달 타이틀 */
        title: {
            type: String,
            required: true
        },
        /** 차트 타이틀 */
        chartTitle: {
            type: String
        },
        /** 차트 서브 타이틀 */
        chartSubTitle: {
            type: String
        },
        /** 비교 리포트 차트 타이틀 */
        chartPrevTitle: {
            type: String
        },
        /** 도장기 타입 */
        atomizerTypeValue: {
            type: String,
            default: 'turbine'
        },
        /** 리스트 차트 리스트 타이틀 아이템 */
        listTitleItem: {
            type: Array
        },
        /** 리포트 차트 리스트 아이템 */
        listItem: {
            type: Object
        },
        /** 도장기 아이템 */
        atomizerItem: {
            type: Object,

        },
        /** 도장기 예지보전 아이템 */
        atomizerPredictItems: {
            type: Array,
            required: true
        },
        /** 도장기 예지보전 비교 리포트 아이템 */
        atomizerPredictSubItems: {
            type: Array,
        },
        atomizerTypePrintStatusItem: {
            type: Boolean
        },
        atomizerAlarmListItems: {
            type: Array
        }
    },
    data: (vm) => ({
        datas: {
            atomizerTypeValue: vm.atomizerTypeValue,
            atomizerTypeValueItems: [
                { id: 'turbine', title: 'TURBINE', value: 'turbine' },
                { id: 'sa_s', title: 'SA_S', value: 'sa_s' },
                { id: 'sa_v', title: 'SA_V', value: 'sa_v' },
                { id: 'hv', title: 'HIGH-VOLTAGE', value: 'hv' },
                { id: 'alarm', title: 'ALARM', value: 'alarm' }
            ],
            atomizerPredictItems: [],
            atomizerPredictSubItems: [],
            img: {
                print: null
            },
            atomizerAlarmListHeaderItems: [
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.update_time'), value: 'update_time', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.code'), value: 'code', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.name'), value: 'name', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.job_name'), value: 'job_name', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.step_no'), value: 'step_no', type: 'text', align: 'center' },
              { text: vm.$t('diagnostics.atomizer.atomizerAlarmListHeaderItems.level'), value: 'level', type: 'img', align: 'center' },
            ],
        }
    }),

    created() {
    },

    mounted() {
        this.datas.img.print = this.atomizerTypePrintStatusItem ? require("@/images/report/axis_print_hover.png") : require("@/images/report/axis_print_normal.png")
    },

    destroyed() {
    },

    watch: {
        atomizerTypeValue: {
            immediate: true,
            handler(val) {
                this.datas.atomizerTypeValue = val;
            }
        },

        atomizerPredictItems: {
            handler(val) {
                this.datas.atomizerPredictItems = val.length > 0 ? this.setAtomizerPredictItems(val) : [];
            }
        },
        atomizerPredictSubItems: {
            handler(val){
                this.datas.atomizerPredictSubItems = val.length > 0 ? this.setAtomizerPredictItems(val) : [];
                this.datas.atomizerTypeValue === 'hv' && this.setChartItems();
            }
        },
        atomizerTypePrintStatusItem: {
            immediate: true,
            deep : true,
            handler(val){
                this.datas.img.print = val? require("@/images/report/axis_print_hover.png") : require("@/images/report/axis_print_normal.png")
            }
        }
    },

    computed: {
        renderAtomizerStatus() {
            return (atomizerType) => {
                return (this.atomizerItem[atomizerType] === '0' || this.atomizerItem[atomizerType] === 0 ) ? 'normal' : ((this.atomizerItem[atomizerType] === '1' || this.atomizerItem[atomizerType] === 1 ) ? 'alarm' : 'default');
            }
        },
    },

    methods: {
        setChartItems(){
            const chartItems = setAtomizerChartItems(this.datas.atomizerPredictItems, this.datas.atomizerPredictSubItems)
            this.datas.atomizerPredictItems = chartItems.main
            this.datas.atomizerPredictSubItems = chartItems.sub
        },

        setAtomizerPredictItems(atomizerPredictItems) {
            return this.datas.atomizerTypeValue === this.datas.atomizerTypeValueItems[3].value ?
              convertToAtomizerHVChartItems(atomizerPredictItems) :
              (
                this.datas.atomizerTypeValue === this.datas.atomizerTypeValueItems[4].value ?
                  convertToAtomizerAlarmChartItems(atomizerPredictItems) :
                  convertToAtomizerChartItems(atomizerPredictItems)
              );
        },

        changeAtomizerTypeValue(e) {
            const atomizerTypeValueIndex = this.datas.atomizerTypeValueItems.findIndex(atomizerTypeValueItem => atomizerTypeValueItem.value === e);
            this.datas.atomizerPredictItems = [];
            this.datas.atomizerPredictSubItems = [];
            this.$emit('onChangeAtomizerType', { type: e, typeNo: atomizerTypeValueIndex });
        },

        clickAtomizerPrintBtn(){
            this.$emit('onChangeAtomizerTypePrintStatus', {type: this.datas.atomizerTypeValueItems.findIndex(valueItem => valueItem.id === this.datas.atomizerTypeValue), status : !this.atomizerTypePrintStatusItem})
        },

        closeModalHandler() {
            this.$emit('onCloseModal');
        },
    }
}
</script>

<style scoped lang='scss'>
    @import './AtomizerPredictModal';
</style>
