<template>
    <v-layout>
        <v-card :class="['alarm-remedy-card']">
            <v-layout v-for="(item, index) in items" :key="index" column >
                <span> {{datas.title.cause }} {{ index+1 }}: </span>
                <p>{{ item.cause }}</p>
                <span> {{datas.title.remedy}} {{ index+1 }}: </span>
                <p v-html="replaceNewLineWithBr(item.remedy)"></p>
            </v-layout>
        </v-card>
        <v-card v-if="items.length === 0" :class="['alarm-remedy-card-empty']">
            {{ datas.title.emptyTitle }}
        </v-card>
    </v-layout>
</template>
<script>


export default {
    props: {
        items : {
            type: Array
        }
    },
    data(vm) {
        return {
            datas : {
                title : {
                    emptyTitle: vm.$t('monitoring.line.title.emptyTitle'),
                    cause : vm.$t('monitoring.line.title.cause'),
                    remedy :  vm.$t('monitoring.line.title.remedy'),
                }
            }
        }
    },
    computed : {
        replaceNewLineWithBr(){
            return (str) => {
                return str ? str.replace(/\n/g, "<br>") : str;
            }
        }

    },
}
</script>
\
<style scoped lang="scss">
    @import './AlarmRemedyCard.scss'
</style>