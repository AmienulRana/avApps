<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center">
        <h1 class="md:text-2xl text-lg">All Employees</h1>
        <Button class="bg-primary text-white px-6 py-2 text-sm rounded-md"
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
          ref="dropdown"
          title="Employment Status"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="(e) => changeDropdownActive('employee')"
        />
        <Dropdown
          ref="dropdown"
          title="Designation"
          :showDropdown="activeDropdown === 'designation'"
          @update:activeDropdown="changeDropdownActive('designation')"
        />
      </section>
      <section class="">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <div
          class="lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid md:gap-4 gap-2"
          v-if="layoutData === 'card'"
        >
          <section
            class="flex relative justify-center rounded items-center flex-col bg-white p-4"
            v-for="(data, index) in new Array(10)"
            :key="index"
          >
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="md:text-base text-sm text-white">AR</h2>
            </div>
            <h1 class="text-sm md:text-base mt-2 md:mb-0 mb-2">
              Nama Karyawan
            </h1>
            <p class="text-sm md:text-base text-gray-500">Perusahaan</p>
            <p class="text-xs text-gray-400 my-2 md:my-0">Jabatan</p>
            <p class="text-sm md:text-base text-gray-500">Id Employee</p>
            <Button
              class="bg-blue-600 px-4 text-sm py-1 my-2 text-white rounded-full"
            >
              Permanent
            </Button>
            <p class="text-sm md:text-base text-gray-400">Departemen</p>
            <p class="text-sm md:text-base text-gray-400 my-2 md:my-0">
              Shift jam kerja
            </p>
            <p class="text-sm md:text-base text-blue-600 mt-3">
              <router-link to="/employee/123">View Details</router-link>
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

        <TableEmployee v-if="layoutData === 'table'" />
      </section>
      <section class="flex justify-between my-6">
        <Pagination
          :total-pages="10"
          :current-page="currentPage"
          @page-change="changePage"
        ></Pagination>
      </section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Dropdown from "../../components/Dropdown.vue";
import Pagination from "../../components/Paggination.vue";
import TableEmployee from "../../components/TableEmployee.vue";

export default {
  name: "EmployeeIndex",
  components: {
    LayoutAdmin,
    Button,
    TableEmployee,
    Dropdown,
    Pagination,
  },
  data() {
    return {
      activeDropdown: "",
      currentPage: 1,
      contactEmployee: 0,
      layoutData: "card",
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
      this.currentPage = page;
      // kode lain yang akan dieksekusi ketika halaman berubah, seperti mengambil data dari server
    },
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
      }
    },
  },
};
</script>

<style scoped></style>
