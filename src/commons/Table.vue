<template>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <table class="no-drag" :style="`background-color: ${propsTheme === 'dark' ? '#2a2a2a' : 'white'}`">
        <thead v-if="withRowHeaders === true">
            <tr style="height: 60px;">
                <th style="width: 9%"></th>
                <th v-for="(x_header, idx) in propsColumn_x" :key="idx" :class="x_value === idx ? 'active' : null" :style="`width: ${'colWidth' in x_header === true ? x_header.colWidth + '%' : 'inherit'}`">
                    <label>{{x_header.colname}}</label>
                </th>
                <slot name="additionals_th"></slot>
            </tr>
        </thead>
        <thead v-else>
            <tr style="height: 60px;">
                <th v-for="(x_header, idx) in propsColumn_x" :key="idx" :class="x_value === idx ? 'active' : null">
                    <label>{{x_header.colName}}</label>
                </th>
                <slot name="additionals_th">

                </slot>
            </tr>
        </thead>
        <tbody v-if="withRowHeaders === true">
            <tr v-for="(y_header, row_index) in propsColumn_y" :key="row_index" >
                <th :class="y_value === row_index ? 'active' : null" >
                    <label>{{y_header.colname}}</label>
                </th>
                <td v-if="tableData.length > 0" v-for="(x_header, column_index) in propsColumn_x" :key="column_index" @mouseover="mouseover(row_index, column_index)" @mouseleave="mouseleave()" >
                    <label v-if="x_header.key[0] === 'avg_temperature'"> {{objectFindByKey(tableData, 'robot_id', y_header.robot_id).violation[0][x_header.array_key]}}({{objectFindByKey(tableData, 'robot_id', y_header.robot_id).avg_temperature[0][x_header.array_key]}})</label>
                    <zone-selector v-if="x_header.key === 'severity'" :items="selectorItems" :selectedItem="objectFindByKey(tableData, 'robot_id', y_header.robot_id).severity" :robotId="y_header.robot_id" @changeSelect="changeSelect"/>
                    <!-- <selector-vue v-if="x_header.key === 'severity'" :disable="isEditable === false" :items="selectorItems" :selectedItem="objectFindByKey(tableData, 'robot_id', y_header.robot_id).severity" :robotId="y_header.robot_id" @changeSelect="changeSelect"></selector-vue> -->
                    <input-vue v-if="x_header.key === 'comment'" :disable="isEditable === false" :model="objectFindByKey(tableData, 'robot_id', y_header.robot_id).comment" :robotId="y_header.robot_id" @changeInput="changeInput"></input-vue>
                </td>
                <td v-if="tableData.length <= 0" v-for="(x_header, column_index) in propsColumn_x" :key="column_index" @mouseover="mouseover(row_index, column_index)" @mouseleave="mouseleave()" >

                </td>
            </tr>
        </tbody>
        <!-- <tbody v-else>
            <tr v-for="(rows, index) in propsData" :key="index" >
                <td v-for="(data, data_index) in rows" :key="data_index" @mouseover="mouseover(index, data_index)" @mouseleave="mouseleave()" >
                    <label>{{data}}{{propsFormat}}</label>
                </td>
                <slot name="additionals_td"></slot>
            </tr>
        </tbody> -->
    </table>
</template>
<script>
import report_inputVue from './report_input.vue';
// import report_selectorVue from './report_selector.vue';
import zoneSelector from '@/components/diagnostics/report/report/tempAnalysis/components/zoneSelector.vue'
export default {
    props: [ "withRowHeaders", "propsColumn_x", "isEditable", "propsColumn_y", "propsData", "propsTheme", "propsFormat"],
    components:{
        // selectorVue: report_selectorVue,
        inputVue: report_inputVue,
        zoneSelector
    },
    data(){
        return{
            selectorItems:[{index: 0, name: '하'}, {index: 1, name: '중'}, {index: 2, name: '상'}],
            selectedCombo:null,
            inputVal: null,
            isActive : false,
            y_value: null,
            x_value: null,
            selectedItem: null,
            inputModel: null,
        }
    },
    created(){
    },
    computed:{
        tableData(){
            return this.propsData;
        }
    },
    methods:{
        changeInput(updatedVal){
            (this.objectFindByKey(this.tableData, 'robot_id', updatedVal.robot_id)).comment = updatedVal.value;
        },
        changeSelect(updatedVal){
            (this.objectFindByKey(this.tableData, 'robot_id', updatedVal.robot_id)).severity = updatedVal.value;
        },
        childFunc(){
            this.$emit('onSave', this.tableData);
        },
        objectFindByKey(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] === value) {
                    return array[i];
                }
            }
            return null;
        },
        mouseover(y, x){
            this.y_value = y;
            this.x_value = x;

        },
        mouseleave(){
            this.y_value = null;
            this.x_value = null;
        },
    }
}
</script>

<style lang="scss" scoped>
table{
    display: table;
    width: 100%;
    margin: 20px auto;
    overflow: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    border: 1px solid #474e6b;
    border-radius: 10px !important;
    background-color: #21263a !important;
    font-family: "Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif;

    thead{
        th:first-child{
            border-left: 0;
            border-bottom: 0;
        }
        th{
            border-left: 1px solid #474e6b;
            border-bottom: 1px solid #474e6b;
            color: white;
            font-weight: bolder;
            &.active{
                background-color: #237ffe;
                color: white;
            }
        }
    }
    tbody{
        tr{
            border-bottom: 1px solid #474e6b;
            background-color: #34394f;
            height: 40px;
            th{
                color:white;
                border-top: 1px solid #474e6b;
                border-right: 1px solid #474e6b;
                background-color: #2159aa;
                height: 55px !important;

                 &.active{
                    background-color: #237ffe;
                    color: white;
                }
            }


            td{
                color: white;
                border-right: 1px solid #474e6b;
                #selectorBox >>> .v-input >>> .v-menu-content{
                    top:0 !important;
                }

                label{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &:hover{
                        background-color:#237ffe;
                        color: white;
                    }
                }

                &:last-child{
                    border-right: none;
                }
            }

            &:last-child{
                border-bottom: none;
            }
        }
        tr:nth-child(2n) {
            background-color: #21263a;
        }

    }
}
</style>