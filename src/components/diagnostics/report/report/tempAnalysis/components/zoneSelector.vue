<template>
<div id="selectorBox">
    <v-menu
        offset-x
    >
      <template v-slot:activator="{on, attrs }">
        <button
          :disabled="disable"
          v-bind="attrs"
          v-on="on"
        >
        <v-layout column>
          <img
              src="@/images/img_medium.png"
              v-if="selectedItem == 1"
          />
          <img
              src="@/images/img_high.png"
              v-else-if="selectedItem == 2"
          />
          <img
              src="@/images/img_low.png"
              v-else
          />
          <div v-if="selectedItem == 1">중</div>
          <div v-else-if="selectedItem == 2">상</div>
          <div v-else>하</div>
        </v-layout>
      </button>
    </template>
    <v-list>
      <v-list-tile
          v-for="(item, index) in items"
          :key="index"
          @click="changeSelect(item)"
      >
      <v-list-tile-title>{{item.name}}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</div>

</template>
<script>
export default {
    props:['items', 'selectedItem', 'robotId', 'disable'],
    data(){
        return{
        }
    },
    created(){
    },
    mounted(){
    },
    watch:{
    },
    methods:{
      changeSelect(changedItem){
        this.$emit('changeSelect', {robot_id: this.robotId, value: changedItem.index});
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
}
</style>