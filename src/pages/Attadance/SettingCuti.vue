<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <h1 class="text-2xl">
          Setting Hari Libur Nasional <br />& Cuti Bersama
        </h1>
        <div class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
            Add Cuti/Libur</Button
          >
        </div>
      </section>
      <section class="w-full">
        <TableSettingCuti />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Add Cuti/Libur"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
  >
    <section
      @click="
        modal.showSelect = false;
        modal.showTime = false;
        modal.activeDropdown = null;
      "
    >
      <section class="grid grid-cols-2 gap-4">
        <Input
          type="date"
          class="flex-col mt-4"
          label="Tanggal Mulai"
          label_class="w-full"
          input_class="mt-2"
        />
        <Input
          type="date"
          class="flex-col mt-4"
          label="Tanggal Selesai"
          label_class="w-full"
          input_class="mt-2"
        />
      </section>
      <Input
        type="number"
        label="Keterangan Cuti Bersama"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
      />
      <Select
        label="Tipe"
        label_class="w-full"
        input_class="w-full mt-2"
        class="mb-2.5 flex-col"
        :options="['Cuti Bersama', 'Libur Nasional']"
      />
      <div class="relative flex items-start mt-4">
        <div class="flex items-center h-5">
          <input
            id="potong_cuti"
            aria-describedby="comments-description"
            name="comments"
            type="checkbox"
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="potong_cuti" class="font-medium text-gray-700"
            >Potong Cuti</label
          >
        </div>
      </div>
      <div class="flex mt-6 items-center">
        <p class="w-1/3 text-sm">Departement</p>
        <section class="w-1/2">
          <div class="bg-gray-100 px-5 py-2 rounded-md flex items-center">
            <p
              class="text-gray-400 ml-2 bg-white text-sm w-24 px-4 py-1 flex justify-between items-center rounded-full"
            >
              IT
              <font-awesome-icon icon="fa-xmark" />
            </p>
            <Dropdown
              @update:activeDropdown="modal.activeDropdown = 'bonus'"
              title="Add"
              backgroundTitle="bg-transparent"
              :showDropdown="modal.activeDropdown === 'bonus'"
            />
          </div>
        </section>
      </div>
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
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import TableSettingCuti from "../../components/TableSettingCuti.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import Dropdown from "@/components/Dropdown.vue";
import employee from "@/employee.json";
import Select from "@/components/Select/index.vue";

export default {
  name: "SettingCuti",
  components: {
    LayoutAdmin,
    Button,
    TableSettingCuti,
    Modal,
    Input,
    Select,
    Dropdown,
  },
  data() {
    return {
      activeDropdown: "",
      layoutData: "card",
      employee: employee,
      modal: {
        showTime: "",
        showModal: false,
        activeDropdown: "",
      },
      data: {
        employee: "",
        ageDuration: "Single Day",
        reasonNote: "",
        leaveType: "",
      },
    };
  },
  methods: {
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
      }
    },
    handleLeaveRequest() {},
  },
  computed: {
    getAllEmployee() {
      return this.employee.map((employe) => employe.name);
    },
  },
};
</script>

<style scoped></style>
