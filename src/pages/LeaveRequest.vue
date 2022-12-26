<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <h1 class="text-2xl">Leave Request</h1>
        <div class="flex">
          <Button class="bg-seagreen rounded text-white px-6 py-2"
            >Settings</Button
          >
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
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
    </section>
  </LayoutAdmin>
  <Modal
    title="Assign Leave"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
  >
    <section @click="modal.showSelect = false">
      <SelectSearch
        label="Employee"
        :options="getAllEmployee"
        :isOpen="modal.showSelect"
        @handleShowSelect="() => (modal.showSelect = !modal.showSelect)"
        class="flex-col"
        input_class="w-full mt-2"
        label_class="w-full text-black"
      />
      <Select
        class="flex-col mt-4"
        input_class="w-full mt-2"
        label_class="w-full"
        label="Leave type"
        :options="[
          'Cuti Tahunan (Paid)',
          'Cuti Menikah (Paid)',
          'Izin Sakit (Paid)',
          'Izin Sakit (Unpaid)',
          'Izin Khusus (Paid)',
          'Izin Khusus (Unpaid)',
        ]"
      />
      <section class="flex justify-between items-center mt-4">
        <p class="text-sm">
          Age <span class="text-gray-400">(Leave duration)</span>
        </p>
        <div class="flex md:px-16">
          <Radio label="Single Day" />
          <Radio label="Multi Day" class="mx-8" />
          <Radio label="Half Day" />
          <Radio label="Hours" class="mx-8" />
        </div>
      </section>
      <Input
        type="date"
        class="flex-col mt-4"
        label="Enter Date"
        label_class="w-full"
        input_class="mt-2"
      />
      <label class="text-sm">Reason Note</label>
      <textarea rows="4" class="w-full mt-2 border outline-primary py-4">
      </textarea>
      <section class="mt-6">
        <p class="text-sm">Attachment</p>
        <section
          class="w-full border preview-file mt-2 border-dashed border-primary"
        >
          <input type="file" multiple class="hidden" id="file" />
        </section>
      </section>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button class="bg-green-500 w-24 py-2 text-white rounded-md">
          Save
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import LayoutAdmin from "../components/Layout/Admin.vue";
import Button from "../components/Button.vue";
import Dropdown from "../components/Dropdown.vue";
import TableLeaveRequest from "../components/TableLeaveRequest.vue";
import Modal from "../components/Modal.vue";
import Select from "@/components/Select";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import Radio from "@/components/Radio.vue";
import Input from "@/components/Input.vue";
import employee from "@/employee.json";

export default {
  name: "EmployeeIndex",
  components: {
    LayoutAdmin,
    Button,
    TableLeaveRequest,
    Dropdown,
    SelectSearch,
    Modal,
    Select,
    Radio,
    Input,
  },
  data() {
    return {
      activeDropdown: "",
      currentPage: 1,
      contactEmployee: 0,
      layoutData: "card",
      employee: employee,
      modal: {
        showModal: true,
        showSelect: false,
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
  computed: {
    getAllEmployee() {
      return this.employee.map((employe) => employe.name);
    },
  },
};
</script>

<style scoped>
.preview-file {
  min-height: 300px;
}
</style>
