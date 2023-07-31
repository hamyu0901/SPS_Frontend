<template>
    <v-card :class="['predict-total-count']">
        <v-card-title :class="['predict-total-count-title']">{{title}}</v-card-title>
        <v-layout :class="['predict-total-count__contents']">
            <h1 :class="['predict-total-count__contents-value', `value-${totalCount > 0 ? 'number' : 'text'}`]">{{renderTotalCount(totalCount)}}</h1>
            <v-img v-if="totalCount > 0" :class="['predict-total-count__contents-image']" :src="renderTotalCountTypeImage(totalCountType)" contain :width="45" :height="45"/>
        </v-layout>
    </v-card>
</template>

<script>
/** [TODO]: 위험 여부에 따라 이미지 바꿔줘야 함 */
export default {
    props: {
        /** 타이틀 */
        title: {
            type: String,
            required: true
        },
        /** 전체 카운트 */
        totalCount: {
            type: Number,
            required: true
        },
        /** 알람 타입 */
        predictAlarmType: {
            type: String,
            required: true
        },
        totalCountType: {
            type: String
        }
    },
    data: (vm) => ({
        datas: {
            totalCountType: {
                normal: require('@/images/home/predict_total_count_normal.png'),
                check: require('@/images/home/predict_total_count_check.png')
            },
            locale: {
                emptyText: vm.$t('home.main.predictTotalCount.emptyText')
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
                return totalCount === 0 ? this.datas.locale.emptyText : totalCount;
            }
        },

        renderTotalCountTypeImage() {
            return (totalCountType) => {
                return this.datas.totalCountType[totalCountType];
            }
        }
    },

    methods: {}
}
</script>

<style scoped lang='scss'>
    @import 'PredictTotalCount';
</style>