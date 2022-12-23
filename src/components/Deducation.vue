<template>
  <section class="px-4 w-full">
    <section
      class="bg-gray-100 mt-2 rounded-md px-4 py-1 flex justify-center relative"
    >
      <button
        class="w-1/2 h-full py-2 z-10 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '1')"
        :class="tab_active === '1' ? 'text-white' : ''"
        ref="first_tab"
      >
        Deducation
      </button>
      <button
        class="w-1/2 z-10 h-full py-2 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '2')"
        :class="tab_active === '2' ? 'text-white' : ''"
      >
        Allowance
      </button>
      <span
        class="
          absolute
          top-1/2
          -translate-y-1/2
          duration-300
          rounded-md
          w-1/2
          bg-primary
        "
        :style="`left:${indicator_position.left}px; height:${indicator_position.height}px;`"
      />
    </section>
    <section v-if="tab_active === '1'">
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
        <Input label="Detail Potongan" input_class="w-4/6" class="mb-2.5" />
        <p class="text-gray-400 text-md">Potongan tanggungan :</p>
        <div class="px-6">
          <Input
            type="number"
            label="Pribadi"
            input_class="w-4/6"
            class="mb-2.5"
          />
          <Input
            type="number"
            label="Perusahaan"
            input_class="w-4/6"
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
    <Allowance v-if="tab_active === '2'" />
  </section>
</template> 

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";
import SwitchButton from "./SwitchButton.vue";
import Allowance from "./Allowance.vue";

export default {
  name: "DeducationComponent",
  components: { Input, Button, SwitchButton, Allowance },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
      },
      isActive: false,
      modeEdit: false,
      tab_active: "1",
    };
  },
  methods: {
    handleChangeTab(event, tab) {
      const buttonHeight = event.target.offsetHeight;
      const buttonPosition = event.target.offsetLeft;
      this.indicator_position.left = buttonPosition;
      this.indicator_position.height = buttonHeight;
      this.tab_active = tab;
    },
  },
  mounted() {
    const buttonHeight = this.$refs.first_tab?.offsetHeight;
    const buttonPosition = this.$refs.first_tab?.offsetLeft;
    this.indicator_position.left = buttonPosition;
    this.indicator_position.height = buttonHeight;
  },
};
</script>

<style scoped>
</style>