import { Pie, mixins } from 'vue-chartjs'
import inLabels from 'chartjs-plugin-labels'

const { reactiveProp } = mixins
Chart.defaults.global.plugins.labels = false;
export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options'],
  plugin: inLabels,
  mounted () {
    this.renderChart(this.chartData, this.options);
  }
  
}

