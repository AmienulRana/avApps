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
          :options="departement"
          property="dep_name"
          @selected="
            handleFilter(
              (filter.departement = $event?._id),
              filter.status,
              filter.replacement,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              (filter.departement = $event),
              filter.status,
              filter.replacement,

              filter.employment
            )
          "
          :selectedOption="filter.departement"
        />
        <!-- <Dropdown
          title="Workshift"
          :showDropdown="activeDropdown === 'workshift'"
          @update:activeDropdown="changeDropdownActive('workshift')"
          :options="shifts"
          property="shift_name"
          @selected="
            handleFilter(
              filter.departement,
              filter.status,
              (filter.workshift = $event?._id),
              filter.replacement,

              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.status,
              (filter.workshift = $event),
              filter.replacement,
              filter.employment
            )
          "
          :selectedOption="filter.workshift"
        /> -->
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
              filter.replacement,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              (filter.status = $event),
              filter.replacement,
              filter.employment
            )
          "
        />
        <Dropdown
          title="Replacement"
          :showDropdown="activeDropdown === 'replacement'"
          @update:activeDropdown="changeDropdownActive('replacement')"
          :options="employment"
          property="emp_fullname"
          :selectedOption="filter.replacement"
          @selected="
            handleFilter(
              filter.departement,
              filter.status,
              (filter.replacement = $event?._id),
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.status,
              (filter.replacement = $event),
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
              filter.replacement,
              (filter.employment = $event?._id)
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.status,
              filter.replacement,
              (filter.employment = $event)
            )
          "
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
          :assignChangeOffdayDetail="assignChangeOffdayDetail"
        />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Assign Change Offday"
    :showModal="modal.showModal"
    @close="
      modal.showModal = false;
      modal.modeEdit = false;
      clearInputValue();
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
    <section @click="modal.showSelect = false">
      <SelectSearch
        label="Employee"
        :options="employment"
        :isOpen="modal.showSelect === 'Employement'"
        @handleShowSelect="() => (modal.showSelect = 'Employement')"
        class="flex-col"
        property="emp_fullname"
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
        property="emp_fullname"
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
          v-if="!modal.modeEdit"
        >
          Save
        </Button>
        <Button
          v-else
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditOffDay"
          :disabled="loading.add"
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
  EditDataOffDayRequest,
} from "@/actions/offday";
import { useToast } from "vue-toastification";
import { GetDepartementAPI } from "@/actions/departement";

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
        modeEdit: false,
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
      offday_id: "",
      filter: {
        departement: "",
        status: "",
        replacement: "",
        employment: "",
      },
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
    handleFilter(departement, status, replacement, employment) {
      const newLeaveRequestProp = this.change_shifts.map((shift) => ({
        ...shift,
        emp_depid: shift?.emp_id?.emp_depid?._id,
        replacement: shift?.empchange_replacement?._id,
        shift_id: shift?._id,
        status_hr: shift?.empchange_hr?.status,
        status_at1: shift?.empchange_fsuperior?.status,
        status_at2: shift?.empchange_ssuperior?.status,
        employment: shift?.emp_id?._id,
      }));
      const filterConditions = [
        { key: "status_hr", value: status },
        { key: "emp_depid", value: departement },
        { key: "employment", value: employment },
        { key: "replacement", value: replacement },
      ];

      const dataFilter = (overtime) =>
        filterConditions.every(
          ({ key, value }) => value == "" || overtime[key] == value
        );
      this.workshift_filter = newLeaveRequestProp.filter(dataFilter);
    },
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      this.departement = response.data;
    },
    assignChangeOffdayDetail(offday) {
      this.modal.modeEdit = true;
      this.modal.showModal = true;
      this.deleteFromReplaceEmployment(offday?.emp_id);
      this.offday_id = offday?._id;
      this.data.emp_id = offday?.emp_id;
      this.data.emp_replacement = offday?.emp_replacement;
      this.data.offday_reason = offday?.offday_reason;
      this.data.offday_date = offday?.offday_date;
      this.data.offday_change = offday?.offday_change;
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
    async handleAddOffDay() {
      this.loading.add = true;
      const payload = {
        ...this.data,
        emp_id: this?.data?.emp_id?._id,
        emp_replacement: this?.data?.emp_replacement?._id,
      };
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
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
    async handleEditOffDay() {
      this.loading.add = true;
      const payload = {
        ...this.data,
        emp_id: this?.data?.emp_id?._id,
        emp_replacement: this?.data?.emp_replacement?._id,
      };
      const response = await EditDataOffDayRequest(this.offday_id, payload);
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
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.getOffDayRequest();
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

<style scoped></style>
