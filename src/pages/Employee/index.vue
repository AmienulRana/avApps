<template>
  <LayoutAdmin
    @click="
      activeDropdown = false;
      pagination.changePerPage = false;
      contactEmployee = null;
    "
  >
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center flex-wrap">
        <section class="flex items-center">
          <h1 class="md:text-2xl text-lg">All Employees</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading.employement"
            @selected:company="handleChangeCompany($event)"
            :options="options"
            :dataCompany="dataCompany"
          />
        </section>
        <Button
          class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2 md:mt-0"
          @click="showModal = 'Add'"
          >Add Employee</Button
        >
      </section>
      <section class="flex mt-6 flex-wrap w-10/12">
        <Button
          class="bg-white w-10 h-10 text-primary rounded-full shadow-md"
          @click="handleShowLayoutData"
        >
          <font-awesome-icon icon="fa-table" />
        </Button>
        <Dropdown
          title="Employment Status"
          :options="empStatus"
          property="empstatus_name"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="(e) => changeDropdownActive('employee')"
          @selected="
            handleFilter(
              (filter.employment_status = $event?._id),
              filter.designation,
              filter.departement,
              filter.role
            )
          "
          @clearSelected="
            handleFilter(
              (filter.employment_status = $event),
              filter.designation,
              filter.departement,
              filter.role
            )
          "
          :selectedOption="filter.employment_status"
        />
        <Dropdown
          title="Designation"
          :options="designation"
          property="des_name"
          :showDropdown="activeDropdown === 'designation'"
          @selected="
            handleFilter(
              filter.employment_status,
              (filter.designation = $event?._id),
              filter.departement,
              filter.role
            )
          "
          @clearSelected="
            handleFilter(
              filter.employment_status,
              (filter.designation = $event),
              filter.departement,
              filter.role
            )
          "
          :selectedOption="filter.designation"
          @update:activeDropdown="changeDropdownActive('designation')"
        />
        <Dropdown
          title="Departement"
          :showDropdown="activeDropdown === 'departement'"
          :options="departement"
          property="dep_name"
          @selected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              (filter.departement = $event?._id),
              filter.role
            )
          "
          @clearSelected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              (filter.departement = $event),
              filter.role
            )
          "
          :selectedOption="filter.departement"
          @update:activeDropdown="changeDropdownActive('departement')"
        />
        <!-- <Dropdown
          title="Work Shift"
          :options="[
            'Regular work shift',
            'Demo working shift regular',
            'Demo working shift schedule',
          ]"
          @selected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              filter.departement,
              (filter.workshifts = $event),
              filter.role
            )
          "
          @clearSelected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              filter.departement,
              (filter.workshifts = $event),
              filter.role
            )
          "
          :selectedOption="filter.workshifts"
          :showDropdown="activeDropdown === 'Work Shift'"
          @update:activeDropdown="changeDropdownActive('Work Shift')"
        /> -->
        <Dropdown
          title="Employee"
          @selected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              filter.departement,
              (filter.role = $event?._id)
            )
          "
          @clearSelected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              filter.departement,
              (filter.role = $event)
            )
          "
          :options="employee"
          property="emp_fullname"
          :selectedOption="filter.role"
          :showDropdown="activeDropdown === 'Role'"
          @update:activeDropdown="changeDropdownActive('Role')"
        />
      </section>
      <section class="relative">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          <!-- Showing
          {{ employeeFilter?.length === 0 ? 0 : 1 }}
          to
          {{
            employeeFilter?.length > 0
              ? employeeFilter?.length
              : employee?.length > 10
              ? 10
              : employee?.length
          }}
          items of {{ employee?.length }} -->
        </p>
        <Loading v-if="loading.employement" class="mt-24" />
        <template v-else>
          <div
            class="lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid md:gap-4 gap-2"
            v-if="layoutData === 'card'"
          >
            <section
              class="flex relative justify-center rounded mb-4 items-center flex-col bg-white p-4"
              v-for="(employe, index) in employeeFilter"
              :key="index"
            >
              <div
                class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
              >
                <img
                  :src="`${urlImages}/${employe?.emp_profile}`"
                  :alt="`Profile
                  ${employe?.emp_fullname}`"
                  class="profile"
                  v-if="employe?.emp_profile"
                />
                <h2 class="md:text-base text-sm text-white" v-else>
                  {{
                    employe?.emp_fullname.substr(0, 1) +
                    employe?.emp_fullname.substr(
                      employe?.emp_fullname.indexOf(" ") + 1,
                      1
                    )
                  }}
                </h2>
              </div>
              <h1 class="text-sm md:text-base mt-2 md:mb-0 mb-2">
                {{ employe?.emp_fullname }}
              </h1>
              <p class="text-sm md:text-base text-gray-400" v-if="superAdmin">
                {{ employe?.company_id?.company_name }}
              </p>
              <p class="text-xs text-gray-400 my-2 md:my-2">
                {{ employe?.emp_desid?.des_name }}
              </p>
              <p class="text-sm md:text-base text-gray-400">
                {{ employe?._id?.split("").splice(4, 7).join("") }}
              </p>
              <Button
                class="px-4 text-sm py-1 my-2 text-white rounded-full"
                :style="`background:${employe?.emp_status?.empstatus_color}`"
              >
                {{ employe?.emp_status?.empstatus_name }}
              </Button>
              <p class="text-sm md:text-base text-gray-400">
                {{ employe?.emp_depid?.dep_name }}
              </p>
              <p class="text-sm md:text-base text-gray-400 my-2 md:my-0">
                {{ employe.emp_depid?.dep_workshift }}
              </p>
              <p class="text-sm md:text-base text-blue-600 mt-3">
                <router-link :to="`/employee/${employe._id}`"
                  >View Details</router-link
                >
              </p>
              <Button
                class="absolute top-4 right-4 px-3 bg-blue-100 text-primary rounded-full"
                @click.stop="showContactEmployee(index + 1)"
              >
                <font-awesome-icon icon="fa-ellipsis" />
              </Button>
              <div
                class="absolute top-10 right-6 rounded-md bg-white shadow-md md:w-10/12 md:h-max"
                v-if="contactEmployee === index + 1"
              >
                <ul>
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    <router-link
                      to="/detail-employee"
                      class="cursor-pointer text-sm"
                    >
                      View details
                    </router-link>
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    <router-link
                      to="/detail-employee"
                      class="cursor-pointer text-sm"
                    >
                      Edit
                    </router-link>
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    <router-link
                      to="/detail-employee"
                      class="cursor-pointer text-sm"
                    >
                      Assign leave
                    </router-link>
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    <router-link
                      to="/detail-employee"
                      class="cursor-pointer text-sm"
                    >
                      Edit salary
                    </router-link>
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    <router-link
                      to="/detail-employee"
                      class="cursor-pointer text-sm"
                    >
                      Add joining date
                    </router-link>
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    <router-link
                      to="/detail-employee"
                      class="cursor-pointer text-sm"
                    >
                      Terminate
                    </router-link>
                  </li>
                  <li
                    class="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer text-sm"
                    @click="
                      showModal = 'Delete';
                      data.employment_name = employe?.emp_fullname;
                      data.employment_id = employe?._id;
                    "
                  >
                    Remove Employment
                  </li>
                </ul>
              </div>
            </section>
          </div>
          <NoDataShowing
            v-if="
              employee.length === 0 ||
              (employee.length > 0 && employeeFilter?.length === 0)
            "
          />
        </template>

        <TableEmployee
          v-if="layoutData === 'table'"
          :employee="!employeeFilter ? employee : employeeFilter"
        />
      </section>
      <section
        class="flex justify-between items-center my-14 flex-wrap"
        v-if="!loading.employement"
      >
        <section class="flex items-center">
          <p class="text-gray-400 mr-2 text-sm">items showing per page</p>
          <section class="relative mb-4">
            <button
              class="bg-white w-10 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-primary"
              @click.stop="pagination.changePerPage = !pagination.changePerPage"
            >
              {{ pagination.perPage }}
            </button>
            <section
              class="absolute shadow-md flex-col items-between bottom-full left-0 bg-white w-32 h-38 py-2"
              v-if="pagination.changePerPage"
            >
              <p
                class="my-2 text-sm hover:bg-gray-50 hover:text-primary text-gray-400 px-2.5 py-1"
                @click="pagination.perPage = 5"
              >
                5
              </p>
              <p
                class="my-2 text-sm hover:bg-gray-50 hover:text-primary text-gray-400 px-2.5 py-1"
                @click="pagination.perPage = 10"
              >
                10
              </p>
              <p
                class="my-2 text-sm hover:bg-gray-50 hover:text-primary text-gray-400 px-2.5 py-1"
                @click="pagination.perPage = 20"
              >
                20
              </p>
              <p
                class="my-2 text-sm hover:bg-gray-50 hover:text-primary text-gray-400 px-2.5 py-1"
                @click="pagination.perPage = 30"
              >
                30
              </p>
            </section>
          </section>
        </section>
        <Pagination
          v-bind:items="employee"
          v-bind:per-page="pagination.perPage"
          v-bind:current-page="pagination.currentPage"
          @change-page="changePage"
        />
      </section>
    </section>
    <AddModalEmployee
      :getEmployement="handleGetEmployement"
      :showModal="showModal === 'Add'"
      :closeModal="() => (showModal = false)"
    />
    <Modal
      modalClass="md:w-1/2 md:h-96"
      :showModal="showModal === 'Delete'"
      @close="showModal = false"
    >
      <section class="text-center mb-6">
        <img
          src="@/assets/icons/warning.svg"
          alt="warning-icon"
          class="block m-auto"
        />
        <h1 class="text-xl">
          Are You Sure to deleted Employment
          <span class="text-red-500 font-bold"
            >"{{ data?.employment_name }}"</span
          >???
        </h1>
        <p class="text-gray-400 mt-3">
          If you delete this company all data related to this Employment will
          also be deleted
        </p>
        <section class="flex w-full justify-center mt-4">
          <Button
            class="bg-gray-400 w-24 py-2 mr-4 text-white rounded-md"
            @click="showModal = ''"
          >
            Cancel
          </Button>
          <Button
            class="bg-red-500 w-24 py-2 text-white rounded-md"
            @click="handleDeleteEmployment"
            :disabled="loading.delete"
          >
            Yes, Sure
          </Button>
        </section>
      </section>
    </Modal>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Dropdown from "../../components/Dropdown.vue";
import TableEmployee from "../../components/TableEmployee.vue";
import AddModalEmployee from "../../components/ModalAddEmployee.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import { GetDesignationAPI } from "@/actions/designation";
import { GetDepartementAPI } from "@/actions/departement";
import {
  GetAllEmployementAPI,
  DeleteEmployementAPI,
} from "@/actions/employment";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Paggination.vue";
import { URL_IMAGES } from "@/config";
import NoDataShowing from "@/components/NoDataShowing.vue";
import Modal from "@/components/Modal.vue";
import { GetEmpStatusAPI } from "@/actions/emp-status";
import { useToast } from "vue-toastification";

export default {
  name: "EmployeeIndex",
  components: {
    LayoutAdmin,
    Button,
    TableEmployee,
    Dropdown,
    AddModalEmployee,
    ChoiseCompany,
    Loading,
    Pagination,
    NoDataShowing,
    Modal,
  },
  data() {
    return {
      activeDropdown: "",
      urlImages: URL_IMAGES,
      data: {
        employment_name: "",
        employment_id: "",
      },
      designation: [],
      departement: [],
      currentPage: 1,
      contactEmployee: 0,
      layoutData: "card",
      employee: [],
      pagination: {
        perPage: 30,
        currentPage: this.$store.state.currentPage,
        changePerPage: null,
      },
      filter: {
        employment_status: this.$store.state.filter.employment_status,
        designation: this.$store.state.filter.designation,
        departement: this.$store.state.filter.departement,
        workshifts: this.$store.state.filter.workshift,
        role: this.$store.state.filter.role,
      },
      showModal: false,
      employeeFilter: false,
      options: [],
      empStatus: [],
      superAdmin: false,
      dataCompany: this.$store.state.company,
      loading: {
        employement: true,
        delete: false,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    showMessageStatus(response) {
      if (response?.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response?.data?.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    handleShowLayoutData() {
      this.layoutData = this.layoutData === "card" ? "table" : "card";
    },
    handleChangeCompany(company) {
      this.$store.commit("setValueCompany", company);
      this.dataCompany = company;
    },
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    changePage(page) {
      this.$store.commit("changeCurrentPage", page);
      this.pagination.currentPage = this.$store.state.currentPage;
    },
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
      }
    },
    handleFilter(status, designation, departement, role) {
      const filterConditions = [
        { key: "emp_status", value: status },
        { key: "emp_desid", value: designation },
        { key: "emp_depid", value: departement },
        { key: "_id", value: role },
      ];
      this.$store.commit("setValueFilter", this.filter);

      if (role) {
        const dataFilter = (employee) =>
          filterConditions.every(
            ({ key, value }) => value === "" || employee[key] === value
          );
        this.employeeFilter = this.employee.filter(dataFilter);
      } else {
        const dataFilter = (employee) =>
          filterConditions.every(
            ({ key, value }) => value === "" || employee[key]?._id === value
          );

        this.employeeFilter = this.employee.filter(dataFilter);
      }
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      if (this.$store.state.company?._id === "") {
        this.dataCompany = response?.data[0];
      } else {
        this.dataCompany = this.$store.state.company;
      }
    },
    async getEmpStatus() {
      const queryAdminSuper = `?company_id=${this?.dataCompany?._id || null}`;
      const response = await GetEmpStatusAPI(queryAdminSuper);

      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.empStatus = response?.data || [];
    },
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.departement = response.data;
    },
    async handleGetDesignation() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDesignationAPI(querySuperAdmin);
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.designation = response.data;
    },
    async handleGetEmployement() {
      this.loading.employement = true;
      const querySuperAdmin = `?company=${this?.dataCompany?._id}`;
      const response = await GetAllEmployementAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.employee = response?.data;
      this.loading.employement = false;
      this.handleFilter(
        this.filter.employment_status,
        this.filter.designation,
        this.filter.departement,
        this.filter.role
      );
      // this.paginatedItems(response?.data);
    },
    async handleDeleteEmployment() {
      this.loading.delete = true;
      const response = await DeleteEmployementAPI(this.data.employment_id);
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);

        return this.$router.push("/login");
      }
      if (response?.status === 200) {
        this.handleGetEmployement();
        this.showModal = false;
        this.contactEmployee = null;
      }
      this.showMessageStatus(response);
      this.loading.delete = false;
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.loading.employement = true;
        this.handleGetDepartement();
        this.handleGetDesignation();
        this.getEmpStatus();
        this.handleGetEmployement();
        this.loading.employement = false;
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getAllCompany();
    if (this.dataCompany?._id) {
      this.handleGetDepartement();
      this.handleGetDesignation();
      this.getEmpStatus();
      this.handleGetEmployement();
    }
    // this.handleGetEmployement();
  },
  computed: {
    paginatedItems() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      return this.employeeFilter.slice(start, start + this.pagination.perPage);
    },
  },
};
</script>

<style scoped>
.profile {
  min-width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>
