<template>
    <v-card :class="['base-alarm-remedy-item', 'elevation-0']" >
        <v-card-text :class="['base-alarm-remedy-item__contents']" >
            <v-layout :class="['base-alarm-remedy-item__contents-item']">
              <span :class="['base-alarm-remedy-item__contents-item-key']">{{ui.title.message}}</span>
              <span :class="['base-alarm-remedy-item__contents-item-title']">{{robotAlarmRemedyItem.alarm_message}}</span>
              <span :class="['base-alarm-remedy-item__contents-item-sub-title']">{{robotAlarmRemedyItem.alarm_message_data}}</span>
            </v-layout>
          <v-layout :class="['base-alarm-remedy-item__contents-item']">
            <span :class="['base-alarm-remedy-item__contents-item-key']">{{ui.title.subCode}}</span>
            <span :class="['base-alarm-remedy-item__contents-item-title']">{{robotAlarmRemedyItem.alarm_sub_code}}</span>
          </v-layout>
          <v-layout :class="['base-alarm-remedy-item__contents-item']">
            <span :class="['base-alarm-remedy-item__contents-item-key']">{{ui.title.cause}}</span>
            <span :class="['base-alarm-remedy-item__contents-item-title']">{{robotAlarmRemedyItem.alarm_cause}}</span>
          </v-layout>
          <v-layout :class="['base-alarm-remedy-item__contents-item']">
            <span :class="['base-alarm-remedy-item__contents-item-key']">{{ui.title.solution}}</span>
            <span :class="['base-alarm-remedy-item__contents-item-title']">{{robotAlarmRemedyItem.alarm_solution}}</span>
          </v-layout>
        </v-card-text>
    </v-card>
</template>
<script>
    export default {
        props: {
            robotAlarmRemedyItem: Object
        },
        data(vm) {
            return {
                ui: {
                    title: {
                        message: vm.$t('common.remedyItem.title.message'),
                        subCode: vm.$t('common.remedyItem.title.subCode'),
                        cause: vm.$t('common.remedyItem.title.cause'),
                        solution: vm.$t('common.remedyItem.title.solution'),
                    }
                }
            }
        },
    }
</script>
<style scoped lang="scss">
    @import "BaseAlarmRemedyItem";
</style>
