<template>
    <div class="zonePeriodContent">
    <v-menu
        v-model="datas.menu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        max-width="700px"
        min-width="290px"
    >

        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="datas.zonePeriod"
                hide-details
                readonly
                v-on="on"
                color="primary"
            >
                <template v-slot:append>
                    <v-icon
                        color="#9c9898">
                        mdi-calendar
                    </v-icon>
                </template>
            </v-text-field>
        </template>
        <!-- <torque-analysis-date-time-box
            @closeDateTimeBox="closeDateTimeBox"
            v-bind:zonePeriod="datas.zonePeriod"
            @updateDatePeriod="updateDatePeriod"
        >
        </torque-analysis-date-time-box> -->
    </v-menu>
    </div>
</template>

<script>
import TorqueAnalysisDateTimeBox from '@/components/diagnostics/report/report/torqueAnalysis/TorqueAnalysisDateTimeBox';
export default {
    props: ['robotInfo','bindingCatch'],
    components: {
        TorqueAnalysisDateTimeBox
    },
    data() {
        return {
            datas: {
                menu: false,
                zonePeriod: '',
                startDate: "",
                endDate: "",
            }
        }
    },
    computed: {
    },
    mounted() {
        this.robotInfo.forEach(el => {
            this.datas.start_date = el.violation_value.current_start_date !== null ? el.violation_value.current_start_date.substr(0,10) : ""
            this.datas.end_date = el.violation_value.current_end_date !== null ? el.violation_value.current_end_date.substr(0,10) : ""
            this.datas.zonePeriod = `${this.datas.start_date} ~ ${this.datas.end_date}`
            // if(el.violation_value.current_start_date !== null && el.violation_value.current_end_date !== null){
            //     this.datas.zonePeriod = `${el.violation_value.current_start_date.substr(0,10)}~${el.violation_value.current_end_date.substr(0,10)}`
            // }
        })
    },
    watch: {
        bindingCatch(){
            this.robotInfo.forEach(el => {
                this.datas.start_date = el.violation_value.current_start_date !== null ? el.violation_value.current_start_date.substr(0,10) : ""
                this.datas.end_date = el.violation_value.current_end_date !== null ? el.violation_value.current_end_date.substr(0,10) : ""
                this.datas.zonePeriod = `${this.datas.start_date} ~ ${this.datas.end_date}`
                // if(el.violation_value.current_start_date !== null && el.violation_value.current_end_date !== null){
                //     this.datas.zonePeriod = `${el.violation_value.current_start_date.substr(0,10)}~${el.violation_value.current_end_date.substr(0,10)}`
                // }
            })
        }
    },
    methods: {
        closeDateTimeBox(){
            this.datas.menu = false
        },
        updateDatePeriod(period){
            this.$emit('updateDatePeriod', period)
        }
    }
}
</script>

<style scoped lang="scss">
    .zonePeriodContent{
        width: 255px;
        border: 1px solid #4e546c;
        border-radius: 5px;
        > .v-input {
            padding-top: 0px;
            margin: auto;
            width: 230px;
        }
        >>> .v-input__slot:before, >>> .v-input__slot:after {
            display: none;
        }
    }

</style>