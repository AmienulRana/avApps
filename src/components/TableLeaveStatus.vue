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
            <!-- <th class="text-left text-sm">Approved 1</th>
            <th class="text-left text-sm">Approved 2</th>
            <th class="text-left text-sm">HR Approved</th> -->
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
                  <router-link :to="`/employee/${leave?.emp_id?._id}`">{{
                    leave?.emp_id?.emp_fullname
                  }}</router-link>
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
              <p class="text-sm">{{ leave?.empleave_type_id?.leave_name }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm">
                {{ leave?.empleave_type_id?.leave_type }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p
                class="text-sm"
                v-if="leave?.empleave_attachement?.length === 0"
              >
                -
              </p>
              <section class="flex" v-else>
                <a
                  target="_blank"
                  class="mr-2"
                  v-for="(link, i) in leave?.empleave_attachement"
                  :href="`https://api.mufidahgroup.com/images/${link}`"
                  :key="i"
                >
                  <img src="../assets/icons/arrow-link.svg" />
                </a>
              </section>
            </td>
            <!-- <td class="p-3 text-sm">
              <p
                class="flex py-1 text-white w-24 items-center justify-center rounded-full"
                :class="
                  leave?.empleave_fsuperior?.status === 'Pending'
                    ? 'bg-gray-300'
                    : leave?.empleave_fsuperior?.status === 'Approved'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                "
              >
                {{ leave?.empleave_fsuperior?.status }}
              </p>
              <p
                class="text-sm mt-2 text-gray-400"
                v-if="leave?.empleave_fsuperior?.status !== 'Pending'"
              >
                {{
                  leave?.empleave_fsuperior?.fsuperior_id?.emp_id?.emp_fullname
                }}
                <br />
                {{ leave?.empleave_fsuperior?.approved_hours }},
                {{ leave?.empleave_fsuperior?.approved_date }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p
                class="flex py-1 text-white w-24 px-2 items-center justify-center rounded-full"
                :class="
                  leave?.empleave_ssuperior?.status === 'Pending'
                    ? 'bg-gray-300'
                    : leave?.empleave_ssuperior?.status === 'Approved'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                "
              >
                {{ leave?.empleave_ssuperior?.status }}
              </p>
              <p
                class="text-sm mt-2 text-gray-400"
                v-if="leave?.empleave_ssuperior?.status !== 'Pending'"
              >
                {{
                  leave?.empleave_ssuperior?.ssuperior_id?.emp_id?.emp_fullname
                }}
                <br />
                {{ leave?.empleave_ssuperior?.approved_hours }},
                {{ leave?.empleave_ssuperior?.approved_date }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p
                class="flex py-1 text-white w-24 items-center justify-center rounded-full"
                :class="
                  leave?.empleave_hr?.status === 'Pending'
                    ? 'bg-gray-300'
                    : leave?.empleave_hr?.status === 'Approved'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                "
              >
                {{ leave?.empleave_hr?.status }}
              </p>
              <p
                class="text-sm mt-2 text-gray-400"
                v-if="leave?.empleave_hr?.status !== 'Pending'"
              >
                Admin / HR
                <br />
                {{ leave?.empleave_hr?.approved_hours }},
                {{ leave?.empleave_hr?.approved_date }}
              </p>
            </td> -->
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
              <button class="text-xl ml-3" @click="assignLeaveStatus(leave)">
                <img src="../assets/icons/log.svg" />
              </button>
            </td>
            <td class="text-right relative">
              <section class="flex">
                <Button
                  class="p-3 shadow-none hover:bg-blue-100 text-primary rounded-full"
                  @click="assignLeaveDetail(leave)"
                >
                  <font-awesome-icon icon="fa-pen-to-square" />
                </Button>
                <Button
                  class="p-3 shadow-none hover:bg-red-100 text-red-500 rounded-full"
                  @click="handleDeleteLeave(leave?._id)"
                >
                  <font-awesome-icon icon="fa-trash-alt" />
                </Button>
              </section>
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
      <div class="w-36">
        <h2 class="text-base">At {{ detailLeave?.empleave_apply_date }}</h2>
        <p class="text-gray-400 text-xs truncate">
          Applied by
          <span class="text-blue-400">{{
            detailLeave?.emp_id?.emp_fullname
          }}</span>
        </p>
      </div>
      <section class="relative px-10 border-l-2 h-48 ml-10">
        <div
          class="flex w-10 h-10 p-2 rounded-full bg-gray-100 absolute top-0 -left-5"
        >
          <img src="../assets/icons/log.svg" />
        </div>
        <div class="bg-gray-100 mt-10 px-4 py-2 rounded w-60">
          <h2 class="text-sm flex items-center">
            {{ detailLeave?.empleave_type_id?.leave_name }} ({{
              detailLeave?.empleave_type_id?.leave_type
            }})
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
    <section
      class="flex w-full justify-center h-32"
      :class="
        detailLeave?.empleave_hr?.status === 'Pending'
          ? 'pending'
          : detailLeave?.empleave_hr?.status === 'Approved'
          ? 'approved'
          : 'not-approved'
      "
    >
      <div class="opacity-0 w-16 m-1"></div>
      <div
        class="bg-icon flex w-10 h-10 p-2 rounded-full bg-gray-100 justify-center items-center"
      >
        <font-awesome-icon
          icon="fa-check"
          class="text-xl"
          v-if="detailLeave?.empleave_hr?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="detailLeave?.empleave_hr?.status === 'Rejected'"
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
        detailLeave?.empleave_fsuperior?.status === 'Pending'
          ? 'pending'
          : detailLeave?.empleave_fsuperior?.status === 'Approved'
          ? 'approved'
          : 'not-approved'
      "
    >
      <div class="opacity-0 w-16 m-1"></div>
      <div
        class="bg-icon flex w-10 h-10 p-2 rounded-full bg-gray-100 justify-center items-center"
      >
        <font-awesome-icon
          icon="fa-check"
          class="text-xl"
          v-if="detailLeave?.empleave_fsuperior?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="detailLeave?.empleave_fsuperior?.status === 'Rejected'"
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
        detailLeave?.empleave_ssuperior?.status === 'Pending'
          ? 'pending'
          : detailLeave?.empleave_ssuperior?.status === 'Approved'
          ? 'approved'
          : 'not-approved'
      "
    >
      <div class="opacity-0 w-16 m-1"></div>
      <div
        class="flex bg-icon w-10 h-10 p-2 rounded-full justify-center items-center"
      >
        <font-awesome-icon
          icon="fa-check"
          class="text-xl"
          v-if="detailLeave?.empleave_ssuperior?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="detailLeave?.empleave_ssuperior?.status === 'Rejected'"
        />
        <font-awesome-icon icon="fa-clock" class="text-xl" v-else />
      </div>
      <section class="relative px-10 border-l-2 h-full ml-10">
        <div
          class="indicator p-2 w-3 h-3 rounded-full bg-gray-100 absolute top-0 -left-2"
        ></div>
        <div class="bg-gray-100 px-4 py-2 rounded w-52 text-gray-400">
          <p class="text-sm flex items-center">Approve Atasan 2</p>
          <!-- <p class="text-sm mt-1">01 Dec, 22</p> -->
        </div>
      </section>
    </section>
    <section class="mt-4">
      <label class="text-sm">Response Note</label>
      <textarea rows="4" class="w-full mt-2 border outline-primary py-4">
      </textarea>
      <section class="flex justify-between items-center mt-4">
        <p class="text-sm">HR Response</p>
        <div class="flex md:px-16">
          <Radio
            label="Pending"
            @change="detailLeave.empleave_hr.status = 'Pending'"
            :checked="detailLeave?.empleave_hr.status === 'Pending'"
            :modelValue="detailLeave?.empleave_hr.status"
            name="hr_status"
          />
          <Radio
            label="Approved"
            class="mx-8"
            @change="detailLeave.empleave_hr.status = 'Approved'"
            :checked="detailLeave?.empleave_hr.status === 'Approved'"
            :modelValue="detailLeave?.empleave_hr.status"
            name="hr_status"
          />
          <Radio
            label="Rejected"
            @change="detailLeave.empleave_hr.status = 'Rejected'"
            :checked="detailLeave?.empleave_hr.status === 'Rejected'"
            :modelValue="detailLeave?.empleave_hr.status"
            name="hr_status"
          />
        </div>
      </section>
      <section class="flex justify-between items-center mt-4">
        <p class="text-sm">
          {{ detailLeave?.empleave_fsuperior?.fsuperior_id?.des_name }}
          Response
        </p>
        <div class="flex md:px-16">
          <Radio
            label="Pending"
            @change="detailLeave.empleave_fsuperior.status = 'Pending'"
            :checked="detailLeave?.empleave_fsuperior.status === 'Pending'"
            :modelValue="detailLeave?.empleave_fsuperior.status"
            name="fs_status"
          />
          <Radio
            label="Approved"
            class="mx-8"
            @change="detailLeave.empleave_fsuperior.status = 'Approved'"
            :checked="detailLeave?.empleave_fsuperior.status === 'Approved'"
            :modelValue="detailLeave?.empleave_fsuperior.status"
            name="fs_status"
          />
          <Radio
            label="Rejected"
            @change="detailLeave.empleave_fsuperior.status = 'Rejected'"
            :checked="detailLeave?.empleave_fsuperior.status === 'Rejected'"
            :modelValue="detailLeave?.empleave_fsuperior.status"
            name="fs_status"
          />
        </div>
      </section>
      <section class="flex justify-between items-center mt-4">
        <p class="text-sm">
          {{ detailLeave?.empleave_ssuperior?.ssuperior_id?.des_name }} Response
        </p>
        <div class="flex md:px-16">
          <Radio
            label="Pending"
            @change="detailLeave.empleave_ssuperior.status = 'Pending'"
            :checked="detailLeave?.empleave_ssuperior.status === 'Pending'"
            :modelValue="detailLeave?.empleave_ssuperior.status"
            name="ss_status"
          />
          <Radio
            label="Approved"
            class="mx-8"
            @change="detailLeave.empleave_ssuperior.status = 'Approved'"
            :checked="detailLeave?.empleave_ssuperior.status === 'Approved'"
            :modelValue="detailLeave?.empleave_ssuperior.status"
            name="ss_status"
          />
          <Radio
            label="Rejected"
            @change="detailLeave.empleave_ssuperior.status = 'Rejected'"
            :checked="detailLeave?.empleave_ssuperior.status === 'Rejected'"
            :modelValue="detailLeave?.empleave_ssuperior.status"
            name="ss_status"
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
import {
  EditStatusLeaveRequestAPI,
  DeleteStatusLeaveRequestAPI,
} from "@/actions/leave-request";
import Loading from "./Loading.vue";
import NoDataShowing from "./NoDataShowing.vue";
import Button from "./Button.vue";
import { getDate } from "@/utils/getDate";
import { getCurrentTime } from "@/utils/getHours";

export default {
  name: "TableAttadance",
  props: {
    leave_request: Array,
    showMessageStatus: Function,
    loadingGet: Boolean,
    getLeaveRequest: Function,
    assignLeaveDetail: Function,
  },
  components: { Modal, Radio, Loading, NoDataShowing, Button },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      loading: false,
      showModal: false,
      detailLeave: {
        leave_request_id: "",
        empleave_fsuperior: {
          fsuperior_id: {
            des_name: "",
          },
          status: "",
          approved_by: "",
          approved_date: "",
          approved_hours: "",
        },
        empleave_ssuperior: {
          ssuperior_id: {
            des_name: "",
          },
          approved_by: "",
          status: "",
          approved_date: "",
          approved_hours: "",
        },
        empleave_hr: {
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
    localDateString(date) {
      let new_date = new Date(date);
      return new_date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    assignLeaveStatus(leave) {
      this.showModal = true;
      this.detailLeave = { ...leave };
      this.detailLeave.leave_request_id = leave?._id;
      this.detailLeave.empleave_ssuperior = { ...leave?.empleave_ssuperior };
      this.detailLeave.empleave_fsuperior = { ...leave?.empleave_fsuperior };
      this.detailLeave.empleave_hr = { ...leave?.empleave_hr };
    },
    async handleEditStatus() {
      this.loading = true;
      const payload = {
        empleave_hr: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.detailLeave.empleave_hr.status,
        },
        empleave_fsuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.detailLeave.empleave_fsuperior.status,
        },
        empleave_ssuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.detailLeave.empleave_ssuperior.status,
        },
      };
      const response = await EditStatusLeaveRequestAPI(
        this.detailLeave?.leave_request_id,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.showModal = false;
        this.getLeaveRequest();
      }
      this.showMessageStatus(response);
      this.loading = false;
    },
    async handleDeleteLeave(id) {
      const response = await DeleteStatusLeaveRequestAPI(id);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.getLeaveRequest();
      }
      this.showMessageStatus(response);
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
