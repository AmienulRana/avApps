<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Leave Request</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading?.getCompany"
            @selected:company="dataCompany = $event"
            :options="optionsCompany"
            :dataCompany="dataCompany"
          />
        </section>
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
        <Button class="bg-white w-10 h-10 text-primary rounded-full shadow-md">
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
        <TableLeaveRequest :leave_request="leave_request" />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Assign Leave"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
  >
    <template #header>
      <ChoiseCompany
        v-if="superAdmin && !loading?.getCompany"
        @selected:company="dataCompany = $event"
        :options="optionsCompany"
        :dataCompany="dataCompany"
      />
    </template>
    <section @click="modal.showSelect = false">
      <SelectSearch
        label="Employee"
        :options="employment"
        :isOpen="modal.showSelect"
        @handleShowSelect="() => (modal.showSelect = !modal.showSelect)"
        class="flex-col"
        property="emp_name"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        @selected="data.emp_id = $event"
        :selectedOption="data.emp_id"
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
        :value="data.empleave_type_id"
        @change="data.empleave_type_id = $event"
      />
      <section class="flex justify-between items-center mt-4">
        <p class="text-sm">
          Age <span class="text-gray-400">(Leave duration)</span>
        </p>
        <div class="flex md:px-16">
          <Radio
            label="Single Day"
            @change="data.empleave_leave_type = 'Single Day'"
            :modelValue="data.empleave_leave_type"
            name="leave_duration"
          />
          <Radio
            label="Multi Day"
            class="mx-8"
            @change="data.empleave_leave_type = 'Multi Day'"
            :modelValue="data.empleave_leave_type"
            name="leave_duration"
          />
          <Radio
            label="Half Day"
            @change="data.empleave_leave_type = 'Half Day'"
            :modelValue="data.empleave_leave_type"
            name="leave_duration"
          />
          <Radio
            label="Hours"
            class="mx-8"
            @change="data.empleave_leave_type = 'Hours'"
            :modelValue="data.empleave_leave_type"
            name="leave_duration"
          />
        </div>
      </section>
      <Input
        type="date"
        class="flex-col mt-4"
        label="Enter Date"
        label_class="w-full"
        input_class="mt-2"
        @change="data.empleave_start_date = $event"
        :value="data?.empleave_start_date"
        v-if="data.empleave_leave_type === 'Single Day'"
      />
      <section
        class="grid grid-cols-2 gap-4"
        v-if="data.empleave_leave_type === 'Multi Day'"
      >
        <Input
          type="date"
          class="flex-col mt-4"
          label="Start date"
          label_class="w-full"
          input_class="mt-2"
          @change="data.empleave_start_date = $event"
          :value="data?.empleave_start_date"
        />
        <Input
          type="date"
          class="flex-col mt-4"
          label="End Date"
          label_class="w-full"
          input_class="mt-2"
          @change="data.empleave_end_date = $event"
          :value="data?.empleave_end_date"
        />
      </section>
      <section v-if="data.empleave_leave_type === 'Half Day'" class="my-4">
        <p class="text-sm mb-2">Date</p>
        <div class="grid grid-cols-2 gap-4 items-center">
          <Input
            type="date"
            class="flex-col mb-0"
            label_class="w-full"
            @change="data.empleave_start_date = $event"
            :value="data?.empleave_start_date"
          />
          <div class="flex">
            <Radio
              label="First half"
              class="mx-8 my-0"
              @change="modal.getDurationHalfDay = 'First Half'"
              :modelValue="modal.getDurationHalfDay"
            />
            <Radio
              label="Last half"
              class="my-0"
              @change="modal.getDurationHalfDay = 'Last Half'"
              :modelValue="modal.getDurationHalfDay"
            />
          </div>
        </div>
      </section>
      <section class="my-4" v-if="data.empleave_leave_type === 'Hours'">
        <Input
          type="date"
          class="flex-col mt-4"
          label="Enter Date"
          label_class="w-full"
          input_class="mt-2"
        />
        <section class="flex justify-between">
          <InputTime
            label="Start Time"
            :isOpen="modal.showTime === 'start'"
            @showTime="modal.showTime = 'start'"
          />
          <InputTime
            label="End Time"
            :isOpen="modal.showTime === 'end'"
            @showTime="modal.showTime = 'end'"
          />
        </section>
      </section>
      <label class="text-sm">Reason Note</label>
      <textarea
        rows="4"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.empleave_reason"
      >
      </textarea>
      <section class="mt-6">
        <p class="text-sm">Attachment</p>
        <section
          @click="openFileInput"
          class="w-full border preview-file cursor-pointer mt-2 pb-7 border-dashed border-primary"
        >
          <div
            v-if="data?.empleave_attachement?.length !== 0"
            class="md:grid-cols-6 grid grid-cols-2 gap-4 mt-7 px-8"
          >
            <div
              class="relative wrapper-image-prev"
              v-for="image in data.empleave_attachement"
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
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleLeaveRequest"
        >
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
import InputTime from "@/components/InputTime.vue";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllEmployementAPI } from "@/actions/employment";
import {
  AddLeaveRequestAPI,
  GetLeaveRequestAPI,
} from "@/actions/leave-request";
import { useToast } from "vue-toastification";

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
    ChoiseCompany,
    Input,
    InputTime,
  },
  data() {
    return {
      activeDropdown: "",
      modal: {
        showModal: false,
        showSelect: false,
        showAbility: "hide",
        showTime: "",
        getDurationHalfDay: "",
      },
      data: {
        empleave_attachement: [],
        emp_id: {
          emp_name: "",
          _id: "",
        },
        empleave_type_id: "",
        empleave_leave_type: "",
        empleave_start_date: "",
        empleave_end_date: "",
        empleave_leave_duration: "",
        empleave_reason: "",
      },
      leave_request: [],
      employment: [],
      optionsCompany: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getCompany: true,
        getLeaveRequest: true,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    showMessageStatus(response) {
      if (response.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
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
    createLeaveDuration() {
      const typeLeave = this.data.empleave_leave_type;
      if (typeLeave === "Single Day") {
        return "1 Day";
      } else if (typeLeave === "Multi Day") {
        let date1 = this.data.empleave_start_date;
        let date2 = this.data.empleave_end_date;
        date1 = new Date(Date.parse(date1));
        date2 = new Date(Date.parse(date2));
        const getDuration = (date2 - date1) / (24 * 60 * 60 * 1000);
        return `${getDuration} Day`;
      } else if (typeLeave === "Half Day") {
        return this.modal.getDurationHalfDay;
      }
    },
    createApplyDate() {
      let currentDate = new Date();
      let currentHour = currentDate.getHours();
      let currentMinutes = currentDate.getMinutes().toString().padStart(2, "0");
      let ampm = currentHour >= 12 ? "PM" : "AM";
      return currentHour + ":" + currentMinutes + " " + ampm;
    },
    async handleGetLeaveRequest() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetLeaveRequestAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.leave_request = response?.data;
    },
    async handleLeaveRequest() {
      const payload = {
        ...this.data,
        emp_id: this.data.emp_id._id,
        empleave_leave_duration: this.createLeaveDuration(),
        empleave_apply_date: this.createApplyDate(),
      };
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;

      const response = await AddLeaveRequestAPI(queryAdminSuper, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.handleGetLeaveRequest();
        this.clearInputValue();
      }
      this.showMessageStatus(response);
    },
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
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response.data;
      this.dataCompany = response.data[0];
      this.loading.getCompany = false;
    },
    async handleGetEmployement() {
      const querySuperAdmin = `?company=${this.dataCompany._id}`;
      const response = await GetAllEmployementAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      const getIdNameEmp = response?.data?.map((employment) => ({
        _id: employment?._id,
        emp_name: employment?.emp_fullname,
      }));
      this.employment = getIdNameEmp;
      // this.employee = response.data;

      // console.log(response.data);
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetEmployement();
        this.handleGetLeaveRequest();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
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
