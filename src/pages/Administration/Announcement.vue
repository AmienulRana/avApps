<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <section class="flex items-center">
          <h1 class="text-2xl">Announcements</h1>
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
            Add Announcement</Button
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
                <th class="text-left text-sm">Title</th>
                <th class="text-left text-sm">Departement</th>
                <th class="text-left text-sm">Start date</th>
                <th class="text-left text-sm">End date</th>
                <th class="text-left text-sm">Description</th>
                <th class="text-left text-sm">Created By</th>
                <th class="text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="border-b h-max"
                v-for="(data, i) in announcements"
                :key="i"
              >
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.announcement_title }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p
                    class="text-sm"
                    v-if="
                      departement?.length === data?.announcement_depid?.length
                    "
                  >
                    Semua
                  </p>
                  <template v-else>
                    <p
                      v-for="(departement, i) in data?.announcement_depid"
                      :key="i"
                    >
                      {{ departement?.dep_name }}
                    </p>
                  </template>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.announcement_startdate }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.announcement_enddate }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">{{ data?.announcement_desc }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">
                    {{ formatDate(data?.announcement_created) }}
                  </p>
                </td>
                <td class="p-3 text-right relative flex">
                  <Button
                    class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                    @click="handleDetailAnnouncment(data)"
                  >
                    <font-awesome-icon icon="fa-pen-to-square" />
                  </Button>
                  <Button
                    class="p-3 shadow-none hover:bg-red-100 text-red-500 rounded-full"
                    @click="handleDeleteAnnouncement(data?._id)"
                  >
                    <font-awesome-icon icon="fa-trash-alt" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
          <NoDataShowing
            v-if="!loading.getLeaveHol && announcements?.length === 0"
          />
          <Loading v-if="loading.getLeaveHol" />
        </section>
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    :title="`${!modeEdit ? 'Add' : 'Edit'} Announcement`"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
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
      <Input
        type="text"
        label="Title"
        class="flex-col"
        label_class="w-full"
        input_class="mt-2"
        @change="data.announcement_title = $event"
        :value="data?.announcement_title"
      />
      <section class="grid grid-cols-2 gap-4">
        <Input
          type="date"
          class="flex-col"
          label="Tanggal Mulai"
          label_class="w-full"
          input_class="mt-2"
          @change="data.announcement_startdate = $event"
          :value="data?.announcement_startdate"
        />
        <Input
          type="date"
          class="flex-col"
          label="Tanggal Selesai"
          label_class="w-full"
          input_class="mt-2"
          @change="data.announcement_enddate = $event"
          :value="data?.announcement_enddate"
        />
      </section>

      <div class="mt-6">
        <p class="w-1/3 text-sm">Departement</p>
        <p class="text-xs text-gray-400 italic">
          You can set the announcement only for the specific departments by
          adding them
        </p>
        <section class="mt-2 mb-4">
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
        <label class="text-sm">Description</label>
        <textarea
          rows="4"
          class="w-full mt-2 border outline-primary py-4"
          v-model="data.announcement_desc"
        >
        </textarea>
      </div>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleAddAnnouncement"
          v-if="!modeEdit"
          :disabled="loading.addLeaveHol"
        >
          Save
        </Button>
        <Button
          v-else
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditAnnouncement"
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
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import { GetDepartementAPI } from "@/actions/departement";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import {
  AddAnnouncementAPI,
  GetAnnouncementAPI,
  EditAnnouncementAPI,
  DeleteAnnouncementAPI,
} from "@/actions/announcement";
import { useToast } from "vue-toastification";
import Loading from "@/components/Loading.vue";
import NoDataShowing from "@/components/NoDataShowing.vue";

export default {
  name: "AnnouncementPage",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Input,
    Loading,
    NoDataShowing,
    ChoiseCompany,
  },
  data() {
    return {
      modal: {
        showModal: false,
        showDropdown: false,
      },
      modeEdit: false,
      query: "",
      departement: [],
      searchDepartement: [],
      departementSelected: [],
      announcements: [],
      announcement_id: "",
      data: {
        announcement_startdate: "",
        announcement_enddate: "",
        announcement_title: "",
        announcement_desc: "",
        announcement_depid: [],
      },
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
    handleDetailAnnouncment(announcement) {
      this.modeEdit = true;
      this.modal.showModal = true;
      this.departementSelected = announcement?.announcement_depid;
      this.announcement_id = announcement?._id;
      this.data = { ...announcement };
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
    formatDate(date) {
      const newDate = new Date(date);
      return newDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
      this.departementSelected = [];
    },
    async handleAddAnnouncement() {
      this.loading.addLeaveHol = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const payload = {
        ...this.data,
      };
      const response = await AddAnnouncementAPI(queryAdminSuper, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.clearInputValue();
        this.getAnnouncement();
      }
      this.showMessageStatus(response);
      this.loading.addLeaveHol = false;
    },

    async handleDeleteAnnouncement(id) {
      const response = await DeleteAnnouncementAPI(id);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.getAnnouncement();
      }
      this.showMessageStatus(response);
    },
    async handleEditAnnouncement() {
      this.loading.addLeaveHol = true;
      const payload = {
        ...this.data,
        announcement_depid: this.departementSelected,
      };
      const response = await EditAnnouncementAPI(
        this?.announcement_id,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.modal.showModal = false;
        this.clearInputValue();
        this.getAnnouncement();
      }
      this.showMessageStatus(response);
      this.loading.addLeaveHol = false;
    },
    async getAnnouncement() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetAnnouncementAPI(queryAdminSuper);

      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      console.log(response.data);
      this.announcements = response.data;
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
      this.data.announcement_depid = this.departementSelected.map(
        (dep) => dep._id
      );
      this.searchDepartement = [];
      this.departement = [];
    },
    removeSelectedDepartement(dep) {
      this.data.announcement_depid = this.data.announcement_depid.filter(
        (id) => id !== dep._id
      );
      this.departementSelected = this.departementSelected.filter(
        (id) => id?._id !== dep._id
      );
      this.departement.push(dep);
      this.searchDepartement.push(dep);
    },
    handleSelectedDepartement(dep) {
      this.data.announcement_depid.push(dep?._id);
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
        this.getAnnouncement();
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
