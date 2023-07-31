<template>
    <v-card height="50px" class="statusBox mb-1">
        <p>{{ui.cardText}}</p>
        <v-bottom-nav
            :active.sync="data.status"
            :value="true"
            absolute
            color="transparent"
            @update:active="clickStatusBtn"
        >
            <v-btn
                color="#2DB67C"
                flat
                :value=0
            >
                <span>{{ui.btnTitle.default}}</span>
                <v-icon>mdi-account-check</v-icon>
            </v-btn>
            <v-btn
                color="#EF4C28"
                 flat
                :value=1
            >
                <span>{{ui.btnTitle.alert}}</span>
                <v-icon>mdi-alarm-light-outline</v-icon>
            </v-btn>
        </v-bottom-nav>
    </v-card>
</template>
<script>
export default {
    props:['data', 'type'],
    data(){
        return {
            ui: {
                cardText: '',
                btnTitle:{
                    alert: this.$t(`report.main.reportTitle.alert`),
                    default: this.$t(`report.main.reportTitle.default`)
                }
            },
            datas: {
            }
        }
    },
    created(){
    },
    mounted(){
        this.ui.cardText = this.type === 0 ? this.$t(`report.hardware.title.hardware`) : this.$t(`report.hardware.title.alarm`)
    },
    watch: {
        type(){
             this.ui.cardText = this.type === 0 ? this.$t(`report.hardware.title.hardware`) : this.$t(`report.hardware.title.alarm`)
        },
        data(){
        }
    },
    methods: {
        clickStatusBtn(value){
            this.$emit('clickStatusBtn', value)
        }
    }
}
</script>
<style lang="scss" scoped>
    @import './reportbtnnav';
</style>