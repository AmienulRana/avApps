<template>
  <section class="w-full overflow-x-auto custom-scrollbar">
    <table class="bg-white min-w-max mt-6 w-full pb-4">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm">Profile</th>
          <th class="text-left text-sm">Clock In</th>
          <th class="text-left text-sm">In GeoLocation</th>
          <th class="text-left text-sm">Clock out</th>
          <th class="text-left text-sm">In GeoLocation</th>
          <th class="text-left text-sm">Behaviour</th>
          <th class="text-left text-sm">Type</th>
          <th class="text-left text-sm">Total Hours</th>
          <th class="text-left text-sm">Break</th>
          <th class="text-left text-sm">Orthers Break</th>
          <th class="text-left text-sm">Deducation</th>
          <th class="text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <td class="flex items-center p-3 text-sm">
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">IA</h2>
            </div>
            <div class="ml-5">
              <h1 class="text-blue-400 text-base">Ivan Arafat</h1>
              <p class="text-sm mb-1 text-gray-600">Admin & Hrm</p>
              <p class="text-xs text-gray-400">Shift 1 (08:00 AM - 05:00 PM)</p>
            </div>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">07:58 AM, Today</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Company Location</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">05:05 PM, Today</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Company Location</p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 items-center justify-center rounded-full bg-coral"
            >
              Early
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Auto</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">9:00</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Break in : 01:05 PM</p>
            <p class="text-sm text-gray-400">Break out : 02:05 PM</p>
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
            <div
              class="text-left absolute -top-full right-16 rounded-md bg-white shadow-md md:w-max md:h-max"
            >
              <ul>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    View details
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Edit
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Assign leave
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Edit salary
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Add joining date
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Terminate
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Remove from employee list
                  </router-link>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: "TableAttadance",
  computed: {
    backgrounClassBehavior() {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentSecond = currentTime.getSeconds();

      if (currentHour < 8) {
        return "orange";
      } else if (
        currentHour === 8 &&
        currentMinute === this.timeIn &&
        currentSecond === 0
      ) {
        return "blue";
      } else {
        return "red";
      }
    },
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
