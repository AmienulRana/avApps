<template>
  <section class="bg-white shadow-md wrapper">
    <section class="flex justify-between items-center flex-wrap px-10 py-6">
      <h1 class="md:text-xl text-lg">Leave Type</h1>
      <Button
        class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2 md:mt-0"
        @click="showModal = true"
        >Add Leave Type</Button
      >
    </section>
    <section>
      <table class="bg-white min-w-max mt-6 w-full">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm">No.</th>
            <th class="text-left text-sm">Name</th>
            <th class="text-left text-sm">Type</th>
            <th class="text-left text-sm">Status</th>
            <th class="text-left text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b h-max"
            v-for="(leave, i) in leave_setting"
            :key="i"
          >
            <td class="p-3 text-sm">
              <p class="text-sm">{{ i + 1 }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ leave?.leave_name }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ leave?.leave_type }}</p>
            </td>
            <td class="p-3 text-sm">
              <SwitchButton
                class="w-max"
                @update:model="(value) => updateStatus(value, leave)"
                :value="leave?.leave_status"
              />
            </td>
            <td class="p-3 text-right relative flex">
              <Button
                class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                @click="detailLeave(leave)"
              >
                <font-awesome-icon icon="fa-pen-to-square" />
              </Button>
              <Button
                class="p-3 shadow-none hover:bg-red-100 text-red-500 rounded-full"
                @click="handleDeleteLeaveType(leave?._id)"
              >
                <font-awesome-icon icon="fa-trash-alt" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <NoDataShowing v-if="leave_setting.length === 0" />
    </section>
    <Modal
      :title="`${modeEdit ? 'Edit' : 'Add'} Leave Type`"
      modalClass="md:w-1/2"
      :showModal="showModal"
      @close="showModal = false"
    >
      <template #header>
        <ChoiseCompany
          v-if="superAdmin"
          @selected:company="dataCompany = $event"
          :options="options"
          :dataCompany="dataCompany"
        />
      </template>
      <section>
        <Input
          label="Name"
          class="flex-col mt-4"
          label_class="w-full"
          input_class="mt-2"
          @change="data.leave_name = $event"
          :value="data.leave_name"
        />
        <Select
          class="flex-col mt-4"
          input_class="w-full mt-2"
          label_class="w-full"
          label="Type"
          :options="['Paid', 'Unpaid']"
          @change="data.leave_type = $event"
          :value="data.leave_type"
        />
      </section>
      <template #footer>
        <section class="flex w-52 justify-between">
          <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
            Cancel
          </Button>
          <Button
            class="bg-green-500 w-24 py-2 text-white rounded-md"
            @click="handleAddLeaveType"
            :disabled="loadingData"
            v-if="!modeEdit"
          >
            Save
          </Button>
          <Button
            class="bg-green-500 w-24 py-2 text-white rounded-md"
            @click="handleEditLeaveType"
            :disabled="loadingData"
            v-else
          >
            Edit
          </Button>
        </section>
      </template>
    </Modal>
  </section>
</template>

<script>
import Button from "./Button.vue";
import SwitchButton from "./SwitchButton.vue";
import Modal from "./Modal.vue";
import Input from "./Input.vue";
import Select from "./Select/index.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import {
  AddLeaveSettingAPI,
  EditLeaveSettingAPI,
  DeleteLeaveSettingAPI,
  GetLeaveSettingAPI,
} from "@/actions/leave-setting";

import { useToast } from "vue-toastification";
import NoDataShowing from "./NoDataShowing.vue";

export default {
  components: {
    Button,
    SwitchButton,
    Modal,
    Input,
    ChoiseCompany,
    Select,
    NoDataShowing,
  },
  name: "LeaveTypeSetting",
  data() {
    return {
      showModal: false,
      superAdmin: false,
      modeEdit: false,
      options: [],
      dataCompany: {},
      loadingData: false,
      leave_setting: [],
      data: {
        leave_id: "",
        leave_name: "",
        leave_type: "",
      },
      loading: {
        company: true,
        get: true,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.company = false;
    },
    showMessageStatus(response) {
      if (response.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    async getLeaveType() {
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;
      const response = await GetLeaveSettingAPI(querySuperAdmin);
      if (response?.status == 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      console.log(response);
      if (response?.status === 200) {
        this.leave_setting = response.data;
      }
    },
    async handleAddLeaveType() {
      this.loadingData = true;
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;
      const response = await AddLeaveSettingAPI(querySuperAdmin, this.data);
      if (response.status == 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.data.leave_name = "";
        this.data.leave_type = "";
        this.showModal = false;
        this.getLeaveType();
      }
      this.showMessageStatus(response);
      this.loadingData = false;
    },
    async handleDeleteLeaveType(id) {
      const response = await DeleteLeaveSettingAPI(id);
      if (response.status == 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.getLeaveType();
      }
      this.showMessageStatus(response);
    },
    async handleEditLeaveType() {
      this.loadingData = true;
      const response = await EditLeaveSettingAPI(this.data.leave_id, this.data);
      if (response.status == 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.data.leave_name = "";
        this.data.leave_type = "";
        this.showModal = false;
        this.getLeaveType();
      }
      this.showMessageStatus(response);
      this.loadingData = false;
    },
    detailLeave(leave) {
      this.modeEdit = true;
      this.showModal = true;
      this.data.leave_name = leave?.leave_name;
      this.data.leave_type = leave?.leave_type;
      this.data.leave_id = leave?._id;
    },
  },
  watch: {
    dataCompany: {
      handler() {
        this.getLeaveType();
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
.wrapper {
  min-height: 550px;
}
</style>
