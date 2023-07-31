<template>
    <v-layout column>
        <v-layout>
            <p class="waringSetTitle mt-2 pt-1"> {{warningSetViewTitle}}</p>
            <v-subheader class="waringSetTitle">{{ui.text.maxRate}}</v-subheader>
            <input-message
                class="warningSetInputItem mr-2 mt-2"
                v-bind:defaultMessage="datas.warningRates.max"
                v-bind:inputType="'number'"
                v-on:targetValue="getWarningMaxRates"
            ></input-message>
            <v-subheader class="waringSetTitle">{{ui.text.minRate}}</v-subheader>
            <input-message
                class="warningSetInputItem mr-2 mt-2"
                v-bind:defaultMessage="datas.warningRates.min"
                v-bind:inputType="'number'"
                v-on:targetValue="getWarningMinRates"
            ></input-message>
            <v-spacer/>
            <v-flex lg2 class="mr-2 mt-2">
                <date-picker
                    class="warningSetInputItem"
                    v-bind:placeHolder="ui.text.startDate" 
                    v-on:getDate="getStartDate"
                ></date-picker>
            </v-flex>
            <v-flex lg2 class="mr-2 mt-2">
                <date-picker
                    class="warningSetInputItem"
                    v-bind:placeHolder="ui.text.endDate" 
                    v-on:getDate="getEndDate"
                ></date-picker>
            </v-flex>
            <v-btn class="searchBtn" @click="searchBtnClicked"><a class="pt-1"><img :src="ui.icons.search"></a></v-btn>
        </v-layout>
        <slot></slot>
    </v-layout>
</template>

<script>
import InputMessage from '@/commons/InputMessage';
import DatePicker from '@/commons/DatePicker';
import WarningSetTable from '@/commons/WarningSetTable';
export default {
    components: {InputMessage, DatePicker, WarningSetTable},
    props: ['warningSetViewTitle','saveFlag'],
    data() {
        return {
            ui: {
                text: {
                    maxRate: this.$t(`warningSetView.ui.text.maxRate`),
                    minRate: this.$t(`warningSetView.ui.text.minRate`),
                    startDate: this.$t(`warningSetView.ui.text.startDate`),
                    endDate: this.$t(`warningSetView.ui.text.endDate`),
                },
                icons: {
                    search: require("@/images/search_icon.png"),
                    setting: require("@/images/setting.png")
                },
            },
            datas: {
                startDate: "",
                endDate: "",
                warningRates: {
                    max: 10,
                    min: 10
                },
                historyAccumDatas: []
            }
        }
    },

    created() {

    },

    mounted() {
        this.initializeStyle();
    },

    computed: {

    },
    
    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--warningSetViewItemSearchBtnBackgroundColor", this.$style.common.warningSetViewItemSearchBtnBackgroundColor);
            document.documentElement.style.setProperty("--warningSetViewItemInputBackgroundColor", this.$style.common.warningSetViewItemInputBackgroundColor);
        },

        getWarningMaxRates(warningMax) {
            this.datas.warningRates.max = Number(warningMax);
            this.$emit('warningRate', this.datas.warningRates);
        },

        getWarningMinRates(warningMin) {
            this.datas.warningRates.min = Number(warningMin);
            this.$emit('warningRate', this.datas.warningRates);
        },

        getStartDate(date) {
            this.$emit('startDate',date);
        },

        getEndDate(date) {
            this.$emit('endDate', date);
        },

        searchBtnClicked() {
            this.$emit('search');
        }
    }
}
</script>

<style scoped lang="scss">
    .waringSetTitle {
      font-weight: bold;
      font-size: 15px;
    }

    .searchBtn {
        background-color: var(--warningSetViewItemSearchBtnBackgroundColor) !important;
    }
    
    .warningSetInputItem {
      height: 34px;
      background-color: var(--warningSetViewItemInputBackgroundColor) !important;
    }
    
    .v-input__control {
      min-height: 0px !important;
    }
</style>