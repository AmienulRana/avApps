<template>
  <section>
    <section
      @click="isOpen = !isOpen"
      class="flex justify-between items-center cursor-pointer"
    >
      <slot name="header"></slot>
      <font-awesome-icon
        icon="fa-chevron-up w-6 h-6"
        class="duration-500 ease-in-out"
        :class="isOpen ? '' : 'rotate-180'"
      />
    </section>
    <Transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <section
        v-if="isOpen"
        class="
          bg-blue-800
          rounded-md
          w-full
          text-base text-left
          px-5
          mt-2
          py-2.5
        "
      >
        <slot name="content"> </slot>
      </section>
    </Transition>
  </section>
</template> 

<script>
export default {
  name: "AccordionComponent",
  data() {
    return {
      isOpen: false,
    };
  },
};
</script>

<style scoped>
.fadeInDown {
  animation: fadeInDown 0.5s;
}
.fadeOutUp {
  animation: fadeOutUp 0.5s;
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