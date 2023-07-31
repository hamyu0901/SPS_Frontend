<template>
    <v-dialog v-bind="getLoadingFlag" v-model="datas.loadingFlag" hide-overlay persistent width="300">
        <v-card color="indigo" dark>
            <v-card-text>
                Loading...
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        loadingFlag: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            datas: {
                loadingFlag: false
            }
        }
    },

    computed: {
        getLoadingFlag() {
            this.datas.loadingFlag = this.loadingFlag;
        }
    }

}
</script>

<style>

</style>