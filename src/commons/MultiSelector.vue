<template>
    <div class="multiSelector" v-bind="[getSelectorOptions, getSelectedTarget]">
        <v-select
            v-model="datas.selectedAlarmCodes"
            outline
            height="34"
            :items="datas.alarmCodes"
            :placeholder="selectorTitle"
            dense
            multiple
        >
            <template slot="prepend-item">
                <v-list-tile
                    ripple
                    @click="toggle"
                >
                <v-list-tile-content>
                    <v-list-tile-title :class="datas.selectedAlarmCodes.length === datas.alarmCodes.length  ? 'primary--text' : ''">Select All</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon :color="datas.selectedAlarmCodes.length === datas.alarmCodes.length  ? 'primary' : ''">{{ icons }}</v-icon>
                </v-list-tile-action>
                </v-list-tile>
                <v-divider class="mt-2"></v-divider>
            </template>
            <template slot="item" slot-scope="props">
                <v-list-tile-content>
                    <v-list-tile-title >{{ props.item }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon :color=" icon(props.item) === 'check_box' ? 'primary' : ''">{{ icon(props.item) }}</v-icon>
                </v-list-tile-action>
            </template>
        </v-select>
    </div>
</template>

<script>
export default {
    props: ['selectorOptions', 'selectorTitle'],
    data() {
        return {
            datas: {
                selectedAlarmCodes: [],
                alarmCodes: []
            }
        }
    },

    mounted() {
        this.initializeStyle();
        if(this.selectorOptions.length > 0){
            if(this.selectorOptions[0].hasOwnProperty('type')){
                {this.datas.selectedAlarmCodes.push(this.datas.alarmCodes[1],this.datas.alarmCodes[2])}
            }
        }
    },
    watch: {
    },
    computed: {
        icons () {
            if (this.datas.selectedAlarmCodes.length === this.datas.alarmCodes.length) {
                return 'check_box';
            }
            if (this.datas.selectedAlarmCodes.length >= 0) {
                return 'check_box_outline_blank';
            }
        },
        getSelectorOptions() {
            if(this.selectorOptions.length > 0) {
                let oldAlarmCodes = this.datas.alarmCodes;
                this.datas.alarmCodes = [];
                for(let i = 0; i < this.selectorOptions.length; i++) {
                    this.datas.alarmCodes.push(this.selectorOptions[i].name);
                }
                let newAlarmCodes = this.datas.alarmCodes;
                if(this.checkDataEquals(oldAlarmCodes,newAlarmCodes) == false) {
                    this.datas.selectedAlarmCodes = [];
                }
            }
            else{
                this.datas.alarmCodes = [];
            }
        },

        getSelectedTarget() {
            if(this.datas.selectedAlarmCodes != []) {
                this.$emit('selectedTargets', this.datas.selectedAlarmCodes);
            }
        },
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--multiSelectorPlaceHolderColor", this.$style.common.multiSelectorItemPlaceHolderColor);
            document.documentElement.style.setProperty("--multiSelectorColor", this.$style.common.multiSelectorItemColor);
            document.documentElement.style.setProperty("--multiSelectorBorderColor", this.$style.common.multiSelectorItemBorderColor);
            document.documentElement.style.setProperty("--listBackgroundColor", this.$style.common.multiSelectorItemListBackgroundColor);
            document.documentElement.style.setProperty("--listBorderColor", this.$style.common.multiSelectorItemListBorderColor);
        },

        icon(alarm) {
            if(this.datas.selectedAlarmCodes.includes(alarm)) {
                return 'check_box';
            }
            else {
                return 'check_box_outline_blank';
            }
        },

        toggle() {
            this.$nextTick(() => {
                if (this.datas.selectedAlarmCodes.length === this.datas.alarmCodes.length ) {
                    this.datas.selectedAlarmCodes = [];
                }
                else {
                    this.datas.selectedAlarmCodes = this.datas.alarmCodes.slice();
                }
            })
        },

      checkDataEquals(oldData, newData) {
          return JSON.stringify(oldData) === JSON.stringify(newData);
      }
    }
}
</script>

<style lang="scss">
    @import './multiselector';
</style>
