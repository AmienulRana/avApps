<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Attendance Detail</h1>
          <ChoiseCompany
            v-if="superAdmin"
            @selected:company="dataCompany = $event"
            :options="options"
            :dataCompany="dataCompany"
          />
        </section>
      </section>
      <section class="flex mt-6 flex-wrap w-10/12 items-center">
        <Dropdown
          title="Departement"
          :showDropdown="activeDropdown === 'departement'"
          @update:activeDropdown="changeDropdownActive('departement')"
          :options="departement"
          property="dep_name"
          @selected="
            handleFilter((filter.departement = $event?._id), filter.employment)
          "
          @clearSelected="
            handleFilter((filter.departement = $event), filter.employment)
          "
          :selectedOption="filter.departement"
        />
        <Dropdown
          title="Employment"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="changeDropdownActive('employee')"
          :options="employment"
          property="emp_fullname"
          :selectedOption="filter.employment"
          @selected="
            handleFilter(filter.departement, (filter.employment = $event?._id))
          "
          @clearSelected="
            handleFilter(filter.departement, (filter.employment = $event))
          "
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <section class="bg-white p-4 mt-6">
          <div class="flex items-center px-4">
            <button
              type="button"
              class="flex flex-none items-center justify-center text-gray-400 hover:text-gray-500"
              @click.stop="previousMonth"
            >
              <span class="sr-only">Previous month</span>
              <ChevronLeftIcon class="h-8 w-8" aria-hidden="true" />
            </button>
            <div class="mx-4">
              <p class="text-primary cursor-pointer">
                {{ monthSelected.text }}, {{ yearSelected }}
              </p>
            </div>
            <button
              type="button"
              class="flex flex-none items-center justify-center text-gray-400 hover:text-gray-500"
              @click.stop="nextMonth"
            >
              <span class="sr-only">Next month</span>
              <ChevronRightIcon class="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
        </section>
        <TableDetailAttendance
          :dates_periodic="dates_periodic"
          :attendances="attendance_filter"
        />
      </section>
      <section class="flex justify-between my-6"></section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Dropdown from "../../components/Dropdown.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";
import { GetAttendanceAPI } from "@/actions/attendance";
import TableDetailAttendance from "@/components/TableDetailAttendance.vue";
import moment from "moment";
import { GetPeriodicAPI } from "@/actions/periodic";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";
import { GetDepartementAPI } from "@/actions/departement";
import { GetAllEmployementAPI } from "@/actions/employment";

export default {
  name: "DailyAttedance",
  components: {
    LayoutAdmin,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChoiseCompany,
    TableDetailAttendance,
    Dropdown,
  },
  data() {
    return {
      activeDropdown: "",
      contactEmployee: 0,
      layoutData: "card",
      modal: {
        showTime: "",
        showModal: false,
        time_clockin: {
          hour: null,
          minute: null,
        },
        time_clockout: {
          hour: null,
          minute: null,
        },
        time_breakin: {
          hour: null,
          minute: null,
        },
        time_breakout: {
          hour: null,
          minute: null,
        },
      },
      months: [
        "January",
        "February",
        "March",
        "April",
        "Mei",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],

      monthSelected: {
        number: 1,
        text: "February",
      },
      yearSelected: 2023,
      data: {
        emp_id: "",
      },
      attendances: [],
      attendance_filter: [],
      dates_periodic: [],
      options: [],
      employment: [],
      departement: [],
      superAdmin: false,
      dataCompany: {},
      periodic: [],
      loading: {
        getCompany: true,
        addAttendance: false,
      },
      filter: {
        departement: "",
        employment: "",
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.departement = response.data;
    },
    handleFilter(departement, employment) {
      const newAttendanceProp = this.attendances.map((attendance) => ({
        ...attendance,
        emp_depid: attendance?.emp_id?.emp_depid?._id,
        employment: attendance?.emp_id?._id,
      }));
      const filterConditions = [
        { key: "emp_depid", value: departement },
        { key: "employment", value: employment },
      ];
      const dataFilter = (overtime) =>
        filterConditions.every(
          ({ key, value }) => value == "" || overtime[key] == value
        );
      this.attendance_filter = newAttendanceProp.filter(dataFilter);
    },
    async handleGetEmployement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetAllEmployementAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      const getIdNameEmp = response?.data?.map((employment) => ({
        _id: employment?._id,
        emp_fullname: employment?.emp_fullname,
      }));
      this.employment = getIdNameEmp;
    },
    previousMonth() {
      this.monthSelected.number--;
      if (this.monthSelected.number < 0) {
        this.monthSelected.number = 11;
        this.yearSelected--;
      }
      this.monthSelected.text = this.months[this.monthSelected.number];

      const periodicFilter = this.periodic.filter(
        (period) =>
          period?.periodic_month === this.monthSelected.text &&
          +period?.periodic_years === this.yearSelected
      )[0];
      if (periodicFilter) {
        this.handleCalender(
          periodicFilter?.periodic_start_date,
          periodicFilter?.periodic_end_date
        );
      } else {
        this.toast.error(
          `Can't find periodic ${this.monthSelected.text} ${this.yearSelected}`
        );
      }
    },
    nextMonth() {
      this.monthSelected.number++;
      if (this.monthSelected.number > 11) {
        this.monthSelected.number = 0;
        this.yearSelected++;
      }
      this.monthSelected.text = this.months[this.monthSelected.number];
      const periodicFilter = this.periodic.filter(
        (period) =>
          period?.periodic_month === this.monthSelected.text &&
          +period?.periodic_years === this.yearSelected
      )[0];
      if (periodicFilter) {
        this.handleCalender(
          periodicFilter?.periodic_start_date,
          periodicFilter?.periodic_end_date
        );
      }
    },
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.getCompany = false;
    },
    async handleGetAttendance() {
      this.loading.addAttendance = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetAttendanceAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        const attendanceData = response.data;
        const groupedAttendance = {};
        attendanceData.forEach((attendance) => {
          if (!groupedAttendance[attendance?.emp_id?._id]) {
            groupedAttendance[attendance?.emp_id?._id] = {
              emp_id: {
                _id: attendance?.emp_id?._id,
                emp_fullname: attendance?.emp_id?.emp_fullname,
                emp_depid: attendance?.emp_id?.emp_depid,
              },
              attendances: [],
            };
          }
          groupedAttendance[attendance?.emp_id?._id].attendances.push({
            clock_in: attendance?.clock_in,
            clock_out: attendance?.clock_out,
            break_in: attendance?.break_in,
            break_out: attendance?.break_out,
            workhours_in: attendance?.workhours_in,
            workhours_out: attendance?.workhours_out,
            count_lateduration: attendance?.count_lateduration,
            behavior_at: attendance?.behavior_at,
            attendance_date: attendance?.attendance_date,
            attendance_status: attendance?.attendance_status,
            attendance_deduction: attendance?.attendance_deduction,
          });
        });

        const newAttendanceData = Object.values(groupedAttendance);

        const filterAttendanceWithPeriodic = newAttendanceData.map((data) => {
          data.attendances = data.attendances.filter((attendance) => {
            for (let i = 0; i < this.dates_periodic.length; i++) {
              if (attendance?.attendance_date === this.dates_periodic[i].date) {
                return true;
              }
            }
            return false;
          });
          return data;
        });
        this.attendances = filterAttendanceWithPeriodic;
        this.handleFilter(this.filter.departement, this.filter.employment);
      }
      this.loading.addAttendance = false;
    },
    handleCalender(periodic_start_date, periodic_end_date) {
      let currentDate = moment(periodic_start_date);
      const end = moment(periodic_end_date);
      const dates = [];

      while (currentDate <= end) {
        dates.push({
          show_date: currentDate.format("DD MMM"),
          date: currentDate.format("MM/DD/YYYY"),
        });
        currentDate = currentDate.add(1, "days");
      }
      this.dates_periodic = dates;
    },
    async getPeriodic() {
      const querySuperAdmin = `?company_id=${this?.dataCompany?._id}`;
      const response = await GetPeriodicAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }

      const filterActivePeriodic = response?.data.filter(
        (period) => period?.periodic_status === true
      )[0];
      this.handleCalender(
        filterActivePeriodic?.periodic_start_date,
        filterActivePeriodic?.periodic_end_date
      );
      const indexMonthActive = this.months.indexOf(
        filterActivePeriodic?.periodic_month
      );
      this.monthSelected.number = indexMonthActive;
      this.monthSelected.text = this.months[indexMonthActive];
      this.periodic = response?.data;
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        // this.handleGetAttendance();
        this.handleGetEmployement();
        this.getPeriodic();
        this.handleGetDepartement();
      },
      deep: true,
    },
    dates_periodic: {
      handler: function () {
        this.handleGetAttendance();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getAllCompany();
  },
};
</script>

<style scoped></style>
