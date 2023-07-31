<template>
  <div id="dateBox">
      <div id="dateHeaderBox">
          <div id="header">
              <label>기간을 선택하여 주세요</label>
          </div>
          <v-btn @click="close" color="transparent" :ripple="false" ><v-icon>close</v-icon></v-btn>
      </div>
      <div id="dateFromToBox">
            <torque-analysis-date-time
                v-bind:dateFrom="datas.dateFrom"
                @selectDateTimeFrom="selectDateTimeFrom"
            >
            </torque-analysis-date-time>
            <torque-analysis-date-time-to
                v-bind:dateTo="datas.dateTo"
                @selectDateTimeTo="selectDateTimeTo"
            />
      </div>
      <div id="dateSaveBox">
          <v-btn @click="changeDatePeriod" color="success">확인</v-btn>
      </div>
  </div>
</template>

<script>
import TorqueAnalysisDateTime from '@/components/diagnostics/report/report/torqueAnalysis/TorqueAnalysisDateTime'
import TorqueAnalysisDateTimeTo from '@/components/diagnostics/report/report/torqueAnalysis/TorqueAnalysisDateTimeTo'
export default {
    props:['zonePeriod'],
    components:{
        TorqueAnalysisDateTime,
        TorqueAnalysisDateTimeTo
    },
    data(){
        return{
            datas: {
                dateFrom: "",
                dateTo: "",
            }
        }
    },
    created(){
        this.datas.dateFrom = this.zonePeriod.substr(0, 10)
        this.datas.dateTo = this.zonePeriod.substr(13)
    },
    mounted(){
    },
    watch:{

    },
    methods:{
        changeDatePeriod(){
            let period = {
                start_date : this.datas.dateFrom,
                end_date: this.datas.dateTo
            }
            this.$emit('updateDatePeriod',period)
            this.$emit('closeDateTimeBox');
        },
        close(){
            this.$emit('closeDateTimeBox');
        },
        selectDateTimeFrom(dateTimeFrom){
            this.datas.dateFrom = dateTimeFrom
        },
        selectDateTimeTo(dateTimeTo){
            this.datas.dateTo = dateTimeTo
        }
    }
}
</script>

<style lang="scss" scoped>
#dateBox{
    display: block;
    #dateHeaderBox, #dateFromToBox, #dateSaveBox{
        width: 100%;
    }
    #dateHeaderBox, #dateSaveBox{
        position: relative;
        button{
            position: absolute;
            top:2px;
            bottom:0;
            right:10px;
            display: inline-flex;
            border-style: none !important;
            min-height: 0 !important;
            min-width:0 !important;
            width:fit-content !important;
            height:fit-content !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
        }
        button:before{
            content: none !important;
        }
    }
    #dateHeaderBox{
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        background-color: #424242;
    }
    #dateFromToBox{
        display: flex;
    }
    #dateSaveBox{
        height: 40px;
        background-color: #424242;
        button{
            width: 40px !important;
            height:25px !important;
        }
    }
}
</style>