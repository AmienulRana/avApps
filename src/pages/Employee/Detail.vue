<template>
  <LayoutAdmin>
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between">
        <h1 class="text-lg md:text-2xl">
          Employee Detail |
          <router-link to="/employee" class="text-sm text-primary"
            >Back to all employee</router-link
          >
        </h1>
      </section>
      <section
        class="bg-white w-full shadow-md md:h-64 py-3 my-6"
        v-if="loading"
      >
        <Loading />
      </section>
      <section
        v-else
        class="bg-white w-full grid shadow-md md:h-64 md:grid-cols-2 lg:grid-cols-3 gap-3 py-3 my-6"
      >
        <section
          class="flex px-6 py-4 flex-col md:flex-row items-center md:items-start"
        >
          <img
            :src="`${urlImageServer}/${personal_detail.emp_profile}`"
            alt="profile image"
            class="profile w-32 h-32 rounded-full"
            v-if="personal_detail?.emp_profile"
          />
          <div
            v-else
            class="profile w-32 h-32 flex justify-center items-center rounded-full bg-zinc-400"
          >
            <h2 class="text-3xl text-white">
              {{
                personal_detail?.emp_fullname.substr(0, 1) +
                personal_detail?.emp_fullname.substr(
                  personal_detail?.emp_fullname.indexOf(" ") + 1,
                  1
                )
              }}
            </h2>
          </div>
          <div class="md:ml-9 ml-0 text-center md:text-start">
            <h1 class="md:text-xl mt-2 text-base">
              {{ personal_detail?.emp_fullname }}
            </h1>
            <Button
              class="bg-primary m-auto md:mx-0 px-4 text-sm py-1 my-2 text-white rounded-full"
              :class="
                employment?.emp_status === 'Permanent'
                  ? 'bg-blue-500'
                  : employment?.emp_status === 'Probation'
                  ? 'bg-orange-500'
                  : 'bg-red-600'
              "
            >
              {{ employment?.emp_status }}</Button
            >
            <p class="text-sm text-gray-400">
              {{ employment.emp_desid?.des_name }}
            </p>
            <p class="text-sm text-gray-400"></p>
            <p class="text-sm text-gray-400">
              {{ employment.emp_depid?.dep_name }}
            </p>
          </div>
        </section>
        <section class="md:border-x h-max mb-6">
          <section class="px-6 py-4">
            <div class="flex items-center mb-5">
              <font-awesome-icon
                icon="fa-briefcase"
                class="text-2xl w-10 text-primary"
              />
              <div class="ml-3">
                <p class="text-sm text-gray-400">Departemen</p>
                <p class="text-sm opacity-80">
                  {{ employment.emp_depid?.dep_name }}
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <font-awesome-icon
                icon="fa-clock"
                class="text-2xl w-10 text-primary"
              />
              <div class="ml-3">
                <p class="text-sm text-gray-400">Work Shifts</p>
                <p class="text-sm opacity-80">
                  {{ employment.emp_depid?.dep_workshift }}
                </p>
              </div>
            </div>
          </section>
          <section class="px-6 md:py-4 md:hidden">
            <div class="flex items-center mb-5">
              <font-awesome-icon
                icon="fa-dollar"
                class="text-2xl w-10 text-primary"
              />
              <div class="ml-3">
                <p class="text-sm text-gray-400">Salary</p>
                <p class="text-sm opacity-80">
                  $ 10,000
                  <span class="text-primary text-xs">(current)</span>
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <font-awesome-icon
                icon="fa-calendar"
                class="text-2xl w-10 text-primary"
              />
              <div class="ml-3">
                <p class="text-sm text-gray-400">Joining date</p>
                <p class="text-sm opacity-80">Not added yet</p>
              </div>
            </div>
          </section>
        </section>
        <section class="px-6 md:py-4 hidden md:block">
          <div class="flex items-center mb-5">
            <font-awesome-icon
              icon="fa-dollar"
              class="text-2xl w-10 text-primary"
            />
            <div class="ml-3">
              <p class="text-sm text-gray-400">Salary</p>
              <p class="text-sm opacity-80">
                $ 10,000
                <span class="text-primary text-xs">(current)</span>
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <font-awesome-icon
              icon="fa-calendar"
              class="text-2xl w-10 text-primary"
            />
            <div class="ml-3">
              <p class="text-sm text-gray-400">Joining date</p>
              <p class="text-sm opacity-80">Not added yet</p>
            </div>
          </div>
        </section>
      </section>
      <section
        class="flex justify-between flex-col md:flex-row w-full h-auto mb-6"
      >
        <section class="md:w-1/5 bg-white text-center shadow-md mb-6">
          <font-awesome-icon
            icon="fa-user"
            class="text-2xl text-primary my-10"
          />
          <ul class="text-left">
            <li
              class="cursor-pointer text-sm px-4 mb-4 truncate w-full"
              v-for="(title, i) in titleTabs"
              :class="
                sideTabActive === title.name ? 'text-primary' : 'text-gray-400'
              "
              @click="sideTabActive = title.name"
              :key="i"
            >
              <font-awesome-icon :icon="title.icon" class="w-4 h-4 mr-2" />
              {{ title.name }}
            </li>
          </ul>
        </section>
        <section class="md:w-3/4 w-full bg-white">
          <PersonalDetail
            v-if="sideTabActive === 'Personal Detail'"
            :personalDetail="personal_detail"
            :handleDetailEmployment="handleDetailEmployment.bind(this)"
          />
          <Employement
            v-if="sideTabActive === 'Employment'"
            :employment="employment"
            :handleDetailEmployment="handleDetailEmployment.bind(this)"
          />
          <Experience v-if="sideTabActive === 'Pendidikan dan Pengalaman'" />
          <Rekening v-if="sideTabActive === 'Rekening'" />
          <Payroll v-if="sideTabActive === 'Payroll'" />
          <Cuti v-if="sideTabActive === 'Cuti'" />
        </section>
      </section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import PersonalDetail from "../../components/PersonalDetail.vue";
import Loading from "../../components/Loading.vue";
import Employement from "../../components/Employement.vue";
import Experience from "../../components/Education.vue";
import Rekening from "../../components/Rekening.vue";
import Payroll from "../../components/Payroll.vue";
import Cuti from "../../components/Cuti.vue";
import { DetailEmployementAPI } from "@/actions/employment";
import { URL_IMAGES } from "@/config";

import Button from "@/components/Button.vue";
export default {
  name: "DetailEmployee",
  components: {
    LayoutAdmin,
    Button,
    PersonalDetail,
    Employement,
    Experience,
    Rekening,
    Payroll,
    Cuti,
    Loading,
  },
  data() {
    return {
      contents: [
        {
          text: "Payrun",
          to: "/payroll-run",
        },
        { text: "Payslip", to: "/payroll-slip" },
        { text: "Summary", to: "/payroll-summary" },
        { text: "Beneficiary badge", to: "/payroll-beneficiary" },
      ],
      titleTabs: [
        { name: "Personal Detail", icon: "fa-user" },
        { name: "Employment", icon: "fa-user-tie" },
        { name: "Pendidikan dan Pengalaman", icon: "fa-graduation-cap" },
        { name: "Rekening", icon: "fa-credit-card" },
        { name: "Payroll", icon: "fa-dollar" },
        { name: "Cuti", icon: "fa-calendar" },
      ],
      isOpenAccordion: false,
      loading: true,
      urlImageServer: URL_IMAGES,
      sideTabActive: "Personal Detail",
      personal_detail: {
        emp_firstname: "",
        emp_lastname: "",
        email: "",
        emp_nikktp: "",
        emp_phone: "",
        emp_profile: "",
        emp_marital_status: "",
        emp_gender: "",
        emp_fullname: "",
        emp_blood: "",
        company_id: "",
      },
      employment: {
        emp_status: "",
        username: "",
        emp_nik_karyawan: "",
        emp_depid: {},
        emp_desid: {},
        emp_fsuperior: "",
        emp_ssuperior: "",
        emp_location: "",
        emp_attadance: {},
        company_id: "",
      },
    };
  },
  methods: {
    handleAssignPersonalData(data) {
      this.personal_detail.emp_firstname = data?.emp_firstname;
      this.personal_detail.emp_lastname = data?.emp_lastname;
      this.personal_detail.emp_fullname = data?.emp_fullname;
      this.personal_detail.email = data?.email;
      this.personal_detail.emp_nikktp = data?.emp_nikktp;
      this.personal_detail.emp_gender = data?.emp_gender;
      this.personal_detail.emp_marital_status = data?.emp_marital_status;
      this.personal_detail.emp_birthday = data?.emp_birthday;
      this.personal_detail.emp_status = data?.emp_status;
      this.personal_detail.emp_phone = data?.emp_phone;
      this.personal_detail.emp_profile = data?.emp_profile;
      this.personal_detail.emp_blood = data?.emp_blood;
      this.personal_detail.company_id = data?.company_id?._id;
    },
    handleAssignEmploymentData(data) {
      const { employment } = this;
      employment.emp_status = data?.emp_status;
      employment.username = data?.username;
      employment.emp_nik_karyawan = data?.emp_nik_karyawan;
      employment.emp_depid = data?.emp_depid;
      employment.emp_desid = data?.emp_desid;
      employment.emp_fsuperior = data?.emp_fsuperior;
      employment.emp_ssuperior = data?.emp_ssuperior;
      employment.emp_location = data?.emp_location;
      employment.emp_attadance = data?.emp_attadance;
      employment.company_id = data?.company_id?._id;
    },
    async handleDetailEmployment() {
      const { id } = this.$route.params;
      const response = await DetailEmployementAPI(id);
      const data = response?.data;
      console.log(response.data);
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.handleAssignPersonalData(data);
      this.handleAssignEmploymentData(data);
      this.loading = false;
    },
  },
  mounted() {
    this.handleDetailEmployment();
  },
};
</script>

<style scoped>
.profile {
  min-width: 128px;
  min-height: 128px;
}
</style>
