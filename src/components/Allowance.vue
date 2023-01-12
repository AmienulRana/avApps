<template>
  <section @click="select_search.isOpen = false">
    <div class="overflow-x-auto custom-scrollbar">
      <table class="table-auto bg-white w-full mt-6 min-w-max">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm p-3">No.</th>
            <th class="text-left text-sm p-3">Tunjangan</th>
            <th class="text-sm p-3">Jumlah</th>
            <th class="text-left text-sm p-3">Type</th>
            <th class="text-left text-sm p-3">Status Potongan</th>
            <th class="text-left text-sm p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(allowance, i) in allowanceEmp" :key="i">
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">{{ i + 1 }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">
                {{ allowance?.empallow_allowance_id?.ad_name }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400 text-center">
                {{ formatCurrency(allowance?.empallow_allowance_amount) }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-green-400">
                {{ allowance?.empallow_allowance_type }}
              </p>
            </td>
            <td class="p-3 flex justify-center">
              <SwitchButton
                @update:model="(value) => updateStatus(value, allowance)"
                :value="allowance?.empallow_allowance_status"
              />
            </td>
            <td class="p-3 text-center text-gray-400">
              <font-awesome-icon
                icon="fa-trash-alt"
                class="text-red-500 mr-3"
                @click="handleDeleteAllowance(allowance)"
              />
              <font-awesome-icon
                icon="fa-solid fa-pencil"
                @click="handleDetailAllowance(allowance)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <section class="mt-8">
      <h1 class="text-xl mb-2">
        <span v-if="modeEdit">Edit</span>
        <span v-else-if="!modeEdit">Tambah</span>
        Allowance
      </h1>
      <SelectSearch
        :isOpen="select_search.isOpen === 'tunjangan'"
        label="Tunjangan"
        :options="allowances"
        property="ad_name"
        input_class="md:w-4/6 mt-2"
        position="bottom"
        @selected="data.empallow_allowance_id = $event"
        :selectedOption="data.empallow_allowance_id"
        @handleShowSelect="select_search.isOpen = 'tunjangan'"
      />
      <Input
        type="number"
        label="Jumlah"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        @change="data.empallow_allowance_amount = $event"
        :value="data.empallow_allowance_amount"
      />
      <SelectSearch
        :isOpen="select_search.isOpen === 'type'"
        label="Type"
        :options="['Proposional', 'Fix']"
        input_class="md:w-4/6 mt-2"
        position="top"
        @selected="data.empallow_allowance_type = $event"
        :selectedOption="data.empallow_allowance_type"
        @handleShowSelect="select_search.isOpen = 'type'"
      />

      <div class="flex justify-end w-full my-4">
        <Button
          class="bg-primary text-white w-24 text-sm rounded py-2"
          :disabled="loading && !data.empallow_allowance_id?._id"
          @click="handleAddAllowance"
          v-if="!modeEdit"
        >
          Tambah
        </Button>
        <Button
          v-else
          class="bg-primary text-white w-24 text-sm rounded py-2"
          :disabled="loading && !data.empallow_allowance_id?._id"
          @click="handleEditAllowance"
        >
          Edit
        </Button>
      </div>
    </section>
  </section>
</template>

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";
import SwitchButton from "./SwitchButton.vue";
import SelectSearch from "./Select/SelectSearch";
import {
  GetAllowanceOptionsAPI,
  GetAllowanceAPI,
  AddAllowanceAPI,
  EditAllowanceAPI,
  DeleteAllowanceAPI,
  ChangeStatusAllowanceAPI,
} from "@/actions/emp-allowance";
import { useToast } from "vue-toastification";

export default {
  name: "AllowanceComponent",
  components: { Input, Button, SwitchButton, SelectSearch },
  data() {
    return {
      select_search: {
        isOpen: false,
        label: "Type",
        position: "top",
      },
      modeEdit: false,
      isActive: false,
      allowances: [],
      allowanceEmp: [],
      loading: false,
      data: {
        _id: "",
        empallow_allowance_id: {},
        empallow_allowance_amount: "",
        empallow_allowance_type: "",
        empallow_allowance_status: false,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    formatCurrency(number) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
      return formatter.format(number);
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
    async getAllowance() {
      const { id } = this.$route.params;
      const response = await GetAllowanceAPI(id);
      this.allowanceEmp = response.data;
    },
    async getAllowanceOptions() {
      const { id } = this.$route.params;
      const response = await GetAllowanceOptionsAPI(id);
      this.allowances = response.data;
    },
    async handleAddAllowance() {
      const data = {
        ...this.data,
        empallow_allowance_id: this.data.empallow_allowance_id?._id,
        emp_id: this.$route.params.id,
      };
      const response = await AddAllowanceAPI(data);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.clearInputValue();
        this.getAllowance();
      }
      this.showMessageStatus(response);
    },
    async handleDetailAllowance(allowance) {
      this.modeEdit = true;
      this.data._id = allowance?._id;
      this.data.empallow_allowance_id = allowance?.empallow_allowance_id;
      this.data.empallow_allowance_amount =
        allowance?.empallow_allowance_amount;
      this.data.empallow_allowance_type = allowance?.empallow_allowance_type;
    },
    async handleEditAllowance() {
      const payload = {
        ...this.data,
        empallow_allowance_id: this.data.empallow_allowance_id?._id,
      };
      const response = await EditAllowanceAPI(this.data?._id, payload);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.clearInputValue();
        this.getAllowance();
        this.modeEdit = false;
      }

      this.showMessageStatus(response);
    },
    async handleDeleteAllowance(allowance) {
      const response = await DeleteAllowanceAPI(allowance?._id);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.getAllowance();
        this.modeEdit = false;
      }
      this.showMessageStatus(response);
    },
    async updateStatus(value, allowance) {
      allowance.empallow_allowance_status = value;
      const response = await ChangeStatusAllowanceAPI(allowance?._id);
      this.showMessageStatus(response);

      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      console.log(response);
    },
  },
  mounted() {
    this.getAllowance();
    this.getAllowanceOptions();
  },
};
</script>

<style scoped>
table tbody td,
table thead th {
  text-align: center;
  margin: auto;
}
</style>
