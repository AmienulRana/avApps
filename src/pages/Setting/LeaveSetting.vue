<template>
  <LayoutAdmin>
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex items-center mb-10">
        <h1 class="text-lg md:text-2xl">Leave Settings</h1>
        <ChoiseCompany
          v-if="superAdmin && !loading.company"
          @selected:company="dataCompany = $event"
          :options="options"
          :dataCompany="dataCompany"
        />
      </section>
      <section
        class="flex justify-between flex-col md:flex-row w-full h-auto mb-6"
      >
        <section class="w-full bg-white">
          <LeaveTypeSetting v-if="sideTabActive === 'Leave Type'" />
        </section>
      </section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Loading from "../../components/Loading.vue";
import LeaveTypeSetting from "@/components/LeaveTypeSetting.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import decryptToken from "@/utils/decryptToken";

export default {
  name: "LeaveSetting",
  components: {
    LayoutAdmin,
    LeaveTypeSetting,
    Loading,
    ChoiseCompany,
  },
  data() {
    return {
      titleTabs: [{ name: "Leave Type" }],
      sideTabActive: "Leave Type",
      personal_detail: {
        company_id: "",
      },
      superAdmin: false,
      options: [],
      dataCompany: {},
      loadingData: false,
      loading: {
        company: true,
      },
    };
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
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
  },
};
</script>

<style scoped>
.profile {
  min-width: 128px;
  min-height: 128px;
}
</style>
