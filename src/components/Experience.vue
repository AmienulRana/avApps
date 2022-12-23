<template>
  <table class="table-auto bg-white w-full mt-6">
    <thead class="border-b bg-white border-gray-200 text-gray-400">
      <tr>
        <th class="text-left text-sm p-3">Nama Perusahaan</th>
        <th class="text-left text-sm p-3">Posisi</th>
        <th class="text-left text-sm p-3">Masa Bekerja</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="p-3 text-sm">
          <p class="text-sm text-gray-400">Nama Perusahaan</p>
        </td>
        <td class="p-3 text-sm">
          <p class="text-sm text-gray-400">Frontend Developer</p>
        </td>
        <td class="p-3 text-sm">
          <p class="text-sm text-gray-400">12 januari 2021 - 21 july 2022</p>
        </td>
      </tr>
    </tbody>
  </table>
  <section class="mt-8">
    <Input label="Nama Perusahaan" input_class="w-4/6" class="mb-2.5" />
    <Input label="Posisi" input_class="w-4/6" class="mb-2.5" />
    <Input
      type="date"
      label="Tanggal Mulai"
      input_class="w-4/6"
      class="mb-2.5"
    />
    <Input
      type="date"
      label="Tanggal Berakhir"
      input_class="w-4/6"
      class="mb-2.5"
    />
    <div class="flex justify-end w-full my-4">
      <Button class="bg-primary text-white w-24 text-sm rounded py-2">
        Save
      </Button>
    </div>
  </section>
</template> 

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";

export default {
  name: "ExperienceComponent",
  components: { Input, Button },
};
</script>

<style scoped>
</style>