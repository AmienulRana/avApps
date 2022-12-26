<template>
  <div class="md:flex justify-between items-center mb-5">
    <label
      :class="label_class ? label_class : 'w-1/5'"
      class="text-sm text-gray-400"
      >{{ label }}</label
    >
    <div class="relative" :class="input_class ? input_class : 'w-4/6'">
      <section
        @click.stop="$emit('handleShowSelect')"
        class="flex justify-between items-center cursor-pointer px-2 py-1.5 border rounded-md"
        :class="{ 'border-primary': isOpen }"
      >
        <p></p>
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
          class="bg-white overflow-y-auto custom-scrollbar rounded text-base text-left mt-2 py-2.5 absolute left-0 w-full shadow-md border border-gray-300 z-10"
          :class="position === 'top' ? 'bottom-full' : 'top-full'"
        >
          <div class="px-2 mb-2">
            <input
              type="text"
              class="w-full border focus:outline focus:outline-primary px-2 py-1.5 bg-white rounded"
              @click.stop
              @input="handleSearchOption"
            />
          </div>
          <div class="custom-scrollbar max-h-36">
            <p
              class="p-2 cursor-pointer hover:bg-primary hover:text-white"
              v-for="(option, i) in options"
              :key="i"
            >
              {{ option }}
            </p>
          </div>
        </section>
      </Transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectSearch",
  props: {
    isOpen: Boolean,
    label: String,
    input_class: String,
    label_class: String,
    options: Array,
    position: {
      type: String,
      default: "bottom",
    },
  },
  emits: ["handleShowSelect"],
  data() {
    return {
      query: "",
      search_options: [],
    };
  },
  methods: {
    handleSearchOption(e) {
      this.query = e.target.value;
      if (this.query.length >= 1) {
        const data = this?.options;

        const result = data.filter((item) => item.includes("t"));
        // const result = this.options.filter((option) =>
        //   option.includes(this.query.toLowerCase())
        // );
        console.log(result);
        // this.search_options = result;
      } else {
        this.search_options = this.options;
      }
      //   const search = this.options.filter((item) =>
      //     item.toLowerCase().includes(this.query.toLowerCase())
      //   );
      //   console.log(search);
    },
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
