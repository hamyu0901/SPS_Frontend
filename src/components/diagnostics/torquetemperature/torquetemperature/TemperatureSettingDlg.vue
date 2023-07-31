<template>
    <v-dialog
        v-model="datas.flag"
        width="800"
    >
        <template v-slot:activator="{ on }">
            <v-btn class="settingBtn" color="#2D2E53" round @click="datas.flag=true" v-on="on"><img class="pr-2" :src='ui.settingIcon'/>Setting</v-btn>
        </template>
        <v-card class="settingContainer">
            <v-toolbar
                card
                color="#FFFFFF"
            >
                <v-icon color="black">mdi-cog</v-icon>
                <v-toolbar-title style="color:black">Setting</v-toolbar-title>
                <v-spacer/>
                <v-btn icon @click="clickCloseBtn"><v-icon color="black">mdi-close</v-icon></v-btn>
            </v-toolbar>
            <v-layout>
                <v-flex class="settingTree">
                    <v-card-text>
                        <v-treeview
                            v-model="datas.selection"
                            :items="datas.boothInfo"
                            item-key="key"
                            open-on-click
                            selectable
                            @input="clickCheckBox"
                            ref="myTreeview"
                            :active.sync="datas.selectedRobotKey"
                            selected-color="#2195F3"
                        >
                        <template slot="label" slot-scope="{ item }">
                                <div @click="selectLabel(item)">{{ item.name }}</div>
                            </template>
                        </v-treeview>
                    </v-card-text>
                </v-flex>
                <v-divider vertical></v-divider>
                <loading-dlg
                    v-bind:loadingFlag="datas.loading"
                ></loading-dlg>
                <v-flex class="settingBox" >
                    <v-card-text>
                        <v-layout>
                            <v-flex class="settingtext"><p>{{datas.selectedRobotInfo}}Temperature:</p></v-flex>
                            <v-flex class="settinginput" :style="ui.inputBoxStyle"><v-text-field v-model="datas.settingValue"></v-text-field></v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-layout class="saveBtnBox"><v-btn color="#2195F3" @click="clickSaveBtn">save</v-btn></v-layout>
                </v-flex>
            </v-layout>
        </v-card>
    </v-dialog>
</template>
<script>
import {mapGetters} from 'vuex'
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
import LoadingDlg from '@/commons/LoadingDlg'
export default {
    props: ['flag'],
    components: {
        LoadingDlg
    },
    data(){
        return {
            ui: {
                settingIcon: require("@/images/setting.png"),
                inputBoxStyle: 'border: solid 1.5px #535151'
            },
            datas: {
                flag : false,
                boothInfo: [],
                zoneInfo: [],
                robotInfo: [],
                settingValue: '',
                selectedRobotAxis: [],
                selection: [],
                selectedRobotKey: [],
                loading: false,
                selectedRobotInfo: '',
            }
        }
},
    computed: {
    ...mapGetters({
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
        })
    },
    mounted(){
        this.datas.flag = this.flag
        this.initInfo();
    },
    watch: {
        flag(){
            this.datas.flag = this.flag
        }
    },
    methods: {
        initInfo(){
            let key = 0;
            this.datas.boothInfo = this.getRenewBoothInfos.map(item => {
                return { booth_id: item.booth_id, name: item.booth_name, booth_no : item.booth_no, key: key +=1, type: 'booth'};
            }).sort(function (a,b) {
                return a.booth_no < b.booth_no ? -1: 1;
            });
            this.datas.zoneInfo = this.getRenewZoneInfos.map(item => {
                return { zone_id: item.zone_id, name: item.zone_name, key: key +=1, zone_no : item.zone_no, booth_id: item.booth_id, type: 'zone'};
            }).sort(function (a,b){
                return a.zone_no < b.zone_no ? -1 : 1;
            })
            this.datas.robotInfo = this.getRenewRobotInfos.map(item => {
                let temp = [];
                for(let i=0; i < item.robot_axis; i++){
                    temp.push({
                        name : i+1 + this.$t(`report.hardware.tableHeader.header.axis`),
                        key : key +=1,
                        robot_id: item.robot_id,
                        index: i+1,
                        robot_axis: item.robot_axis,
                        zone_id : item.zone_id,
                        robot_name: item.robot_name,
                        type: 'axis'
                    })
                }
                return {
                    robot_id: item.robot_id,
                    name: item.robot_name,
                    robot_no : item.robot_no,
                    key: key +=1,
                    zone_id : item.zone_id,
                    children: temp,
                    type: 'robot'
                };
            }).sort(function (a,b){
                return a.robot_no < b.robot_no ? -1 : 1;
            })
            this.datas.zoneInfo.forEach(zoneElement => {
                Object.assign(zoneElement, {children: this.datas.robotInfo.filter(element => element.zone_id === zoneElement.zone_id)})
            })
            this.datas.boothInfo.forEach(boothElement => {
                Object.assign(boothElement, {children: this.datas.zoneInfo.filter(element => element.booth_id === boothElement.booth_id)})
            })
        },
        clickCloseBtn(){
            this.datas.flag = false
            this.datas.settingValue = ''
            this.datas.selection = [];
            this.datas.selectedRobotKey = [];
            this.datas.selectedRobotInfo = ''
            this.ui.inputBoxStyle = 'border: solid 1.5px #535151'
            this.$refs.myTreeview.updateAll(false)
        },
        async clickCheckBox(value){
            let selectedId = [];
            if(value.length > 0){
                this.datas.robotInfo.forEach(el => {
                    el.children.forEach(item => {
                        if(value.includes(item.key)){
                            selectedId.push(item)
                        }
                    })
                })
            }
            this.datas.selectedRobotAxis = deepClone(selectedId)
        },
        selectLabel(value){
            this.datas.selectedRobotKey = [];
            this.datas.settingValue = ''
            this.datas.selectedRobotInfo = ''
            this.ui.inputBoxStyle = 'border: solid 1.5px #535151'
            switch(value.type){
                case 'robot' :
                    this.datas.selectedRobotKey.push(value.children[0].key)
                    this.datas.selectedRobotInfo = `${value.name} ${value.children[0].name}`
                    this.ui.inputBoxStyle = 'border: solid 1.5px #26D38B'
                    this.getAxisConfig(value.children[0])
                break;
                case 'axis' :
                    this.datas.selectedRobotKey.push(value.key)
                    this.datas.selectedRobotInfo = `${value.robot_name} ${value.name}`
                    this.ui.inputBoxStyle = 'border: solid 1.5px #26D38B'
                    this.getAxisConfig(value)
                break;
            default:
            }
        },
        getAxisConfig(value){
            this.datas.loading = true
            this.$http.post(`/diagnostics/torquetemperature/renew/data/temp/limit`, {
                robotid : value.robot_id,
                axis: value.index,
            })
            .then((result) => {
                this.datas.settingValue = result.data !== '' ? result.data[0].temperature_max_spec : ''
                this.datas.loading = false;
            })
            .catch((err) => {
                console.log(err)
                this.datas.settingValue = ''
                this.datas.loading = false;
            })
        },
        async clickSaveBtn(){
            let temp = []
            temp = deepClone(this.datas.selectedRobotAxis)
            if(temp.length > 0){
                    // 로봇 별 config 배열로 넣게 될 시,
                    // let result = temp.reduce((acc, {robot_id, robot_axis, index}) => {
                    //     const item = acc.some(o => o.robot_id == robot_id)? acc.filter(o => o.robot_id == robot_id)[0] : {robot_id, axis: []}
                    //     if(item.axis.length < robot_axis.length){
                    //         const addCnt = fan_type - item.coolingfan.length
                    //         const newArray = Array(addCnt).fill(0)
                    //         item.axis = [...item.axis, ...newArray]
                    //     }
                    //     if(!item.axis[index-1]){
                    //         item.axis[index-1] = this.datas.settingValue
                    //     }
                    //     if(acc.some(o => o.robot_id == robot_id)){
                    //         return acc.map(o => o.robot_id == robot_id ? item : o)
                    //     }else{
                    //         acc.push(item)
                    //         return acc
                    //     }
                    // }, []);
                if(window.confirm(this.$t(`common.window.save`))){
                    for await(let item of temp){
                        await this.$http.put(`/diagnostics/torquetemperature/renew/data/temp/limit`,{
                            robotid : item.robot_id,
                            axis: item.index,
                            config: this.datas.settingValue,
                        })
                    }
                    window.alert(this.$t(`common.window.saved`))
                }
            }else{
                window.confirm(this.$t(`diagnostics.torqueTemperature.window.select`))
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    @import './temperaturesettingdlg';
</style>