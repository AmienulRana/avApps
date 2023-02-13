<template>
  <section
    class="min-h-screen custom-srollbar overflow-y-custom bg-primary px-5 py-5 duration-300 lg:static fixed top-7 md:top-0 left-0 z-10 lg:z-0"
    :class="[
      modeSidebar === 'icon' ? 'w-20' : 'w-64',
      showSidebar ? 'translateX-0-custom' : '-translateX-full-custom',
    ]"
  >
    <nav class="text-center m-auto">
      <h1
        class="text-2xl hidden md:block text-white text-center duration-300 h-8 truncate"
      >
        {{ company_header || company_name }}
        <!-- M<span :class="modeSidebar === 'icon' ? 'scale-0 hidden' : ''"
          >ufidah Group</span
        > -->
      </h1>
      <span
        class="w-full h-px bg-white mt-5 lg:opacity-80 opacity-0 block"
      ></span>

      <section class="flex relative items-center text-white text-md my-4">
        <div
          class="bg-icon flex items-center justify-center bg-blue-500"
          :class="{ 'mr-3': modeSidebar !== 'icon' }"
        >
          <font-awesome-icon icon="fa-home-alt" class="text-lg" />
        </div>
        <router-link to="/" @click="isOpen = ''">
          <p
            class="text-sm duration-300"
            :class="[
              modeSidebar === 'icon' ? 'scale-0 invisible' : '',
              {
                'absolute top-0 z-10 w-60 accordion-content px-6 bg-primary':
                  this.modeSidebar === 'icon',
              },
            ]"
          >
            Dashboard
          </p>
        </router-link>
      </section>
      <template v-for="(menu, i) in menuSidebar" :key="i">
        <Accordion
          class="text-white text-md my-4 m-auto relative"
          @click:header="handleToggleAccordion(menu.title)"
          :isOpen="isOpen === menu.title"
          :icon="false"
          :contentClass="{
            'absolute top-0 z-20 w-60 accordion-content px-6 bg-primary':
              this.modeSidebar === 'icon',
          }"
        >
          <template v-slot:header>
            <section
              class="flex items-center justify-between w-full"
              @mouseenter="handleDisplayAccordion(menu.title)"
            >
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
            <section @mouseleave="modeSidebar === 'icon' ? (isOpen = '') : ''">
              <p
                class="text-sm duration-300"
                :class="modeSidebar === 'icon' ? 'block' : 'hidden'"
              >
                {{ menu.title }}
              </p>
              <p
                class="my-3 text-white list-disc flex items-center"
                v-for="(submenu, index) in menu.contents"
                :key="index"
              >
                <span class="block bg-white rounded-full mr-3" />
                <router-link :to="`${submenu.to}`">{{
                  submenu.text
                }}</router-link>
              </p>
            </section>
          </template>
        </Accordion>
      </template>
      <section
        class="flex relative cursor-pointer items-center text-white text-md my-4"
        @click="handleLogout"
      >
        <div
          class="bg-icon flex items-center -rotate-180 justify-center bg-blue-500"
          :class="{ 'mr-3': modeSidebar !== 'icon' }"
        >
          <font-awesome-icon icon="fa-right-from-bracket" />
        </div>
        <p
          class="text-sm duration-300"
          :class="[
            modeSidebar === 'icon' ? 'scale-0 invisible' : '',
            {
              'absolute top-0 z-10 w-60 accordion-content px-6 bg-primary':
                this.modeSidebar === 'icon',
            },
          ]"
        >
          Logout
        </p>
      </section>
    </nav>
  </section>
</template>

<script>
import Accordion from "../Accordion.vue";
import decryptToken from "@/utils/decryptToken";

export default {
  name: "SidebarComponent",
  props: {
    modeSidebar: String,
    showSidebar: Boolean,
  },
  components: { Accordion },
  data() {
    return {
      isOpen: this.$store.state.sidebarMenuActive,
      accordionPosition: this.modeSidebar === "icon" ? "side" : "down",
      company_name: "",
      company_header: null,
      menuSidebar: [
        {
          title: "Organization",
          icon: "fa-user-tie",
          contents: [
            { text: "Department", to: "/organisasi/departemen" },
            { text: "Designation", to: "/organisasi/jabatan" },
          ],
        },
        {
          title: "Employee",
          icon: "fa-users",
          contents: [
            { text: "Employment Data", to: "/employee" },
            { text: "Employment Status", to: "/employee-status" },
            { text: "Warning", to: "/employee-warning" },
            { text: "Mutasi / Resign", to: "/designation" },
          ],
        },
        {
          title: "Request",
          icon: "fa-clock",
          contents: [
            { text: "Leave Request", to: "/leave-request" },
            { text: "Overtime Request", to: "/overtime-request" },
            { text: "Outside Assignment", to: "/outside-assignment" },
            { text: "Change Work Shift", to: "/change-shift" },
            { text: "Change Off Day", to: "/change-off" },
            { text: "Need Approval", to: "/need-approval" },
          ],
        },
        {
          title: "Attendance",
          icon: "fa-calendar",
          contents: [
            { text: "Daily Log Attendance", to: "/attedance/daily" },

            { text: "Attendance Detail", to: "/attedance/detail" },
            {
              text: "Setting Cuti Bersama / Off Days",
              to: "/attedance/setting-cuti",
            },
            { text: "Setting Work Shift", to: "/attedance/setting-workshift" },
          ],
        },
        {
          title: "Payroll",
          icon: "fa-credit-card",
          contents: [
            {
              text: "Create Payslip",
              to: "/payroll/nominatif",
            },
          ],
        },
        {
          title: "Administration",
          icon: "fa-briefcase",
          contents: [
            // { text: "Users & Roles", to: "/administration/user-and-roles" },
            { text: "Holiday", to: "/administration/holiday" },
            { text: "Announcements", to: "/administration/announcements" },
          ],
        },
        {
          title: "Settings",
          icon: "fa-gear",
          contents: [
            {
              text: "Allowance & Deduction Settings",
              to: "/setting/allowance-deduction",
            },
            {
              text: "Periodic Settings",
              to: "/setting/periodic",
            },
            {
              text: "Location Settings",
              to: "/setting/location",
            },
            { text: "Leave Settings", to: "/setting/leave" },
            { text: "App Settings", to: "/setting/app" },
          ],
        },
      ],
    };
  },
  methods: {
    handleToggleAccordion(value) {
      if (value === this.isOpen) {
        this.isOpen = "";
      } else {
        this.$store.commit("changeSidebarMenu", value);
        this.isOpen = this.$store.state.sidebarMenuActive;
        localStorage.setItem("sidebarMenuActive", value);
      }
    },
    handleDisplayAccordion(value) {
      if (this.modeSidebar === "icon") {
        this.accordionPosition = "side";
        this.isOpen = value;
      }
    },
    handleLogout() {
      this.$store.commit("changeIsLoggedIn", false);
      this.$store.commit("setToken", undefined);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
  mounted() {
    if (this.$route.path === "/") {
      this.isOpen = "";
    } else {
      this.isOpen = localStorage.getItem("sidebarMenuActive");
    }
    const payload = decryptToken();
    this.company_name = payload?.company_name;
    this.company_header = payload?.company_header;
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
  min-width: 6px;
  min-height: 6px;
}
.bg-icon {
  min-width: 40px;
  min-height: 36px;
}
@media (max-width: 1023px) {
  .-translateX-full-custom {
    transform: translateX(-100%);
  }
  .translateX-0-custom {
    transform: translateX(0);
  }
  .overflow-y-custom {
    overflow-y: auto;
  }
}
</style>
