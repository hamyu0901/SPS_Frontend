<template>
  <div>
      <bar-chart :chartData="chartData" :options="barChartOption"></bar-chart>
  </div>
</template>

<script>
import BarChartJS from './chartjs/BarChart.js'
export default {
    components:{
        barChart: BarChartJS,
    },
    data:() => ({
        chartData: null,
        barChartOption: {
            maintainAspectRatio: false, // default value. false일 경우 포함된 div의 크기에 맞춰서 그려짐.
            scales: {
                yAxes: [
                {
                    ticks: {
                    beginAtZero: true,
                    },
                },
                ],
            },
        },
    }),
    created(){
        this.fillData();
    },
    methods:{
        fillData () {
            this.chartData = {
                labels: ["1축", "2축", "3축", "4축", "5축", "6축"],
                datasets: [
                    {
                        label: ['온도'],
                        data: [0, 0, 1, 2, 67, 62],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255,99,132,1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    }
                ],
                
            }
        },
    }
}
</script>

<style>

</style>