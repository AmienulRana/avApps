<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <h1 class="text-2xl">Leave Request</h1>
        <div class="flex">
          <Button class="bg-seagreen rounded text-white px-6 py-2"
            >Settings</Button
          >
          <Button class="bg-primary rounded text-white mx-2 px-6 py-2">
            Assign Leave</Button
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
          title="Leave duration"
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
        <TableLeaveRequest />
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
import LayoutAdmin from "../components/Layout/Admin.vue";
import Button from "../components/Button.vue";
import Dropdown from "../components/Dropdown.vue";
import Pagination from "../components/Paggination.vue";
import TableLeaveRequest from "../components/TableLeaveRequest.vue";
import Modal from "../components/Modal.vue";

export default {
  name: "EmployeeIndex",
  components: {
    LayoutAdmin,
    Button,
    TableLeaveRequest,
    Dropdown,
    Pagination,
    Modal,
  },
  data() {
    return {
      activeDropdown: "",
      currentPage: 1,
      contactEmployee: 0,
      layoutData: "card",
      showModal: true,
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
