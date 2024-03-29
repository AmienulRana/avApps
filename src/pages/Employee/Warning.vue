<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <section class="flex items-center">
          <h1 class="text-xl">Employment Warning</h1>
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
            Add Warning</Button
          >
        </div>
      </section>
      <section class="flex mt-6 flex-wrap w-10/12 items-center mb-5">
        <section class="relative">
          <Button
            class="rounded-full px-6 text-gray-400 py-2 duration-300 text-sm"
            :class="[
              'bg-white hover:bg-gray-50 hover:text-blue-800',
              filter.date ? 'text-primary bg-gray-50' : '',
            ]"
            @click.stop="changeDropdownActive('date')"
            style="min-width: 80px; min-height: 30px"
          >
            {{ !filter.date ? "Entry Date" : filter.date }}
            <font-awesome-icon
              icon="fa-xmark"
              class="ml-3 text-primary"
              v-if="filter.date"
              @click.stop="
                handleFilter(
                  (filter.date = ''),
                  filter.employment,
                  filter.status
                );
                activeDropdown = '';
              "
            />
          </Button>
          <Transition
            enter-active-class="animated fadeInDown"
            leave-active-class="animated fadeOutUp"
          >
            <Calender
              class="absolute top-10 left-0 z-20 mt-2.5"
              v-if="activeDropdown === 'date'"
              @selected="
                handleFilter(
                  (filter.date = $event),
                  filter.employment,
                  filter.status
                )
              "
            />
          </Transition>
        </section>
        <Dropdown
          title="Status"
          :showDropdown="activeDropdown === 'type'"
          @update:activeDropdown="changeDropdownActive('type')"
          :options="['Solved', 'Unsolved']"
          @selected="
            handleFilter(
              filter.date,
              filter.employment,
              (filter.status = $event)
            )
          "
          @clearSelected="
            handleFilter(
              filter.date,
              filter.employment,
              (filter.status = $event)
            )
          "
          :selectedOption="filter.status"
        />
        <Dropdown
          title="Employment"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="changeDropdownActive('employee')"
          :options="employment"
          property="emp_fullname"
          :selectedOption="filter.employment"
          @selected="
            handleFilter(
              filter.date,
              (filter.employment = $event?._id),
              filter.status
            )
          "
          @clearSelected="
            handleFilter(
              filter.date,
              (filter.employment = $event),
              filter.status
            )
          "
        />
      </section>
      <section class="w-full">
        <section
          class="w-full overflow-x-auto relative custom-scrollbar bg-white"
          :class="loading.getStatus ? 'h-96' : ''"
        >
          <table class="bg-white min-w-max mt-6 w-full pb-4">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm">Company</th>
                <th class="text-left text-sm">Employment</th>
                <th class="text-left text-sm">Subject</th>
                <th class="text-left text-sm">Warning Date</th>
                <th class="text-left text-sm">Status</th>
                <th class="text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody v-if="!loading.getStatus && empWarning.length !== 0">
              <tr
                class="border-b h-max"
                v-for="(warning, i) in warning_filter"
                :key="i"
              >
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ warning?.company_id?.company_name }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ warning?.emp_id?.emp_fullname }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ warning?.empwarning_subject }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ warning?.empwarning_date || "-" }}</p>
                </td>
                <td class="p-3">
                  <p
                    class="text-xs rounded-full preview-badge"
                    :class="
                      warning?.empwarning_status === 'Solved'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    "
                  >
                    {{ warning?.empwarning_status || "-" }}
                  </p>
                </td>
                <td class="p-3 text-right relative flex">
                  <Button
                    class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                    @click="detailEmpWarning(warning)"
                  >
                    <font-awesome-icon icon="fa-pen-to-square" />
                  </Button>
                  <Button
                    class="p-3 shadow-none hover:bg-blue-100 text-red-500 rounded-full"
                    @click="deleteEmpWarning(warning?._id)"
                    :disabled="loading.addStatus"
                  >
                    <font-awesome-icon icon="fa-trash-alt" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
          <NoDataShowing
            v-if="!loading.getStatus && warning_filter.length === 0"
          />

          <Loading v-if="loading.getStatus" />
        </section>
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    :title="`${modeEdit ? 'Edit' : 'Add'} Status`"
    :showModal="modal.showModal"
    @close="
      modal.showModal = false;
      modeEdit = false;
      clearInputValue();
    "
    modalClass="md:w-1/2"
  >
    <template #header v-if="!modeEdit">
      <ChoiseCompany
        v-if="superAdmin && !loading?.getCompany"
        @selected:company="dataCompany = $event"
        :options="optionsCompany"
        :dataCompany="dataCompany"
      />
    </template>
    <section @click="modal.showDropdown = null">
      <SelectSearch
        v-if="!modeEdit"
        label="Warning to"
        :options="employment"
        :isOpen="modal.showSelect"
        @handleShowSelect="() => (modal.showSelect = !modal.showSelect)"
        class="flex-col"
        property="emp_fullname"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        @selected="data.emp_id = $event"
        :selectedOption="data.emp_id"
      />
      <Input
        class="flex-col mt-4"
        label="Subject"
        label_class="w-full"
        input_class="mt-2"
        @input="data.empwarning_subject = $event"
        :value="data?.empwarning_subject"
      />
      <Select
        label="Warning Type"
        label_class="w-full"
        input_class="w-full mt-2"
        class="mb-2.5 flex-col"
        :options="[
          'Peringatan Lisan',
          'Surat Peringatan Pertama',
          'Surat Peringatan Kedua',
          'Surat Peringatan Ketiga',
        ]"
        @change="data.empwarning_type = $event"
        :value="data?.empwarning_type"
      />
      <Input
        type="date"
        class="flex-col mt-4"
        label="Warning Date"
        label_class="w-full"
        input_class="mt-2"
        @input="data.empwarning_date = $event"
        :value="data?.empwarning_date"
      />
      <Select
        label="Status"
        label_class="w-full"
        input_class="w-full mt-2"
        class="mb-2.5 flex-col"
        :options="['Solved', 'Unsolved']"
        @change="data.empwarning_status = $event"
        :value="data?.empwarning_status"
      />
      <label class="text-sm">Description</label>
      <textarea
        rows="2"
        class="w-full mt-2 border outline-primary py-4"
        v-model="data.empwarning_desc"
      ></textarea>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleAddEmpWarning"
          :disabled="loading.addStatus"
          v-if="!modeEdit"
        >
          Save
        </Button>
        <Button
          v-else
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditEmpWarning"
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
import Dropdown from "../../components/Dropdown.vue";
import Input from "@/components/Input.vue";
import Select from "@/components/Select/index.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import SelectSearch from "@/components/Select/SelectSearch.vue";
import NoDataShowing from "@/components/NoDataShowing.vue";
import {
  AddEmpWarningAPI,
  GetEmpWarningAPI,
  EditEmpWarningAPI,
  DeleteEmpWarningAPI,
} from "@/actions/emp-warning";
import { useToast } from "vue-toastification";

import { GetAllEmployementAPI } from "@/actions/employment";
import Calender from "@/components/Calendar";
export default {
  name: "EmploymentWarningPage",
  components: {
    LayoutAdmin,
    Button,
    Loading,
    Modal,
    Input,
    Select,
    ChoiseCompany,
    SelectSearch,
    Dropdown,
    NoDataShowing,
    Calender,
  },
  data() {
    return {
      modal: {
        showModal: false,
        showDropdown: false,
      },
      modeEdit: false,
      empWarning: [],
      warning_filter: [],
      selectedStatus: "",
      activeDropdown: "",

      data: {
        emp_id: "",
        empwarning_subject: "",
        empwarning_type: "",
        empwarning_date: "",
        empwarning_status: "",
        empwarning_desc: "",
      },
      employment: [],
      optionsCompany: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getCompany: true,
        addStatus: false,
        getStatus: true,
      },
      filter: {
        date: "",
        status: "",
        employment: "",
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
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    handleFilter(date, employment, status) {
      const newWarning = this.empWarning.map((warning) => ({
        ...warning,
        employment: warning?.emp_id?._id,
      }));
      const filterConditions = [
        { key: "empwarning_date", value: date },
        { key: "employment", value: employment },
        { key: "empwarning_status", value: status },
      ];
      const dataFilter = (overtime) =>
        filterConditions.every(
          ({ key, value }) => value == "" || overtime[key] == value
        );
      this.warning_filter = newWarning.filter(dataFilter);
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
    async handleAddEmpWarning() {
      this.loading.addStatus = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const payload = {
        ...this.data,
        emp_id: this.data?.emp_id?._id,
      };
      const response = await AddEmpWarningAPI(queryAdminSuper, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.modal.showModal = false;
        this.getEmpWarning();
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loading.addStatus = false;
    },
    async getEmpWarning() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetEmpWarningAPI(queryAdminSuper);

      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.empWarning = response?.data;
      this.handleFilter(
        this.filter.date,
        this.filter.employment,
        this.filter.status
      );
      this.loading.getStatus = false;
    },
    detailEmpWarning(warning) {
      this.modeEdit = true;
      this.modal.showModal = true;
      this.data.empwarning_subject = warning?.empwarning_subject;
      this.data.empwarning_type = warning?.empwarning_type;
      this.data.empwarning_date = warning?.empwarning_date;
      this.data.empwarning_status = warning?.empwarning_status;
      this.data.empwarning_desc = warning?.empwarning_desc;
      this.data._id = warning?._id;
    },
    async handleEditEmpWarning() {
      this.loading.addStatus = true;
      const payload = {
        ...this.data,
      };
      const response = await EditEmpWarningAPI(this.data?._id, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.modal.showModal = false;
        this.getEmpWarning();
        this.clearInputValue();
        this.modeEdit = false;
      }
      this.showMessageStatus(response);
      this.loading.addStatus = false;
    },
    async deleteEmpWarning(id) {
      this.loading.addStatus = true;
      const response = await DeleteEmpWarningAPI(id);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.modal.showModal = false;
        this.getEmpWarning();
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
  watch: {
    dataCompany: {
      handler: function () {
        this.getEmpWarning();
        this.handleGetEmployement();
      },
      deep: true,
    },
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
.preview-badge {
  min-width: 35px;
  min-height: 25px;
  width: max-content;
  padding: 5px 20px;
  color: white;
}
</style>
