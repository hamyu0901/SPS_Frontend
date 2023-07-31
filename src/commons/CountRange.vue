<template>
    <div>
        <input class="countRange" solo :placeholder="hintValue" type="number" :value="inputData" @input="inputValue($event.target.value)"/>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['hintValue'],
    data() {
        return {
            inputData: ''
        }
    },    
    computed: {
        ...mapGetters ({
            getTheme: "getTheme",
            getLanguage: "getLanguage"    
        })
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--backgroundColor", this.$style.common.countRangeItemBackgroundColor);
            document.documentElement.style.setProperty("--textColor", this.$style.common.countRangeItemColor);
            document.documentElement.style.setProperty("--borderColor", this.$style.common.countRangeItemBorderColor);
        },
        
        inputValue(data) {
            this.inputData = data;
            this.$emit('targetValue', this.inputData);
        }
    }
}
</script>

<style scoped lang="scss">
    @import './countrange';
</style>
