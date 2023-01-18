<template>
  <Layout>
    <section class="md:px-8 px-4 mt-6 w-full relative">
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
        <!-- <Button
          class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2 md:mt-0"
          @click="showModal = true"
          >Add Holiday</Button
        > -->
      </section>
      <section class="bg-white mt-10 py-5 px-10 mb-10">
        <section class="mb-2">
          <h1 class="text-xl text-gray-400 ml-5">
            {{ periodic?.periodic_month }} {{ periodic?.periodic_years }}
          </h1>
          <p class="text-sm text-gray-400 ml-5">
            {{ periodic?.periodic_start_date }} to
            {{ periodic?.periodic_end_date }}
          </p>
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
                  'h-28 w-full td text-right text-sm not-cuti relative',
                  isToday(day) ? 'bg-blue-500 text-white' : 'text-gray-400',
                  isSunday(day) ? 'text-red-500' : '',
                ]"
              >
                {{ day?.date }}
                <br />
                <span
                  v-if="day?.isHoliday"
                  class="text-white rounded-md text-xs bg-primary absolute top-8 right-0 w-full border-r-primary p-1"
                  >{{ day?.holidayName }}</span
                >
              </p>
            </section>
          </div>
        </section>
      </section>
      <Loading v-if="loading.calendar" />
    </section>
  </Layout>
</template>

<script>
import moment from "moment";
import Layout from "@/components/Layout/Admin.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetPeriodicActiveAPI } from "@/actions/periodic";
import { GetLeaveHolidayAPI } from "@/actions/leave-holiday";
import Loading from "@/components/Loading.vue";

export default {
  name: "HolidayPage",
  components: { Layout, ChoiseCompany, Loading },
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
      holidays: [],
      options: [],
      periodic: {},
      superAdmin: false,
      dataCompany: {},
      loading: {
        calendar: true,
        employement: true,
      },
    };
  },
  mounted() {
    this.getAllCompany();
    // this.handleCalender();
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.getPeriodic();
      },
      deep: true,
    },
    holidays: {
      handler: function () {
        this.handleCalender(
          this.periodic?.periodic_start_date,
          this.periodic?.periodic_end_date
        );
        this.loading.calendar = false;
      },
      deep: true,
    },
  },
  methods: {
    handleCalender(periodic_start_date, periodic_end_date) {
      let startDate = moment(periodic_start_date);
      let endDate = moment(periodic_end_date);

      let currentWeek = [];
      let day = startDate.day();
      for (
        let m = moment(startDate);
        m.isSameOrBefore(endDate);
        m.add(1, "days")
      ) {
        currentWeek[day] = {
          date: m.format("DD"),
          month: m.format("MM"),
          years: m.format("YYYY"),
          day: m.format("dddd"),
          isHoliday: false,
          holidayName: "",
        };
        const holiday = this.checkHoliday(m.format("YYYY-MM-DD"));
        currentWeek[day].isHoliday = holiday?.isHoliday;
        currentWeek[day].holidayName = holiday?.holidayName;

        if (
          day === 6 ||
          m.isSame(endDate, "day") ||
          m.date() === moment(m).endOf("month").date()
        ) {
          this.weeksInPeriod.push(currentWeek);
          currentWeek = [];
          day = 0;
        } else {
          day++;
        }
      }
    },
    checkHoliday(date) {
      const holiday = this.holidays.find((holiday) => {
        return moment(date).isBetween(
          holiday?.leavehol_startdate,
          holiday?.leavehol_enddate,
          "days",
          "[]"
        );
      });
      if (holiday) {
        return { isHoliday: true, holidayName: holiday.leavehol_desc };
      } else {
        return { isHoliday: false, holidayName: "" };
      }
    },
    isToday(day) {
      const newDate = `${day?.date}-${day?.month}-${day?.years}`;
      let date = moment(newDate, "DD-MM-YYYY");
      return moment().isSame(date, "day");
    },
    isSunday(day) {
      return day?.day === "Sunday";
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response.data;
      this.dataCompany = response.data[0];
      this.loading.employement = false;
    },
    async getPeriodic() {
      const querySuperAdmin = `?company_id=${this?.dataCompany?._id}`;
      const response = await GetPeriodicActiveAPI(querySuperAdmin);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.periodic = response.data;
      this.getLeaveHoliday();
    },
    async getLeaveHoliday() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetLeaveHolidayAPI(queryAdminSuper);

      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      const selectPropertyHoliday = response?.data?.map((holiday) => ({
        leavehol_desc: holiday?.leavehol_desc,
        leavehol_enddate: holiday?.leavehol_enddate,
        leavehol_startdate: holiday?.leavehol_startdate,
        leavehol_status: holiday?.leavehol_status,
        leavehol_type: holiday?.leavehol_type,
      }));
      this.holidays = selectPropertyHoliday;
      this.loading.getLeaveHol = false;
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
}
.tbody .not-cuti {
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
