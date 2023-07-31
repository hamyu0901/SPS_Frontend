<template>
    <div>
        <div class="outputTypes" v-bind="getType">
            <v-btn-toggle ref="outputToggle" v-model="data.type" mandatory>
                <div class="outputTypeBtn" v-for="outputType in outputTypes" :key="outputType.index">
                    <v-btn flat :value="outputType.value" @change="clickTimeType(outputType)">{{outputType.name}}</v-btn>
                </div>
            </v-btn-toggle>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props:['type'],
    data() {
        return {
            ui: {
                activeBackgroundColor: "",
                activeColor: ""
            },
            data: {
                type: '',
                mandatoryFlag: false
            },
            outputTypes: [
                { value: 'hour', name: this.$t(`diagnostics.torqueTemperature.child.outputTypes.outputTypes.hour`), index: 0},
                { value: 'day', name: this.$t(`diagnostics.torqueTemperature.child.outputTypes.outputTypes.day`), index: 1},
                { value: 'month', name: this.$t(`diagnostics.torqueTemperature.child.outputTypes.outputTypes.month`), index: 2 }
            ]
        }
    },
    computed: {
        ...mapGetters ({
            getTheme: "getTheme",
            getLanguage: "getLanguage"
        }),

        getType() {
            this.data.type = this.type;
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.$refs.outputToggle.$el.style.backgroundColor = this.$style.diagnostics.outputTypesItemOutputToggleBackgroundColor;
            this.ui.activeBackgroundColor = this.$style.diagnostics.outputTypeItemActiveBackgroundColor;
            this.ui.activeColor = this.$style.diagnostics.outputTypeItemActiveColor;
        },
        outputTypeFlag(outputType) {
            if(this.data.type != '') {
                if(this.data.type == outputType.value) {
                    this.data.mandatoryFlag = true;
                    this.setBottomLine(outputType);
                    this.$emit('selectedType', outputType);
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if(this.$refs.outputToggle != undefined) {
                    this.data.mandatoryFlag = false;
                    this.initBottomLine();
                    this.$emit('selectedType', '');
                }
                return true;
            }
        },

        setBottomLine(outputType) {
            let item = this.$refs.outputToggle.$children;
            for(let i = 0; i < item.length; i++) {
                if(i == outputType.index) {
                    item[i].$el.style.backgroundColor = this.ui.activeBackgroundColor;
                    item[i].$el.style.color = this.ui.activeColor;
                }else {
                     item[i].$el.style.backgroundColor = "";
                     item[i].$el.style.color = "";
                }
            }
        },

        initBottomLine() {
            let item = this.$refs.outputToggle.$children;
            for(let i = 0; i < item.length; i++) {
                item[i].$el.style.backgroundColor = "";
                item[i].$el.style.color = "";
            }
        },
        clickTimeType(outputType){
            this.$emit('selectedType', outputType);
        },
    }

}
</script>

<style scoped lang="scss">
    @import './outputtypes';
</style>
