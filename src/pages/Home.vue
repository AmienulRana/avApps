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
        class="grid flex-wrap relative lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 lg:gap-8 md:gap-4 my-8"
      >
        <section
          class="card-detail-company mb-3 md:mb-0 rounded-md shadow-md w-full md:p-8 p-4 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-user" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">{{ data?.total_employment }}</p>
            <p class="text-xs text-gray-400">Total employees</p>
          </div>
        </section>
        <section
          class="card-detail-company mb-3 md:mb-0 rounded-md shadow-md w-full md:p-8 p-4 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-home-alt" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">{{ data?.total_departement }}</p>
            <p class="text-xs text-gray-400">Total departement</p>
          </div>
        </section>
        <section
          class="card-detail-company mb-3 md:mb-0 rounded-md shadow-md w-full md:p-8 p-4 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-pen-to-square" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">
              {{ data?.total_leave }}
            </p>
            <p class="text-xs text-gray-400">Total leave request</p>
          </div>
        </section>
        <section
          class="card-detail-company mb-3 md:mb-0 rounded-md shadow-md w-full md:p-8 p-4 flex items-center"
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
        <Loading v-if="loading.getData" />
      </section>

      <section class="md:grid gap-6 grid-cols-4 mb-6">
        <section class="col-span-3 mb-10 relative">
          <EmployementStatistic
            :total_employment_status="data.total_employment_status"
            :departement_statistic="data.departement_statistic"
            :designation_statistic="data.designation_statistic"
          />
          <Loading v-if="loading.getData" />
        </section>
        <section class="col-span-1 relative">
          <AttedanceStatistic />
          <Loading v-if="loading.getData" />
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
import { GetAllCompanyAPI, GetDahsboardAPI } from "@/actions/company";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import Loading from "@/components/Loading.vue";
import { useToast } from "vue-toastification";

export default {
  name: "DashboardPage",
  data() {
    return {
      showSelectCompany: false,
      superAdmin: false,
      options: [],
      dataCompany: {},
      loadingData: true,
      loading: {
        company: true,
        getData: true,
      },
      data: {
        total_employment: 0,
        total_departement: 0,
        total_leave: 0,
        total_employment_status: [],
        departement_statistic: [],
      },
    };
  },
  components: {
    LayoutAdmin,
    Loading,
    EmployementStatistic,
    AttedanceStatistic,
    ChoiseCompany,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.company = false;
    },
    async handleGetDashboard() {
      this.loading.getData = true;
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDahsboardAPI(querySuperAdmin);
      const data = response?.data;
      if (response?.status === 401) {
        this.$router.push("/login");
        this.toast.error(response?.data?.message);
        this.$store.commit("changeIsLoggedIn", false);
      } else if (response?.status === 200) {
        this.data.total_departement = data?.total_departement;
        this.data.total_employment = data?.total_employment;
        this.data.total_leave = data?.total_leave;
        this.data.total_employment_status = data?.employment_status;
        this.data.departement_statistic = data?.departement_statistic;
        this.data.designation_statistic = data?.designation_statistic;
        this.loading.getData = false;
      }
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetDashboard();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getAllCompany();
  },
};
</script>

<style scoped>
.card-detail-company {
  background: white;
}
</style>
