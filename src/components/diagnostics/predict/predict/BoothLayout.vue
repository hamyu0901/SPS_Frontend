<template>
    <v-layout :class="['predict-booth-layout']" column fill-height>
        <v-layout :class="['predict-booth-layout__title']">
            <v-chip
                disabled
                :color="'#646375'"
                :text-color="'#FFFFFF'"
            >{{renderBoothName}}</v-chip>
        </v-layout>
        <v-layout :class="['predict-booth-layout__board']" column fill-height>
            <predict-board
                v-for="zoneItem in zoneItems"
                :key="zoneItem.zone_id"
                :booth-name="boothItem.booth_name"
                :prev-date="prevDate"
                :zone-item="zoneItem"
                :robot-items="getRobotItems(zoneItem.zone_id)"
            />
        </v-layout>
    </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import PredictBoard from "@/components/diagnostics/predict/predict/PredictBoard";
import { setRobotItems } from "@/utils/utils";

export default {
    components: { PredictBoard },
    props: {
        /** 부스 아이템 */
        boothItem: {
            type: Object,
            required: true
        },
        /** 존 아이템 목록 */
        zoneItems: {
            type: Array,
            required: true
        },
        /** 이전 날짜 (검색 범위 ) */
        prevDate: {
            type: String,
            required: true
        }
    },
    data: () => ({
        datas: {

        }
    }),

    created() {
    },

    mounted() {

    },

    destroyed() {

    },

    computed: {
        ...mapGetters({
            'robotInfos': 'getRenewRobotInfos'
        }),

        renderBoothName() {
            return this.boothItem && this.boothItem.booth_name;
        }
    },

    methods: {
        getRobotItems(zoneId) {
            const robotItems = setRobotItems(this.robotInfos, zoneId);
            return robotItems? robotItems :[];
        },
    }
}
</script>

<style scoped lang='scss'>
  @import './BoothLayout';
</style>
