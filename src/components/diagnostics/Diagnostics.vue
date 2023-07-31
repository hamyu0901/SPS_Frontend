<template>
  <v-container fluid fill-height id="diagnosticsMainContainer">
    <v-navigation-drawer
    app stateless
    class="navigationDrawer elevation-0"
    :clipped="clipped"
    v-model="drawer"
    value="true" width="260" v-bind="changeDrawerFlag"
    v-bind:style="{ backgroundColor: ui.menu.color }">
      <v-list class="pt-3">
        <v-list-tile
          v-for="(listData, index) in listItems"
          :key="index"
          v-show="listData.show"
          v-model="listData.active"
          @click="listDataClicked(index)"
          :active-class="'dy_navigationDrawer_over--text dy_navArea_dark'"
          >
          <v-list-tile-action>
            <a><img class="pt-1 pr-2" :src='listData.normalImg' ref="navIcons" alt="navIcons"/></a>
          </v-list-tile-action>
          <v-list-tile-content >
            <v-list-tile-title  :class="['tile-title']">{{ $t('diagnostics.drawertitle.'+listData.id) }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <router-view/>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
          ui: {
            menu: {
              color: ''
            }
          },
          clipped: true,
          drawer: true,
          path: "",
          listItems: [],
        }
    },

    created() {
      this.checkedPath();
      this.listItems = this.getDiagnosticsMenuItems ? this.getDiagnosticsMenuItems : [];
    },

    mounted() {
      this.$emit('mountedTab');
      this.initializeStyle();
      this.initNavIcons();
    },

    updated() {
      this.checkedPath();
      this.initNavIcons();
    },

    computed: {
      ...mapGetters({
        getTheme: 'getTheme',
        getNavigationFlag: 'getNavigationFlag',
        getDiagnosticsMenuItems: 'getDiagnosticsMenuItems',
      }),

      changeDrawerFlag() {
        this.drawer = this.getNavigationFlag;
      }
    },

    methods: {
      initializeStyle() {
        this.ui.menu.color = this.$style.diagnostics.sideMenuBackgroundColor;
        document.documentElement.style.setProperty("--navigationDrawerBorderColor", this.$style.diagnostics.sideMenuBorderRightColor);
      },
      checkedPath() {
        this.path = window.location.pathname;
        for(let i = 0; i < this.listItems.length; i++) {
            this.listItems[i].active = this.listItems[i].path === this.path;
        }
      },

        initNavIcons() {
            for (let i = 0; i < this.listItems.length; i++) {
                if (this.$refs.navIcons[i] !== undefined) {
                    this.$refs.navIcons[i].src = this.$router.currentRoute.path === this.listItems[i].path ? this.listItems[i].overImg : this.listItems[i].normalImg;
                }
            }
        },

      listDataClicked(index) {
        for(let i = 0; i < this.listItems.length; i++) {
          if(index === i) {
            this.listItems[i].active = true;
            if(this.$refs.navIcons[i] !== undefined){
              this.$refs.navIcons[i].src = this.listItems[i].overImg;
            }
            this.$router.push(this.listItems[i].path);
          }else {
            this.listItems[i].active = false;
            if(this.$refs.navIcons[i] !== undefined){
              this.$refs.navIcons[i].src = this.listItems[i].normalImg;
            }
          }
        }
      },
    }
}
</script>

<style scoped lang="scss">
  @import './diagnostics';
</style>

