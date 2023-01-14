<template>
  <section
    class="w-full overflow-x-auto custom-scrollbar bg-white relative"
    @click="showActions = null"
  >
    <table class="bg-white min-w-max mt-6 w-full pb-4">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm">No.</th>
          <th class="text-left text-sm">Tanggal Mulai</th>
          <th class="text-left text-sm">Tanggal Selesai</th>
          <th class="text-left text-sm">Keterangan Cuti Bersama</th>
          <th class="text-left text-sm">Tipe</th>
          <th class="text-left text-sm">Potong Cuti</th>
          <th class="text-left text-sm">Berlaku</th>
          <th class="text-left text-sm">Status</th>
          <th class="text-left text-sm">Action</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr
          class="border-b h-max"
          v-for="(data, i) in leaves_holidays"
          :key="i"
        >
          <td class="p-3 text-sm">
            <p class="text-sm">{{ i + 1 }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">{{ data?.leavehol_startdate }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">{{ data?.leavehol_enddate }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">{{ data?.leavehol_desc }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">{{ data?.leavehol_type }}</p>
          </td>
          <td class="p-3 text-sm">
            <SwitchButton
              class="w-max"
              @update:model="(value) => (data.leavehol_cutleave = value)"
              :value="data?.leavehol_cutleave"
            />
          </td>
          <td class="p-3 text-sm">
            <p
              class="text-sm"
              v-if="departement.length === data?.leavehol_depid.length"
            >
              Semua
            </p>
            <template v-else>
              <p v-for="(departement, i) in data?.leavehol_depid" :key="i">
                {{ departement?.dep_name }}
              </p>
            </template>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-green-500">Aktif</p>
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
                <li
                  class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                >
                  Non-Aktif
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <NoDataShowing v-if="!loading.getStatus && leaves_holidays.length === 0" />
    <Loading v-if="loading" />
  </section>
</template>

<script>
import SwitchButton from "./SwitchButton.vue";
import Loading from "./Loading.vue";
import NoDataShowing from "./NoDataShowing.vue";

export default {
  name: "TableSettingCuti",
  components: { SwitchButton, Loading, NoDataShowing },
  props: { leaveHoliday: Array, departement: Array, loading: Boolean },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      showModal: false,
      data: {
        status_workshift: false,
      },
      leaves_holidays: this.leaveHoliday,
    };
  },
  methods: {},

  mounted() {
    this.$watch(
      "leaveHoliday",
      (newValue) => {
        this.leaves_holidays = newValue;
      },
      { deep: true }
    );
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
