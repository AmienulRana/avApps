<template>
  <div class="relative mx-2">
    <Button
      class="rounded-full px-6 text-gray-400 py-2 duration-300 text-sm"
      :class="[
        backgroundTitle
          ? `${backgroundTitle} shadow-none`
          : 'bg-white hover:bg-gray-50 hover:text-blue-800',
        selectedOption ? 'text-primary bg-gray-50' : '',
      ]"
      @click.stop="$emit('update:activeDropdown', this.$event)"
    >
      {{ title }}
      <slot name="header"></slot>
      <font-awesome-icon
        icon="fa-xmark"
        class="ml-3 text-primary"
        v-if="selectedOption"
        @click.stop="$emit('clearSelected', '')"
      />
    </Button>
    <Transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <section
        class="z-10 bg-white absolute top-full overflow-y-auto left-0 right-auto shadow-md max-h-80 custom-scrollbar w-72 mt-2.5"
        v-if="showDropdown"
      >
        <div
          class="bg-white border-b pb-2.5 px-6 py-4 w-full"
          v-if="dropdownSearch"
          @click.stop
        >
          <div class="relative">
            <Input
              :icon="true"
              input_class="rounded-full"
              @input="handleSearchData($event)"
              :value="query"
            />
            <font-awesome-icon
              icon="fa-magnifying-glass"
              class="absolute top-1/2 -translate-y-1/2 left-3 text-primary"
            />
          </div>
        </div>
        <ul>
          <li
            v-for="(option, index) in searchResult"
            :key="index"
            @click="$emit('selected', option)"
            class="px-4 py-2 text-sm hover:bg-primary justify-between items-center hover:text-white cursor-pointer flex"
            :class="option === selectedOption ? 'bg-primary text-white' : ''"
          >
            {{ option }}
            <font-awesome-icon
              icon="fa-check"
              v-if="option === selectedOption"
            />
          </li>
        </ul>
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
    options: Array,
    selectedOption: String,
  },
  emits: ["update:activeDropdown", "selected", "clearSelected"],
  data() {
    return {
      searchResult: this.options,
      query: "",
    };
  },
  methods: {
    handleSearchData(value) {
      this.query = value;
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
