<template>
    <v-data-table
        :class="['base-table']"
        v-show="datas.contentItems"
        :headers="headerItems"
        :items="datas.contentItems"
        :no-data-text="emptyText"
        hide-actions
        :disable-initial-sort="!hasInitialSort"
    >
        <template v-slot:items="props" >
                <tr :class="[`base-table__tr-${props.item.focus ? 'highlight' : 'normal'}`, `base-table__tr-${hasClick ? 'click': 'not-click'}`]" :key="props.index" @click="hasClick ? itemClickHandler(props.item) : null">
                    <td class="text-xs-center tdText" v-for="header in headerItems" :key="header.value">
                        <span v-if="header.type === 'text'">{{ props.item[header.value] }}</span>
                        <img v-if="header.type === 'img'" :src="props.item[header.value]" />
                    </td>
                </tr>
        </template>
    </v-data-table>
</template>

<script>
import { isEmpty } from "lodash";

export default {
    props: {
        headerItems: {
            type: Array,
            required: true
        },
        contentItems: {
            type: Array,
            required: true,
            default: []
        },
        /** 선택 유무 */
        hasClick: {
            type: Boolean,
            default: false
        },
        hasInitialSort : {
            type: Boolean,
            default : true
        },
        /** 데이터 없을 때 사용되는 Text */
        emptyText: {
            type: String,
            default: 'no data available'
        },
        /** 기본 선택 아이템 */
        clickedItem: {
            type: Object
        }
    },
    data: () => ({
        datas: {
            contentItems: []
        }
    }),

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    computed: {
    },

    watch: {
        contentItems: {
            immediate: true,
            deep: true,
            handler(val) {
                this.datas.contentItems = val.length > 0 ? val : [];
            }
        },
        clickedItem: {
            immediate: true,
            deep: true,
            handler(val) {
                !isEmpty(val) && this.itemClickHandler(val);
            }
        }
    },

    methods: {
        itemClickHandler(item) {
            this.datas.contentItems = this.datas.contentItems.map(contentItem => {
                if( contentItem.alarm_id === item.alarm_id ) {
                    contentItem.focus = true;
                } else {
                    contentItem.focus = false
                }
                return contentItem;
            })
            this.$emit('onClickBaseTableItem', item);
        }
    }
}
</script>

<style scoped lang='scss'>
    @import "BaseTable";
</style>
