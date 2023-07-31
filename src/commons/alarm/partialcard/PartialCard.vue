<template>
    <v-card :class="['alarm-partial-card']">
        <v-card-title :class="['alarm-partial-card-title']"> {{ title }} </v-card-title>
        <v-layout :class="['alarm-partial-card__contents']">
            <slot></slot>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    props: {
      title: {
          type: String,
          required: true
      }
    },
    data: () => ({
        datas: {}
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
    @import 'PartialCard';
</style>