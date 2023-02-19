<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hidden mb-20">
      <section class="flex justify-between items-center mb-8">
        <div class="flex items-center">
          <h1 class="text-2xl">Setting Location</h1>
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
            Add Location</Button
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
                  <th class="text-left text-sm">Name</th>
                  <th class="text-left text-sm">Longtitude</th>
                  <th class="text-left text-sm">Latitude</th>
                  <th class="text-left text-sm">Radius</th>
                  <th class="text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody v-if="!loading.get">
                <tr
                  class="border-b h-max"
                  v-for="(location, i) in locations"
                  :key="i"
                >
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ i + 1 }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">
                      {{ location?.company_id?.company_name }}
                    </p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ location?.loc_name }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ location?.loc_long || "-" }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ location?.loc_lat || "-" }}</p>
                  </td>
                  <td class="p-3 text-sm">
                    <p class="text-sm">{{ location?.loc_radius || "-" }}</p>
                  </td>

                  <td class="p-3 text-right relative flex">
                    <Button
                      class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                      @click="handleDetailLocation(location)"
                    >
                      <font-awesome-icon
                        icon="fa-pen-to-square"
                        class="text-primary"
                      />
                    </Button>
                    <Button
                      class="p-3 shadow-none hover:bg-red-100 text-red-500 rounded-full"
                      @click="handleDeleteLocation(location?._id)"
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
            <NoDataShowing v-if="!loading.get && locations.length === 0" />
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
      <Input
        label="Location Name"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        :value="data.loc_name"
        @change="data.loc_name = $event"
      />
      <Input
        type="number"
        label="Location Latitude"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        :value="data.loc_lat"
        @change="data.loc_lat = $event"
      />
      <Input
        type="number"
        label="Location Longtitude"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        :value="data.loc_long"
        @change="data.loc_long = $event"
      />
      <Input
        type="number"
        label="Location Radius"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        :value="data.loc_radius"
        @change="data.loc_radius = $event"
      />
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleAddLocation"
          :disabled="loadingData"
          v-if="!modeEdit"
        >
          Save
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditLocation"
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
import Loading from "../../components/Loading.vue";
import NoDataShowing from "../../components/NoDataShowing.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import {
  AddLocationAPI,
  GetLocationAPI,
  EditLocationAPI,
  DeleteLocationAPI,
} from "@/actions/location";
import { useToast } from "vue-toastification";

export default {
  name: "PeriodicPage",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Input,
    ChoiseCompany,
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
      id_location: "",
      data: {
        loc_name: "",
        loc_lat: 0,
        loc_long: 0,
        loc_radius: 0,
      },
      locations: [],
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
    // async updateStatus(value, periodic) {
    //   periodic.periodic_status = value;
    //   const response = await ChangeStatusPeriodicAPI(periodic?._id);
    //   if (response?.status === 401) {
    //     this.$router.push("/login");
    //     this.$store.commit("changeIsLoggedIn", false);
    //   }
    //   if (response.status === 200) {
    //     this.handleGetLocation();
    //   }
    // },
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
    async handleAddLocation() {
      this.loadingData = true;
      const data = {
        ...this.data,
      };

      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;
      const response = await AddLocationAPI(data, querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetLocation();
        this.clearInputValue();
        this.modal.showModal = false;
      }
      this.showMessageStatus(response);
      this.loadingData = false;
    },
    async handleGetLocation() {
      this.loading.get = false;
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;

      const response = await GetLocationAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.locations = response?.data;
      this.loading.get = false;
    },
    handleDetailLocation(location) {
      this.modeEdit = true;
      this.modal.showModal = true;
      this.id_location = location?._id;
      this.data.loc_name = location?.loc_name;
      this.data.loc_lat = location?.loc_lat;
      this.data.loc_long = location?.loc_long;
      this.data.loc_radius = location?.loc_radius;
    },
    async handleEditLocation() {
      this.loadingData = true;
      const id = this.id_location;
      const data = {
        ...this.data,
      };
      const response = await EditLocationAPI(id, data);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.handleGetLocation();
        this.clearInputValue();
        this.modeEdit = false;
        this.modal.showModal = false;
      }
      this.showMessageStatus(response);
      this.loadingData = false;
    },
    async handleDeleteLocation(id) {
      const response = await DeleteLocationAPI(id);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.handleGetLocation();
      }
      this.showMessageStatus(response);
    },
  },
  watch: {
    dataCompany: {
      handler() {
        this.handleGetLocation();
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
