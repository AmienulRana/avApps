<template>
  <section class="relative">
    <section
      class="w-full overflow-x-auto custom-scrollbar bg-white"
      :class="loading && 'h-96'"
      @click="
        showActions = null;
        showReasonNote = null;
      "
    >
      <table class="bg-white min-w-max mt-6 w-full pb-4">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm">No.</th>
            <th class="text-left text-sm">Company</th>
            <th class="text-left text-sm">Years</th>
            <th class="text-left text-sm">Month</th>
            <th class="text-left text-sm">Start date</th>
            <th class="text-left text-sm">End date</th>
            <th class="text-left text-sm">Active</th>
            <th class="text-left text-sm">Actions</th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr class="border-b h-max" v-for="(periodic, i) in data" :key="i">
            <td class="p-3 text-sm">
              <p class="text-sm">{{ i + 1 }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ periodic?.company_id?.company_name }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ periodic?.periodic_years }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ periodic?.periodic_month }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ periodic?.periodic_start_date }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ periodic?.periodic_end_date }}</p>
            </td>
            <td class="p-3 text-sm">
              <SwitchButton
                class="w-max"
                @update:model="(value) => updateStatus(value, periodic)"
                :value="periodic?.periodic_status"
              />
            </td>
            <td class="p-3 text-right relative">
              <Button
                class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
                @click.stop="showActions = 0"
              >
                <font-awesome-icon icon="fa-ellipsis" />
              </Button>
              <div
                class="text-left absolute top-0 right-20 rounded-md bg-white shadow-md md:w-max md:h-max"
                v-if="showActions === 0"
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
      <NoDataShowing v-if="!loading && periodics.length === 0" />
      <Loading v-if="loading" />
    </section>
  </section>
</template>

<script>
import SwitchButton from "./SwitchButton.vue";
import { ChangeStatusPeriodicAPI } from "@/actions/periodic";
import Loading from "./Loading.vue";
import NoDataShowing from "./NoDataShowing.vue";

export default {
  name: "TableSettingPeriodic",
  components: { SwitchButton, Loading, NoDataShowing },
  props: { periodics: Object, loading: Boolean },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      showModal: false,
      data: this.periodics,
    };
  },
  watch: {
    periodics: {
      handler(newValue) {
        this.data = newValue;
      },
    },
  },
  methods: {
    async updateStatus(value, periodic) {
      periodic.periodic_status = value;
      const response = await ChangeStatusPeriodicAPI(periodic?._id);
      console.log(response);
      if (response?.status === 401) {
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
