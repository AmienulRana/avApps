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
        @change="data.username = $value"
      />
      <Input
        label="NIK Karyawan"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :value="data.emp_nik_karyawan"
        @change="data.emp_nik_karyawan = $event"
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
        @selected="data.emp_desid = $event"
      />
      <Select
        label="Status Karyawan"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :value="data?.emp_status"
        :options="['Permanent', 'Probation', 'Contract']"
        @change="data.emp_status = $event"
      />
      <Select
        label="Tanggungan"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :value="data?.emp_tanggungan"
        :options="['TK/0', 'TK/1', 'TK/2', 'TK/4']"
        @change="data.emp_tanggungan = $event"
      />
      <SelectSearch
        :options="designation"
        label="Atasan Pertama"
        @selected="data.emp_fsuperior = $event"
        :selectedOption="data?.emp_fsuperior"
        input_class="md:w-4/6 mt-2"
        position="top"
        :isOpen="show_select === 'atasan-1'"
        @handleShowSelect="show_select = 'atasan-1'"
      />
      <SelectSearch
        :options="designation"
        :selectedOption="data?.emp_ssuperior"
        @selected="data.emp_ssuperior = $event"
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
        :value="data?.emp_location"
        @change="data.emp_location = $event"
        :options="[
          'Mufidah Stationery',
          'Mufidah Terminal Print',
          'Jojo House',
        ]"
      />
      <div class="flex justify-end w-full my-4">
        <Button
          class="bg-primary text-white w-24 text-sm rounded py-2"
          @click="handleEditEmployement"
          :disabled="loading"
        >
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
        <Button
          class="bg-primary text-white w-24 text-sm rounded py-2"
          @click="showModal = true"
        >
          Save
        </Button>
      </div>
    </section>
  </section>
  <Modal :showModal="showModal" @close="showModal = false" class="z-30">
    <section class="bg-red-100 w-full rounded h-32 px-10 pt-5">
      <p class="text-red-500">
        You cannot change shifts directly here, if you want to change shifts
        please visit the
        <router-link to="/change-shift" class="underline">
          "Change Work Shift"
        </router-link>
        page
      </p>
    </section>
    <template #footer>
      <Button
        class="bg-primary w-24 py-1.5 text-white rounded"
        @click="showModal = false"
      >
        Close
      </Button>
    </template>
  </Modal>
</template>

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";
import Select from "./Select/index.vue";
import SelectSearch from "./Select/SelectSearch";
import SwitchButton from "./SwitchButton.vue";
import { GetDepartementAPI } from "@/actions/departement";
import { GetDesignationAPI } from "@/actions/designation";
import { EditEmployementAPI } from "@/actions/employment";
import { useToast } from "vue-toastification";
import Modal from "./Modal.vue";

export default {
  name: "EmploymentData",
  props: { employment: Object, handleDetailEmployment: Function },
  components: { Input, Select, SelectSearch, SwitchButton, Button, Modal },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
        width: 0,
      },
      loading: false,
      show_select: false,
      showModal: false,
      tab_active: "1",
      data: {
        emp_status: this.employment?.emp_status,
        username: this.employment?.username,
        emp_nik_karyawan: this.employment?.emp_nik_karyawan,
        emp_depid: {
          dep_name: this.employment?.emp_depid?.dep_name,
          _id: this.employment?.emp_depid?._id,
        },
        emp_desid: {
          des_name: this.employment?.emp_desid?.des_name,
          _id: this.employment?.emp_desid?._id,
        },
        emp_fsuperior: this.employment?.emp_fsuperior,
        emp_ssuperior: this.employment?.emp_ssuperior,
        emp_location: this.employment?.emp_location,
        company_id: this.employment?.company_id,
        emp_tanggungan: this.employment?.emp_tanggungan,
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
  setup() {
    const toast = useToast();
    return { toast };
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
    showMessageStatus(response) {
      if (response.status === 200) {
        this.handleDetailEmployment();
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
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
    async handleEditEmployement() {
      this.loading = true;
      const data = {
        ...this.data,
        emp_depid: this.data?.emp_depid?._id,
        emp_desid: this.data?.emp_desid?._id,
      };
      const { id } = this.$route.params;
      const response = await EditEmployementAPI(id, data);
      if (response.status === 401) {
        return (window.location.href = "/login");
      }
      this.showMessageStatus(response);
      this.loading = false;
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
