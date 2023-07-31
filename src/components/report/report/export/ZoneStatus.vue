<template>
    <v-layout class="statusBox" column>
        <div style="color:black; margin-left : 15px">
            <v-layout>
                <v-flex>
                    <div class="zone_name">{{reportItem.zone_name}}</div>
                </v-flex>
                <v-flex>({{reportItem.report_name}})</v-flex>
            </v-layout>
        </div>
        <div class="tableBox">
            <v-layout style="border-bottom: 1px solid #D9D9D9">
                <v-flex style="max-width: 19%; flex-basis: 19%"><p class="tableBox-title">Hardware</p></v-flex>
                <v-flex><p class="tableBox-title">{{reportItem.hardware_title}}</p></v-flex>
                <v-flex style="max-width: 7%; flex-basis: 7%">
                    <div class="status_image">
                        <img v-if="reportItem.hardware_status === 0" src="@/images/report/status.png"/>
                        <img v-else src="@/images/report/alarm_status.png"/>
                    </div>
                </v-flex>
            </v-layout>
            <v-layout style="border-bottom: 1px solid #D9D9D9">
                <v-flex style="max-width: 19%; flex-basis: 19%"><p class="tableBox-title">Alarm</p></v-flex>
                <v-flex><p class="tableBox-title">{{reportItem.alarm_title}}</p></v-flex>
                <v-flex style="max-width: 7%; flex-basis: 7%">
                    <div class="status_image">
                        <div class="status_image">
                        <img v-if="reportItem.alarm_status === 0" src="@/images/report/status.png"/>
                        <img v-else src="@/images/report/alarm_status.png"/>
                    </div>
                    </div>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex style="max-width: 19%; flex-basis: 19%"><p class="tableBox-title">Atomizer</p></v-flex>
                <v-flex><p class="tableBox-title">{{reportItem.atomizer_title}}</p></v-flex>
                <v-flex style="max-width: 7%; flex-basis: 7%">
                    <div class="status_image">
                        <div class="status_image">
                        <img v-if="reportItem.atomizer_status === 0" src="@/images/report/status.png"/>
                        <img v-else src="@/images/report/alarm_status.png"/>
                    </div>
                    </div>
                </v-flex>
            </v-layout>
        </div>
    </v-layout>
</template>
<script>
    export default {
        props: {
            reportItem: {
                type: Object
            }
        },
        data() {
            return {
            }
        },
        mounted(){
        },
        watch: {
        }
    }
</script>
<style lang="scss" scoped>
@import './zonestatus.scss'
</style>