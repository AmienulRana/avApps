<template>
  <Layout>
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center flex-wrap">
        <section class="flex items-center">
          <h1 class="md:text-2xl text-lg">Holiday</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading.employement"
            @selected:company="dataCompany = $event"
            :options="options"
            :dataCompany="dataCompany"
          />
        </section>
        <Button
          class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2 md:mt-0"
          @click="showModal = true"
          >Add Holiday</Button
        >
      </section>
      <section class="bg-white mt-10 py-5 px-10 mb-10">
        <section class="mb-2">
          <h1 class="text-xl text-gray-400 ml-5">January 2023</h1>
        </section>
        <section class="w-full mt-10 border">
          <div class="grid grid-cols-7 thead">
            <p
              v-for="day in days"
              :key="day"
              class="px-4 text-center th py-2 text-overflow-ellipsis white-space-nowrap"
            >
              {{ day }}
            </p>
          </div>
          <div v-for="week in weeksInPeriod" :key="week">
            <section class="grid grid-cols-7 tbody">
              <p
                v-for="day in week"
                :key="day"
                :class="[
                  'h-28 w-full td text-right text-sm',
                  isToday(day) ? 'bg-blue-500 text-white' : 'text-gray-400',
                ]"
              >
                {{ day.date }}
              </p>
            </section>
          </div>
        </section>
      </section>
    </section>
  </Layout>
</template>

<script>
import moment from "moment";
import Layout from "@/components/Layout/Admin.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";

export default {
  name: "HolidayPage",
  components: { Layout, ChoiseCompany },
  data() {
    return {
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      weeksInPeriod: [],
      options: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        employement: true,
      },
    };
  },
  mounted() {
    let startDate = moment("2022-12-25");
    let endDate = moment("2023-01-25");
    let currentWeek = [];
    let day = startDate.day();
    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, "days")) {
      currentWeek[day] = { date: m.format("DD"), day: m.format("dddd") };
      if (day === 6 || m.isSame(endDate, "day")) {
        this.weeksInPeriod.push(currentWeek);
        currentWeek = [];
        day = 0;
      } else {
        day++;
      }
    }

    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
  },
  methods: {
    isToday(day) {
      let date = moment(day.date, "DD");
      return moment().isSame(date, "day");
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response.data;
      this.dataCompany = response.data[0];
      this.loading.employement = false;
    },
  },
};
</script>

<style scoped>
.tbody .td {
  text-align: right;
  padding-top: 5px !important;
  padding-right: 10px !important;
  font-size: 12px;
  border: 1px solid rgb(239, 239, 239);
}
.thead .th {
  padding-top: 5px !important;
  padding-right: 10px !important;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid rgb(239, 239, 239);
}
.th {
  overflow-wrap: break-word;
}
</style>
