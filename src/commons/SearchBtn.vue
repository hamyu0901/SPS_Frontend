<template>
    <div>
        <v-btn class="searchBtn" :color="searchBtnColor"><a class="pt-1"><img :src="searchBtnIcon"></a></v-btn>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            searchBtnColor: '',
            searchBtnIcon: require("@/images/search_icon.png")
        }
    },
    computed: {
        ...mapGetters({
            getTheme: 'getTheme',
            getLanguage: "getLanguage"
        }),
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
       initializeStyle() {
           this.searchBtnColor = this.$style.common.searchBtnItemSearchBtnColor;
       }
    }
}
</script>

<style scoped>
    .searchBtn {
      width: inherit;
      height: 33px;
      border-radius: 3px;
    }
</style>
