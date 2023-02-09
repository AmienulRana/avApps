<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Outsite Assignment</h1>
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
            Assign Outsite</Button
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
        <TableOutsideAssignment
          :outside_request="outside_request"
          :loading="loading.getOvertimeRequest"
          :showMessageStatus="showMessageStatus"
          :getOvertime="getOvertimeRequest"
        />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Add Outside Assignment"
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
    <section @click="modal.showSelect = false">
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
      <section class="grid grid-cols-2 gap-4">
        <Input
          type="date"
          class="flex-col mt-4"
          label="Start date"
          label_class="w-full"
          input_class="mt-2"
          @change="data.outside_start_date = $event"
          :value="data?.outside_start_date"
        />
        <Input
          type="date"
          class="flex-col mt-4"
          label="End Date"
          label_class="w-full"
          input_class="mt-2"
          @change="data.outside_end_date = $event"
          :value="data?.outside_end_date"
        />
      </section>
      <label class="text-sm">Reason Note</label>
      <textarea
        rows="4"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.outside_reason"
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
import TableOutsideAssignment from "../../components/TableOutsideAssignment.vue";
import Modal from "../../components/Modal.vue";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import Input from "@/components/Input.vue";
import employee from "@/employee.json";
// import Loading from "@/components/Loading.vue";
import { GetAllEmployementAPI } from "@/actions/employment";
import { GetAllCompanyAPI } from "@/actions/company";
import {
  AddOvertimeRequestAPI,
  GetOvertimeRequestAPI,
} from "@/actions/outside-request";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";

export default {
  name: "OutsideAssignment",
  components: {
    LayoutAdmin,
    Button,
    TableOutsideAssignment,
    Dropdown,
    SelectSearch,
    Modal,
    Input,
    ChoiseCompany,
    // Loading,
  },
  data() {
    return {
      activeDropdown: "",
      layoutData: "card",
      employee: employee,
      modal: {
        showModal: false,
        showSelect: false,
        showAbility: "hide",
      },
      data: {
        emp_id: "",
        outside_reason: "",
        outside_date: "",
        outside_start_date: "",
        outside_end_date: "",
      },
      employment: [],
      optionsCompany: [],
      superAdmin: false,
      outside_request: [],
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
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
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
        emp_name: employment?.emp_fullname,
      }));
      this.employment = getIdNameEmp;
    },
    async handleAddOvertimeRequest() {
      this.loading.addOvertimeRequest = true;
      const payload = {
        ...this.data,
        emp_id: this.data?.emp_id?._id,
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
        this.outside_request = response.data;
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
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";

    this.getAllCompany();
  },
};
</script>

<style scoped></style>
