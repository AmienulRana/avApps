<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Leave Status</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading?.getCompany"
            @selected:company="dataCompany = $event"
            :options="optionsCompany"
            :dataCompany="dataCompany"
          />
        </section>
        <div class="flex">
          <Button class="bg-seagreen rounded text-white px-6 py-2"
            >Settings</Button
          >
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
            Assign Leave</Button
          >
        </div>
      </section>
      <section class="flex mt-6 flex-wrap w-10/12 items-center">
        <Button class="bg-white w-10 h-10 text-primary rounded-full shadow-md">
          <font-awesome-icon icon="fa-table" />
        </Button>
        <Dropdown
          title="Departemen"
          :showDropdown="activeDropdown === 'departemen'"
          @update:activeDropdown="(e) => changeDropdownActive('departemen')"
          :options="departement"
          property="dep_name"
          @selected="
            handleFilter(
              (filter.departement = $event?._id),
              filter.workshift,
              filter.status,
              filter.leave_duration,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              (filter.departement = $event),
              filter.workshift,
              filter.status,
              filter.leave_duration,
              filter.employment
            )
          "
          :selectedOption="filter.departement"
        />
        <Dropdown
          title="See Status"
          :showDropdown="activeDropdown === 'rejected'"
          @update:activeDropdown="changeDropdownActive('rejected')"
          :selectedOption="filter.status"
          :options="['Pending', 'Approved', 'Rejected']"
          @selected="
            handleFilter(
              filter.departement,
              filter.workshift,
              (filter.status = $event),
              filter.leave_duration,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.workshift,
              (filter.status = $event),
              filter.leave_duration,
              filter.employment
            )
          "
        />
        <Dropdown
          title="Leave duration"
          :showDropdown="activeDropdown === 'duration'"
          @update:activeDropdown="changeDropdownActive('duration')"
          :selectedOption="filter.leave_duration"
          :options="['Single Day', 'Multi Day', 'Half Day', 'Hours']"
          @selected="
            handleFilter(
              filter.departement,
              filter.workshift,
              filter.status,
              (filter.leave_duration = $event),
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.workshift,
              filter.status,
              (filter.leave_duration = $event),
              filter.employment
            )
          "
        />
        <Dropdown
          title="Employment"
          :showDropdown="activeDropdown === 'user'"
          @update:activeDropdown="changeDropdownActive('user')"
          :options="employment"
          property="emp_fullname"
          :selectedOption="filter.employment"
          @selected="
            handleFilter(
              filter.departement,
              filter.workshift,
              filter.status,
              filter.leave_duration,
              (filter.employment = $event?._id)
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.workshift,
              filter.status,
              filter.leave_duration,
              (filter.employment = $event)
            )
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
        <section
          class="grid md:grid-cols-4 sm:grid-cols-2 gap-4 md:px-6 bg-white"
        >
          <section
            class="flex flex-col items-center justify-center bg-gray-100 rounded-sm h-24 mb-3.5"
          >
            <p class="text-xl mb-2">{{ total_leave.employment }}</p>
            <p class="text-sm text-gray-500">Employment on leave</p>
          </section>
          <section
            class="flex flex-col items-center justify-center bg-gray-100 rounded-sm mb-3.5"
          >
            <p class="text-xl mb-2">{{ leave_filter?.length }}</p>
            <p class="text-sm text-gray-500">Total leave request</p>
          </section>
          <section
            class="flex flex-col items-center justify-center bg-gray-100 rounded-sm mb-3.5"
          >
            <p class="text-xl mb-2">{{ total_leave.single }}</p>
            <p class="text-sm text-gray-500">
              On leave <span class="text-black">(single day)</span>
            </p>
          </section>
          <section
            class="flex flex-col items-center justify-center bg-gray-100 rounded-sm mb-3.5"
          >
            <p class="text-xl mb-2">{{ total_leave.multi }}</p>
            <p class="text-sm text-gray-500">
              On leave <span class="text-black">(multi day)</span>
            </p>
          </section>
        </section>
        <TableLeaveStatus
          :leave_request="leave_filter"
          :showMessageStatus="showMessageStatus"
          :getLeaveRequest="handleGetLeaveRequest"
          :loadingGet="loading.getLeaveRequest"
          :assignLeaveDetail="assignLeaveDetail"
        />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Assign Leave"
    :showModal="modal.showModal"
    @close="
      modal.showModal = false;
      clearInputValue();
      modal.modeEdit = false;
    "
  >
    <template #header>
      <ChoiseCompany
        v-if="superAdmin && !loading?.getCompany"
        @selected:company="dataCompany = $event"
        :options="optionsCompany"
        :dataCompany="dataCompany"
      />
    </template>
    <section
      @click="
        modal.showSelect = false;
        modal.showTime = null;
      "
    >
      <SelectSearch
        label="Employee"
        :options="employment"
        :isOpen="modal.showSelect === 'emp'"
        @handleShowSelect="() => (modal.showSelect = 'emp')"
        class="flex-col"
        property="emp_fullname"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        @selected="data.emp_id = $event"
        :selectedOption="data.emp_id"
      />
      <section v-if="data.employee">
        <p class="text-sm">
          Leave Ability
          <span
            class="text-primary ml-2 cursor-pointer"
            @click="
              modal.showAbility = modal.showAbility === 'hide' ? 'show' : 'hide'
            "
          >
            {{ modal.showAbility === "hide" ? "Show" : "Hide" }}
          </span>
        </p>
        <section
          class="bg-amber-50 mt-4 px-8 py-5 grid grid-cols-2 rounded-md"
          v-if="modal.showAbility === 'show'"
        >
          <div>
            <p class="text-sm text-gray-400">
              Cuti Tahunan (Paid): <span class="text-black">0</span>
            </p>
            <p class="text-sm text-gray-400 my-2">
              Cuti Menikah (Paid): <span class="text-black">0</span>
            </p>
            <p class="text-sm text-gray-400">
              Izin Sakit (Paid): <span class="text-black">0</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-400">
              Izin Sakit (Unpaid): <span class="text-black">0</span>
            </p>
            <p class="text-sm text-gray-400 my-2">
              Izin Khusus (Paid): <span class="text-black">0</span>
            </p>
            <p class="text-sm text-gray-400">
              Izin Khusus (Unpaid): <span class="text-black">0</span>
            </p>
          </div>
        </section>
      </section>
      <SelectSearch
        :options="leave_types"
        :isOpen="modal.showSelect === 'type'"
        property="leave_desc"
        @handleShowSelect="() => (modal.showSelect = 'type')"
        class="flex-col mt-4"
        input_class="w-full mt-2"
        label_class="w-full"
        label="Leave type"
        @selected="data.empleave_type_id = $event"
        :selectedOption="data.empleave_type_id"
      />
      <section class="flex justify-between items-center mt-4">
        <p class="text-sm">
          Age <span class="text-gray-400">(Leave duration)</span>
        </p>
        <div class="flex md:px-16">
          <Radio
            label="Single Day"
            @change="data.empleave_leave_type = 'Single Day'"
            :modelValue="data.empleave_leave_type"
            :checked="data.empleave_leave_type === 'Single Day'"
            name="leave_duration"
          />
          <Radio
            label="Multi Day"
            class="mx-8"
            @change="data.empleave_leave_type = 'Multi Day'"
            :modelValue="data.empleave_leave_type"
            :checked="data.empleave_leave_type === 'Multi Day'"
            name="leave_duration"
          />
          <Radio
            label="Half Day"
            @change="data.empleave_leave_type = 'Half Day'"
            :modelValue="data.empleave_leave_type"
            name="leave_duration"
            :checked="data.empleave_leave_type === 'Half Day'"
          />
          <Radio
            label="Hours"
            class="mx-8"
            @change="data.empleave_leave_type = 'Hours'"
            :modelValue="data.empleave_leave_type"
            name="leave_duration"
            :checked="data.empleave_leave_type === 'Hours'"
          />
        </div>
      </section>
      <Input
        type="date"
        class="flex-col mt-4"
        label="Enter Date"
        label_class="w-full"
        input_class="mt-2"
        @change="data.empleave_start_date = $event"
        :value="data?.empleave_start_date"
        v-if="data.empleave_leave_type === 'Single Day'"
      />
      <section
        class="grid grid-cols-2 gap-4"
        v-if="data.empleave_leave_type === 'Multi Day'"
      >
        <Input
          type="date"
          class="flex-col mt-4"
          label="Start date"
          label_class="w-full"
          input_class="mt-2"
          @change="data.empleave_start_date = $event"
          :value="data?.empleave_start_date"
        />
        <Input
          type="date"
          class="flex-col mt-4"
          label="End Date"
          label_class="w-full"
          input_class="mt-2"
          @change="data.empleave_end_date = $event"
          :value="data?.empleave_end_date"
        />
      </section>
      <section v-if="data.empleave_leave_type === 'Half Day'" class="my-4">
        <p class="text-sm mb-2">Date</p>
        <div class="grid grid-cols-2 gap-4 items-center">
          <Input
            type="date"
            class="flex-col mb-0"
            label_class="w-full"
            @change="data.empleave_start_date = $event"
            :value="data?.empleave_start_date"
          />
          <div class="flex">
            <Radio
              label="First half"
              class="mx-8 my-0"
              @change="modal.getDurationHalfDay = 'First Half'"
              :modelValue="modal.getDurationHalfDay"
              :checked="modal.getDurationHalfDay === 'First Half'"
            />
            <Radio
              label="Last half"
              class="my-0"
              @change="modal.getDurationHalfDay = 'Last Half'"
              :modelValue="modal.getDurationHalfDay"
              :checked="modal.getDurationHalfDay === 'Last Half'"
            />
          </div>
        </div>
      </section>
      <section class="my-4" v-if="data.empleave_leave_type === 'Hours'">
        <Input
          type="date"
          class="flex-col mt-4"
          label="Enter Date"
          label_class="w-full"
          input_class="mt-2"
          @change="data.empleave_start_date = $event"
          :value="data?.empleave_start_date"
        />
        <section class="flex justify-between">
          <InputTime
            label="Start Time"
            :isOpen="modal.showTime === 'start'"
            @showTime="modal.showTime = 'start'"
            @selected-hour="modal.start_time.hour = $event"
            @selected-minute="modal.start_time.minute = $event"
            :hourValue="modal.start_time.hour"
            :minuteValue="modal.start_time.minute"
          />
          <InputTime
            label="End Time"
            :isOpen="modal.showTime === 'end'"
            @showTime="modal.showTime = 'end'"
            @selected-hour="modal.end_time.hour = $event"
            @selected-minute="modal.end_time.minute = $event"
            :hourValue="modal.end_time.hour"
            :minuteValue="modal.end_time.minute"
          />
        </section>
      </section>
      <label class="text-sm">Reason Note</label>
      <textarea
        rows="4"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.empleave_reason"
      >
      </textarea>
      <section class="mt-6">
        <p class="text-sm">Attachment</p>
        <section
          @click="openFileInput"
          class="w-full border preview-file cursor-pointer mt-2 pb-7 border-dashed border-primary"
        >
          <div
            v-if="data?.empleave_attachement?.length !== 0"
            class="md:grid-cols-6 grid grid-cols-2 gap-4 mt-7 px-8"
          >
            <div
              class="relative wrapper-image-prev"
              v-for="image in data.empleave_attachement"
              :key="image.blobImgUrl"
              @click.stop
            >
              <img :src="image?.blobImgUrl" class="w-full h-32 rounded-lg" />
              <p
                @click="removeImageFromPreview(image)"
                class="text-sm text-primary text-center"
              >
                Remove file
              </p>
            </div>
          </div>
          <div
            class="dragzone flex flex-col justify-center items-center"
            v-else
          >
            <font-awesome-icon
              icon="fa-cloud-arrow-up"
              class="w-20 h-20 text-primary"
            />
            <h2 class="text-gray-400 text-lg">Drag & Drop</h2>
            <p>or</p>
            <p class="text-primary">Browse</p>
          </div>
        </section>
        <p class="text-xs text-gray-400 mt-1">
          Allowed file types: jpeg, jpg, gif, png, pdf, zip. (Max file size is
          2MB)
        </p>
        <input
          type="file"
          multiple
          class="hidden"
          ref="file"
          @change="viewImage"
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
          @click="handleLeaveRequest"
          :disabled="loading.addLeaveRequest"
          v-if="!modal.modeEdit"
        >
          Save
        </Button>
        <Button
          v-else
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditLeaveRequest"
          :disabled="loading.addLeaveRequest"
        >
          Edit
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Dropdown from "../../components/Dropdown.vue";
import TableLeaveStatus from "../../components/TableLeaveStatus.vue";
import Modal from "../../components/Modal.vue";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import Radio from "@/components/Radio.vue";
import Input from "@/components/Input.vue";
import InputTime from "@/components/InputTime.vue";
import { GetDepartementAPI } from "@/actions/departement";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllEmployementAPI } from "@/actions/employment";
import {
  AddLeaveRequestAPI,
  GetLeaveRequestAPI,
  EditDataLeaveRequestAPI,
} from "@/actions/leave-request";
import { GetLeaveSettingAPI } from "@/actions/leave-setting";
import { useToast } from "vue-toastification";
import moment from "moment";
import { GetPeriodicAPI } from "@/actions/periodic";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";

export default {
  name: "LeaveRequest",
  components: {
    LayoutAdmin,
    Button,
    TableLeaveStatus,
    Dropdown,
    SelectSearch,
    Modal,
    Radio,
    ChoiseCompany,
    Input,
    InputTime,
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  data() {
    return {
      activeDropdown: "",
      modal: {
        showModal: false,
        showSelect: false,
        showAbility: "hide",
        showTime: "",
        getDurationHalfDay: "",
        start_time: {
          hour: "",
          minute: "00",
        },
        end_time: {
          hour: "",
          minute: "00",
        },
      },
      filter: {
        departement: "",
        workshift: "",
        status: "",
        leave_duration: "",
        employment: "",
      },
      total_leave: {
        employment: 0,
        single: 0,
        multi: 0,
      },
      leave_id: "",
      data: {
        empleave_attachement: [],
        emp_id: {
          emp_fullname: "",
          _id: "",
        },
        empleave_type_id: "",
        empleave_leave_type: "",
        empleave_start_date: "",
        empleave_end_date: "",
        empleave_leave_duration: "",
        empleave_reason: "",
      },
      leave_request: [],
      leave_filter: [],
      departement: [],
      leave_types: [],
      employment: [],
      optionsCompany: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getCompany: true,
        getLeaveRequest: true,
        addLeaveRequest: false,
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
        number: 2,
        text: "March",
      },
      yearSelected: 2023,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    showMessageStatus(response) {
      if (response.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
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
    handleFilter(departement, workshift, status, leave_duration, employment) {
      const newLeaveRequestProp = this.leave_request.map((leave) => ({
        ...leave,
        emp_depid: leave?.emp_id?.emp_depid?._id,
        status: leave?.empleave_status,
        leave_duration: leave?.empleave_leave_type,
        employment: leave?.emp_id?._id,
      }));
      const filterConditions = [
        { key: "status", value: status },
        { key: "leave_duration", value: leave_duration },
        { key: "emp_depid", value: departement },
        { key: "employment", value: employment },
      ];

      const dataFilter = (leave) =>
        filterConditions.every(
          ({ key, value }) => value === "" || leave[key] === value
        );
      this.leave_filter = newLeaveRequestProp.filter(dataFilter);
    },
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.departement = response.data;
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
    },
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
      }
    },
    openFileInput() {
      this.$refs.file.click();
    },
    formatHours(jam, menit) {
      return `${jam < 10 ? "0" + jam.toString() : jam.toString()}:${
        menit < 10 ? "0" + menit.toString() : menit.toString()
      } Hours`;
    },
    createLeaveDuration() {
      const typeLeave = this.data.empleave_leave_type;
      if (typeLeave === "Single Day") {
        return "1 Day";
      } else if (typeLeave === "Multi Day") {
        let date1 = this.data.empleave_start_date;
        let date2 = this.data.empleave_end_date;
        date1 = new Date(Date.parse(date1));
        date2 = new Date(Date.parse(date2));
        const getDuration = (date2 - date1) / (24 * 60 * 60 * 1000);
        return `${getDuration} Day`;
      } else if (typeLeave === "Half Day") {
        return this.modal.getDurationHalfDay;
      } else if (typeLeave === "Hours") {
        let start_time = new Date(
          `1970-01-01T${this.modal.start_time.hour}:${this.modal.start_time.minute}:00`
        );
        let end_time = new Date(
          `1970-01-01T${this.modal.end_time.hour}:${this.modal.end_time.minute}:00`
        );
        let diffrent = end_time - start_time;

        let hour = Math.floor(diffrent / (1000 * 60 * 60));
        let minute = Math.floor((diffrent % (1000 * 60 * 60)) / (1000 * 60));

        return this.formatHours(hour, minute);
      }
    },
    createApplyDate() {
      let today = moment().format("YYYY-MM-DD");
      let currentDate = new Date();
      let currentHour = currentDate.getHours();
      let currentMinutes = currentDate.getMinutes().toString().padStart(2, "0");
      let ampm = currentHour >= 12 ? "PM" : "AM";
      return `${today} ` + currentHour + ":" + currentMinutes + " " + ampm;
    },
    handleTotalLeave(leave) {
      const leave_single = leave.filter(
        (l) => l?.empleave_leave_type === "Single Day"
      ).length;
      const multi_single = leave.filter(
        (l) => l?.empleave_leave_type === "Multi Day"
      ).length;
      const employment = Array.from(new Set(leave.map(JSON.stringify))).map(
        JSON.parse
      );

      this.total_leave.single = leave_single;
      this.total_leave.multi = multi_single;
      this.total_leave.employment = employment.length;
    },
    async handleGetLeaveRequest() {
      this.loading.getLeaveRequest = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetLeaveRequestAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        const leaves = response?.data.filter((leave) => {
          return this.dates_periodic.some((periodic) => {
            const leaveDate = moment(
              leave?.empleave_apply_date,
              "YYYY-MM-DD hh:mm A"
            ).format("YYYY-MM-DD");
            return (
              leaveDate === periodic?.date &&
              leave?.empleave_hr?.status === "Approved"
            );
          });
        });
        this.handleTotalLeave(leaves);
        this.leave_request = leaves;
      }
      this.loading.getLeaveRequest = false;
      this.handleFilter(
        this.filter.departement,
        this.filter.workshift,
        this.filter.status,
        this.filter.leave_duration,
        this.filter.employment
      );
    },
    handleCalender(periodic_start_date, periodic_end_date) {
      let currentDate = moment(periodic_start_date);
      const end = moment(periodic_end_date);
      const dates = [];

      while (currentDate <= end) {
        dates.push({
          show_date: currentDate.format("DD MMM"),
          date: currentDate.format("YYYY-MM-DD"),
        });
        currentDate = currentDate.add(1, "days");
      }
      this.dates_periodic = dates;
      this.handleGetLeaveRequest();
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
    async handleLeaveRequest() {
      this.loading.addLeaveRequest = true;

      // const fd = new FormData();
      // this.data.empleave_attachement.map((image) =>
      //   fd.append("files", image?.originalFile)
      // );
      // fd.append('empleave_type_id', this.data.empleave_type_id?._id);
      // fd.append('emp_id', this.data.emp_id?.id);
      // fd.append('empleave_leave_duration', this.createLeaveDuration());
      // fd.append('empleave_apply_date', this.createApplyDate());
      // fd.append('empleave_start_hours', `${this.modal.start_time.hour}:${this.modal.start_time.minute}`);
      // fd.append('empleave_end_hours', `${this.modal.end_time.hour}:${this.modal.end_time.minute}`);
      const payload = {
        ...this.data,
        empleave_type_id: this.data.empleave_type_id?._id,
        emp_id: this.data.emp_id._id,
        empleave_leave_duration: this.createLeaveDuration(),
        empleave_apply_date: this.createApplyDate(),
        empleave_start_hours: `${this.modal.start_time.hour}:${this.modal.start_time.minute}`,
        empleave_end_hours: `${this.modal.end_time.hour}:${this.modal.end_time.minute}`,
      };
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await AddLeaveRequestAPI(queryAdminSuper, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.handleGetLeaveRequest();
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loading.addLeaveRequest = false;
    },
    async handleEditLeaveRequest() {
      this.loading.addLeaveRequest = true;
      const payload = {
        ...this.data,
        empleave_type_id: this.data.empleave_type_id?._id,
        emp_id: this.data.emp_id._id,
        empleave_leave_duration: this.createLeaveDuration(),
        empleave_apply_date: this.createApplyDate(),
        empleave_start_hours: `${this.modal.start_time.hour}:${this.modal.start_time.minute}`,
        empleave_end_hours: `${this.modal.end_time.hour}:${this.modal.end_time.minute}`,
      };
      const response = await EditDataLeaveRequestAPI(this.leave_id, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.modal.modeEdit = false;
        this.handleGetLeaveRequest();
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loading.addLeaveRequest = false;
    },
    getHourMinute(time) {
      if (time !== "-") {
        const timeArray = time.split(" ")[0].split(":");
        return [timeArray[0], timeArray[1]];
      }
      return ["", "00"];
    },
    assignLeaveDetail(leave) {
      this.modal.showModal = true;
      this.modal.modeEdit = true;
      this.leave_id = leave?._id;
      this.data.emp_id = leave?.emp_id;
      this.data.empleave_type_id = leave?.empleave_type_id;
      this.data.empleave_leave_type = leave?.empleave_leave_type;
      this.data.empleave_start_date = leave?.empleave_start_date;
      this.data.empleave_end_date = leave?.empleave_end_date;
      this.data.empleave_reason = leave?.empleave_reason;
      this.modal.getDurationHalfDay = leave?.empleave_leave_duration;
      if (leave?.empleave_leave_type === "Hours") {
        this.modal.start_time.hour = this.getHourMinute(
          leave?.empleave_start_hours
        )[0];
        this.modal.start_time.minute = this.getHourMinute(
          leave?.empleave_start_hours
        )[1];
        this.modal.end_time.hour = this.getHourMinute(
          leave?.empleave_end_hours
        )[0];
        this.modal.end_time.minute = this.getHourMinute(
          leave?.empleave_end_hours
        )[1];
      }
    },
    viewImage(e) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = URL.createObjectURL(files[i]);
        this.data.empleave_attachement.push({
          blobImgUrl: file,
          originalFile: files[i],
        });
      }
    },
    removeImageFromPreview(image) {
      const file = this.data.empleave_attachement.filter(
        (img) => image.blobImgUrl !== img.blobImgUrl
      );
      this.data.empleave_attachement = file;
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response.data;
      this.dataCompany = response.data[0];
      this.loading.getCompany = false;
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
    async getLeaveType() {
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;
      const response = await GetLeaveSettingAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        const newTypesProp = response.data.map((type) => ({
          ...type,
          type_desc: `${type?.leave_name} (${type?.leave_type})`,
        }));
        this.leave_types = newTypesProp;
      }
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetEmployement();
        // this.handleGetLeaveRequest();
        this.getLeaveType();
        this.handleGetDepartement();
        this.getPeriodic();
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
.wrapper-image-prev:hover img {
  filter: blur(1.5px);
}
.wrapper-image-prev div {
  opacity: 0;
  z-index: -10;
}
.wrapper-image-prev:hover div {
  opacity: 1;
  z-index: 10;
}
.preview-file,
.dragzone {
  min-height: 260px;
}
</style>
