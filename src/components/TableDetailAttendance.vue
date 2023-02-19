<template>
  <section class="relative">
    <section
      class="w-full flex flex-nowrap overflow-x-auto custom-scrollbar relative bg-white pb-20"
      :class="loading ? 'h-96' : ''"
    >
      <section class="flex" @click="totalEmpDeduction = ''">
        <section class="profile-section">
          <h1 class="text-gray-400 th">Profile</h1>
          <section
            class="td flex"
            v-for="(attendance, i) in attendances"
            :style="`${totalEmpDeduction === i ? 'height:370px' : ''}`"
            :key="attendance?._id"
          >
            <div
              class="profile-name flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">
                {{
                  attendance?.emp_id?.emp_fullname?.substr(0, 1) +
                  attendance?.emp_id?.emp_fullname?.substr(
                    attendance?.emp_id?.emp_fullname?.indexOf(" ") + 1,
                    1
                  )
                }}
              </h2>
            </div>
            <div class="ml-5">
              <h1 class="text-blue-400 text-base">
                {{ attendance?.emp_id?.emp_fullname }}
              </h1>
              <p class="text-sm mb-1 text-gray-600">
                {{ attendance?.emp_id?.emp_depid?.dep_name }}
              </p>
            </div>
          </section>
        </section>
        <section class="description">
          <h1 class="text-gray-400 th">Description</h1>
          <section
            class="td"
            v-for="(attendance, i) in attendances"
            :key="attendance?._id"
          >
            <h2 class="text-blue-400 text-base mb-2">Schedule / Status</h2>
            <p class="text-sm mb-2 text-gray-600 truncate">Clock in / out</p>
            <p class="text-sm mb-2 text-gray-600 truncate">Behavior</p>
            <p class="text-sm mb-2 text-gray-600 truncate">Delay Deduction</p>
            <p class="text-sm mb-2 text-gray-600 truncate">Break in / out</p>
            <p class="text-sm mb-2 text-gray-600 truncate">Break Deduction</p>
            <p class="text-sm mb-2 text-gray-600 truncate">
              Leave Absen Deduction
            </p>
            <button
              @click.stop="
                totalEmpDeduction = totalEmpDeduction === i ? null : i
              "
            >
              <img src="@/assets/icons/sigma.svg" alt="sigma icon" />
            </button>
            <section v-if="totalEmpDeduction === i">
              <p class="text-sm mb-2 text-gray-600">Total Attendance</p>
              <p class="text-sm mb-2 text-gray-600">Total Leave</p>
              <p class="text-sm mb-2 text-gray-600 truncate">
                Total Absent without Leave
              </p>
              <p class="text-sm mb-2 text-gray-600">Total Deduction</p>
            </section>
          </section>
        </section>
        <section class="text-center total">
          <h1 class="text-gray-400 th">Total</h1>
          <section class="td" v-for="(attendance, i) in attendances" :key="i">
            <h2 class="text-blue-400 text-base opacity-0 mb-2">.</h2>
            <p class="text-sm mb-2 text-gray-600 opacity-0">.</p>
            <p class="text-sm mb-2 text-gray-600">
              {{
                attendance?.attendances.filter(
                  (att) =>
                    att?.attendance_status === "Late" ||
                    att?.attendance_status === "Very Late"
                ).length
              }}x Late ({{
                formatTime(
                  attendance?.attendances?.reduce(
                    (total, data) =>
                      total + Number(data?.count_lateduration || 0),
                    0
                  )
                )
              }}) Minute
            </p>
            <p class="text-sm mb-2 text-red-500">
              {{
                formatCurrency(
                  attendance?.attendances?.reduce(
                    (total, data) => total + Number(data?.attendance_deduction),
                    0
                  )
                )
              }}
              ,-
            </p>
            <p class="text-sm mb-2 text-gray-600">
              {{
                attendance?.attendances.filter(
                  (att) =>
                    att?.break_status === "Late" ||
                    att?.break_status === "Very Late"
                ).length
              }}x Late ({{
                formatTime(
                  attendance?.attendances?.reduce(
                    (total, data) =>
                      total + Number(data?.break_lateduration) || 0,
                    0
                  )
                )
              }}) Minute
            </p>
            <p class="text-sm mb-2 text-red-500">
              {{
                formatCurrency(
                  attendance?.attendances?.reduce(
                    (total, data) => total + Number(data?.break_deduction) || 0,
                    0
                  )
                )
              }},-
            </p>
            <p class="text-sm mb-2 text-red-500">
              {{
                formatCurrency(
                  attendance?.attendances?.reduce(
                    (total, data) => total + Number(data?.attendance_deduction),
                    0
                  )
                )
              }},-
            </p>
            <button class="opacity-0">
              <img src="@/assets/icons/sigma.svg" alt="sigma icon" />
            </button>
            <section v-if="totalEmpDeduction === i">
              <p class="text-sm mb-2 text-gray-600">
                {{
                  attendance?.attendances.filter(
                    (att) => att?.attendance_status === "Attendance"
                  ).length
                }}x
              </p>
              <p class="text-sm mb-2 text-gray-600">0x Leave</p>
              <p class="text-sm mb-2 text-gray-600">
                {{
                  attendance?.attendances.filter(
                    (att) => att?.attendance_status === "Absent"
                  ).length
                }}x
              </p>
              <p class="text-sm mb-2 text-red-500">
                {{
                  formatCurrency(
                    attendance?.attendances?.reduce(
                      (total, data) =>
                        total + Number(data?.break_deduction) || 0,
                      0
                    ) +
                      attendance?.attendances?.reduce(
                        (total, data) =>
                          total + Number(data?.attendance_deduction),
                        0
                      )
                  )
                }},-
              </p>
            </section>
          </section>
        </section>
      </section>
      <section
        class="flex overflow-x-auto custom-scrollbar"
        ref="scrollX"
        @mousedown="startScrolling"
        @mousemove="handleMouseMove"
        @mouseup="stopScrolling"
      >
        <template v-for="(dataDate, i) in dates_periodic" :key="i">
          <section class="text-center attendance-day">
            <h1 class="text-gray-400 th" style="font-weight: normal !important">
              {{ dataDate?.show_date }}
            </h1>
            <section
              class="td relative"
              :style="`${totalEmpDeduction === i ? 'height:370px' : ''}`"
              v-for="(data, i) in attendances"
              :key="i"
            >
              <template
                v-for="(dataAttendance, j) in data.attendances"
                :key="j"
              >
                <template
                  v-if="dataAttendance?.attendance_date === dataDate?.date"
                >
                  <template
                    v-if="dataAttendance?.attendance_status === 'Attendance'"
                  >
                    <h2 class="text-blue-400 text-sm mb-2 truncate">
                      {{ dataDate?.show_date }},
                      {{ dataAttendance?.workhours_in }} -
                      {{ dataAttendance?.workhours_out }}
                    </h2>
                    <p class="text-sm mb-2 text-gray-600">
                      {{ dataAttendance?.clock_in }} /
                      {{ dataAttendance?.clock_out }}
                    </p>
                    <p class="text-sm mb-2 text-gray-600">
                      {{ dataAttendance?.behavior_at }}
                    </p>
                    <p class="text-sm mb-2 text-gray-600">
                      {{
                        formatCurrency(dataAttendance?.attendance_deduction)
                      }},-
                    </p>
                    <p class="text-sm mb-2 text-gray-600">
                      {{ dataAttendance?.break_in || "-" }} /
                      {{ dataAttendance?.break_out || "-" }}
                    </p>
                    <p class="text-sm mb-2 text-gray-600">
                      {{
                        formatCurrency(dataAttendance?.break_deduction || 0)
                      }},-
                    </p>
                    <p class="text-sm mb-5 text-gray-600">
                      {{ formatCurrency(0) }},-
                    </p>
                  </template>
                  <section
                    v-else
                    class="absolute py-1 rounded-md flex-col flex items-between justify-between top-0 left-0 w-full bg-gray-100 wrapper-no-attedance"
                    style="left: 50%; transform: translateX(-50%)"
                  >
                    <p class="text-xs mt-2">
                      {{ dataDate?.show_date }},
                      {{ dataAttendance?.workhours_in }} -
                      {{ dataAttendance?.workhours_out }}
                    </p>
                    <p
                      class="text-sm my-auto"
                      :class="
                        dataAttendance?.attendance_status === 'Absent'
                          ? 'text-red-500'
                          : ''
                      "
                    >
                      {{
                        dataAttendance?.attendance_status === "Absent"
                          ? "Absent Without Leave"
                          : dataAttendance?.attendance_status
                      }}
                    </p>
                    <p
                      class="text-sm"
                      :class="
                        dataAttendance?.attendance_status === 'Absent'
                          ? 'text-red-500'
                          : ''
                      "
                    >
                      {{
                        formatCurrency(dataAttendance?.attendance_deduction)
                      }},-
                    </p>
                  </section>
                </template>
              </template>
            </section>
          </section>
        </template>
      </section>
    </section>
    <!-- <Loading v-if="loading" /> -->
    <!-- <NoDataShowing v-if="!loading && attendances.length === 0" /> -->
  </section>
</template>

<script>
// import Loading from "./Loading.vue";
// import NoDataShowing from "./NoDataShowing.vue";

export default {
  name: "TableDetailAttendance",
  props: { attendances: Array, loading: Boolean, dates_periodic: Array },
  components: {},
  data() {
    return {
      totalEmpDeduction: null,
      lastX: 0,
    };
  },
  methods: {
    formatCurrency(number) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
      return formatter.format(number);
    },
    formatTime(payload) {
      let minutes = payload;
      let date = new Date(0, 0, 0, 0, minutes);
      let formattedTime = date.toTimeString().slice(0, 5);
      return formattedTime;
    },
    backgroundBehavior(behavior) {
      return behavior === "Regular"
        ? "bg-green-500"
        : behavior === "Early"
        ? "bg-coral"
        : "bg-red-500";
    },
    startScrolling(e) {
      this.lastX = e.clientX;
    },
    handleMouseMove(e) {
      if (this.lastX) {
        const deltaX = e.clientX - this.lastX;
        this.$refs.scrollX.scrollLeft += deltaX;
        this.lastX = e.clientX;
      }
    },
    stopScrolling() {
      this.lastX = 0;
    },
  },
  mounted() {
    console.log(this.attendances);
  },
};
</script>

<style scoped>
.profile-section {
  min-width: 220px;
}

.profile-section .profile-name {
  min-width: 50px;
  height: 50px;
}
section.total {
  min-width: 230px;
}
.attendance-day {
  min-width: 230px;
  margin: 0 20px;
  height: auto;
}
.attendance-day .td .wrapper-no-attedance {
  height: 210px;
  width: 190px;
}
section.description {
  min-width: 220px;
}
.th {
  font-weight: 600;
}
.th,
.td {
  padding: 1rem 2rem;
}
.td {
  min-height: 270px;
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
