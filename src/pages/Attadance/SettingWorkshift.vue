<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <h1 class="text-2xl">Setting Workshift</h1>
        <div class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
            Add Workshift</Button
          >
        </div>
      </section>
      <section class="w-full">
        <TableSettingWorkshift />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Add Workshift"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
  >
    <section
      @click="
        modal.showSelect = false;
        modal.showTime = false;
      "
    >
      <Input
        label="Shift Name"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
      />
      <section class="my-4 flex justify-between items-center">
        <InputTime
          label="Clock In"
          :isOpen="modal.showTime === 'in'"
          @showTime="modal.showTime = 'in'"
        />
        <InputTime
          label="Clock Out"
          :isOpen="modal.showTime === 'out'"
          @showTime="modal.showTime = 'out'"
        />
        <Input
          type="number"
          label="Break Duration"
          class="flex-col mt-4 w-28"
          label_class="w-full"
          input_class="mt-2"
        />
      </section>
      <section class="my-4 flex justify-between items-center">
        <Input
          type="number"
          label="Shift Late Tolarance"
          class="flex-col md:w-5/12 mt-4"
          label_class="w-full"
          input_class="mt-2"
        />
        <Input
          type="number"
          label="Shift Very Late Tolarance"
          class="flex-col md:w-5/12 mt-4"
          label_class="w-full"
          input_class="mt-2"
        />
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
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import TableSettingWorkshift from "../../components/TableSettingWorkshift.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import employee from "@/employee.json";
import InputTime from "@/components/InputTime.vue";

export default {
  name: "SettingWorkShift",
  components: {
    LayoutAdmin,
    Button,
    TableSettingWorkshift,
    Modal,
    Input,
    InputTime,
  },
  data() {
    return {
      activeDropdown: "",
      layoutData: "card",
      employee: employee,
      modal: {
        showTime: "",
        showModal: false,
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
