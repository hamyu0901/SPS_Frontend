<template>
    <base-modal :class="['alarm-analysis-modal']" :title="title" :is-open="isOpen" :width="width" @onCloseModal="closeModalHandler">
        <v-layout :class="['alarm-analysis-modal__contents']">
            <v-flex lg2>
                <v-layout :class="['alarm-analysis-modal__contents-title']">
                    <span>{{ ui.title.lineInfo }}</span>
                </v-layout>
                <v-layout :class="['alarm-analysis-modal__contents-tree-view']">
                    <base-tree-view
                        ref="baseTreeView"
                        :tree-items="treeViewItems"
                        :is-open-all="datas.isTreeViewExpand"
                        :active-no="renderActiveNo"
                        @onTreeViewItemClick="treeViewItemClickHandler"
                    />
                </v-layout>
            </v-flex>
            <v-flex lg10>
                <v-layout :class="['alarm-analysis-modal__contents-title']">
                    <span>{{renderContentTitle(alarmType, datas.selectedTreeViewItem)}}</span>
                </v-layout>
                <v-layout :class="['alarm-analysis-modal__contents-items']" column>
                    <v-layout :class="['alarm-analysis-modal__contents-items__alarm-list']">
                        <base-table
                            :class="['alarm-analysis-modal__contents-items__alarm-list-table']"
                            :has-click="datas.alarmListContentsItems.length > 0"
                            :header-items="alarmListHeaderItems"
                            :content-items="datas.alarmListContentsItems"
                            :empty-text="'NO ALARM'"
                            :clicked-item="datas.alarmInfoItem"
                            @onClickBaseTableItem="alarmListItemClickHandler"
                        />
                    </v-layout>
                    <v-layout :class="['alarm-analysis-modal__contents-items__robot-container']" column>
                        <v-layout v-if="alarmType === 'robot'" :class="['alarm-analysis-modal__contents-items__robot-container-parts']">
                            <span :class="['alarm-analysis-modal__contents-items__robot-container-parts-title']">{{ ui.title.inspection}} Parts: </span>
                            <v-layout :class="['alarm-analysis-modal__contents-items__robot-container-parts-chip']" v-if="datas.robotPartItems.length > 0" wrap>
                                <v-chip v-for="chipItem in datas.robotPartItems" :key="chipItem.header" outline :color="datas.chipColorItems[chipItem.level]">{{chipItem.item}}</v-chip>
                            </v-layout>
                        </v-layout>
                        <v-expansion-panel :class="['alarm-analysis-modal__contents-items__robot-container-detail']" v-model="datas.expandPanelKey" expand :disabled="datas.remedyItems.length === 0">
                            <v-expansion-panel-content :class="['alarm-analysis-modal__contents-items__robot-container-detail-contents']">
                                <v-layout :class="['alarm-analysis-modal__contents-items__robot-container-detail-contents__layout']" v-if="alarmType === 'zone' && datas.remedyItems.length !== 0" >
                                    <v-btn :flat="true" @click="clickPdfBtn" :class="['alarm-analysis-modal__contents-items__robot-container-detail-contents__layout-button']">
                                        <img width="20" src="@/images/pdf.png" alt="pdf" class="mr-2">
                                        {{ ui.title.remedy }}
                                    </v-btn>
                                </v-layout>
                                <template v-slot:header>
                                    <span :class="['alarm-analysis-modal__contents-items__robot-container-detail-contents-title']">{{ ui.title.remedy }}</span>
                                </template>
                                <v-layout :class="['alarm-analysis-modal__contents-items__robot-container-detail-contents-expand']">
                                    <base-alarm-remedy-item v-for="(robotRemedyItem, robotRemedyItemIndex) in datas.remedyItems" :key="'robotRemedyItem' + robotRemedyItemIndex" :robot-alarm-remedy-item="robotRemedyItem"/>
                                </v-layout>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <base-modal
                            :title="`${datas.alarmInfoItem.spc_code}.pdf`"
                            :is-open="datas.isPdfOpen"
                            @onCloseModal="datas.isPdfOpen=false"
                        >
                            <pdf-view :src="datas.src"></pdf-view>
                        </base-modal>
                        <v-layout v-if="alarmType === 'robot'" :class="['alarm-analysis-modal__contents-items__robot-container-chart']">
                            <alarm-partial-card v-if="datas.robotTrendItems.length > 0" :title="ui.title.robotAlarmInfoTitle">
                                <multi-line-chart
                                    :chart-id="'torque-data-chart'"
                                    :chart-items="datas.robotTrendItems"
                                    :value-type="'torque'"
                                    :chart-strip-line-type="'single'"
                                    :chart-strip-lines="renderStepNo"
                                />
                            </alarm-partial-card>
                            <v-layout v-else :class="['alarm-analysis-modal__contents-items__robot-container-chart-empty']">
                                <span>{{ ui.title.chart.empty}}</span>
                            </v-layout>
                        </v-layout>
                    </v-layout>
                    <v-layout v-if="alarmType === 'zone'" :class="['alarm-analysis-modal__contents-items__zone-container']" column>
                        <v-layout v-if="datas.alarmInfoItem.type_id === 2" :class="['alarm-analysis-modal__contents-items__zone-container-chart']">
                            <v-flex lg6 md6 sm6 :class="['alarm-analysis-modal__contents-items__zone-container-chart-entire']">
                                <alarm-partial-card title="Command/Feedback">
                                    <v-layout :class="['alarm-analysis-modal__contents-items__zone-container-chart-entire__items']" column>
                                        <v-btn-toggle mandatory v-model="datas.atomizerEntireValue" :class="['alarm-analysis-modal__contents-items__zone-container-chart-entire__items-btn-toggle']">
                                            <v-btn v-for="atomizerEntireBtnItem in datas.atomizerEntireBtnItems" :key="atomizerEntireBtnItem.id" flat :value="atomizerEntireBtnItem.value">
                                                {{atomizerEntireBtnItem.title}}
                                            </v-btn>
                                        </v-btn-toggle>
                                    </v-layout>
                                    <multi-line-chart
                                        :chart-id="'atomizer-entire-chart'"
                                        :chart-items="datas.atomizerEntireTrendItems[datas.atomizerEntireValue]? datas.atomizerEntireTrendItems[datas.atomizerEntireValue]: []"
                                        :value-type="'atomizer'"
                                        :chart-strip-line-type="'multiple'"
                                        :chart-strip-lines="renderStepNo"
                                    />
                                </alarm-partial-card>
                            </v-flex>

                            <v-flex lg6 md6 sm6 :class="['alarm-analysis-modal__contents-items__zone-container-chart-hv-hvc']">
                                <alarm-partial-card title="HV/HVC">
                                    <multi-line-chart
                                        :chart-id="'atomizer-hv-chart'"
                                        :chart-items="datas.atomizerHVTrendItems"
                                        :value-type="'atomizer'"
                                        :chart-strip-line-type="'multiple'"
                                        :chart-strip-lines="renderStepNo"
                                    />
                                </alarm-partial-card>
                            </v-flex>
                        </v-layout>
                        <v-layout v-else :class="['alarm-analysis-modal__contents-items__zone-container-chart-empty']">
                            <span>{{ ui.title.chart.empty}}</span>
                        </v-layout>
                    </v-layout>
                </v-layout>
            </v-flex>
            <loading-dlg :loading-flag="datas.isLoading" />
        </v-layout>
    </base-modal>
</template>

<script>
import BaseModal from "@/commons/basemodal/BaseModal.vue";
import BaseTreeView from "@/commons/basetreeview/BaseTreeView.vue";
import BaseTable from "@/commons/basetable/BaseTable.vue";
import AlarmPartialCard from '@/commons/alarm/partialcard/PartialCard';
import MultiLineChart from "@/commons/chart/multilinechart/MultiLineChart";
import LoadingDlg from "@/commons/LoadingDlg.vue";
import BaseAlarmRemedyItem from "@/commons/basealarmremedyitem/BaseAlarmRemedyItem.vue";
import pdf from "vue-pdf";
import PdfView from "@/commons/pdf/PdfView.vue";
import {
    zoneAlarmListAPI,
    robotAlarmListAPI,
    atomizerTrendAPI,
    robotTorqueAPI, getSpcAlarmListAPI, getSpcAlarmFileAPI
} from "@/api/alarmAPI";
import { convertAtomizerToChartItems, convertLevelToIcon, convertTorqueToChartItems } from "@/utils/alarm";
import { mapGetters } from "vuex";
import { isEmpty } from "lodash";
import { getLineRobotAlarmRemedyItemsAPI } from "@/api/monitoringAPI";

export default {
    props: {
        width: {
            type: Number
        },
        isOpen: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        alarmType: {
            type: String,
            required: true
        },
        activeItem: {
            type: Object
        },
        treeViewItems: {
            type: Array,
            required: true
        },
        alarmListHeaderItems: {
            type: Array,
            required: true
        },
    },

    components: {
        PdfView,
        BaseModal,
        BaseTreeView,
        BaseTable,
        BaseAlarmRemedyItem,
        AlarmPartialCard,
        MultiLineChart,
        LoadingDlg
    },

    data: (vm) => ({
        datas: {
            isTreeViewExpand: false,
            contentsType: {
                text: 'text',
                chip: 'chip',
                img: 'img'
            },
            chipColorItems: ['#16AE77', '#FFA800', '#ED551F'],
            selectedTreeViewItem: {},
            alarmListContentsItems: [],
            alarmInfoItem: {},
            atomizerEntireValue: 'flow',
            atomizerEntireBtnItems: [
                { id: 'flow', title: 'FLOW', value: 'flow' },
                { id: 'turbine', title: 'TURBINE', value: 'turbine_speed' },
                { id: 'sa_s', title: 'SA_S', value: 'sa_s' },
                { id: 'sa_v', title: 'SA_V', value: 'sa_v' }
            ],
            atomizerTrendType: {
                entire: 'entire',
                hv: 'hv'
            },
            atomizerEntireTrendItems: {},
            atomizerHVTrendItems: [],
            robotPartItems: [],
            remedyItems: [],
            robotDetailItems: [],
            robotTrendItems: [],
            isLoading: false,
            expandPanelKey: [true],
            isPdfOpen: false,
            src: null,
        },
        ui: {
            title : {
                robotAlarmInfoTitle: vm.$t('common.robotAlarmModal.robotAlarmInfoTitle'),
                lineInfo: vm.$t('home.main.modal.lineInfo'),
                remedy: vm.$t('home.main.modal.remedy'),
                inspection: vm.$t('home.main.modal.inspection'),
                chart: {
                    empty: vm.$t('home.main.modal.chart.empty'),
                }
            }
        }
    }),

    created() {

    },

    mounted() {

    },

    destroyed() {},

    computed: {
        ...mapGetters({
            robotPartItems: 'getRobotPartItems',
            robotInfos: 'getRenewRobotInfos'
        }),

        renderStepNo() {
            return this.datas.alarmInfoItem.step_no;
        },

        renderActiveNo() {
            return this.activeItem && this.activeItem.id;
        },

        renderContentTitle() {
            return (alarmType, treeViewItem) => {
                return treeViewItem.booth_name + '-' + (alarmType === 'robot' ? treeViewItem.zone_name + '-' + treeViewItem.name : treeViewItem.name);
            }
        }
    },

    watch: {
        isOpen: {
            immediate: true,
            async handler(val) {
                this.datas.isTreeViewExpand = val;
                (val && !isEmpty(this.activeItem)) && await this.treeViewItemClickHandler(this.activeItem);
            }
        },

        activeItem: {
            immediate: true,
            deep: true,
            handler(val) {
                isEmpty(val) && this.initItems();
            }
        },
    },

    methods: {
        initItems() {
            this.datas.selectedTreeViewItem = {};
            this.datas.robotPartItems = [];
            this.datas.robotDetailItems = [];
            this.datas.robotTrendItems = [];
            this.datas.atomizerEntireTrendItems = {};
            this.datas.atomizerHVTrendItems = [];
            this.datas.alarmInfoItem = {};
            this.datas.alarmListContentsItems = [];
        },

        closeModalHandler() {
            this.initItems();
            this.$emit('onCloseModal');
        },

        setIsLoading(isLoading) {
            this.datas.isLoading = isLoading;
        },

        async treeViewItemClickHandler(item) {
            this.initItems();
            this.datas.selectedTreeViewItem = item;
            this.setIsLoading(true);
            const alarmListContentsItems = this.alarmType === 'zone' ? await zoneAlarmListAPI(item) : await robotAlarmListAPI(item)
            this.datas.alarmListContentsItems = alarmListContentsItems.data.length > 0 ? this.setAlarmListContentsItems(alarmListContentsItems.data) : [];
            if ( this.datas.alarmListContentsItems.length > 0 ) {
              await this.alarmListItemClickHandler(this.datas.alarmListContentsItems[0]);
            } else {
              this.datas.remedyItems = [];
              this.setIsLoading(false)
            }
        },

        setAlarmListContentsItems(alarmListContentsItems) {
            return alarmListContentsItems.map(alarmListContentsItem => {
                    this.alarmType === 'zone' && (alarmListContentsItem['level'] = convertLevelToIcon(alarmListContentsItem['level']));
                    this.alarmType === 'robot' && (alarmListContentsItem['axis'] = alarmListContentsItem.axis_info.map((axisInfo, axisIndex) => axisInfo === 1 ? axisIndex+1 : '').filter(String))
                        return alarmListContentsItem;
                    }
            );
        },
       async alarmListItemClickHandler(alarmListItem) {
            this.datas.alarmInfoItem = alarmListItem;
            if ( this.alarmType === 'zone' ) {
                this.datas.atomizerEntireValue = 'flow';
                const trendItems = await atomizerTrendAPI(alarmListItem);
                this.datas.atomizerEntireTrendItems = trendItems.data.length > 0 ? convertAtomizerToChartItems(this.datas.atomizerTrendType.entire, trendItems.data): {};
                this.datas.atomizerHVTrendItems = trendItems.data.length > 0 ? convertAtomizerToChartItems(this.datas.atomizerTrendType.hv, trendItems.data)[this.datas.atomizerTrendType.hv]: [];
                const remedyItemsResult = await getSpcAlarmListAPI(alarmListItem);
                this.datas.remedyItems = remedyItemsResult.data.length > 0 ? remedyItemsResult.data : [];
            } else {
                this.datas.robotPartItems = alarmListItem.match_parts ? this.getPartItems(alarmListItem.match_parts) : [];
                const rcModel = this.robotInfos.filter(robotInfo => robotInfo.robot_id === alarmListItem.robot_id)[0].rc_model_id;
                const robotAlarmRemedyItemsResult = await getLineRobotAlarmRemedyItemsAPI({ code: alarmListItem.code, rcModel: rcModel});
                this.datas.remedyItems = robotAlarmRemedyItemsResult.data.length > 0 ? robotAlarmRemedyItemsResult.data : [];
                this.datas.robotTrendItems = await this.getRobotTrendItems(alarmListItem)
            }
            this.setIsLoading(false);
       },

        getPartItems(matchParts) {
            return matchParts.map(matchPart => {
                const partItem = this.robotPartItems.filter(robotPartItem => robotPartItem.part_id === matchPart);
                return { item: partItem[0].part_name, level: partItem[0].part_level }
            })
        },

        async getRobotTrendItems(alarmListItem) {
           const torqueItems = await robotTorqueAPI({robot_id: alarmListItem.robot_id, job_name: alarmListItem.job_name, time_stamp: alarmListItem.date, axis_info: alarmListItem.axis_info });
           return (torqueItems.data.length > 0 && this.datas.alarmInfoItem.axis.length > 0) ? convertTorqueToChartItems(torqueItems.data) : [];
        },

        async clickPdfBtn() {
            this.datas.isPdfOpen = true;
            await getSpcAlarmFileAPI({
                alarm_code: this.datas.alarmInfoItem.spc_code
            }).then((res) => {
                this.datas.isPdfOpen = true;
                this.datas.src = pdf.createLoadingTask(URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' })));

            }).catch(() => {
                window.alert(this.$t('common.window.noFile'))
                this.datas.src = null;
                this.datas.isPdfOpen = false;
            })
        }
    }
}
</script>

<style scoped lang='scss'>
  @import "./AlarmAnalysisModal";
</style>
