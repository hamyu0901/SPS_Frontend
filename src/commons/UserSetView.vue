<template>
    <v-card flat class="userSetViewCard mt-4" v-bind="[getSaveFlag, setUserItemValue]">
        <v-card-title class="userSetViewCardTitle">{{userSetTitle}}</v-card-title>
            <v-btn-toggle class="elevation-0 mx-3" mandatory v-model="userSetItems.value">
                <v-btn class="toggleBtn" flat v-for="userSetItem in userSetItems.items" :key="userSetItem.id" :value="userSetItem.id">
                    <a><img class="pt-2 pr-3" :src="setIcons(userSetItems.value, userSetItem.id)"></a>
                    <span>{{userSetItem.title}}</span>
                </v-btn>
            </v-btn-toggle>
        <v-layout text-xs-center>
            
        </v-layout>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: ['userSetId','userSetTitle', 'userSetItems', 'saveFlag'],
    data() {
        return {
            ui: {
                icons: {
                    snapOnButton: require("@/images/img_light_on.png"),
                    snapOffButton: require("@/images/img_light_off.png")
                }
            },
            datas: {
                userSetItems: []
            }
        }
    },

    created() {
        
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        ...mapGetters({
            getTheme: 'getTheme',
            getLanguage: 'getLanguage'
        }),

        getSaveFlag() {
            if(this.saveFlag === true) {
                this.$emit('saveUserSetData', this.userSetItems.value);
            }
        },

        setUserItemValue() {
            let userSetItemValue = "";
            this.userSetItems.items.forEach(userSetItem => {
                if(this.userSetId === 'language' && userSetItem.id === this.getLanguage) {
                    userSetItemValue = userSetItem.id;
                } else if(this.userSetId === 'theme') {
                    if(this.getTheme === true) {
                        userSetItemValue = 'dark';
                    } else {
                        userSetItemValue = 'light';
                    }
                }
            })
            this.userSetItems.value = userSetItemValue;
        },
    },

    methods: {
        setIcons(value, id) {
            if(value === id) {
                return this.ui.icons.snapOnButton;
            } else {
                return this.ui.icons.snapOffButton;
            }
        },

        initializeStyle() {
            document.documentElement.style.setProperty("--userSetViewCardBackgroundColor", this.$style.common.userSetViewItemCardBackgroundColor);
            document.documentElement.style.setProperty("--userSetViewCardTitleBackgroundColor", this.$style.common.userSetViewItemCardTitleBackgroundColor);
            document.documentElement.style.setProperty("--userSetViewCardTitleColor", this.$style.common.userSetViewItemCardTitleColor);
            document.documentElement.style.setProperty("--toggleBtnBackgroundColor", this.$style.common.userSetViewItemToggleBtnBackgroundColor);
            document.documentElement.style.setProperty("--toggleBtnBorderColor", this.$style.common.userSetViewItemToggleBtnBorderColor);
        }
    }
}
</script>

<style scoped lang="scss">
    .userSetViewCard {
      height: 100%;
      background-color: var(--userSetViewCardBackgroundColor) !important;
      margin-left: 40px;
      margin-right: 40px;
    }
    .userSetViewCardTitle {
      font-weight: bold;
      font-size: 20px;
      background-color: var(--userSetViewCardTitleBackgroundColor) !important;
      color: var(--userSetViewCardTitleColor) !important;
    }
    .toggleBtn {
      width: 300px !important;
      height: 70px;
      font-size: 16px;
      background-color: var(--toggleBtnBackgroundColor) !important;
      border: solid 2px var(--toggleBtnBorderColor) !important;
      opacity: 1 !important;
    }
</style>