<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Change Off Day</h1>

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
            Assign Off Day</Button
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
          title="Users"
          :showDropdown="activeDropdown === 'user'"
          @update:activeDropdown="changeDropdownActive('user')"
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <TableChangeOffDay
          :offday_request="offday_requests"
          :loading="loading.get"
          :getOffday="getOffDayRequest"
          :showMessageStatus="showMessageStatus"
        />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Assign Change Off Day"
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
        :isOpen="modal.showSelect === 'Employement'"
        @handleShowSelect="() => (modal.showSelect = 'Employement')"
        class="flex-col"
        property="emp_name"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        @selected="deleteFromReplaceEmployment($event)"
        :selectedOption="data.emp_id"
      />
      <Input
        type="date"
        class="flex-col mt-4"
        label="Enter Date Off Day"
        label_class="w-full"
        input_class="mt-2"
        @change="data.offday_date = $event"
        :value="data.offday_date"
      />
      <Input
        type="date"
        class="flex-col mt-4"
        label="Change Off Day"
        label_class="w-full"
        input_class="mt-2"
        @change="data.offday_change = $event"
        :value="data.offday_change"
      />
      <SelectSearch
        label="Replacement Employment"
        :options="replace_employment"
        :isOpen="modal.showSelect === 'Replacement'"
        @handleShowSelect="() => (modal.showSelect = 'Replacement')"
        class="flex-col"
        property="emp_name"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        @selected="data.emp_replacement = $event"
        :selectedOption="data.emp_replacement"
      />

      <label class="text-sm">Reason Note</label>
      <textarea
        rows="4"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.offday_reason"
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
          @click="handleAddOffDay"
          :disabled="loading.add"
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
import TableChangeOffDay from "../../components/TableChangeOffDay.vue";
import Modal from "../../components/Modal.vue";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import Input from "@/components/Input.vue";
import employee from "@/employee.json";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import { GetAllEmployementAPI } from "@/actions/employment";
import {
  GetOffdayEmploymentAPI,
  AddOffDayRequest,
  GetOffDayRequestAPI,
} from "@/actions/offday";
import { useToast } from "vue-toastification";

export default {
  name: "ChangeOffDay",
  components: {
    LayoutAdmin,
    Button,
    TableChangeOffDay,
    Dropdown,
    SelectSearch,
    Modal,
    ChoiseCompany,
    Input,
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
      replace_employment: [],
      employment: [],
      optionsCompany: [],
      superAdmin: false,
      offday_requests: [],
      dataCompany: {},
      data: {
        emp_id: "",
        offday_reason: "",
        emp_replacement: "",
        offday_date: "",
        offday_change: "",
      },
      loading: {
        getCompany: true,
        get: true,
        add: false,
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
      this.replace_emplyoment = getIdNameEmp;
    },
    deleteFromReplaceEmployment(employment) {
      this.data.emp_id = employment;
      const employmentFilter = this.employment.filter(
        (emp) => employment?._id !== emp._id
      );
      this.replace_employment = employmentFilter;
      this.getOffdayEmployment(employment?._id);
    },
    async getOffdayEmployment(id) {
      const response = await GetOffdayEmploymentAPI(id);
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response.data;
      this.dataCompany = response.data[0];
      this.loading.getCompany = false;
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
    async handleAddOffDay() {
      this.loading.add = true;
      const payload = {
        ...this.data,
        emp_id: this?.data?.emp_id?._id,
        emp_replacement: this?.data?.emp_replacement?._id,
      };
      const querySuperAdmin = `?company=${this.dataCompany._id}`;
      const response = await AddOffDayRequest(
        this.superAdmin ? querySuperAdmin : "",
        payload
      );
      if (response?.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.clearInputValue();
        this.getOffDayRequest();
      }
      this.showMessageStatus(response);
      this.loading.add = false;
    },
    async getOffDayRequest() {
      this.loading.get = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetOffDayRequestAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.offday_requests = response.data;
      }
      this.loading.get = false;
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.getOffDayRequest();
        this.handleGetEmployement();
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
