<template>
  <section>
    <section
      class="flex justify-between items-center cursor-pointer"
      :class="headerClass"
      @click="$emit('click:header')"
    >
      <slot name="header"></slot>
      <font-awesome-icon
        v-if="icon"
        icon="fa-chevron-up w-6 h-6"
        class="duration-500 ease-in-out"
        :class="[isOpen ? '' : 'rotate-180', iconClass]"
      />
    </section>
    <KeepAlive>
      <section
        v-if="isOpen"
        class="bg-blue-500 rounded-md text-base text-left px-5 mt-2 py-2.5"
        :class="contentClass"
      >
        <slot name="content"> </slot>
      </section>
    </KeepAlive>
  </section>
</template>

<script>
export default {
  name: "AccordionComponent",
  props: {
    headerClass: Object,
    isOpen: Boolean,
    contentClass: Object,
    icon: { type: Boolean, default: true },
  },
  emits: ["click:header"],
  data() {
    return {
      position: {
        type: String,
        default: "bottom",
      },
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
