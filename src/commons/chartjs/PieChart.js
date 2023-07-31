import { Pie, mixins } from 'vue-chartjs'
import outlabeledPie from 'chartjs-plugin-piechart-outlabels'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options'],
  plugin: outlabeledPie,
  mounted () {
    this.renderChart(this.chartData, this.options);
  }
  
}

