<template>
  <div class="w-max bg-white drop-shadow-lg">
    <div class="text-center lg:mt-6">
      <div class="flex items-center justify-between px-4 text-gray-900">
        <button
          type="button"
          class="flex flex-none items-center justify-center text-gray-400 hover:text-gray-500"
          @click.stop="previousMonth"
        >
          <span class="sr-only">Previous month</span>
          <ChevronLeftIcon class="h-8 w-8" aria-hidden="true" />
        </button>
        <div class="flex-auto font-semibold">
          {{ monthSelected.text }} {{ yearSelected }}
        </div>
        <button
          type="button"
          class="flex flex-none items-center justify-center text-gray-400 hover:text-gray-500"
          @click.stop="nextMonth"
        >
          <span class="sr-only">Next month</span>
          <ChevronRightIcon class="h-8 w-8" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
        <div>S</div>
      </div>
      <div
        class="isolate mt-2 grid grid-cols-7 gap-px bg-gray-200 text-sm shadow ring-1 ring-gray-200"
      >
        <button
          v-for="day in days"
          :key="day.date"
          type="button"
          :class="[
            'py-1.5 hover:bg-gray-100 focus:z-10 w-10 h-11',
            day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
            (day.isSelected || day.isToday) && 'font-semibold',
            day.isSelected && 'text-white',
            !day.isSelected &&
              day.isCurrentMonth &&
              !day.isToday &&
              'text-gray-900',
            !day.isSelected &&
              !day.isCurrentMonth &&
              !day.isToday &&
              'text-gray-400',
            day.isToday && !day.isSelected && 'text-primary',
          ]"
          @click.stop="handleSeletedDate(day.isCurrentMonth && day)"
        >
          <time
            :datetime="day.date"
            :class="[
              'mx-auto flex h-7 w-7 items-center justify-center rounded-full time',
              day.isSelected && day.isToday && 'bg-primary',
              day.isSelected && !day.isToday && 'bg-gray-900',
            ]"
            >{{ day.date.split("-").pop().replace(/^0/, "") }}</time
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";

export default {
  name: "CalenderComponent",
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  data() {
    return {
      months: [
        "January",
        "February",
        "March",
        "April",
        "Mei",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthSelected: {
        number: 2,
        text: "March",
      },
      days: [],
      yearSelected: 2023,
    };
  },
  emits: ["selected"],
  methods: {
    dateToday() {
      let currentDate = new Date();
      let year = currentDate.getFullYear();
      let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      let day = ("0" + currentDate.getDate()).slice(-2);
      return year + "-" + month + "-" + day;
    },
    handleSeletedDate(date) {
      const selectedDate = this.days.find((day) => day.isSelected);
      if (selectedDate) {
        selectedDate.isSelected = false;
      }
      date.isSelected = true;
      this.$emit("selected", date.date);
    },
    getDateInOneMonth(year, month) {
      const numDays = new Date(year, month, 0).getDate(); // get number of days in the month

      const dates = [];
      for (let day = 1; day <= numDays; day++) {
        const formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
          day < 10 ? "0" : ""
        }${day}`;
        dates.push({
          date: formattedDate,
          isCurrentMonth: true,
          isToday: formattedDate === this.dateToday(),
          isSelected: formattedDate === this.dateToday(),
        });
      }

      this.days = dates;
    },
    previousMonth() {
      this.monthSelected.number--;
      if (this.monthSelected.number < 0) {
        this.monthSelected.number = 11;
        this.yearSelected--;
      }
      this.monthSelected.text = this.months[this.monthSelected.number];
      this.getDateInOneMonth(this.yearSelected, this.monthSelected.number + 1);
    },
    nextMonth() {
      this.monthSelected.number++;
      if (this.monthSelected.number > 11) {
        this.monthSelected.number = 0;
        this.yearSelected++;
      }
      this.monthSelected.text = this.months[this.monthSelected.number];
      this.getDateInOneMonth(this.yearSelected, this.monthSelected.number + 1);
      // this.updateCalendar();
    },
  },
  mounted() {
    this.getDateInOneMonth(this.yearSelected, this.monthSelected.number + 1);
  },
};
</script>
