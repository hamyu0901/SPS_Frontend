<template>
    <div>
        <input class="inputMessage" ref="inputMessage" solo :type="inputType" :value="inputMessage" @input="inputValue($event.target.value)"/>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['defaultMessage', 'inputType'],
    data() {
        return {
            inputMessage: ''
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
        this.initDatas();
    },
    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--inputMessagebackgroundColor", this.$style.common.inputMessageItemBackgroundColor);
            document.documentElement.style.setProperty("--inputMessageColor", this.$style.common.inputMessageItemColor);
            document.documentElement.style.setProperty("--inputMessageBorderColor", this.$style.common.inputMessageItemBorderColor);
        },
        initDatas() {
            this.inputMessage = this.defaultMessage;
        },
        inputValue(data) {
            this.inputMessage = data;
            this.$emit('targetValue', this.inputMessage);
        }
    }
}
</script>

<style scoped lang="scss">
    @import './inputmessage';
</style>
