<template>
    <span :class="['alarm-status-container']">
        <v-btn
            v-if="componentType === ComponentType.button"
            :class="['alarm-status-container__button']"
            flat
            icon
            :color="color? color : AlarmType[alarmType].color"
            @click="onClick"
        >
            <v-icon :size="size">{{AlarmType[alarmType].icon}}</v-icon>
        </v-btn>
        <v-icon
            v-if="componentType === ComponentType.icon"
            :class="['alarm-status-container__icon']"
            :size="size"
            :color="color? color : AlarmType[alarmType].color"
        >{{AlarmType[alarmType].icon}}</v-icon>
        <span v-if="title" :class="['alarm-status-container__title']">{{title}}</span>
    </span>
</template>

<script>
const ComponentType = {
    button: 'button',
    icon: 'icon'
}

const AlarmType = {
    alarm: {
        name: 'alarm',
        icon: 'mdi-alert-circle-outline',
        color: 'error'
    },
    normal: {
        name: 'normal',
        icon: 'mdi-check-circle-outline',
        color: '#33CC33'
    },
    default: {
        name: 'default',
        icon: 'mdi-minus-circle-outline',
        color: '#8F8888'
    }
}

export default {
    props: {
        /** 컴포넌트 타입 (버튼/아이콘) */
        componentType: {
            type: String,
            default: ComponentType.button
        },
        /** 알람 타입 (알람/정상/기본) */
        alarmType: {
            type: String,
            default: AlarmType.default.name
        },
        /** 색상 */
        color: {
            type: String
        },
        /** 사이즈 */
        size: {
            type: Number,
            default: 35
        },
        /** 타이틀 */
        title: String,
        /** 클랙 핸들러 */
        onClickHandler: Function
    },
    data: () => ({
        ComponentType,
        AlarmType,
        datas: {
        }
    }),

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    computed: {},

    methods: {
        onClick() {
            this.onClickHandler && this.onClickHandler();
        }
    }
}
</script>

<style scoped lang='scss'>
    @import './AlarmStatusContainer';
</style>