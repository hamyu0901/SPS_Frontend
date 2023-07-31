<template>
    <v-btn-toggle :class="[`date-type-toggle, elevation-0`]" v-model="datas.dateTypeValue" mandatory>
        <v-btn
            v-for="dateTypeItem in dateTypeItems"
            :key="dateTypeItem.id"
            :value="dateTypeItem.value"
            flat
            @click="() => {dateTypeClickHandler(dateTypeItem.id)}"
        >{{dateTypeItem.title}}</v-btn>
    </v-btn-toggle>
</template>

<script>
export default {
    props: {
        /** 데이터 타입 아이템 */
        dateTypeItems: {
            type: Array,
            required: true,
        }
    },

    data: (vm) => ({
        datas: {
            dateTypeValue: vm.dateTypeItems[0].value
        }
    }),

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    computed: {
    },

    methods: {
        dateTypeClickHandler(dateType) {
            this.$emit('dateTypeClickHandler', dateType);
        }
    }
}
</script>

<style scoped lang='scss'>
    @import 'DateTypeToggle';
</style>