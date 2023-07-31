<template>
    <div>
        <div class="header">
            <div class="zoneAlarmSetTitle">존별 알람 설정</div>
            <v-dialog
              v-model="datas.alarmFileDialog"
              width="600"
              :persistent="true"
            >
              <template v-slot:activator="{ on }">
                <div class="fileButton"><v-btn v-on ="on" icon><v-icon size="30" color="#21976a">mdi-file-import-outline</v-icon></v-btn></div>
              </template>
                <v-card  height="150" class="fileInsertBox">
                  <div class="filebox">
                    <input class="upload-name" id="fileUpload" type="file" accept=".xlsx" @change="importFile" label="File input" />
                  </div>
                  <div class="f_btn">
                    <v-btn color="teal" @click="saveAlarmFile">등록</v-btn>
                    <v-btn color="teal" @click="alarmFileDialog">닫기</v-btn>
                  </div>
              </v-card>
            </v-dialog>
            <div class="fileButton"><v-btn @click="deleteFile" icon><v-icon size="30" color="secondary">mdi-file-remove-outline</v-icon></v-btn></div>
        </div>

        <div class="zoneAlaramDataGrid">
          <DxDataGrid
            id="grid-container"
            :show-borders="true"
            :data-source="datas.alarmInfos"
            key-expr="id"
            :onRowExpanded="openExpand"
            :onRowCollapsed="closeExpand"
          >
            <DxColumn
              data-field="name"
              caption="Zone"
            />
            <DxMasterDetail
              :enabled="true"
              template="masterAlarmDetailTemplate"
            />
            <template #masterAlarmDetailTemplate>
              <div class="detailGrid">
                <DxDataGrid
                  :data-source="datas.alarmData.alarm_list"
                  @saving="saveDataGridItems"
                  ref="detailContainer"
                >
                  <DxEditing
                    :allow-updating="ui.update"
                    :allow-deleting="ui.delete"
                    :allow-adding="ui.add"
                    mode="batch"
                  />
                  <DxPaging :page-size="10"/>
                  <DxColumn data-field="alarm_code" caption='Alarm Code' css-class="alarm-highlighted" />
                  <DxColumn data-field="comment" caption='Description' css-class="alarm-highlighted"/>
                  <DxColumn
                    data-field="level" caption='Level'
                    alignment="center"
                    css-class="dangerAlarm"
                    cell-template="dangerAlarmTemplate"
                    :allow-editing="false"
                  >
                  </DxColumn>
                  <template
                    #dangerAlarmTemplate="{data}"
                  >
                    <v-menu
                      offset-x
                    >
                      <template v-slot:activator="{on, attrs }">
                        <button
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-layout column>
                            <img
                              src="@/images/img_alarm_middle.png"
                              v-if="data.data.level == 1"
                            />
                            <img
                              src="@/images/img_alarm_high.png"
                              v-else-if="data.data.level == 2"
                            />
                            <img
                              src="@/images/img_alarm_low.png"
                              v-else
                            />
                            <div v-if="data.data.level == 1">중</div>
                            <div v-else-if="data.data.level == 2">상</div>
                            <div v-else>하</div>
                          </v-layout>
                        </button>
                      </template>
                      <v-list>
                        <v-list-tile
                          v-for="(item, index) in datas.danger_level"
                          :key="index"
                          @click="clickDangerButton(data,item)"
                        >
                          <v-list-tile-title>{{item.name}}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </template>
                </DxDataGrid>
              </div>
            </template>
          </DxDataGrid>
            <torque-report/>
        </div>
    </div>
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
import TorqueReport from '@/components/diagnostics/report/report/torqueAnalysis/TorqueReport.vue';
import DxButton from 'devextreme-vue/button';
import {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxScrolling,
    DxMasterDetail,
    DxEditing,
} from 'devextreme-vue/data-grid';
import xlsx from "xlsx";
import { mapGetters } from 'vuex';
export default {
    components: {
      DxDataGrid,
      DxColumn,
      DxGrouping,
      DxGroupPanel,
      DxPager,
      DxPaging,
      DxSearchPanel,
      DxScrolling,
      DxMasterDetail,
      TorqueReport,
      DxEditing,
      DxButton
    },
    data() {
        return {
          ui:{
            fileName: null,
            update: true,
            delete: true,
            add: true
          },
          datas : {
            temp: [],
            alarmData : [],
            alarmInfos: [],
            alarmFileDialog : false,
            zoneid: null,
            message: null,
            file: [],
            parsedExel: [],
            options: {
              data: null,
                minDimensions: [10, 10],
            },
            danger_level:[
              {id: 0, name: '하'},
              {id: 1, name: '중'},
              {id: 2, name: '상'},
            ],
          },
        }
    },
    mounted() {
      this.datas.alarmInfos = []
      this.setZoneAlarmGrid();
    },
    computed: {
        ...mapGetters({
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getAuth: 'getAuth',
            getTheme: 'getTheme',
        })
    },
    methods: {
      setZoneAlarmGrid(){
        this.datas.alarmInfos= deepClone(this.getZoneInfos)
      },
      async clickDangerButton(data, item){
        let temp = [];
        temp = deepClone(this.datas.alarmData)
        switch (item.name){
          case '하':
            data.data.level = 0
          break;
          case '중':
            data.data.level = 1
          break;
          case '상':
            data.data.level = 2
          break;
        default:
        }
        let idx = temp.alarm_list.findIndex(el => el.condition_number == data.data.condition_number)
        temp.alarm_list[idx] = data.data
        let Json = JSON.stringify(temp.alarm_list)
        await this.updateAlarmList(Json);
        window.alert('변경되었습니다.')
      },
      importFile(event){
        if (!this.datas.file) {
          this.datas.message = "No File Chosen";
        }
        let input = event.target
        let reader = new FileReader();
         let temp = [];
        reader.onload = async () => {
          let data = reader.result;
          let workbook = xlsx.read(data, {type: 'binary'});
          workbook.SheetNames.forEach(function (sheetName) {
            let rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            rows.forEach((el, index) => {
              el.level = el['비고']; delete el['비고'];
              el.alarm_code = el['디바이스']; delete el['디바이스'];
              el.comment = el['PLC 알람 코멘트']; delete el['PLC 알람 코멘트'];
              el.condition_number = index
              switch(el.level){
                case '상' :
                  el.level = 2
                break;
                case '중' :
                  el.level = 1
                break;
                case '하' :
                   el.level = 0
              default:
              }
            })
            temp = JSON.stringify(rows)
          })
          this.datas.temp = temp
          // await this.updateAlarmList(temp);
        }
        reader.readAsBinaryString(input.files[0])

      },
      deleteFile(){
        if(window.confirm('데이터를 모두 삭제하시겠습니까?')){
          this.updateAlarmList(null)
          this.getAlarmList(this.datas.zoneid)
        }
      },
      async getAlarmList(zoneid){
        await this.$http.get(`/diagnostics/alarmstatistics/zone/${zoneid}/file/alarm/data`)
        .then(async (res) => {
          if(res.data !== ''){
            if(res.data[0].alarm_list !== null){
              this.datas.alarmData = await deepClone(res.data[0])
              this.datas.alarmData.alarm_list.sort(function (a, b){
                return a.alarm_code < b.alarm_code ? -1 : 1;
              })
              this.ui.update = true;
              this.ui.delete = true;
              this.ui.add = true;
            }else{
              this.datas.alarmData = [];
              this.ui.update = false;
              this.ui.delete = false;
              this.ui.add = false;
              window.alert('데이터를 등록해주세요')
            }
          }
        })
      },
      async updateAlarmList(data){
        if(this.datas.zoneid !== null){
          await this.$http.post(`/diagnostics/alarmstatistics/zone/${this.datas.zoneid}/file/alarm/data`, {
            alarm_list : data
          })
        }else{
          window.alert('존을 선택해주세요')
          this.datas.alarmFileDialog = false;
        }
      },
      async saveAlarmFile(){
        let zoneid = this.datas.zoneid
        let zonename = this.getZoneInfos.filter(el => el.id == zoneid)[0].name
        if(typeof this.datas.temp == 'string'){
          this.datas.temp = JSON.parse(this.datas.temp)
        }
        this.datas.temp.forEach(el => {Object.assign(el, {zone_id : zoneid, zone_name : zonename})})
        if(typeof this.datas.temp == 'object'){
          this.datas.temp = JSON.stringify(this.datas.temp)
        }
        if(window.confirm('등록하시겠습니까? ')){
          await this.updateAlarmList(this.datas.temp)
          await this.getAlarmList(this.datas.zoneid);
          this.datas.alarmFileDialog = false
        }
      },
      alarmFileDialog(){
        this.datas.alarmFileDialog = false
        this.ui.fileName = null
      },

      openExpand(e){
        this.datas.zoneid = null;
        if(e.expanded){
          this.datas.zoneid = e.key
          this.getAlarmList(this.datas.zoneid);
        }
      },
      closeExpand(e){
        if(!e.expanded){
          this.datas.zoneid = null
        }
      },
      async saveDataGridItems(e){
        let temp = [];
        temp = deepClone(this.datas.alarmData)
        if(window.confirm('저장하시겠습니까?')){
          e.changes.forEach(el => {
            switch(el.type){
              case 'insert' :
                if(el.data.hasOwnProperty('alarm_code')&&el.data.hasOwnProperty('comment')){
                  if(el.data.hasOwnProperty('level')){
                    temp.alarm_list.push({
                      alarm_code : el.data.alarm_code,
                      comment : el.data.comment,
                      level : el.data.level,
                      condition_number : temp.alarm_list.length
                    })
                  }else{
                    temp.alarm_list.push({
                      alarm_code : el.data.alarm_code,
                      comment : el.data.comment,
                      level : 0,
                      condition_number : temp.alarm_list.length
                    })
                  }
                }else{
                  window.alert('데이터를 전부 입력해주세요')
                }
              break;
              case 'update' :
                let detailRow = null;
                this.$refs.detailContainer.instance.getVisibleRows().forEach(row => {
                  if(row.data.condition_number == el.key.condition_number){
                    detailRow = row.data
                  }
                })
                let idx = temp.alarm_list.findIndex(item => item.condition_number == detailRow.condition_number)
                temp.alarm_list[idx] = detailRow
              break;
              case 'remove' :
                temp.alarm_list.splice(temp.alarm_list.findIndex(item => item.condition_number == el.key.condition_number),1)
            }
          })
        }
        let Json = JSON.stringify(temp.alarm_list)
        await this.updateAlarmList(Json);
        await this.getAlarmList(this.datas.zoneid)
      },
    }
}
</script>

<style scoped lang="scss">
  @import './alarmsettable';

</style>
