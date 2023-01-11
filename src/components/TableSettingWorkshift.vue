<template>
  <section
    class="w-full overflow-x-auto custom-scrollbar h-96 bg-white"
    @click="showActions = null"
  >
    <table class="bg-white min-w-max mt-6 w-full pb-4">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm">Company Name</th>
          <th class="text-left text-sm">Shift Name</th>
          <th class="text-left text-sm">Start At</th>
          <th class="text-left text-sm">End At</th>
          <th class="text-left text-sm">Break Duration</th>
          <th class="text-left text-sm">Status</th>
          <th class="text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b h-max" v-for="(shift, i) in allShifts" :key="i">
          <td class="p-3 text-sm">
            <p class="text-sm">{{ shift?.company_id?.company_name }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">{{ shift?.shift_name }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">{{ shift?.shift_clockin }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">{{ shift?.shift_clockout }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">
              {{
                shift?.shift_break_duration < 10
                  ? `0${shift?.shift_break_duration}:00 Hour`
                  : `${shift?.shift_break_duration}:00 Hour`
              }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <SwitchButton
              class="w-max"
              @update:model="(value) => updateStatus(value, shift)"
              :value="shift?.shift_status"
            />
          </td>
          <td class="p-3 text-right relative">
            <Button
              class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
              @click.stop="showActions = i"
            >
              <font-awesome-icon icon="fa-ellipsis" />
            </Button>
            <div
              class="text-left absolute top-0 right-20 rounded-md bg-white shadow-md md:w-max md:h-max"
              v-if="showActions === i"
            >
              <ul>
                <li
                  class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                >
                  Edit
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
import SwitchButton from "./SwitchButton.vue";
import Button from "./Button.vue";
import { ChangeStatusShiftAPI } from "@/actions/shift";

export default {
  name: "TableOutsideAssignment",
  components: { SwitchButton, Button },
  props: { shifts: Array, showMessageStatus: Function },
  data() {
    return {
      showActions: null,
      allShifts: this.shifts,
      data: {
        status_workshift: false,
      },
    };
  },
  watch: {
    shifts: {
      handler: function (newValue) {
        this.allShifts = newValue;
      },
      deep: true,
    },
  },
  methods: {
    async updateStatus(value, shift) {
      shift.shift_status = value;
      const response = await ChangeStatusShiftAPI(shift?._id);
      this.showMessageStatus(response);

      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
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

.approved .bg-icon {
  background: rgb(220, 255, 220);
}
.approved svg {
  color: rgb(110, 197, 110);
}
.approved .indicator {
  background: rgb(110, 197, 110) !important;
}
.not-approved .bg-icon {
  background: rgba(255, 0, 0, 0.4);
}
.not-approved svg {
  color: rgb(239 68 68);
}
.not-approved .indicator {
  background: rgb(239 68 68) !important;
}
</style>
