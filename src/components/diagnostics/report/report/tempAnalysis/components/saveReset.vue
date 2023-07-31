<template>
  <div id="btnBox" class="ml-3">
      <!-- <v-btn class="btnColor" @click="resetData" :ripple="false"><v-icon>refresh</v-icon><label>리셋</label></v-btn> -->
      <v-btn class="btnColor" @click="saveData" :ripple="false"><v-icon>file_upload</v-icon><label>저장</label></v-btn>
  </div>
</template>

<script>
export default {
    date(){
        return{

        }
    },
    methods:{
        saveData(){
            if (window.confirm("저장하시겠습니까?")){
                this.$emit('onSave');
            }
        },
        resetData(){
            if (window.confirm("되돌리시겠습니까?")){
                this.$emit('onReset');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#btnBox{
    display: flex;
    align-items:  center;
    column-gap: 15px;
    margin-right: 20px;
    button{

        padding: 0 !important;
        margin: 0 !important;
        background: transparent;
        border-style: none !important;
        min-height: 0 !important;
        min-width:0 !important;
        width:fit-content !important;
        height:fit-content !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        -webkit-box-shadow: none !important;

        label{
            margin-left: 5px;
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
        }
    }

    button:before{
        content: none !important;
    }
    .btnColor {
        background-color: #237ffe;
        width: 100px !important;
        height: 40px !important;
        border-radius: 4px !important;
        margin-right: -5px !important;

    }




}
</style>