<template>
  <div id="opinion" :class="{expanded: showDetail}">
    <div >
        <v-layout row id="title" >
            <h1 class="opinionHeader">종합의견</h1>
            <div class="headerText">
                {{datas.headerCurrentText}}
            </div>
        </v-layout>
    </div>
    <div id="opinion_right">
        <v-btn color="transparent" @click="expandDiv"><v-icon>mdi-unfold-more-horizontal</v-icon></v-btn>
    </div>
    <div id="opinion_content" v-if="showDetail">
        <v-textarea
          v-model="datas.bodyCurrentText"
          placeholder="의견을 입력해 주세요"
          no-resize
          color="white"
          :value="datas.headerCurrentText"
          @input="inputTextArea"
        ></v-textarea>
    </div>
</div>
</template>

<script>
export default {
    props:['robotInfo'],
    data(){
        return{
            showDetail: false,
            datas: {
                headerCurrentText : "",
                bodyCurrentText: null

            }
        }
    },
    mounted(){
        this.robotInfo.forEach(el => {
            this.datas.headerCurrentText = el.violation_value.comment
            this.datas.bodyCurrentText = el.violation_value.comment
        })
    },
    watch: {
        robotInfo(){
            this.robotInfo.forEach(el => { this.datas.headerCurrentText = el.violation_value.comment})
        }
    },
    methods:{
        expandDiv(){
            this.showDetail = !this.showDetail;
        },
        inputTextArea(opinion){
            this.datas.headerCurrentText = opinion
            this.$emit('inputZoneOpinion', this.datas.headerCurrentText)
        },
    }
}
</script>

<style lang="scss" scoped>
#opinion{
        margin-top: 15px;
        width: 750px;
        position: relative;
        display: flex;
        height: 40px;
        // border: 2px solid #515dbe;
        border: 1px solid #3b69ce;
        border-radius: 5px;
        #opinion_left{
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
            height: 40px;
            display: flex;
            align-items: center;
            padding-left: 10px;
        }
        #opinion_right{
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: right;
            padding-right: 10px;

            button{
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
            button:before{
                content: none !important;
            }
        }
        #opinion_content{
            position: absolute;
            width: 100%;
            height: fit-content;
            padding: 0 10px;
            top:40px;

            > div{
                padding: 0 !important;
                margin: 0 !important;
            }

            >>> .v-input__slot:before, >>> .v-input__slot:after {
                display: none;
            }
        }

}
.headerText{
    margin-top: 10px;
    margin-left: 10px;
    width: 600px;
    height: 30px;
    text-overflow:ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.opinionHeader{
    font-size: 16px;
    margin-left: 10px;
    margin-top: 5px;
    font-weight: bold;
}
.expanded{
    height: 150px !important;
}
</style>