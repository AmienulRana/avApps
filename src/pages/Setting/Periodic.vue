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
        <TableSettingPeriodic :periodics="periodics" :loading="loading.get" />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Add Periodic"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
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
        >
          Save
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import TableSettingPeriodic from "../../components/TableSettingPeriodic.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import {
  AddPeriodicAPI,
  GetPeriodicAPI,
  EditAllowDeductAPI,
  DeleteAllowDeductAPI,
} from "@/actions/periodic";
import { useToast } from "vue-toastification";
import Select from "@/components/Select/index.vue";
import moment from "moment";

export default {
  name: "PeriodicPage",
  components: {
    LayoutAdmin,
    Button,
    TableSettingPeriodic,
    Modal,
    Input,
    ChoiseCompany,
    Select,
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
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;

      const response = await GetPeriodicAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.periodics = response?.data;
      this.loading.get = false;
    },
    handleDetailAllowDeduct(allowDeduct) {
      this.edit = true;
      this.data.emp_id = allowDeduct?._id;
      this.data.empexp_comp_position = allowDeduct?.empexp_comp_position;
      this.data.empexp_company = allowDeduct?.empexp_company;
      this.data.empexp_endate = allowDeduct?.empexp_endate;
      this.data.empexp_startdate = allowDeduct?.empexp_startdate;
    },
    async handleEditAllowDeduct() {
      this.loading = true;
      const id = this.data.emp_id;
      const data = {
        ...this.data,
      };
      const response = await EditAllowDeductAPI(id, data);
      if (response.status === 401) {
        return (window.location.href = "/");
      }
      if (response.status === 200) {
        this.handleGetPeriodic();
        this.clearInputValue();
        this.showMessageStatus(response);
        this.edit = false;
      }
      this.loading = false;
    },
    async handleDeleteAllowDeduct(id) {
      const response = await DeleteAllowDeductAPI(id);
      if (response.status === 401) {
        return (window.location.href = "/");
      }
      if (response.status === 200) {
        this.handleGetPeriodic();
        this.showMessageStatus(response);
      }
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
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
  },
};
</script>

<style scoped></style>
