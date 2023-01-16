<template>
  <section class="bg-white shadow-md wrapper">
    <section class="flex justify-between items-center flex-wrap px-10 py-6">
      <h1 class="md:text-xl text-lg">Leave Type</h1>
      <Button
        class="bg-primary text-white px-6 py-2 text-sm rounded-md mt-2 md:mt-0"
        @click="showModal = true"
        >Add Leave Type</Button
      >
    </section>
    <section>
      <table class="bg-white min-w-max mt-6 w-full">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm">No.</th>
            <th class="text-left text-sm">Name</th>
            <th class="text-left text-sm">Type</th>
            <th class="text-left text-sm">Status</th>
            <th class="text-left text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b h-max">
            <td class="p-3 text-sm">
              <p class="text-sm">1</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">Cuti Tahunan</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">Paid</p>
            </td>
            <td class="p-3 text-sm">
              <SwitchButton
                class="w-max"
                @update:model="(value) => updateStatus(value, periodic)"
                :value="periodic?.periodic_status"
              />
            </td>
            <td class="p-3 text-right relative">
              <Button
                class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
                @click.stop="showActions = 0"
              >
                <font-awesome-icon icon="fa-ellipsis" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <Modal
      title="Add Periodic"
      modalClass="md:w-1/2"
      :showModal="showModal"
      @close="showModal = false"
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
        />
        <Select
          class="flex-col mt-4"
          input_class="w-full mt-2"
          label_class="w-full"
          label="Type"
          :options="['Paid', 'Unpaid']"
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
  </section>
</template>

<script>
import Button from "./Button.vue";
import SwitchButton from "./SwitchButton.vue";
import Modal from "./Modal.vue";
import Input from "./Input.vue";
import Select from "./Select/index.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";

export default {
  components: { Button, SwitchButton, Modal, Input, ChoiseCompany, Select },
  name: "LeaveTypeSetting",
  data() {
    return {
      showModal: false,
      superAdmin: false,
      options: [],
      dataCompany: {},
      loadingData: false,
      loading: {
        company: true,
        get: true,
      },
    };
  },
  methods: {
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.company = false;
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
  min-height: 550px;
}
</style>
