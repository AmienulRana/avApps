<template>
  <section class="relative bg-white">
    <section
      class="w-full overflow-x-auto custom-scrollbar bg-white relative"
      @click="
        showActions = null;
        showReasonNote = null;
      "
    >
      <table class="bg-white min-w-max mt-6 w-full pb-4">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm">Profile</th>
            <th class="text-left text-sm">Date & time</th>
            <th class="text-left text-sm">Leave duration</th>
            <th class="text-left text-sm">Name</th>
            <th class="text-left text-sm">Type</th>
            <th class="text-left text-sm">Attachments</th>
            <th class="text-left text-sm">Status</th>
            <th class="text-left text-sm">Activity</th>
            <th class="text-left text-sm">Actions</th>
          </tr>
        </thead>
        <tbody v-if="!loadingGet && leave_request.length !== 0">
          <tr class="border-b" v-for="(leave, i) in leave_request" :key="i">
            <td class="flex items-center p-3 text-sm">
              <div
                class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
              >
                <h2 class="text-md text-white">
                  {{
                    leave?.emp_id?.emp_fullname.substr(0, 1) +
                    leave?.emp_id?.emp_fullname.substr(
                      leave?.emp_id?.emp_fullname.indexOf(" ") + 1,
                      1
                    )
                  }}
                </h2>
              </div>
              <div class="ml-5">
                <h1 class="text-blue-400 text-base">
                  {{ leave?.emp_id?.emp_fullname }}
                </h1>
                <p class="text-sm mb-1 text-gray-400">
                  {{ leave?.emp_id?.emp_depid?.dep_name }}
                </p>
              </div>
            </td>
            <td
              class="p-3 text-sm"
              v-if="leave?.empleave_leave_type === 'Hours'"
            >
              <p class="text-sm">
                <span class="text-gray-400">From :</span>
                {{ leave?.empleave_start_hours }}
              </p>
              <p class="text-sm">
                <span class="text-gray-400">To :</span>
                {{ leave?.empleave_end_hours }},
                {{ localDateString(leave?.empleave_start_date) }}
              </p>
            </td>
            <td
              class="p-3 text-sm"
              v-else-if="leave?.empleave_leave_type === 'Multi Day'"
            >
              <p class="text-sm">
                <span class="text-gray-400">From :</span>
                {{ localDateString(leave?.empleave_start_date) }}
              </p>
              <p class="text-sm">
                <span class="text-gray-400">To :</span>
                {{ localDateString(leave?.empleave_end_date) }}
              </p>
            </td>
            <td class="p-3 text-sm" v-else>
              <p class="text-sm">
                {{ localDateString(leave?.empleave_start_date) }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ leave?.empleave_leave_duration }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">{{ leave?.empleave_type_id }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">
                {{
                  leave?.empleave_type_id.includes("Paid") ? "Paid" : "Unpaid"
                }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">
                {{ leave?.empleave_attachement.length === 0 ? "-" : "A" }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p
                class="flex py-1 text-white w-24 items-center justify-center rounded-full"
                :class="
                  leave?.empleave_status === 'Pending'
                    ? 'bg-coral'
                    : leave?.empleave_status === 'Rejected'
                    ? 'bg-red-500'
                    : 'bg-green-500'
                "
              >
                {{ leave?.empleave_status }}
              </p>
            </td>
            <td class="p-3 text-sm flex">
              <div class="relative">
                <button
                  class="text-blue-400 text-md"
                  @click.stop="showReasonNote = i"
                >
                  <font-awesome-icon icon="fa-file" />
                </button>
                <section
                  v-if="showReasonNote === i"
                  class="z-10 bg-white absolute rounded-md top-full left-auto right-0 shadow-md w-72 mt-2.5 px-8 py-4"
                >
                  <h1 class="opacity-70">Reason Note</h1>
                  <p
                    class="mt-5 text-sm bg-amber-100 px-6 py-4 mb-10 text-gray-400"
                  >
                    {{ leave?.empleave_reason }}
                  </p>
                  <div class="flex justify-end mb-6">
                    <Button
                      class="bg-gray-500 text-white w-24 py-2 rounded"
                      @click="showReasonNote = null"
                    >
                      Close
                    </Button>
                  </div>
                </section>
              </div>
              <button
                class="text-xl ml-3"
                @click="
                  showModal = true;
                  detailLeave = leave;
                "
              >
                <img src="../assets/icons/log.svg" />
              </button>
            </td>
            <td class="p-3 text-right relative">
              <Button
                class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
                @click.stop="showActions = i"
              >
                <font-awesome-icon icon="fa-ellipsis" />
              </Button>
              <div
                class="text-left absolute -top-full right-20 rounded-md bg-white shadow-md md:w-max md:h-max"
                v-if="showActions === i"
              >
                <ul>
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    View details
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                    Rejected
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <NoDataShowing v-if="!loadingGet && leave_request.length === 0" />
    </section>
    <Loading class="mt-10" v-if="loadingGet" />
  </section>
  <Modal title="Response Log" :showModal="showModal" @close="showModal = false">
    <section class="flex w-full justify-center">
      <div>
        <h2 class="text-base">At {{ detailLeave?.empleave_apply_date }}</h2>
        <p class="text-gray-400 text-xs">
          Applied by
          <span class="text-blue-400">{{
            detailLeave?.emp_id?.emp_fullname
          }}</span>
        </p>
      </div>
      <section class="relative px-10 border-l-2 h-52 ml-10">
        <div
          class="flex w-10 h-10 p-2 rounded-full bg-gray-100 absolute top-0 -left-5"
        >
          <img src="../assets/icons/log.svg" />
        </div>
        <div class="bg-gray-100 mt-10 px-4 py-2 rounded">
          <h2 class="text-sm flex items-center">
            {{ detailLeave?.empleave_type_id }}
            <span class="w-1.5 block h-1.5 rounded-full bg-gray-300 mx-4" />
            {{ detailLeave?.empleave_leave_duration }}
          </h2>
          <h2 class="text-sm mt-1">
            {{ localDateString(detailLeave?.empleave_start_date) }}
            {{ detailLeave?.empleave_leave_type === "Multi Day" ? "to" : "" }}
            {{
              detailLeave?.empleave_end_date &&
              localDateString(detailLeave?.empleave_end_date)
            }}
          </h2>
          <div class="flex text-xs text-gray-400 mt-2">
            <font-awesome-icon icon="fa-file" />
            <article>
              <p class="ml-2">{{ detailLeave?.empleave_reason }}</p>
            </article>
          </div>
        </div>
      </section>
    </section>
    <section class="mt-4">
      <label class="text-sm">Response Note</label>
      <textarea rows="4" class="w-full mt-2 border outline-primary py-4">
      </textarea>
      <section class="grid grid-cols-3 items-center mt-4">
        <p class="text-sm">Update status</p>
        <div class="flex">
          <Radio
            label="Pending"
            value="Pending"
            :checked="detailLeave?.empleave_status === 'Pending'"
            @change="detailLeave.empleave_status = 'Pending'"
          />
          <Radio
            label="Approved"
            class="mx-8"
            value="Approved"
            :checked="detailLeave?.empleave_status === 'Approved'"
            @change="detailLeave.empleave_status = 'Approved'"
          />
          <Radio
            label="Rejected"
            value="Rejected"
            :checked="detailLeave?.empleave_status === 'Rejected'"
            @change="detailLeave.empleave_status = 'Rejected'"
          />
        </div>
      </section>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditStatus"
          :disabled="loading"
        >
          Save
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import Radio from "./Radio.vue";
import { EditStatusLeaveRequestAPI } from "@/actions/leave-request";
import Loading from "./Loading.vue";
import NoDataShowing from "./NoDataShowing.vue";

export default {
  name: "TableAttadance",
  props: {
    leave_request: Array,
    showMessageStatus: Function,
    loadingGet: Boolean,
  },
  components: { Modal, Radio, Loading, NoDataShowing },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      loading: false,
      showModal: false,
      detailLeave: {},
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
    localDateString(date) {
      let new_date = new Date(date);
      return new_date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    async handleEditStatus() {
      this.loading = true;
      const payload = {
        empleave_status: this.detailLeave?.empleave_status,
      };
      const response = await EditStatusLeaveRequestAPI(
        this.detailLeave?._id,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.showModal = false;
      }
      this.showMessageStatus(response);
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.custom-scrollbar {
  min-height: 396px !important;
  max-width: 100%;
}
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
