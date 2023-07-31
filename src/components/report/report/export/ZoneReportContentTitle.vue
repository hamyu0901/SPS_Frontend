<template>
    <v-layout class="titleBox" column>
        <div class="title mb-2"><v-icon class="mr-1 " medium color="#928C8C">mdi-account</v-icon>담당자 종합 의견</div>
        <v-textarea
            v-if="inputBox"
            background-color="grey"
            color="#928C8C"
            outline
            name="input-7-4"
            type="input"
            @input="inputTextArea($event)"
            id="reporttext"
            :value="input"
        >
        </v-textarea>
        <div class="filteredinputBox" v-show="filteredInputBox">
            <p>{{input}}</p>
        </div>
        <div class="title-page">{{this.rows}} / 12 (row)</div>
        <v-layout class="contentBox" column v-bind:class="[{'line_bottom': filteredInputBox}]">
            <div class="contentTitle">
                <img src="@/images/report/robotic-hand.png"/>
                <p>존 별 상태 요약</p>
            </div>
            <v-layout class="mt-1 mb-1">
                <v-flex><div style="background-color:#EF4C28" class="statusBtn">상세 점검 요망</div></v-flex>
                <v-flex><div style="background-color:#2DB67C" class="statusBtn">이상 없음</div></v-flex>
            </v-layout>
            <div >
                <v-layout class="after">
                    <v-flex class="flex_half">
                        <div v-if="alarmStatusReport[0]">
                            <v-layout v-for="(reportItem, index) in alarmStatusReport[0]" :key="index">
                                <zone-status
                                    v-bind:reportItem="reportItem"
                                />
                            </v-layout>
                        </div>
                    </v-flex>
                    <v-flex class="flex_half">
                        <div v-if="nonAlarmStatusReport[0]">
                            <v-layout v-for="(reportItem, index) in nonAlarmStatusReport[0]" :key="index">
                                <zone-status
                                    v-bind:reportItem="reportItem"
                                />
                            </v-layout>
                        </div>
                    </v-flex>
                </v-layout>
            </div>
        </v-layout>
    </v-layout>
</template>
<script>
import ZoneStatus from '@/components/report/report/export/ZoneStatus.vue'
    export default {
        components: {
            ZoneStatus,
        },
        props: {
            filteredInputBox : {
                type: Boolean,
                required: true
            },
            inputBox: {
                type: Boolean,
                required: true
            },
            alarmStatusReport: {
                type: Array,
            },
            nonAlarmStatusReport : {
                type: Array,
            }
        },
        data() {
            return {
                input: "",
                readonly: false,
                rows : 0,
                datas: {
                    alarmStatusReport: [],
                    nonAlarmStatusReport : []
                }
            }
        },
        computed: {
        },
        watch: {
            nonAlarmStatusReport(){
            }
        },
        methods:{
            inputTextArea(value){
                this.rows = document.querySelector('textarea').value.split("\n").length;
                this.rows > 12 ? window.alert('글자 수를 초과하였습니다') : this.input = value
            },
        }
    }
</script>
<style lang="scss" scoped>
@import './zonereportcontenttitle.scss'
</style>