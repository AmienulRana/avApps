<template>
  <section class="px-4">
    <section class="mt-4">
      <div class="m-6 shadow-lg w-1/2 p-4">
        <h1 class="text-2xl">1</h1>
        <p class="text-gray-400">Cuti tersisa</p>
        <p class="text-gray-400">Leave periodic</p>
      </div>
      <Input
        label="Mendapatkan Jatah Cuti Setiap:"
        input_class="w-1/2"
        class="mb-2.5"
      />
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

export default {
  name: "PersonalDetail",
  props: { tab_active: String },
  components: { Input },
  data() {
    return {
      offDayData: [
        { name: "Minggu", isActive: false },
        { name: "Senin", isActive: false },
        { name: "Selasa", isActive: false },
        { name: "Rabu", isActive: false },
        { name: "Kamis", isActive: false },
        { name: "Jum'at", isActive: false },
        { name: "Sabtu", isActive: false },
      ],
    };
  },
};
</script>

<style scoped></style>
