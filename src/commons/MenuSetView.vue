<template>
    <v-layout class="menuSetView" column v-bind="getSaveFlag">
        <p class="menuSetViewTitle mt-2">{{ui.text.title}}</p>
        <v-layout>
            <v-flex lg6 class="pr-2">
                <v-card class="menuSetViewCard">
                    <v-card-title class="menuSetViewCardTitle">{{ui.text.mainMenuTitle}}</v-card-title>
                    <v-list class="menuSetViewCardList">
                        <v-list-tile v-for="mainMenuItem in datas.mainMenuItems" :key="mainMenuItem.id">
                            <v-list-tile-action @click="activeIconClicked(mainMenuItem, ui.text.mainMenuTitle)">
                                <a><img class="pt-1 pr-2" :src="mainMenuItem.show === true? ui.icon.onImg : ui.icon.offImg "/></a>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title class="mb-1"><a class="iconImgs"><img class="pr-2" :src="getTheme === true? mainMenuItem.menuImg:mainMenuItem.menuLightImg"/></a>{{$t('tabtitle.'+mainMenuItem.id)}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
            <v-flex lg6 class="pl-2">
                <v-card class="menuSetViewCard">
                    <v-card-title  class="menuSetViewCardTitle">{{ui.text.diagnosticsMenuTitle}}</v-card-title>
                    <v-list class="menuSetViewCardList">
                        <v-list-tile v-for="diagnosticsMenuItem in datas.diagnosticsMenuItems" :key="diagnosticsMenuItem.id">
                            <v-list-tile-action @click="activeIconClicked(diagnosticsMenuItem, ui.text.diagnosticsMenuTitle)">
                                <a><img class="pt-1 pr-2" :src="diagnosticsMenuItem.show === true? ui.icon.onImg : ui.icon.offImg "/></a>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title class="mb-1"><a class="iconImgs"><img class="pr-2" :src="getTheme === true? diagnosticsMenuItem.menuImg:diagnosticsMenuItem.menuLightImg"/></a>{{$t('diagnostics.drawertitle.'+diagnosticsMenuItem.id)}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: ['saveFlag'],
    data() {
        return {
            ui: {
                text: {
                    title: this.$t(`menuSetView.ui.text.title`),
                    mainMenuTitle: this.$t(`menuSetView.ui.text.mainMenuTitle`),
                    diagnosticsMenuTitle: this.$t(`menuSetView.ui.text.diagnosticsMenuTitle`)
                },
                icon: {
                    onImg: require("@/images/img_light_on.png"),
                    offImg: require("@/images/img_light_off.png")
                }
            },
            datas: {
                mainMenuItems: [],
                diagnosticsMenuItems:[]
            }
        }
    },

    created() {

    },

    mounted() {
        this.datas.mainMenuItems = JSON.parse(JSON.stringify(this.getMainMenuItems));
        this.datas.diagnosticsMenuItems = JSON.parse(JSON.stringify(this.getDiagnosticsMenuItems));
        this.initializeStyle();

    },

    destroyed() {
        delete this.datas.mainMenuItems;
        delete this.datas.diagnosticsMenuItems;
    },

    computed: {
        ...mapGetters({
            getTheme: 'getTheme',
            getMainMenuItems: 'getMainMenuItems',
            getDiagnosticsMenuItems: 'getDiagnosticsMenuItems'
        }),

        getSaveFlag() {
            if(this.saveFlag === true) {
                this.$emit('saveMenuItems',{mainMenuItems: this.datas.mainMenuItems, diagnosticsMenuItems: this.datas.diagnosticsMenuItems});
            }
        }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--menuSetViewCardBackgroundColor", this.$style.common.menuSetViewItemCardBackgroundColor);
            document.documentElement.style.setProperty("--menuSetViewCardBorderColor", this.$style.common.menuSetViewItemCardBorderColor);
            document.documentElement.style.setProperty("--menuSetViewCardTitleColor", this.$style.common.menuSetViewItemCardTitleColor);
            document.documentElement.style.setProperty("--menuSetViewCardTitleBackgroundColor", this.$style.common.menuSetViewItemCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--menuSetViewCardListBackgroundColor", this.$style.common.menuSetViewItemCardListBackgroundColor);
        },

        activeIconClicked(activeItem, type) {
            if(type === this.ui.text.mainMenuTitle) {
                this.datas.mainMenuItems.forEach(manuItem => {
                    if(manuItem.id === activeItem.id) {
                        if(manuItem.show === true) {
                            manuItem.show = false;
                        } else {
                            manuItem.show = true;
                        }
                    }
                })
            } else if(type === this.ui.text.diagnosticsMenuTitle) {
                this.datas.diagnosticsMenuItems.forEach(manuItem => {
                    if(manuItem.id === activeItem.id) {
                        if(manuItem.show === true) {
                            manuItem.show = false;
                        } else {
                            manuItem.show = true;
                        }
                    }
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .iconImgs {
        cursor: auto;
    }
    .menuSetViewTitle {
        font-weight: bold;
        font-size: 20px;
    }
    .menuSetViewCard {
        height: 100%;
        border: 1px solid var(--menuSetViewCardBorderColor) !important;
        background-color: var(--menuSetViewCardBackgroundColor) !important;

    }
    .menuSetViewCardTitle {
        color: var(--menuSetViewCardTitleColor) !important;
        background-color: var(--menuSetViewCardTitleBackgroundColor) !important;
        text-align: center;
        justify-content: center;
        font-weight: bold;
        font-size: 15px;
    }
    .menuSetViewCardList {
        background-color: var(--menuSetViewCardListBackgroundColor) !important;
    }
</style>