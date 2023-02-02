<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between">
        <section class="flex items-center">
          <h1 class="text-2xl">Need Approval</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading?.getCompany"
            @selected:company="dataCompany = $event"
            :options="optionsCompany"
            :dataCompany="dataCompany"
          />
        </section>
      </section>
      <section class="flex mt-6 flex-wrap w-10/12 items-center">
        <Button
          class="bg-white w-10 h-10 text-primary rounded-full shadow-md"
          @click="handleShowLayoutData"
        >
          <font-awesome-icon icon="fa-table" />
        </Button>
        <Dropdown
          title="Departemen"
          :showDropdown="activeDropdown === 'departemen'"
          @update:activeDropdown="(e) => changeDropdownActive('departemen')"
        />
        <Dropdown
          title="Workshift"
          :showDropdown="activeDropdown === 'workshift'"
          @update:activeDropdown="changeDropdownActive('workshift')"
        />
        <Dropdown
          title="See rejected"
          :showDropdown="activeDropdown === 'rejected'"
          @update:activeDropdown="changeDropdownActive('rejected')"
        />
        <Dropdown
          title="Overtime duration"
          :showDropdown="activeDropdown === 'duration'"
          @update:activeDropdown="changeDropdownActive('duration')"
        />
        <Dropdown
          title="Users"
          :showDropdown="activeDropdown === 'user'"
          @update:activeDropdown="changeDropdownActive('user')"
        />
      </section>
      <section class="w-full">
        <p class="text-sm text-gray-300 mt-5 mb-3">
          Showing 1 to 10 items of 11
        </p>
        <TableNeedApproval
          :overtime_request="overtime_requests"
          :showMessageStatus="showMessageStatus"
          :loading="loading.getOvertimeRequest"
          :getNeedApproval="getNeedApproval"
        />
      </section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Dropdown from "../../components/Dropdown.vue";
import TableNeedApproval from "../../components/TableNeedApproval.vue";
import { GetAllEmployementAPI } from "@/actions/employment";
import { GetAllCompanyAPI } from "@/actions/company";
import { GetNeedApprovalAPI } from "@/actions/need-approval";
import decryptToken from "@/utils/decryptToken";
import ChoiseCompany from "@/components/ChoiseCompany.vue";

export default {
  name: "OvertimeRequest",
  components: {
    LayoutAdmin,
    Button,
    ChoiseCompany,
    TableNeedApproval,
    Dropdown,
  },
  data() {
    return {
      activeDropdown: "",
      layoutData: "card",
      modal: {
        showModal: false,
        showSelect: false,
      },
      employment: [],
      optionsCompany: [],
      superAdmin: false,
      overtime_requests: [],
      dataCompany: {},
      loading: {
        getCompany: true,
        getOvertimeRequest: true,
        addOvertimeRequest: false,
      },
    };
  },
  methods: {
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    async handleGetEmployement() {
      const querySuperAdmin = `?company=${this.dataCompany._id}`;
      const response = await GetAllEmployementAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      const getIdNameEmp = response?.data?.map((employment) => ({
        _id: employment?._id,
        emp_name: employment?.emp_fullname,
      }));
      this.employment = getIdNameEmp;
    },
    async getNeedApproval() {
      this.loading.getOvertimeRequest = true;
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetNeedApprovalAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.overtime_requests = response.data;
      }
      this.loading.getOvertimeRequest = false;
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response.data;
      this.dataCompany = response.data[0];
      this.loading.getCompany = false;
    },
  },
  computed: {
    getAllEmployee() {
      return this.employee.map((employe) => employe.name);
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.handleGetEmployement();
        this.getNeedApproval();
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

<style scoped></style>
