<template>
    <v-layout :class="['production-info-board']">
        <v-layout :class="['production-info-board__title']" v-if="title">
            <p>{{title}}</p>
        </v-layout>
        <v-layout :class="['production-info-board__contents']">
            <table :class="['production-info-board__contents-table']">
                <thead>
                    <tr>
                        <th
                          v-for="headerItem in headerItems"
                          :key="headerItem.id"
                        >{{headerItem.title}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(contentsItem, contentsItemIndex) in contentsItems" :key="'contentsItem' + contentsItemIndex">
                        <td v-for="headerItem in headerItems" :key="headerItem.id">{{contentsItem[headerItem.id]}}</td>
                    </tr>
                </tbody>
            </table>
        </v-layout>
    </v-layout>
</template>
<script>
import AlarmStatusContainer from "@/commons/alarmstatuscontainer/AlarmStatusContainer.vue";

export default {
  components: {AlarmStatusContainer},
    props: {
        title: String,
        headerItems: Array,
        contentsItems: Array
    },
    data: () => ({
        datas: {

        }
    }),
}
</script>
<style scoped lang="scss">
    @import 'ProductionInfoBoard';
</style>
