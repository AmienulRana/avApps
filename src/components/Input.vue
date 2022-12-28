<template>
  <div class="md:flex justify-between items-center mb-5">
    <label
      :class="label_class ? label_class : 'md:w-1/5 text-gray-400'"
      class="text-sm min-w-max w-full"
      v-if="label"
      >{{ label }}</label
    >
    <input
      :type="type"
      :placeholder="placeholder"
      class="w-full border outline-gray-600 focus:outline focus:outline-primary pr-2 py-1.5 bg-white rounded"
      :class="[icon ? 'pl-8' : 'pl-2', input_class ? input_class : '']"
      autofocus
      :value="value"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    icon: Boolean,
    label: String,
    label_class: String,
    input_class: String,
    placeholder: String,
    type: {
      type: String,
      default: "text",
    },
    value: String || Number,
  },
  emits: ["input", "change"],
};
</script>

<style scoped></style>
