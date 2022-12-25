<template>
  <section class="px-4 w-full">
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
          <tr>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">1</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">BPJS Kesehatan</p>
            </td>
            <td class="p-3 text-sm">
              <div class="flex justify-between">
                <p class="text-sm text-gray-400 ml-6">2</p>
                <p class="text-sm text-gray-400">3</p>
                <p class="text-sm text-gray-400 mr-5">5</p>
              </div>
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
        <span v-if="!modeEdit">Tambah</span>
        Deducation
      </h1>
      <Input
        label="Detail Potongan"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
      />
      <p class="text-gray-400 text-md">Potongan tanggungan :</p>
      <div class="md:px-6 px-3">
        <Input
          type="number"
          label="Pribadi"
          input_class="md:w-4/6 mt-2"
          class="mb-2.5"
        />
        <Input
          type="number"
          label="Perusahaan"
          input_class="md:w-4/6 mt-2"
          class="mb-2.5"
        />
      </div>
      <div class="flex justify-end w-full my-4">
        <Button class="bg-primary text-white w-24 text-sm rounded py-2">
          Save
        </Button>
      </div>
    </section>
  </section>
</template>

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";
import SwitchButton from "./SwitchButton.vue";

export default {
  name: "DeducationComponent",
  components: { Input, Button, SwitchButton },
  data() {
    return {
      isActive: false,
      modeEdit: false,
    };
  },
};
</script>

<style scoped></style>
