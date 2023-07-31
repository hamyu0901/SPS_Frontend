<template>
    <v-layout :class="['robot-alarm-info-list']">
        <v-card v-if="!confirmItems(items)" :class="['robot-alarm-info-list__card']">
            <v-chip outline color="#2195F3" :class="['robot-alarm-info-list__card-chip']" disabled>{{ datas.items.code }}</v-chip>
            <v-layout v-for="(item) in datas.alarmInfoHeaderData" :key="item.alarm_id">
                <v-expansion-panel :disabled="item.type !== 'expand'" :value="item.value">
                    <v-expansion-panel-content :class="['robot-alarm-info-list__card__content']" v-if="!(item.type === 'expand' && !datas.items[item.value])">
                        <template v-slot:header>
                            <p :class="['robot-alarm-info-list__card__content-header']" >{{item.text}} : </p>
                            <p :class="['robot-alarm-info-list__card__content-contents']" >{{ item.type === 'expand' ? '' : datas.items[item.value]}}</p>
                        </template>
                        <alarm-remedy-card
                            v-if="item.type === 'expand'"
                            :items="datas.items[item.value]"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-layout>
        </v-card>
        <v-card v-if="confirmItems(items)" :class="['robot-alarm-info-list__empty']">
            {{datas.emptyTitle}}
        </v-card>
    </v-layout>  
  </template>

  

  <script>
    import { isEmpty } from 'lodash';
    import AlarmRemedyCard from '../alarmremedycard/AlarmRemedyCard.vue';
    export default {
    props: {
        items : {
            type: Array
        }
    },
    components : { AlarmRemedyCard },
    data(vm) {
      return {
        datas: {
            emptyTitle: vm.$t('monitoring.line.title.emptyTitle'),
            alarmInfoHeaderData: [
                { text: '공정', value: 'name', type: 'text', align: 'center'},
                { text: '서브 코드', value: 'sub_code', type: 'text', align: 'center'},
                { text: '알람 타입', value: 'type_name', type: 'text', align: 'center'},
                { text: '알람 내용', value: 'contents', type: 'text', align: 'center'},
                { text: '발생 원인', value: 'cause', type: 'expand', align: 'center'},
            ],
            items : []
        }
      }
    },

    computed: {

        confirmItems(){
            return (item) => {
                return isEmpty(item)
            }
        }
    },
    mounted() {
        this.datas.items = this.items.length > 0 ? this.items[0] : []
    },

    watch: {
        items : {
            handler(val){
                this.datas.items  = val.length > 0 ? val[0] : []
                
            }
        }
    },

    methods: {

    }
  }
  </script>
  <style scoped lang="scss">
    @import './RobotAlarmInfoList.scss'
  </style>