<template>
  <section
    class="w-full overflow-x-auto custom-scrollbar relative bg-white"
    :class="loading ? 'h-96' : ''"
    @click="
      showActions = null;
      showReasonNote = null;
    "
  >
    <table class="bg-white min-w-max mt-6 w-full pb-4">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm">Profile</th>
          <th class="text-left text-sm">Date Request</th>
          <th class="text-left text-sm">Workshift</th>
          <th class="text-left text-sm">Change To</th>
          <th class="text-left text-sm">Replacement</th>
          <th class="text-left text-sm">Reason</th>
          <th class="text-left text-sm">Approved 1</th>
          <th class="text-left text-sm">Approved 2</th>
          <th class="text-left text-sm">HR Approved</th>
          <th class="text-left text-sm">Activity</th>
          <th class="text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="border-b h-max"
          v-for="(change, i) in change_shifts"
          :key="i"
        >
          <td class="flex items-center p-3 text-sm">
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">
                {{
                  change?.emp_id?.emp_fullname.substr(0, 1) +
                  change?.emp_id?.emp_fullname.substr(
                    change?.emp_id?.emp_fullname.indexOf(" ") + 1,
                    1
                  )
                }}
              </h2>
            </div>
            <div class="ml-5">
              <h1 class="text-blue-400 text-base">
                {{ change?.emp_id?.emp_fullname }}
              </h1>
              <p class="text-sm mb-1 text-gray-400">
                {{ change?.emp_id?.emp_depid?.dep_name }}
              </p>
              <p class="text-xs mb-1 text-gray-400">
                {{ change?.company_id?.company_name }}
              </p>
            </div>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">
              {{ formatDate(change?.empchange_date_request) }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">
              {{ change?.empchange_shift_before?.shift_name }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">
              {{ change?.empchange_to?.shift_name }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">
              {{ change?.empchange_replacement?.emp_fullname }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">
              {{ change?.empchange_reason }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 items-center justify-center rounded-full"
              :class="
                change?.empchange_fsuperior?.status === 'Pending'
                  ? 'bg-gray-300'
                  : change?.empchange_fsuperior?.status === 'Approved'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              "
            >
              {{ change?.empchange_fsuperior?.status }}
            </p>
            <p
              class="text-sm mt-2 text-gray-400"
              v-if="change?.empchange_fsuperior?.status !== 'Pending'"
            >
              {{
                change?.empchange_fsuperior?.fsuperior_id?.emp_id?.emp_fullname
              }}
              <br />
              {{ change?.empchange_fsuperior?.approved_hours }},
              {{ change?.empchange_fsuperior?.approved_date }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 px-2 items-center justify-center rounded-full"
              :class="
                change?.empchange_ssuperior?.status === 'Pending'
                  ? 'bg-gray-300'
                  : change?.empchange_ssuperior?.status === 'Approved'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              "
            >
              {{ change?.empchange_ssuperior?.status }}
            </p>
            <p
              class="text-sm mt-2 text-gray-400"
              v-if="change?.empchange_ssuperior?.status !== 'Pending'"
            >
              {{
                change?.empchange_ssuperior?.ssuperior_id?.emp_id?.emp_fullname
              }}
              <br />
              {{ change?.empchange_ssuperior?.approved_hours }},
              {{ change?.empchange_ssuperior?.approved_date }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 items-center justify-center rounded-full"
              :class="
                change?.empchange_hr?.status === 'Pending'
                  ? 'bg-gray-300'
                  : change?.empchange_hr?.status === 'Approved'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              "
            >
              {{ change?.empchange_hr?.status }}
            </p>
            <p
              class="text-sm mt-2 text-gray-400"
              v-if="change?.empchange_hr?.status !== 'Pending'"
            >
              Admin / HR
              <br />
              {{ change?.empchange_hr?.approved_hours }},
              {{ change?.empchange_hr?.approved_date }}
            </p>
          </td>
          <td class="p-3 text-sm flex">
            <button
              class="text-xl ml-3"
              @click="assignDetailStatusoffday(change)"
            >
              <img src="../assets/icons/log.svg" />
            </button>
          </td>
          <td class="p-3 text-right relative">
            <section class="flex">
              <Button
                class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                @click="assignChangeWorkshift(change)"
              >
                <font-awesome-icon icon="fa-pen-to-square" />
              </Button>
              <Button
                class="p-3 shadow-none hover:bg-red-100 text-red-500 rounded-full"
                @click="handleDeleteOffdayRequest(change?._id)"
              >
                <font-awesome-icon icon="fa-trash-alt" />
              </Button>
            </section>
          </td>
        </tr>
      </tbody>
    </table>
    <Loading v-if="loading" />
    <NoDataShowing
      v-if="!loading && change_shifts.length === 0"
      class="mb-10"
    />
  </section>
  <Modal title="Response Log" :showModal="showModal" @close="showModal = false">
    <section
      class="flex w-full justify-center h-32"
      :class="
        data.empchange_hr?.status === 'Pending'
          ? 'pending'
          : data.empchange_hr?.status === 'Approved'
          ? 'approved'
          : 'not-approved'
      "
    >
      <div
        class="bg-icon flex w-10 h-10 p-2 rounded-full bg-gray-100 justify-center items-center"
      >
        <font-awesome-icon
          icon="fa-check"
          class="text-xl"
          v-if="data.empchange_hr?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="data.empchange_hr?.status === 'Rejected'"
        />
        <font-awesome-icon icon="fa-clock" class="text-xl" v-else />
      </div>
      <section class="relative px-10 border-l-2 h-full ml-10">
        <div
          class="indicator p-2 w-3 h-3 rounded-full bg-gray-100 absolute top-0 -left-2"
        ></div>
        <div class="bg-gray-100 px-4 py-2 rounded w-52 text-gray-400">
          <p class="text-sm flex items-center">Approve HR</p>
          <!-- <p class="text-sm mt-1">01 Dec, 22</p> -->
        </div>
      </section>
    </section>
    <section
      class="flex w-full justify-center h-32"
      :class="
        data.empchange_fsuperior?.status === 'Pending'
          ? 'pending'
          : data.empchange_fsuperior?.status === 'Approved'
          ? 'approved'
          : 'not-approved'
      "
    >
      <div
        class="bg-icon flex w-10 h-10 p-2 rounded-full bg-gray-100 justify-center items-center"
      >
        <font-awesome-icon
          icon="fa-check"
          class="text-xl"
          v-if="data.empchange_fsuperior?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="data.empchange_fsuperior?.status === 'Rejected'"
        />
        <font-awesome-icon icon="fa-clock" class="text-xl" v-else />
      </div>
      <section class="relative px-10 border-l-2 h-full ml-10">
        <div
          class="indicator p-2 w-3 h-3 rounded-full bg-gray-100 absolute top-0 -left-2"
        ></div>
        <div class="bg-gray-100 px-4 py-2 rounded w-52 text-gray-400">
          <p class="text-sm flex items-center">Approve Atasan 1</p>
          <!-- <p class="text-sm mt-1">01 Dec, 22</p> -->
        </div>
      </section>
    </section>

    <section
      class="flex w-full justify-center h-32"
      :class="
        data.empchange_ssuperior?.status === 'Pending'
          ? 'pending'
          : data.empchange_ssuperior?.status === 'Approved'
          ? 'approved'
          : 'not-approved'
      "
    >
      <div
        class="flex bg-icon w-10 h-10 p-2 rounded-full justify-center items-center"
      >
        <font-awesome-icon
          icon="fa-check"
          class="text-xl"
          v-if="data.empchange_ssuperior?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="data.empchange_ssuperior?.status === 'Rejected'"
        />
        <font-awesome-icon icon="fa-clock" class="text-xl" v-else />
      </div>
      <section class="relative px-10 border-l-2 h-full ml-10">
        <div
          class="indicator p-2 w-3 h-3 rounded-full bg-gray-100 absolute top-0 -left-2"
        ></div>
        <div class="bg-gray-100 px-4 py-2 rounded w-52 text-gray-400">
          <p class="text-sm flex items-center">
            Approve Atasan 2 <br />
            <!-- {{ empchange?.empchange_ssuperior?.ssuperior_id?.emp_id?.emp_fullname }} -->
          </p>
          <!-- <p class="text-sm mt-1">01 Dec, 22</p> -->
        </div>
      </section>
    </section>
    <section class="flex justify-between items-center mt-4">
      <p class="text-sm">HR Response</p>
      <div class="flex md:px-16">
        <Radio
          label="Pending"
          @change="data.empchange_hr.status = 'Pending'"
          :checked="data.empchange_hr.status === 'Pending'"
          :modelValue="data.empchange_hr.status"
          name="hr_status"
        />
        <Radio
          label="Approved"
          class="mx-8"
          @change="data.empchange_hr.status = 'Approved'"
          :checked="data.empchange_hr.status === 'Approved'"
          :modelValue="data.empchange_hr.status"
          name="hr_status"
        />
        <Radio
          label="Rejected"
          @change="data.empchange_hr.status = 'Rejected'"
          :checked="data.empchange_hr.status === 'Rejected'"
          :modelValue="data.empchange_hr.status"
          name="hr_status"
        />
      </div>
    </section>
    <section class="flex justify-between items-center mt-4">
      <p class="text-sm">
        {{ data.empchange_fsuperior?.fsuperior_id?.des_name }} Response
      </p>
      <div class="flex md:px-16">
        <Radio
          label="Pending"
          @change="data.empchange_fsuperior.status = 'Pending'"
          :checked="data.empchange_fsuperior.status === 'Pending'"
          :modelValue="data.empchange_fsuperior.status"
          name="fs_status"
        />
        <Radio
          label="Approved"
          class="mx-8"
          @change="data.empchange_fsuperior.status = 'Approved'"
          :checked="data.empchange_fsuperior.status === 'Approved'"
          :modelValue="data.empchange_fsuperior.status"
          name="fs_status"
        />
        <Radio
          label="Rejected"
          @change="data.empchange_fsuperior.status = 'Rejected'"
          :checked="data.empchange_fsuperior.status === 'Rejected'"
          :modelValue="data.empchange_fsuperior.status"
          name="fs_status"
        />
      </div>
    </section>
    <section class="flex justify-between items-center mt-4">
      <p class="text-sm">
        {{ data.empchange_ssuperior?.ssuperior_id?.des_name }} Response
      </p>
      <div class="flex md:px-16">
        <Radio
          label="Pending"
          @change="data.empchange_ssuperior.status = 'Pending'"
          :checked="data.empchange_ssuperior.status === 'Pending'"
          :modelValue="data.empchange_ssuperior.status"
          name="ss_status"
        />
        <Radio
          label="Approved"
          class="mx-8"
          @change="data.empchange_ssuperior.status = 'Approved'"
          :checked="data.empchange_ssuperior.status === 'Approved'"
          :modelValue="data.empchange_ssuperior.status"
          name="ss_status"
        />
        <Radio
          label="Rejected"
          @change="data.empchange_ssuperior.status = 'Rejected'"
          :checked="data.empchange_ssuperior.status === 'Rejected'"
          :modelValue="data.empchange_ssuperior.status"
          name="ss_status"
        />
      </div>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="handleEditOffdayRequest"
          :disabled="loading_shift.edit"
        >
          Save
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import { getDate } from "@/utils/getDate";
import { getCurrentTime } from "@/utils/getHours";
import Radio from "./Radio.vue";
import {
  EditChangeWorkshiftAPI,
  DeleteChangeWorkshiftAPI,
} from "@/actions/change-shift";
import Loading from "./Loading.vue";
import NoDataShowing from "@/components/NoDataShowing.vue";

export default {
  name: "TableOutsideAssignment",
  props: {
    loading: Boolean,
    change_shifts: Array,
    getRequestShift: Function,
    showMessageStatus: Function,
    assignChangeWorkshift: Function,
  },
  components: { Modal, Radio, Loading, NoDataShowing },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      showModal: false,
      loading_shift: {
        edit: false,
      },
      data: {
        empchange_request_id: "",
        empchange_fsuperior: {
          fsuperior_id: {
            des_name: "",
          },
          status: "",
          approved_by: "",
          approved_date: "",
          approved_hours: "",
        },
        empchange_ssuperior: {
          ssuperior_id: {
            des_name: "",
          },
          approved_by: "",
          status: "",
          approved_date: "",
          approved_hours: "",
        },
        empchange_hr: {
          status: "",
          approved_by: "HR / Admin App",
          approved_date: "",
          approved_hours: "",
        },
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
    formatAMPM(time) {
      let hours = parseInt(time.substr(0, 2));
      let minutes = time.substr(3, 2);
      let ampm = hours >= 12 ? "PM" : "AM";
      let formattedTime = hours + ":" + minutes + " " + ampm;
      return formattedTime;
    },
    assignDetailStatusoffday(change) {
      this.showModal = true;
      this.data.empchange_request_id = change?._id;
      this.data.empchange_fsuperior = { ...change?.empchange_fsuperior };
      this.data.empchange_ssuperior = { ...change?.empchange_ssuperior };
      this.data.empchange_hr = { ...change?.empchange_hr };
    },
    formatDate(input) {
      let date;
      if (input?.includes("/")) {
        date = new Date(input);
      } else if (input?.includes("-")) {
        date = new Date(input.replace(/-/g, "/"));
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },
    formatDay(input) {
      const date = new Date(input);
      return date.toLocaleDateString("id", {
        weekday: "long",
      });
    },
    async handleEditOffdayRequest() {
      this.loading_shift.edit = true;
      const payload = {
        empchange_hr: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.empchange_hr.status,
        },
        empchange_fsuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.empchange_fsuperior.status,
        },
        empchange_ssuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.empchange_ssuperior.status,
        },
      };
      const response = await EditChangeWorkshiftAPI(
        this.data?.empchange_request_id,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.showModal = false;
        this.getRequestShift();
      }
      this.showMessageStatus(response);
      this.loading_shift.edit = false;
    },
    async handleDeleteOffdayRequest(id) {
      this.loading_shift.edit = true;
      const response = await DeleteChangeWorkshiftAPI(id);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.getRequestShift();
      }
      this.showMessageStatus(response);
      this.loading_shift.edit = false;
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

.pending svg {
  color: rgb(164, 164, 164);
}
.pending .indicator {
  background: rgb(164, 164, 164) !important;
}
</style>
