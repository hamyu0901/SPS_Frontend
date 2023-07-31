<template>
    <v-layout :class="['card-carousel-container']" column>
        <v-layout :class="['card-carousel-container__title']"  v-if="title">
            <span>{{title}}</span>
            <v-btn :class="['card-carousel-container__title-btn']" @click="clickTodayAlarmHandler()"><img class="mr-2" src="@/images/monitoring/card/bell.png" alt="today alarm history button image"/>Today Alarm</v-btn>
        </v-layout>
        <v-carousel
            v-if="items.length > 0"
            :class="['card-carousel-container__carousel']"
            :cycle="false"
            hide-delimiters
        >
            <v-carousel-item v-for="count in renderItemsCount(multipleItemCount)" :key="'carouselItem'+(count-1)">
                <v-flex :class="['card-carousel-container__carousel-item-wrapper']">
                    <slot name="cardItem" v-bind="items.slice(((count-1) * multipleItemCount), (((count-1) * multipleItemCount)+ multipleItemCount))"></slot>
                </v-flex>
            </v-carousel-item>
        </v-carousel>
        <v-layout
            v-if="items.length === 0"
            :class="['card-carousel-container__empty']"
        >
            <span>{{datas.locale.emptyText}}</span>
        </v-layout>
    </v-layout>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        },
        items: {
            type: Array,
            required: true
        },
        multipleItemCount: {
            type: Number,
            default: 1
        }
    },

    data: (vm) => ({
        datas: {
            locale: {
                emptyText: vm.$t('monitoring.line.cardCarousel.emptyText'),
            },
        }
    }),

    created() {

    },

    mounted() {
    },

    destroyed() {
    },

    computed: {
        renderItemsCount() {
            return(multipleItemCount) => {
                return this.items.length > 0 ? Math.ceil(this.items.length / multipleItemCount) : 0;
            }
        },
    },

    methods: {
        clickTodayAlarmHandler(){
            this.$emit('onClickTodayAlarmBtnHandler')
        }
    }
}
</script>

<style scoped lang='scss'>
    @import 'CardCarousel';
</style>
