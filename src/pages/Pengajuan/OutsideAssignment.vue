<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Outside Assignment</h1>
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
        <!-- <Dropdown
          title="Workshift"
          :showDropdown="activeDropdown === 'workshift'"
          @update:activeDropdown="changeDropdownActive('workshift')"
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
              filter.outside_duration,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              (filter.status = $event),
              filter.outside_duration,
              filter.employment
            )
          "
        />
        <Dropdown
          title="Outside duration"
          :showDropdown="activeDropdown === 'duration'"
          @update:activeDropdown="changeDropdownActive('duration')"
          :selectedOption="filter.outside_duration"
          property="text"
          :options="[
            { text: '1 Day', number: 1 },
            { text: '2 Day', number: 2 },
            { text: '3 Day', number: 3 },
            { text: '4 Day', number: 4 },
            { text: '5 Day', number: 5 },
            { text: '> 5 Day', number: '>' },
          ]"
          @selected="
            handleFilter(
              filter.departement,
              filter.status,
              (filter.outside_duration = $event?.number),
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.status,
              (filter.outside_duration = $event),
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
              filter.outside_duration,
              (filter.employment = $event?._id)
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.status,
              filter.outside_duration,
              (filter.employment = $event)
            )
          "
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <TableOutsideAssignment
          :outside_request="outside_filter"
          :loading="loading.getOvertimeRequest"
          :showMessageStatus="showMessageStatus"
          :getOvertime="getOvertimeRequest"
          :assignOutsideDetail="assignOutsideDetail"
        />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Outside Assignment"
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
        :isOpen="modal.showSelect"
        @handleShowSelect="() => (modal.showSelect = !modal.showSelect)"
        class="flex-col"
        property="emp_fullname"
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
          v-if="!modal.modeEdit"
        >
          Save
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          v-else
          @click="handleEditOutside"
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
  EditDataOvertimeRequestAPI,
} from "@/actions/outside-request";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";
import { GetDepartementAPI } from "@/actions/departement";

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
        modeEdit: false,
        showModal: false,
        showSelect: false,
        showAbility: "hide",
      },
      outisde_id: "",
      data: {
        emp_id: "",
        outside_reason: "",
        outside_date: "",
        outside_start_date: "",
        outside_end_date: "",
      },
      employment: [],
      departement: [],
      filter: {
        departement: "",
        status: "",
        outside_duration: "",
        employment: "",
      },
      outside_filter: [],
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
    handleFilter(departement, status, outside_duration, employment) {
      // console.log(departement, status, outside_duration);
      const newLeaveRequestProp = this.outside_request.map((outside) => ({
        ...outside,
        emp_depid: outside?.emp_id?.emp_depid?._id,
        status_hr: outside?.outside_hr?.status,
        status_at1: outside?.outside_fsuperior?.status,
        status_at2: outside?.outside_ssuperior?.status,
        duration:
          +outside?.outside_duration.split(" ")[0] < 5
            ? +outside?.outside_duration.split(" ")[0]
            : ">",
        employment: outside?.emp_id?._id,
      }));
      // console.log(newLeaveRequestProp);
      const filterConditions = [
        { key: "status_hr", value: status },
        { key: "duration", value: outside_duration },
        { key: "emp_depid", value: departement },
        { key: "employment", value: employment },
      ];
      // console.log(filterConditions);

      const dataFilter = (outside) =>
        filterConditions.every(
          ({ key, value }) => value == "" || outside[key] == value
        );
      this.outside_filter = newLeaveRequestProp.filter(dataFilter);
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
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      this.departement = response.data;
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
    assignOutsideDetail(outside) {
      this.modal.modeEdit = true;
      this.modal.showModal = true;
      this.outisde_id = outside?._id;
      this.data.emp_id = outside?.emp_id;
      this.data.outside_reason = outside?.outside_reason;
      this.data.outside_start_date = outside?.outside_start_date;
      this.data.outside_end_date = outside?.outside_end_date;
    },
    async handleEditOutside() {
      this.loading.addOvertimeRequest = true;
      const payload = {
        ...this.data,
        emp_id: this.data?.emp_id?._id,
      };
      const response = await EditDataOvertimeRequestAPI(
        this.outisde_id,
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
        this.outside_request = response.data;
      }
      this.loading.getOvertimeRequest = false;
      this.handleFilter(
        this.filter.departement,
        this.filter.status,
        this.filter.outside_duration,
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
