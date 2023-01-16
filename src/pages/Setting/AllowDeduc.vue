<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <div class="flex items-center">
          <h1 class="text-2xl">Setting Allowance or Deduction</h1>
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
            Add Allowance or Deduction</Button
          >
        </div>
      </section>
      <section class="w-full">
        <TableAllowDeducSetting :ad="allowDeducts" />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Add Allowance or Deduction"
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
      <Input
        label="Name"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        :value="data.ad_name"
        @change="data.ad_name = $event"
      />
      <label class="text-sm">Description</label>
      <textarea
        rows="4"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.ad_desc"
      >
      </textarea>
      <section class="flex justify-between items-center mt-4">
        <p class="text-sm">Type</p>
        <div class="flex md:px-16">
          <Radio
            label="Allowance"
            @change="data.ad_type = 'Allowance'"
            :modelValue="data.ad_type"
          />
          <Radio
            label="Deduction"
            class="mx-8"
            @change="data.ad_type = 'Deduction'"
            :modelValue="data.ad_type"
          />
        </div>
      </section>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleAddAllowDeduct"
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
import TableAllowDeducSetting from "../../components/TableAllowDeducSetting.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import Radio from "@/components/Radio.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import {
  AddAllowDeductAPI,
  GetAllowDeductAPI,
  EditAllowDeductAPI,
  DeleteAllowDeductAPI,
} from "@/actions/allow-deduction";
import { useToast } from "vue-toastification";

export default {
  name: "AllowanceDeduction",
  components: {
    LayoutAdmin,
    Button,
    TableAllowDeducSetting,
    Modal,
    Input,
    Radio,
    ChoiseCompany,
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
      },
      modal: {
        showModal: false,
      },
      data: {
        ad_name: "",
        ad_desc: "",
        ad_type: "",
      },
      allowDeducts: [],
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
    async handleAddAllowDeduct() {
      this.loadingData = true;
      const data = {
        ...this.data,
      };
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;
      const response = await AddAllowDeductAPI(data, querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetAllowDeduct();
        this.showMessageStatus(response);
        this.clearInputValue();
      }
      this.loadingData = false;
    },
    async handleGetAllowDeduct() {
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;

      const response = await GetAllowDeductAPI(querySuperAdmin);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.allowDeducts = response?.data;
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
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.handleGetAllowDeduct();
        this.clearInputValue();
        this.showMessageStatus(response);
        this.edit = false;
      }
      this.loading = false;
    },
    async handleDeleteAllowDeduct(id) {
      const response = await DeleteAllowDeductAPI(id);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.handleGetAllowDeduct();
        this.showMessageStatus(response);
      }
    },
  },
  watch: {
    dataCompany: {
      handler() {
        this.handleGetAllowDeduct();
      },
      deep: true,
    },
  },
  mounted() {
    // const payload = decrypt
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
    // this.handleGetDashboard();
  },
};
</script>

<style scoped></style>
