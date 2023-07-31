<template>
    <date-picker
        class="datepicker"
        ref="datepicker"
        v-model="selectedDate"
        v-bind="[sendDate, getConditionalDate, getSavedDate]"
        type="datetime"
        :lang="lang"
        :format="dateFormat"
        :width="datePickerWidth"
        :placeholder="placeholder.date"
        :minute-step="1"
        :clearable='false'
        confirm
    ></date-picker>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['datePickerWidth', 'conditionalDate', 'placeHolder', 'savedDate'],
    data() {
        return {
            selectedDate: '',
            dateFormat: "YYYY-MM-DD HH:mm",
            lang: this.$t(String(`datepicker.lang`)),
            placeholder: {
                date: this.placeHolder
            },
            
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters ({
            getTheme: "getTheme",
            getLanguage: "getLanguage"    
        }),

        sendDate() {
            if(this.selectedDate != '') {
                this.$emit('getDate', this.convertDateFormat(this.selectedDate));
            }    
        },

        getConditionalDate() {
            if(this.conditionalDate != undefined) {
                this.selectedDate = this.conditionalDate;
            }
        },

        getSavedDate() {
            if(this.savedDate != undefined) {
                this.selectedDate = this.savedDate;
            }
        }

    },

    methods: {
        initializeStyle() {
            this.$refs.datepicker.$refs.input.style.height="48px";
            this.$refs.datepicker.$refs.input.style.backgroundColor = this.$style.common.dateTimePickerItemInputBackgroundColor;
            this.$refs.datepicker.$refs.input.style.border = this.$style.common.dateTimePickerItemInputBorder;
            this.$refs.datepicker.$refs.input.style.color = this.$style.common.dateTimePickerItemInputColor;
            this.$refs.datepicker.$refs.input.nextElementSibling.style.backgroundColor = this.$style.common.dateTimePickerItemNextElementSiblingBackgroundColor;
            this.$refs.datepicker.$refs.input.nextSibling.nextSibling.childNodes[0].childNodes[2].style.color = this.$style.common.dateTimePickerItemNextSiblingColor;
            this.$refs.datepicker.$refs.calendar.style.backgroundColor = this.$style.common.dateTimePickerItemCalendarBackgroundColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[0].style.color = this.$style.common.dateTimePickerItemCalendarColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[0].childNodes[0].style.color = this.$style.common.dateTimePickerItemCalendarColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[0].childNodes[1].style.color = this.$style.common.dateTimePickerItemCalendarColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[2].style.color = this.$style.common.dateTimePickerItemCalendarColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[4].style.color = this.$style.common.dateTimePickerItemCalendarColor;
            document.documentElement.style.setProperty("--dateTimePickerAppendBackgroundColor", this.$style.common.dateTimePickerItemAppendBackgroundColor);
        },
        convertDateFormat(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear(),
                hour = '' + d.getHours(),
                minute = '' + d.getMinutes();
               

            if (month.length < 2) {
                month = '0' + month;
            } 
            if (day.length < 2) {
                day = '0' + day;
            } 
            if(hour.length < 2) {
                hour = '0' + hour;
            }
            if(minute.length < 2) {
                minute = '0' + minute;
            }
            return [year, month, day].join('-') + ' ' + [hour, minute].join(':'); 
        },
    }
}
</script>

<style scoped lang="scss">
    @import './datetimepicker';
</style>
