<template>
  <section class="flex bg-primary h-auto" @click="showDropdown = false">
    <KeepAlive>
      <Sidebar :modeSidebar="modeSidebar" :showSidebar="showSidebar" />
    </KeepAlive>
    <main
      class="relative w-full min-h-screen bg-whitesmoke main-content"
      @click="showSidebar = false"
    >
      <section
        class="bg-white w-full px-8 py-6 shadow-md flex justify-between items-center z-20 fixed lg:static"
      >
        <font-awesome-icon
          icon="fa-bars"
          class="w-6 h-6 text-primary lg:hidden"
          @click.stop="showSidebar = !showSidebar"
        />
        <font-awesome-icon
          icon="fa-bars"
          class="w-6 h-6 text-primary hidden lg:block"
          @click="handleChangeSidebar"
        />
        <div class="flex items-center">
          <font-awesome-icon
            icon="fa-expand"
            class="w-6 h-6 text-primary mx-2"
          />
          <font-awesome-icon icon="fa-moon" class="w-6 h-6 text-primary mx-2" />
          <NavbarProfile
            @click="showDropdown = $event"
            :showDropdown="showDropdown"
          />
        </div>
      </section>
      <section class="mt-24 lg:mt-0">
        <slot />
      </section>
    </main>
  </section>
</template>

<script>
import Sidebar from "../Sidebar/Sidebar.vue";
import NavbarProfile from "../NavbarProfile.vue";
export default {
  name: "LayoutAdmin",
  components: { Sidebar, NavbarProfile },
  data() {
    return {
      modeSidebar: "full",
      showSidebar: false,
      showDropdown: false,
    };
  },
  methods: {
    handleChangeSidebar() {
      this.modeSidebar = this.modeSidebar === "icon" ? "full" : "icon";
      localStorage.setItem("modeSidebar", this.modeSidebar);
    },
  },
  mounted() {
    const modeSidebar = localStorage.getItem("modeSidebar");
    this.modeSidebar = modeSidebar;
    let currentTime = Date.now();

    // Set a timer for one hour
    setTimeout(function () {
      // Remove the JWT token from local storage after one hour
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
    }, 3600 * 1000 - (Date.now() - currentTime));
  },
};
</script>

<style scoped>
.main-content {
  overflow-x: hidden;
}
</style>
