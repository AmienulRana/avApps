<template>
  <section class="px-4" @click="show_select = false">
    <section
      class="bg-gray-100 mt-2 rounded-md px-4 py-1 flex justify-center relative"
    >
      <button
        class="w-1/2 h-full py-2 z-10 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '1')"
        :class="tab_active === '1' ? 'text-white' : ''"
        ref="first_tab"
      >
        Pendidikan
      </button>
      <button
        class="w-1/2 z-10 h-full py-2 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '2')"
        :class="tab_active === '2' ? 'text-white' : ''"
      >
        Pengalaman
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

    <section class="mt-4" v-if="tab_active === '1'">
      <table class="table-auto bg-white w-full mt-6">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm p-3">Gelar</th>
            <th class="text-left text-sm p-3">Nama Institusi</th>
            <th class="text-left text-sm p-3">Hasil</th>
            <th class="text-left text-sm p-3">Tahun</th>
            <th class="text-left text-sm p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">Employee Id</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">Employee Status</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">Departement</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">2022</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">Actions</p>
            </td>
          </tr>
        </tbody>
      </table>
      <section class="mt-8">
        <Input label="Gelar" input_class="w-4/6" class="mb-2.5" />
        <Input label="Nama Institusi" input_class="w-4/6" class="mb-2.5" />
        <Input type="number" label="Hasil" input_class="w-4/6" class="mb-2.5" />
        <Select
          label="Tahun"
          input_class="w-4/6"
          class="mb-2.5"
          :options="['2022', '2021', '2020']"
        />
        <div class="flex justify-end w-full my-4">
          <Button class="bg-primary text-white w-24 text-sm rounded py-2">
            Save
          </Button>
        </div>
      </section>
    </section>
    <section class="mt-4" v-if="tab_active === '2'">
      <Experience />
    </section>
  </section>
</template> 

<script>
import Input from "./Input.vue";
import Select from "./Select";
import Button from "./Button.vue";
import Experience from "./Experience.vue";

export default {
  name: "EducationComponent",
  components: { Input, Select, Button, Experience },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
      },
      show_select: false,
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