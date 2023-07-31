<template>
    <v-layout :class="[{'alarm_status': ui.sub_img !== ui.img},{'alarm_status ml-2': ui.sub_img == ui.img}]">
        <span class="pt-2" v-if="ui.sub_img && ui.sub_img !== ui.img">
            <img :src="ui.sub_img" style="width:26px; height:26px"/>
        </span>
        <span class="pt-2 pl-2 pr-2" v-if="ui.sub_img && ui.sub_img !== ui.img">
            <img src="@/images/report/status_arrow.png"/>
        </span>
        <span>
            <img :src="ui.img"/>
        </span>
    </v-layout>
</template>

<script>
export default {
    props: {
        atomizerAlarmStatusItem :{
            required : true
        },
        atomizerAlarmStatusSubItem:{
            type : Number
        }
    },
    data(){
        return {
            ui: {
                img: null,
                sub_img : null,
            }
        }
    },
    computed: {

    },
    watch: {
        atomizerAlarmStatusItem : {
            immediate : true,
            deep: true,
            handler(item){
                if(item !== undefined){
                    this.ui.img = this.setAlarmStatus(item, 'main')
               }

            }
        },
        atomizerAlarmStatusSubItem : {
            immediate : true,
            deep: true,
            handler(item){
                if(item !== undefined){
                    this.ui.sub_img = this.setAlarmStatus(item, 'sub')

                }
            }
        }
    },
    created(){

    },
    mounted(){

    },
    methods: {
        setAlarmStatus(item, type){
            if(type === 'main'){
                return item == 0 ? require("@/images/report/check_status.png") : item == 1 ? require("@/images/report/alert_status.png") : require("@/images/report/not_status.png")
            }
            else{
                return item == 0 ? require("@/images/report/check_status.png") : item == 1 ? require("@/images/report/alert_status.png") : require("@/images/report/not_status.png")
            }

        }
    }
}
</script>
<style lang="scss" scoped>
    @import './AlarmStatus.scss'
</style>