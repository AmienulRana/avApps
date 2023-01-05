<template>
  <button class="flex justify-center items-center shadow-md">
    <slot />
  </button>
</template>

<script>
export default {
  name: "ButtonComponent",
};
</script>

<style scoped>
button[disabled] {
  pointer-events: none;
  opacity: 0.7;
}
</style>
