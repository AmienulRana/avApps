<template>
  <section class="px-4">
    <section class="mt-4" v-if="tab_active === 'cuti'">
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
    <section class="mt-4" v-if="tab_active === 'off'">
      <h1 class="text-xl text-gray-400">Off day setting</h1>
      <div class="flex items-center">
        <section class="w-1/2 mt-4">
          <h2 class="text-md text-gray-400 mb-3">Days</h2>
          <div
            class="flex w-full justify-between items-center mb-5"
            v-for="(data, i) in offDayData"
            :key="i"
          >
            <p class="text-gray-40">{{ data.name }}</p>
            <SwitchButton
              @update:model="(value) => (data.isActive = value)"
              :value="data.isActive"
            />
          </div>
        </section>
      </div>
      <div class="flex justify-end w-full mb-4">
        <Button class="bg-primary text-white w-24 text-sm rounded py-2">
          Save
        </Button>
      </div>
    </section>
  </section>
</template> 

<script>
import Input from "./Input.vue";
import SwitchButton from "./SwitchButton.vue";

export default {
  name: "PersonalDetail",
  props: { tab_active: String },
  components: { Input, SwitchButton },
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

<style scoped>
</style>