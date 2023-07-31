<template>
    <v-card
        class="opinionBox overflow-hidden"
        color="#272c42"
        dark
    >
        <v-toolbar
            flat
            color="#272c42"
        >
            <v-icon>mdi-account-edit</v-icon>
            <v-toolbar-title class="font-weight-light">
                {{ui.cardTitle}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text v-if="!exportFlag">
            <v-text-field
                v-model="title"
                :counter="datas.maxRuleValue"
                :maxlength="datas.maxRuleValue"
                :rules="ruleTitle"
                label="Title"
                @input="inputTitle"
                :disabled="!isEditing"
                color="white"
            ></v-text-field>
            <v-textarea
                v-model="comment"
                :disabled="!isEditing"
                color="white"
                label="Comment"
                @input="inputComment"
            ></v-textarea>
        </v-card-text>
        <v-card-text :class="['opinionBox-export']" v-if="exportFlag">
            <div>Title</div>
            <p>{{title}}</p>
            <div>Comment</div>
            <p>{{comment}}</p>
        </v-card-text>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {

    props:['title','comment', 'isEditing','exportFlag'],
    /** title : type: String / 종합의견 타이틀*/
    /** comment: type: String / 종합의견 의견란*/
    /** isEditing : type: boolean / 종합의견 쓰기 유무*/
    data(vm){
        return{
            ui: {
                cardTitle: this.$t(`report.hardware.title.opinion`),
            },
            datas: {
                maxRuleValue: 27,
                /** 종합의견 쓰기 유무 btn 활성화 */
                isEditing: false,
            }
        }
    },
    mounted(){

    },
    watch: {
    
    },
    computed: {
        ...mapGetters ({
            getLanguage: 'getLanguage',
        }),
        ruleTitle(){
            let titleRules = [];
            switch(this.getLanguage){
                case 'kr' :
                    titleRules = [v => v.length <=27 || `${this.datas.maxRuleValue}자 이상 쓸 수 없습니다.`]
                break;
                case 'en' :
                    titleRules = [v => v.length <=27 || `You cannot write ${this.datas.maxRuleValue} more than characters.`]
                break;
                case 'cn' :
                    titleRules = [v => v.length <=27 || `您不能写超过 ${this.datas.maxRuleValue} 个字符。`]
                break;
            }
            return titleRules
        }
    },
    methods:{
        inputTitle(title){
            this.$emit('inputZoneOpinion', {
                title : title
            })
        },
        inputComment(comment){
            this.$emit('inputZoneOpinion', {
                comment : comment
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
<style lang="scss" scoped>
    @import './reportzoneopinion';
</style>