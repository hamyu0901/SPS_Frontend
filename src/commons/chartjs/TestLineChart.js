import { Line} from 'vue-chartjs'

export default {
  extends: Line,
  props: ['chartData','options'],
  whatch: {
    'chartData': {
      handler(oldData, newData){
        // do stuff
        this.renderChart(this.chartData, this.options)
      },
      deep: true
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
  
}

