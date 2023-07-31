<template>
    <v-layout :class="['robot-alarm-list']" column>
        <span :class="['robot-alarm-list-title']">로봇 알람 발생 목록</span>
            <v-card :class="['robot-alarm-list__card']">
                <v-data-table
                    :headers="ui.header"
                    :items="alarmItem"
                    fixed-header
                    item-key="alarm_id"
                    :class="['robot-alarm-list__card-table']"
                    :expand="expand"
                    hide-actions
                    show-expand
                    sticky-header
                >
                    <template v-slot:headers="props" >
                        <tr >
                            <th v-for="header in props.headers" :key="header.text"> {{ header.text }}</th>
                        </tr>
                    </template>
                    <template v-slot:items="props">
                        <tr @click="clickExpanded(props)">
                            <td>{{ props.item.update_time }}</td>
                            <td>{{ props.item.alarm_name }}</td>
                            <td>{{ props.item.code }}</td>
                            <td>
                                <v-icon v-if="props.expanded">mdi-menu-up-outline</v-icon>
                                <v-icon v-else>mdi-menu-down-outline</v-icon>
                            </td>
                        </tr>
                        
                </template>
                <template v-slot:expand="props">
                    <v-card :class="['robot-alarm-list__card-detail']">
                        <v-layout v-for="(header, index) in ui.sub_header" :key="index">
                            <v-flex :class="['robot-alarm-list__card-detail__title']">
                                <p>{{ header.text }}</p>
                            </v-flex>
                            <v-flex :class="['robot-alarm-list__card-detail__contents']">
                                <p v-if="header.value === 'parts'">
                                    <v-layout v-if="Array.isArray(props.item[header.value])" :class="['robot-alarm-list__card-detail__contents__chip']">
                                        <v-chip v-for="(chipItem, chipItemIdx) in props.item[header.value]" :key="chipItemIdx" outline :color="datas.chipColorItems[chipItem.level]">{{ chipItem.item }} </v-chip>
                                    </v-layout>
                                    <v-layout v-else :class="['robot-alarm-list__card-detail__contents__chip']">                                        
                                        {{ props.item[header.value] }}
                                    </v-layout>
                                </p>
                                <p v-else>{{ props.item[header.value] }}</p>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </template>

            </v-data-table>

        </v-card >
        
    </v-layout>
</template>

<script>

    export default {
        props: {
            alarmItem : {
                type : Array
            }
        },

        data(){
            return {
                expand: false,
                ui : {
                    header : [
                        {text : '시간' , value : 'update_time'},
                        {text : '내용' , value : 'alarm_name'},
                        {text : '코드' , value : 'code'},
                        {text : '더보기' , value : 'btn'},
                    ],
                    sub_header : [
                        {text : 'Axis' , value : 'axis'},
                        {text : 'Step' , value : 'step_no'},
                        {text : 'Job' , value : 'job_name'},
                        {text : 'Parts', value : 'parts'}
                    ]
                },
                datas : {
                    alarmItem : [],
                    chipColorItems: ['#16AE77', '#FFA800', '#ED551F']
                }
                
            }
        },
            
        created(){

        },
        watch: {

        },
        methods: {
            clickExpanded(item) {
                item.expanded = !item.expanded
          },

      
        }
    }
</script>

<style scoped lang="scss">
    @import './RobotAlarmList.scss'
</style>