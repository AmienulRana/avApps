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
          <tr>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">1</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">Tunjangan Kendaraan</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400 text-center">300.000</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-green-400">Fix</p>
            </td>
            <td class="p-3 flex justify-center">
              <SwitchButton
                @update:model="(value) => (isActive = value)"
                :value="isActive"
              />
            </td>
            <td class="p-3 text-center text-gray-400">
              <font-awesome-icon
                icon="fa-solid fa-pencil"
                @click="modeEdit = !modeEdit"
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
      <Input label="Tunjangan" input_class="md:w-4/6 mt-2" class="mb-2.5" />
      <Input
        type="number"
        label="Jumlah"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
      />
      <SelectSearch
        :isOpen="select_search.isOpen"
        label="Type"
        :options="['Proposional', 'Fix']"
        input_class="md:w-4/6 mt-2"
        position="top"
        @handleShowSelect="select_search.isOpen = !select_search.isOpen"
      />

      <div class="flex justify-end w-full my-4">
        <Button class="bg-primary text-white w-24 text-sm rounded py-2">
          Tambah
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
      isActive: false,
    };
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
