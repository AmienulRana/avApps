<template>
  <section
    class="w-full overflow-x-auto custom-scrollbar relative"
    :class="loading ? 'h-96' : ''"
  >
    <table class="bg-white min-w-max mt-6 w-full pb-4">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm">Profile</th>
          <th class="text-left text-sm">Clock In</th>
          <th class="text-left text-sm">Clock out</th>
          <th class="text-left text-sm">Behaviour</th>
          <th class="text-left text-sm">Type</th>
          <th class="text-left text-sm">Total Hours</th>
          <th class="text-left text-sm">Break</th>
          <th class="text-left text-sm">Orthers Break</th>
          <th class="text-left text-sm">Deducation</th>
          <th class="text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr class="border-b" v-for="(attedance, i) in attendances" :key="i">
          <td class="flex items-center p-3 text-sm">
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">IA</h2>
            </div>
            <div class="ml-5">
              <h1 class="text-blue-400 text-base">
                {{ attedance?.emp_id?.emp_fullname }}
              </h1>
              <p class="text-sm mb-1 text-gray-600">
                {{ attedance?.emp_id?.emp_depid?.dep_name }}
              </p>
              <p class="text-xs text-gray-400">
                {{ attedance?.shift_id?.shift_name }} ({{
                  attedance?.workhours_in
                }}
                - {{ attedance?.workhours_out }})
              </p>
            </div>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">{{ attedance?.clock_in }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              {{ attedance?.clock_out }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 items-center justify-center rounded-full"
              :class="backgroundBehavior(attedance?.behavior_at)"
            >
              {{ attedance?.behavior_at }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">{{ attedance?.type }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">{{ attedance?.workhours }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              Break in : {{ attedance?.break_in }}
            </p>
            <p class="text-sm text-gray-400">
              Break out : {{ attedance?.break_out }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400 underline">View orthers Break</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400 underline">View Potongan</p>
          </td>
          <td class="p-3 text-right relative">
            <Button
              class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
            >
              <font-awesome-icon icon="fa-ellipsis" />
            </Button>
          </td>
        </tr>
      </tbody>
      <Loading v-if="loading" />
      <NoDataShowing v-if="!loading && attendances.length === 0" />
    </table>
  </section>
</template>

<script>
import Button from "./Button.vue";
import Loading from "./Loading.vue";
import NoDataShowing from "./NoDataShowing.vue";

export default {
  name: "TableAttadance",
  props: { attendances: Array, loading: Boolean },
  components: { Button, Loading, NoDataShowing },
  methods: {
    backgroundBehavior(behavior) {
      return behavior === "Regular"
        ? "bg-green-500"
        : behavior === "Early"
        ? "bg-coral"
        : "bg-red-500";
    },
  },
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
