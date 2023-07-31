<template>
  <div id="opinion" :class="{expanded: showDetail}">
    <div id="opinion_left">
        <div id="title" class="mt-3 ml-2">
            <h1>종합의견</h1>
        </div>
    </div>
    <div id="opinion_right" class="mt-2">
        <v-btn color="transparent" @click="expandDiv"><v-icon>unfold_more</v-icon></v-btn>
    </div>
    <div id="opinion_content" v-if="showDetail" class="mt-3">
        <v-textarea
            :readonly="disabled"
            v-model="opinion"
            placeholder="의견을 입력해 주세요"
            no-resize
            @input="updateText"
            color="white"
        ></v-textarea>
    </div>
</div>
</template>

<script>
export default {
    props:['opinionInput', 'disabled'],
    data(){
        return{
            opinion:null,
            showDetail: true,
        }
    },
    created(){
        this.initInput();
    },
    watch:{
        opinionInput(){
            this.opinion = this.opinionInput;
        }
    },
    methods:{
        updateText(value){
            this.$emit('updateText', value);
        },
        initInput(){
            this.opinion = this.opinionInput !== null ? this.opinionInput : null;
        },
        expandDiv(){
            this.showDetail = !this.showDetail;
        }
    }
}
</script>

<style lang="scss" scoped>
#opinion{
        width: 100%;
        position: relative;
        display: flex;
        height: 60px;
        border: 1px solid #21976a;
        border-radius: 5px;
        #opinion_left{
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
            height: 40px;
            display: flex;
            align-items: center;
            padding-left: 10px;

            #title{
                h1{
                    font-size: 16px;
                    font-weight: 700;
                }
            }
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
.expanded{
    height: 150px !important;
}
</style>