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
      <SelectSearch
        :options="empStatus"
        property="empstatus_name"
        :selectedOption="data?.emp_status"
        label="Status Karyawan"
        position="bottom"
        input_class="md:w-4/6 mt-2"
        :isOpen="show_select === 'status'"
        @handleShowSelect="show_select = 'status'"
        @selected="data.emp_status = $event"
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
        property="des_name"
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
        property="des_name"
        label="Atasan Kedua"
        input_class="md:w-4/6 mt-2"
        position="top"
        :isOpen="show_select === 'atasan-2'"
        @handleShowSelect="show_select = 'atasan-2'"
      />
      <SelectSearch
        :options="locations"
        label="Lokasi Absensi"
        property="loc_name"
        @selected="data.emp_location = $event"
        :selectedOption="data?.emp_location"
        input_class="md:w-4/6 mt-2"
        position="top"
        :isOpen="show_select === 'lokasi'"
        @handleShowSelect="show_select = 'lokasi'"
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
      <EmployementShift
        :emp_attadance="employment?.emp_attadance"
        :handleDetailEmployment="handleDetailEmployment"
      />
    </section>
  </section>
</template>

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";
import Select from "./Select/index.vue";
import SelectSearch from "./Select/SelectSearch";
import { GetDepartementAPI } from "@/actions/departement";
import { GetDesignationAPI } from "@/actions/designation";
import { EditEmployementAPI } from "@/actions/employment";
import { useToast } from "vue-toastification";
import { GetEmpStatusAPI } from "@/actions/emp-status";
import { GetLocationAPI } from "@/actions/location";
import EmployementShift from "./EmploymentShift.vue";

export default {
  name: "EmploymentData",
  props: { employment: Object, handleDetailEmployment: Function },
  components: { Input, Select, SelectSearch, Button, EmployementShift },
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
      empStatus: [],
      departement: [],
      designation: [],
      locations: [],
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
      if (response?.status === 200) {
        this.handleDetailEmployment();
        this.toast.success(response?.data?.message);
      } else {
        if (response?.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.data?.company_id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.departement = response?.data;
    },
    async handleGetDesignation() {
      const querySuperAdmin = `?company=${this.data?.company_id}`;
      const response = await GetDesignationAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.designation = response?.data;
    },
    async handleGetLocation() {
      const querySuperAdmin = `?company_id=${this.data?.company_id}`;
      const response = await GetLocationAPI(querySuperAdmin);
      console.log(response);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.locations = response?.data;
    },
    async getEmpStatus() {
      const queryAdminSuper = `?company_id=${this.data?.company_id}`;
      const response = await GetEmpStatusAPI(queryAdminSuper);

      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.empStatus = response?.data;
    },
    async handleEditEmployement() {
      this.loading = true;
      const data = {
        ...this.data,
        emp_depid: this.data?.emp_depid?._id,
        emp_desid: this.data?.emp_desid?._id,
        emp_fsuperior: this.data?.emp_fsuperior?._id,
        emp_ssuperior: this.data?.emp_ssuperior?._id,
        emp_location: this.data?.emp_location?._id,
      };
      const { id } = this.$route.params;
      const response = await EditEmployementAPI(id, data);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
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
    this.handleGetLocation();
    this.getEmpStatus();
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
