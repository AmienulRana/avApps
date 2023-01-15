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
        />
        <Dropdown
          title="Workshift"
          :showDropdown="activeDropdown === 'workshift'"
          @update:activeDropdown="changeDropdownActive('workshift')"
        />
        <Dropdown
          title="See rejected"
          :showDropdown="activeDropdown === 'rejected'"
          @update:activeDropdown="changeDropdownActive('rejected')"
        />
        <Dropdown
          title="Overtime duration"
          :showDropdown="activeDropdown === 'duration'"
          @update:activeDropdown="changeDropdownActive('duration')"
        />
        <Dropdown
          title="Users"
          :showDropdown="activeDropdown === 'user'"
          @update:activeDropdown="changeDropdownActive('user')"
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <TableRequestOvertime
          :overtime_request="overtime_requests"
          :showMessageStatus="showMessageStatus"
          :loading="loading.getOvertimeRequest"
          :getOvertime="getOvertimeRequest"
        />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Overtime Request"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
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
        property="emp_name"
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
        />
        <InputTime
          label="End Time"
          :isOpen="modal.showTime === 'end'"
          @showTime="modal.showTime = 'end'"
          @selected-hour="modal.end_time.hour = $event"
          @selected-minute="modal.end_time.minute = $event"
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
        >
          Save
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
} from "@/actions/overtime-request";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { useToast } from "vue-toastification";

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
      data: {
        emp_id: "",
        overtime_reason: "",
        overtime_date: "",
        overtime_start_hours: "",
        overtime_end_hours: "",
      },
      employment: [],
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
    },
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
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
        console.log(response);
      }
      this.loading.getOvertimeRequest = false;
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
