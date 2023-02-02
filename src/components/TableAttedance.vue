<template>
  <p>s</p>
</template>

<script>
import Button from "./Button.vue";
import Loading from "./Loading.vue";
import NoDataShowing from "./NoDataShowing.vue";

export default {
  name: "TableAttadance",
  props: { attendances: Array, loading: Boolean },
  components: {},
  methods: {},
  computed: {
    absenceMessage() {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentSecond = currentTime.getSeconds();

      if (currentHour < 8) {
        return "";
      } else if (
        currentHour === 8 &&
        currentMinute === this.timeIn &&
        currentSecond === 0
      ) {
        return "";
      } else {
        let lateMinutes =
          (currentHour - 8) * 60 + (currentMinute - this.timeIn);
        let lateSeconds = currentSecond;
        if (lateMinutes < 0) {
          lateMinutes = 0;
        }
        if (lateSeconds < 0) {
          lateSeconds = 0;
        }
        return `${lateMinutes}:${lateSeconds}`;
      }
    },
  },
};
</script>

<style scoped>
table thead th,
table tbody tr td {
  padding: 1rem 2rem;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 5px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #c6c8cc;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1;
}
</style>
