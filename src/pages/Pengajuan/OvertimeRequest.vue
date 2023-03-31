<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Overtime Request</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading?.getCompany"
            @selected:company="dataCompany = $event"
            :options="optionsCompany"
            :dataCompany="dataCompany"
          />
        </section>
        <div class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
            Assign Overtime</Button
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
          title="Departemen"
          :showDropdown="activeDropdown === 'departemen'"
          @update:activeDropdown="(e) => changeDropdownActive('departemen')"
          :options="departement"
          property="dep_name"
          @selected="
            handleFilter(
              (filter.departement = $event?._id),
              filter.status,
              filter.overtime_duration,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              (filter.departement = $event),
              filter.status,
              filter.overtime_duration,
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

              (filter.status = $event),
              filter.overtime_duration,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,

              (filter.status = $event),
              filter.overtime_duration,
              filter.employment
            )
          "
        />
        <Dropdown
          title="Overtime duration"
          :showDropdown="activeDropdown === 'duration'"
          @update:activeDropdown="changeDropdownActive('duration')"
          :selectedOption="filter.overtime_duration"
          property="text"
          :options="[
            { text: '1 Hours', number: 1 },
            { text: '2 Hours', number: 2 },
            { text: '3 Hours', number: 3 },
            { text: '4 Hours', number: 4 },
            { text: '5 Hours', number: 5 },
          ]"
          @selected="
            handleFilter(
              filter.departement,

              filter.status,
              (filter.overtime_duration = $event?.number),
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,

              filter.status,
              (filter.overtime_duration = $event),
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

              filter.status,
              filter.overtime_duration,
              (filter.employment = $event?._id)
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,

              filter.status,
              filter.overtime_duration,
              (filter.employment = $event)
            )
          "
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <TableRequestOvertime
          :overtime_request="overtime_filter"
          :showMessageStatus="showMessageStatus"
          :loading="loading.getOvertimeRequest"
          :getOvertime="getOvertimeRequest"
          :assignOvertimeDetail="assignOvertimeDetail"
        />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Overtime Request"
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
        modal.showTime = false;
      "
    >
      <SelectSearch
        label="Employee"
        :options="employment"
        :isOpen="modal.showSelect"
        @handleShowSelect="() => (modal.showSelect = !modal.showSelect)"
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
        label="Enter Date"
        label_class="w-full"
        input_class="mt-2"
        @change="data.overtime_date = $event"
        :value="data?.overtime_date"
      />
      <section class="flex justify-between my-4">
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
      <label class="text-sm">Reason Note</label>
      <textarea
        rows="4"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.overtime_reason"
      >
      </textarea>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleAddOvertimeRequest"
          :disabled="loading?.addOvertimeRequest"
          v-if="!modal.modeEdit"
        >
          Save
        </Button>
        <Button
          v-else
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditOvertimeRequest"
          :disabled="loading?.addOvertimeRequest"
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
import TableRequestOvertime from "../../components/TableRequestOvertime.vue";
import Modal from "../../components/Modal.vue";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import Input from "@/components/Input.vue";
import InputTime from "@/components/InputTime.vue";
import { GetAllEmployementAPI } from "@/actions/employment";
import { GetAllCompanyAPI } from "@/actions/company";
import {
  AddOvertimeRequestAPI,
  GetOvertimeRequestAPI,
  EditOvertimeRequestDataAPI,
} from "@/actions/overtime-request";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { useToast } from "vue-toastification";
import { GetDepartementAPI } from "@/actions/departement";

export default {
  name: "OvertimeRequest",
  components: {
    LayoutAdmin,
    Button,
    ChoiseCompany,
    TableRequestOvertime,
    Dropdown,
    SelectSearch,
    Modal,
    Input,
    InputTime,
  },
  data() {
    return {
      activeDropdown: "",
      layoutData: "card",

      modal: {
        showModal: false,
        showSelect: false,
        modeEdit: false,
        showTime: "",
        start_time: {
          hour: "",
          minute: "00",
        },
        end_time: {
          hour: "",
          minute: "00",
        },
      },
      id_overtime: "",
      data: {
        emp_id: "",
        overtime_reason: "",
        overtime_date: "",
        overtime_start_hours: "",
        overtime_end_hours: "",
      },
      filter: {
        departement: "",
        status: "",
        overtime_duration: "",
        employment: "",
      },
      employment: [],
      departement: [],

      optionsCompany: [],
      superAdmin: false,
      overtime_requests: [],
      dataCompany: {},
      loading: {
        getCompany: true,
        getOvertimeRequest: true,
        addOvertimeRequest: false,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
      this.modal.start_time.hour = "";
      this.modal.start_time.minute = "00";
      this.modal.end_time.hour = "";
      this.modal.end_time.minute = "00";
    },
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
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
    changeHoursToNumber(hours) {
      return +hours.split(":")[0];
    },
    handleFilter(departement, status, overtime_duration, employment) {
      const newLeaveRequestProp = this.overtime_requests.map((overtime) => ({
        ...overtime,
        emp_depid: overtime?.emp_id?.emp_depid?._id,
        status_hr: overtime?.overtime_hr?.status,
        status_at1: overtime?.overtime_fsuperior?.status,
        status_at2: overtime?.overtime_ssuperior?.status,
        duration: this.changeHoursToNumber(overtime?.overtime_duration),
        employment: overtime?.emp_id?._id,
      }));
      const filterConditions = [
        { key: "status_hr", value: status },
        { key: "duration", value: overtime_duration },
        { key: "emp_depid", value: departement },
        { key: "employment", value: employment },
      ];

      const dataFilter = (overtime) =>
        filterConditions.every(
          ({ key, value }) => value == "" || overtime[key] == value
        );
      this.overtime_filter = newLeaveRequestProp.filter(dataFilter);
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
    getHourMinute(time) {
      if (time !== "-") {
        const timeArray = time.split(" ")[0].split(":");
        return [timeArray[0], timeArray[1]];
      }
      return ["", "00"];
    },
    assignOvertimeDetail(overtime) {
      this.modal.showModal = true;
      this.modal.modeEdit = true;
      this.data.emp_id = overtime?.emp_id;
      this.id_overtime = overtime?._id;
      this.data.overtime_reason = overtime?.overtime_reason;
      this.data.overtime_date = overtime?.overtime_date;
      this.modal.start_time.hour = this.getHourMinute(
        overtime?.overtime_start_hours
      )[0];
      this.modal.start_time.minute = this.getHourMinute(
        overtime?.overtime_start_hours
      )[1];
      this.modal.end_time.hour = this.getHourMinute(
        overtime?.overtime_end_hours
      )[0];
      this.modal.end_time.minute = this.getHourMinute(
        overtime?.overtime_end_hours
      )[1];
    },
    async handleAddOvertimeRequest() {
      this.loading.addOvertimeRequest = true;
      const payload = {
        ...this.data,
        emp_id: this.data?.emp_id?._id,
        overtime_start_hours: `${this.modal.start_time.hour}:${this.modal.start_time.minute}`,
        overtime_end_hours: `${this.modal.end_time.hour}:${this.modal.end_time.minute}`,
      };
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await AddOvertimeRequestAPI(queryAdminSuper, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.clearInputValue();
        this.getOvertimeRequest();
      }
      this.showMessageStatus(response);
      this.loading.addOvertimeRequest = false;
    },
    async handleEditOvertimeRequest() {
      this.loading.addOvertimeRequest = true;
      const payload = {
        ...this.data,
        emp_id: this.data?.emp_id?._id,
        overtime_start_hours: `${this.modal.start_time.hour}:${this.modal.start_time.minute}`,
        overtime_end_hours: `${this.modal.end_time.hour}:${this.modal.end_time.minute}`,
      };
      const response = await EditOvertimeRequestDataAPI(
        this.id_overtime,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.modal.modeEdit = false;
        this.clearInputValue();
        this.getOvertimeRequest();
      }
      this.showMessageStatus(response);
      this.loading.addOvertimeRequest = false;
    },
    async getOvertimeRequest() {
      this.loading.getOvertimeRequest = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetOvertimeRequestAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.overtime_requests = response.data;
      }
      this.loading.getOvertimeRequest = false;
      this.handleFilter(
        this.filter.departement,
        this.filter.status,
        this.filter.overtime_duration,
        this.filter.employment
      );
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response.data;
      this.dataCompany = response.data[0];
      this.loading.getCompany = false;
    },
  },
  computed: {
    getAllEmployee() {
      return this.employee.map((employe) => employe.name);
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetEmployement();
        this.getOvertimeRequest();
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

<style scoped></style>
