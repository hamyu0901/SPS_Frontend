<template>
    <div>
        <div class="titleBar">{{ui.title}}</div>
        <div>
            <DxChart
                id="chart"
                :data-source="datas.chartData"
                palette="Violet"
                :customize-point="customizePoint"
                :customize-label="customizeLabel"
            >
                <DxArgumentAxis :tick-interval="10">
                <DxLabel format="decimal"/>
                </DxArgumentAxis>
                <DxSeries
                    type="spline"
                    argument-field="day"
                    value-field="temperature"
                >
                </DxSeries>
                <DxValueAxis>
                    <DxLabel :customize-text="customizeText"/>
                    <DxStrip
                        :start-value="datas.highAverage"
                        color="rgba(255,155,85,0.15)"
                    >
                        <DxLabel text="Above average">
                            <DxFont :color='datas.highAverageColor'/>
                        </DxLabel>
                    </DxStrip>
                    <DxStrip
                        :end-value="datas.lowAverage"
                        color="rgba(97,153,230,0.10)"
                    >
                        <DxLabel text="Below average">
                            <DxFont :color='datas.lowAverageColor'/>
                        </DxLabel>
                    </DxStrip>
                    <DxStripStyle>
                        <DxLabel>
                            <DxFont
                                :weight="500"
                                :size="14"
                            />
                        </DxLabel>
                    </DxStripStyle>
                </DxValueAxis>
                <DxLegend :visible="false"/>
                <DxTooltip
                    :enabled="true"
                />

            </DxChart>
        </div>
    </div>
</template>

<script>
import {
    DxChart,
    DxArgumentAxis,
    DxLabel,
    DxSeries,
    DxLegend,
    DxValueAxis,
    DxStrip,
    DxStripStyle,
    DxFont,
    DxTooltip
} from 'devextreme-vue/chart'
export default {
    components: {
        DxChart,
        DxArgumentAxis,
        DxLabel,
        DxSeries,
        DxLegend,
        DxValueAxis,
        DxStrip,
        DxStripStyle,
        DxFont,
        DxTooltip
    },
    props: ['selectedGridData'],
    data() {
        return {
            ui : {
                title: ''
            },
            datas: {
                selectedGridData: {},
                chartData: [
                    { temperature: 52, day: '1' },
                    { temperature: 57, day: '2' },
                    { temperature: 58, day: '3' },
                    { temperature: 56, day: '4' },
                    { temperature: 59, day: '5' },
                    { temperature: 59, day: '6' },
                    { temperature: 56, day: '7' },
                    { temperature: 62, day: '8' },
                    { temperature: 57, day: '9' },
                    { temperature: 54, day: '10' },
                    { temperature: 52, day: '11' },
                    { temperature: 58, day: '12' },
                    { temperature: 53, day: '13' },
                    { temperature: 54, day: '14' },
                    { temperature: 57, day: '15' },
                    { temperature: 61, day: '16' },
                    { temperature: 58, day: '17' },
                    { temperature: 63, day: '18' },
                    { temperature: 64, day: '19' },
                    { temperature: 52, day: '20' },
                ],
                highAverage : 60.8,
                lowAverage : 53,
                highAverageColor: '#ff9b52',
                lowAverageColor: '#6199e6',
            }
        }
    },

    mounted() {
        this.datas.selectedGridData = this.selectedGridData
        this.setHeaderTitle();
    },
    watch:{
        selectedGridData(){
            this.datas.selectedGridData = this.selectedGridData
            this.setHeaderTitle();
        }
    },
    methods: {
        setHeaderTitle(){
            this.ui.title = `${this.datas.selectedGridData.data.robot} ${this.datas.selectedGridData.column.caption} 토크 적산값 이상 발생현황`
        },
        customizePoint(arg){
            if (arg.value > this.datas.highAverage) {
                return { color: this.datas.highAverageColor };
            }
            if (arg.value < this.datas.lowAverage) {
                return { color: this.datas.lowAverageColor };
            }
            return null;
        },
        customizeLabel(arg){
            if (arg.value > this.datas.highAverage) {
                return this.getLabelsSettings(this.datas.highAverageColor);
            }
            if (arg.value < this.datas.lowAverage) {
                return this.getLabelsSettings(this.datas.lowAverageColor);
            }
            return null;
        },
        customizeText(arg) {
            return `${arg.valueText}`;
        },
        getLabelsSettings(backgroundColor) {
            return {
                visible: true,
                backgroundColor,
                customizeText: this.customizeText,
            };
        },
    }
}
</script>

<style>
    .titleBar{
        margin-top: 20px;
        color: #ff9b52;
        font-size: medium;
        text-align: center;
    }
</style>