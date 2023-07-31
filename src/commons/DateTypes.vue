<template>
    <div class="dateTypes">
        <v-btn-toggle ref="dateToggle" v-model="dateTypeFlag" mandatory>
            <div v-for="(dateType, index) in dateTypes" :key="index">
                <v-btn flat :value="dateType.value" @click="dateTypeClicked(dateType, index)">{{dateType.name}}</v-btn>
            </div>
        </v-btn-toggle>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            dateTypeFlag: 'day',
            dateTypes: [
                { value: 'day',     name: this.$t(`dateTypes.day`) },
                // { value: 'weekend', name: this.$t(`dateTypes.week`) },
                // { value: 'month',   name: this.$t(`dateTypes.month`) }
            ]
        }
    },
    computed: {
        ...mapGetters ({
            getTheme: "getTheme",
            getLanguage: "getLanguage"
        }),
    },
    mounted() {
        this.initializeStyle();
        this.dateTypeClicked(this.dateTypes[0], 0);
    },
    methods: {
        initializeStyle() {
            this.$refs.dateToggle.$el.style.backgroundColor = this.$style.common.dateTypesItemBackgroundColor;
        },
        dateTypeClicked(dateType, index) {
            let item = this.$refs.dateToggle.$children;
            for (let i = 0; i < item.length; i++) {
                if (i == index) {
                    item[i].$el.style.backgroundColor = this.$style.common.dateTypesItemActiveBackgroundColor;
                    item[i].$el.style.color = this.$style.common.dateTypesItemActiveColor;
                    this.$emit('dateTypes', this.dateTypes[i]);
                } else {
                    item[i].$el.style.backgroundColor = "";
                    item[i].$el.style.color = "";
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import "./datetypes"
</style>
