<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
  <div id="tempMainContainer" v-if="report.report_id" >
      <div id="tempHeader" class="ml-3">
        <div id="report-title-box">
          {{report.report_name}}
        </div>
        <v-spacer/>
        <quick-combo-vue @quickSetting="quickSetting" @selectMonth="selectMonth"></quick-combo-vue>
        <save-reset-vue @onSave="onSave" @onReset="onReset"></save-reset-vue>
      </div>
      <booth-vue
        v-for="(booth, index) in boothes"  :key="index"
        :boothInfo="booth"
        :quickPeriod="quickPeriod"
        ref="child_component"
        @successUpdate="successUpdate"
        @getViolatedData="getViolatedData"
        :violatedDataLength="violatedDataLength"
        @sendCurrentData="sendCurrentData"
        >
      </booth-vue>
  </div>
</template>
<script>
import boothTempVue from './components/boothTemp.vue';
import quickSetterVue from './components/quickSetter.vue';
import saveResetVue from './components/saveReset.vue';
import {mapGetters} from 'vuex';
import EventBus from "@/commons/EventBus";
export default {
    components: {
        quickComboVue: quickSetterVue,
        boothVue: boothTempVue,
        saveResetVue: saveResetVue,
    },
    props:['reports'],
    data(){
        return{
          report: null,
          boothes:[
          ],
          quickPeriod: null,
          saveCount: 0,
          violatedDataLength: 0,
          tempCurrentData: [],
        }
    },
    async created(){
        this.initializeBoothes();
        this.initializeReportData();
        await this.getReportList();
    },
    computed: {
      ...mapGetters({
        getReport : 'getReport'
      }),
      reportDatas(){
        return this.$store.getters['getReport'];
      }
    },
    watch:{
      reportDatas(){
        this.report = this.$store.getters['getReport'];
        this.violatedDataLength = 0 ;
        this.isLoading = true
      },
      async reports(){
        await this.getReportList();
      }
    },
    methods:{
      async getReportList(){
        await this.$http.get(`/diagnostics/report/report`)
        .then((response) => {
          if(response.data.length == 0){
            this.report.report_id = null,
            window.alert('리포트를 생성해주세요')
          }
        });
      },
      // confirmSelectReport(){
      //   let temp = []
      //   let result = {}
      //   if(this.datas.reports.length !== 0){
      //     temp = this.datas.reports.filter(el => el.report_id == this.report.report_id)
      //     result = temp.length !== 0 ? temp[0] : this.datas.reports[this.datas.reports.length-1]
      //   }
      //   return result
      // },
      initializeReportData(){
        this.report = this.$store.getters['getReport'];
      },
      selectMonth(){
        this.violatedDataLength = 0;
        EventBus.$emit('loadingSwitch')
      },
      initializeBoothes(){
          this.$http.get(`/diagnostics/datareport/temperature/factoryInfo`).then(result => {
              if(this.boothes.length !== 0){
                this.boothes.splice(0);
              }
              for(const data of result.data){
                this.boothes.push(data.booth);
              }
          })
      },
      quickSetting(quickPeriod){
        this.quickPeriod = quickPeriod;
      },
      async onSave(){
        this.saveCount = 0;
        this.tempCurrentData = [];
        for(var i = 0; i < this.$refs.child_component.length; i++){
          await this.$refs.child_component[i].childFunc()
        }
      },
      onReset(){

      },
      successUpdate(successedStatus){
        this.saveCount += successedStatus
        if(this.saveCount == 2000){
          window.alert('저장되었습니다.')
        }
      },
      getViolatedData(violatedTemp){
        this.violatedDataLength += violatedTemp
        this.isLoading = this.violatedDataLength == 48 ? false : true
      },
      sendCurrentData(value){
        this.tempCurrentData.push(value)
        if(this.tempCurrentData.length == 10){
            this.updateCurrentData(this.tempCurrentData)
        }
      },
      async updateCurrentData(tempCurrentData){
        let temp = [];
        let isBoolean = (item) => item == true
        tempCurrentData.forEach(el => {
          el.data_list.forEach(item => {
            temp.push(item.hasOwnProperty('avg_temperature'))
          })
        })
        if(temp.every(isBoolean) == true){
          for await (let item of this.tempCurrentData){
            this.$http.post(`/diagnostics/datareport/temperature/save`, item)
            .then((response) => {
              this.saveCount += response.status
              if(this.saveCount == 2000){
                window.alert('저장되었습니다.')
              }
            })
            .catch((err) => {
              console.log(err)
              window.alert('실패하였습니다.')
            })
          }
        }
      }
    }
}
</script>
<style lang="scss" scoped>
  @import './tempAnalysis';
</style>