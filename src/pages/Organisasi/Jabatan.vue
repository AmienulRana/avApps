<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center flex-wrap">
        <div class="flex items-center">
          <h1 class="md:text-2xl text-lg">Designation</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading.designation"
            @selected:company="dataCompany = $event"
            :options="options"
            :dataCompany="dataCompany"
          />
        </div>
        <Button
          class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2 md:mt-0"
          @click="showModal = true"
          >Add Designation</Button
        >
      </section>
      <section class="flex mt-6 flex-wrap w-10/12"></section>
      <section class="relative">
        <section class="overflow-x-auto custom-scrollbar w-full">
          <table class="table-auto bg-white w-full mt-6 min-w-max">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm p-3">Name Employement</th>
                <th class="text-left text-sm p-3">Designation</th>
                <th class="text-left text-sm p-3">Description</th>
                <th class="text-left text-sm p-3">No. Of Employees</th>
                <th class="text-left text-sm p-3">Actions</th>
              </tr>
            </thead>
            <tbody v-if="!loading.designation">
              <tr v-for="(des, index) in designations" :key="index">
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ des?.emp_id?.emp_fullname }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">{{ des?.des_name }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ des?.desc ? des?.desc : "-" }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ des?.des_employee_total }}
                  </p>
                </td>
                <td class="p-3 relative">
                  <button
                    class="mr-3"
                    @click="handleDeleteDesignation(des?._id)"
                  >
                    <font-awesome-icon
                      icon="fa-trash-alt"
                      class="text-red-500"
                    />
                  </button>
                  <button @click="handleDetailDesignation(des)">
                    <font-awesome-icon
                      icon="fa-pen-to-square"
                      class="text-primary"
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <Loading v-if="loading.designation" />
        </section>
        <NoDataShowing
          v-if="!loading.designation && designations.length === 0"
        />
      </section>
    </section>
    <Modal
      :title="`${modalEdit ? 'Edit' : 'Add'} Designation`"
      class="md:w-9/12 w-full mx-auto h-max"
      :showModal="showModal"
      @close="
        showModal = false;
        modalEdit = false;
        clearInputValue();
      "
    >
      <template #header>
        <ChoiseCompany
          v-if="superAdmin && !loading.designation"
          @selected:company="dataCompany = $event"
          :options="options"
          :dataCompany="dataCompany"
        />
      </template>

      <section class="mb-10">
        <SelectSearch
          label="Employee"
          :options="employment"
          :isOpen="modal.showSelect"
          @handleShowSelect="() => (modal.showSelect = !modal.showSelect)"
          class="flex-col"
          property="emp_fullname"
          input_class="w-full mt-2"
          label_class="w-full text-black"
          @selected="emp_id = $event"
          :selectedOption="emp_id"
        />
        <Input
          label="Name"
          label_class="w-full"
          input_class="w-full mt-2"
          class="flex-col"
          placeholder="Enter Name"
          :value="name"
          @input="name = $event"
        />
        <label> Description </label>
        <textarea
          class="border focus:outline-primary rounded w-full mt-2"
          rows="3"
          v-model="description"
        >
        </textarea>
      </section>
      <template #footer>
        <section class="flex justify-end">
          <Button
            @click="showModal = false"
            class="bg-gray-400 w-24 mr-3 px-2 py-2 text-white rounded-md"
          >
            Cancel
          </Button>
          <Button
            class="bg-primary w-24 px-2 py-2 text-white rounded-md"
            @click="handleAddDesignation"
            :class="!name && 'opacity-70'"
            :disabled="!name"
            v-if="!modalEdit"
          >
            Save
          </Button>
          <Button
            v-else
            class="bg-primary w-24 px-2 py-2 text-white rounded-md"
            @click="handleEditDesignation"
            :class="!name && 'opacity-70'"
            :disabled="!name"
          >
            Edit
          </Button>
        </section>
      </template>
    </Modal>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Modal from "../../components/Modal.vue";
import Input from "../../components/Input.vue";
import {
  GetDesignationAPI,
  AddDesignationAPI,
  EditDesignationAPI,
  DeleteDesignationAPI,
} from "@/actions/designation";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import Loading from "@/components/Loading.vue";
import { GetAllEmployementAPI } from "@/actions/employment";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import NoDataShowing from "@/components/NoDataShowing.vue";
import { useToast } from "vue-toastification";

export default {
  name: "EmployeeIndex",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Loading,
    ChoiseCompany,
    Input,
    SelectSearch,
    NoDataShowing,
  },
  data() {
    return {
      showModal: false,
      modalEdit: false,
      modal: {
        showSelect: false,
      },
      name: "",
      description: "",
      id_des: "",
      emp_id: "",
      employment: [],
      designations: [],
      superAdmin: false,
      showSelectCompany: false,
      options: [],
      dataCompany: {},
      loading: {
        designation: true,
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
      this.loading.designation = false;
    },
    clearInputValue() {
      this.name = "";
      this.description = "";
      this.emp_id = "";
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
    async handleGetDesignation() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDesignationAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.designations = response.data;
      this.loading.designation = false;
    },
    async handleAddDesignation() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const data = {
        des_name: this.name,
        des_desc: this.description,
        emp_id: this.emp_id?._id,
      };
      const response = await AddDesignationAPI(data, querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetDesignation();
        this.clearInputValue();
        this.showModal = false;
      }
      this.showMessageStatus(response);
    },
    handleDetailDesignation(designation) {
      this.showModal = true;
      this.modalEdit = true;
      this.id_des = designation?._id;
      this.emp_id = designation?.emp_id;
      this.name = designation?.des_name;
      this.description = designation?.des_desc;
    },
    async handleEditDesignation() {
      const payload = {
        emp_id: this.emp_id?._id,
        des_name: this.name,
        des_desc: this.description,
      };
      const response = await EditDesignationAPI(payload, this.id_des);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetDesignation();
        this.clearInputValue();
        this.showModal = false;
        this.modalEdit = false;
      }
      this.showMessageStatus(response);
    },
    async handleDeleteDesignation(id) {
      const response = await DeleteDesignationAPI(id);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetDesignation();
      }
      this.showMessageStatus(response);
    },
    async handleGetEmployement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetAllEmployementAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      const getIdNameEmp = response?.data?.map((employment) => ({
        _id: employment?._id,
        emp_fullname: employment?.emp_fullname,
      }));
      this.employment = getIdNameEmp;
    },
  },
  mounted() {
    // const departement
    this.handleGetDesignation();
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getAllCompany();
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetDesignation();
        this.handleGetEmployement();
      },
      deep: true,
    },
  },
};
</script>

<style scoped></style>
