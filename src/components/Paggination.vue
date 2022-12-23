<template>
  <nav>
    <button
      v-if="currentPage > 1"
      @click="goToPage(currentPage - 1)"
      class="p-2 rounded-l-md bg-gray-200 hover:bg-gray-300"
    >
      Prev
    </button>
    <template v-if="currentPage > 3">
      <button @click="goToPage(1)" class="p-2">1</button>
      <span class="p-2">...</span>
    </template>
    <template v-for="page in pages" :key="page">
      <button
        v-if="page >= currentPage - 2 && page <= currentPage + 2"
        class="w-9 h-9 rounded-md"
        :class="['p-2', { 'bg-primary text-white': page === currentPage }]"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </template>
    <template v-if="currentPage < totalPages - 3">
      <span class="p-2">...</span>
      <button @click="goToPage(totalPages)" class="p-2">
        {{ totalPages }}
      </button>
    </template>
    <button
      v-if="currentPage < totalPages"
      @click="goToPage(currentPage + 1)"
      class="p-2 rounded-r-md bg-gray-200 hover:bg-gray-300"
    >
      Next
    </button>
  </nav>
</template>

<script>
export default {
  name: "PaginationComponent",
  props: {
    data: {
      type: Array,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  computed: {
    pages() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    goToPage(page) {
      this.$emit("page-change", page);
    },
  },
};
</script>

<style>
/* Tailwind CSS */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
</style>
