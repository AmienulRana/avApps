<template>
  <nav>
    <ul class="flex items-center">
      <li v-if="currentPage > 1" class="page-item">
        <button class="text-primary min-w-max" @click.prevent="prevPage">
          Previous
        </button>
      </li>
      <li
        v-for="page in pages"
        :key="page"
        class="page-item mx-2"
        :class="{ active: page === currentPage }"
      >
        <button
          class="page-link border-primary border duration-200 text-primary hover:bg-primary hover:text-white rounded-md"
          @click.prevent="changePage(page)"
        >
          {{ page }}
        </button>
      </li>
      <li v-if="currentPage < totalPages" class="page-item">
        <button class="text-primary" @click.prevent="nextPage">Next</button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "PaginationComponent",
  props: {
    items: {
      type: Array,
      required: true,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.items.length / this.perPage);
    },
    pages() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.changePage(this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.changePage(this.currentPage + 1);
      }
    },
    changePage(page) {
      this.$emit("change-page", page);
    },
  },
};
</script>

<style scoped>
ul li {
  min-width: min-content;
}
button {
  width: 35px;
  height: 30px;
}
li.active > button {
  background: #1976d3;
  color: white;
}
</style>
