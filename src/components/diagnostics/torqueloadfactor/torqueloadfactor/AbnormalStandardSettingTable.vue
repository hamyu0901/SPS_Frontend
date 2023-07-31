<template>
    <v-card class="text-xs-center abNormalStandardSettingTableCard" elevation="0" :color="ui.color.cardColor" v-bind="initialize">
        <v-card-title class="cardTitle" v-bind:style="ui.titleStyle">
            {{ui.text.title.setAbnormalStandard}}
            <v-spacer/>
            <v-btn small class="buttonItem mr-1 elevation-0" @click="initSetBtnClicked()">{{ui.text.setDataTable.initData}}</v-btn>
            <!-- <v-btn small class="buttonItem elevation-0" @click="setAllWarningDataClick()">{{ui.text.setAllDataTable.setAllWarningData}}</v-btn> -->
            <v-dialog
                :width="ui.size.setDataTable.width"
                persistent
                v-model="handle.setWarningDataDlg"
                >
                <v-card class="warningSetDlgCard">
                    <v-card-title class="headline">{{ui.text.setDataTable.setStandardData}}</v-card-title>
                    <init-data-setting-dlg
                        class="pl-3 pr-3"
                        v-bind:saveSettingData="datas"
                        v-bind:dialogFlag="handle.setWarningDataDlg"
                        v-bind:acceptFlag="initAcceptFlag"
                        v-on:changeSettingData="getSettingData"
                        v-on:changeAcceptFlag="changeAcceptFlag"
                        v-on:changeDialogFlag="onCloseToSumData"
                    ></init-data-setting-dlg>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn
                        class="buttonItem"
                        @click="stdApplyBtnClicked">
                        {{ui.text.setDataTable.accept}}
                      </v-btn>
                      <v-btn
                        class="buttonItem"
                        @click="onCloseToSumData()">
                        {{ui.text.common.close}}
                      </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog
              class="gridDlg"
              :width="ui.size.setAllDataTable.width"
              :height="ui.size.setAllDataTable.height"
              persistent
              v-model="handle.setAllWarningDataDlg">
              <v-card class="warningSetDlgCard">
                <v-card-title class="headline">{{startdate + '~' + enddate + ' ' + ui.text.setAllDataTable.setAllWarningData}}</v-card-title>
                <div id="dyGrid" :style="ui.style.dyGrid"></div>
                <v-layout>
                  <v-spacer/>
                  <v-btn
                    class="buttonItem"
                    :style="ui.size.setAllDataTableCloseBtn.xPos"
                    :color="ui.color.btn"
                    @click="onCloseToAllSumData()">
                    {{ui.text.common.close}}
                  </v-btn>
                </v-layout>
              </v-card>
          </v-dialog>
        </v-card-title>
        <v-data-table
          class="elevation-0 dataTable"
          hide-actions
          :headers="headers"
          :items="datas">
          <template slot="headers" slot-scope="props">
            <tr>
              <th :style="ui.tableHeaderStyle" class="text-xs-center tdText" v-for="(header, index) in headers" :key="index">{{ header.title }}</th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-center tdText" v-for="(header, index) in headers" :key="index">{{ props.item[header.id]}}</td>
            </tr>
          </template>
        </v-data-table>
        <v-layout>
          <v-dialog v-model="handle.loadingDlg" hide-overlay persistent width="300">
                <v-card color="indigo" dark>
                    <v-card-text>
                        {{ui.text.common.loading}}
                        <v-progress-linear indeterminate :color="ui.color.loadingProgress" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-layout>
        <v-layout>
          <v-dialog
              :width="ui.size.setAllWarningDataDlg.width"
              persistent
              v-model="handle.setWarnConfig">
              <v-card class="warningSetDlgCard">
                <v-card-title class="headline">{{ui.text.setAllDataTable.setAllWarningDataCfg}}</v-card-title>
                <v-layout class="pb-3">
                  <v-flex class="pl-4">
                    <input class="warningTotalSetDlgInput" v-model="warnData.data">
                  </v-flex>
                  <v-flex>
                    <v-btn
                    class="buttonItem"
                    @click="onAcceptWarnValue()"
                    >{{ui.text.setAllDataTable.setAllWarningDataAccept}}</v-btn>
                  </v-flex>
                  <v-flex>
                    <v-btn
                    class="buttonItem"
                    @click="onCloseSetWarnDlg()">
                    {{ui.text.common.close}}
                  </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
          </v-dialog>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex';
import * as dyGrid from 'cheetah-grid';
import CountRange from '@/commons/CountRange'
import InitDataSettingDlg from '@/components/diagnostics/torqueloadfactor/torqueloadfactor/abnormalstandardsettingtable/InitDataSettingDlg';
export default {
  components: {
    CountRange,
    InitDataSettingDlg,
    },
  props: [
    'headerData',
    'contentData',
    'date',
    'startdate',
    'enddate'
    ],
  data() {
    return {
      ui: {
        titleStyle: null,
        tableHeaderStyle: null,
        style: {
          dyGrid: ``,
        },
        text: {
          title: {
            setAbnormalStandard: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAbnormalStandard`),
          },
          common: {
            allModify: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.allModify`),
            close: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.close`),
            loading: this.$t(`common.loading`),
          },
          setDataTable: {
            initData: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.initData`),
            setStandardData: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setStandardData`),
            accept: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.accept`),
          },
          setAllDataTable: {
            setAllWarningData: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllWarningData`),
            setAllWarningDataCfg: ``,
            setAllAvgWarningData: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.warningData.setAllAvgWarningData`),
            setAllCycleData: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.warningData.setAllAvgCycleData`),
            setAllWarningDataAccept: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.warningData.setAllWarningDataAccept`),
            booth: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.booth`),
            zone: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.zone`),
            robot: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.robot`),
            job: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.job`),
            axis: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.axis`),
            maxsum: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.maxsum`),
            minsum: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.minsum`),
            avgcycle: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.avgcycle`),
            avgvalue: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.avgvalue`),
            updatemaxsum: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.updatemaxsum`),
            updateminsum: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.updateminsum`),
            updatecycle: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.updatecycle`),
            modify: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.modify`),
            cantmodify: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.cantmodify`),
            canmodify: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.canmodify`),
            dataavailable: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.dataavailable`),
            onlynumber: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.setAllDataTable.onlynumber`),
          },
        },
        size: {
          setDataTable: {
            width: 400,
          },
          setAllDataTable: {
            width: 1700,
            height: 700,
          },
          setAllDataTableCloseBtn: {
            xPos: null,
          },
          setAllWarningDataDlg: {
            width: 400,
          },
        },
        color: {
          btn: '',
          loadingProgress: '',
          cardColor: '',
        }
      },
      handle: {
        dyGrid: null,
        setWarningDataDlg: false,
        setAllWarningDataDlg: false,
        isLoadAllWarningData: false,
        loadingDlg: false,
        setWarnConfig: false,
      },
      flag: {
        loading: true,
        enum: {
          warnType: 0,
        }
      },
      warnData: {
        data: null,
      },
      initAcceptFlag: false,
      itemNum: '',
      headers: [],
      datas: [],
      typeDatas: [
        {
          type: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.typeDatas.summxv`),
          id: 'summxv',
        },
        // {
        //   type: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.typeDatas.summmv`),
        //   id: 'summmv',
        // },
        {
          type: this.$t(`diagnostics.torqueLoadFactor.child.abnormalStandardSettingTable.typeDatas.cycle`),
          id: 'cycle',
        }
      ],
      totalCount: 0,
      records: [],
      userTheme: {
        color: this.$style.diagnostics.abnormalStandardSettingTableItemColor,
        frozenRowsColor: this.$style.diagnostics.abnormalStandardSettingTableItemFrozenRowsColor,
        defaultBgColor: this.$style.diagnostics.abnormalStandardSettingTableItemDefaultBgColor,
        frozenRowsBgColor: this.$style.diagnostics.abnormalStandardSettingTableItemFrozenRowsBgColor,
        selectionBgColor: this.$style.diagnostics.abnormalStandardSettingTableItemSelectionBgColor,
        highlightBgColor: this.$style.diagnostics.abnormalStandardSettingTableItemHighlightBgColor,
        underlayBackgroundColor: this.$style.diagnostics.abnormalStandardSettingTableItemUnderlayBackgroundColor,
        frozenRowsBorderColor(args) {
          const {
            row,
            grid: {frozenRowCount}
          } = args;
          if (frozenRowCount - 1 === row) {
            return [
              '#2a2f44',
              '#2a2f44',
              '#2a2f44'
              ];
          } else {
            return '#2a2f44';
          }
        },
        borderColor(args) {
          const {
            col,
            grid: {colCount}
          } = args;
          if (colCount - 1 === col) {
            return ['#2a2f44', '#2a2f44', '#2a2f44', '#2a2f44'];
          } else {
            return ['#2a2f44', '#2a2f44'];
          }
        },
        highlightBorderColor: this.$style.diagnostics.abnormalStandardSettingTableItemHighlightBorderColor,
        checkbox: {
          uncheckBgColor: this.$style.diagnostics.abnormalStandardSettingTableItemUncheckBgColor,
          checkBgColor: this.$style.diagnostics.abnormalStandardSettingTableItemCheckBgColor,
          borderColor: this.$style.diagnostics.abnormalStandardSettingTableItemCheckboxBorderColor,
        },
        button: {
          color: this.$style.diagnostics.abnormalStandardSettingTableItemButtoncolor,
          bgColor: this.$style.diagnostics.abnormalStandardSettingTableItemButtonBgColor,
        },
        header: {
          sortArrowColor: this.$style.diagnostics.abnormalStandardSettingTableItemHeaderSortArrowColor,
        }
      }
    }
  },
  computed: {
      ...mapGetters ({
          baseUrl: 'getBaseUrl',
          getTheme: 'getTheme',
          getFactoryId: 'getFactoryId',
          getBoothInfos: 'getBoothInfos',
          getZoneInfos: 'getZoneInfos',
          getRobotInfos: 'getRobotInfos',
      }),
      initialize() {
          this.getHeaderData();
          this.getContentData();
      },
  },
  created() {
      this.initDataTable();
  },
  mounted() {
    this.onCreate();
    this.initializeStyle();
  },
  methods: {
    initializeStyle() {
      this.ui.titleStyle = this.$style.common.titleObjectItemColor;
      this.ui.tableHeaderStyle = this.$style.common.tableHeaderStyleColor;
      this.ui.style.dygrid = this.$style.diagnostics.torqueLoadFactorDyGridColor;
      this.ui.color.btn = this.$style.diagnostics.torqueLoadFactorBtnColor;
      this.ui.color.loadingProgress = this.$style.diagnostics.torqueLoadFactorLoadingProgressColor;
      this.ui.color.cardColor = this.$style.common.tableCardBottomColor;

      document.documentElement.style.setProperty("--dialogContentBackgroundColor", this.$style.diagnostics.abnormalStandardSettingTableItemDialogContentBackgroundColor);
      document.documentElement.style.setProperty("--cardTitleBackgroundColor", this.$style.common.gridTableItemCardTitleBackgroundColor);
      document.documentElement.style.setProperty("--theadBackgroundColor", this.$style.common.gridTableItemTheadBackgroundColor);
      document.documentElement.style.setProperty("--oddBackgroundColor", this.$style.common.gridTableItemOddBackgroundColor);
      document.documentElement.style.setProperty("--evenBackgroundColor", this.$style.common.gridTableItemEvenBackgroundColor);
      document.documentElement.style.setProperty("--paginationBackgroundColor", this.$style.common.gridTableItemPaginationBackgroundColor);
      document.documentElement.style.setProperty("--hoverBackgroundColor", this.$style.common.gridTableItemHoverBackgroundColor);
      document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
      document.documentElement.style.setProperty("--abNormalStandardSettingTableCardBorderColor", this.$style.common.cardItemBorderColor);

      document.documentElement.style.setProperty("--cardBackgroundColor", this.$style.diagnostics.abnormalStandardSettingTableItemCardBackgroundColor);
      document.documentElement.style.setProperty("--totalSetDlgInputBackgroundColor", this.$style.diagnostics.abnormalStandardSettingTableItemInputBackgroundColor);
      document.documentElement.style.setProperty("--totalSetDlgInputColor", this.$style.diagnostics.abnormalStandardSettingTableItemInputColor);
      document.documentElement.style.setProperty("--totalSetDlgInputBorderColor", this.$style.diagnostics.abnormalStandardSettingTableItemInputBorderColor);
    },
    onCreate() {
      const inputEditor = new dyGrid.columns.action.InlineInputEditor();
      const gridWidth = ((this.ui.size.setAllDataTable.width-15) / 13);
      const inner = this;
      this.handle.dyGrid = new dyGrid.ListGrid({
      parentElement: document.querySelector('#dyGrid'),
      header: [
        {
          field: 'booth',
          caption: this.ui.text.setAllDataTable.booth,
          width: gridWidth,
          headerStyle: { textAlign: 'center' },
        },
        {
          field: 'zone',
          caption: this.ui.text.setAllDataTable.zone,
          width: gridWidth,
          headerStyle: { textAlign: 'center' },
        },
        {
          field: 'robot',
          caption: this.ui.text.setAllDataTable.robot,
          width: gridWidth,
          headerStyle: {textAlign: 'center'},
        },
        {
          field: 'job',
          caption: this.ui.text.setAllDataTable.job,
          width: gridWidth,
          headerStyle: {textAlign: 'center'},
        },
        {
          field: 'axis',
          caption: this.ui.text.setAllDataTable.axis,
          width: gridWidth-80,
          headerStyle: {textAlign: 'center'},
        },
        {
          field: 'maxsum',
          caption: this.ui.text.setAllDataTable.maxsum,
          width: gridWidth,
          headerStyle: {textAlign: 'center'},
        },
        {
          field: 'minsum',
          caption: this.ui.text.setAllDataTable.minsum,
          width: gridWidth,
          headerStyle: {textAlign: 'center'},
        },
        {
          field: 'cycle',
          caption: this.ui.text.setAllDataTable.avgcycle,
          width: gridWidth,
          headerStyle: {textAlign: 'center'},
        },
        {
          field: 'avgsum',
          caption: this.ui.text.setAllDataTable.avgvalue,
          width: gridWidth,
          headerStyle: {textAlign: 'center'},
        },
        {
          field: 'updatemaxsum',
          caption: this.ui.text.setAllDataTable.updatemaxsum,
          width: gridWidth+40,
          action: inputEditor,
          headerStyle: {textAlign: 'center', color: '#02a757', sortArrowColor: '#02a757'},
          style: {color: '#02a757'},
          message(rec) {
            return inner.isOnlyNumber(rec.updatemaxsum);
          },
          sort(order, col, grid) {
            inner.flag.enum.warnType = 0;
            inner.ui.text.setAllDataTable.setAllWarningDataCfg = inner.ui.text.setAllDataTable.setAllAvgWarningData;
            inner.onCreateSetWarnDlg(true);
          },
        },
        {
          field: 'updateminsum',
          caption: this.ui.text.setAllDataTable.updateminsum,
          width: gridWidth+40,
          action: inputEditor,
          headerStyle: {textAlign: 'center', color: '#f25500', sortArrowColor: '#f25500'},
          style: {color: '#f25500'},
          message(rec) {
            return inner.isOnlyNumber(rec.updateminsum);
          },
          sort(order, col, grid) {
            inner.flag.enum.warnType = 1;
            inner.ui.text.setAllDataTable.setAllWarningDataCfg = inner.ui.text.setAllDataTable.setAllAvgWarningData;
            inner.onCreateSetWarnDlg(true);
          },
        },
        {
          field: 'updatecycle',
          caption: this.ui.text.setAllDataTable.updatecycle,
          width: gridWidth,
          action: inputEditor,
          headerStyle: {textAlign: 'center', color: '#3086ff', sortArrowColor: '#3086ff'},
          style: {color: '#3086ff'},
          message(rec) {
            return inner.isOnlyNumber(rec.updatecycle);
          },
          sort(order, col, grid) {
            inner.flag.enum.warnType = 2;
            inner.ui.text.setAllDataTable.setAllWarningDataCfg = inner.ui.text.setAllDataTable.setAllCycleData;
            inner.onCreateSetWarnDlg(true);
          },
        },
        {
          caption: `[${this.ui.text.common.allModify}]`,
          width: gridWidth,
          headerStyle: {sortArrowColor: this.$style.diagnostics.abnormalStandardSettingTableItemAllModifySortArrowColor},
          columnType: new dyGrid.columns.type.ButtonColumn({
            caption: this.ui.text.setAllDataTable.modify,
          }),
          action: new dyGrid.columns.action.ButtonAction({
            action(rec) {
              const regex = /^(-?)[0-9]+$/;
              try {
                if(
                  !regex.test(rec.updatemaxsum) ||
                  !regex.test(rec.updateminsum) ||
                  !regex.test(rec.updatecycle) ||
                  (rec.updatemaxsum === '') ||
                  (rec.updateminsum === '') ||
                  (rec.updatecycle === '')
                  ){
                  throw new Error(inner.ui.text.setAllDataTable.cantmodify);
                }
              }
              catch(e) {
                inner.$popmsg(`[${rec.booth}][${rec.zone}][${rec.robot}][${rec.job}][${rec.axis}] ${e.message}`);
                return;
              }
              inner.setAbnormalStandardValue(rec);
              inner.$popmsg(`[${rec.booth}][${rec.zone}][${rec.robot}][${rec.job}][${rec.axis}] ${inner.ui.text.setAllDataTable.canmodify}`);
            },
          }),
          async sort(order, col, grid) {
            inner.setLoadingDialog(true);
            const length = grid.records.length;
            const data = grid.records;
            let postData = [];
            const regex = /^(-?)[0-9]+$/;
            for (let i = 0, j = 0; i < length; ++i) {
              if (data[i].updatemaxsum !== '' && data[i].updateminsum !== '' && data[i].updatecycle !== '') {
                if (regex.test(data[i].updatemaxsum) && regex.test(data[i].updateminsum) && regex.test(data[i].updatecycle)) {
                  postData[j++] = {
                    factoryid: inner.getFactoryId,
                    boothid: data[i].boothid,
                    zoneid: data[i].zoneid,
                    robotid: data[i].robotid,
                    jobname: `'${data[i].job}'`,
                    axis: data[i].axis,
                    worktime: data[i].updatecycle,
                    configdata: `'{
                      "maxsum": ${data[i].updatemaxsum},
                      "minsum": ${data[i].updateminsum}
                    }'`,
                  }
                }
                else {
                  inner.setLoadingDialog(false);
                  inner.$popmsg(`[${data[i].booth}][${data[i].zone}][${data[i].robot}][${data[i].job}][${data[i].axis}]${inner.ui.text.setAllDataTable.cantmodify}`);
                  return;
                }
              }
              else if (data[i].updatemaxsum !== '' || data[i].updateminsum !== '' || data[i].updatecycle !== '') {
                if (!regex.test(data[i].updatemaxsum) || !regex.test(data[i].updateminsum) || !regex.test(data[i].updatecycle)) {
                  inner.setLoadingDialog(false);
                  inner.$popmsg(`[${data[i].booth}][${data[i].zone}][${data[i].robot}][${data[i].job}][${data[i].axis}]${inner.ui.text.setAllDataTable.cantmodify}`);
                  return;
                }
              }
            }
            await inner.setAllModify(postData)
            .then(() => {
              inner.setLoadingDialog(false);
              inner.$popmsg(`${inner.ui.text.setAllDataTable.canmodify}`);
            })
            .catch((err) => {
              inner.setLoadingDialog(false);
              inner.$popmsg(`${inner.ui.text.setAllDataTable.cantmodify}`);
              inner.$log.error(err);
            });
          }
        }
      ],
      frozenColCount: 1,
      });
      this.handle.dyGrid.theme = this.userTheme;
      this.handle.dyGrid.canvas.id = `dyCanvas`;
      const grid = document.querySelector('#dyGrid');
      const fitToGrid = (grid) => {
        grid.style.height = `${inner.ui.size.setAllDataTable.height}px`;
      }
      const gridScrollable = document.querySelector('.grid-scrollable');
      const fitToGridScrollable = (gridScrollable) => {
        gridScrollable.style.overflowX = "hidden";
      }
      const canvas = document.querySelector('#dyCanvas');
      const fitToCanvas = (canvas) => {
        canvas.style.width = `${inner.ui.size.setAllDataTable.width-10}px`;
        canvas.style.height = `${inner.ui.size.setAllDataTable.height}px`;
        canvas.width = `${inner.ui.size.setAllDataTable.width-10}`;
        canvas.height = `${inner.ui.size.setAllDataTable.height}`;
      }
      fitToGrid(grid);
      fitToCanvas(canvas);
      fitToGridScrollable(gridScrollable);
    },
    getAllRobotData() {
      this.setLoadingDialog(true);
      this.setLoadAllWarningDataFlag(true);
        this.$http.get(`${this.baseUrl}/diagnostics/torqueLoadfactor/data/sum/list`, {
          params: {
            factoryid: this.getFactoryId,
            // date: this.date,
            startDate: this.startDate,
            endDate: this.endDate
          },
        }).then((result) => {
          if (result.data.length === 0) {
            this.$popmsg(this.ui.text.setAllDataTable.dataavailable);
            throw new Error(this.ui.text.setAllDataTable.dataavailable);
          }
          const loopCount = result.data.length;
          const data = result.data;
            for (let i = 0; i < loopCount; ++i) {
              for (let j = 1; j < 8; ++j) {
                  if ((data[i].robot_name !== null)) {
                  this.records.push({
                    booth: data[i].booth_name,
                    zone: data[i].zone_name,
                    robot: data[i].robot_name,
                    boothid: data[i].booth_id,
                    zoneid: data[i].zone_id,
                    robotid: data[i].robot_id,
                    job: data[i].job_name,
                    axis: j,
                    maxsum: (data[i][`maxsum_t${j}`] !== null) ? String(data[i][`maxsum_t${j}`]) : ``,
                    minsum: (data[i][`minsum_t${j}`] !== null) ? String(data[i][`minsum_t${j}`]) : ``,
                    cycle() {
                      if ((data[i].avgcycle['minutes'] === undefined) && (data[i].avgcycle['seconds'] === undefined)) {
                        return `0`;
                      } else if ((data[i].avgcycle['minutes'] === undefined) && (data[i].avgcycle['seconds'] !== undefined)) {
                        return Number(data[i].avgcycle.seconds);
                      } else if ((data[i].avgcycle['seconds'] === undefined)) {
                        return Number(data[i].avgcycle.minutes*60);
                      }
                      return (Number(data[i].avgcycle.minutes)*60 + Number(data[i].avgcycle.seconds));
                    },
                    avgsum: Number(data[i][`avgsum_t${j}`]).toFixed(0),
                    updatemaxsum: (data[i][`maxsum${j}`] !== null) ? String(data[i][`maxsum${j}`]) : ``,
                    updateminsum: (data[i][`minsum${j}`] !== null) ? String(data[i][`minsum${j}`]) : ``,
                    updatecycle: (data[i][`cycle${j}`] !== null) ? String(data[i][`cycle${j}`]) : ``,
                  });
                }
              }
            }
          }).then(() => {
            this.handle.dyGrid.records = this.records;
          }).then(() => {
            this.setLoadingDialog(false);
            this.setLoadAllWarningDataFlag(false);
          }).catch((error) => {
            this.setLoadingDialog(false);
            this.setLoadAllWarningDataFlag(false);
            this.$log.error(error);
          });
    },
    getWarningMargin(warningMargin) {
      this.warnData.data = warningMargin;
    },
    setAbnormalStandardValue(data) {
      let datas = {
        factoryid: this.getFactoryId,
        boothid: data.boothid,
        zoneid: data.zoneid,
        robotid: data.robotid,
        jobname: data.job,
        axis: data.axis,
        worktime: data.updatecycle,
        configdata: {
          maxsum: Number(data.updatemaxsum),
          minsum: Number(data.updateminsum),
        }
      };
      this.$http.post(`${this.baseUrl}/diagnostics/torqueloadfactor/data/abn`, datas
      ).then((result) => {
        if (result.data.length !== 0) {
          throw new Error('Error');
        }
      }).catch((error) => {
        this.$log.error(error);
      });
    },
    setAllModify(data) {
      return this.$http.post(`${this.baseUrl}/diagnostics/torqueloadfactor/allmodify`, {
        data: data,
      }
      ).then((result) => {
        if (result.data.length === 0) {
          throw new Error('Empty Data');
        }
      }).catch((error) => {
        this.$log.error(error);
      });
    },
    invalidate() {
      let inner = this;
      const canvas = document.querySelector('#dyCanvas');
      const fitToCanvas = (canvas) => {
        canvas.style.width = `${inner.ui.size.setAllDataTable.width-10}px`;
        canvas.style.height = `${inner.ui.size.setAllDataTable.height}px`;
        canvas.width = `${inner.ui.size.setAllDataTable.width-10}`;
        canvas.height = `${inner.ui.size.setAllDataTable.height}`;
      }
      fitToCanvas(canvas);
      this.handle.dyGrid.invalidate();
    },
    onCloseToAllSumData() {
      if (!this.isLoadAllWarningDataFlag()) {
        this.$emit('reloadPage');
        this.records = [];
        this.handle.dyGrid.records = [];
        this.handle.setAllWarningDataDlg = false;
      }
    },
    onCloseToSumData() {
      this.handle.setWarningDataDlg = false
    },
    onCreateSetWarnDlg(flag) {
      this.warnData.data = 0;
      this.handle.setWarnConfig = flag;
    },
    onCloseSetWarnDlg() {
      this.invalidate();
      this.handle.setWarnConfig = false;
    },
    onAcceptWarnValue() {
      const regex = /^(-?)[0-9]+$/;
      if(!regex.test(this.warnData.data) || (this.warnData.data === '')) {
        this.$popmsg(this.ui.text.setAllDataTable.cantmodify);
        return;
      }
      const length = this.handle.dyGrid.records.length;
      if (this.flag.enum.warnType === 0) {
        for (let i = 0; i < length; ++i) {
          this.handle.dyGrid.records[i].updatemaxsum = (Number(this.handle.dyGrid.records[i].avgsum) + Number(this.warnData.data) !== 0) ? Number(this.handle.dyGrid.records[i].avgsum) + Number(this.warnData.data) : `0`;
        }
      } else if (this.flag.enum.warnType === 1) {
        for (let i = 0; i < length; ++i) {
          this.handle.dyGrid.records[i].updateminsum = (Number(this.handle.dyGrid.records[i].avgsum) + Number(this.warnData.data) !== 0) ? Number(this.handle.dyGrid.records[i].avgsum) + Number(this.warnData.data) : `0`;
        }
      } else if (this.flag.enum.warnType === 2) {
        for (let i = 0; i < length; ++i) {
          this.handle.dyGrid.records[i].updatecycle = (Number(this.handle.dyGrid.records[i].cycle()) + Number(this.warnData.data) !== 0) ? Number(this.handle.dyGrid.records[i].cycle()) + Number(this.warnData.data) : `0`;
        }
      }
      this.invalidate();
      this.handle.setWarnConfig = false;
    },
    isOnlyNumber(data) {
      const regex = /^(-?)[0-9]+$/;
      if(!regex.test(data) || (data === '')) {
        return this.ui.text.setAllDataTable.onlynumber;
      } else {
        return null;
      }
    },
    setLoadingDialog(flag) {
      this.handle.loadingDlg = flag;
    },
    setLoadAllWarningDataFlag(flag) {
      this.handle.isLoadAllWarningData = flag;
    },
    isLoadAllWarningDataFlag() {
      return this.handle.isLoadAllWarningData;
    },
    getHeaderData() {
      if(this.headerData.length !== 0) {
          this.headers = this.headerData;
      }
    },
    getContentData() {
      if (this.contentData.length !== 0) {
        this.setContentData(this.contentData);
      } else {
        this.setContentData(null);
      }
    },
    initDataTable() {
      if (this.datas.length === 0 && this.headerData.length !== 0) {
        for (let i = 0; i < this.typeDatas.length; ++i) {
          this.datas.push({
            type: this.typeDatas[i].type
          });
        }
      }
    },
    initSetBtnClicked() {
      this.handle.setWarningDataDlg = true;
      // if (this.datas[0].value != '-') {
      //   this.handle.setWarningDataDlg = true;
      // } else {
      //   this.$popmsg(this.ui.text.setAllDataTable.dataavailable);
      // }
    },

    setAllWarningDataClick() {
      if (this.datas[0].value != '-') {
        this.handle.setAllWarningDataDlg = true;
        this.getAllRobotData();
        this.invalidate();
      } else {
        this.$popmsg(this.ui.text.setAllDataTable.dataavailable);
      }
    },
    setContentData(datas) {
        if(datas != null) {
            this.datas = [];
            this.initDataTable();
            this.datas[0]['value'] = datas[0]['maxsum'];
            this.datas[1]['value'] = datas[0]['workingtime'];
        }
        else {
            this.datas = [];
            this.initDataTable();
            this.datas[0]['value'] = '-';
            this.datas[1]['value'] = '-';
        }
    },
    getSettingData(settingData) {
        this.$emit('settingAbnormalData', settingData);
    },
    stdApplyBtnClicked() {
        this.initAcceptFlag = true;
    },
    changeAcceptFlag() {
        this.initAcceptFlag = false;
    },
  }
}
</script>

<style scoped lang="scss">
    @import './abnormalstandardsettingtable';
</style>
