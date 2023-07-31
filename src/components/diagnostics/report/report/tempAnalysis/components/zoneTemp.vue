<template>
    <div id="zoneBox">
        <div id="zoneTitleBox">
            <span class="zoneTitle">{{zoneName}}</span>
        </div>
        <div id="compareBox">
            <current-zone
                :zoneInfo="zoneInfo"
                :robotInfo="robotInfo"
                :quickPeriod="quickPeriod" ref="current" @onSave="onSave"
                @sendDataIdList="sendDataIdList"
                @getViolatedData="getViolatedData"
                :loadingSwitch="isLoading"
                @changeLoading="changeLoading"
            >
            </current-zone>
            <prev-zone :zoneInfo="zoneInfo" :robotInfo="robotInfo" ref="prev" @updateDataId="updateDataId"></prev-zone>
        </div>
    </div>
</template>

<script>
import zoneCurrentVue from './zoneCurrent.vue';
import zonePrevVue from './zonePrev.vue';
import EventBus from "@/commons/EventBus";


export default {
    props:['zoneInfo', 'quickPeriod','violatedDataLength'],
    components: {
        currentZone: zoneCurrentVue,
        prevZone: zonePrevVue,
    },
    data(){
        return{
            prev_data_id_list:[],
            data_id_List_from_curr:[],
            zoneName: null,
            robotInfo: [],
            isLoading : null,
        }
    },
    created(){
        this.setThisZone();
        this.getRobots();
        EventBus.$on('loadingSwitch', this.loadingSwitch)
    },
    watch:{
        violatedDataLength(){
            if(this.violatedDataLength == 48){
                this.isLoading = false;
            }
        }
    },
    computed:{

    },
    methods:{
        loadingSwitch(){
            this.isLoading = null;
        },
        sendDataIdList(prev_data_id_list){
            if(this.data_id_List_from_curr !== 0){
                this.data_id_List_from_curr.splice(0);
            }

            for(const s of prev_data_id_list){
                this.data_id_List_from_curr.push(s);
            }

            this.$refs.prev.updataDataId(this.data_id_List_from_curr);
        },
        async onSave(value){
            value.prev_data_id_list = this.prev_data_id_list;
            this.$emit('sendCurrentData',value)
            // await this.$http.post(`/diagnostics/datareport/temperature/save`, value)
            // .then(async (response) => {
            //     await this.$emit('successUpdate',response.status)
            // })
            // .catch((err) => {
            //     console.log(err)
            //     window.alert('실패하였습니다.')
            // })
        },
        childFunc() {
            this.$refs.current.childFunc();
        },
        updateDataId(dataIdList){
            if(this.prev_data_id_list.length !== 0){
                this.prev_data_id_list.splice(0);
            }

            for(const i of dataIdList){
                this.prev_data_id_list.push(i);
            }
        },
        getReportDetails(report_id){
            this.$refs.current.getReportCurrDetails(report_id);
            this.$refs.prev.getReportPrevDetails(report_id);
        },
        setThisZone(){
            this.zoneName = this.zoneInfo.zone_name;
            this.zoneId = this.zoneInfo.zone_id;
            this.boothId = this.zoneInfo.booth_id;
        },
        getRobots(){ //존별 로봇 데이터 가지고 옴
            this.$http.get(`/diagnostics/datareport/temperature/robotInfo/booth_id/${this.boothId}/zone_id/${this.zoneId}`).then(result => {
                if(this.robotInfo.length !== 0){
                    this.robotInfo.splice(0)
                }

                for(const data of result.data){
                    this.robotInfo.push(data.robot_info);
                }
            })
        },
        getViolatedData(violatedTemp){
            this.$emit('getViolatedData', violatedTemp)
        },
        changeLoading(){
            this.isLoading = null
        }
    }

}
</script>

<style lang="scss" scoped>
#zoneBox{
    display: flex;
    flex-direction: column;
    border: 2px solid #4e546c;
    border-radius: 12px;
    #zoneTitleBox{
        color: white;
        font-size: 10px !important;
        margin-left: 30px;
        margin-top: 20px;
        font-size: 20px !important;
    }
    #compareBox{
        width: 100%;
        display: flex;
    }
    #compareBox > div{
        padding: 30px !important;
    }
}
.zoneTitle {
    font-size: 23px !important;
    font-weight: 600;
}
</style>