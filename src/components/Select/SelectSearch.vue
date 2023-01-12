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
        class="flex text-sm justify-between items-center cursor-pointer px-4 py-1.5 border rounded-md"
        :class="{ 'border-primary': isOpen }"
      >
        <p>
          {{
            !selectedOption
              ? placeholder
              : property
              ? selectedOption[property]
              : selectedOption
          }}
        </p>
        <font-awesome-icon
          icon="fa-chevron-up"
          class="duration-500 w-3 h-3 ease-in-out"
          :class="isOpen ? '' : 'rotate-180'"
        />
      </section>
      <Transition
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp"
      >
        <section
          v-if="isOpen"
          class="bg-white overflow-y-auto custom-scrollbar rounded text-base text-left mt-2 py-2.5 absolute left-0 w-80 shadow-md border border-gray-300 z-10"
          :class="position === 'top' ? 'bottom-full' : 'top-full'"
        >
          <div class="px-2 mb-2 relative">
            <input
              type="text"
              class="w-full border focus:outline focus:outline-primary pl-10 py-1.5 bg-white rounded-full"
              v-model="query"
              @click.stop
              @input="handleSearchOption"
            />
            <font-awesome-icon
              icon="fa-magnifying-glass"
              class="absolute top-1/2 -translate-y-1/2 left-5 text-primary"
            />
          </div>
          <div class="custom-scrollbar max-h-36">
            <p
              v-for="(option, i) in searchResult"
              :key="i"
              @click="$emit('selected', option)"
              class="px-4 py-2 text-gray-400 text-sm justify-between items-center duration-100 cursor-pointer flex"
              :class="
                property
                  ? option[property] === selectedOption
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                  : option === selectedOption
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              "
            >
              {{ property ? option[property] : option }}
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
    selectedOption: String || Object,
    placeholder: String,
    property: String,
    position: {
      type: String,
      default: "bottom",
    },
  },
  emits: ["handleShowSelect", "selected"],
  data() {
    return {
      query: "",
      searchResult: this.options,
    };
  },
  methods: {
    handleSearchOption() {
      if (this.query.length >= 1) {
        const result = this.options.filter((option) =>
          option.toLowerCase().includes(this.query.toLowerCase())
        );
        this.searchResult = result;
      } else {
        this.searchResult = this.options;
      }
    },
  },
  watch: {
    options: {
      handler(newOptions) {
        this.searchResult = newOptions;
      },
      deep: true,
    },
  },
  // mounte
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
