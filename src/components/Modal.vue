<template>
  <div
    class="fixed bottom-0 inset-x-0 px-4 max-h-screen sm:inset-0 sm:flex sm:items-center sm:justify-center"
    v-if="showModal"
  >
    <div
      class="fixed inset-0 transition-opacity"
      @click="$emit('close', false)"
    >
      <div class="absolute inset-0 bg-black opacity-75"></div>
    </div>
    <Transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <div
        class="bg-white rounded-lg relative shadow-xl transform transition-all h-full md:w-8/12 sm:w-full"
        v-if="showModal"
        @click.stop
      >
        <div
          class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-between"
        >
          <h3 class="text-lg text-gray-900">
            {{ title }}
          </h3>
          <div class="sm:ml-3 sm:flex-shrink-0">
            <button
              @click="$emit('close', false)"
              class="text-2xl leading-none font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
            >
              <font-awesome-icon icon="fa-xmark" />
            </button>
          </div>
        </div>

        <div
          class="px-4 sm:px-6 sm:pt-4 overflow-y-scroll custom-scrollbar h-4/5 pb-16"
        >
          <slot></slot>
        </div>

        <div
          class="bg-gray-50 px-4 py-3 absolute bottom-0 left-0 w-full sm:px-6 sm:flex sm:items-center sm:justify-end"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: "ModalComponent",
  props: {
    title: {
      type: String,
      required: true,
    },
    showModal: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
<style>
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
