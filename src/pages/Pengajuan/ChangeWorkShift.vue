<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <h1 class="text-2xl">Change Workshift</h1>
        <div class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
            Assign Change Workshift</Button
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
          title="Users"
          :showDropdown="activeDropdown === 'user'"
          @update:activeDropdown="changeDropdownActive('user')"
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <TableChangeWorkShift />
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
        :selectedOption="data.employee"
        @selected="data.employee = $event"
      />
      <section class="flex justify-between items-center mt-4">
        <p class="text-sm">
          Age <span class="text-gray-400">(Leave duration)</span>
        </p>
        <div class="flex md:px-16">
          <Radio
            label="Single Day"
            @change="data.ageDuration = 'Single Day'"
            :modelValue="data.ageDuration"
          />
          <Radio
            label="Multi Day"
            class="mx-8"
            @change="data.ageDuration = 'Multi Day'"
            :modelValue="data.ageDuration"
          />
          <Radio
            label="Half Day"
            @change="data.ageDuration = 'Half Day'"
            :modelValue="data.ageDuration"
          />
          <Radio label="Hours" class="mx-8" />
        </div>
      </section>
      <Input
        type="date"
        class="flex-col mt-4"
        label="Enter Date"
        label_class="w-full"
        input_class="mt-2"
        v-if="data.ageDuration === 'Single Day'"
      />
      <section
        class="grid grid-cols-2 gap-4"
        v-if="data.ageDuration === 'Multi Day'"
      >
        <Input
          type="date"
          class="flex-col mt-4"
          label="Start date"
          label_class="w-full"
          input_class="mt-2"
        />
        <Input
          type="date"
          class="flex-col mt-4"
          label="End Date"
          label_class="w-full"
          input_class="mt-2"
        />
      </section>
      <section v-if="data.ageDuration === 'Half Day'" class="my-4">
        <p class="text-sm mb-2">Date</p>
        <div class="grid grid-cols-2 gap-4 items-center">
          <Input type="date" class="flex-col mb-0" label_class="w-full" />
          <div class="flex">
            <Radio label="First half" class="mx-8 my-0" />
            <Radio label="Last half" class="my-0" />
          </div>
        </div>
      </section>
      <label class="text-sm">Reason Note</label>
      <textarea
        rows="4"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.reasonNote"
      >
      </textarea>
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
import Dropdown from "../../components/Dropdown.vue";
import TableChangeWorkShift from "../../components/TableChangeWorkShift.vue";
import Modal from "../../components/Modal.vue";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import Radio from "@/components/Radio.vue";
import Input from "@/components/Input.vue";
import employee from "@/employee.json";

export default {
  name: "ChangeWorkShift",
  components: {
    LayoutAdmin,
    Button,
    TableChangeWorkShift,
    Dropdown,
    SelectSearch,
    Modal,
    Radio,
    Input,
  },
  data() {
    return {
      activeDropdown: "",
      layoutData: "card",
      employee: employee,
      modal: {
        showModal: false,
        showSelect: false,
        showAbility: "hide",
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
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
      }
    },
    openFileInput() {
      this.$refs.file.click();
    },
    handleLeaveRequest() {},
    viewImage(e) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = URL.createObjectURL(files[i]);
        this.data.attachement.push({
          blobImgUrl: file,
          originalFile: files[i],
        });
      }
    },
    removeImageFromPreview(image) {
      const file = this.data.attachement.filter(
        (img) => image.blobImgUrl !== img.blobImgUrl
      );
      this.data.attachement = file;
    },
  },
  computed: {
    getAllEmployee() {
      return this.employee.map((employe) => employe.name);
    },
  },
};
</script>

<style scoped></style>
