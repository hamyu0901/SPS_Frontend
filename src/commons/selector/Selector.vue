<template>
    <v-select
      :class="['selector']"
      v-model="datas.defaultValue"
      :id="id"
      :label="label"
      :items="items"
      v-bind="options"
      @change="onChangeHandler"
    >
    </v-select>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true,
            default: '선택해주세요.'
        },
        items: {
            type: Array,
            required: true
        },
        defaultValue: Object,
        options: Object,
        onChange: {
            type: Function,
            // required: true,
        }
    },

    data: (vm) => ({
       datas: {
            defaultValue: vm.defaultValue ? vm.defaultValue : '' 
       }
    }),

    created() {
    },

    mounted() {},

    destroyed() {},

    computed: {},

    methods: {
        onChangeHandler(e) {
            this.$emit('changedValue', e);
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './Selector.scss';
</style>