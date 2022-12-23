<template>
  <Accordion class="text-white text-md my-4">
    <template v-slot:header>
      <section class="flex items-center">
        <div class="w-10 h-9 flex items-center justify-center bg-blue-800 mr-3">
          <font-awesome-icon :icon="icon" class="text-lg" />
        </div>
        <p class="text-sm">{{ title }}</p>
      </section>
    </template>
    <template v-slot:content>
      <p class="mt-2 text-sm" v-for="(content, index) in contents" :key="index">
        <router-link :to="`${content.to}`">{{ content.text }}</router-link>
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
    contents: Array,
  },
};
</script>

<style scoped>
</style>