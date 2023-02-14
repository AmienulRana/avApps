<template>
  <LayoutAdmin @click="optionsDepartement = null">
    <section class="md:px-8 px-4 my-6 w-full">
      <section class="flex justify-between flex-wrap items-center">
        <div class="flex items-center">
          <h1 class="md:text-2xl text-lg">Departement</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading.departement"
            @selected:company="dataCompany = $event"
            :options="options"
            :dataCompany="dataCompany"
          />
        </div>
        <Button
          class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2"
          @click="modal.showModal = true"
          >Add Departement</Button
        >
      </section>
      <section class="flex mt-6 flex-wrap w-10/12"></section>
      <section class="relative">
        <section class="overflow-x-auto custom-scrollbar w-full">
          <table class="table-auto bg-white w-full mt-6 min-w-max">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm p-3">Name</th>
                <th class="text-left text-sm p-3">Manager</th>
                <th class="text-left text-sm p-3">Description</th>
                <th class="text-left text-sm p-3">Status</th>
                <th class="text-left text-sm p-3" v-if="superAdmin">Company</th>
                <th class="text-left text-sm p-3">Work Shift</th>
                <th class="text-left text-sm p-3">Location</th>
                <th class="text-left text-sm p-3">Created</th>
                <th class="text-left text-sm p-3">Actions</th>
              </tr>
            </thead>
            <tbody v-if="!loading.departement">
              <tr v-for="(departement, index) in departements" :key="index">
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ departement?.dep_name }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ departement?.dep_manager?.emp_fullname }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ departement?.dep_desc ? departement?.dep_desc : "-" }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p
                    class="text-sm text-white rounded-full min-w-max px-6 py-1"
                    :class="
                      departement?.dep_status === 'Active'
                        ? 'bg-primary'
                        : 'bg-red-500'
                    "
                  >
                    {{ departement?.dep_status }}
                  </p>
                </td>
                <td class="p-3 text-sm" v-if="superAdmin">
                  <p class="text-sm text-gray-400">
                    {{ departement?.company_id?.company_name }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ departement?.dep_workshift || "-" }}
                  </p>
                </td>
                <td class="p-3 text-sm text-gray-400">
                  {{
                    departement?.dep_location ? departement?.dep_location : "-"
                  }}
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ localDateString(departement?.dep_created) }}
                  </p>
                </td>
                <td class="p-3 text-right relative">
                  <Button
                    class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
                    @click.stop="optionsDepartement = index"
                  >
                    <font-awesome-icon icon="fa-ellipsis" />
                  </Button>
                  <div
                    class="action_dep text-left absolute -top-full right-16 rounded-md bg-white shadow-md w-52 md:w-max md:h-max"
                    v-if="optionsDepartement === index"
                  >
                    <ul class="text-sm">
                      <li @click="handleDetailDepartement(departement?._id)">
                        Edit
                      </li>
                      <!-- <li>De-activate</li> -->
                      <li
                        @click="
                          modal.delete = true;
                          id_dep = departement?._id;
                        "
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Loading v-if="loading.departement" />
          <NoDataShowing
            v-if="!loading.departement && departements.length === 0"
          />
        </section>
      </section>
    </section>
    <Modal
      :title="`${modal.edit ? 'Edit' : 'Add'} Departement`"
      class="md:w-9/12 w-full mx-auto z-20"
      :showModal="modal.showModal"
      @close="
        modal.showModal = false;
        modal.edit = false;
        clearInputValue();
      "
    >
      <template #header>
        <ChoiseCompany
          v-if="superAdmin && !loading.departement && !modal.edit"
          @selected:company="dataCompany = $event"
          :options="options"
          :dataCompany="dataCompany"
        />
      </template>
      <Input
        label="Name"
        label_class="w-full"
        input_class="w-full mt-2"
        class="flex-col"
        placeholder="Name"
        :value="name"
        @change="name = $event"
      />
      <SelectSearch
        label="Manager"
        property="emp_fullname"
        :placeholder="manager || 'Choose a manager'"
        :options="employee"
        :isOpen="modal.showSelect === 'choose_manager'"
        @handleShowSelect="
          modal.showSelect === 'choose_manager'
            ? (modal.showSelect = null)
            : (modal.showSelect = 'choose_manager')
        "
        class="flex-col"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        :selectedOption="manager"
        @selected="manager = $event"
      />
      <Input
        label="Location"
        label_class="w-full"
        input_class="w-full mt-2"
        class="flex-col mt-4"
        placeholder="Enter Location"
        :value="location"
        @change="location = $event"
      />
      <SelectSearch
        label="Work Shift"
        :placeholder="work_shift || 'Choose a Work shift'"
        :options="[
          'Regular work shift',
          'demo working shift regular',
          'demo working shift scheduled',
        ]"
        :isOpen="modal.showSelect === 'work_shift'"
        @handleShowSelect="
          modal.showSelect === 'work_shift'
            ? (modal.showSelect = null)
            : (modal.showSelect = 'work_shift')
        "
        class="flex-col"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        :selectedOption="work_shift"
        @selected="work_shift = $event"
      />
      <label class="text-sm"> Description </label>
      <textarea
        class="border focus:outline-primary rounded w-full mt-2"
        rows="3"
        v-model="description"
      >
      </textarea>
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
            @click="handleAddDepartement"
            :class="!name && 'opacity-70'"
            :disabled="!name"
            v-if="!modal.edit"
          >
            Save
          </Button>
          <Button
            v-else
            class="bg-primary w-24 px-2 py-2 text-white rounded-md"
            @click="handleEditDepartement"
            :class="!name && 'opacity-70'"
            :disabled="!name"
          >
            Edit
          </Button>
        </section>
      </template>
    </Modal>
    <Modal
      modalClass="md:w-1/2 md:h-80"
      :showModal="modal.delete"
      @close="modal.delete = false"
    >
      <section class="text-center mb-6">
        <img
          src="@/assets/icons/warning.svg"
          alt="warning-icon"
          class="block m-auto"
        />
        <h1 class="text-xl">Are You Sure to deleted this Departement?</h1>
        <section class="flex w-full justify-center mt-4">
          <Button
            class="bg-gray-400 w-24 py-2 mr-4 text-white rounded-md"
            @click="modal.delete = ''"
          >
            Cancel
          </Button>
          <Button
            class="bg-red-500 w-24 py-2 text-white rounded-md"
            @click="handleDeleteDepartement"
            :disabled="loading.delete"
          >
            Yes, Sure
          </Button>
        </section>
      </section>
    </Modal>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Modal from "../../components/Modal.vue";
import Input from "../../components/Input.vue";
import SelectSearch from "../../components/Select/SelectSearch.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import Loading from "@/components/Loading.vue";
import NoDataShowing from "@/components/NoDataShowing.vue";
import {
  AddDepartementAPI,
  GetDepartementAPI,
  DetailDepartementAPI,
  EditDepartementAPI,
  DeleteDepartementAPI,
} from "@/actions/departement";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import { GetAllEmployementAPI } from "@/actions/employment";
import { GetShiftAPI } from "@/actions/shift";

export default {
  name: "DepartementPage",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Input,
    SelectSearch,
    ChoiseCompany,
    Loading,
    NoDataShowing,
  },

  data() {
    return {
      modal: {
        showModal: false,
        showSelect: null,
        edit: false,
      },
      id_dep: "",
      manager: "",
      optionsDepartement: null,
      name: "",
      work_shift: "",
      location: "",
      employee: [],
      description: "",
      departements: [],
      superAdmin: false,
      showSelectCompany: false,
      options: [],
      dataCompany: {},
      loading: {
        departement: true,
        delete: false,
      },
    };
  },
  methods: {
    dateNow() {
      const date = new Date();
      const month = date.getMonth() + 1; // bulan dimulai dari 0, sehingga perlu ditambah 1
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
    localDateString(date) {
      let new_date = new Date(date);
      return new_date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    clearInputValue() {
      this.name = "";
      this.description = "";
      this.work_shift = "";
      this.manager = {};
      this.location = "";
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.departement = false;
    },
    async handleGetDepartement() {
      this.loading.departement = true;
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.toast.error(response?.data?.message);
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.departements = response?.data;
      this.loading.departement = false;
    },
    async handleAddDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const data = {
        dep_name: this.name,
        dep_desc: this.description,
        dep_workshift: this.work_shift,
        dep_manager: this.manager?._id,
        dep_location: this.location,
        dep_status: "Active",
        dep_created: this.dateNow(),
      };
      const response = await AddDepartementAPI(data, querySuperAdmin);
      if (response.status === 401) {
        this.$router.push("/login");
        this.toast.error(response?.data?.message);
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetDepartement();
        this.clearInputValue();
        this.modal.showModal = false;
      }
    },
    async handleDetailDepartement(id) {
      this.modal.showModal = true;
      this.modal.edit = true;
      // this.superAdmin = false;
      this.id_dep = id;
      const response = await DetailDepartementAPI(id);
      this.name = response?.data?.dep_name;
      this.description = response?.data?.dep_desc;
      this.work_shift = response?.data?.dep_workshift;
      this.manager = response?.data?.dep_manager;
      this.location = response?.data?.dep_location;
    },
    async handleEditDepartement() {
      const data = {
        dep_name: this.name,
        dep_desc: this.description,
        dep_workshift: this.work_shift,
        dep_manager: this.manager?._id,
        dep_location: this.location,
        dep_created: this.dateNow(),
      };
      const response = await EditDepartementAPI(this.id_dep, data);
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        this.$router.push("/login");
      }
      if (response?.status === 200) {
        this.handleGetDepartement();
        this.clearInputValue();
        this.modal.showModal = false;
      }
    },
    async handleDeleteDepartement() {
      const id = this.id_dep;
      this.loading.delete = true;
      const response = await DeleteDepartementAPI(id);
      if (response.status === 401) {
        this.$router.push("/login");
        this.toast.error(response?.data?.message);
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetDepartement();
        this.modal.delete = false;
      }
      this.loading.delete = false;
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
      this.employee = getIdNameEmp;
      // this.replace_emplyoment = getIdNameEmp;
    },
    async getShift() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetShiftAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.shifts = response?.data;
      }
    },
  },

  mounted() {
    // const departement
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getAllCompany();
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetDepartement();
        this.handleGetEmployement();
      },
      deep: true,
    },
  },
  computed: {
    // onlyDepartementName() {
    //   //   return this.departements.map((dep) => dep?.name);
    // },
  },
};
</script>

<!-- px-4 py-2 hover:bg-gray-100 hover:text-blue-400 -->
<style scoped>
.action_dep ul li {
  padding: 10px 16px;
  cursor: pointer;
  color: rgb(192, 192, 192);
}
.action_dep ul li:hover {
  color: rgb(71, 166, 255);
}
</style>
