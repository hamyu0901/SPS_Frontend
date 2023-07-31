<template>
  <v-data-table
    class="elevation-2 violationDetailRecodrTable"
    v-bind="getHeaderData, getContentDatas"
    :items="datas"
    :headers="headers"
    :rowsPerPageItems="[10]"
  >
    <template slot="headers" slot-scope="props">
        <tr>
            <th v-for="header in props.headers" :key="header.id">{{ header.title }}</th>
        </tr>
    </template>
    <template slot="items" slot-scope="props">
        <tr :ref="props.index" :key="props.index">
            <td class="text-xs-center" v-for="header in headers" :key="header.value">{{ props.item[header.id]}}</td>
        </tr>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    props:['headerData', 'contentData', 'highlightFlag'],
    data () {
      return {
            headers: [],
            datas: [],
      }
    },

    created() {
        this.initDataTable();
    },

    computed: {
        getHeaderData() {
            if(this.headerData.length != 0) {
                this.headers = this.headerData;
            }            
        },

        getContentDatas() {
            
        }
    },

    methods: {
        initDataTable() {
            if(this.datas.length == 0 && this.headerData != '') {
                let tempObj = {};
                for(let i = 0; i < this.headerData.length; i++) {
                     tempObj[this.headerData[i].value] = '';
                }   
                for(let i = 0; i < 10; i++) {
                    this.datas.push(tempObj);
                }
            }
        },  
    }

  }
</script>
<style scoped lang="scss">
    @import './violationdetailrecordtable';
</style>
