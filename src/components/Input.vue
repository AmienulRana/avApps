<template>
  <input
    type="text"
    placeholder="Search"
    class="
      w-full
      border
      focus:outline focus:outline-primary
      pr-2
      py-1.5
      rounded-full
    "
    :class="icon ? 'pl-8' : 'pl-2'"
    autofocus
  />
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    icon: Boolean,
  },
};
</script>

<style scoped>
</style>