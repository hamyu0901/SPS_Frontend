<template>
    <date-picker
        class="datepicker"
        ref="datepicker"
        v-model="selectedDate"
        v-bind="[initialize, sendDate, getConditionalDate]"
        :lang="lang"
        :format="dateFormat"
        :width="datePickerWidth"
        :placeholder="placeholder.date"
        :not-after="notAfterDate"
        :clearable='false'
        :type="type"
    ></date-picker>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: {
        datePickerWidth: String | Number,
        conditionalDate: {
            type: String,
        },
        placeHolder: Object,
        /** 해당 날짜 이후 선택 안됨  */
        notAfterDate: String,
        setDate: String,
        textColor: String,
        type: {
          type: 'date' | 'month',
          default: 'date'
        }
    },
    data(vm) {
        return {
            selectedDate: '',
            dateFormat: vm.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM',
            lang: this.$t(String(`datepicker.lang`)),
            placeholder: {
                date: this.placeHolder
            },
            datePickerType: ['date', 'month']
        }
    },
    computed: {
        ...mapGetters ({
            getTheme: "getTheme",
            getLanguage: "getLanguage"
        }),
        initialize() {
            if (this.setDate != '') {
                this.selectedDate = this.setDate;
            }
        },
        sendDate() {
            if(this.selectedDate != '' && this.selectedDate != undefined) {
                this.$emit('getDate', this.type === this.datePickerType[0] ? this.convertDateFormat(this.selectedDate) : this.selectedDate);
            }
            else {
                this.$emit('getDate', undefined);
            }
        },

        getConditionalDate() {
            if(this.conditionalDate != undefined) {
                this.selectedDate = this.conditionalDate;
            }
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.$refs.datepicker.$refs.input.style.backgroundColor = this.$style.common.datePickerItemInputBackgroundColor;
            this.$refs.datepicker.$refs.input.style.border = 'none';
            if(this.textColor != undefined) {
                this.$refs.datepicker.$refs.input.style.color = this.textColor.split(" ")[0];
            }
            else {
                this.$refs.datepicker.$refs.input.style.color = this.$style.common.datePickerItemInputColor;
            }
            this.$refs.datepicker.$refs.input.nextElementSibling.style.backgroundColor = this.$style.common.datePickerItemNextElementSiblingBackgroundColor;
            // this.$refs.datepicker.$refs.input.nextSibling.nextSibling.childNodes[0].childNodes[0].style.color = this.$style.common.datePickerItemNextSiblingColor;
            this.$refs.datepicker.$refs.calendar.style.backgroundColor = this.$style.common.datePickerItemCalendarBackgroundColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[0].style.color = this.$style.common.datePickerItemCalendarColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[0].childNodes[0].style.color = this.$style.common.datePickerItemCalendarColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[0].childNodes[1].style.color = this.$style.common.datePickerItemCalendarColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[2].style.color = this.$style.common.datePickerItemCalendarColor;
            this.$refs.datepicker.$refs.calendar.childNodes[2].childNodes[2].childNodes[4].style.color = this.$style.common.datePickerItemCalendarColor;
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
   @import './datepicker';
</style>




