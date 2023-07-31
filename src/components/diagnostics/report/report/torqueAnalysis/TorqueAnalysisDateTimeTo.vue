<template>
    <v-date-picker
        id="calendarBox"
        v-model="date"
        elevation="15"
        :show-current="true"
        locale="ko-kr"
        @input="selectDate"
        >
        <v-btn id="todayBtn" @click="today" color="transparent"><v-icon>mdi-restore</v-icon></v-btn>
    </v-date-picker>
</template>

<script>
export default {
    props:['dateTo'],
    components:{},
    data(){
        return{
            date: '',
        }
    },
    created(){
        this.date = this.dateTo !== "" ? this.dateTo : this.now();
    },
    mounted(){
    },
    watch:{
    },
    methods:{
        today(){
            this.date = this.now();
        },
        now(){
            return new Date().toISOString().substr(0, 10);
        },
        selectDate(date){
            this.$emit('selectDateTimeTo',date)
        },
    }
}
</script>

<style lang="scss" scoped>
#calendarBox{
    position: relative;


    #todayBtn{
        position: absolute;
        top:10px;
        right: 10px;
        display: inline-flex;
        border-style: none !important;
        min-height: 0 !important;
        min-width:0 !important;
        width:fit-content !important;
        height:fit-content !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
    }
}

#calendarBox >>> .v-picker__body div div.v-date-picker-table table thead tr th:first-child {
    color: red !important;
}

#calendarBox >>> .v-picker__body div div.v-date-picker-table table thead tr th:last-child {
    color: blue !important;
}
</style>