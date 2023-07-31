<template>
    <button @click="clickHandler">
        <v-card :class="['predict-top']">
            <v-card-title :class="['predict-top__title']">
                <v-layout :class="['predict-top__title-value']" column>
                    <v-tooltip v-if="title" top :content-class="{'background-color': 'white'}" color="'red">
                        <template v-slot:activator="{ on }">
                            <span v-on="on">{{title}}</span>
                        </template>
                        <span>{{title}}</span>
                    </v-tooltip>
                    <h1 :class="['predict-top__title-value-count', `text-${check}`, `text-${count > 0 ? 'normal' : 'title'}`]">{{count}}</h1>
                </v-layout>
            </v-card-title>
            <div :class="['predict-top__check']">
                <v-icon :color="datas.checkTextType[check].color" :size="12">{{renderCheckIcon}}</v-icon>
                <span :class="[`text-${check}`]">{{datas.checkTextType[check].text}}</span>
            </div>
        </v-card>
    </button>
</template>

<script>
export default {
    props: {
        topItem: {
            type: Object
        },
        href: String,
        src: {
            type: String,
            required: true
        },
        title: {
            type: String,
        },
        count: {
            type: Number,
            required: true
        },
        check: {
            type: String,
            default: 'normal'
        }
    },
    data: (vm) => ({
        datas: {
            checkTextType: {
                normal: { text: vm.$t('home.main.predictTop.checkType.normal'), color: '#39d9ff' },
                check: { text: vm.$t('home.main.predictTop.checkType.check'), color: '#f1443b' }
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

        renderCheckIcon() {
            return 'mdi-alert-outline'
        }
    },

    methods: {
        clickHandler() {
            this.topItem.violation_count > 0 && this.$emit('onClickTopItem', this.topItem);
        }
    }
}
</script>

<style scoped lang='scss'>
    @import 'PredictTop';
</style>