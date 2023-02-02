<template>
  <div class="relative mx-2">
    <Button
      class="rounded-full bg-white px-6 text-gray-400 py-2 duration-300 text-sm"
      @click.stop="showSelectCompany = !showSelectCompany"
    >
      {{ dataCompany?.company_name ? dataCompany?.company_name : "Company" }}
      <font-awesome-icon
        icon="fa-chevron-up"
        class="duration-500 w-3 h-3 ease-in-out ml-2"
        :class="showSelectCompany ? '' : 'rotate-180'"
      />
    </Button>
    <Transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <section
        class="z-10 bg-white absolute top-full overflow-y-auto left-0 right-auto shadow-md max-h-80 custom-scrollbar w-72 mt-2.5"
        v-if="showSelectCompany"
      >
        <div class="bg-white border-b pb-2.5 px-6 py-4 w-full" @click.stop>
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
            @click="$emit('selected:company', option)"
            class="px-4 py-2 text-gray-400 text-sm hover:bg-gray-50 justify-between items-center cursor-pointer flex"
          >
            {{ option?.company_name }}
            <font-awesome-icon
              icon="fa-check"
              v-if="option?.company_name === dataCompany?.company_name"
            />
          </li>
        </ul>
      </section>
    </Transition>
  </div>
</template>
<script>
import Input from "./Input.vue";
import Button from "./Button.vue";
export default {
  name: "ChoiseCompany",
  props: { dataCompany: Object, options: Array },
  components: { Input, Button },
  emits: ["selected"],
  data() {
    return {
      showSelectCompany: false,
      searchResult: this.options,
      query: "",
    };
  },
  methods: {
    handleSearchData(value) {
      this.query = value;
      if (this.query.length >= 1) {
        const result = this.options.filter((option) =>
          option.company_name.toLowerCase().includes(this.query.toLowerCase())
        );
        this.searchResult = result;
      } else {
        this.searchResult = this.options;
      }
    },
  },
  watch: {
    options: {
      handler: function (newData) {
        this.searchResult = newData;
      },
      deep: true,
    },
  },
  mounted() {
    this.searchResult = this.options;
  },
};
</script>

<style scoped>
.px-0 {
  min-width: 250px;
}
.fadeInDown {
  animation: fadeInDown 0.2s;
}
.fadeOutUp {
  animation: fadeOutUp 0.2s;
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
