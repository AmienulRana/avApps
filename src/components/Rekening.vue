<template>
  <section class="w-full custom-scrollbar overflow-x-auto">
    <table class="min-w-max bg-white w-full mt-6">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm p-3">Nama Rekening</th>
          <th class="text-left text-sm p-3">No. Rekening</th>
          <th class="text-left text-sm p-3">Nama Bank</th>
          <th class="text-left text-sm p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bank in banks" :key="bank?._id">
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              {{ bank?.bi_holder_name }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              {{ bank?.bi_account_number }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              {{ bank?.bi_bank_name }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <button class="mr-3" @click="handleDeleteBank(bank?._id)">
              <font-awesome-icon icon="fa-trash-alt" class="text-red-500" />
            </button>
            <button @click="handleDetailBank(bank)">
              <font-awesome-icon icon="fa-pen-to-square" class="text-primary" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <section class="mt-8 px-4">
    <Input
      label="Nama Rekening"
      input_class="md:w-4/6 mt-2"
      class="mb-2.5"
      @change="data.bi_holder_name = $event"
      :value="data.bi_holder_name"
    />
    <Input
      label="No. Rekening"
      input_class="md:w-4/6 mt-2"
      class="mb-2.5"
      @change="data.bi_account_number = $event"
      :value="data.bi_account_number"
    />
    <Input
      label="Nama Bank"
      input_class="md:w-4/6 mt-2"
      class="mb-2.5"
      @change="data.bi_bank_name = $event"
      :value="data.bi_bank_name"
    />
    <div class="flex justify-end w-full">
      <Button
        class="bg-primary text-white w-24 text-sm rounded py-2"
        @click="handleAddBank"
        v-if="!edit"
      >
        Save
      </Button>
      <Button
        class="bg-primary text-white w-24 text-sm rounded py-2"
        @click="handleEditBank"
        v-else
      >
        Edit
      </Button>
    </div>
  </section>
</template>

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";
import {
  AddBankAPI,
  GetBankAPI,
  EditBankAPI,
  DeleteBankAPI,
} from "@/actions/bank";

export default {
  name: "BankComponent",
  components: { Input, Button },
  data() {
    return {
      edit: false,
      data: {
        emp_id: "",
        bi_holder_name: "",
        bi_bank_name: "",
        bi_account_number: "",
      },
      banks: [],
    };
  },
  methods: {
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
    },
    async handleAddBank() {
      const data = {
        emp_id: this.$route.params.id,
        bi_holder_name: this.data?.bi_holder_name,
        bi_bank_name: this.data?.bi_bank_name,
        bi_account_number: this.data?.bi_account_number,
      };
      const response = await AddBankAPI(data);
      if (response?.status === 401) {
        return (window.location.href = "/login");
      }
      if (response?.status === 200) {
        this.handleGetBank();
        this.clearInputValue();
      }
    },
    async handleGetBank() {
      const { id } = this.$route.params;
      const response = await GetBankAPI(id);
      if (response.status === 401) {
        return (window.location.href = "/login");
      }
      this.banks = response?.data;
    },
    handleDetailBank(bank) {
      this.edit = true;
      this.data.emp_id = bank?._id;
      this.data.bi_holder_name = bank?.bi_holder_name;
      this.data.bi_bank_name = bank?.bi_bank_name;
      this.data.bi_account_number = bank?.bi_account_number;
    },
    async handleEditBank() {
      const id = this.data.emp_id;
      const data = {
        ...this.data,
      };
      const response = await EditBankAPI(id, data);
      if (response.status === 401) {
        return (window.location.href = "/");
      }
      if (response.status === 200) {
        this.handleGetBank();
        this.clearInputValue();
        this.edit = false;
      }
    },
    async handleDeleteBank(id) {
      const response = await DeleteBankAPI(id);
      if (response.status === 401) {
        return (window.location.href = "/");
      }
      if (response.status === 200) {
        this.handleGetBank();
      }
    },
  },
  mounted() {
    this.handleGetBank();
  },
};
</script>

<style scoped></style>
