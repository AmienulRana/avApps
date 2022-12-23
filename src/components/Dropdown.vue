<template>
  <div class="relative mx-2">
    <Button
      class="rounded-full px-6 text-gray-400 py-2 duration-300 text-sm"
      :class="
        backgroundTitle
          ? `${backgroundTitle} shadow-none`
          : 'bg-white hover:bg-gray-50 hover:text-blue-800'
      "
      @click.stop="$emit('update:activeDropdown', this.$event)"
    >
      {{ title }}
      <slot name="header"></slot>
    </Button>
    <Transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <section
        class="z-10 bg-white absolute top-full left-0 right-auto shadow-md max-h-80 custom-scrollbar w-72 mt-2.5"
        v-if="showDropdown"
      >
        <div
          class="bg-white border-b pb-2.5 px-6 py-4 w-full"
          v-if="dropdownSearch"
          @click.stop
        >
          <div class="relative">
            <Input :icon="true" input_class="rounded-full" />
            <font-awesome-icon
              icon="fa-magnifying-glass"
              class="absolute top-1/2 -translate-y-1/2 left-3 text-primary"
            />
          </div>
        </div>
        <slot name="content"></slot>
      </section>
    </Transition>
  </div>
</template>

<script>
import Button from "./Button.vue";
import Input from "./Input.vue";

export default {
  name: "DropdownComponent",
  components: { Button, Input },
  props: {
    showDropdown: Boolean,
    backgroundTitle: String,
    title: String,
    dropdownSearch: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:activeDropdown"],
};
</script>

<style scoped>
.fadeInDown {
  animation: fadeInDown 0.3s;
}
.fadeOutUp {
  animation: fadeOutUp 0.3s;
}
@keyframes fadeInDown {
  0% {
    transform: translateY(-10%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes fadeOutUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-10%);
    opacity: 0;
  }
}
</style>
