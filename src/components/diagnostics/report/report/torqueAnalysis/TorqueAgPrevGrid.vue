<template>
    <ag-grid-vue
        style="width: 750px; height:100%;"
		class="ag-theme-dark"
        :columnDefs="datas.prev_option"
		:rowData="element.robot"
		:suppressHorizontalScroll="true"
        :suppressRowTransform="true"
        :undoRedoCellEditing="true"
        :suppressAutoSize="true"
        @grid-ready="onPrevGridReady"
    >
    </ag-grid-vue>
</template>
<script>
import { AgGridVue } from "ag-grid-vue";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';

export default {
    components: {
        AgGridVue
    },
    data() {
        return {
            datas: {
                currentDefaultColDef: {
                    menuTabs: []
                },
                gridApi: null,
                gridColumnApi: null,
                prev_option: [
                    {
                        headerName: '',
                        field: 'name',
                        width: 70,
                        sortable: true,
                        cellStyle: { color: 'white', 'font-weight': 'bold', 'background-color': '#2ada70' },
                    },
                    { headerName: '1축', field: 'violation_count[0]',valueGetter: (params) => { return params.data.previolation_value.current_data.violation_count[0]}, width: 50},
                    { headerName: '2축', field: 'violation_count[1]', valueGetter: (params) => { return params.data.previolation_value.current_data.violation_count[1]}, width: 50 },
                    { headerName: '3축', field: 'violation_count[2]', valueGetter: (params) => { return params.data.previolation_value.current_data.violation_count[2]}, width: 50 },
                    { headerName: '4축', field: 'violation_count[3]', valueGetter: (params) => { return params.data.previolation_value.current_data.violation_count[3]}, width: 50 },
                    { headerName: '5축', field: 'violation_count[4]', valueGetter: (params) => { return params.data.previolation_value.current_data.violation_count[4]}, width: 50 },
                    { headerName: '6축', field: 'violation_count[5]', valueGetter: (params) => { return params.data.previolation_value.current_data.violation_count[5]}, width: 50 },
                    { headerName: '7축', field: 'violation_count[6]', valueGetter: (params) => { return params.data.previolation_value.current_data.violation_count[6]}, width: 50 },
                    { headerName: '위험도', field: "previolation_value.current_data.danger_level", width: 80 },
                    { headerName: '의견', field: "previolation_value.current_data.comment", width: 250, editable : true }
                ]
            }
        }
    },
    methods: {
        onPrevGridReady(prevParams){
            prevParams
        },
    }
}
</script>
