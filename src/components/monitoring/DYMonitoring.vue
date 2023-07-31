<template>
    <v-container :class="['monitoring-container']" fluid fill-height>
        <router-view />
    </v-container>
</template>

<script>
export default {
    data: () => ({
        datas: {}
    }),
    
    created() {
        this.emitMonitoringConnect();
        window.addEventListener('beforeunload', this.handler);
    },
    
    mounted() {
        this.$emit('mountedTab');
    },

    beforeDestroy() {
        this.unsubscribeMonitoringEmit();
        this.emitMonitoringDisconnect();
        this.unsubscribeMonitoringDisconnect();
        this.emitSocketDisconnect();
    },

    computed: {},
    methods: {
        handler(event) {
            this.unsubscribeMonitoringDisconnect();
            this.emitMonitoringDisconnect();
        },
        emitMonitoringConnect() {
            this.$socket.emit('monitoring_emit');
        },

        emitMonitoringDisconnect() {
            this.$socket.emit('monitoring_disconnect');
        },

        unsubscribeMonitoringEmit() {
            this.sockets.unsubscribe('monitoring_emit');
        },

        unsubscribeMonitoringDisconnect() {
            this.sockets.unsubscribe('monitoring_disconnect');
        },

        emitSocketDisconnect() {
            this.$socket.emit('disconnect');
        }
    }
}
</script>

<style scoped lang='scss'>
    @import "./DYMonitoring";
</style>