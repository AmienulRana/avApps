<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center">
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
          class="bg-primary text-white px-6 py-2 text-sm rounded-md"
          @click="showModal = true"
          >Add Designation</Button
        >
      </section>
      <section class="flex mt-6 flex-wrap w-10/12"></section>
      <section class="">
        <section class="overflow-x-auto custom-scrollbar w-full">
          <table class="table-auto bg-white w-full mt-6 min-w-max">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm p-3">Name</th>
                <th class="text-left text-sm p-3">Description</th>
                <th class="text-left text-sm p-3">No. Of Employees</th>
                <th class="text-left text-sm p-3">Actions</th>
              </tr>
            </thead>
            <tbody v-if="!loading.designation">
              <tr v-for="(des, index) in designations" :key="index">
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
                  <button class="mr-3">
                    <font-awesome-icon icon="fa-trash-alt" />
                  </button>
                  <button @click="handleDetailDesignation(des?._id)">
                    <font-awesome-icon icon="fa-pen-to-square" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            class="flex justify-center mt-14 w-full"
            v-if="loading.designation"
          >
            <Loading />
          </div>
        </section>
      </section>
    </section>
    <Modal
      title="Add Designation"
      class="md:w-9/12 w-full mx-auto h-max"
      :showModal="showModal"
      @close="showModal = false"
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
import { GetDesignationAPI, AddDesignationAPI } from "@/actions/designation";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "EmployeeIndex",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Loading,
    ChoiseCompany,
    Input,
  },
  data() {
    return {
      showModal: false,
      modalEdit: false,
      name: "",
      description: "",
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
  methods: {
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.designation = false;
    },
    async handleGetDesignation() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDesignationAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        return (window.location.href = "/login");
      }
      this.designations = response.data;
      this.loading.designation = false;
    },
    async handleAddDesignation() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const data = {
        dep_name: this.name,
        dep_desc: this.description,
      };
      const response = await AddDesignationAPI(data, querySuperAdmin);
      if (response.status === 200) {
        this.handleGetDesignation();
        this.showModal = false;
      }
    },
    handleDetailDesignation() {
      // this.showModal = true;
      // this.id = id;
      // this.modalEdit = true;
      // const findDesignation = this.designations.filter(
      //   (des) => des.id === id
      // )[0];
      // this.name = findDesignation.name;
      // this.description = findDesignation.description;
    },
    handleEditDesignation() {},
    handleDeleteDesignation() {},
  },
  mounted() {
    // const departement
    this.handleGetDesignation();
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetDesignation();
      },
      deep: true,
    },
  },
};
</script>

<style scoped></style>
