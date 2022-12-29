<template>
  <LayoutAdmin>
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center">
        <h1 class="md:text-2xl text-lg">Dashboard</h1>
      </section>
      <section
        class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 md:gap-8 my-8"
      >
        <section
          class="bg-white rounded-md shadow-md w-full p-8 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-user" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">14</p>
            <p class="text-xs text-gray-400">Total employees</p>
          </div>
        </section>
        <section
          class="bg-white rounded-md shadow-md w-full p-8 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-home-alt" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">7</p>
            <p class="text-xs text-gray-400">Total departement</p>
          </div>
        </section>
        <section
          class="bg-white rounded-md shadow-md w-full p-8 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-pen-to-square" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">2</p>
            <p class="text-xs text-gray-400">Total leave request</p>
          </div>
        </section>
        <section
          class="bg-white rounded-md shadow-md w-full p-8 flex items-center"
        >
          <div
            class="bg-icon flex items-center justify-center bg-blue-500 w-12 h-12 rounded-md text-white"
          >
            <font-awesome-icon icon="fa-user-xmark" class="text-lg" />
          </div>
          <div class="ml-3">
            <p class="text-sm">0</p>
            <p class="text-xs text-gray-400">On leave today</p>
          </div>
        </section>
      </section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../components/Layout/Admin.vue";

export default {
  name: "DepartementPage",
  components: { LayoutAdmin },
};
</script>

<style scoped></style>
