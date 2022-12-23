<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <h1 class="text-2xl">Daily Log</h1>
        <div class="flex">
          <Button class="bg-seagreen rounded text-white px-6 py-2"
            >Settings</Button
          >
          <Button class="bg-primary rounded text-white mx-2 px-6 py-2"
            >Add Absensi</Button
          >
          <Button class="bg-primary text-white px-6 py-2 rounded">
            <span class="mr-2">Settings</span>
            <font-awesome-icon
              icon="fa-chevron-up w-6 h-6 ml-3"
              class="rotate-180"
            />
          </Button>
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
        <TableAttedance />
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
import TableAttedance from "../../components/TableAttedance.vue";

export default {
  name: "EmployeeIndex",
  components: {
    LayoutAdmin,
    Button,
    TableAttedance,
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

<style scoped>
</style>