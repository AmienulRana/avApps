<template>
  <Modal :showModal="showModal" title="Add Employee" @close="closeModal">
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
                <template v-if="!personal.profile">
                  <font-awesome-icon
                    icon="fa-camera-alt"
                    class="text-2xl text-primary"
                  />
                  <p class="text-center text-gray-400 mt-2">Update Photo</p>
                </template>
                <img
                  :src="personal.profile"
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
              :value="personal.first_name"
              @change="personal.first_name = $event"
            />
            <Input
              label="Nama Belakang"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.last_name"
              @change="personal.last_name = $event"
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
              :value="personal.nik_ktp"
              @change="personal.nik_ktp = $event"
            />
            <Input
              label="Phone number"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.phone_number"
              @change="personal.phone_number = $event"
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
                  :checked="personal.gender === 'Laki-Laki'"
                  @change="personal.gender = 'Laki-Laki'"
                />
                <Radio
                  label="Perempuan"
                  class="mr-5"
                  :checked="personal.gender === 'Perempuan'"
                  value="Perempuan"
                  @change="personal.gender = 'Perempuan'"
                />
              </div>
            </div>
            <Select
              label="Marital Status"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.marital_status"
              @change="personal.marital_status = $event"
              :options="['Belum menikah', 'sudah menikah']"
            />
            <Input
              label="Tgl. Lahir"
              type="date"
              input_class="md:w-4/6 w-full mt-1"
              class="mb-2.5"
              :value="personal.date_birthday"
              @change="personal.date_birthday = $event"
            />
            <SelectSearch
              :options="['O+', 'O-', 'A+', 'A-']"
              label="Golongan Darah"
              input_class="w-full md:w-4/6 mt-1"
              position="top"
              :selectedOption="personal.blood_type"
              :isOpen="show_select === 'gol'"
              @handleShowSelect="show_select = 'gol'"
              @selected="personal.blood_type = $event"
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
              label="NIK Karyawan"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.nik_karyawan"
              @change="employment.nik_karyawan = $event"
            />
            <SelectSearch
              :options="['Administration', 'IT']"
              label="Departement"
              position="bottom"
              input_class="md:w-4/6 mt-2"
              :isOpen="show_select === 'departemen'"
              @handleShowSelect="show_select = 'departemen'"
              :selectedOption="employment.departement"
              @selected="employment.departement = $event"
            />
            <SelectSearch
              :options="['Project Mananger', 'Developer']"
              label="Jabatan"
              position="bottom"
              input_class="md:w-4/6 mt-2"
              :isOpen="show_select === 'jabatan'"
              @handleShowSelect="show_select = 'jabatan'"
              :selectedOption="employment.designation"
              @selected="employment.designation = $event"
            />
            <Select
              label="Status Karyawan"
              input_class="md:w-4/6 mt-2"
              class="mb-2.5"
              :value="employment.status_karyawan"
              @change="employment.status_karyawan = $event"
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
              :selectedOption="employment.atasan.first"
              @selected="employment.atasan.first = $event"
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
              :selectedOption="employment.atasan.second"
              @selected="employment.atasan.second = $event"
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
              :disabled="attadance_day[day.name.toLowerCase()].is_cuti"
              :value="attadance_day[day.name.toLowerCase()].shift"
              @change="attadance_day[day.name.toLowerCase()].shift = $event"
            />
            <SwitchButton
              @update:model="
                (value) =>
                  (attadance_day[day.name.toLowerCase()].is_cuti = value)
              "
              :value="attadance_day[day.name.toLowerCase()].is_cuti"
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

export default {
  name: "ModalAddEmployee",
  components: {
    Modal,
    Input,
    Select,
    SelectSearch,
    Radio,
    SwitchButton,
  },
  props: { showModal: Boolean, closeModal: Function },
  data() {
    return {
      show_select: "",
      personal: {
        profile: null,
        first_name: "",
        last_name: "",
        email: "",
        nik_ktp: "",
        phone_number: null,
        gender: "",
        marital_status: "",
        date_birthday: "",
        blood_type: "",
      },
      employment: {
        username: "",
        nik_karyawan: "",
        departement: "",
        designation: "",
        status_karyawan: "",
        tanggungan: "",
        atasan: {
          first: "",
          second: "",
        },
        location: "",
      },
      attadance_day: {
        senin: { shift: "", is_cuti: false },
        selasa: { shift: "", is_cuti: false },
        rabu: { shift: "", is_cuti: false },
        kamis: { shift: "", is_cuti: false },
        jumat: { shift: "", is_cuti: false },
        sabtu: { shift: "", is_cuti: false },
        minggu: { shift: "", is_cuti: false },
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
        { name: "Senin", isCuti: false },
        { name: "Selasa", isCuti: false },
        { name: "Rabu", isCuti: false },
        { name: "Kamis", isCuti: false },
        { name: "Jumat", isCuti: false },
        { name: "Sabtu", isCuti: false },
        { name: "Minggu", isCuti: false },
      ],
      tabActive: "Personal",
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
      const files = e.target.files[0];
      const file = URL.createObjectURL(files);
      this.personal.profile = file;
    },
    handleAddEmployment() {
      const data = {
        personal: this.personal,
        employment: this.employment,
        attadance: this.attadance_day,
        basic_salary: this.basic_salary,
      };
    },
  },
};
</script>

<style scoped></style>
