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
        :selectedOption="data.employee"
        @selected="data.employee = $event"
      />
      <section v-if="data.employee">
        <p class="text-sm">
          Leave Ability
          <span
            class="text-primary ml-2 cursor-pointer"
            @click="
              modal.showAbility = modal.showAbility === 'hide' ? 'show' : 'hide'
            "
          >
            {{ modal.showAbility === "hide" ? "Show" : "Hide" }}
          </span>
        </p>
        <section
          class="bg-amber-50 mt-4 px-8 py-5 grid grid-cols-2 rounded-md"
          v-if="modal.showAbility === 'show'"
        >
          <div>
            <p class="text-sm text-gray-400">
              Cuti Tahunan (Paid): <span class="text-black">0</span>
            </p>
            <p class="text-sm text-gray-400 my-2">
              Cuti Menikah (Paid): <span class="text-black">0</span>
            </p>
            <p class="text-sm text-gray-400">
              Izin Sakit (Paid): <span class="text-black">0</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-400">
              Izin Sakit (Unpaid): <span class="text-black">0</span>
            </p>
            <p class="text-sm text-gray-400 my-2">
              Izin Khusus (Paid): <span class="text-black">0</span>
            </p>
            <p class="text-sm text-gray-400">
              Izin Khusus (Unpaid): <span class="text-black">0</span>
            </p>
          </div>
        </section>
      </section>
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
        :value="data.leaveType"
        @change="data.leaveType = $event"
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
      <section class="mt-6">
        <p class="text-sm">Attachment</p>
        <section
          @click="openFileInput"
          class="w-full border preview-file cursor-pointer mt-2 pb-7 border-dashed border-primary"
        >
          <div
            v-if="data.attachement.length !== 0"
            class="md:grid-cols-6 grid grid-cols-2 gap-4 mt-7 px-8"
          >
            <div
              class="relative wrapper-image-prev"
              v-for="image in data.attachement"
              :key="image.blobImgUrl"
              @click.stop
            >
              <!-- <div
                class="absolute duration-300 top-0 text-white flex justify-center py-4 rounded-lg left-0 w-full h-full"
              >
                <p>{{ convertToMB(image?.originalFile?.size) }}mb</p>
              </div> -->
              <img :src="image?.blobImgUrl" class="w-full h-32 rounded-lg" />
              <p
                @click="removeImageFromPreview(image)"
                class="text-sm text-primary text-center"
              >
                Remove file
              </p>
            </div>
          </div>
          <div
            class="dragzone flex flex-col justify-center items-center"
            v-else
          >
            <font-awesome-icon
              icon="fa-cloud-arrow-up"
              class="w-20 h-20 text-primary"
            />
            <h2 class="text-gray-400 text-lg">Drag & Drop</h2>
            <p>or</p>
            <p class="text-primary">Browse</p>
          </div>
        </section>
        <p class="text-xs text-gray-400 mt-1">
          Allowed file types: jpeg, jpg, gif, png, pdf, zip. (Max file size is
          2MB)
        </p>
        <input
          type="file"
          multiple
          class="hidden"
          ref="file"
          @change="viewImage"
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
        attachement: [],
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

<style scoped>
.wrapper-image-prev:hover img {
  filter: blur(1.5px);
}
.wrapper-image-prev div {
  opacity: 0;
  z-index: -10;
}
.wrapper-image-prev:hover div {
  opacity: 1;
  z-index: 10;
}
.preview-file,
.dragzone {
  min-height: 260px;
}
</style>
