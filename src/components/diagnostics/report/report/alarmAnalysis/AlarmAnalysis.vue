<template>
  <v-layout column>
    <v-layout v-if="datas.reportDetail.length == 0">
      <v-flex class="dateBox pr-2 pt-3" lg3>
        <date-picker v-on:getDate="getPrevDate"></date-picker>
      </v-flex>
      <v-flex class="dateBox pl-2 pr-2 pt-3" lg3>
        <date-picker v-on:getDate="getCurrDate"></date-picker>
      </v-flex>
      <v-flex class="alarmLevelBox pl-2 pt-3">
        <multi-selector
          v-bind:selectorTitle="'AlarmLevel'"
          v-bind:selectorOptions="ui.alarmList"
          v-on:selectedTargets="getZoneAlarm"
        />
      </v-flex>
      <v-dialog v-model="datas.loadingDlg" hide-overlay persistent width="300">
        <v-card color="success" dark>
          <v-card-text>
            옵션 적용 중입니다...
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-flex class="pl-2 pt-2"><v-btn  outline color="white" @click="clickSearchBtn" :fab="true" class="searchBtn"><v-icon>mdi-magnify</v-icon></v-btn></v-flex>
    </v-layout>
    <div class="saveBtn"><v-btn color="#237ffe" @click="clickSaveButton"><v-icon>file_upload</v-icon><label>저장</label></v-btn></div>
    <div class="reportHeader">{{ui.reportHeader}}</div>
    <div v-for="(booth, boothIndex) in datas.boothInfo" :key="boothIndex">
      <div class="boothName">{{booth.name}}</div>
        <div class="zoneBox" column v-for="(element, zoneIndex) in booth.zone" :key="zoneIndex">
          <div class="zoneName">{{element.name}}</div>
          <v-carousel
            class="zone_carousel"
            v-model="model"
            :cycle="false"
            :hide-delimiters="true"
            :hide-controls="true"
            height="100%"
            next-icon="mdi-arrow-right-circle"
            prev-icon="mdi-arrow-left-circle"
          >
            <v-carousel-item
              v-for="(color) in colors"
              :key="color"
            >
              <v-sheet
                class="alarmSheet"
                :color="color"
                height="100%"
                tile
              >
                <v-layout>
                  <v-flex>
                    <priority-list
                      v-bind:priorityTitle="ui.priorityContents[1].title"
                      v-bind:priorityListTitle="element.maxNameHeader"
                      v-bind:priorityDatas="element.maxNameList"
                      v-bind:valueOption="'sum'"
                      v-bind:screenType="'report'"
                      v-bind:paginationColor="ui.paginationColor"
                      v-on:selectedRowData="getSelectedRowData"
                      v-on:selectedAllRowData="getSelectedAllRowData"
                      v-on:priorityFlag="getAlarmNameDetail"
                      v-on:selectedPriorityData="getSelectedPriorityData"
                    >
                    </priority-list>
                    <loading-dlg
                      :loadingFlag="datas.loadingFlag"
                    />
                  </v-flex>
                </v-layout>
                <div class="delimiters pb-2 pt-2">선택한 알람 리스트
                  <v-icon>
                    mdi-arrow-down-bold-outline
                  </v-icon>
                </div>
            </v-sheet>
          </v-carousel-item>
          <alarm-list-table
            v-bind:headerData="ui.alarmInfoTableHeaderData"
            v-bind:contentData="element.alarmInfoTableList"
            v-bind:bindingCatch="bindingCatch"
          >
          </alarm-list-table>
        </v-carousel>
        <div class="pt-2 pb-2"><zone-opinion v-bind:contentData="element" v-bind:bindingCatch="bindingCatch" @inputZoneOpinion="inputZoneOpinion"></zone-opinion></div>
      </div>
    </div>
    <date-aggregation-dlg
      v-bind:priorityFlag="datas.maxAlarmNameFlag"
      v-bind:alarmNameDatas="datas.alarmNameDatas"
      v-bind:alarmCodeDatas="datas.alarmCodeDatas"
      v-bind:dateAggregationDatas="datas.dateAggregationDatas"
      v-bind:datePeriod="[datas.searchDatas.prevDate, datas.searchDatas.currDate]"
      v-on:changePriorityFlag="changePriorityFlag"
      v-bind:alarmType="datas.searchDatas.hasOwnProperty('alarmType')? datas.searchDatas.alarmType : ''"
    ></date-aggregation-dlg>
  </v-layout>
</template>

<script>
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
import {mapGetters} from 'vuex';
import DatePicker from '@/commons/DatePicker'
import MultiSelector from '@/commons/MultiSelector'
import PriorityList from '@/commons/PriorityList'
import GridTable from '@/commons/GridTable'
import AlarmListTable from '@/components/diagnostics/report/report/alarmAnalysis/AlarmListTable';
import LoadingDlg from "@/commons/LoadingDlg.vue"
import zoneOpinion from '@/components/diagnostics/report/report/alarmAnalysis/zoneOpinion';
import DateAggregationDlg from '@/components/diagnostics/alarmstatistics/alarmstatistics/DateAggregationDlg'
export default {
  components: {
    DatePicker,
      MultiSelector,
      PriorityList,
      GridTable,
      AlarmListTable,
      LoadingDlg,
      zoneOpinion,
      DateAggregationDlg
  },
  props:[],
  data(){
    return{
      report: null,
      bindingCatch: 0,
      ui: {
        priorityContents: [
          {title: this.$t(`diagnostics.alarmstatistics.priorityContents.maxAlarmLevelFlag`), flag: 'maxAlarmLevelFlag'},
          {title: this.$t(`diagnostics.alarmstatistics.priorityContents.maxAlarmNameFlag`), flag: 'maxAlarmNameFlag'},
          {listHeader: [{name: '알람 코드'},{name: '알람 타입'},{name: '알람 내용'},{name: '존'},{name: '위험도'}]},
          {listHeader: [{name: 'list', check: 'false'},{name: '알람 코드'},{name: '알람 타입'},{name: '알람 내용'},{name: '존'},{name: '위험도'},{name: '알람 수량'}]}
        ],
        alarmList : [
          {id: 0, name: this.$t(`diagnostics.alarmstatistics.level.lower`), type: 'level'},
          {id: 1, name: this.$t(`diagnostics.alarmstatistics.level.middle`), type: 'level'},
          {id: 2, name: this.$t(`diagnostics.alarmstatistics.level.upper`), type: 'level'}
        ],
        alarmInfoTableHeaderData: [
          { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.date`), value: 'time_stamp', sortable: false, align: 'center'},
          { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmtypename`), value: 'alarm_type_name', sortable: false, align: 'center'},
          { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmcode`), value: 'alarm_code', sortable: false, align: 'center'},
          { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmname`), value: 'alarm_name', sortable: false, align: 'center'},
          { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.zonename`), value: 'zone_name', sortable: false, align: 'center'},
          { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.robotname`), value: 'robot_name', sortable: false, align: 'center'},
          { text: this.$t(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.level`), value: 'level', sortable: false, align: 'center'},
          // { text: 'select', value: 'select', sortable: false, align: 'center'}
        ],
        paginationColor: '#2159aa !important',
        reportHeader: '',
        prevDate: null,
        currDate: null,
      },
      datas: {
        loadingFlag: false,
        loadingDlg: false,
        maxAlarmLevelFlag: false,
        maxAlarmNameFlag: false,
        selectedPriorityData: null,
        selectedPriorityType: '',
        boothInfo: [],
        zoneInfo: [],
        alarmLists: [],
        maxAlarmLevelStatistics: [],
        maxAlarmNameStatistics: [],
        alarmInfoTableContentData: [],
        alarmCodeDatas: [],
        alarmNameDatas: [],
        dateAggregationDatas: [],
        reportDetail: [],
        selectedRowData: {},
        searchDatas: {
          prevDate: '',
          currDate: '',
          selectedAlarmCodes: [],
        },
        robotAlarmCount: [],
        robotAlarmList: [],
      },
      model: 0,
      colors: [
        '#2159aa',
        '#21976a',
      ],
      }
  },
  computed: {
    ...mapGetters({
        baseUrl: 'getBaseUrl',
        getFactoryId: 'getFactoryId',
        getBoothInfos: 'getBoothInfos',
        getZoneInfos: 'getZoneInfos',
        getRobotInfos: 'getRobotInfos',
        getReport : 'getReport',
    }),
    reportDatas(){
      return this.$store.getters['getReport'];
    },
  },
  mounted(){
    this.initData();
    this.report = this.getReport
    this.ui.reportHeader = this.report.report_name
    this.getReportDetail(this.report.report_id)
    this.datas.searchDatas.dateType = 'day'

  },
  watch: {
    reportDatas(){
      this.report = this.$store.getters['getReport'];
      this.ui.reportHeader = this.report.report_name
      this.getReportDetail(this.report.report_id)
      this.getZoneAlarm()
      this.datas.searchDatas.dateType = 'day'
    },
  },
  methods:{
    initData(){
      this.datas.boothInfo = deepClone(this.getBoothInfos)
      this.datas.zoneInfo = deepClone(this.getZoneInfos)
      this.datas.zoneInfo.forEach(el => {
        Object.assign(el , { maxLevelList : [] })
        Object.assign(el, { maxNameList: [] })
        Object.assign(el, { alarmInfoTableList: [] })
        Object.assign(el, { comment: ""})
        Object.assign(el, { maxNameHeader: [{name: 'list', check: 'false'},{name: '알람 코드'},{name: '알람 타입'},{name: '알람 내용'},{name: '존'},{name: '로봇'},{name: '알람 수량'},{name: '위험도'}]})
      })
      this.datas.boothInfo.forEach(boothElement => {
        Object.assign(boothElement, {zone: this.datas.zoneInfo.filter(element => element.booth === boothElement.id)})
        boothElement.zone.sort(function (a, b) {
	        return a.id < b.id ? -1 : 1;
        });
      })
    },
    setLoadingDialog(flag) {
      this.datas.loadingFlag = flag;
    },
    async getReportDetail(report_id){
      this.datas.reportDetail = [];
      await this.$http.get(`diagnostics/report/report/detail/${report_id}`)
      .then(async (response) => {
        if(response.data !== ''){
          response.data.forEach(el => {
            switch(el.report_type){
              case 2: this.datas.reportDetail.push(el)
              break;
            default:
            }
          })
        }
        else{
          this.datas.reportDetail = [];
        }
      })
      .catch((err) => {
        console.error(err);
      })
      if(this.datas.reportDetail.length > 0){
        await this.getReportData();
      }else{
        this.initData()
      }
    },
    getReportData(){
      this.datas.searchDatas.prevDate = this.datas.reportDetail[0].current_start_date.substr(0,10)
      this.datas.searchDatas.currDate = this.datas.reportDetail[0].current_end_date.substr(0,10)
      this.datas.searchDatas.selectedAlarmLevelCodes = ''
      this.datas.searchDatas.maxAlarmLevelCodes = ''
      this.getAlarmDataTableDatas(this.datas.searchDatas)
      this.datas.zoneInfo.forEach(el => {
        this.datas.reportDetail.forEach(item => {
          if(el.id === item.zone_id){
            el.alarmInfoTableList = item.current_data.alarmInfoTableList
            el.alarmInfoTableList.sort(function (a,b) {
              return a.level > b.level ? 1 : -1;
            })
            el.maxLevelList = item.current_data.maxLevelList
            el.maxNameList = item.current_data.maxNameList,
            el.maxNameHeader = item.current_data.maxNameHeader
            el.comment = item.comment
            el.data_id = item.data_id
          }
        })
      })
      this.bindingCatch += 1
    },
    checkTargetDatas(targetDatas) {
      let postDatas = {};
      postDatas['factoryid'] = this.getFactoryId;
      postDatas['prevtime'] = targetDatas.prevDate;
      postDatas['currtime'] = targetDatas.currDate;
      if(targetDatas.selectedAlarmLevelCodes != undefined) {
        postDatas['alarmlevelcodes'] = targetDatas.selectedAlarmLevelCodes;
      }
      if(targetDatas.maxAlarmLevelCodes != undefined) {
        postDatas['maxalarmlevelcodes'] = targetDatas.maxAlarmLevelCodes;
      }
      if(targetDatas.alarmZoneId != undefined){
        postDatas['alarmlevelzones'] = targetDatas.alarmZoneId;
      }
      return postDatas;
    },
    getPrevDate(prevDate) {
      this.datas.searchDatas.prevDate = prevDate;
    },
    getCurrDate(currDate) {
      this.datas.searchDatas.currDate = currDate;
      this.getRobotAlarm(this.datas.searchDatas)  // 로봇 알람만 조회
      this.getPriorityDatas(this.datas.searchDatas)
      this.getAlarmDataTableDatas(this.datas.searchDatas)
    },
    async getPriorityDatas(searchDatas){ // 최고 레벨 , 최다 알람 우선순위
      let targetDatas = {};
      targetDatas = this.checkTargetDatas(searchDatas);
      if(this.datas.searchDatas.prevDate !== undefined && this.datas.searchDatas.currDate !== undefined){
        Promise.all([
          // await this.$http.post(`${this.baseUrl}/diagnostics/alarmstatistics/data/gridtable/statistics/alarmlevel`, targetDatas),
          await this.$http.post(`${this.baseUrl}/diagnostics/alarmstatistics/data/gridtable/statistics/alarmname/day`, targetDatas),
        ])
        .then(([resAlarmName]) => {

          //   this.datas.maxAlarmLevelStatistics = [];
          //   this.datas.maxAlarmNameStatistics = [];
          // if(resAlarmLevelData.data !== ''){
          //   this.datas.maxAlarmLevelStatistics = resAlarmLevelData.data
          //   this.datas.maxAlarmLevelStatistics.forEach(el => {
          //     Object.assign(el, {level: '상'})
          //   })
          // }// 최고 위험도 알람명
          if(resAlarmName.data !== ''){
            this.datas.maxAlarmNameStatistics = resAlarmName.data
            if(this.datas.robotAlarmCount.length !== 0){
              this.datas.robotAlarmCount.forEach(el => {
                this.datas.maxAlarmNameStatistics.push(el)
              })
            }
            this.datas.maxAlarmNameStatistics.forEach((el,index) => {
              Object.assign(el, {check: 'false'})
              this.datas.alarmLists.forEach(item => {
                if(item.alarm_code == el.alarm_code && item.zone_name == el.zone_name && item.zone_id == el.zone_id){
                  el.level = item.level
                }
              })
            })
            if(this.datas.alarmLists.length > 0){
              this.datas.maxAlarmNameStatistics = this.datas.maxAlarmNameStatistics.filter(el => el.hasOwnProperty('level'))
            }else{
              this.datas.maxAlarmNameStatistics.forEach(el => delete el.level)
            }
          } // 최다 발생 알람명
        })
      }
    },
    clickSearchBtn(){
      // this.datas.loadingFlag = true
      this.setLoadingDialog(true)
      this.datas.boothInfo = deepClone(this.getBoothInfos)
      this.datas.zoneInfo.forEach(el => {
        Object.assign(el, {start_date : this.datas.searchDatas.prevDate})
        Object.assign(el, {end_date : this.datas.searchDatas.currDate})
        if(this.datas.maxAlarmLevelStatistics.filter(item => item.zone_id === el.id) !== undefined){
          Object.assign(el , {maxLevelList : this.datas.maxAlarmLevelStatistics.filter(item => item.zone_id === el.id)})
        }else{
          Object.assign(el , {maxLevelList : []})
        }
        if(this.datas.maxAlarmNameStatistics.filter(item => item.zone_id === el.id) !== undefined){
          Object.assign(el , {maxNameList : this.datas.maxAlarmNameStatistics.filter(item => item.zone_id === el.id)})
          el.maxNameList.sort(function (a,b) {
            return a.level > b.level ? 1 : -1;
          })
        }else{
          Object.assign(el , {maxNameList : []})
        }
        el.alarmInfoTableList = [];
      })
      this.datas.boothInfo.forEach(boothElement => {
        Object.assign(boothElement, {zone: this.datas.zoneInfo.filter(element => element.booth === boothElement.id)})
        boothElement.zone.sort(function (a, b) {
	        return a.id < b.id ? -1 : 1;
        });
      })
      setTimeout(() => {this.setLoadingDialog(false)}, 1500)
    },
    getSelectedPriorityData(selectedPriorityData){
      this.datas.selectedPriorityData = selectedPriorityData;
    },
    getAlarmNameDetail(selectedPriorityType){
      this.datas.selectedPriorityType = selectedPriorityType;
      for(let i = 0; i < this.ui.priorityContents.length; i++) {
        if(this.ui.priorityContents[i].title == this.datas.selectedPriorityType) {
          this.datas[this.ui.priorityContents[i].flag] = true;
        }
      }
      this.getAlarmCodeDatas();
      this.getAlarmNameDatas();
      this.getDateAggregationDatas();


    },
    getAlarmCodeDatas(){
      let postDatas = {};
      this.datas.alarmCodeDatas = [];
      postDatas['alarmcode'] = this.datas.selectedPriorityData.option;
      postDatas['alarmtype'] = this.datas.selectedPriorityData.alarm_type;
      this.$http.post(`${this.baseUrl}/diagnostics/alarmstatistics/data/gridtable/statistics/alarm/code`, postDatas)
      .then((result) => {
        if(result.data == '') {
          this.$popmsg(this.$t(`diagnostics.alarmstatistics.popMsg.alarmStatisticsAlarmCode`));
        } else {
          if(postDatas.alarmtype == 0) {
            result.data['alarm_code'] = this.datas.selectedPriorityData.option;
            this.datas.alarmCodeDatas = result.data;
          } else {
            result.data['alarm_code'] = this.datas.selectedPriorityData.option;
            this.datas.alarmCodeDatas = result.data;
          }
        }
      }).catch((error) => {
        this.$log.error(error);
      })
    },
    getAlarmNameDatas() {
            //alarmcode, prevtime, currtime
            //output: date, dt, count
      let postDatas = {};
      this.datas.alarmNameDatas = [];
      postDatas['alarmcode'] = "'" + this.datas.selectedPriorityData.option + "'";
      postDatas['date'] = this.datas.searchDatas.dateType;
      postDatas['prevtime'] = this.datas.searchDatas.prevDate;
      postDatas['currtime'] = this.datas.searchDatas.currDate;
      this.$http.post(`${this.baseUrl}/diagnostics/alarmstatistics/data/gridtable/statistics/alarmname`, postDatas)
      .then((result) => {
        if(result.data == '') {
          this.$popmsg(this.$t(`diagnostics.alarmstatistics.popMsg.alarmStatisticsAlarmName`));
        }
        else {
          this.datas.alarmNameDatas = result.data;
        }
      }).catch((error) => {
        this.$log.error(error);
      })
    },
    getDateAggregationDatas() {
      let postDatas = {};
      this.datas.dateAggregationDatas = [];
      postDatas['factoryid'] = this.getFactoryId;
      postDatas['prevtime'] = this.datas.searchDatas.prevDate;
      postDatas['currtime'] = this.datas.searchDatas.currDate;
      postDatas['alarmcode'] = this.datas.selectedPriorityData.option;
      this.$http.post(`${this.baseUrl}/diagnostics/alarmstatistics/data/gridtable/statistics/alarm/detail/chart`, postDatas)
      .then((result) => {
        if(result.data == '') {
          this.$popmsg(this.$t(`diagnostics.alarmstatistics.popMsg.alarmStatisticsDetailChart`));
        } else {
            this.datas.dateAggregationDatas = result.data;
        }
      }).catch((error) => {
        this.$log.error(error);
      })
      },
    changePriorityFlag() {
      for(let i = 0; i < this.ui.priorityContents.length; i++) {
        if(this.ui.priorityContents[i].title == this.datas.selectedPriorityType) {
          this.datas[this.ui.priorityContents[i].flag] = false;
        }
      }
    },
    async getSelectedRowData(row){
      let temp = [];
      let isSameValue = (element)=> element.alarm_code == row.data.item.option && element.zone_id == row.data.item.zone_id
      temp = this.datas.alarmInfoTableContentData.filter(el => el.alarm_code == row.data.item.option && el.zone_name == row.data.item.value)
      this.datas.zoneInfo.forEach(el => {
        if(el.id === row.data.item.zone_id){
          if(row.header === 'true'){
            el.maxNameHeader[0].check = 'true'
          }else{
            el.maxNameHeader[0].check = 'false'
          }
        }
        temp.forEach(item => {
          if(el.id === item.zone_id){
            if(el.alarmInfoTableList.findIndex(isSameValue) !== -1){
              el.alarmInfoTableList.splice(el.alarmInfoTableList.findIndex(isSameValue),1)
            }
          }
        })
      })
      this.datas.zoneInfo.forEach(el => {
        temp.forEach(item => {
          if(item.zone_id === el.id){
            el.alarmInfoTableList.push(item)
          }
        })
      })

      this.datas.zoneInfo.forEach(el => {
        if(el.name === row.data.item.value ){
          if(row.data.item.check === 'false'){
            if(el.alarmInfoTableList.findIndex(isSameValue) !== -1){
              el.alarmInfoTableList.splice(el.alarmInfoTableList.findIndex(isSameValue))
            }
            if(el.maxNameList.findIndex(isSameValue) !== -1){
              el.maxNameList[el.maxNameList.findIndex(isSameValue)].check = 'false'
            }
          }
          else{
            if(el.maxNameList.findIndex(isSameValue) !== -1){
              el.maxNameList[el.maxNameList.findIndex(isSameValue)].check = 'true'
            }
          }
        }
        el.alarmInfoTableList.sort(function (a,b) {
          return a.level > b.level ? 1 : -1;
        })
      })
      this.bindingCatch += 1
    },
    getSelectedAllRowData(rows){
      let temp = [];
      temp = this.datas.alarmInfoTableContentData.filter(el => rows.data.some(item => el.zone_id == item.zone_id && el.alarm_code == item.option))
      // temp = this.datas.alarmInfoTableContentData.filter(el => el.zone_id == rows.data.zone_id)

      this.datas.zoneInfo.forEach(el => {
        if(el.id === rows.data[0].zone_id){
          if(rows.check === 'true'){
            el.alarmInfoTableList = temp
            el.maxNameList.forEach(item => {
              item.check = 'true'
            })
          }else{
            el.alarmInfoTableList = [];
            el.maxNameList.forEach(item => {
              item.check = 'false'
            })
          }
        }
        el.alarmInfoTableList.sort(function (a,b) {
          return a.level > b.level ? 1 : -1;
        })
      })
      this.bindingCatch += 1
    },
    // selectAllCheckBox(selectedZoneId){
    //   this.datas.zoneInfo.forEach(el => {if(el.id === selectedZoneId){el.alarmInfoTableList = [];}})
    //   this.bindingCatch += 1
    // },
    // selectedRowCheckBox(row){
    //   let isSameValue = (element)=> element.alarm_code == row.alarm_code && element.zone_name == row.zone_name && element.date == row.date
    //   this.datas.zoneInfo.filter(el => el.id === row.zone_id).forEach(item => {
    //     item.alarmInfoTableList.splice(item.alarmInfoTableList.findIndex(isSameValue),1)
    //     if(item.alarmInfoTableList.findIndex(isSameValue) == -1){
    //       let array = item.alarmInfoTableList.find(element => element.alarm_code == row.alarm_code)
    //       if(array == undefined){
    //         item.maxNameList[item.maxNameList.findIndex((element)=> element.alarm_code == row.alarm_code && element.zone_name == row.zone_name)].check = 'false'
    //       }
    //     }
    //   })
    //   this.bindingCatch += 1

    // },
    async getAlarmDataTableDatas(searchDatas){
      let targetDatas = {};
      targetDatas = this.checkTargetDatas(searchDatas);
      this.datas.alarmInfoTableContentData = [];
      if(this.datas.searchDatas.prevDate !== undefined && this.datas.searchDatas.currDate !== undefined){
        await this.$http.post(`/diagnostics/alarmstatistics/data/gridtable`, targetDatas)
        .then((res)=> {
          if(res.data !== ''){
            this.datas.alarmInfoTableContentData = [];
            res.data.forEach(el => {el.level = ''})
            this.datas.alarmInfoTableContentData = res.data
            this.datas.robotAlarmList.forEach(item => {
              this.datas.alarmInfoTableContentData.push(item)
            })
            this.datas.alarmInfoTableContentData.forEach(el => {
              this.datas.alarmLists.forEach(item => {
                if(item.alarm_code == el.alarm_code && item.zone_name == el.zone_name && item.zone_id == el.zone_id){
                  el.level = item.level
                }
              })
            })
            if(this.datas.alarmLists.length > 0){
              this.datas.alarmInfoTableContentData = this.datas.alarmInfoTableContentData.filter(el => el.hasOwnProperty('level') && el.level !== '')
            }else{
              this.datas.alarmInfoTableContentData.forEach(el => delete el.level)
            }
          }
        })
      }
    },
    inputZoneOpinion(opinionInfo){
      this.datas.zoneInfo.forEach(el => {
        if(el.id === opinionInfo.zone_id){el.comment = opinionInfo.text}
      })

    },
    async getZoneAlarm(selectedAlarmLevel){
      if(this.datas.searchDatas.currDate !== undefined && this.datas.searchDatas.prevDate !== undefined){
        this.datas.loadingDlg = true
      }
      await this.$http.get(`/diagnostics/alarmstatistics/zone/${null}/file/alarm/data`)
      .then(async(result) => {
        if(result.data !== ''){
          await this.getAlarmLevelData(selectedAlarmLevel,result.data);
        }
        this.datas.loadingDlg = false
      })
    },
    async getAlarmLevelData(selectedAlarmLevel,data){
      if(this.datas.reportDetail.length > 1){
        selectedAlarmLevel = ['하','중','상']
      }
      let tempFilterAlarmList = [];
      let temp = [];
      let tempArr = [];
      let tempFilterAlarmCode = ''
      let tempFilterAlarmZone = ''
      let tempMaxLevelAlarmList = [];
      let tempFilterMaxLevelAlarmCode = ''
      tempFilterAlarmList = data
      tempFilterAlarmList.forEach(el => {
        el.alarm_list.forEach(item => {
          switch(item.level){
            case 0 :
              item.level = '하'
            break;
            case 1 :
              item.level = '중'
            break;
            case 2 :
              item.level = '상'
            break;
          }
        })
      })
      tempArr = { alarm_list: []};
      tempFilterAlarmList.forEach(data => {
        tempArr['alarm_list'].push(...data.alarm_list)
      })
      if(selectedAlarmLevel !== undefined){
        tempArr = tempArr.alarm_list.filter(item => selectedAlarmLevel.includes(item.level))
      }
      this.datas.alarmLists = await tempArr;
      for(let i = 0; i < tempArr.length; i++){
        let tempdata = "'" + tempArr[i].alarm_code + "'"
        if(i == tempArr.length - 1) {
          tempFilterAlarmCode += tempdata
        }
        else {
          tempFilterAlarmCode += (tempdata + ',');
        }
      } // 체크 된 레벨의 알람 코드
      let array = [];
      if(Array.isArray(tempArr)){
        tempArr.forEach(el => {
          if(el.zone_id !== undefined){
            array.push(el.zone_id)
          }
        })
      }
      array = await [...new Set(array)];
      for(let j = 0; j < array.length; j++){
        let tempzone = "'" + array[j] + "'"
        if(j == array.length - 1) {
          tempFilterAlarmZone += tempzone
        }
        else{
          tempFilterAlarmZone += (tempzone + ',');
        }
      }
      // 체크 된 레벨이 설정된 존 id
      if(Array.isArray(tempArr)){
        tempArr.filter(el => el.level == '상').forEach(item => {
          tempMaxLevelAlarmList.push({
            alarm_code : item.alarm_code,
            zone_id : item.zone_id
          })
        })
      }
      for(let i = 0; i < tempMaxLevelAlarmList.length; i++){
        let tempdata = "'" + tempMaxLevelAlarmList[i].alarm_code + "'"
        if(i == tempMaxLevelAlarmList.length - 1) {
          tempFilterMaxLevelAlarmCode += tempdata;
        }
        else {
          tempFilterMaxLevelAlarmCode += (tempdata + ',');
        }
      } // 위험도 '상'만 표시
      if(this.datas.reportDetail.length == 0){
        this.datas.searchDatas.selectedAlarmLevelCodes = tempFilterAlarmCode
        this.datas.searchDatas.maxAlarmLevelCodes = tempFilterMaxLevelAlarmCode
        this.datas.searchDatas.alarmZoneId = tempFilterAlarmZone
      }
      this.getRobotAlarm(this.datas.searchDatas)
      this.getPriorityDatas(this.datas.searchDatas)
      this.getAlarmDataTableDatas(this.datas.searchDatas)
    },

    //로봇 알람 조회
    async getRobotAlarm(searchData){
      let targetDatas = {};
      targetDatas = this.checkTargetDatas(searchData);
      if(searchData.currDate !== undefined && searchData.prevDate !== undefined){
        Promise.all([
          await this.$http.post(`/diagnostics/alarmstatistics/robot/alarm/data`, targetDatas),
          await this.$http.post(`/diagnostics/alarmstatistics/robot/alarm/data/gridtable`, targetDatas)
        ])
        .then(([resRobotAlarmCount, resRobotAlarm]) => {
          resRobotAlarmCount.data.forEach(el => {
            Object.assign(el, {check: 'false'})
            Object.assign(el, {level : '상'})
          })
          resRobotAlarm.data.forEach(el => {
            Object.assign(el, {level : '상'})
          })
          this.datas.robotAlarmCount = resRobotAlarmCount.data
          this.datas.robotAlarmList = resRobotAlarm.data
        })
      }
    },
    async clickSaveButton(){
      if(window.confirm('저장하시겠습니까?')){
        for await(let item of this.datas.zoneInfo){
          if(item.alarmInfoTableList.length > 0 || item.maxLevelList.length > 0 || item.maxNameList.length > 0 ){
            this.datas.reportDetail.length > 0 ? this.updateReport(item) : this.createReport(item)
          }
        }
      }
      window.alert('저장되었습니다.')
    },
    async createReport(item){
      let data = {
        factory_id: this.getFactoryId,
        booth_id : item.booth,
        zone_id : item.id,
        report_type : 2,
        current_data : {
          alarmInfoTableList: item.alarmInfoTableList,
          maxLevelList: item.maxLevelList,
          maxNameList: item.maxNameList,
          maxNameHeader: item.maxNameHeader
        },
        comment: item.comment,
        current_start_date : this.datas.searchDatas.prevDate,
        current_end_date : this.datas.searchDatas.currDate
      }
      await this.$http.post(`/diagnostics/report/report/${this.report.report_id}`, data)
    },
    async updateReport(item){
      let data = {
        factory_id: this.getFactoryId,
        booth_id : item.booth,
        zone_id : item.id,
        data_id : item.data_id,
        report_type : 2,
        current_data : {
          alarmInfoTableList: item.alarmInfoTableList,
          maxLevelList: item.maxLevelList,
          maxNameList: item.maxNameList,
          maxNameHeader: item.maxNameHeader
        },
        comment: item.comment,
        current_start_date : this.datas.searchDatas.prevDate,
        current_end_date : this.datas.searchDatas.currDate
      }
      await this.$http.put(`/diagnostics/report/report/${this.report.report_id}`, data)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import './alarmAnalysis';
</style>