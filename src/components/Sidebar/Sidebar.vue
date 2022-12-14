<template>
  <section class="min-h-screen bg-primary w-64 px-5 py-5">
    <nav class="text-center">
      <h1 class="text-2xl text-white">Mufidah Group</h1>
      <span class="w-full h-px bg-white mt-5 opacity-80 block"></span>

      <section class="flex items-center text-white text-md my-4">
        <div class="w-10 h-9 flex items-center justify-center bg-blue-800 mr-3">
          <font-awesome-icon icon="fa-user-tie" class="text-lg" />
        </div>
        <p>Dashboard</p>
      </section>
      <SidebarMenuAccordion
        title="Employee"
        icon="fa-users"
        :contents="[
          {
            text: 'All Employees',
            to: '/employee',
          },
          { text: 'Designation', to: '/designation' },
          { text: 'Employment Status', to: '/employee-status' },
        ]"
      />
      <SidebarMenuAccordion
        title="Leave"
        icon="fa-reguler fa-clock"
        :contents="[
          {
            text: 'Leave Status',
            to: '/leave-status',
          },
          { text: 'Leave Request', to: '/leave-request' },
          { text: 'Calendar', to: '/leave-calendar' },
          { text: 'Summary', to: '/leave-summary' },
        ]"
      />
      <SidebarMenuAccordion
        title="Attedance"
        icon="fa-calendar"
        :contents="[
          {
            text: 'Daily Log',
            to: '/attedance-daily',
          },
          { text: 'Attedance Request', to: '/attedance-request' },
          { text: 'Attedance Details', to: '/attedance-details' },
          { text: 'Summary', to: '/attedance-summary' },
        ]"
      />
      <SidebarMenuAccordion
        title="Payroll"
        icon="fa-credit-card"
        :contents="[
          {
            text: 'Payrun',
            to: '/payroll-run',
          },
          { text: 'Payslip', to: '/payroll-slip' },
          { text: 'Summary', to: '/payroll-summary' },
          { text: 'Beneficiary badge', to: '/payroll-beneficiary' },
        ]"
      />
      <SidebarMenuAccordion
        title="Administration"
        icon="fa-briefcase"
        :contents="[
          {
            text: 'Users & Roles',
            to: '/user-roles',
          },
          { text: 'Work Shifts', to: '/work-shifts' },
          { text: 'Departements', to: '/departements' },
          { text: 'Holiday', to: '/holiday' },
          { text: 'Org. Structure', to: '/org-structure' },
          { text: 'Announcements', to: '/announcements' },
        ]"
      />
      <SidebarMenuAccordion
        title="Settings"
        icon="fa-gear"
        :contents="[
          {
            text: 'App Settings',
            to: '/setting-app',
          },
          { text: 'Leave Settings', to: '/setting-leave' },
          { text: 'Attedance Settings', to: '/setting-attadance' },
          { text: 'Payroll Settings', to: '/setting-payroll' },
          { text: 'Import', to: '/setting-import' },
        ]"
      />
    </nav>
  </section>
</template>

<script>
import SidebarMenuAccordion from "./SidebarMenuAccordion.vue";

export default {
  name: "SidebarComponent",
  components: { SidebarMenuAccordion },
};
</script>

<style scoped>
</style>