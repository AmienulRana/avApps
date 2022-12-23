<template>
  <div class="flex justify-between items-center mb-5">
    <label
      :class="label_class"
      class="text-sm text-gray-400 w-1/5 min-w-max"
      v-if="label"
      >{{ label }}</label
    >
    <input
      :type="type"
      :placeholder="placeholder"
      class="
        w-full
        border border-gray-600
        focus:outline focus:outline-primary
        pr-2
        py-1.5
        form-input form-input:focus:bg-blue-300
        bg-white
        rounded
      "
      :class="[icon ? 'pl-8' : 'pl-2', input_class ? input_class : '']"
      autofocus
    />
  </div>
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    icon: Boolean,
    label: String,
    input_class: String,
    placeholder: String,
    type: {
      type: String,
      default: "text",
    },
  },
};
</script>

<style scoped>
</style>