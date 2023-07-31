<template>
  <div id="boothBox">
      <div id="boothTitleBox" class="ml-4">
          <span class="boothTitle">{{boothInfo.booth_name}}</span>
      </div>
    <zone-vue v-for="(zone, index) in zones"
        :zoneInfo="zone"
        :key="index"
        :quickPeriod="quickPeriod"
        ref="child_component"
        @successUpdate="successUpdate"
        @getViolatedData="getViolatedData"
        :violatedDataLength="violatedDataLength"
        @sendCurrentData="sendCurrentData"
        >
    </zone-vue>
  </div>
</template>

<script>
import zoneTempVue from './zoneTemp.vue'
export default {
    props:['boothInfo', 'quickPeriod','violatedDataLength'],
    components:{
        zoneVue: zoneTempVue,
    },
    data(){
        return{
            boothId: null,
            boothName: null,
            zones:[],
        }
    },
    created(){
        this.initializeZones();
    },
    methods:{
        childFunc() {
            for(const child_comp of this.$refs.child_component){
                child_comp.childFunc();
            }
        },
        getReportDetails(report_id) {
            for(const child_comp of this.$refs.child_component){
                child_comp.getReportDetails(report_id);
            }
        },
        initializeZones(){
            this.boothId = this.boothInfo.booth_id;
            this.boothName = this.boothInfo.booth_name;

            if(this.zones.length !== 0){
                this.zones.splice(0);
            }

            for(let zone of this.boothInfo.zones){
                zone.booth_id = this.boothId;
                this.zones.push(zone);
            }
        },
        successUpdate(count){
            this.$emit('successUpdate',count)
        },
        getViolatedData(violatedTemp){
            this.$emit('getViolatedData',violatedTemp)
        },
        sendCurrentData(value){
            this.$emit('sendCurrentData',value)
        }
    }
}
</script>

<style lang="scss" scoped>
#boothTitleBox{
    display: flex;
    align-items: center;
    h1{
        font-size: 30px;
        font-weight: 800;
        color: white;
    }
}
// #boothTitleBox >>> .v-divider{
//     margin-left: 15px;
//     border: 1px dashed white;
// }
#boothTitleBox ~ div{
    margin: 30px !important;
}
.boothTitle {
    width: 100px;
    height: 42px;
    font-size: 22px;
    font-weight: bold;
    background-color: #34394f;
    border-radius: 30px;
    text-align: center;
    line-height: 42px;
}
</style>