<template>
  <section class="flex bg-primary h-auto">
    <Sidebar />
    <main class="relative w-full min-h-screen bg-whitesmoke">
      <slot />
    </main>
  </section>
</template>

<script>
import Sidebar from "../Sidebar/Sidebar.vue";
export default {
  name: "LayoutAdmin",
  components: { Sidebar },
};
</script>

<style scoped>
</style>