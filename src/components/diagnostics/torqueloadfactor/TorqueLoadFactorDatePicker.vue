<template>
    <date-picker
        class="torqueloadpicker"
        ref="torqueloadpicker"
        v-model ="dateRange"
        :lang="lang"
        range :style="{ width: '220px'}"
        v-bind="[sendDate]"
    >
    </date-picker>
</template>
<script>
export default {
    props: [],
    data() {
        return {
            dateFormat: 'YYYY-MM-DD',
            lang: this.$t(String(`datepicker.lang`)),
            placeholder: {
                date: this.placeHolder
            },
            dateRange: [],
            startDate: null,
            endDate: null
        }
    },
    computed: {
        sendDate(){
            if(this.dateRange.length !==0){
                this.startDate = this.convertDateFormat(this.dateRange[0])
                this.endDate = this.convertDateFormat(this.dateRange[1])
                this.$emit('getDate', {
                    startDate : this.startDate,
                    endDate : this.endDate
                })
            }
            else{
                this.$emit('getDate', {
                    startDate : undefined,
                    endDate : undefined
                })
            }
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle(){
            this.$refs.torqueloadpicker.$refs.input.style.backgroundColor = this.$style.common.datePickerItemInputBackgroundColor;
            this.$refs.torqueloadpicker.$refs.input.style.border = 'none';
            if(this.textColor != undefined) {
                this.$refs.torqueloadpicker.$refs.input.style.color = this.textColor.split(" ")[0];
            }
            else {
                this.$refs.torqueloadpicker.$refs.input.style.color = this.$style.common.datePickerItemInputColor;
            }
            this.$refs.torqueloadpicker.$refs.input.nextElementSibling.style.backgroundColor = this.$style.common.datePickerItemNextElementSiblingBackgroundColor;
            // this.$refs.torqueloadpicker.$refs.input.nextSibling.style.color = this.$style.common.datePickerItemNextSiblingColor;
            this.$refs.torqueloadpicker.$refs.calendar.style.backgroundColor = this.$style.common.datePickerItemCalendarBackgroundColor;
            this.$refs.torqueloadpicker.$refs.calendar.childNodes[2].childNodes[0].style.color = this.$style.common.datePickerItemCalendarColor;
            this.$refs.torqueloadpicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[0].childNodes[0].style.color = this.$style.common.datePickerItemCalendarColor;
            this.$refs.torqueloadpicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[2].style.color = this.$style.common.datePickerItemCalendarColor;
            document.documentElement.style.setProperty("--datePickerAppendBackgroundColor", this.$style.common.datePickerItemAppendBackgroundColor);
        },
        convertDateFormat(date) {
            var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
            if (month.length < 2) {
                month = '0' + month;
            }
            if (day.length < 2) {
                day = '0' + day;
            }
            return [year, month, day].join('-');
        },
    }

}
</script>

<style scoped lang="scss">
   @import './torqueloadfactordatepicker';
</style>
