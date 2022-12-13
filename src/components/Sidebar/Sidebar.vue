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
      <SidebarMenuAccordion title="Employee" icon="fa-users" />
      <SidebarMenuAccordion title="Leave" icon="fa-reguler fa-clock" />
      <SidebarMenuAccordion title="Attedance" icon="fa-calendar" />
      <SidebarMenuAccordion title="Payroll" icon="fa-credit-card" />
      <SidebarMenuAccordion title="Administration" icon="fa-briefcase" />
      <SidebarMenuAccordion title="Settings" icon="fa-gear" />
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