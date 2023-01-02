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
                  class="w-full h-ful rounded-full"
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
            <Input
              label="Nama Depan"
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
              label="Email"
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
                >Jenis Kelamin</label
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
              :options="['O+', 'O-', 'A+', 'A-']"
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
              label="Username"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.username"
              @change="employment.username = $event"
            />
            <Input
              label="Password"
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
              label="Departement"
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
              label="Jabatan"
              position="bottom"
              property="des_name"
              input_class="md:w-4/6 mt-2"
              :isOpen="show_select === 'jabatan'"
              @handleShowSelect="show_select = 'jabatan'"
              :selectedOption="employment.emp_desid"
              @selected="employment.emp_desid = $event"
            />
            <Select
              label="Status Karyawan"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.emp_status"
              @change="employment.emp_status = $event"
              :options="['Permanent', 'Probation', 'Contract']"
            />
            <Select
              label="Tanggungan"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.tanggungan"
              @change="employment.tanggungan = $event"
              :options="['TK/0', 'TK/1', 'TK/2', 'TK/4']"
            />
            <SelectSearch
              :options="designation"
              property="des_name"
              label="Atasan Pertama"
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
              label="Atasan Kedua"
              input_class="md:w-4/6 mt-2"
              position="top"
              :isOpen="show_select === 'atasan-2'"
              @handleShowSelect="show_select = 'atasan-2'"
              :selectedOption="employment.emp_ssuperior"
              @selected="employment.emp_ssuperior = $event"
            />
            <Select
              label="Lokasi Absensi"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.lokasi"
              @change="employment.lokasi = $event"
              :options="[
                'Mufidah Stationery',
                'Mufidah Terminal Print',
                'Jojo House',
              ]"
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
              :label="day.name"
              input_class="md:w-4/6 mt-2 md:mt-0"
              class="w-full mr-6"
              :options="shift_data"
              :disabled="attadance_day[day.name.toLowerCase()].off_day"
              :value="attadance_day[day.name.toLowerCase()].shift"
              @change="attadance_day[day.name.toLowerCase()].shift = $event"
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
          <Input
            type="number"
            label="Gaji pokok"
            input_class="md:w-4/6 mt-2"
            class="mb-2.5"
            :value="basic_salary.salary"
            @input="basic_salary.salary = $event"
            placeholder="Tidak ada perkiraan untuk Project Manager "
          />
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
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "./ChoiseCompany.vue";
import { GetDesignationAPI } from "@/actions/designation";

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
      show_select: "",
      previewImage: null,
      personal: {
        emp_firstname: "",
        emp_lastname: "",
        email: "",
        emp_nikktp: "",
        emp_phone: null,
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
        tanggungan: "",
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
        working_days: null,
        working_hours: null,
      },
      titleTabs: ["Personal", "Employment", "Attadance Day", "Basic Sallary"],
      shift_data: [
        "Shift 1 Stationery (08:00 am - 05:00pm)",
        "Shift 2 Stationery",
        "Shift 3 Stationery",
      ],
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
      options: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        company: true,
      },
    };
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
      const files = e.target?.files[0];
      this.$store.commit("setFile", files);
      if (files) {
        const file = URL.createObjectURL(files);
        this.previewImage = file;
      }
    },
    async getCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response.data;
      this.dataCompany = response.data[0];
      this.loading.company = false;
    },
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      if (this?.dataCompany?._id) {
        const response = await GetDepartementAPI(querySuperAdmin);
        if (response.status === 401) {
          return (window.location.href = "/login");
        }
        this.departement = response.data;
      }
    },
    async handleGetDesignation() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      if (this?.dataCompany?._id) {
        const response = await GetDesignationAPI(querySuperAdmin);
        if (response.status === 401) {
          return (window.location.href = "/login");
        }
        this.designation = response.data;
      }
    },
    async handleAddEmployment() {
      const employment = {
        ...this.employment,
        emp_depid: this.employment.emp_depid?._id,
        emp_desid: this.employment.emp_desid?._id,
        emp_fsuperior: this.employment.emp_fsuperior?.des_name,
        emp_ssuperior: this.employment.emp_ssuperior?.des_name,
      };

      const data = {
        ...this.personal,
        ...employment,
      };
      const formData = new FormData();
      formData.append("profile", this.$store.state.file);
      formData.append("attadance", JSON.stringify(this.attadance_day));
      for (const key in data) {
        formData.append(key, data[key]);
      }
      const response = await AddEmploymentAPI(
        formData,
        `?company=${this.dataCompany?._id}`
      );
      if (response.status === 200) {
        this.getEmployement();
        this.closeModal();
        this.tabActive = "Personal";
        this.$store.commit("unSetFile");
        for (const key in this.personal) {
          this.personal[key] = "";
        }
        for (const key in this.employment) {
          this.employment[key] = "";
        }
        for (const key in this.attadance_day) {
          this.attadance_day[key].off_day = false;
          this.attadance_day[key].shift = "";
        }
      }
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetDepartement();
        this.handleGetDesignation();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getCompany();
    // this.handleGetDepartement();
  },
};
</script>

<style scoped></style>
