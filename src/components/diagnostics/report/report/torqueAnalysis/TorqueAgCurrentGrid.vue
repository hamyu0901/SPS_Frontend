<template>
    <ag-grid-vue
        id="myGrid"
        style="width: 750px"
		class="ag-theme-dark"
        :columnDefs="datas.current_option"
		:rowData="element.robot"
		:suppressHorizontalScroll="true"
        :suppressRowTransform="false"
        :undoRedoCellEditing="true"
        @grid-ready="onGridReady"
        :defaultColDef="datas.currentDefaultColDef"
        :getContextMenuItems="getContextMenuItems"
        @cell-value-changed="onCellValueChanged"
    >
    </ag-grid-vue>
</template>
<script>
import { AgGridVue } from "ag-grid-vue";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';

export default{
    components: {
        AgGridVue
    },
    data(){
        return {
            datas: {
                gridApi: null,
                gridColumnApi: null,
                currentDefaultColDef: {
                    menuTabs: []
                },
                current_option: [
					{
                        headerName: '',
                        field: 'name',
                        width: 70,
                        sortable: true,
                        cellStyle: { color: 'white', 'font-weight': 'bold', 'background-color': '#2f8daf' },
                    },
                    { headerName: '1축', field: 'violation_count[0]',
                    valueGetter: (params) => { return params.data.violation_value.current_data.violation_count[0]}, width: 50,
                    },
                    { headerName: '2축', field: 'violation_count[1]', valueGetter: (params) => { return params.data.violation_value.current_data.violation_count[1]}, width: 50 },
                    { headerName: '3축', field: 'violation_count[2]', valueGetter: (params) => { return params.data.violation_value.current_data.violation_count[2]}, width: 50 },
                    { headerName: '4축', field: 'violation_count[3]', valueGetter: (params) => { return params.data.violation_value.current_data.violation_count[3]}, width: 50 },
                    { headerName: '5축', field: 'violation_count[4]', valueGetter: (params) => { return params.data.violation_value.current_data.violation_count[4]}, width: 50 },
                    { headerName: '6축', field: 'violation_count[5]', valueGetter: (params) => { return params.data.violation_value.current_data.violation_count[5]}, width: 50 },
                    { headerName: '7축', field: 'violation_count[6]', valueGetter: (params) => { return params.data.violation_value.current_data.violation_count[6]}, width: 50 },
                    { headerName: '위험도', field: "violation_value.current_data.danger_level", width: 80 , editable: true,
                        valueGetter: (params) => {
                            let danger = params.data.violation_value.current_data.danger_level
                            if(danger == 0 || danger == null){
                                return '하'
                            }
                            else if(danger == 1){
                                return '중'
                            }
                            else {
                                return '상'
                            }

                        },
                    },
                    { headerName: '의견', field: "violation_value.current_data.comment", width: 250, editable : true, }
				],
            }
        }
    },
    methods: {
        getContextMenuItems(params){
            let result = [
                {
                    name: '하',
                    action: function () {
                        params.node.data.violation_value.current_data.danger_level = 0
                        params.value = '하'
                        window.alert('change ' + params.value);
                    },
                },
                'separator',
                {
                    name: '중',
                    action: function(){
                        params.node.data.violation_value.current_data.danger_level = 1
                        params.value = '중'
                        window.alert('change ' + params.value);
                    }
                },
                'separator',
                {
                    name: '상',
                    action: function(){
                        params.node.data.violation_value.current_data.danger_level = 2
                        params.value = '상'
                        window.alert('change ' + params.value);
                    }
                }
            ]
            return result
        },
        onCellValueChanged(params){
            let colId = params.column.getId();
            params
        },
        onGridReady(params){
            this.datas.gridApi = params.api;
            this.datas.gridColumnApi = params.columnApi;
            this.datas.gridApi.setDomLayout("autoHeight");
        },
    }
}
</script>