<template>
  <Accordion class="text-white text-md my-4">
    <template v-slot:header>
      <section class="flex items-center">
        <div class="w-10 h-9 flex items-center justify-center bg-blue-800 mr-3">
          <font-awesome-icon :icon="icon" class="text-lg" />
        </div>
        <p>{{ title }}</p>
      </section>
    </template>
    <template v-slot:content>
      <p class="mt-2"><router-link to="/employee">Employee</router-link></p>
      <p class="mt-2">
        <router-link to="/designation">Designation</router-link>
      </p>
      <p class="mt-2">
        <router-link to="/employee-status">Employment Status</router-link>
      </p>
    </template>
  </Accordion>
</template>

<script>
import Accordion from "../Accordion.vue";
export default {
  name: "SidebarMenuAccordion",
  components: { Accordion },
  props: {
    icon: String,
    title: String,
  },
};
</script>

<style scoped>
</style>