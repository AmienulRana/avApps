<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <section class="flex items-center">
          <h1 class="text-xl">Employment Status</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading?.getCompany"
            @selected:company="dataCompany = $event"
            :options="optionsCompany"
            :dataCompany="dataCompany"
          />
        </section>
        <div class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
            Add Status</Button
          >
        </div>
      </section>
      <section class="w-full">
        <section
          class="w-full overflow-x-auto relative custom-scrollbar bg-white"
          :class="loading.getStatus ? 'h-96' : ''"
        >
          <table class="bg-white min-w-max mt-6 w-full pb-4">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm">Name Betest</th>
                <th class="text-left text-sm">Preview</th>
                <th class="text-left text-sm">Description</th>
                <th class="text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody v-if="!loading.getStatus">
              <tr
                class="border-b h-max"
                v-for="(data, i) in empStatus"
                :key="i"
              >
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.empstatus_name }}</p>
                </td>
                <td class="p-3 text-sm font-bold">
                  <p
                    class="preview-badge rounded-full text-xs"
                    :style="`background:${data?.empstatus_color}`"
                  >
                    {{ data.empstatus_name }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.empstatus_desc || "-" }}</p>
                </td>
                <td class="p-3 text-right relative">
                  <Button
                    class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                    @click="detailEmpStatus(data)"
                  >
                    <font-awesome-icon icon="fa-pen-to-square" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
          <NoDataShowing v-if="!loading.getStatus && empStatus.length === 0" />
          <Loading v-if="loading.getStatus" />
        </section>
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Add Status"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
    modalClass="md:w-1/2"
  >
    <template #header>
      <ChoiseCompany
        v-if="superAdmin && !loading?.getCompany"
        @selected:company="dataCompany = $event"
        :options="optionsCompany"
        :dataCompany="dataCompany"
      />
    </template>
    <section @click="modal.showDropdown = null">
      <Input
        class="flex-col mt-4"
        label="Name Beates"
        label_class="w-full"
        input_class="mt-2"
        @input="data.empstatus_name = $event"
        :value="data?.empstatus_name"
      />
      <Select
        label="Color value"
        label_class="w-full"
        input_class="w-full mt-2"
        class="mb-2.5 flex-col"
        :options="['Success', 'Info', 'Primary', 'Danger', 'Warning']"
        @change="selectedStatus = $event"
        :value="selectedStatus"
      />
      <div
        class="bg-amber-100 px-5 py-2 rounded-md flex items-center"
        v-if="data.empstatus_name && selectedStatus"
      >
        <p
          class="preview-badge rounded-full text-sm"
          :style="`background:${changeBackgroundStatus}`"
        >
          {{ data.empstatus_name }}
        </p>
        <p class="text-sm text-gray-400 ml-2">
          This will be the badge of the employee
        </p>
      </div>
      <label class="text-sm">Description</label>
      <textarea
        rows="2"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.empstatus_desc"
      ></textarea>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleAddEmpStatus"
          :disabled="loading.addStatus"
          v-if="!modeEdit"
        >
          Save
        </Button>
        <Button
          v-else
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditEmpStatus"
          :disabled="loading.addStatus"
        >
          Edit
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Loading from "../../components/Loading.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import Select from "@/components/Select/index.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import {
  AddEmpStatusAPI,
  GetEmpStatusAPI,
  EditEmpStatusAPI,
} from "@/actions/emp-status";
import { useToast } from "vue-toastification";
import NoDataShowing from "@/components/NoDataShowing.vue";

export default {
  name: "EmploymentStatusPage",
  components: {
    LayoutAdmin,
    Button,
    Loading,
    Modal,
    Input,
    Select,
    ChoiseCompany,
    NoDataShowing,
  },
  data() {
    return {
      modal: {
        showModal: false,
        showDropdown: false,
      },
      modeEdit: false,
      empStatus: [],
      selectedStatus: "",
      data: {
        _id: "",
        empstatus_name: "",
        empstatus_color: "",
        empstatus_desc: "",
      },
      optionsCompany: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getCompany: true,
        addStatus: false,
        getStatus: true,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
      this.selectedStatus = "";
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
    async handleAddEmpStatus() {
      this.loading.addStatus = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const payload = {
        ...this.data,
        empstatus_color: this.changeBackgroundStatus,
      };
      const response = await AddEmpStatusAPI(queryAdminSuper, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.modal.showModal = false;
        this.getEmpStatus();
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loading.addStatus = false;
    },
    async getEmpStatus() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetEmpStatusAPI(queryAdminSuper);

      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.empStatus = response.data;
      this.loading.getStatus = false;
    },
    detailEmpStatus(status) {
      this.modeEdit = true;
      this.modal.showModal = true;
      this.data.empstatus_name = status?.empstatus_name;
      this.data.empstatus_color = status?.empstatus_color;
      this.data.empstatus_desc = status?.empstatus_desc;
      this.data._id = status?._id;
    },
    async handleEditEmpStatus() {
      this.loading.addStatus = true;
      const payload = {
        ...this.data,
        empstatus_color: this.selectedStatus
          ? this.changeBackgroundStatus
          : this.data.empstatus_color,
      };
      const response = await EditEmpStatusAPI(this.data?._id, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.modal.showModal = false;
        this.getEmpStatus();
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loading.addStatus = false;
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response.data;
      this.dataCompany = response.data[0];
      this.loading.getCompany = false;
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.getEmpStatus();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
  },
  computed: {
    changeBackgroundStatus() {
      switch (this.selectedStatus) {
        case "Primary":
          return "#1976d3";
        case "Info":
          return "#1976d3";
        case "Success":
          return "rgb(34 197 94)";
        case "Danger":
          return "rgb(239 68 68)";
        case "Warning":
          return "rgb(249 115 22)";
        default:
          return "#1976d3";
      }
    },
  },
};
</script>

<style scoped>
.preview-badge {
  min-width: 35px;
  min-height: 25px;
  width: max-content;
  padding: 5px 20px;
  color: white;
}
</style>
