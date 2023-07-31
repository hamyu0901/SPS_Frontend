<template>
    <v-layout class="tempSettingDlg" column>
        <v-form v-for="(item, index) in items" :key="index" v-bind="[getSettingValue, setSettingValue]">
            <v-layout>
                <v-subheader class="subHeader">{{item.label}}</v-subheader>
                <v-text-field
                    class="textField"
                    autocomplete="off" 
                    autofocus 
                    solo 
                    flat
                    type="number" 
                    :background-color="backgroundColor"
                    v-model="item.text"
                ></v-text-field>
            </v-layout>
        </v-form>   
    </v-layout>
</template>

<script>
export default {
    props: ['settingValue'],
    data() {
        return {
            checkFlag: true,
            stdDatas: {},
            items: [
                { label: this.$t(`diagnostics.torqueTemperature.child.tempSettingDlg.items.label`), text: '' },
            ],
            backgroundColor: ''
        }
    },
    computed: {
        getSettingValue() {
            this.items[0].text = this.settingValue;
        },

        setSettingValue() {
            if(this.items[0].text != null) {
                this.$emit('settingValue', this.items[0].text);
            }
        },
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.backgroundColor = this.$style.diagnostics.tempSettingDlgItemInputBackgroundColor;
            document.documentElement.style.setProperty("--dlgBackgroundColor", this.$style.diagnostics.tempSettingDlgItemBackgroundColor);
            document.documentElement.style.setProperty("--subHeaderColor", this.$style.diagnostics.tempSettingDlgItemColor);
            document.documentElement.style.setProperty("--inputBorderColor", this.$style.diagnostics.tempSettingDlgItemInputBorderColor);
        }
    }
}
</script>

<style scoped lang="scss">
    @import "./tempsettingdlg"
</style>
