<template>
  <div class="md:flex justify-between items-center">
    <label
      :class="label_class ? label_class : 'md:w-1/5 text-gray-400'"
      class="text-sm"
      >{{ label }}</label
    >
    <select
      class="w-full border border-gray-600 focus:outline focus:outline-primary px-3 py-1.5 bg-white rounded-md text-sm"
      :class="input_class ? input_class : ''"
      :disabled="disabled"
    >
      <option v-for="(option, i) in options" :key="i" class="px-2 py-1">
        {{ option }}
      </option>
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
    label_class: String,
    options: Array,
    disabled: Boolean,
  },
};
</script>

<style scoped></style>
