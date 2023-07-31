<template>
    <v-dialog
        v-model="isOpen"
        fullscreen
        persistent
    >
        <analysis-summary
            v-on:clickCloseBtn="clickCloseBtn"
            v-bind:selectedZoneInfo="selectedZoneInfo"
            v-bind:selectedZoneReport="selectedZoneReport"
            v-bind:prevReport="prevReport"
            v-bind:robotData="robotData"
            v-bind:atomizerData="atomizerData"
            v-bind:tableHeader="tableHeader"
            v-bind:tableHeaderDetail="tableHeaderDetail"
            v-bind:isOpen="isOpen"
            v-bind:chartDatas="chartDatas"
            v-bind:predictAtomizerItems="predictAtomizerItems"
            v-bind:predictSubAtomizerItems="predictSubAtomizerItems"
        />
    </v-dialog>
</template>
<script>
    import AnalysisSummary from '@/components/report/report/export/AnalysisSummary.vue'
    export default {
        components: {AnalysisSummary},
        props: {
            isOpen : {

            },
            selectedZoneInfo: {

            },
            selectedZoneReport: {

            },
            prevReport: {
                default : []
            },
            robotData: {

            },
            tableHeader: {

            },
            tableHeaderDetail: {

            },
            chartDatas: {

            },
            predictAtomizerItems: {

            },
            predictSubAtomizerItems: {

            },
            atomizerData : {

            }
        },

        data(){
            return {

            }
        },
        watch: {

        },
        methods: {
             clickCloseBtn(){
                this.$emit('clickCloseBtn')
            }
        }
    }
</script>