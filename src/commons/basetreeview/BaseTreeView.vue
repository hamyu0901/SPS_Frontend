<template>
  <v-treeview
    :class="['base-tree-view']"
    ref="baseTreeView"
    :items="treeItems"
    :open-all="datas.isOpenAll"
    activatable
    :active="renderActiveNo"
    :active-class="'base-tree-view__active'"
    open-on-click
  >
      <template v-slot:label="{ item }">
          <p :class="['base-tree-view__title']" @click="() => { onClickItemHandler(item) }" >{{ item.name }}</p>
      </template>
  </v-treeview>
</template>

<script>
import { isEmpty } from "lodash";

export default {
  props: {
      /** 트리 아이템 */
      treeItems: {
          type: Array,
          required: true
      },
      /** 트리 전체 오픈 유무 */
      isOpenAll: {
          type: Boolean,
          default: false
      },
      /** 트리 내 특정 아이템 활성화(treeView id값) */
      activeNo: {
          type: Number
      }
  },

  components: {},

  data: () => ({
    datas: {
        isOpenAll: false
    }
  }),

  created() {
  },

  mounted() {
  },

  destroyed() {},

  computed: {
      renderActiveNo() {
          return this.activeNo ? [this.activeNo] : [];
      }
  },

  watch: {
      isOpenAll: {
          immediate: true,
          handler(val) {
              this.datas.isOpenAll = val;
              val && this.$nextTick(() => {
                  this.$refs.baseTreeView.updateAll(val);
              })
          }
      }
  },

  methods: {
      onClickItemHandler(item) {
          isEmpty(item.children) && this.$emit('onTreeViewItemClick', item);
      }
  }
}
</script>

<style scoped lang='scss'>
  @import './BaseTreeView';
</style>
