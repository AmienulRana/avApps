<template>
  <section class="px-4" @click="show_select = false">
    <section
      class="bg-gray-100 mt-2 rounded-md md:px-4 px-2 py-1 flex md:justify-center justify-between relative"
    >
      <button
        class="md:w-1/2 w-max h-full py-2 z-10 duration-300 text-sm truncate"
        @click="(e) => handleChangeTab(e, '1')"
        :class="tab_active === '1' ? 'text-white' : ''"
        ref="first_tab"
      >
        Employment Data</button
      >a
      <button
        class="md:w-1/2 w-max z-10 h-full py-2 duration-300 text-sm truncate"
        @click="(e) => handleChangeTab(e, '2')"
        :class="tab_active === '2' ? 'text-white' : ''"
      >
        Employment Attadance Day
      </button>
      <span
        class="absolute top-1/2 -translate-y-1/2 duration-300 rounded-md bg-primary"
        :style="`left:${indicator_position.left}px; height:${indicator_position.height}px;  width:${indicator_position.width}px;`"
      />
    </section>

    <section class="mt-4" v-if="tab_active === '1'">
      <Input label="Username" input_class="md:w-4/6 mt-2" class="mb-2.5" />
      <Input label="NIK Karyawan" input_class="md:w-4/6 mt-2" class="mb-2.5" />
      <SelectSearch
        :options="['Administration', 'IT']"
        label="Departement"
        position="bottom"
        input_class="md:w-4/6 mt-2"
        :isOpen="show_select === 'departemen'"
        @handleShowSelect="show_select = 'departemen'"
      />
      <SelectSearch
        :options="['Project Mananger', 'Developer']"
        label="Jabatan"
        position="bottom"
        input_class="md:w-4/6 mt-2"
        :isOpen="show_select === 'jabatan'"
        @handleShowSelect="show_select = 'jabatan'"
      />
      <Select
        label="Status Karyawan"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :options="['Permanent', 'Probation', 'Contract']"
      />
      <Select
        label="Tanggungan"
        input_class="md:w-4/6 mt-2"
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
        ]"
        label="Atasan Pertama"
        input_class="md:w-4/6 mt-2"
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
        ]"
        label="Atasan Kedua"
        input_class="md:w-4/6 mt-2"
        position="top"
        :isOpen="show_select === 'atasan-2'"
        @handleShowSelect="show_select = 'atasan-2'"
      />
      <Select
        label="Lokasi Absensi"
        input_class="md:w-4/6 mt-2"
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
      <div class="mb-2">
        <p class="text-end text-sm text-gray-400">Off day</p>
      </div>
      <div
        class="flex items-center mb-2.5"
        v-for="day in shift_day"
        :key="day.name"
      >
        <Select
          :label="day.name"
          input_class="md:w-4/6 mt-2 md:mt-0"
          class="w-full mr-6"
          :options="shift_data"
          :disabled="day.isCuti"
        />
        <SwitchButton
          @update:model="(value) => (day.isCuti = value)"
          :value="day.isCuti"
        />
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
import Select from "./Select/index.vue";
import SelectSearch from "./Select/SelectSearch";
import SwitchButton from "./SwitchButton.vue";

export default {
  name: "PersonalDetail",
  components: { Input, Select, SelectSearch, SwitchButton },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
        width: 0,
      },
      show_select: false,
      tab_active: "1",
      shift_data: [
        "Shift 1 Stationery (08:00 am - 05:00pm)",
        "Shift 2 Stationery",
        "Shift 3 Stationery",
      ],
      shift_day: [
        { name: "Senin", isCuti: false },
        { name: "Selasa", isCuti: false },
        { name: "Rabu", isCuti: false },
        { name: "Kamis", isCuti: false },
        { name: "Jumat", isCuti: false },
        { name: "Sabtu", isCuti: false },
        { name: "Minggu", isCuti: false },
      ],
    };
  },
  methods: {
    handleChangeTab(event, tab) {
      const buttonHeight = event.target.offsetHeight;
      const buttonPosition = event.target.offsetLeft;
      const buttonWidth = event.target.offsetWidth;

      this.indicator_position.left = buttonPosition;
      this.indicator_position.width = buttonWidth;
      this.indicator_position.height = buttonHeight;
      this.tab_active = tab;
    },
  },
  mounted() {
    const buttonHeight = this.$refs.first_tab?.offsetHeight;
    const buttonWidth = this.$refs.first_tab?.offsetWidth;
    const buttonPosition = this.$refs.first_tab?.offsetLeft;
    this.indicator_position.left = buttonPosition;
    this.indicator_position.height = buttonHeight;
    this.indicator_position.width = buttonWidth;
  },
};
</script>

<style scoped></style>
