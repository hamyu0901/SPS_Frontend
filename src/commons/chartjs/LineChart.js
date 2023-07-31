import { Line, mixins } from 'vue-chartjs'
import datalabels from 'chartjs-plugin-datalabels'

const { reactiveProp } = mixins;
Chart.defaults.global.plugins.datalabels = false;
export default {
  extends: Line,
  mixins: [reactiveProp],
  plugin: datalabels,
  props: ['options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}

