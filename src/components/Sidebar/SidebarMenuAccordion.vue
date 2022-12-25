<template>
  <Accordion class="text-white text-md my-4">
    <template v-slot:header>
      <section class="flex items-center">
        <div class="w-10 h-9 flex items-center justify-center bg-blue-500 mr-3">
          <font-awesome-icon :icon="icon" class="text-lg" />
        </div>
        <p class="text-sm">{{ title }}</p>
      </section>
    </template>
    <template v-slot:content>
      <p
        class="mt-2 text-gray-300 hover:text-white list-disc flex items-center"
        v-for="(content, index) in contents"
        :key="index"
      >
        <span class="block bg-gray-400 rounded-full mr-2" />
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
p.text-gray-300 {
  font-size: 12.5px;
}
p.text-gray-300:hover > span {
  background-color: white !important;
}
p > span {
  min-width: 6px;
  min-height: 6px;
}
</style>
