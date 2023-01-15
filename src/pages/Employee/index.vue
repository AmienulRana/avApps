<template>
  <LayoutAdmin
    @click="
      activeDropdown = false;
      pagination.changePerPage = false;
    "
  >
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center flex-wrap">
        <section class="flex items-center">
          <h1 class="md:text-2xl text-lg">All Employees</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading.employement"
            @selected:company="dataCompany = $event"
            :options="options"
            :dataCompany="dataCompany"
          />
        </section>
        <Button
          class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2 md:mt-0"
          @click="showModal = true"
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
          :options="['Permanent', 'Probation', 'Terminated']"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="(e) => changeDropdownActive('employee')"
          @selected="
            handleFilter(
              (filter.employment_status = $event),
              filter.designation,
              filter.departement,
              filter.workshifts,
              filter.role
            )
          "
          @clearSelected="
            handleFilter(
              (filter.employment_status = $event),
              filter.designation,
              filter.departement,
              filter.workshifts,
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
              (filter.designation = $event),
              filter.departement,
              filter.workshifts,
              filter.role
            )
          "
          @clearSelected="
            handleFilter(
              filter.employment_status,
              (filter.designation = $event),
              filter.departement,
              filter.workshifts,
              filter.role
            )
          "
          :selectedOption="filter.designation"
          @update:activeDropdown="changeDropdownActive('designation')"
        />
        <Dropdown
          title="Departement"
          :showDropdown="activeDropdown === 'departement'"
          :options="[
            'Main Departement',
            'Admin & HRM',
            'Account',
            'Development',
            'Software',
            'UI & UX',
          ]"
          @selected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              (filter.departement = $event),
              filter.workshifts,
              filter.role
            )
          "
          @clearSelected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              (filter.departement = $event),
              filter.workshifts,
              filter.role
            )
          "
          :selectedOption="filter.departement"
          @update:activeDropdown="changeDropdownActive('departement')"
        />
        <Dropdown
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
        />
        <Dropdown
          title="Role"
          @selected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              filter.departement,
              filter.workshifts,
              (filter.role = $event)
            )
          "
          @clearSelected="
            handleFilter(
              filter.employment_status,
              filter.designation,
              filter.departement,
              filter.workshifts,
              (filter.role = $event)
            )
          "
          :options="['App Admin', 'Manager', 'Employee', 'Department Manager']"
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
              v-for="(employe, index) in paginatedItems"
              :key="index"
            >
              <div
                class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
              >
                <img
                  :src="`${urlImages}/${employe?.emp_profile}`"
                  :alt="`Profile
                  ${employe?.emp_fullname}`"
                  class="rounded-full"
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
                {{ employe?._id?.split("").splice(11, 7).join("") }}
              </p>
              <Button
                class="px-4 text-sm py-1 my-2 text-white rounded-full"
                :class="
                  employe?.emp_status === 'Permanent'
                    ? 'bg-blue-500'
                    : employe?.emp_status === 'Probation'
                    ? 'bg-orange-500'
                    : 'bg-red-600'
                "
              >
                {{ employe?.emp_status }}
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
                @click="showContactEmployee(index + 1)"
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
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    <router-link
                      to="/detail-employee"
                      class="cursor-pointer text-sm"
                    >
                      Remove from employee list
                    </router-link>
                  </li>
                </ul>
              </div>
            </section>
          </div>
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
          v-if="employee.length > pagination.perPage"
          v-bind:items="employee"
          v-bind:per-page="pagination.perPage"
          v-bind:current-page="pagination.currentPage"
          @change-page="changePage"
        />
      </section>
    </section>
    <AddModalEmployee
      :getEmployement="handleGetEmployement"
      :showModal="showModal"
      :closeModal="() => (showModal = false)"
    />
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
import { GetAllEmployementAPI } from "@/actions/employment";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Paggination.vue";
import { URL_IMAGES } from "@/config";

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
  },
  data() {
    return {
      activeDropdown: "",
      urlImages: URL_IMAGES,
      designation: [],
      departement: [],
      currentPage: 1,
      contactEmployee: 0,
      layoutData: "card",
      employee: [],
      pagination: {
        perPage: 5,
        currentPage: this.$store.state.currentPage,
        changePerPage: null,
      },
      filter: {
        employment_status: "",
        designation: "",
        departement: "",
        workshifts: "",
        role: "",
      },
      showModal: false,
      employeeFilter: false,
      options: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        employement: true,
      },
    };
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
    handleFilter(status, designation, departement, workshifts, role) {
      const filterConditions = [
        { key: "status", value: status },
        { key: "designation", value: designation },
        { key: "departement", value: departement },
        { key: "workshifts", value: workshifts },
        { key: "role", value: role },
      ];
      const dataFilter = (employee) =>
        filterConditions.every(
          ({ key, value }) => value === "" || employee[key] === value
        );
      this.employeeFilter = this.employee.filter(dataFilter);
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response.data;
      this.dataCompany = response.data[0];
      this.loading.employement = false;
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
      const querySuperAdmin = `?company=${this.dataCompany._id}`;
      const response = await GetAllEmployementAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.employee = response.data;
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.loading.employement = true;
        this.handleGetDepartement();
        this.handleGetDesignation();
        // if()
        this.handleGetEmployement();
        this.loading.employement = false;
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
    // this.handleGetEmployement();
  },
  computed: {
    paginatedItems() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      return this.employee.slice(start, start + this.pagination.perPage);
    },
  },
};
</script>

<style scoped></style>
