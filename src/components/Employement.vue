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
        Employment Data
      </button>
      <button
        class="w-1/2 z-10 h-full py-2 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '2')"
        :class="tab_active === '2' ? 'text-white' : ''"
      >
        Employment Attadance Day
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
      <Input label="Username" input_class="w-4/6" class="mb-2.5" />
      <Input label="NIK Karyawan" input_class="w-4/6" class="mb-2.5" />
      <SelectSearch
        :options="['Administration', 'IT']"
        label="Departement"
        position="bottom"
        :isOpen="show_select === 'departemen'"
        @handleShowSelect="show_select = 'departemen'"
      />
      <SelectSearch
        :options="['Project Mananger', 'Developer']"
        label="Jabatan"
        position="bottom"
        :isOpen="show_select === 'jabatan'"
        @handleShowSelect="show_select = 'jabatan'"
      />
      <Select
        label="Status Karyawan"
        input_class="w-4/6"
        class="mb-2.5"
        :options="['Permanent', 'Probation', 'Contract']"
      />
      <Select
        label="Tanggungan"
        input_class="w-4/6"
        class="mb-2.5"
        :options="['TK/0', 'TK/1', 'TK/2', 'TK/4']"
      />
      <SelectSearch
        :options="[
          'Project Mananger',
          'Developer',
          'Project Mananger',
          'Developer',
          'Project Mananger',
          'Developer',
          'Project Mananger',
          'Developer',
        ]"
        label="Atasan Pertama"
        position="top"
        :isOpen="show_select === 'atasan-1'"
        @handleShowSelect="show_select = 'atasan-1'"
      />
      <SelectSearch
        :options="[
          'Project Mananger',
          'Developer',
          'Project Mananger',
          'Developer',
          'Project Mananger',
          'Developer',
          'Project Mananger',
          'Developer',
        ]"
        label="Atasan Kedua"
        position="top"
        :isOpen="show_select === 'atasan-2'"
        @handleShowSelect="show_select = 'atasan-2'"
      />
      <Select
        label="Lokasi Absensi"
        input_class="w-4/6"
        class="mb-2.5"
        :options="[
          'Mufidah Stationery',
          'Mufidah Terminal Print',
          'Jojo House',
        ]"
      />
      <div class="flex justify-end w-full my-4">
        <Button class="bg-primary text-white w-24 text-sm rounded py-2">
          Save
        </Button>
      </div>
    </section>
    <section class="mt-4" v-if="tab_active === '2'">
      <Select
        label="Senin"
        input_class="w-4/6"
        class="mb-2.5"
        :options="shift_data"
      />
      <Select
        label="Selasa"
        input_class="w-4/6"
        class="mb-2.5"
        :options="shift_data"
      />
      <Select
        label="Rabu"
        input_class="w-4/6"
        class="mb-2.5"
        :options="shift_data"
      />
      <Select
        label="Kamis"
        input_class="w-4/6"
        class="mb-2.5"
        :options="shift_data"
      />
      <Select
        label="Jum'at"
        input_class="w-4/6"
        class="mb-2.5"
        :options="shift_data"
      />
      <Select
        label="Sabtu"
        input_class="w-4/6"
        class="mb-2.5"
        :options="shift_data"
      />
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
import Select from "./Select/index.vue";
import SelectSearch from "./Select/SelectSearch";

export default {
  name: "PersonalDetail",
  components: { Input, Select, SelectSearch },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
      },
      show_select: false,
      tab_active: "1",
      shift_data: [
        "Shift 1 Stationery (08:00 am - 05:00pm)",
        "Shift 2 Stationery",
        "Shift 3 Stationery",
      ],
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