<template>
  <section class="flex bg-primary h-auto">
    <Sidebar />
    <main class="relative w-full min-h-screen bg-whitesmoke overflow-x-hidden">
      <Navbar />
      <slot />
    </main>
  </section>
</template>

<script>
import Sidebar from "../Sidebar/Sidebar.vue";
import Navbar from "../Navbar.vue";
export default {
  name: "LayoutAdmin",
  components: { Sidebar, Navbar },
};
</script>

<style scoped>
</style>