<template>
    <v-layout :class="['home']">
        <v-flex lg6 :class="['home__statistics']">
            <alarm-statistics-container
                v-for="alarmStatisticsItem in datas.statisticsAlarmItems"
                :key="alarmStatisticsItem.id"
                :alarm-statistics-item="alarmStatisticsItem"
                @modalStatus="changeReloadStatusHandler"
            />
        </v-flex>
        <v-flex lg6 :class="['home__analysis']">
            <v-layout :class="['home__analysis-container']" column fill-height>
                <predict-analysis-container
                    v-for="predictAnalysisItem in datas.predictAnalysisItems"
                    :key="predictAnalysisItem.id"
                    :predict-analysis-item="predictAnalysisItem"
                    @modalStatus="changeReloadStatusHandler"
                />
            </v-layout>
            <v-layout :class="['home__analysis-container']">
                <predict-analysis-container
                    :class="['home__analysis-container__sub-predict']"
                    v-for="predictAnalysisItem in datas.predictPartialAnalysisItems"
                    :key="predictAnalysisItem.id"
                    :predict-analysis-item="predictAnalysisItem"
                    @modalStatus="changeReloadStatusHandler"
                />
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import {
    getPredictAnalysisAccumResultAPI,
    getPredictAnalysisPMTorqueResultAPI,
    getPredictAnalysisTemperatureResultAPI,
    getPredictAnalysisAtomizerResultAPI,
    getZoneAlarmStatisticsResultAPI,
    getZoneAlarmStatisticsCodeResultAPI,
    getRobotAlarmStatisticsResultAPI,
    getRobotAlarmStatisticsCodeResultAPI, getZoneAlarmStatisticsAPI, getRobotAlarmStatisticsAPI
} from "@/api/homeAPI";
import AlarmStatisticsContainer from "@/components/home/home/alarmstatisticscontainer/AlarmStatisticsContainer";
import PredictAnalysisContainer from "@/components/home/home/predictanalysiscontainer/PredictAnalysisContainer";
export default {
    components: { AlarmStatisticsContainer, PredictAnalysisContainer },
    data: (vm) => ({
        datas: {
            timer: null,
            intervalTime: 300000, // [TODO]: 추후 설정할 수 있도록 반영 예정,
            modalStatus: false,
            statisticsAlarmItems: [
                {
                    id: 'zoneAlarmStatisticsResult',
                    title: vm.$t('home.main.statisticsAlarmItems.zoneAlarmStatisticsResult.title'),
                    totalCountTitle: vm.$t('home.main.statisticsAlarmItems.zoneAlarmStatisticsResult.totalCountTitle'),
                    codeTitle: vm.$t('home.main.statisticsAlarmItems.zoneAlarmStatisticsResult.codeTitle'),
                    chartTitle: vm.$t('home.main.statisticsAlarmItems.zoneAlarmStatisticsResult.chartTitle'),
                    analysisType: 'statistics',
                    alarmType: 'zone',
                    api: getZoneAlarmStatisticsResultAPI(),
                    codeApi: getZoneAlarmStatisticsCodeResultAPI(),
                    listApi: getZoneAlarmStatisticsAPI()
                },
                {
                    id: 'robotAlarmStatisticsResult',
                    title: vm.$t('home.main.statisticsAlarmItems.robotAlarmStatisticsResult.title'),
                    totalCountTitle: vm.$t('home.main.statisticsAlarmItems.robotAlarmStatisticsResult.totalCountTitle'),
                    codeTitle: vm.$t('home.main.statisticsAlarmItems.robotAlarmStatisticsResult.codeTitle'),
                    chartTitle: vm.$t('home.main.statisticsAlarmItems.robotAlarmStatisticsResult.chartTitle'),
                    analysisType: 'statistics',
                    alarmType: 'robot',
                    api: getRobotAlarmStatisticsResultAPI(),
                    codeApi: getRobotAlarmStatisticsCodeResultAPI(),
                    listApi: getRobotAlarmStatisticsAPI()
                },
            ],
            predictAnalysisItems: [
                {
                    id: 'predictAnalysisAccumResult',
                    title: vm.$t('home.main.predictAnalysisItems.predictAnalysisAccumResult.title'),
                    totalCountTitle: vm.$t('home.main.predictAnalysisItems.predictAnalysisAccumResult.totalCountTitle'),
                    chartTitle: vm.$t('home.main.predictAnalysisItems.predictAnalysisAccumResult.chartTitle'),
                    analysisType: 'predict',
                    alarmType: 'accum',
                    predictType: 'accum_alarm_status',
                    titleImage: require('@/images/home/predict_accumulation.png'),
                    api: getPredictAnalysisAccumResultAPI(),
                },
                {
                    id: 'predictAnalysisAtomizerResult',
                    title: vm.$t('home.main.predictAnalysisItems.predictAnalysisAtomizerResult.title'),
                    totalCountTitle: vm.$t('home.main.predictAnalysisItems.predictAnalysisAtomizerResult.totalCountTitle'),
                    chartTitle: vm.$t('home.main.predictAnalysisItems.predictAnalysisAtomizerResult.chartTitle'),
                    analysisType: 'predict',
                    alarmType: 'atomizer',
                    predictType: 'atomizer_alarm_status',
                    titleImage: require('@/images/home/predict_pmtorque.png'), // 없어도 되서 안바꿈
                    api: getPredictAnalysisAtomizerResultAPI(),
                }
            ],
            predictPartialAnalysisItems: [
                {
                    id: 'predictAnalysisTemperatureResult',
                    title: vm.$t('home.main.predictAnalysisItems.predictAnalysisTemperatureResult.title'),
                    totalCountTitle: vm.$t('home.main.predictAnalysisItems.predictAnalysisTemperatureResult.totalCountTitle'),
                    chartTitle: vm.$t('home.main.predictAnalysisItems.predictAnalysisTemperatureResult.chartTitle'),
                    analysisType: 'predict',
                    alarmType: 'temperature',
                    predictType: 'temperature_alarm_status',
                    titleImage: require('@/images/home/predict_temperature.png'),
                    api: getPredictAnalysisTemperatureResultAPI()
                },
                {
                    id: 'predictAnalysisPMTorqueResult',
                    title: vm.$t('home.main.predictAnalysisItems.predictAnalysisPMTorqueResult.title'),
                    totalCountTitle: vm.$t('home.main.predictAnalysisItems.predictAnalysisPMTorqueResult.totalCountTitle'),
                    chartTitle: vm.$t('home.main.predictAnalysisItems.predictAnalysisPMTorqueResult.chartTitle'),
                    analysisType: 'predict',
                    alarmType: 'pm-torque',
                    predictType: 'pmtorque_alarm_status',
                    titleImage: require('@/images/home/predict_pmtorque.png'),
                    api: getPredictAnalysisPMTorqueResultAPI()
                },
            ]
        }
    }),

    created() {
    },

    mounted() {
        this.setTimeInterval();
    },

    destroyed() {
        this.clearTimeInterval();
    },

    computed: {

    },

    methods: {
        reloadPage() {
            if(!this.datas.modalStatus) {
                this.clearTimeInterval();
                this.$router.go();
            }
        },

        setTimeInterval() {
            this.datas.timer = setInterval(() => {
                this.reloadPage();
            }, this.datas.intervalTime);
        },

        clearTimeInterval() {
            clearInterval(this.datas.timer);
            this.datas.timer = null;
        },

        changeReloadStatusHandler(modalStatus) {
            this.datas.modalStatus = modalStatus;
        }
    }
}
</script>

<style scoped lang='scss'>
    @import 'Home';
</style>
