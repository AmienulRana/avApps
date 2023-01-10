<template>
  <section class="px-4 w-full" @click="select_search.isOpen = false">
    <div class="overflow-x-auto custom-scrollbar">
      <table class="table-auto bg-white w-full mt-6 min-w-max">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm p-3">No.</th>
            <th class="text-left text-sm p-3">Detail Potongan</th>
            <th class="text-sm p-3">
              <p class="text-center">Potongan Tanggungan</p>
              <div class="flex justify-between mt-2">
                <p>Pribadi(%)</p>
                <p>Perusahaan(%)</p>
                <p>Total(%)</p>
              </div>
            </th>
            <th class="text-left text-sm p-3">Status Potongan</th>
            <th class="text-left text-sm p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deduction, i) in emp_deductions" :key="i">
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">{{ i + 1 }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">
                {{ deduction?.deduction_id?.ad_name }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <div class="flex justify-between">
                <p class="text-sm text-gray-400 ml-6">
                  {{ deduction?.deduction_selfpercent }}
                </p>
                <p class="text-sm text-gray-400">
                  {{ deduction?.deduction_companypercent }}
                </p>
                <p class="text-sm text-gray-400 mr-5">
                  {{ deduction?.deduction_totalpercent }}
                </p>
              </div>
            </td>
            <td class="p-3 flex justify-center">
              <SwitchButton
                @update:model="(value) => updateStatus(value, deduction)"
                :value="deduction?.deduction_status"
              />
            </td>
            <td class="p-3 text-center text-gray-400">
              <font-awesome-icon
                icon="fa-trash-alt"
                class="text-red-500 mr-3"
                @click="handleDeleteDeduction(deduction)"
              />
              <font-awesome-icon
                icon="fa-solid fa-pencil"
                class="text-primary"
                @click="handleDetailDeduction(deduction)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <section class="mt-8">
      <h1 class="text-xl mb-2">
        <span v-if="modeEdit">Edit</span>
        <span v-if="!modeEdit">Tambah</span>
        Deducation
      </h1>
      <SelectSearch
        :isOpen="select_search.isOpen"
        label="Deduction"
        :options="deductionsOptions"
        property="ad_name"
        input_class="md:w-4/6 mt-2"
        position="bottom"
        @selected="data.deduction_id = $event"
        :selectedOption="data.deduction_id"
        @handleShowSelect="select_search.isOpen = !select_search.isOpen"
      />
      <p class="text-gray-400 text-md">Potongan tanggungan :</p>
      <div class="md:px-6 px-3">
        <Input
          type="number"
          label="Pribadi"
          input_class="md:w-4/6 mt-2"
          class="mb-2.5"
          @change="data.deduction_selfpercent = $event"
          :value="data?.deduction_selfpercent"
        />
        <Input
          type="number"
          label="Perusahaan"
          input_class="md:w-4/6 mt-2"
          class="mb-2.5"
          @change="data.deduction_companypercent = $event"
          :value="data?.deduction_companypercent"
        />
      </div>
      <div class="flex justify-end w-full my-4">
        <Button
          class="bg-primary text-white w-24 text-sm rounded py-2"
          @click="handleAddDeduction"
          :disabled="loading"
          v-if="!modeEdit"
        >
          Save
        </Button>
        <Button
          class="bg-primary text-white w-24 text-sm rounded py-2"
          @click="handleEditDeduction"
          :disabled="loading"
          v-else
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
import {
  GetDeductionOptionsAPI,
  GetDeductionAPI,
  AddDeductionAPI,
  EditDeductionAPI,
  DeleteDeductionAPI,
  ChangeStatusDeductionAPI,
} from "@/actions/emp-deduction";
import { useToast } from "vue-toastification";
import SelectSearch from "./Select/SelectSearch.vue";

export default {
  name: "DeducationComponent",
  components: { Input, Button, SwitchButton, SelectSearch },
  data() {
    return {
      isActive: false,
      modeEdit: false,
      deductionsOptions: [],
      loading: false,
      select_search: {
        isOpen: false,
      },
      data: {
        deduction_id: "",
        deduction_selfpercent: 0,
        deduction_totalpercent: 0,
        deduction_companypercent: 0,
      },
      emp_deductions: [],
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
    showMessageStatus(response) {
      if (response.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    async getDeduction() {
      const { id } = this.$route.params;
      const response = await GetDeductionAPI(id);
      if (response?.status === 200) {
        this.emp_deductions = response?.data;
      }
    },
    async getDeductionOptions() {
      const { id } = this.$route.params;
      const response = await GetDeductionOptionsAPI(id);
      this.deductionsOptions = response?.data;
    },
    async handleAddDeduction() {
      this.loading = true;
      const payload = {
        ...this.data,
        deduction_id: this.data.deduction_id?._id,
        emp_id: this.$route.params.id,
      };
      const response = await AddDeductionAPI(payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.clearInputValue();
        this.getDeduction();
      }
      this.showMessageStatus(response);
      this.loading = false;
    },
    async handleDetailDeduction(deduction) {
      this.modeEdit = true;
      this.data._id = deduction?._id;
      this.data.deduction_id = deduction?.deduction_id;
      this.data.deduction_selfpercent = deduction?.deduction_selfpercent;
      this.data.deduction_companypercent = deduction?.deduction_companypercent;
    },
    async handleEditDeduction() {
      this.loading = true;
      const payload = {
        ...this.data,
        deduction_id: this.data.deduction_id?._id,
      };
      const response = await EditDeductionAPI(this.data?._id, payload);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.clearInputValue();
        this.getDeduction();
        this.modeEdit = false;
      }
      this.showMessageStatus(response);
      this.loading = false;
    },
    async handleDeleteDeduction(deduction) {
      const response = await DeleteDeductionAPI(deduction?._id);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.getDeduction();
      }
      this.showMessageStatus(response);
    },
    async updateStatus(value, deduction) {
      deduction.deduction_status = value;
      const response = await ChangeStatusDeductionAPI(deduction?._id);
      this.showMessageStatus(response);

      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
    },
  },
  mounted() {
    this.getDeduction();
    this.getDeductionOptions();
  },
};
</script>

<style scoped></style>
