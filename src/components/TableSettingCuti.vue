<template>
  <section
    class="w-full overflow-x-auto custom-scrollbar h-96 bg-white"
    @click="
      showActions = null;
      showReasonNote = null;
    "
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
      <tbody>
        <tr class="border-b h-max">
          <td class="p-3 text-sm">
            <p class="text-sm">1</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">01/12/2022</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">01/12/2022</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">Libur 1 January</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">Cuti Bersama</p>
          </td>
          <td class="p-3 text-sm">
            <SwitchButton
              class="w-max"
              @update:model="(value) => (data.status_workshift = value)"
              :value="data.status_workshift"
            />
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">IT, Administrasi</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-green-500">Aktif</p>
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
  </section>
</template>

<script>
import SwitchButton from "./SwitchButton.vue";
export default {
  name: "TableSettingCuti",
  components: { SwitchButton },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      showModal: false,
      data: {
        status_workshift: false,
      },
    };
  },
  methods: {
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = id;
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
