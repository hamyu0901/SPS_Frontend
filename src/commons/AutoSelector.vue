<template>
    <div class="autoSelector" v-bind="[getSelectorOptions, getSelectedItem]">
        <v-select
            v-show="showFlag"
            v-model="datas.selectedItem"
            outline     
            :height="ui.selectorHeight"
            :items="datas.items"
            :menu-props="{ maxHeight:'auto'}"
            dense
        >
            <template slot="item" slot-scope="props">
                <v-list-tile-content>
                    <v-list-tile-title>{{ props.item }}</v-list-tile-title>
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
    props: ['selectorOptions', 'showFlag'],
    data() {
        return {
            ui: {
                selectorHeight: 34
            },
            datas: {
                selectedItem: "",
                items: []
            }
        }
    },

    mounted() {
        this.initializeStyle();
    },

    computed: {
        getSelectorOptions() {
            if(this.selectorOptions.length > 0) {
                this.initSelectOptions();
                this.setSelectOptions(this.selectorOptions);
            }
            else {
               this.initSelectOptions();
            }
        },

        getSelectedItem() {
            if(this.datas.selectedItem != "") {
                this.selectorOptions.forEach(selectorOption => {
                    if(selectorOption.name === this.datas.selectedItem) {
                        this.$emit('selectedItem', selectorOption);
                    }
                })
            }
        }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--autoSelectorColor", this.$style.common.autoSelectorItemColor);
            document.documentElement.style.setProperty("--autoSelectorBackgroundColor", this.$style.common.autoSelectorItemBackgroundColor);
            document.documentElement.style.setProperty("--autoSelectorBorderColor", this.$style.common.autoSelectorItemBorderColor);
        },

        icon(item) {
            if(this.datas.selectedItem === item) {
                return 'check_box';
            }
            else {
                return 'check_box_outline_blank';
            }
        },

        initSelectOptions() {
            this.datas.items = [];
            this.datas.selectedItem = "";
        },

        setSelectOptions(selectOptions) {
            selectOptions.forEach(selectOption => {
                this.datas.items.push(selectOption.name);
            })
            this.setSelectedItem(this.datas.items);
        },

        setSelectedItem(items) {
            this.datas.selectedItem = items[0];
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './autoselector';
</style>
