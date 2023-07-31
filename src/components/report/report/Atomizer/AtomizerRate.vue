<template>
    <v-layout column :class="['atomizer-rate']">
        <p>경고 카운팅</p>
        <v-layout :class="['atomizer-rate__info']">
            <span :class="[subStatusStyle ? 'alert atomizer-rate__info-sub' : 'atomizer-rate__info-sub']" v-if="subStatusCheck" >
                {{atomizerSubRateItem.value}}
            </span>
            <span :class="['atomizer-rate__info-arrow']" v-if="subStatusCheck">
                <img src="@/images/report/status_arrow.png"/>
            </span>
            <span :class="[mainStatusStyle && 'alert']">
                {{atomizerRateItem.value}}
            </span>
        </v-layout>
    </v-layout>
</template>
<script>
import { deepClone } from "@/utils/utils";
export default {
    props: {
        atomizerRateItem: {
            // type: Array,
            required: true
        },
        atomizerSubRateItem: {

        },
        prevReport: {

        }

    },
    data(){
        return {
            datas : {


            }
        }
    },
    computed: {
        subStatusCheck(){
            return this.atomizerSubRateItem && this.atomizerSubRateItem.value !== this.atomizerRateItem.value ? true : false
        },
        subStatusStyle(){
            return this.atomizerSubRateItem && this.atomizerSubRateItem.value >= 1 ? true : false
        },
        mainStatusStyle(){
            return this.atomizerRateItem && this.atomizerRateItem.value >= 1 ? true : false
        }
    },
    watch: {
        atomizerRateItem : {
            immediate: true,
            deep : true,
            handler(item){

            }
        },
        atomizerSubRateItem: {
            immediate: true,
            deep : true,
            handler(item){

            }
        }
    },
    mounted(){

    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
 @import './AtomizerRate.scss'
</style>