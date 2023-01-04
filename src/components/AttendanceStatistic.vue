<template>
  <section class="w-full bg-white px-4 py-6 wrapper-bar-donught">
    <div
      class="flex justify-center md:justify-start items-center mb-5 border-b pb-5"
    >
      <h1 class="md:text-xl">Total Attedance</h1>
    </div>
    <div class="h-72">
      <doughnut :data="chartData" :options="options"></doughnut>
    </div>
    <p class="flex items-center text-gray-400">
      <span class="w-4 h-4 mr-2 rounded bg-green-400" />
      Early - 12
    </p>
    <p class="flex items-center text-gray-400">
      <span class="w-4 h-4 mr-2 rounded bg-red-600" />
      Late - 2
    </p>
    <p class="flex items-center text-gray-400">
      <span class="w-4 h-4 mr-2 rounded bg-orange-400" />
      Regular - 5
    </p>
  </section>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import { ArcElement, Chart as ChartJS } from "chart.js";
ChartJS.register(ArcElement);

export default {
  name: "AttedanceStatistic",
  extends: Doughnut,
  data: () => ({
    chartData: {
      labels: ["Early", "Late", "Regular"],
      datasets: [
        {
          data: [12, 2, 5],
          backgroundColor: [
            "rgb(249 115 22)",
            "rgb(239 68 68)",
            "rgb(34 197 94)",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  }),
  components: { Doughnut },
};
</script>

<style scoped>
.wrapper-bar-donught {
  height: 500px;
}
p {
  font-size: 14px;
  margin-top: 4px;
}
</style>
