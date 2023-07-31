<template>
  <div id="dateBox">
      <div id="dateHeaderBox">
          <div id="header">
              <label>기간을 선택하여 주세요</label>
          </div>
          <v-btn @click="close" color="transparent" :ripple="false" ><v-icon>close</v-icon></v-btn>
      </div>
      <div id="dateFromToBox">
          <date-time-vue :dateModel.sync="dateFrom"></date-time-vue>
          <date-time-vue :dateModel.sync="dateTo"></date-time-vue>
      </div>
      <div id="dateSaveBox">
          <v-btn @click="changeDatePeriod" color="success">확인</v-btn>
      </div>
  </div>
</template>

<script>
import DateTimeVue from './DateTime.vue'
export default {
    props:['dialog'],
    components:{
        dateTimeVue: DateTimeVue,
    },
    data(){
        return{
            dateFrom: null,
            dateTo: null,
        }
    },
    created(){

    },
    mounted(){

    },
    watch:{

    },
    methods:{
        changeDatePeriod(){
            if(new Date(this.dateFrom) > new Date(this.dateTo)){
                alert("날짜 기간이 잘못 선택되었습니다. 확인하시기바랍니다.");
            }else{
                let period = `${this.dateFrom} ~ ${this.dateTo}`;
                this.$emit('updatePeriod', period);
                this.close();
            }
        },
        close(){
            this.$emit('update:dialog', false);
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