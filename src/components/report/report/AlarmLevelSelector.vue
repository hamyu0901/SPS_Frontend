<template>
    <div class="alarmSelector">
        <v-select
            v-model="datas.selectedLevel"
            outline
            :items="datas.alarmLevel"
            :placeholder="ui.selectorTitle"
            height="34px"
            dense
            multiple
            @input="clickAlarmLevel"
        >
        <template slot="prepend-item">
                <v-list-tile
                    ripple
                    @click="toggle"
                >
                <v-list-tile-content>
                    <v-list-tile-title :class="datas.selectedLevel.length === datas.alarmLevel.length  ? 'primary--text' : ''">Select All</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon :color="datas.selectedLevel.length === datas.alarmLevel.length  ? 'primary' : ''">{{ icons }}</v-icon>
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
function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj
    }

    const result = Array.isArray(obj) ? [] : {}

    for (let key of Object.keys(obj)) {
        result[key] = deepClone(obj[key])
    }

    return result
}
export default {
    data(){
        return {
            ui: {
                selectorTitle: this.$t(`diagnostics.alarmstatistics.alarmContents.title.multiSelectorTitle`)
            },
            datas: {
                /** SELECT BOX Data(위험도 상, 중, 하 표현) */
                alarmLevel: [
                    this.$t(`diagnostics.alarmstatistics.level.lower`),
                    this.$t(`diagnostics.alarmstatistics.level.middle`),
                    this.$t(`diagnostics.alarmstatistics.level.high`)
                ],
                /** 선택한 SELECT BOX Data(기본 중, 상 표현) */
                selectedLevel: [
                    this.$t(`diagnostics.alarmstatistics.level.middle`),
                    this.$t(`diagnostics.alarmstatistics.level.high`)
                ]
            }
        }
    },
    computed: {
        icons () {
            if (this.datas.selectedLevel.length === this.datas.alarmLevel.length) {
                return 'check_box';
            }
            if (this.datas.selectedLevel.length >= 0) {
                return 'check_box_outline_blank';
            }
        },
    },
    mounted(){
        this.initializeStyle();
        this.setAlarmLevel(this.datas.selectedLevel)

    },
    watch:{
    },
    methods: {
        initializeStyle(){
            document.documentElement.style.setProperty("--multiSelectorPlaceHolderColor", this.$style.common.multiSelectorItemPlaceHolderColor);
            document.documentElement.style.setProperty("--multiSelectorColor", this.$style.common.multiSelectorItemColor);
            document.documentElement.style.setProperty("--multiSelectorBorderColor", this.$style.common.multiSelectorItemBorderColor);
            document.documentElement.style.setProperty("--listBackgroundColor", this.$style.common.multiSelectorItemListBackgroundColor);
            document.documentElement.style.setProperty("--listBorderColor", this.$style.common.multiSelectorItemListBorderColor);
        },
        clickAlarmLevel(alarmlevel){
            this.setAlarmLevel(alarmlevel)
        },
        setAlarmLevel(alarmlevel){
            let temp = [];
            temp = deepClone(alarmlevel)
            if(temp.length > 0){
                for(let i=0; i < temp.length; i++){
                    switch(temp[i]){
                        case this.$t(`diagnostics.alarmstatistics.level.lower`) :
                            temp[i] = 0
                        break;
                        case this.$t(`diagnostics.alarmstatistics.level.middle`) :
                            temp[i] = 1
                        break;
                        case this.$t(`diagnostics.alarmstatistics.level.high`) :
                            temp[i] = 2
                        break;
                    default:
                    }
                }
            }
            this.datas.selectedLevel.sort(function (a, b) {
	                return a > b ? -1 : 1;
            });
            this.$emit('clickAlarmLevel', temp)
        },
        icon(alarm) {
            if(this.datas.selectedLevel.includes(alarm)) {
                return 'check_box';
            }
            else {
                return 'check_box_outline_blank';
            }
        },

        toggle() {
            let temp = [];
            this.$nextTick(() => {
                if (this.datas.selectedLevel.length === this.datas.alarmLevel.length ) {
                    this.datas.selectedLevel = [];
                    temp = [];
                }
                else {
                    this.datas.selectedLevel = this.datas.alarmLevel.slice();
                    temp = this.datas.alarmLevel;
                }
                this.setAlarmLevel(temp)

            })
        },
    }
}
</script>
<style lang="scss" scoped>
    @import './alarmlevelselector';
</style>