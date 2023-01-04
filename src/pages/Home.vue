<template>
  <LayoutAdmin>
    <section class="md:px-8 px-4 mt-6 w-full">
      <div class="flex items-center">
        <h1 class="md:text-2xl text-lg">Dashboard</h1>
        <ChoiseCompany
          v-if="superAdmin && !loading.company"
          @selected:company="dataCompany = $event"
          :options="options"
          :dataCompany="dataCompany"
        />
      </div>
      <section
        class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 lg:gap-8 md:gap-4 my-8"
      >
        <section
          class="card-detail-company rounded-md shadow-md w-full md:p-8 p-4 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-user" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">14</p>
            <p class="text-xs text-gray-400">Total employees</p>
          </div>
        </section>
        <section
          class="card-detail-company rounded-md shadow-md w-full md:p-8 p-4 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-home-alt" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">7</p>
            <p class="text-xs text-gray-400">Total departement</p>
          </div>
        </section>
        <section
          class="card-detail-company rounded-md shadow-md w-full md:p-8 p-4 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-pen-to-square" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">2</p>
            <p class="text-xs text-gray-400">Total leave request</p>
          </div>
        </section>
        <section
          class="card-detail-company rounded-md shadow-md w-full md:p-8 p-4 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-user-xmark" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">0</p>
            <p class="text-xs text-gray-400">On leave today</p>
          </div>
        </section>
      </section>

      <section class="md:grid gap-6 grid-cols-4 mb-6">
        <EmployementStatistic class="col-span-3 mb-10" />
        <section class="col-span-1">
          <AttedanceStatistic />
        </section>
      </section>
    </section>
  </LayoutAdmin>
</template>

<script>
import EmployementStatistic from "@/components/EmployementStatistic.vue";
import AttedanceStatistic from "@/components/AttendanceStatistic.vue";
import LayoutAdmin from "../components/Layout/Admin.vue";
import decryptToken from "@/utils/decryptToken";
import { GetAllCompanyAPI } from "@/actions/company";
import ChoiseCompany from "@/components/ChoiseCompany.vue";

export default {
  name: "DashboardPage",
  data() {
    return {
      showSelectCompany: false,
      superAdmin: false,
      options: [],
      dataCompany: {},
      loading: {
        company: true,
      },
    };
  },
  components: {
    LayoutAdmin,
    EmployementStatistic,
    AttedanceStatistic,
    ChoiseCompany,
  },
  methods: {
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.company = false;
    },
  },
  mounted() {
    // const payload = decrypt
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
  },
};
</script>

<style scoped>
.card-detail-company {
  margin-bottom: 10px;
  background: white;
}
</style>
