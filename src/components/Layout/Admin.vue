<template>
  <section class="flex bg-primary h-auto">
    <KeepAlive>
      <Sidebar :modeSidebar="modeSidebar" />
    </KeepAlive>
    <main class="relative w-full min-h-screen bg-whitesmoke main-content">
      <section class="bg-white w-full px-8 py-6 shadow-md flex justify-between">
        <font-awesome-icon
          icon="fa-bars"
          class="w-6 h-6 text-primary"
          @click="handleChangeSidebar"
        />
        <div class="flex">
          <font-awesome-icon
            icon="fa-expand"
            class="w-6 h-6 text-primary mx-2"
          />
          <font-awesome-icon icon="fa-moon" class="w-6 h-6 text-primary mx-2" />
        </div>
      </section>
      <slot />
    </main>
  </section>
</template>

<script>
import Sidebar from "../Sidebar/Sidebar.vue";
export default {
  name: "LayoutAdmin",
  components: { Sidebar },
  data() {
    return {
      modeSidebar: "full",
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
