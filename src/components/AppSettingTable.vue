<template>
  <section class="bg-white shadow-md wrapper">
    <section
      class="flex justify-between items-center flex-wrap px-10 pt-6 pb-2"
    >
      <h1 class="md:text-xl text-lg">Company</h1>
      <Button
        class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2 md:mt-0"
        @click="showModal = 'Add'"
        >Add Company Setting</Button
      >
    </section>
    <section class="w-full overflow-x-auto custom-scrollbar bg-white relative">
      <table class="bg-white min-w-max mt-6 w-full">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm">No.</th>
            <th class="text-left text-sm">Company Name</th>
            <th class="text-left text-sm">Company Group</th>
            <th class="text-left text-sm">Company Header</th>
            <th class="text-left text-sm">Company Zone</th>
            <th class="text-left text-sm">Company Longtitude</th>
            <th class="text-left text-sm">Company Latitude</th>
            <th class="text-left text-sm">Status</th>
            <th class="text-left text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b h-max" v-for="(company, i) in companys" :key="i">
            <td class="p-3 text-sm">
              <p class="text-sm">{{ i + 1 }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ company?.company_name || "-" }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ company?.company_group || "-" }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ company?.company_header || "-" }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ company?.company_zone || "-" }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ company?.company_longtitude || "-" }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ company?.company_latitude || "-" }}</p>
            </td>
            <td class="p-3 text-sm">
              <SwitchButton
                class="w-max"
                @update:model="(value) => updateStatus(value, company)"
                :value="company?.company_status"
              />
            </td>
            <td class="p-3 text-right relative flex">
              <Button
                class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                @click="detailCompany(company)"
              >
                <font-awesome-icon icon="fa-pen-to-square" />
              </Button>
              <Button
                class="p-3 shadow-none hover:bg-red-100 text-red-500 rounded-full"
                @click="
                  showModal = 'Delete';
                  data.company_id = company?._id;
                  data.company_name = company?.company_name;
                "
              >
                <font-awesome-icon icon="fa-trash-alt" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <Loading v-if="loading.get" />
      <NoDataShowing v-if="companys.length === 0 && !loading.get" />
    </section>
    <Modal
      :title="`${modeEdit ? 'Edit' : 'Add'}  Company`"
      modalClass="md:w-1/2"
      :showModal="showModal === 'Add' || showModal === 'Edit'"
      @close="
        showModal = false;
        modeEdit = false;
        showModal = false;
        clearInputValue();
      "
    >
      <!-- <template #header>
        <ChoiseCompany
          v-if="superAdmin"
          @selected:company="dataCompany = $event"
          :options="options"
          :dataCompany="dataCompany"
        />
      </template> -->
      <section class="text-center mb-6">
        <ul class="flex">
          <li
            class="cursor-pointer text-sm px-4 mb-4 truncate w-full"
            v-for="(title, i) in titleTabs"
            :class="tabActive === title ? 'text-primary' : 'text-gray-400'"
            @click="tabActive = title"
            :key="i"
          >
            {{ title }}
          </li>
        </ul>
      </section>
      <KeepAlive>
        <section v-if="tabActive === 'Company'">
          <Input
            label="Name Company"
            class="flex-col mt-4"
            label_class="w-full"
            input_class="mt-2"
            @change="data.company_name = $event"
            :value="data?.company_name"
          />
          <Select
            class="flex-col mt-4"
            input_class="w-full mt-2"
            label_class="w-full"
            label="Company Group"
            :options="['Mufidah Group']"
            @change="data.company_group = $event"
            :value="data?.company_group"
          />
          <Input
            label="Company Header"
            class="flex-col mt-4"
            label_class="w-full"
            input_class="mt-2"
            @change="data.company_header = $event"
            :value="data?.company_header"
          />
        </section>
      </KeepAlive>
      <KeepAlive>
        <section v-if="tabActive === 'Date & Time Setting'">
          <Select
            class="flex-col mt-4"
            input_class="w-full mt-2"
            label_class="w-full"
            label="Zona Waktu"
            :options="['WIB', 'WITA', 'WIT']"
            @change="data.company_zone = $event"
            :value="data.company_zone"
          />
        </section>
      </KeepAlive>
      <KeepAlive>
        <section v-if="tabActive === 'Map Location'">
          <Input
            label="Longtitude Location"
            class="flex-col mt-4"
            label_class="w-full"
            input_class="mt-2"
            @change="data.company_longtitude = $event"
            :value="data?.company_longtitude"
          />
          <Input
            label="Latitude Location"
            class="flex-col mt-4"
            label_class="w-full"
            input_class="mt-2"
            @change="data.company_latitude = $event"
            :value="data?.company_latitude"
          />
        </section>
      </KeepAlive>
      <template #footer>
        <section class="flex w-52 justify-between">
          <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
            Cancel
          </Button>
          <Button
            class="bg-green-500 w-24 py-2 text-white rounded-md"
            @click="handleAddCompany"
            :disabled="loadingData"
            v-if="!modeEdit"
          >
            Save
          </Button>
          <Button
            class="bg-green-500 w-24 py-2 text-white rounded-md"
            @click="handleEditCompany"
            :disabled="loadingData"
            v-else
          >
            Edit
          </Button>
        </section>
      </template>
    </Modal>
    <Modal
      modalClass="md:w-1/2 md:h-96"
      :showModal="showModal === 'Delete'"
      @close="showModal = false"
    >
      <section class="text-center mb-6">
        <img
          src="@/assets/icons/warning.svg"
          alt="warning-icon"
          class="block m-auto"
        />
        <h1 class="text-xl">
          Are You Sure to deleted Company
          <span class="text-red-500 font-bold">"{{ data.company_name }}"</span
          >???
        </h1>
        <p class="text-gray-400 mt-3">
          If you delete this company all data related to this company will also
          be deleted
        </p>
        <section class="flex w-full justify-center mt-4">
          <Button
            class="bg-gray-400 w-24 py-2 mr-4 text-white rounded-md"
            @click="showModal = ''"
          >
            Cancel
          </Button>
          <Button
            class="bg-red-500 w-24 py-2 text-white rounded-md"
            @click="handleDeleteCompany"
            :disabled="loadingData"
          >
            Yes, Sure
          </Button>
        </section>
      </section>
    </Modal>
  </section>
</template>

<script>
import Button from "./Button.vue";
import SwitchButton from "./SwitchButton.vue";
import Modal from "./Modal.vue";
import Input from "./Input.vue";
import Select from "./Select/index.vue";
import {
  GetAllCompanyAPI,
  AddCompanyAPI,
  DeleteCompanyAPI,
  EditCompanyAPI,
} from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
// import ChoiseCompany from "@/components/ChoiseCompany.vue";

import { useToast } from "vue-toastification";
import NoDataShowing from "./NoDataShowing.vue";
import Loading from "./Loading.vue";

export default {
  components: {
    Button,
    SwitchButton,
    Loading,
    Modal,
    Input,
    // ChoiseCompany,
    Select,
    NoDataShowing,
  },
  name: "LeaveTypeSetting",
  data() {
    return {
      showModal: false,
      superAdmin: false,
      modeEdit: false,
      options: [],
      titleTabs: ["Company", "Date & Time Setting", "Map Location"],
      tabActive: "Company",
      dataCompany: {},
      loadingData: false,
      companys: [],
      data: {
        company_name: "",
        company_group: "",
        company_latitude: "",
        company_longtitude: "",
        company_zone: "",
        company_id: "",
        company_header: "",
      },
      loading: {
        company: true,
        get: true,
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
    },
    async getAllCompany() {
      this.loading.get = true;
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.company = false;
      this.companys = response?.data;
      this.loading.get = false;
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
    async handleAddCompany() {
      this.loadingData = true;
      const payload = {
        ...this.data,
        company_longtitude: Number(this.data.company_longtitude),
        company_latitude: Number(this.data.company_latitude),
      };
      const response = await AddCompanyAPI(payload);
      if (response?.status == 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.clearInputValue();
        this.showModal = false;
        this.tabActive = "Company";
        this.getAllCompany();
      }
      this.showMessageStatus(response);
      this.loadingData = false;
    },
    async handleDeleteCompany() {
      const response = await DeleteCompanyAPI(this.data.company_id);
      if (response.status == 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.showModal = "";
        this.clearInputValue();
        this.getAllCompany();
      }
      this.showMessageStatus(response);
    },
    async handleEditCompany() {
      this.loadingData = true;
      const payload = {
        ...this.data,
        company_longtitude: Number(this.data.company_longtitude),
        company_latitude: Number(this.data.company_latitude),
      };
      const response = await EditCompanyAPI(this.data.company_id, payload);
      if (response?.status == 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.showModal = false;
        this.modeEdit = false;
        this.clearInputValue();
        this.getAllCompany();
        this.tabActive = "Company";
      }
      this.showMessageStatus(response);
      this.loadingData = false;
    },
    detailCompany(company) {
      this.modeEdit = true;
      this.showModal = "Edit";
      this.data.company_name = company?.company_name;
      this.data.company_group = company?.company_group;
      this.data.company_zone = company?.company_zone;
      this.data.company_header = company?.company_header;
      this.data.company_latitude = company?.company_latitude;
      this.data.company_longtitude = company?.company_longtitude;
      this.data.company_id = company?._id;
    },
  },
  watch: {
    dataCompany: {
      handler() {},
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
  },
};
</script>

<style scoped>
.wrapper {
}

.custom-scrollbar {
  min-height: 396px !important;
  max-width: 100%;
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
