<template>
  <LayoutAdmin>
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between mb-10">
        <h1 class="text-lg md:text-2xl">Leave Settings</h1>
      </section>
      <section
        class="flex justify-between flex-col md:flex-row w-full h-auto mb-6"
      >
        <section class="md:w-1/5 bg-white text-center shadow-md mb-6">
          <font-awesome-icon
            icon="fa-gear"
            class="text-3xl text-primary my-10"
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
              {{ title.name }}
            </li>
          </ul>
        </section>
        <section class="md:w-3/4 w-full bg-white">
          <LeaveTypeSetting v-if="sideTabActive === 'Leave Type'" />
          <Employement v-if="sideTabActive === 'Employment'" />
        </section>
      </section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Loading from "../../components/Loading.vue";
import Employement from "../../components/Employement.vue";
import LeaveTypeSetting from "@/components/LeaveTypeSetting.vue";

export default {
  name: "LeaveSetting",
  components: {
    LayoutAdmin,
    LeaveTypeSetting,
    Employement,
    Loading,
  },
  data() {
    return {
      titleTabs: [{ name: "Leave Type" }],
      loading: true,
      sideTabActive: "Leave Type",
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
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.profile {
  min-width: 128px;
  min-height: 128px;
}
</style>
