<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <div class="flex items-center">
          <h1 class="text-2xl">Setting Periodic</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading.company"
            @selected:company="dataCompany = $event"
            :options="options"
            :dataCompany="dataCompany"
          />
        </div>
        <div class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
            Add Periodic</Button
          >
        </div>
      </section>
      <section class="w-full">
        <section class="relative">
          <section
            class="w-full overflow-x-auto custom-scrollbar bg-white"
            :class="loading.get && 'h-96'"
            @click="
              showActions = null;
              showReasonNote = null;
            "
          >
            <table class="bg-white min-w-max mt-6 w-full pb-4">
              <thead class="border-b bg-white border-gray-200 text-gray-400">
                <tr>
                  <th class="text-left text-sm">No.</th>
                  <th class="text-left text-sm">Company</th>
                  <th class="text-left text-sm">Years</th>
                  <th class="text-left text-sm">Month</th>
                  <th class="text-left text-sm">Start date</th>
                  <th class="text-left text-sm">End date</th>
                  <th class="text-left text-sm">Active</th>
                  <th class="text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody v-if="!loading.get">
                <tr
                  class="border-b h-max"
                  v-for="(periodic, i) in periodics"
                  :key="i"
                >
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ i + 1 }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">
                      {{ periodic?.company_id?.company_name }}
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ periodic?.periodic_years }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ periodic?.periodic_month }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ periodic?.periodic_start_date }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ periodic?.periodic_end_date }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <SwitchButton
                      class="w-max"
                      @update:model="(value) => updateStatus(value, periodic)"
                      :value="periodic?.periodic_status"
                    />
                  </td>
                  <td class="p-3 text-right relative flex">
                    <Button
                      class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                      @click="handleDetailPeriodic(periodic)"
                    >
                      <font-awesome-icon
                        icon="fa-pen-to-square"
                        class="text-primary"
                      />
                    </Button>
                    <Button
                      class="p-3 shadow-none hover:bg-red-100 text-red-500 rounded-full"
                      @click="handleDeletePeriodic(periodic?._id)"
                    >
                      <font-awesome-icon
                        icon="fa-trash-alt"
                        class="text-red-500"
                      />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
            <NoDataShowing v-if="!loading.get && periodics.length === 0" />
            <Loading v-if="loading.get" />
          </section>
        </section>
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    :title="`${modeEdit ? 'Edit' : 'Add'} Periodic`"
    :showModal="modal.showModal"
    @close="
      modal.showModal = false;
      modeEdit = false;
      clearInputValue();
    "
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
      <Select
        class="flex-col mt-4"
        input_class="w-full mt-2"
        label_class="w-full"
        label="Years"
        :options="years"
        :value="data.periodic_years"
        @change="data.periodic_years = $event"
      />
      <Select
        class="flex-col mt-4"
        input_class="w-full mt-2"
        label_class="w-full"
        label="Month"
        :options="months"
        :value="data.periodic_month"
        @change="data.periodic_month = $event"
      />
      <Input
        type="date"
        label="Start Date"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        :value="data.periodic_start_date"
        @change="data.periodic_start_date = $event"
      />
      <Input
        type="date"
        label="End Date"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        :value="data.periodic_end_date"
        @change="data.periodic_end_date = $event"
      />
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleAddPeriodic"
          :disabled="loadingData"
          v-if="!modeEdit"
        >
          Save
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditPeriodic"
          :disabled="loadingData"
          v-else
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
import SwitchButton from "../../components/SwitchButton.vue";
import Loading from "../../components/Loading.vue";
import NoDataShowing from "../../components/NoDataShowing.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import {
  AddPeriodicAPI,
  GetPeriodicAPI,
  EditPeriodicAPI,
  DeletePeriodicAPI,
} from "@/actions/periodic";
import { useToast } from "vue-toastification";
import Select from "@/components/Select/index.vue";
import moment from "moment";
import { ChangeStatusPeriodicAPI } from "@/actions/periodic";

export default {
  name: "PeriodicPage",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Input,
    ChoiseCompany,
    Select,
    SwitchButton,
    Loading,
    NoDataShowing,
  },
  data() {
    return {
      activeDropdown: "",
      superAdmin: false,
      options: [],
      dataCompany: {},
      loadingData: false,
      loading: {
        company: true,
        get: true,
      },
      modeEdit: false,
      modal: {
        showModal: false,
      },
      years: [],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      id_periodic: "",
      data: {
        periodic_start_date: "",
        periodic_end_date: "",
        periodic_years: "",
        periodic_month: "",
      },
      periodics: [],
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
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
      }
    },
    async updateStatus(value, periodic) {
      periodic.periodic_status = value;
      const response = await ChangeStatusPeriodicAPI(periodic?._id);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.handleGetPeriodic();
      }
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
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
    async handleAddPeriodic() {
      this.loadingData = true;
      const data = {
        ...this.data,
      };

      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;
      const response = await AddPeriodicAPI(data, querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetPeriodic();
        this.showMessageStatus(response);
        this.clearInputValue();
        this.modal.showModal = false;
      }
      this.loadingData = false;
    },
    async handleGetPeriodic() {
      this.loading.get = false;
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;

      const response = await GetPeriodicAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.periodics = response?.data;
      this.loading.get = false;
    },
    handleDetailPeriodic(periodic) {
      this.modeEdit = true;
      this.modal.showModal = true;
      this.id_periodic = periodic?._id;
      this.data.periodic_start_date = periodic?.periodic_start_date;
      this.data.periodic_end_date = periodic?.periodic_end_date;
      this.data.periodic_years = periodic?.periodic_years;
      this.data.periodic_month = periodic?.periodic_month;
    },
    async handleEditPeriodic() {
      this.loadingData = true;
      const id = this.id_periodic;
      const data = {
        ...this.data,
      };
      const response = await EditPeriodicAPI(id, data);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.handleGetPeriodic();
        this.clearInputValue();
        this.modeEdit = false;
        this.modal.showModal = false;
      }
      this.showMessageStatus(response);
      this.loadingData = false;
    },
    async handleDeletePeriodic(id) {
      const response = await DeletePeriodicAPI(id);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.handleGetPeriodic();
      }
      this.showMessageStatus(response);
    },
  },
  watch: {
    dataCompany: {
      handler() {
        this.handleGetPeriodic();
      },
      deep: true,
    },
  },
  created() {
    for (let i = 0; i <= 10; i++) {
      let year = moment().subtract(i, "years").format("YYYY");
      this.years.unshift(year);
    }
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getAllCompany();
  },
};
</script>

<style scoped>
table thead th,
table tbody tr td {
  padding: 1rem 2rem;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 5px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #c6c8cc;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1;
}
</style>
