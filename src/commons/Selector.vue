<template>
    <div>
        <select
            class="selector"
            ref="selector"
            v-bind:style="ui.selectorStyle"
            required
            :disabled="optionsDisabled"
            v-model="selectedTarget"
            v-bind="[initialize, getSelectedTarget, setOptionsData, getSelectorTarget, getSelectorForTRA]"
        >
            <option class="titleOption" value=''><p>{{ selectorTitle }}</p></option>
            <option
                class="options"
                v-bind="checkOptionDatas"
                v-for="(option, index) in options" :key="index" :value="{target: option.id, name: option.name }"
            >
                <p>{{option.name}}</p>
            </option>
        </select>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['selectorTitle', 'selectorOptions', 'selectorTarget', 'selectorTRATarget', 'predictInUse', 'selectorColor','getSettingJobInfo','defaultValue'],
    data() {
        return {
            selectedTarget: '',
            targetValue: '',
            options: null,
            optionsDisabled: true,
            ui: {
                selectorStyle: {},
                targetOption : ''
            }
        }
    },
    computed: {
        ...mapGetters ({
            getTheme: 'getTheme'
        }),

        initialize() {
            if(this.selectorColor != undefined) {
                let selectorColor = this.selectorColor;
                this.ui.selectorStyle = {
                    color: selectorColor
                }
            }
            else {
                this.ui.selectorStyle = {
                    color: this.$style.common.selectorItemSelectedSelectColor
                }
            }
        },
        checkOptionDatas() {
            if(this.options != []) {
                this.optionsDisabled = false;
                if(this.defaultValue){
                    this.selectedTarget = {
                        name: this.defaultValue.name,
                        target: this.defaultValue.id
                    };
                }
            }
        },
        getSelectedTarget() {
            this.$emit('selectedTarget', this.selectedTarget);
            this.setJobStyle(this.getSettingJobInfo);
        },
        getTargetValue() {
            this.$emit('selectedValue', this.targetValue);
        },
        setOptionsData() {
            this.options = this.selectorOptions;
            if (this.predictInUse == false || this.predictInUse == undefined) {
                this.selectedTarget = '';
            }
        },
        getSelectorTarget() {
            if(this.selectorTarget == '') {
                this.selectedTarget = '';
            }
        },
        getSelectorForTRA() {
            if(this.selectorTRATarget != null) {
                this.selectedTarget = this.selectorTRATarget;
            }
        }
    },
    created() {
        this.initOptionsData();
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.$refs.selector.style.backgroundColor = this.$style.common.selectorItemBackgroundColor;
            this.$refs.selector.style.border = this.$style.common.selectorItemBorder;
            document.documentElement.style.setProperty("--invalidSelectorColor", this.$style.common.selectorItemInvalidSelectColor);
            document.documentElement.style.setProperty("--disabledSelectorColor", this.$style.common.selectorItemDisabledSelectorColor);
            document.documentElement.style.setProperty("--optionColor", this.$style.common.selectorItemOptionColor);
            this.ui.targetOption = document.getElementsByClassName("options");
        },
        initOptionsData() {
            this.options = this.selectorOptions;
        },
        setJobStyle(settingJob){
            if(settingJob !== undefined && settingJob.length > 0){
                Array.prototype.forEach.call(this.ui.targetOption, el => {
                    if((settingJob[0].job_name == el._value.name)){
                        el.classList.add('changeJobName')
                    }else{
                        el.classList.remove('changeJobName')
                    }
                })
            }
            if (settingJob !== undefined && settingJob == ''){
                Array.prototype.forEach.call(this.ui.targetOption, function(el){
                    el.classList.remove('changeJobName')
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './selector';
</style>
