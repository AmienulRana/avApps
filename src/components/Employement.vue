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
        Employment Data
      </button>
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
      <Input
        label="Username"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :value="data.username"
      />
      <Input
        label="NIK Karyawan"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :value="data.emp_nik_karyawan"
      />
      <SelectSearch
        :options="departement"
        property="dep_name"
        label="Departement"
        position="bottom"
        :selectedOption="data?.emp_depid"
        input_class="md:w-4/6 mt-2"
        :isOpen="show_select === 'departemen'"
        @handleShowSelect="show_select = 'departemen'"
        @selected="data.emp_depid = $event"
      />
      <SelectSearch
        :options="designation"
        property="des_name"
        :selectedOption="data?.emp_desid"
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
        :value="data?.emp_status"
        :options="['Permanent', 'Probation', 'Contract']"
      />
      <Select
        label="Tanggungan"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :options="['TK/0', 'TK/1', 'TK/2', 'TK/4']"
      />
      <SelectSearch
        :options="designation"
        label="Atasan Pertama"
        :selectedOption="data?.emp_fsuperior"
        input_class="md:w-4/6 mt-2"
        position="top"
        :isOpen="show_select === 'atasan-1'"
        @handleShowSelect="show_select = 'atasan-1'"
      />
      <SelectSearch
        :options="designation"
        :selectedOption="data?.emp_ssuperior"
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
        v-for="(day, i) in shift_day"
        :key="i"
      >
        <Select
          :label="i"
          input_class="md:w-4/6 mt-2 md:mt-0"
          class="w-full mr-6"
          :options="shift_data"
          :value="day.shift"
          :disabled="day.off_day"
        />
        <SwitchButton
          @update:model="(value) => (day.off_day = value)"
          :value="day?.off_day"
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
import { GetDepartementAPI } from "@/actions/departement";
import { GetDesignationAPI } from "@/actions/designation";

export default {
  name: "EmploymentData",
  props: { employment: Object },
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
      data: {
        emp_status: this.employment?.emp_status,
        username: this.employment?.username,
        emp_nik_karyawan: this.employment?.emp_nik_karyawan,
        emp_depid: { dep_name: this.employment?.emp_depid?.dep_name },
        emp_desid: { des_name: this.employment?.emp_desid?.des_name },
        emp_fsuperior: this.employment?.emp_fsuperior,
        emp_ssuperior: this.employment?.emp_ssuperior,
        emp_location: this.employment?.emp_location,
        company_id: this.employment?.company_id,
      },
      shift_data: [
        "Shift 1 Stationery (08:00 am - 05:00pm)",
        "Shift 2 Stationery",
        "Shift 3 Stationery",
      ],
      shift_day: this.employment?.emp_attadance,
      departement: [],
      designation: [],
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
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.data?.company_id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        return (window.location.href = "/login");
      }
      this.departement = response.data;
    },
    async handleGetDesignation() {
      const querySuperAdmin = `?company=${this.data?.company_id}`;
      const response = await GetDesignationAPI(querySuperAdmin);
      if (response.status === 401) {
        return (window.location.href = "/login");
      }
      this.designation = response.data;
    },
  },
  watch: {
    employment: {
      handler(newData) {
        this.data = newData;
        this.shift_day = newData?.emp_attadance;
      },
      deep: true,
    },
  },
  mounted() {
    this.handleGetDepartement();
    this.handleGetDesignation();
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
