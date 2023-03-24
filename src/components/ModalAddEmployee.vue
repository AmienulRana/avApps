<template>
  <Modal
    :showModal="showModal"
    title="Add Employee"
    @close="closeModal"
    @click="show_select = ''"
  >
    <template #header>
      <ChoiseCompany
        v-if="superAdmin && !loading.company"
        @selected:company="dataCompany = $event"
        :options="options"
        :dataCompany="dataCompany"
      />
    </template>
    <section class="text-center mb-6">
      <ul class="flex">
        <li
          class="cursor-pointer text-sm px-4 mb-4 truncate w-full"
          v-for="(title, i) in titleTabs"
          :class="tabActive === title ? 'text-primary' : 'text-gray-400'"
          @click="tabActive = title"
          :key="i"
        >
          {{ title }}
        </li>
      </ul>
    </section>
    <section>
      <KeepAlive>
        <section
          class="px-4"
          @click="show_select = false"
          v-if="tabActive === 'Personal'"
        >
          <section class="mt-4">
            <div class="flex justify-center mb-2.5">
              <div
                class="w-32 h-32 bg-gray-50 flex flex-col cursor-pointer justify-center items-center rounded-full border-2 border-gray-300 relative"
                @click="openFileInput"
              >
                <template v-if="!previewImage">
                  <font-awesome-icon
                    icon="fa-camera-alt"
                    class="text-2xl text-primary"
                  />
                  <p class="text-center text-gray-400 mt-2">Update Photo</p>
                </template>
                <img
                  :src="previewImage"
                  class="w-full h-full rounded-full"
                  alt=""
                  v-else
                />
                <input
                  type="file"
                  class="hidden"
                  ref="file"
                  @change="viewImage"
                />
              </div>
            </div>
            <p
              class="text-center text-sm mb-5"
              :class="limitFileSize ? 'text-red-500' : 'text-gray-400'"
            >
              Max Size File 4.8 MB
            </p>
            <Input
              label="Nama Depan*"
              input_class="md:w-4/6 w-full mt-1 w-full mt-1"
              class="mb-2.5"
              :value="personal.emp_firstname"
              @change="personal.emp_firstname = $event"
            />
            <Input
              label="Nama Belakang"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.emp_lastname"
              @change="personal.emp_lastname = $event"
            />
            <Input
              label="Email*"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.email"
              @change="personal.email = $event"
            />
            <Input
              label="NIK Ktp"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.emp_nikktp"
              @change="personal.emp_nikktp = $event"
            />
            <Input
              label="Phone number"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.emp_phone"
              @change="personal.emp_phone = $event"
            />
            <div class="md:flex justify-between items-center mb-2.5">
              <label class="text-sm text-gray-400 md:w-1/5 w-full"
                >Jenis Kelamin*</label
              >
              <div class="flex md:w-4/6 w-full mt-1">
                <Radio
                  label="Laki-Laki"
                  class="mr-5"
                  value="Laki-Laki"
                  :checked="personal.emp_gender === 'Laki-Laki'"
                  @change="personal.emp_gender = 'Laki-Laki'"
                />
                <Radio
                  label="Perempuan"
                  class="mr-5"
                  :checked="personal.emp_gender === 'Perempuan'"
                  value="Perempuan"
                  @change="personal.emp_gender = 'Perempuan'"
                />
              </div>
            </div>
            <Select
              label="Marital Status"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.emp_marital_status"
              @change="personal.emp_marital_status = $event"
              :options="['Belum menikah', 'sudah menikah']"
            />
            <Input
              label="Tgl. Lahir"
              type="date"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.emp_birthday"
              @change="personal.emp_birthday = $event"
            />
            <SelectSearch
              :options="['O', 'O+', 'O-', 'A+', 'A-', 'A', 'AB', 'B']"
              label="Golongan Darah"
              input_class="w-full md:w-4/6 mt-1"
              position="top"
              :selectedOption="personal.emp_blood"
              :isOpen="show_select === 'gol'"
              @handleShowSelect="show_select = 'gol'"
              @selected="personal.emp_blood = $event"
            />
          </section>
        </section>
      </KeepAlive>
      <KeepAlive>
        <section
          v-if="tabActive === 'Employment'"
          class="px-4"
          @click="show_select = false"
        >
          <section class="mt-4">
            <Input
              label="Username*"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.username"
              @change="employment.username = $event"
            />
            <Input
              label="Password*"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              type="password"
              :value="employment.password"
              @change="employment.password = $event"
            />
            <Input
              label="NIK Karyawan"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.emp_nik_karyawan"
              @change="employment.emp_nik_karyawan = $event"
            />
            <SelectSearch
              :options="departement"
              label="Departement*"
              position="bottom"
              property="dep_name"
              input_class="md:w-4/6 mt-2"
              :isOpen="show_select === 'departemen'"
              @handleShowSelect="show_select = 'departemen'"
              :selectedOption="employment.emp_depid"
              @selected="employment.emp_depid = $event"
            />
            <SelectSearch
              :options="designation"
              label="Jabatan*"
              position="bottom"
              property="des_name"
              input_class="md:w-4/6 mt-2"
              :isOpen="show_select === 'jabatan'"
              @handleShowSelect="show_select = 'jabatan'"
              :selectedOption="employment.emp_desid"
              @selected="employment.emp_desid = $event"
            />
            <Select
              label="Status Karyawan*"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              property="empstatus_name"
              :value="employment.emp_status"
              @change="employment.emp_status = $event"
              :options="empStatus"
              select_property="_id"
            />
            <Select
              label="Tanggungan"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.emp_tanggungan"
              @change="employment.emp_tanggungan = $event"
              :options="['TK/0', 'TK/1', 'TK/2', 'TK/4']"
            />
            <SelectSearch
              :options="designation"
              property="des_name"
              label="Atasan Pertama*"
              input_class="md:w-4/6 mt-2"
              position="top"
              :isOpen="show_select === 'atasan-1'"
              @handleShowSelect="show_select = 'atasan-1'"
              :selectedOption="employment.emp_fsuperior"
              @selected="employment.emp_fsuperior = $event"
            />
            <SelectSearch
              :options="designation"
              property="des_name"
              label="Atasan Kedua*"
              input_class="md:w-4/6 mt-2"
              position="top"
              :isOpen="show_select === 'atasan-2'"
              @handleShowSelect="show_select = 'atasan-2'"
              :selectedOption="employment.emp_ssuperior"
              @selected="employment.emp_ssuperior = $event"
            />
            <SelectSearch
              :options="locations"
              property="loc_name"
              label="Lokasi Absensi*"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              position="top"
              :isOpen="show_select === 'location'"
              @handleShowSelect="show_select = 'location'"
              :selectedOption="employment.emp_location"
              @selected="employment.emp_location = $event"
            />
          </section>
        </section>
      </KeepAlive>
      <KeepAlive>
        <section
          v-if="tabActive === 'Attadance Day'"
          class="px-4"
          @click="show_select = false"
        >
          <div class="mb-2">
            <p class="text-end text-sm text-gray-400">Off day</p>
          </div>
          <div
            class="flex items-center mb-2.5"
            v-for="day in shift_day"
            :key="day.name"
          >
            <Select
              :label="`${day.name}*`"
              input_class="md:w-4/6 mt-2"
              class="w-full mr-6"
              property="shift_desc"
              :value="attadance_day[day.name.toLowerCase()].shift"
              @change="attadance_day[day.name.toLowerCase()].shift = $event"
              :options="shift_data"
              select_property="_id"
              :disabled="attadance_day[day.name.toLowerCase()].off_day"
            />
            <SwitchButton
              @update:model="
                (value) =>
                  (attadance_day[day.name.toLowerCase()].off_day = value)
              "
              :value="attadance_day[day.name.toLowerCase()].off_day"
            />
          </div>
        </section>
      </KeepAlive>
      <KeepAlive>
        <section
          v-if="tabActive === 'Basic Sallary'"
          class="px-4"
          @click="show_select = false"
        >
          <Select
            label="Periode Penggajian"
            input_class="md:w-4/6 mt-2"
            class="mb-2.5"
            :options="['Bulan', '2 Minggu', 'Minggu']"
            :value="basic_salary.periode"
            @change="basic_salary.periode = $event"
          />
          <div class="md:flex justify-between items-center mb-5 mt-4">
            <label
              :class="'md:w-1/5 text-gray-400'"
              class="text-sm min-w-max w-full"
              >Gaji Pokok</label
            >
            <div class="w-full md:w-4/6">
              <input
                type="number"
                class="text-sm w-full border outline-gray-600 focus:outline focus:outline-primary pr-4 py-1.5 pl-4 bg-white rounded"
                autofocus
                :value="basic_salary.salary"
                @input="basic_salary.salary = $event.target.value"
              />
              <p
                class="text-sm text-gray-400 mt-1.5"
                v-if="basic_salary.salary"
              >
                Gaji per {{ basic_salary.periode }}:
                {{ formatCurrency(basic_salary.salary) }}
              </p>
            </div>
          </div>
          <section class="flex justify-between items-center">
            <p class="text-sm text-gray-400 md:w-1/5">Jumlah Hari kerja :</p>
            <div class="md:w-4/6 mb-2.5">
              <Input
                type="number"
                input_class="md:full mt-2"
                class="mb-1.5"
                :value="basic_salary.working_days"
                @input="basic_salary.working_days = $event"
              />
              <p
                class="text-sm text-gray-400"
                v-if="basic_salary.working_days && basic_salary.salary"
              >
                Gaji per hari:
                {{
                  formatCurrency(
                    basic_salary.salary / basic_salary.working_days
                  )
                }}
              </p>
            </div>
          </section>
          <section class="flex justify-between items-center">
            <p class="text-sm text-gray-400 md:w-1/5">Jumlah Jam kerja :</p>
            <div class="md:w-4/6 mb-2.5">
              <Input
                type="number"
                input_class="md:full mt-2"
                class="mb-1.5"
                :value="basic_salary.working_hours"
                @input="basic_salary.working_hours = $event"
              />
              <p
                class="text-sm text-gray-400"
                v-if="
                  basic_salary.working_days &&
                  basic_salary.salary &&
                  basic_salary.working_hours
                "
              >
                Gaji per jam:
                {{
                  formatCurrency(
                    basic_salary.salary /
                      basic_salary.working_days /
                      basic_salary.working_hours
                  )
                }}
              </p>
            </div>
          </section>
        </section>
      </KeepAlive>
    </section>
    <template #footer>
      <section class="flex justify-end">
        <Button class="bg-gray-400 w-24 mr-3 px-2 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 min-w-max px-2 py-2 text-white rounded-md"
          @click="handleAddEmployment"
          :disabled="loadingAdd || limitFileSize"
        >
          Tambah Karyawan
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import Input from "./Input.vue";
import Select from "./Select/index.vue";
import SelectSearch from "./Select/SelectSearch";
import Radio from "./Radio.vue";
import SwitchButton from "./SwitchButton.vue";
import { AddEmploymentAPI } from "@/actions/employment";
import { GetDepartementAPI } from "@/actions/departement";
import { GetAllCompanyAPI } from "@/actions/company";
import { GetLocationAPI } from "@/actions/location";
import { GetEmpStatusAPI } from "@/actions/emp-status";
import { GetShiftAPI } from "@/actions/shift";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "./ChoiseCompany.vue";
import { GetDesignationAPI } from "@/actions/designation";
import { useToast } from "vue-toastification";

export default {
  name: "ModalAddEmployee",
  components: {
    Modal,
    Input,
    Select,
    SelectSearch,
    Radio,
    SwitchButton,
    ChoiseCompany,
  },
  props: { showModal: Boolean, closeModal: Function, getEmployement: Function },
  data() {
    return {
      loadingAdd: false,
      show_select: "",
      previewImage: null,
      personal: {
        emp_firstname: "",
        emp_lastname: "",
        email: "",
        emp_nikktp: "",
        emp_phone: "",
        emp_gender: "",
        emp_marital_status: "",
        emp_birthday: "",
        emp_blood: "",
      },
      employment: {
        username: "",
        password: "",
        emp_nik_karyawan: "",
        emp_depid: "",
        emp_desid: "",
        emp_status: "",
        emp_fsuperior: "",
        emp_ssuperior: "",
        emp_tanggungan: "",
        emp_location: "",
      },
      attadance_day: {
        senin: { shift: "", off_day: false },
        selasa: { shift: "", off_day: false },
        rabu: { shift: "", off_day: false },
        kamis: { shift: "", off_day: false },
        jumat: { shift: "", off_day: false },
        sabtu: { shift: "", off_day: false },
        minggu: { shift: "", off_day: false },
      },
      basic_salary: {
        periode: "",
        salary: null,
        salary_number: 0,
        working_days: null,
        working_hours: null,
      },
      titleTabs: ["Personal", "Employment", "Attadance Day", "Basic Sallary"],
      shift_data: [],
      shift_day: [
        { name: "Senin", off_day: false },
        { name: "Selasa", off_day: false },
        { name: "Rabu", off_day: false },
        { name: "Kamis", off_day: false },
        { name: "Jumat", off_day: false },
        { name: "Sabtu", off_day: false },
        { name: "Minggu", off_day: false },
      ],
      tabActive: "Personal",
      departement: [],
      designation: [],
      locations: [],
      empStatus: [],
      options: [],
      superAdmin: false,
      limitFileSize: false,
      dataCompany: {
        _id: "",
      },
      loading: {
        company: true,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    formatCurrency(number) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
      return formatter.format(number);
    },
    openFileInput() {
      this.$refs.file.click();
    },
    viewImage(e) {
      this.limitFileSize = false;
      const files = e.target?.files[0];
      this.$store.commit("setFile", files);
      const fileSize = +(files.size / 1024 ** 2).toFixed(2);
      if (fileSize > 4.8) {
        this.limitFileSize = true;
      }
      if (files) {
        const file = URL.createObjectURL(files);
        this.previewImage = file;
        //     const img = new Image();
        // img.onload = () => {
        //   const width = img.width;
        //   const height = img.height;
        //   console.log(`Ukuran gambar: ${width} x ${height}`);

        //   // tampilkan ukuran file dalam satuan KB
        //   const fileSize = (files.size / 1024).toFixed(2);
        //   console.log(`Ukuran file: ${fileSize} KB`);
        // }
        // img.src = file;
      }
    },
    clearInputValue() {
      for (const key in this.personal) {
        this.personal[key] = "";
      }
      for (const key in this.employment) {
        this.employment[key] = "";
      }
      for (const key in this.basic_salary) {
        this.basic_salary[key] = "";
      }
      for (const key in this.attadance_day) {
        this.attadance_day[key].off_day = false;
        this.attadance_day[key].shift = "";
      }
    },
    showMessageStatus(response) {
      if (response?.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response?.data?.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    async getCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.company = false;
    },
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.departement = response?.data;
    },
    async handleGetDesignation() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDesignationAPI(querySuperAdmin);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.designation = response?.data;
    },
    async handleGetLocation() {
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;
      const response = await GetLocationAPI(querySuperAdmin);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.locations = response.data;
      // this.designation = response?.data;
    },
    async handleAddEmployment() {
      this.loadingAdd = true;
      const employment = {
        ...this.employment,
        emp_location: this.employment.emp_location?._id,
        emp_depid: this.employment.emp_depid?._id,
        emp_desid: this.employment.emp_desid?._id,
        emp_fsuperior: this.employment.emp_fsuperior?._id,
        emp_ssuperior: this.employment.emp_ssuperior?._id,
      };
      const salary = {
        emp_salary: Number(this.basic_salary.salary),
        emp_working_days: Number(this.basic_salary.working_days),
        emp_working_hours: Number(this.basic_salary.working_hours),
        emp_periode: this.basic_salary.periode,
      };

      const data = {
        ...this.personal,
        ...employment,
      };
      const formData = new FormData();
      formData.append("profile", this.$store.state.file);
      formData.append("attadance", JSON.stringify(this.attadance_day));
      formData.append("basic_salary", JSON.stringify(salary));
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const response = await AddEmploymentAPI(
        formData,
        `?company=${this.dataCompany?._id}`
      );
      if (response.status === 200) {
        this.getEmployement();
        this.tabActive = "Personal";
        this.previewImage = null;
        this.$store.commit("unSetFile");
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loadingAdd = false;
    },
    async getShift() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetShiftAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        const getShiftDesc = response?.data?.map((shift) => ({
          _id: shift?._id,
          shift_desc: shift?.shift_desc,
        }));
        this.shift_data = getShiftDesc;
      }
    },
    async getEmpStatus() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetEmpStatusAPI(queryAdminSuper);

      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.empStatus = response.data;
      this.loading.getStatus = false;
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetDepartement();
        this.handleGetDesignation();
        this.getShift();
        this.getEmpStatus();
        this.handleGetLocation();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getCompany();
    // this.handleGetDepartement();
  },
};
</script>

<style scoped></style>
