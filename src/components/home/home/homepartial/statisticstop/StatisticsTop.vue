<template>
    <a @click="clickHandler">
        <v-card :class="['statistics-top']">
            <v-layout :class="['statistics-top__container']">
                <v-layout :class="['statistics-top__container-prefix']">
                    <v-img class="['statistics-top__container-prefix-image']" :src="renderTitleImage" contain min-width="24" min-height="24" max-width="24" max-height="24" />
                </v-layout>
                <span :class="['statistics-top__container-title']" v-if="title">{{title}}</span>
                <span :class="['statistics-top__container-title', 'empty-text']" v-else>{{datas.locale.empty}}</span>
                <span :class="['statistics-top__container-count', `${statisticsAlarmType}-count-text`]">{{renderCount}}</span>
            </v-layout>
        </v-card>
    </a>
</template>

<script>
export default {
    props: {
        href: String,
        title: String,
        topItem: {
            type: Object
        },
        statisticsAlarmType: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
    },
    data: (vm) => ({
        datas: {
            titleImage: require('@/images/home/statistics_top.png'),
            locale: {
                title: vm.$t('home.main.statisticsTop.title'),
                count: vm.$t('home.main.count'),
                empty: vm.$t('home.main.empty')
            }
        }
    }),

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    computed: {
        renderTitleImage() {
            return this.datas.titleImage;
        },
        renderCount() {
            return this.count + this.datas.locale.count;
        }
    },

    methods: {
        clickHandler() {
            this.count > 0 && this.$emit('onClickTopItem', this.topItem);
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './StatisticsTop';
</style>