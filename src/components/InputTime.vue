<template>
  <div class="relative md:w-5/12">
    <div class="">
      <p class="text-sm mb-2">{{ label }}</p>
      <button
        @click.stop="$emit('showTime')"
        class="flex border justify-between w-full items-center px-4 py-2 text-sm"
      >
        <!-- <span></span> -->
        <span>
          {{ hour && `${hour}.${menit}` }}
          {{ hour && (hour > 12 && hour < 23 ? "PM" : "AM") }}</span
        >
        <font-awesome-icon
          icon="fa-clock"
          class="text-primary text-xl text-right"
        />
      </button>
    </div>
    <div
      v-if="isOpen"
      class="origin-top-right bg-white z-10 flex absolute right-0 mt-2 rounded-md shadow-lg"
    >
      <div
        class="rounded-md bg-white w-32 shadow-xs h-44 overflow-y-auto custom-scrollbar"
      >
        <button
          v-for="data in hours"
          :key="data"
          @click.stop="
            hour = data;
            $emit('selected-hour', data);
          "
          class="w-full text-left block px-4 py-2 text-sm duration-150 ease-in-out rounded-md hover:bg-gray-50 hover:text-gray-400"
          :class="hour === data ? 'bg-gray-50 text-gray-400' : ''"
          role="menuitem"
        >
          {{ data }}:00
        </button>
      </div>
      <div
        class="inline-block bg-white relative w-32 rounded-md h-44 overflow-y-auto custom-scrollbar"
      >
        <button
          v-for="data in minutes"
          :key="data"
          @click.stop="
            menit = data;
            $emit('selected-minute', data);
          "
          class="w-full text-left block px-4 py-2 text-sm duration-150 ease-in-out rounded-md hover:bg-gray-50 hover:text-gray-400"
          :class="menit === data ? 'bg-gray-50 text-gray-400' : ''"
          role="menuitem"
        >
          {{ hour || "00" }} : {{ data }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputTime",
  props: {
    label: String,
    isOpen: Boolean,
    hourValue: String,
    minuteValue: String,
  },
  data() {
    return {
      selectedTime: "",
      hour: this.hourValue,
      menit: this.minuteValue,
      hours: [],
      minutes: [],
    };
  },
  emits: ["showTime", "selected-hour", "selected-minute"],
  created() {
    for (let h = 0; h <= 23; h++) {
      let hour = h.toString().padStart(2, "0");
      this.hours.push(hour);
    }
    // Populate the minutes array
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        this.minutes.push(`0${i}`);
      } else {
        this.minutes.push(`${i}`);
      }
    }
  },
};
</script>
