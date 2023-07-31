<template>
    <div class="zonePeriodContent">
        <v-text-field
            v-model="datas.zonePeriod"
            hide-details
            readonly
            color="primary"
        >
            <template v-slot:append>
                <v-icon
                    color="#9c9898">
                    mdi-calendar
                </v-icon>
            </template>
        </v-text-field>
    </div>
</template>

<script>
export default {
    props: ['robotInfo','bindingCatch'],

    data() {
        return {
            datas: {
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
            this.datas.start_date = el.previolation_value.current_start_date !== null ? el.previolation_value.current_start_date.substr(0,10) : ""
            this.datas.end_date = el.previolation_value.current_end_date !== null ? el.previolation_value.current_end_date.substr(0,10) : ""
            this.datas.zonePeriod = `${this.datas.start_date} ~ ${this.datas.end_date}`
        })
    },
    watch: {
        bindingCatch(){
            this.robotInfo.forEach(el => {
                this.datas.start_date = el.previolation_value.current_start_date !== null ? el.previolation_value.current_start_date.substr(0,10) : ""
                this.datas.end_date = el.previolation_value.current_end_date !== null ? el.previolation_value.current_end_date.substr(0,10) : ""
                this.datas.zonePeriod = `${this.datas.start_date} ~ ${this.datas.end_date}`
            })
        }
    },
}
</script>

<style scoped lang="scss">
    .zonePeriodContent{
        width: 250px;
        border: 1px solid #4e546c;
        border-radius: 4px;
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