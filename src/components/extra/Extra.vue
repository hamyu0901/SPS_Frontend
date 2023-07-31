<template>
    <v-container fluid fill-height :class="['extra']">
        <v-navigation-drawer
            :class="['extra__navigation-drawer', 'elevation-0']"
            :style="datas.navigationDrawerStyle"
            app
            stateless
            clipped
            width="260"
            v-model="datas.drawerFlag"
        >
            <v-list class="pt-3" :class="['extra__navigation-drawer-list']">
                <v-list-group
                  :class="['extra__navigation-drawer-list-group']"
                  v-for="item in datas.listGroupItems"
                  :key="item.title"
                  v-model="item.active"
                >
                    <template v-slot:activator>
                        <v-list-tile :class="['extra__navigation-drawer-list-group-main']">
                            <v-list-tile-action>
                                <v-icon color="#858CAF">mdi-car-clock</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title :class="['extra__navigation-drawer-list-group-main-tile-title']">{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-list-tile
                      :class="['extra__navigation-drawer-list-group-sub', `${theme === false ? 'dy_navText_light--text' : 'dy_white--text'}`]"
                      :active-class="'dy_navigationDrawer_over--text dy_navArea_dark'"
                      v-for="(subItem, index) in item.items"
                      :key="subItem.title"
                      v-model="subItem.active"
                      @click="listGroupItemClickHandler(index)"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title style="display:flex; align-items: center" :class="['extra__navigation-drawer-list-group-sub-tile-title']">
                                {{ subItem.title }}
                            </v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-icon>{{ subItem.action }}</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-group>
                <v-list-tile
                    :class="['extra__navigation-drawer-list-item', `${theme === false ? 'dy_navText_light--text' : 'dy_white--text'}`]"
                    :active-class="`${theme === false ? 'dy_navigationDrawer_over--text dy_navArea_light' : 'dy_navigationDrawer_over--text dy_navArea_dark'}`"
                    v-for="(listItem, index) in datas.listItems"
                    :key="listItem.id"
                    v-show="listItem.show"
                    v-model="listItem.active"
                    @click="() => {listItemClicked(index)}"
                >
                    <v-list-tile-action>
                        <a><img class="pt-1 pr-2" :alt="'manual-icon'" :src='listItem.active === true ? listItem.overImg : listItem.normalImg'/></a>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title :class="['extra__navigation-drawer-list-group-main-tile-title']">{{renderListItemTitle(listItem.id)}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <router-view />
    </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: () => ({
        datas: {
            listItems: [],
            listGroupItems: [],
            drawerFlag: true,
            navigationDrawerStyle: {
                backgroundColor: '#25273E'
            },
        }
    }),

    created() {
        this.datas.listItems = this.extraMenuItems ? this.extraMenuItems.filter(extraMenuItem => extraMenuItem.type === 'list') : [];
        this.datas.listGroupItems = this.extraMenuItems ? this.extraMenuItems.filter(extraMenuItem => extraMenuItem.type === 'group') : [];
        this.initListItemClick();
    },

    mounted() {
        this.$emit('mountedTab');
    },

    destroyed() {},

    watch: {
        navigationFlag: {
            handler(val) {
                this.datas.drawerFlag = val;
            }
        }
    },

    computed: {
        ...mapGetters({
            extraMenuItems: 'getExtraMenuItems',
            theme: 'getTheme',
            navigationFlag: 'getNavigationFlag',
        }),

        renderListItemTitle() {
            return (listId) => {
                return this.$t(`extra.drawerTitle.${listId}`);
            }
        }
    },

    methods: {
        listGroupItemClickHandler(index) {
            this.datas.listGroupItems.forEach(listGroupItem => {
                listGroupItem.items.forEach((item, i) => {
                    item.active = index === i;
                    item.active && this.$router.push(item.target);
                })
            })
            this.datas.listItems.forEach(listItem => listItem.active = false);
        },

        listItemClicked(index) {
            this.datas.listItems.forEach((listItem, i) => {listItem.active = index === i;});
            this.$router.push(this.datas.listItems[index].target);
            this.datas.listGroupItems.forEach(listGroupItem => listGroupItem.items.forEach(item => item.active = false));
        },

        initListItemClick() {
            const listItemID = window.location.pathname.split('/')[3];
            const selectedListItem = this.datas.listItems.find(item => item.id === listItemID);

            if (selectedListItem) {
                this.datas.listItems.forEach(item => item.active = item === selectedListItem);
                this.datas.listGroupItems.forEach(listGroupItem => listGroupItem.items.forEach(item => item.active = false));
            } else {
                this.datas.listGroupItems.forEach(listGroupItem => listGroupItem.items.forEach(item => item.active = item.id === listItemID));
            }
            const initListItemIdx = this.datas.listItems && this.datas.listItems.findIndex(listItem => listItem.id === window.location.pathname.split('/')[3]);
            this.datas.listItems.forEach((listItem, i) => {
                listItem.active = initListItemIdx === i;
            })
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './Extra';
</style>
