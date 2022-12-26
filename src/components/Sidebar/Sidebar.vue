<template>
  <section
    class="min-h-screen bg-primary px-5 py-5 hidden md:block duration-300"
    :class="modeSidebar === 'icon' ? 'w-20' : 'w-64'"
  >
    <nav class="text-center m-auto">
      <h1 class="text-2xl text-white text-center duration-300 h-8 truncate">
        M<span :class="modeSidebar === 'icon' ? 'scale-0 hidden' : ''"
          >ufidah Group</span
        >
      </h1>
      <span class="w-full h-px bg-white mt-5 opacity-80 block"></span>

      <section class="flex items-center text-white text-md my-4">
        <div
          class="bg-icon flex items-center justify-center bg-blue-500"
          :class="{ 'mr-3': modeSidebar !== 'icon' }"
        >
          <font-awesome-icon icon="fa-home-alt" class="text-lg" />
        </div>
        <router-link to="/">
          <p
            class="text-sm duration-300"
            :class="modeSidebar === 'icon' ? 'hidden' : ''"
          >
            Dashboard
          </p>
        </router-link>
      </section>
      <template v-for="(menu, i) in menuSidebar" :key="i">
        <Accordion
          class="text-white text-md my-4 m-auto"
          @click:header="handleToggleAccordion(menu.title)"
          :isOpen="isOpen === menu.title"
          :icon="false"
        >
          <template v-slot:header>
            <section class="flex items-center justify-between w-full">
              <div class="flex items-center">
                <div
                  class="w-10 h-9 flex items-center justify-center bg-blue-500 mr-3"
                >
                  <font-awesome-icon :icon="menu.icon" class="text-lg" />
                </div>
                <p
                  class="text-sm duration-300"
                  :class="modeSidebar === 'icon' ? 'hidden' : ''"
                >
                  {{ menu.title }}
                </p>
              </div>
              <font-awesome-icon
                icon="fa-chevron-up w-6 h-6"
                class="duration-300 ease-in-out"
                :class="[
                  isOpen !== menu.title ? '' : 'rotate-180',
                  { 'scale-0': modeSidebar === 'icon' },
                ]"
              />
            </section>
          </template>
          <template v-slot:content>
            <p
              class="my-3 text-white list-disc flex items-center"
              v-for="(submenu, index) in menu.contents"
              :key="index"
            >
              <span class="block bg-white rounded-full mr-2" />
              <router-link :to="`${submenu.to}`">{{
                submenu.text
              }}</router-link>
            </p>
          </template>
        </Accordion>
      </template>
    </nav>
  </section>
</template>

<script>
import Accordion from "../Accordion.vue";

export default {
  name: "SidebarComponent",
  props: {
    modeSidebar: String,
  },
  components: { Accordion },
  data() {
    return {
      isOpen: "",
      menuSidebar: [
        {
          title: "Departement",
          icon: "fa-user-tie",
          contents: [
            { text: "departemen", to: "/organisasi/departemen" },
            { text: "jabatan", to: "/organisasi/jabatan" },
          ],
        },
        {
          title: "Karyawan",
          icon: "fa-users",
          contents: [
            { text: "Data karyawan", to: "/employee" },
            { text: "Status Karyawan", to: "/employee-status" },
            { text: "Peringatan", to: "/designation" },
            { text: "Mutasi / Resign", to: "/designation" },
          ],
        },
        {
          title: "Pengajuan",
          icon: "fa-clock",
          contents: [
            { text: "Leave Request", to: "/leave-request" },
            { text: "Overtime Request", to: "/overtime-request" },
            { text: "Outside Assignment", to: "/outsign-assignment" },
            { text: "Change Work Shift", to: "/change-shift" },
            { text: "Change Off Day", to: "/change-off" },
            { text: "Need Approval", to: "/need-approval" },
          ],
        },
        {
          title: "Absensi",
          icon: "fa-calendar",
          contents: [{ text: "Daily Log Absensi", to: "/attedance/daily" }],
        },
        {
          title: "Payroll",
          icon: "fa-credit-card",
          contents: [
            {
              text: "Daftar Nominatif Penerima gaji",
              to: "/payroll/nominatif",
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleToggleAccordion(value) {
      console.log(this.$route);
      if (value === this.isOpen) {
        this.isOpen = "";
      } else {
        this.isOpen = value;
      }
    },
  },
};
</script>

<style scoped>
p.text-white {
  font-size: 12.5px;
}
p.text-white:hover {
  color: rgb(89, 213, 255);
}
p.text-white:hover > span {
  background-color: rgb(89, 213, 255);
}
p > span {
  min-width: 5px;
  min-height: 5px;
}
.bg-icon {
  min-width: 40px;
  min-height: 36px;
}
</style>
