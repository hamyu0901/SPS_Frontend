<template>
    <v-layout :class="['listBox']">
       <div :class="['listBox__card']">
            <v-layout v-for="(value,index) in title" :key="index" column>
                <v-layout :class="['listBox__card__box']">
                    <v-flex :class="['listBox__card__box-title']">{{value}}</v-flex>
                    <v-flex :class="['listBox__card__box-between']">:</v-flex>
                    <v-flex v-if="item" :class="['listBox__card__box-contents']">
                        {{Number(item[index]) !== 0 ? item[index] : 0}}
                        <span v-if="percentItem">
                            <span v-if="percentItem[index] !== null && percentItem[index] > 0">
                                <img src="@/images/report/plus.png"/>
                                ({{percentItem[index]}}%)
                            </span>
                            <span v-if="percentItem[index] !== null && percentItem[index] < 0">
                                <img src="@/images/report/minus.png"/>
                                ({{percentItem[index]}}%)
                            </span>
                            <span v-if="percentItem[index] !== null && percentItem[index] === 0">
                                ({{percentItem[index]}}%)
                            </span>
                        </span>
                    </v-flex>
                </v-layout>
            </v-layout>
        </div>
        <v-flex :class="['listBox__circleBox']">
            <span :class="['listBox__circleBox-title']">경고 카운팅</span>
            <v-progress-circular
                :size="120"
                :width="20"
                :value=80
                color="#F5443B"
            >
                   {{count}}
            </v-progress-circular>
            <v-layout column :class="['listBox__circleBox__subTitle']" v-if="config && config.length > 0">
                <v-layout v-if="config && config[0]">
                    <span v-if="config.length > 1">기준값(초과) :</span>
                    <span v-else>기준값(Cmd) :</span>
                    <p class="redFont">{{config[0]}}</p>
                </v-layout>
                <v-layout v-if="config && config[1]"> <span>기준값(미달) :</span> <p class="yellowFont">{{config[1]}}</p> </v-layout>
            </v-layout>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    props: {
        title: {
            type: Array
        },
        item: {
            type: Array
        },
        percentItem: {
            type: Array
        },
        id: {
            type: String
        },
        count: {
            type: Number
        },
        config: {
            type: Array,
        }
    },
    data() {
        return {
            ui: {

            },
            datas : {
                item : []
            }
        }
    },

    watch: {
        config : {
            handler(val){

            }
        }

    },
    mounted(){
        const unFillCircle = document.querySelector('.v-progress-circular__underlay')
        this.id === 'sub' ? unFillCircle.style.stroke = '#5CB0F4' : unFillCircle
    }
}
</script>
<style lang="scss" scoped>
    @import "./ListCard.scss"
</style>