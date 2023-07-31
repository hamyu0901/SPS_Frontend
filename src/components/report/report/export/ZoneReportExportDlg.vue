<template>
    <v-dialog
        v-model="isOpen"
        fullscreen
    >
        <zone-report-export-content
            v-bind:zoneInfo="zoneInfo"
            @clickCloseBtn="clickCloseBtn"
        />
    </v-dialog>
</template>
<script>
import ZoneReportExportContent from '@/components/report/report/export/ZoneReportExportContent.vue'
export default {
    components: {
        ZoneReportExportContent,
    },
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        zoneInfo: {
            type: Array
        }
    },
    data(){
        return {

        }
    },
    watch : {

    },
    methods: {
        clickCloseBtn(){
            this.$emit('clickCloseBtn')
        }
    }
}


</script>
