<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Daily Log</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading.getCompany"
            @selected:company="dataCompany = $event"
            :options="optionsCompany"
            :dataCompany="dataCompany"
          />
        </section>
        <div class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
            >Add Absensi</Button
          >
          <Button class="bg-seagreen rounded text-white px-6 py-2"
            >Settings</Button
          >
        </div>
      </section>
      <section class="flex mt-6 flex-wrap w-10/12 items-center">
        <section class="relative">
          <Button
            class="rounded-full px-6 text-gray-400 py-2 duration-300 text-sm"
            :class="[
              'bg-white hover:bg-gray-50 hover:text-blue-800',
              filter.date && filter.date !== dateToday()
                ? 'text-primary bg-gray-50'
                : '',
            ]"
            @click.stop="changeDropdownActive('date')"
            style="min-width: 80px; min-height: 30px"
          >
            {{ filter.date === dateToday() ? "Today" : filter.date }}
            <font-awesome-icon
              icon="fa-xmark"
              class="ml-3 text-primary"
              v-if="filter.date && filter.date !== dateToday()"
              @click.stop="
                handleFilter(
                  (filter.date = dateToday()),
                  filter.departement,
                  filter.workshift,
                  filter.behavior,
                  filter.status,
                  filter.employment
                );
                activeDropdown = '';
              "
            />
          </Button>
          <Transition
            enter-active-class="animated fadeInDown"
            leave-active-class="animated fadeOutUp"
          >
            <Calender
              class="absolute top-10 left-0 z-20 mt-2.5"
              v-if="activeDropdown === 'date'"
              @selected="
                handleFilter(
                  (filter.date = $event),
                  filter.departement,
                  filter.workshift,
                  filter.behavior,
                  filter.status,
                  filter.employment
                )
              "
            />
          </Transition>
        </section>

        <Dropdown
          title="Departement"
          :showDropdown="activeDropdown === 'departement'"
          @update:activeDropdown="changeDropdownActive('departement')"
          :options="departement"
          property="dep_name"
          @selected="
            handleFilter(
              filter.date,
              (filter.departement = $event?._id),
              filter.workshift,
              filter.behavior,
              filter.status,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.date,
              (filter.departement = $event),
              filter.workshift,
              filter.behavior,
              filter.status,
              filter.employment
            )
          "
          :selectedOption="filter.departement"
        />
        <Dropdown
          title="Workshift"
          :showDropdown="activeDropdown === 'workshift'"
          @update:activeDropdown="changeDropdownActive('workshift')"
          :options="shifts"
          property="shift_name"
          @selected="
            handleFilter(
              filter.date,
              filter.departement,
              (filter.workshift = $event?._id),
              filter.behavior,
              filter.status,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.date,
              filter.departement,
              (filter.workshift = $event),
              filter.behavior,
              filter.status,
              filter.employment
            )
          "
          :selectedOption="filter.workshift"
        />
        <Dropdown
          title="Behavior"
          :showDropdown="activeDropdown === 'behavior'"
          @update:activeDropdown="changeDropdownActive('behavior')"
          :options="['Early', 'Regular', 'Late', 'Very Late']"
          @selected="
            handleFilter(
              filter.date,
              filter.departement,
              filter.workshift,
              (filter.behavior = $event),
              filter.status,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.date,
              filter.departement,
              filter.workshift,
              (filter.behavior = $event),
              filter.status,
              filter.employment
            )
          "
          :selectedOption="filter.behavior"
        />
        <Dropdown
          title="Status"
          :showDropdown="activeDropdown === 'type'"
          @update:activeDropdown="changeDropdownActive('type')"
          :options="['Attendance', 'Absent', 'Off Day', 'Cuti Bersama']"
          @selected="
            handleFilter(
              filter.date,
              filter.departement,
              filter.workshift,
              filter.behavior,
              (filter.status = $event),
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.date,
              filter.departement,
              filter.workshift,
              filter.behavior,
              (filter.status = $event),
              filter.employment
            )
          "
          :selectedOption="filter.status"
        />
        <Dropdown
          title="Employment"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="changeDropdownActive('employee')"
          :options="employment"
          property="emp_fullname"
          :selectedOption="filter.employment"
          @selected="
            handleFilter(
              filter.date,
              filter.departement,
              filter.workshift,
              filter.behavior,
              filter.status,
              (filter.employment = $event?._id)
            )
          "
          @clearSelected="
            handleFilter(
              filter.date,
              filter.departement,
              filter.workshift,
              filter.behavior,
              filter.status,
              (filter.employment = $event)
            )
          "
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <section class="relative">
          <section
            class="w-full overflow-x-auto custom-scrollbar relative"
            :class="loading.getAttendance ? 'h-96' : ''"
          >
            <table
              class="bg-white min-w-max mt-6 w-full pb-4"
              @click="showActions = null"
            >
              <thead class="border-b bg-white border-gray-200 text-gray-400">
                <tr>
                  <th class="text-left text-sm">Profile</th>
                  <th class="text-left text-sm">Clock In</th>
                  <th class="text-left text-sm">Clock out</th>
                  <th class="text-left text-sm">Status</th>
                  <th class="text-left text-sm">Behaviour</th>
                  <th class="text-left text-sm">Type</th>
                  <th class="text-left text-sm">Total Hours</th>
                  <th class="text-left text-sm">Break</th>
                  <th class="text-left text-sm">Orthers Break</th>
                  <th class="text-left text-sm">Deducation</th>
                  <th class="text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody v-if="!loading.addAttendance">
                <tr
                  class="border-b"
                  v-for="(attedance, i) in attendance_filter"
                  :key="i"
                >
                  <td class="flex items-center p-3 text-sm">
                    <div
                      class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
                    >
                      <h2 class="text-md text-white">
                        {{
                          attedance?.emp_id?.emp_fullname.substr(0, 1) +
                          attedance?.emp_id?.emp_fullname.substr(
                            attedance?.emp_id?.emp_fullname.indexOf(" ") + 1,
                            1
                          )
                        }}
                      </h2>
                    </div>
                    <div class="ml-5">
                      <h1 class="text-blue-400 text-base">
                        {{ attedance?.emp_id?.emp_fullname }}
                      </h1>
                      <p class="text-sm mb-1 text-gray-600">
                        {{ attedance?.emp_id?.emp_depid?.dep_name }}
                      </p>
                      <p class="text-xs text-gray-400">
                        {{ attedance?.shift_id?.shift_name }} ({{
                          attedance?.workhours_in
                        }}
                        - {{ attedance?.workhours_out }})
                      </p>
                    </div>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm text-gray-400">
                      {{ attedance?.clock_in }}
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm text-gray-400">
                      {{ attedance?.clock_out }}
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <p
                      class="text-sm"
                      :class="
                        attedance?.attendance_status === 'Absent'
                          ? 'text-red-500'
                          : ''
                      "
                    >
                      {{ attedance?.attendance_status }}
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <p
                      v-if="attedance?.behavior_at !== '-'"
                      class="flex text-sm py-1 text-white w-24 items-center justify-center rounded-full"
                      :class="backgroundBehavior(attedance?.behavior_at)"
                    >
                      {{ attedance?.behavior_at }}
                    </p>
                    <p
                      v-else
                      class="flex py-1 text-gray-400 w-24 items-center justify-center rounded-full"
                    >
                      {{ attedance?.behavior_at }}
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm text-gray-400">{{ attedance?.type }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm text-gray-400">
                      {{ attedance?.workhours }}
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm text-gray-400">
                      Break in : {{ attedance?.break_in }}
                    </p>
                    <p class="text-sm text-gray-400">
                      Break out : {{ attedance?.break_out }}
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm text-gray-400 underline">
                      View orthers Break
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <router-link to="/attedance/detail">
                      <p class="text-sm text-gray-400 underline">
                        View Potongan
                      </p>
                    </router-link>
                  </td>
                  <td class="p-3 text-right relative">
                    <Button
                      class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
                      @click.stop="showActions = i"
                    >
                      <font-awesome-icon icon="fa-ellipsis" />
                    </Button>
                    <div
                      class="text-left absolute top-0 right-20 rounded-md bg-white shadow-md md:w-max md:h-max"
                      v-if="showActions === i"
                    >
                      <ul class="text-sm cursor-pointer">
                        <li
                          class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400"
                          @click="handleDetailAttendance(attedance)"
                        >
                          Edit
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          <Loading v-if="loading.getAttendance" />
          <NoDataShowing
            v-if="!loading.getAttendance && attendance_filter.length === 0"
          />
        </section>
      </section>
      <section class="flex justify-between my-6"></section>
    </section>
    <Modal
      :title="`${modal.modeEdit ? 'Edit' : 'Add'} Attendance`"
      :showModal="modal.showModal"
      @close="
        modal.showModal = false;
        clearInputValue();
        modal.modeEdit = false;
      "
    >
      <template #header>
        <ChoiseCompany
          v-if="superAdmin"
          @selected:company="dataCompany = $event"
          :options="optionsCompany"
          :dataCompany="dataCompany"
        />
      </template>
      <section
        @click="
          modal.showSelect = false;
          modal.showTime = false;
        "
      >
        <SelectSearch
          label="Employee"
          :options="employment"
          :isOpen="modal.showSelect === 'employment'"
          @handleShowSelect="() => (modal.showSelect = 'employment')"
          class="flex-col"
          property="emp_fullname"
          input_class="w-full mt-2"
          label_class="w-full text-black"
          @selected="data.emp_id = $event"
          :selectedOption="data.emp_id"
        />
        <Input
          type="date"
          class="flex-col mt-4"
          label="Date Clock in Attendance"
          label_class="w-full"
          input_class="mt-2"
          @change="data.attendance_date = $event"
          :value="data?.attendance_date"
        />
        <section class="my-4 flex justify-between items-center">
          <InputTime
            label="Clock In"
            :isOpen="modal.showTime === 'in'"
            @showTime="modal.showTime = 'in'"
            :hourValue="modal.time_clockin.hour"
            :minuteValue="modal.time_clockin.minute"
            @selected-hour="modal.time_clockin.hour = $event"
            @selected-minute="modal.time_clockin.minute = $event"
          />
          <InputTime
            label="Clock Out"
            :isOpen="modal.showTime === 'out'"
            @showTime="modal.showTime = 'out'"
            :hourValue="modal.time_clockout.hour"
            :minuteValue="modal.time_clockout.minute"
            @selected-hour="modal.time_clockout.hour = $event"
            @selected-minute="modal.time_clockout.minute = $event"
          />
        </section>
        <Input
          type="date"
          class="flex-col mt-4"
          label="Date Clock out Attendance"
          label_class="w-full"
          input_class="mt-2"
          @change="data.attendance_date_out = $event"
          :value="data?.attendance_date_out"
        />
        <section class="my-4 flex justify-between items-center">
          <InputTime
            label="Break In"
            :isOpen="modal.showTime === 'bin'"
            @showTime="modal.showTime = 'bin'"
            :hourValue="modal.time_breakin.hour"
            :minuteValue="modal.time_breakin.minute"
            @selected-hour="modal.time_breakin.hour = $event"
            @selected-minute="modal.time_breakin.minute = $event"
          />
          <InputTime
            label="Break Out"
            :isOpen="modal.showTime === 'bout'"
            @showTime="modal.showTime = 'bout'"
            :hourValue="modal.time_breakout.hour"
            :minuteValue="modal.time_breakout.minute"
            @selected-hour="modal.time_breakout.hour = $event"
            @selected-minute="modal.time_breakout.minute = $event"
          />
        </section>
      </section>
      <template #footer>
        <section class="flex w-52 justify-between">
          <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
            Cancel
          </Button>
          <Button
            class="bg-green-500 w-24 py-2 text-white rounded-md"
            :disabled="
              data.emp_id === '' ||
              data.attendance_date === '' ||
              data.attendance_date_out === '' ||
              loading.addAttendance
            "
            @click="handleAddAttendance"
            v-if="!modal.modeEdit"
          >
            Save
          </Button>
          <Button
            v-else
            class="bg-green-500 w-24 py-2 text-white rounded-md"
            :disabled="
              data.emp_id === '' ||
              data.attendance_date === '' ||
              data.attendance_date_out === '' ||
              modal.time_clockin.hour === '' ||
              loading.addAttendance
            "
            @click="handleEditAttendance"
          >
            Edit
          </Button>
        </section>
      </template>
    </Modal>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Dropdown from "../../components/Dropdown.vue";
import Modal from "../../components/Modal.vue";
import InputTime from "@/components/InputTime.vue";
import Input from "@/components/Input.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";
import { GetAllEmployementAPI } from "@/actions/employment";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import {
  AddAttendanceAPI,
  GetAttendanceAPI,
  EditAttendanceAPI,
} from "@/actions/attendance";
import Loading from "@/components/Loading.vue";
import NoDataShowing from "@/components/NoDataShowing.vue";
import { GetDepartementAPI } from "@/actions/departement";
import { GetShiftAPI } from "@/actions/shift";
import Calender from "@/components/Calendar";

export default {
  name: "DailyAttedance",
  components: {
    LayoutAdmin,
    Button,
    Dropdown,
    Modal,
    InputTime,
    ChoiseCompany,
    SelectSearch,
    Loading,
    NoDataShowing,
    Input,
    Calender,
  },
  data() {
    return {
      activeDropdown: "",
      contactEmployee: 0,
      layoutData: "card",
      modal: {
        modeEdit: false,
        showTime: "",
        showModal: false,
        time_clockin: {
          hour: "",
          minute: "00",
        },
        time_clockout: {
          hour: "",
          minute: "00",
        },
        time_breakin: {
          hour: "",
          minute: "00",
        },
        time_breakout: {
          hour: "",
          minute: "00",
        },
      },
      data: {
        emp_id: "",
        id_attendance: "",
        attendance_date: "",
        attendance_date_out: "",
      },
      showActions: null,
      attendances: [],
      shifts: [],
      departement: [],
      optionsCompany: [],
      employment: [],
      all_attendance: [],
      attendance_filter: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getAttendance: true,
        getCompany: true,
        addAttendance: false,
      },
      filter: {
        date: "",
        departement: "",
        behavior: "",
        status: "",
        workshift: "",
        employment: "",
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    backgroundBehavior(behavior) {
      return behavior === "Regular"
        ? "bg-green-500"
        : behavior === "Early"
        ? "bg-coral"
        : "bg-red-500";
    },
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
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.departement = response.data;
    },
    handleFilter(date, departement, workshift, behavior, status, employment) {
      const newAttendanceProp = this.all_attendance.map((attendance) => ({
        ...attendance,
        emp_depid: attendance?.emp_id?.emp_depid?._id,
        employment: attendance?.emp_id?._id,
        shift: attendance?.shift_id?._id,
      }));
      const filterConditions = [
        { key: "attendance_date", value: date },
        { key: "behavior_at", value: behavior },
        { key: "shift", value: workshift },
        { key: "attendance_status", value: status },
        { key: "emp_depid", value: departement },
        { key: "employment", value: employment },
      ];
      const dataFilter = (overtime) =>
        filterConditions.every(
          ({ key, value }) => value == "" || overtime[key] == value
        );
      this.attendance_filter = newAttendanceProp.filter(dataFilter);
      console.log(this.attendance_filter);
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
      for (const key in this.modal) {
        if (Object.prototype.hasOwnProperty.call(this.modal[key], "hour")) {
          this.modal[key].hour = "";
        }
        if (Object.prototype.hasOwnProperty.call(this.modal[key], "minute")) {
          this.modal[key].minute = "00";
        }
      }
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.getCompany = false;
    },
    async getShift() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetShiftAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.shifts = response?.data;
      }
    },
    showMessageStatus(response) {
      if (response.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    async handleAddAttendance() {
      this.loading.addAttendance = true;

      const payload = {
        emp_id: this.data?.emp_id?._id,
        attendance_date: this.data.attendance_date,
        clock_in: `${this.modal.time_clockin?.hour}:${this.modal.time_clockin?.minute}`,
        clock_out: `${this.modal.time_clockout?.hour}:${this.modal.time_clockout?.minute}`,
        break_in: `${this.modal.time_breakin?.hour}:${this.modal.time_breakin?.minute}`,
        break_out: `${this.modal.time_breakout?.hour}:${this.modal.time_breakout?.minute}`,
        attendance_date_out: this.data.attendance_date_out,
      };
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await AddAttendanceAPI(queryAdminSuper, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        // this.clearInputValue();
        this.handleGetAttendance();
        this.modal.showModal = false;
      }
      this.showMessageStatus(response);
      this.loading.addAttendance = false;
    },
    changeFormatDateToInputFormat(date) {
      if (date) {
        const oldDate = date.split("/");
        const newDate = `${oldDate[2]}-${oldDate[0]}-${oldDate[1]}`;
        return newDate;
      }
      return "-";
      // return newDate;
    },
    dateToday() {
      const dateObject = new Date();
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const day = dateObject.getDate().toString().padStart(2, "0");
      const year = dateObject.getFullYear();
      return `${year}-${month}-${day}`;
    },
    async handleGetAttendance() {
      this.loading.getAttendance = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetAttendanceAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        // console.log(response.data);
        const filterAttedanceToday = response.data.filter(
          (attedance) => attedance?.attendance_date === this.dateToday()
        );
        this.attendances = filterAttedanceToday.map((attendance) => ({
          ...attendance,
          attendance_date: this.changeFormatDateToInputFormat(
            attendance?.attendance_date
          ),
          attendance_date_out: this.changeFormatDateToInputFormat(
            attendance?.attendance_date_out
          ),
        }));
        this.all_attendance = response.data.map((attendance) => ({
          ...attendance,
          attendance_date: this.changeFormatDateToInputFormat(
            attendance?.attendance_date
          ),
          attendance_date_out: this.changeFormatDateToInputFormat(
            attendance?.attendance_date_out
          ),
        }));
        this.handleFilter(
          (this.filter.date = this.filter.date
            ? this.filter.date
            : this.dateToday()),
          this.filter.departement,
          this.filter.workshift,
          this.filter.behavior,
          this.filter.status,
          this.filter.employment
        );
      }
      this.loading.getAttendance = false;
    },
    getHourMinute(time) {
      if (time !== "-") {
        const timeArray = time.split(" ")[0].split(":");
        return [timeArray[0], timeArray[1]];
      }
      return ["", "00"];
    },
    handleDetailAttendance(attendance) {
      this.modal.modeEdit = true;
      this.modal.showModal = true;
      this.data.id_attendance = attendance?._id;
      this.data.attendance_date = attendance?.attendance_date;
      this.data.attendance_date_out = attendance?.attendance_date_out;
      this.data.emp_id = attendance?.emp_id;
      this.modal.time_clockin.hour = this.getHourMinute(
        attendance?.clock_in
      )[0];
      this.modal.time_clockin.minute = this.getHourMinute(
        attendance?.clock_in
      )[1];
      this.modal.time_clockout.hour = this.getHourMinute(
        attendance?.clock_out
      )[0];
      this.modal.time_clockout.minute = this.getHourMinute(
        attendance?.clock_out
      )[1];
      this.modal.time_breakin.hour = this.getHourMinute(
        attendance?.break_in
      )[0];
      this.modal.time_breakin.minute = this.getHourMinute(
        attendance?.break_in
      )[1];
      this.modal.time_breakout.hour = this.getHourMinute(
        attendance?.break_out
      )[0];
      this.modal.time_breakout.minute = this.getHourMinute(
        attendance?.break_out
      )[1];
    },
    async handleEditAttendance() {
      this.loading.addAttendance = true;

      const payload = {
        emp_id: this.data?.emp_id?._id,
        clock_in: `${this.modal.time_clockin?.hour}:${this.modal.time_clockin?.minute}`,
        clock_out: `${this.modal.time_clockout?.hour}:${this.modal.time_clockout?.minute}`,
        break_in: `${this.modal.time_breakin?.hour}:${this.modal.time_breakin?.minute}`,
        break_out: `${this.modal.time_breakout?.hour}:${this.modal.time_breakout?.minute}`,
      };
      // const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await EditAttendanceAPI(
        this.data.id_attendance,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.clearInputValue();
        this.handleGetAttendance();
        this.modal.showModal = false;
      }
      this.showMessageStatus(response);
      this.loading.addAttendance = false;
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
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetAttendance();
        this.getShift();
        this.handleGetEmployement();
        this.handleGetDepartement();
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

<style scoped>
.fadeInDown {
  animation: fadeInDown 0.3s;
}
.fadeOutUp {
  animation: fadeOutUp 0.3s;
}
@keyframes fadeInDown {
  0% {
    transform: translateY(-10%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes fadeOutUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-10%);
    opacity: 0;
  }
}
</style>
