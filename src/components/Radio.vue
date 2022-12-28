<template>
  <label
    class="flex items-center my-3.5 relative cursor-pointer text-sm"
    :for="id"
  >
    <input
      type="radio"
      :value="value"
      name="status"
      class="opacity-0 absolute top-0"
      :id="id"
      @change="$emit('change', value)"
      :checked="checked"
    />
    <div
      class="w-3 h-3 rounded-full outline outline-offset-3 mr-2.5 box-border duration-100 ease-in"
    ></div>
    <span class="value text-gray-400">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: "RadioInput",
  props: {
    label: { type: String, required: true },
    id: String,
    checked: Boolean,
    value: String,
  },
  emits: ["change"],
};
</script>

<style scoped>
.outline {
  outline: 1px solid rgb(156 163 175);
}
.outline-offset-3 {
  outline-offset: 3px;
}
input[type="radio"]:checked ~ .w-3 {
  background: #019aff;
}

input[type="radio"]:checked ~ .value {
  color: #019aff;
}
</style>
