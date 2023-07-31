<template>
<div id="selectorBox">
<v-select
      id="selector"
      v-model="itemSelected"
      :items="items"
      :item-text="'name'"
      outline
      attach
      :dense="true"
      :hide-details="true"
      :no-data-text="noDataText"
      :disabled="disable"
      return-object
      @change="changeSelect"
      :menu-props="{offsetY: true, top: false, closeOnContentClick: true}"
    >
    <template v-slot:item="{ item }">
          <div>
            {{item.name}}
          </div>
    </template>
    </v-select>
</div>
    
    
</template>
<script>
export default {
    props:['items', 'selectedItem', 'noDataText', 'robotId', 'type', 'disable'],
    data(){
        return{
            itemSelected: null,
        }
    },
    created(){
      this.initializeSelectedItem();
    },
    watch:{
      selectedItem(){
        this.itemSelected = this.objectFindByKey(this.items, 'index', this.selectedItem);
      },
    },
    methods:{
      updateReport(report_id){
        if(report_id === null){
          this.itemSelected = null;
        }else{
          this.itemSelected = this.objectFindByKey(this.items, 'report_id', report_id);
        }
        
      },
      changeSelect(changedItem){
        if(this.type == 'prev_report_selection'){
          this.$emit('selectItem', {report_id: changedItem.report_id});
        }else{
          this.$emit('changeSelect', {robot_id: this.robotId, value: changedItem.index});
        }
        
      },
      initializeSelectedItem(){
        this.itemSelected = this.selectedItem !== null ? this.objectFindByKey(this.items, 'index', this.selectedItem) : null;
      },
      objectFindByKey(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] === value) {
                    return array[i];
                }
            }
            return null;
        },
      
    }
}
</script>
<style lang="scss" scoped>
#selectorBox{
  width: 100%;
  height: 100%;
  padding: 2% 5%;
  display: flex;
  justify-content: center;
  align-items: center;

  .v-input{
    width: 100% !important;
  }
  .v-input >>> .v-input__control .v-input__slot{
    min-height:0 !important;
  }
  .v-input >>> .v-input__control .v-input__slot .v-select__slot{
    height: 25px !important;
  }
  .v-input >>> .v-input__control .v-input__slot .v-select__slot .v-select__selections {
    padding-top:0 !important;
    justify-content: center !important;
    font-size: 13px !important;
  }
  .v-input >>> .v-input__control .v-input__slot .v-select__slot .v-input__append-inner{
    margin: auto !important;

    i{
      font-size: 17px !important;
    }
  }  
  
}
#selectorBox >>> #selector{
  display: none !important;
}



</style>