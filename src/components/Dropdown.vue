<template>
  <div class="relative mx-2">
    <Button
      class="
        bg-white
        hover:bg-gray-100 hover:text-blue-800
        rounded-full
        px-6
        py-2
        duration-300
      "
      @click="showDropdown = !showDropdown"
    >
      Employment Status
    </Button>
    <Transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <section
        class="
          bg-white
          absolute
          top-full
          left-0
          right-auto
          shadow-md
          max-h-80
          custom-scrollbar
          w-72
          mt-2.5
        "
        v-if="showDropdown"
      >
        <div class="relative bg-white border-b pb-2.5 px-6 py-4 w-full">
          <Input :icon="true" />
          <font-awesome-icon
            icon="fa-magnifying-glass"
            class="absolute top-1/2 -translate-y-1/3 left-9 text-primary"
          />
        </div>
        <ul>
          <li class="py-4 px-8 hover:bg-gray-100 cursor-pointer">Tes</li>
          <li class="py-4 px-8 hover:bg-gray-100 cursor-pointer">Tes</li>
          <li class="py-4 px-8 hover:bg-gray-100 cursor-pointer">Tes</li>
        </ul>
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
  data() {
    return {
      showDropdown: false,
    };
  },
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