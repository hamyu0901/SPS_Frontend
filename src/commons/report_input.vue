<template>
<div id="textBox">
    <v-text-field
        v-model="inputModel"
        outlined
        hide-details
        :clearable="!disable"
        :readonly="disable"
        @input="changeInput"
    ></v-text-field>
</div>

</template>
<script>
export default {
    props:['model', 'robotId', 'disable'],
    data(){
        return{
            inputModel: null,
        }
    },
    created(){
        this.initializeInputModel();
    },
    watch:{
        model(){
            this.inputModel = this.model;
        },
    },
    methods:{
        changeInput(inputModel){
            this.$emit('changeInput', {robot_id: this.robotId, value: inputModel})
        },
        initializeInputModel(){
            this.inputModel = this.model !== null ? this.model : null;
        }
    }
}
</script>
<style lang="scss" scoped>
#textBox{
    margin: 10px !important;
    padding: 0 5px !important;
    width: 80px;
}
#textBox >>> input {
    text-align: left;
    font-size: 13px;
    width: 60px !important;
}
#textBox >>> i {
    color:#979db8 !important;
}
#textBox >>> .v-input {
    padding: 3px !important;
    caret-color: #237ffe !important;
    width: 210px !important;
}
#textBox >>> .v-input__slot:before, #textBox >>> .v-input__slot:after{
    display: none;
}
</style>