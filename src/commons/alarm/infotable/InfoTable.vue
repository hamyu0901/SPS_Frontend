<template>
    <v-layout :class="['alarm-info-table']" column>
        <v-layout
            :class="['alarm-info-table__item']"
            v-for="infoTableItem in infoTableItems"
            :key="infoTableItem.title"
        >
            <v-layout :class="['alarm-info-table__item-header']">
                <span>{{infoTableItem.title}}</span>
            </v-layout>
            <v-layout :class="['alarm-info-table__item-contents']">
                <span v-if="infoTableItem.type === datas.contentsType.text">{{infoTableItem.contents}}</span>
                <img v-if="infoTableItem.type === datas.contentsType.img" :src="infoTableItem.contents" />
                <v-layout :class="['alarm-info-table__item-contents__chip']" v-if="infoTableItem.type === datas.contentsType.chip" wrap>
                    <v-chip v-for="chipItem in infoTableItem.contents" :key="chipItem.header" outline :color="datas.chipColorItems[chipItem.level]">{{chipItem.item}}</v-chip>
                </v-layout>
            </v-layout>
        </v-layout>
    </v-layout>
</template>

<script>
export default {
    props: {
        /**
            header: String,
            contents: String || Object(Array)
            type: Text || Chip
        */
        infoTableItems: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        datas: {
            contentsType: {
                text: 'text',
                chip: 'chip',
                img: 'img'
            },
            chipColorItems: ['#16AE77', '#FFA800', '#ED551F']
        }
    }),

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    computed: {},

    methods: {}
}
</script>

<style scoped lang='scss'>
    @import 'InfoTable';
</style>