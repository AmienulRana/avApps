<template>
  <div class="md:flex justify-between items-center">
    <label
      :class="label_class ? label_class : 'md:w-1/5 text-gray-400'"
      class="text-sm"
      >{{ label }}</label
    >
    <KeepAlive>
      <select
        class="w-full border focus:outline focus:outline-primary px-3 py-1.5 bg-white rounded-md text-sm"
        :class="input_class ? input_class : ''"
        :disabled="disabled"
        v-model="selectedOption"
        @change="updateModel"
      >
        <option
          v-for="(option, i) in options"
          :key="i"
          class="px-2 py-1"
          :selected="property ? option[property] === value : option === value"
          :value="select_property ? option[select_property] : option"
        >
          {{ property ? option[property] : option }}
        </option>
      </select>
    </KeepAlive>
  </div>
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    icon: Boolean,
    label: String,
    input_class: String,
    label_class: String,
    options: Array,
    disabled: Boolean,
    value: String,
    property: String,
    select_property: String,
  },
  data() {
    return {
      selectedOption: this.value,
    };
  },
  emits: ["change"],
  watch: {
    value: {
      handler(newData) {
        this.selectedOption = newData;
      },
      deep: true,
    },
  },
  methods: {
    updateModel() {
      this.$emit("change", this.selectedOption);
    },
  },
};
</script>

<style scoped></style>
