<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Daily Log</h1>
          <ChoiseCompany
            v-if="superAdmin"
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
        <TableAttedance
          :attendances="attendances"
          :loading="loading.addAttendance"
        />
      </section>
      <section class="flex justify-between my-6"></section>
    </section>
    <Modal
      title="Add Workshift"
      :showModal="modal.showModal"
      @close="modal.showModal = false"
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
          property="emp_name"
          input_class="w-full mt-2"
          label_class="w-full text-black"
          @selected="data.emp_id = $event"
          :selectedOption="data.emp_id"
        />
        <!-- <SelectSearch
          label="Location"
          placeholder="Select location attedance for employment"
          :options="['Company Location']"
          :isOpen="modal.showSelect === 'location'"
          @handleShowSelect="() => (modal.showSelect = 'location')"
          class="flex-col"
          input_class="w-full mt-2"
          label_class="w-full text-black"
          @selected="data.company_location = $event"
          :selectedOption="data.company_location"
        /> -->
        <section class="my-4 flex justify-between items-center">
          <InputTime
            label="Clock In"
            :isOpen="modal.showTime === 'in'"
            @showTime="modal.showTime = 'in'"
            @selected-hour="modal.time_clockin.hour = $event"
            @selected-minute="modal.time_clockin.minute = $event"
          />
          <InputTime
            label="Clock Out"
            :isOpen="modal.showTime === 'out'"
            @showTime="modal.showTime = 'out'"
            @selected-hour="modal.time_clockout.hour = $event"
            @selected-minute="modal.time_clockout.minute = $event"
          />
        </section>
        <section class="my-4 flex justify-between items-center">
          <InputTime
            label="Break In"
            :isOpen="modal.showTime === 'bin'"
            @showTime="modal.showTime = 'bin'"
            @selected-hour="modal.time_breakin.hour = $event"
            @selected-minute="modal.time_breakin.minute = $event"
          />
          <InputTime
            label="Break Out"
            :isOpen="modal.showTime === 'bout'"
            @showTime="modal.showTime = 'bout'"
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
            :disabled="!data.emp_id || loading.addAttendance"
            @click="handleAddAttendance"
          >
            Save
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
import TableAttedance from "../../components/TableAttedance.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import InputTime from "@/components/InputTime.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";
import { GetAllEmployementAPI } from "@/actions/employment";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import { AddAttendanceAPI, GetAttendanceAPI } from "@/actions/attendance";

export default {
  name: "DailyAttedance",
  components: {
    LayoutAdmin,
    Button,
    TableAttedance,
    Dropdown,
    Modal,
    Input,
    InputTime,
    ChoiseCompany,
    SelectSearch,
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
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
      }
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
    },
    async handleGetEmployement() {
      const querySuperAdmin = `?company=${this.dataCompany._id}`;
      const response = await GetAllEmployementAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      const getIdNameEmp = response?.data?.map((employment) => ({
        _id: employment?._id,
        emp_name: employment?.emp_fullname,
      }));
      this.employment = getIdNameEmp;
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.getCompany = false;
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
        clock_in: `${this.modal.time_clockin?.hour}:${
          this.modal.time_clockin?.minute || "00"
        }`,
        clock_out: `${this.modal.time_clockout?.hour}:${
          this.modal.time_clockout?.minute || "00"
        }`,
        break_in: `${this.modal.time_breakin?.hour}:${
          this.modal.time_breakin?.minute || "00"
        }`,
        break_out: `${this.modal.time_breakout?.hour}:${
          this.modal.time_breakout?.minute || "00"
        }`,
      };
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await AddAttendanceAPI(queryAdminSuper, payload);
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
    async handleGetAttendance() {
      this.loading.addAttendance = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetAttendanceAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        console.log(response.data);
        this.attendances = response.data;
      }
      this.loading.addAttendance = false;
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetEmployement();
        this.handleGetAttendance();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
  },
};
</script>

<style scoped></style>
