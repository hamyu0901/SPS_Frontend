<template>
    <v-dialog
        :class="['base-modal']"
        v-model="isOpen"
        persistent
        scrollable
        :width="renderWidth"
        @keydown.esc="closeModalHandler"
    >
        <v-card
            :class="['base-modal__contents']"
        >
            <v-card-title
                :class="['base-modal__contents-card-title']"
            >
                {{title}}
                <v-btn flat icon @click="closeModalHandler">
                    <v-icon large>close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text :class="['base-modal__contents-card-contents']" fill-heihgt>
                <slot></slot>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        width: {
            type: Number
        },
        isOpen: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    data: () => ({
        datas: {
            width: 1200,

        }
    }),

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    computed: {
        renderWidth() {
            return this.width ? this.width : this.datas.width;
        }
    },

    methods: {
        closeModalHandler() {
            this.$emit('onCloseModal');
        }
    }
}
</script>

<style scoped lang='scss'>
    @import "BaseModal";
</style>