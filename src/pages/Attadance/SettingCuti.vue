<template>
  <LayoutAdmin
    @click="
      activeDropdown = false;
      showActions = '';
    "
  >
    <section class="px-8 mt-6 mb-10 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <section class="flex items-center">
          <h1 class="text-2xl">
            Setting Hari Libur Nasional <br />& Cuti Bersama
          </h1>
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
            Add Cuti/Libur</Button
          >
        </div>
      </section>
      <section class="w-full">
        <section
          class="w-full overflow-x-auto custom-scrollbar bg-white relative"
          @click="showActions = null"
        >
          <table class="bg-white min-w-max mt-6 w-full pb-4">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm">No.</th>
                <th class="text-left text-sm">Tanggal Mulai</th>
                <th class="text-left text-sm">Tanggal Selesai</th>
                <th class="text-left text-sm">Keterangan Cuti Bersama</th>
                <th class="text-left text-sm">Tipe</th>
                <th class="text-left text-sm">Potong Cuti</th>
                <th class="text-left text-sm">Berlaku</th>
                <th class="text-left text-sm">Status</th>
                <th class="text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody v-if="!loading.getLeaveHol">
              <tr
                class="border-b h-max"
                v-for="(data, i) in leaveHoliday"
                :key="i"
              >
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ i + 1 }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.leavehol_startdate }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.leavehol_enddate }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.leavehol_desc }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.leavehol_type }}</p>
                </td>
                <td class="p-3 text-sm">
                  <SwitchButton
                    class="w-max"
                    @update:model="(value) => (data.leavehol_cutleave = value)"
                    :value="data?.leavehol_cutleave"
                  />
                </td>
                <td class="p-3 text-sm">
                  <p
                    class="text-sm"
                    v-if="departement.length === data?.leavehol_depid.length"
                  >
                    Semua
                  </p>
                  <template v-else>
                    <p
                      v-for="(departement, i) in data?.leavehol_depid"
                      :key="i"
                    >
                      {{ departement?.dep_name }}
                    </p>
                  </template>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-green-500">Aktif</p>
                </td>
                <td class="p-3 text-right relative">
                  <Button
                    class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
                    @click.stop="showActions = i"
                  >
                    <font-awesome-icon icon="fa-ellipsis" />
                  </Button>
                  <div
                    class="text-left absolute top-0 right-20 rounded-md bg-white shadow-md md:w-max md:h-max"
                    v-if="showActions === i"
                  >
                    <ul>
                      <li
                        class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                        @click="assignCutiDetail(data)"
                      >
                        Edit
                      </li>
                      <li
                        class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                        @click="handleDeleteLeaveHoliday(data?._id)"
                      >
                        Delete
                      </li>
                      <li
                        class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                      >
                        Non-Aktif
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <NoDataShowing
            v-if="!loading.getLeaveHol && leaveHoliday.length === 0"
          />
          <Loading v-if="loading.getLeaveHol" />
        </section>
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    :title="`${modal.modeEdit ? 'Edit' : 'Add'} Cuti/Libur`"
    :showModal="modal.showModal"
    @close="
      modal.showModal = false;
      modal.modeEdit = false;
      clearInputValue();
    "
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
      <section class="grid grid-cols-2 gap-4">
        <Input
          type="date"
          class="flex-col mt-4"
          label="Tanggal Mulai"
          label_class="w-full"
          input_class="mt-2"
          @change="data.leavehol_startdate = $event"
          :value="data?.leavehol_startdate"
        />
        <Input
          type="date"
          class="flex-col mt-4"
          label="Tanggal Selesai"
          label_class="w-full"
          input_class="mt-2"
          @change="data.leavehol_enddate = $event"
          :value="data?.leavehol_enddate"
        />
      </section>
      <Input
        type="text"
        label="Keterangan Cuti Bersama"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        @change="data.leavehol_desc = $event"
        :value="data?.leavehol_desc"
      />
      <Select
        label="Tipe"
        label_class="w-full"
        input_class="w-full mt-2"
        class="mb-2.5 flex-col"
        :options="['Cuti Bersama', 'Libur Nasional']"
        @change="data.leavehol_type = $event"
        :value="data?.leavehol_type"
      />
      <div class="relative flex items-start mt-4">
        <div class="flex items-center h-5">
          <input
            id="potong_cuti"
            aria-describedby="comments-description"
            name="comments"
            type="checkbox"
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            @change="
              data.leavehol_cutleave = data.leavehol_cutleave ? false : true
            "
            :value="data.leavehol_cutleave"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="potong_cuti" class="font-medium text-gray-700"
            >Potong Cuti</label
          >
        </div>
      </div>
      <div class="flex mt-6 items-center">
        <p class="w-1/3 text-sm">Departement</p>
        <section class="w-1/2">
          <div
            class="bg-gray-100 px-5 py-2 rounded-md flex flex-wrap items-center"
          >
            <p
              v-for="(departement, i) in departementSelected"
              :key="i"
              class="text-gray-400 ml-2 bg-white my-1.5 text-sm min-w-max px-4 py-1 flex justify-between items-center rounded-full"
            >
              {{ departement?.dep_name }}
              <font-awesome-icon
                icon="fa-xmark"
                class="ml-3 cursor-pointer"
                @click="removeSelectedDepartement(departement)"
              />
            </p>
            <div class="relative mx-2">
              <Button
                class="rounded-full px-6 text-gray-400 py-2 duration-300 text-sm shadow-none"
                @click.stop="modal.showDropdown = !modal.showDropdown"
              >
                Add
              </Button>
              <Transition
                enter-active-class="animated fadeInDown"
                leave-active-class="animated fadeOutUp"
              >
                <section
                  class="z-10 bg-white absolute bottom-full overflow-y-auto left-0 right-auto shadow-md max-h-80 custom-scrollbar w-72 mt-2.5"
                  v-if="modal.showDropdown"
                >
                  <div
                    class="bg-white border-b pb-2.5 px-6 py-4 w-full"
                    @click.stop
                  >
                    <div class="relative">
                      <Input
                        :icon="true"
                        input_class="rounded-full"
                        @input="handleSearchData($event)"
                        :value="query"
                      />
                      <font-awesome-icon
                        icon="fa-magnifying-glass"
                        class="absolute top-1/2 -translate-y-1/2 left-3 text-primary"
                      />
                    </div>
                  </div>
                  <ul>
                    <li
                      v-for="(option, index) in searchDepartement"
                      :key="index"
                      @click.stop="handleSelectedDepartement(option)"
                      class="px-4 py-2 text-gray-400 text-sm hover:bg-primary justify-between items-center hover:text-white cursor-pointer flex"
                    >
                      {{ option?.dep_name }}
                    </li>
                  </ul>
                </section>
              </Transition>
            </div>
          </div>
          <p
            class="text-sm cursor-pointer mt-2 text-gray-400 hover:text-primary"
            @click="selectAllDepartement"
          >
            All Departement
          </p>
        </section>
      </div>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleAddLeaveHoliday"
          :disabled="loading.addLeaveHol"
          v-if="!modal.modeEdit"
        >
          Save
        </Button>
        <Button
          v-else
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditLeaveHoliday"
          :disabled="loading.addLeaveHol"
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
import Select from "@/components/Select/index.vue";
import { GetDepartementAPI } from "@/actions/departement";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import {
  AddLeaveHolidayAPI,
  GetLeaveHolidayAPI,
  EditLeaveHolidayAPI,
  DeleteLeaveHolidayAPI,
} from "@/actions/leave-holiday";
import { useToast } from "vue-toastification";

export default {
  name: "SettingCuti",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Input,
    Select,
    ChoiseCompany,
    SwitchButton,
    Loading,
    NoDataShowing,
  },
  data() {
    return {
      modal: {
        showModal: false,
        showDropdown: false,
        modeEdit: false,
      },
      query: "",
      showActions: "",
      departement: [],
      searchDepartement: [],
      departementSelected: [],
      leaveHoliday: [],
      data: {
        leavehol_startdate: "",
        leavehol_enddate: "",
        leavehol_desc: "",
        leavehol_type: "",
        leavehol_cutleave: false,
        leavehol_depid: [],
      },
      id_leavehol: "",
      optionsCompany: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getCompany: true,
        addLeaveHol: false,
        getLeaveHol: true,
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
      this.data.leavehol_startdate = "";
      this.data.leavehol_enddate = "";
      this.data.leavehol_desc = "";
      this.data.leavehol_type = "";
      this.data.leavehol_cutleave = false;
      this.data.leavehol_depid = [];
      this.departementSelected = [];
    },
    async handleAddLeaveHoliday() {
      this.loading.addLeaveHol = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await AddLeaveHolidayAPI(queryAdminSuper, this.data);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.getLeaveHoliday();
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loading.addLeaveHol = false;
    },
    assignCutiDetail(cuti) {
      this.modal.modeEdit = true;
      this.modal.showModal = true;
      this.id_leavehol = cuti?._id;
      this.data.leavehol_startdate = cuti?.leavehol_startdate;
      this.data.leavehol_enddate = cuti?.leavehol_enddate;
      this.data.leavehol_desc = cuti?.leavehol_desc;
      this.data.leavehol_depid = cuti?.leavehol_depid?.map(
        (leave) => leave?._id
      );
      cuti?.leavehol_depid?.map((dep) => this.handleSelectedDepartement(dep));
      this.data.leavehol_type = cuti?.leavehol_type;
    },
    async handleEditLeaveHoliday() {
      this.loading.addLeaveHol = true;
      const response = await EditLeaveHolidayAPI(this?.id_leavehol, this.data);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.modal.modeEdit = false;
        this.getLeaveHoliday();
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loading.addLeaveHol = false;
    },
    async handleDeleteLeaveHoliday(id) {
      const response = await DeleteLeaveHolidayAPI(id);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.getLeaveHoliday();
      }
      this.showMessageStatus(response);
    },
    async getLeaveHoliday() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetLeaveHolidayAPI(queryAdminSuper);

      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.leaveHoliday = response.data;
      this.loading.getLeaveHol = false;
      // this.toast.success("tes");
    },
    handleSearchData(value) {
      this.query = value;
      if (this.query.length >= 1) {
        const result = this.options.filter((option) =>
          option[this.property].toLowerCase().includes(this.query.toLowerCase())
        );
        this.searchDepartement = result;
      } else {
        this.searchDepartement = this.options;
      }
    },
    selectAllDepartement() {
      this.departementSelected = this.departement;
      this.data.leavehol_depid = this.departementSelected.map((dep) => dep._id);
      this.searchDepartement = [];
      this.departement = [];
    },
    removeSelectedDepartement(dep) {
      this.data.leavehol_depid = this.data.leavehol_depid.filter(
        (id) => id !== dep._id
      );
      this.departementSelected = this.departementSelected.filter(
        (departement) => departement._id !== dep._id
      );
      this.departement.push(dep);
      this.searchDepartement.push(dep);
    },
    handleSelectedDepartement(dep) {
      this.data.leavehol_depid.push(dep?._id);
      this.departementSelected.push(dep);
      this.departement = this.departement.filter(
        (departement) => departement._id !== dep?._id
      );
      this.searchDepartement = this.searchDepartement.filter(
        (departement) => departement._id !== dep?._id
      );
    },
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.searchDepartement = response.data;
      this.departement = response.data;
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
        this.handleGetDepartement();
        this.getLeaveHoliday();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getAllCompany();

    // this.handleGetEmployement();
  },
};
</script>

<style scoped></style>
