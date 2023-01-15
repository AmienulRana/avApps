<template>
  <section class="w-full bg-white px-8 py-6 wrapper-bar-chart">
    <div
      class="flex justify-between flex-col md:flex-row items-center mb-5 border-b pb-5"
    >
      <h1 class="md:text-xl mb-5">Employee Statistics</h1>
      <div class="flex cursor-pointer">
        <p
          class="text-xs"
          :class="statistic_by === 'status' && 'text-primary'"
          @click="changeDataStatistik('status')"
        >
          By Employment Status
        </p>
        <p
          class="text-xs mx-3"
          :class="statistic_by === 'designation' && 'text-primary'"
          @click="changeDataStatistik('designation')"
        >
          By Designation
        </p>
        <p
          class="text-xs"
          :class="statistic_by === 'departement' && 'text-primary'"
          @click="changeDataStatistik('departement')"
        >
          By Departement
        </p>
      </div>
    </div>
    <Bar :data="data" :options="options" />
  </section>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "DepartementPage",
  props: { total_employment_status: Object },
  data() {
    return {
      employment_status: this.total_employment_status,
      statistic_by: "status",
      data: {
        labels: ["Probation", "Permanent", "Terminated"],
        datasets: [
          {
            data: [9, 20, 5],
            backgroundColor: "#1976d3",
            barThickness: 30,
            borderColor: "white",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        defaultFontFamily: "Poppins",
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              color: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
            },
            ticks: {
              maxTicksLimit: 7,
              padding: 10,
            },
          },
        },
      },
    };
  },
  components: { Bar },
  methods: {
    getValueWithoutProperty(data, property) {
      return data.map((d) => d[property]);
    },
    changeDataStatistik(value) {
      this.statistic_by = value;
      switch (this.statistic_by) {
        case "status":
          this.data = {
            labels: this.getValueWithoutProperty(
              this.total_employment_status,
              "status"
            ),
            datasets: [
              {
                data: this.getValueWithoutProperty(
                  this.total_employment_status,
                  "total_employment"
                ),
                ...this.data.datasets,
              },
            ],
          };
          break;
        case "designation":
          this.data = {
            datasets: [
              {
                data: [3, 1, 3, 4, 4, 8],
                ...this.data.datasets,
              },
            ],
            labels: [
              "Director",
              "CTO",
              "General Manager",
              "HR Manager",
              "Project Manager",
              "Software Enginner",
            ],
          };
          break;

        default:
          this.data = {
            datasets: [
              {
                data: [7, 4, 2, 8, 9],
                ...this.data.datasets,
              },
            ],
            labels: [
              "Accounts",
              "UI & UX",
              "Admin & HRM",
              "Development",
              "Software",
            ],
          };
          break;
      }
    },
  },
  watch: {
    total_employment_status: {
      handler: function (newValue) {
        this.employment_status = newValue;
        this.data = {
          labels: this.getValueWithoutProperty(
            this.total_employment_status,
            "status"
          ),
          datasets: [
            {
              data: this.getValueWithoutProperty(
                this.total_employment_status,
                "total_employment"
              ),
              ...this.data.datasets,
            },
          ],
        };
      },
      deep: true,
    },
  },
  mounted() {
    // this.data = {
    //   labels: this.getValueWithoutProperty(
    //     this.total_employment_status,
    //     "status"
    //   ),
    //   datasets: [
    //     {
    //       data: this.getValueWithoutProperty(
    //         this.total_employment_status,
    //         "total_employment"
    //       ),
    //       ...this.data.datasets,
    //     },
    //   ],
    // };
  },
};
</script>

<style scoped>
.wrapper-bar-chart {
  height: auto;
}
</style>
