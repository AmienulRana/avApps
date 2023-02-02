<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Attendance Detail</h1>
          <ChoiseCompany
            v-if="superAdmin"
            @selected:company="dataCompany = $event"
            :options="optionsCompany"
            :dataCompany="dataCompany"
          />
        </section>
      </section>
      <section class="flex mt-6 flex-wrap w-10/12 items-center">
        <Button
          class="bg-white w-10 h-10 text-primary rounded-full shadow-md"
          @click="handleShowLayoutData"
        >
          <font-awesome-icon icon="fa-table" />
        </Button>
        <Dropdown
          ref="dropdown"
          title="Today"
          :showDropdown="activeDropdown === 'today'"
          @update:activeDropdown="(e) => changeDropdownActive('today')"
        />
        <Dropdown
          ref="dropdown"
          title="Departement"
          :showDropdown="activeDropdown === 'departement'"
          @update:activeDropdown="changeDropdownActive('departement')"
        />
        <Dropdown
          ref="dropdown"
          title="Shift"
          :showDropdown="activeDropdown === 'shift'"
          @update:activeDropdown="changeDropdownActive('shift')"
        />
        <Dropdown
          ref="dropdown"
          title="Behavior"
          :showDropdown="activeDropdown === 'behavior'"
          @update:activeDropdown="changeDropdownActive('behavior')"
        />
        <Dropdown
          ref="dropdown"
          title="Type"
          :showDropdown="activeDropdown === 'type'"
          @update:activeDropdown="changeDropdownActive('type')"
        />
        <Dropdown
          ref="dropdown"
          title="Employee"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="changeDropdownActive('employee')"
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <TableDetailAttendance
          :dates_periodic="dates_periodic"
          :attendances="attendances"
        />
      </section>
      <section class="flex justify-between my-6"></section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Dropdown from "../../components/Dropdown.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";
import { GetAttendanceAPI } from "@/actions/attendance";
import TableDetailAttendance from "@/components/TableDetailAttendance.vue";
import moment from "moment";
import { GetPeriodicActiveAPI } from "@/actions/periodic";

export default {
  name: "DailyAttedance",
  components: {
    LayoutAdmin,
    Button,
    Dropdown,
    ChoiseCompany,
    TableDetailAttendance,
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
      data: {
        emp_id: "",
      },
      attendances: [],
      dates_periodic: [],
      optionsCompany: [],
      employment: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getCompany: true,
        addAttendance: false,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    handleShowLayoutData() {
      this.layoutData = this.layoutData === "card" ? "table" : "card";
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
      this.optionsCompany = response?.data;
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
          if (!groupedAttendance[attendance.emp_id._id]) {
            groupedAttendance[attendance.emp_id._id] = {
              emp_id: {
                _id: attendance?.emp_id?._id,
                emp_fullname: attendance?.emp_id?.emp_fullname,
                emp_depid: attendance?.emp_id?.emp_depid,
              },
              attendances: [],
            };
          }
          groupedAttendance[attendance.emp_id._id].attendances.push({
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
      const response = await GetPeriodicActiveAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.handleCalender(
        response?.data?.periodic_start_date,
        response?.data?.periodic_end_date
      );
      this.periodic = response?.data;
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        // this.handleGetAttendance();
        this.getPeriodic();
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
