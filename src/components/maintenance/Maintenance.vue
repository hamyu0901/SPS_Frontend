<template>
    <v-layout column fill-height :class="['maintenance']">
        <span :class="['maintenance-title']">{{ui.maintenanceTitle}}</span>
        <hard-ware-life-time-table class="mr-3 ml-3"/>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import LoadingDlg from '@/commons/LoadingDlg'
import HardWareLifeTimeTable from '@/components/maintenance/maintenance/HardWareLifeTimeTable.vue'
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
export default {
    components: {
        LoadingDlg,
        HardWareLifeTimeTable
    },
    data(vm) {
        return {
            ui: {
                maintenanceTitle: vm.$t('maintenance.maintenanceTitle'),
                maintenanceTabNames: {
                    hardwareLifeMaintenanceTabName: this.$t(`maintenance.maintenanceTabNames.hardwareLifeMaintenanceTabName`),
                    robotMaintenanceTabName: this.$t(`maintenance.maintenanceTabNames.robotMaintenanceTabName`)
                },
            },
            datas: {
                selectedMaintenanceType: null,
            }
        }
    },
    computed: {
        ... mapGetters({
            getRenewBoothInfos: 'getRenewBoothInfos',
            getRenewZoneInfos: 'getRenewZoneInfos',
            getRenewRobotInfos: 'getRenewRobotInfos',
        })
    },
    created() {
        this.initData();
    },
    mounted() {

    },
    methods: {
        clickReportType(type){
            this.datas.selectedMaintenanceType = type === 0 ? 0 : 1
        },
        initData(){
            this.datas.selectedMaintenanceType = 0;
        },
    }
}
</script>

<style scoped lang="scss">
    @import './maintenance';
</style>
