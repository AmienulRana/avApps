<template>
  <section class="flex bg-primary h-auto">
    <Sidebar :modeSidebar="modeSidebar" />
    <main class="relative w-full min-h-screen bg-whitesmoke overflow-x-hidden">
      <section class="bg-white w-full px-8 py-6 shadow-md flex justify-between">
        <font-awesome-icon
          icon="fa-bars"
          class="w-6 h-6 text-primary"
          @click="modeSidebar = modeSidebar === 'icon' ? 'full' : 'icon'"
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
};
</script>

<style scoped></style>
