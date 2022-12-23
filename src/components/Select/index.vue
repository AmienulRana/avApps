<template>
  <div class="flex justify-between items-center mb-5">
    <label :class="label_class" class="text-sm text-gray-400 w-1/5">{{
      label
    }}</label>
    <select
      class="
        w-full
        border border-gray-600
        focus:outline focus:outline-primary
        pr-2
        py-1.5
        bg-white
        rounded-md
      "
      :class="input_class ? input_class : ''"
    >
      <option v-for="(option, i) in options" :key="i">{{ option }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    icon: Boolean,
    label: String,
    input_class: String,
    options: Array,
  },
};
</script>

<style scoped>
</style>