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
          <th class="text-left text-sm">Name</th>
          <th class="text-left text-sm">Description</th>
          <th class="text-left text-sm">Type</th>
          <th class="text-left text-sm">Status</th>
          <th class="text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b h-max" v-for="dataAd in data" :key="dataAd._id">
          <td class="p-3 text-sm">
            <p class="text-sm">{{ dataAd?.ad_name }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">{{ dataAd?.ad_desc ? dataAd?.ad_desc : "-" }}</p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 items-center justify-center rounded-full"
              :class="
                dataAd?.ad_type === 'Allowance'
                  ? 'bg-green-500'
                  : 'bg-orange-500'
              "
            >
              {{ dataAd?.ad_type }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <SwitchButton
              class="w-max"
              @update:model="(value) => updateStatus(value, dataAd)"
              :value="dataAd?.ad_status"
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
  </section>
</template>

<script>
import SwitchButton from "./SwitchButton.vue";
import { ChangeStatusAllowDeductAPI } from "@/actions/allow-deduction";
export default {
  name: "TableOutsideAssignment",
  components: { SwitchButton },
  props: { ad: Object },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      showModal: false,
      data: this.ad,
    };
  },
  watch: {
    ad: {
      handler(newValue) {
        this.data = newValue;
      },
    },
  },
  methods: {
    async updateStatus(value, dataAd) {
      dataAd.ad_status = value;
      await ChangeStatusAllowDeductAPI(dataAd?._id);
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
