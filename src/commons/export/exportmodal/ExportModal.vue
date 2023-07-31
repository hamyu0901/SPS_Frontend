<template>
    <base-modal :class="['export-modal']" :title="title" :is-open="isOpen" :width="width" @onCloseModal="closeModalHandler">
        <v-layout :class="['export-modal__contents']" column>
            <v-layout :class="['export-modal__contents-search']">
                <date-picker
                    :set-date="datas.date"
                    v-on:getDate="getDate"
                    :not-after-date="datas.fixedDate"
                />
                <button :class="['export-modal__contents-search-button']" @click="exportBtnClickHandler">
                    <v-layout column :class="['export-modal__contents-search-button__container']">
                        <img src="@/images/export.png">
                        <span>Export</span>
                    </v-layout>
                </button>
            </v-layout>
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 500px;"
                :columnDefs="datas.headerItems"
                :suppressMenu="true"
                :suppressContextMenu="true"
                :editType="'fullRow'"
                :defaultColDef="datas.defaultColDef"
                :excelStyles="datas.excelStyles"
                :rowData="datas.contentsItems"
                @gridReady="gridReadyHandler"
            />
        </v-layout>
    </base-modal>
</template>

<script>
import BaseModal from "@/commons/basemodal/BaseModal.vue";
import DatePicker from "@/commons/DatePicker.vue";
import 'ag-grid-enterprise';
import { AgGridVue } from "ag-grid-vue";
import '@/commons/alarmsettableaggrid.css';
import { getPredictExcelExportItemsAPI } from "@/api/diagnostics/predictAPI";

export default {
    props: {
        width: {
            type: Number
        },
        isOpen: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        exportItems: Array
    },

    components: {
        BaseModal,
        DatePicker,
        AgGridVue
    },

    data: (vm) => ({
        datas: {
            date: vm.$moment().subtract(1, 'day').format('YYYY-MM-DD'),
            fixedDate: vm.$moment().subtract(1, 'day').format('YYYY-MM-DD'),
            headerItems: [
                { headerName: 'ZONE', field: 'zone_name', width: 150 },
                { headerName: 'ROBOT', field: 'robot_name', width: 100 },
                { headerName: 'JOB', field: 'job_name', width: 200 },
                { headerName: 'AXIS', field: 'axis', width: 100 },
                { headerName: 'ACCUM-CONFIG', field: 'accum_config', width: 350 },
                { headerName: 'ACCUM-VALUE(AVG)', field: 'accum_value', width: 350 },
                { headerName: 'ACCUM-VIOLATION', field: 'accum_violation', width: 200 },
                { headerName: 'TEMPERATURE-CONFIG', field: 'temperature_config', width: 250 },
                { headerName: 'TEMPERATURE-VALUE(MAX)', field: 'temperature_value', width: 250 },
                { headerName: 'TEMPERATURE-VIOLATION', field: 'temperature_violation', width: 200 }
            ],
            gridApi: null,
            columnApi: null,
            rowClassRules: null,
            defaultColDef: {
                cellClassRules: {
                    'warning': (params) => {
                        return params.data.temperature_violation.includes(1) || params.data.accum_violation.includes(1);
                    },
                },
                cellClass: 'cell-item',
                suppressMenu: true,
            },
            excelStyles: [
                {
                    id: 'warning',
                    interior: {
                        color: '#FF5252',
                        pattern: 'Solid',
                    },
                    font: {
                        fontName: 'Calibri Light',
                        color: '#ffffff',
                    },
                },
                {
                    id: 'cell-item',
                    alignment: {
                        vertical: 'Center',
                        horizontal: 'Center'
                    },
                },
                {
                    id: 'header',
                    alignment: {
                        vertical: 'Center',
                        horizontal: 'Center'
                    },
                },
            ],
            contentsItems: []
        },
    }),

    created() {
        this.datas.rowClassRules = this.setViolationColor();
    },

    mounted() {
    },

    destroyed() {},

    computed: {

    },

    watch: {},

    methods: {
        closeModalHandler() {
            this.$emit('onCloseModal');
        },

        exportBtnClickHandler() {
            this.datas.contentsItems.length > 0 ? this.datas.gridApi.exportDataAsExcel( {sheetName: this.datas.date, fileName: this.datas.date + ' REPORT' }) : alert('No data to export.');
        },

        async getDate(date) {
            this.datas.date = date;
            const predictExcelExportItems = await getPredictExcelExportItemsAPI({ date: date });
            this.datas.contentsItems = predictExcelExportItems.data.length > 0 ?predictExcelExportItems.data.sort((a,b) => b.warning - a.warning) : [];
        },

        gridReadyHandler(params){
            this.datas.gridApi = params.api;
        },

        setViolationColor() {
            return {
                'warning': (params) => {
                    return  params.data.temperature_violation.includes(1) || params.data.accum_violation.includes(1);
                }
            }
        },

    }
}
</script>

<style scoped lang='scss'>
    @import './ExportModal';
</style>