<template>
  <section class="min-h-screen bg-primary w-64 px-5 py-5 hidden md:block">
    <nav class="text-center">
      <h1 class="text-2xl text-white">Mufidah Group</h1>
      <span class="w-full h-px bg-white mt-5 opacity-80 block"></span>

      <section class="flex items-center text-white text-md my-4">
        <router-link to="/">
          <div
            class="w-10 h-9 flex items-center justify-center bg-blue-500 mr-3"
          >
            <font-awesome-icon icon="fa-home-alt" class="text-lg" />
          </div>
          <p>Dashboard</p>
        </router-link>
      </section>
      <SidebarMenuAccordion
        title="Organisasi"
        icon="fa-user-tie"
        :contents="[
          {
            text: 'departemen',
            to: '/organisasi/departemen',
          },
          { text: 'jabatan', to: '/organisasi/jabatan' },
        ]"
      />
      <SidebarMenuAccordion
        title="Karyawan"
        icon="fa-users"
        :contents="[
          {
            text: 'Data karyawan',
            to: '/employee',
          },
          { text: 'Status Karyawan', to: '/employee-status' },
          { text: 'Peringatan', to: '/designation' },
          { text: 'Mutasi / Resign', to: '/designation' },
        ]"
      />
      <SidebarMenuAccordion
        title="Pengajuan"
        icon="fa-clock"
        :contents="[
          {
            text: 'Leave Request',
            to: '/leave-request',
          },
        ]"
      />
      <SidebarMenuAccordion
        title="Absensi"
        icon="fa-calendar"
        :contents="[
          {
            text: 'Daily Log Absensi',
            to: '/attedance/daily',
          },
        ]"
      />
      <SidebarMenuAccordion
        title="Payroll"
        icon="fa-credit-card"
        :contents="[
          {
            text: 'Daftar Nominatif Penerima gaji',
            to: '/payroll/nominatif',
          },
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

<style scoped></style>
