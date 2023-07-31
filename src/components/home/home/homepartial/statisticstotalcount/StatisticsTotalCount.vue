<template>
    <v-card :class="['statistics-total-count']" @click="clickHandler">
        <v-card-title :class="['statistics-total-count-title']">{{title}}</v-card-title>
        <v-layout :class="['statistics-total-count__contents']">
            <h1>{{renderTotalCount(totalCount)}}</h1>
            <v-img :class="['statistics-total-count__contents-image']" :src="renderStatisticsAlarmTypeImage(statisticsAlarmType)" contain :width="200" :height="200"/>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        totalCount: {
            type: Number,
            required: true
        },
        statisticsAlarmType: {
            type: String,
            required: true
        }
    },
    data: (vm) => ({
        datas: {
            statisticsAlarmTypeImgItems: {
                zone: require('@/images/home/statistics_zone_total_count.png'),
                robot: require('@/images/home/statistics_robot_total_count.png')
            },
            locale: {
                count: vm.$t('home.main.count')
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
        renderTotalCount() {
            return (totalCount) => {
                return totalCount + ' ' + this.datas.locale.count;
            }
        },

        renderStatisticsAlarmTypeImage() {
            return (statisticsAlarmType) => {
                return this.datas.statisticsAlarmTypeImgItems[statisticsAlarmType];
            }
        }
    },

    methods: {
        clickHandler() {
            this.totalCount > 0 && this.$emit('onClickTotalCountItem');
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './StatisticsTotalCount';
</style>