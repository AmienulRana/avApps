<template>
  <div
    class="w-14 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer"
    :class="value ? 'bg-primary' : 'bg-gray-300'"
    :aria-checked="value.toString()"
    @click="toggle"
  >
    <div
      class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300"
      :class="{ 'translate-x-7': value }"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:model"],
  methods: {
    toggle() {
      this.$emit("update:model", !this.value);
    },
  },
};
</script>
