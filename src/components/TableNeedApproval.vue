<template>
  <section class="relative bg-white">
    <section
      class="w-full overflow-x-auto custom-scrollbar bg-white"
      @click="
        showActions = null;
        showReasonNote = null;
      "
    >
      <table class="bg-white min-w-max mt-6 w-full pb-4">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm">Request Name</th>
            <th class="text-left text-sm">Employee List</th>
          </tr>
        </thead>
        <tbody v-if="!loading && overtime_request.length !== 0">
          <tr
            class="border-b h-max"
            v-for="(overtime, i) in overtime_request"
            :key="i"
          >
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">
                {{ overtime?.type }}
              </p>
            </td>
            <td
              class="items-center p-3 text-sm flex"
              v-if="
                showModeList === 'profile' ||
                (showModeList === 'full' && showModeListIdx !== overtime.type)
              "
              @click="
                showModeList = 'full';
                showModeListIdx = overtime?.type;
              "
            >
              <template v-if="overtime?.data?.length > 0">
                <div
                  class="w-12 h-12 border-white border-2 hover:z-10 shadow-md duration-300 hover:-mt-2 cursor-pointer flex justify-center items-center rounded-full bg-zinc-400"
                  v-for="(request, i) in overtime?.data"
                  :style="`transform:translateX(${
                    i !== 0 ? `-${i * 0.5}rem` : '0'
                  })`"
                  :key="i"
                >
                  <h2 class="text-md text-white">
                    {{
                      request?.emp_id?.emp_fullname.substr(0, 1) +
                      request?.emp_id?.emp_fullname.substr(
                        request?.emp_id?.emp_fullname.indexOf(" ") + 1,
                        1
                      )
                    }}
                  </h2>
                </div>
              </template>
              <p v-else class="text-gray-400 h-12 flex items-center">
                No Employment Request
              </p>
            </td>
            <td
              class="p-3 text-sm"
              @click="
                showModeList = 'profile';
                showModeListIdx = overtime.type;
              "
              v-else-if="
                showModeList === 'full' && showModeListIdx === overtime.type
              "
            >
              <template v-if="overtime?.data?.length > 0">
                <section
                  v-for="(request, i) in overtime?.data"
                  :key="i"
                  class="flex items-center mb-2 cursor-pointer"
                >
                  <div
                    class="w-12 h-12 shadow-md flex justify-center items-center rounded-full bg-zinc-400"
                  >
                    <h2 class="text-md text-white">
                      {{
                        request?.emp_id?.emp_fullname.substr(0, 1) +
                        request?.emp_id?.emp_fullname.substr(
                          request?.emp_id?.emp_fullname.indexOf(" ") + 1,
                          1
                        )
                      }}
                    </h2>
                  </div>
                  <div class="ml-5">
                    <h1
                      class="text-blue-400 text-base hover:opacity-70"
                      @click.stop="
                        assignDetailRequest(request, showModeListIdx)
                      "
                    >
                      {{ request?.emp_id?.emp_fullname }}
                    </h1>
                    <p class="text-sm mb-1 text-gray-400">
                      {{ request?.emp_id?.email }}
                    </p>
                  </div>
                </section>
              </template>

              <p v-else class="text-gray-400 h-12 flex items-center">
                No Employment Request
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <NoDataShowing v-if="!loading && overtime_request.length === 0" />
    </section>
    <Loading class="mt-10" v-if="loading" />
  </section>
  <Modal
    title="Response Log"
    :showModal="showModal === 'leave'"
    @close="showModal = false"
  >
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
          :disabled="loading.edit"
        >
          Save
        </Button>
      </section>
    </template>
  </Modal>
  <Modal
    title="Response Log"
    :showModal="showModal === 'not leave'"
    @close="showModal = false"
  >
    <section
      class="flex w-full justify-center h-32"
      :class="
        data.hr?.status === 'Pending'
          ? 'pending'
          : data.hr?.status === 'Approved'
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
          v-if="data.hr?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="data.hr?.status === 'Rejected'"
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
        data.fsuperior?.status === 'Pending'
          ? 'pending'
          : data.fsuperior?.status === 'Approved'
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
          v-if="data.fsuperior?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="data.fsuperior?.status === 'Rejected'"
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
        data.ssuperior?.status === 'Pending'
          ? 'pending'
          : data.ssuperior?.status === 'Approved'
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
          v-if="data.ssuperior?.status === 'Approved'"
        />
        <font-awesome-icon
          icon="fa-xmark"
          class="text-xl"
          v-else-if="data.ssuperior?.status === 'Rejected'"
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
    <section class="flex justify-between items-center mt-4">
      <p class="text-sm">HR Response</p>
      <div class="flex md:px-16">
        <Radio
          label="Pending"
          @change="data.hr.status = 'Pending'"
          :checked="data.hr.status === 'Pending'"
          :modelValue="data.hr.status"
          name="hr_status"
        />
        <Radio
          label="Approved"
          class="mx-8"
          @change="data.hr.status = 'Approved'"
          :checked="data.hr.status === 'Approved'"
          :modelValue="data.hr.status"
          name="hr_status"
        />
        <Radio
          label="Rejected"
          @change="data.hr.status = 'Rejected'"
          :checked="data.hr.status === 'Rejected'"
          :modelValue="data.hr.status"
          name="hr_status"
        />
      </div>
    </section>
    <section class="flex justify-between items-center mt-4">
      <p class="text-sm">
        {{ data.fsuperior?.fsuperior_id?.des_name }} Response
      </p>
      <div class="flex md:px-16">
        <Radio
          label="Pending"
          @change="data.fsuperior.status = 'Pending'"
          :checked="data.fsuperior.status === 'Pending'"
          :modelValue="data.fsuperior.status"
          name="fs_status"
        />
        <Radio
          label="Approved"
          class="mx-8"
          @change="data.fsuperior.status = 'Approved'"
          :checked="data.fsuperior.status === 'Approved'"
          :modelValue="data.fsuperior.status"
          name="fs_status"
        />
        <Radio
          label="Rejected"
          @change="data.fsuperior.status = 'Rejected'"
          :checked="data.fsuperior.status === 'Rejected'"
          :modelValue="data.fsuperior.status"
          name="fs_status"
        />
      </div>
    </section>
    <section class="flex justify-between items-center mt-4">
      <p class="text-sm">
        {{ data.ssuperior?.ssuperior_id?.des_name }} Response
      </p>
      <div class="flex md:px-16">
        <Radio
          label="Pending"
          @change="data.ssuperior.status = 'Pending'"
          :checked="data.ssuperior?.status === 'Pending'"
          :modelValue="data.ssuperior?.status"
          name="ss_status"
        />
        <Radio
          label="Approved"
          class="mx-8"
          @change="data.ssuperior.status = 'Approved'"
          :checked="data.ssuperior?.status === 'Approved'"
          :modelValue="data.ssuperior?.status"
          name="ss_status"
        />
        <Radio
          label="Rejected"
          @change="data.ssuperior.status = 'Rejected'"
          :checked="data.ssuperior?.status === 'Rejected'"
          :modelValue="data.ssuperior?.status"
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
          @click="handleEditStatusRequest"
          :disabled="loading_request.edit"
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
import Button from "./Button.vue";
import { getDate } from "@/utils/getDate";
import { getCurrentTime } from "@/utils/getHours";
import { EditOvertimeRequestAPI } from "@/actions/overtime-request";
import { EditOvertimeRequestAPI as EditOutsideRequestAPI } from "@/actions/outside-request";
import Loading from "./Loading.vue";
import NoDataShowing from "./NoDataShowing.vue";
import { EditStatusLeaveRequestAPI } from "@/actions/leave-request";
import { useToast } from "vue-toastification";
import { EditOffdayRequestAPI } from "@/actions/offday";
import { EditChangeWorkshiftAPI } from "@/actions/change-shift";

export default {
  name: "TableAttadance",
  components: { Modal, Radio, Button, Loading, NoDataShowing },
  props: {
    loading: Boolean,
    overtime_request: Array,
    getNeedApproval: Function,
  },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      showModeList: "profile",
      showModeListIdx: null,
      showModal: false,
      loading_request: {
        edit: false,
      },
      detailLeave: {},
      data: {
        request_id: "",
        fsuperior: {
          fsuperior_id: {
            des_name: "",
          },
          status: "",
          approved_by: "",
          approved_date: "",
          approved_hours: "",
        },
        ssuperior: {
          ssuperior_id: {
            des_name: "",
          },
          approved_by: "",
          status: "",
          approved_date: "",
          approved_hours: "",
        },
        hr: {
          status: "",
          approved_by: "HR / Admin App",
          approved_date: "",
          approved_hours: "",
        },
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    showMessageStatus(response) {
      if (response.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
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
    formatAMPM(time) {
      let hours = parseInt(time.substr(0, 2));
      let minutes = time.substr(3, 2);
      let ampm = hours >= 12 ? "PM" : "AM";
      let formattedTime = hours + ":" + minutes + " " + ampm;
      return formattedTime;
    },
    assignDetailLeaveRequest(request) {
      console.log(request);
      this.detailLeave = request;
    },
    assignDetailOvertimeRequest(request) {
      this.data.request_id = request?._id;
      this.data.fsuperior = { ...request?.overtime_fsuperior };
      this.data.ssuperior = { ...request?.overtime_ssuperior };
      this.data.hr = { ...request?.overtime_hr };
    },
    assignDetailOutsideRequest(request) {
      this.data.request_id = request?._id;
      this.data.fsuperior = { ...request?.outside_fsuperior };
      this.data.ssuperior = { ...request?.outside_ssuperior };
      this.data.hr = { ...request?.outside_hr };
    },
    assignDetailOffdayRequest(request) {
      this.data.request_id = request?._id;
      this.data.fsuperior = { ...request?.offday_fsuperior };
      this.data.ssuperior = { ...request?.offday_ssuperior };
      this.data.hr = { ...request?.offday_hr };
    },
    assignDetailWorkshiftRequest(request) {
      this.data.request_id = request?._id;
      this.data.fsuperior = { ...request?.empchange_fsuperior };
      this.data.ssuperior = { ...request?.empchange_ssuperior };
      this.data.hr = { ...request?.empchange_hr };
    },
    assignDetailRequest(request, type) {
      this.showModal = type === "Leave Request" ? "leave" : "not leave";
      if (type === "Leave Request") {
        this.assignDetailLeaveRequest(request);
      } else if (type === "Overtime Request") {
        this.assignDetailOvertimeRequest(request);
      } else if (type === "Outside Assignment") {
        this.assignDetailOutsideRequest(request);
      } else if (type === "Change Offday") {
        this.assignDetailOffdayRequest(request);
      } else if (type === "Change Workshift") {
        this.assignDetailWorkshiftRequest(request);
      }
    },
    handleEditStatusRequest() {
      const type = this.showModeListIdx;
      if (type === "Overtime Request") {
        this.handleEditOvertimeRequest();
      } else if (type === "Outside Assignment") {
        this.handleEditOutsideRequest();
      } else if (type === "Change Offday") {
        this.handleEditOffdayRequest();
      } else if (type === "Change Workshift") {
        this.handleEditWorkshiftRequest();
      }
    },
    async handleEditOvertimeRequest() {
      this.loading_request.edit = true;
      const payload = {
        overtime_hr: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.hr.status,
        },
        overtime_fsuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.fsuperior.status,
        },
        overtime_ssuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.ssuperior.status,
        },
      };
      const response = await EditOvertimeRequestAPI(
        this.data?.request_id,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.showModal = false;
        this.getNeedApproval();
      }
      this.showMessageStatus(response);
      this.loading_request.edit = false;
    },
    async handleEditOutsideRequest() {
      this.loading_request.edit = true;
      const payload = {
        outside_hr: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.hr.status,
        },
        outside_fsuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.fsuperior.status,
        },
        outside_ssuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.ssuperior.status,
        },
      };
      const response = await EditOutsideRequestAPI(
        this.data?.request_id,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.showModal = false;
        this.getNeedApproval();
      }
      this.showMessageStatus(response);
      this.loading_request.edit = false;
    },
    async handleEditOffdayRequest() {
      this.loading_request.edit = true;
      const payload = {
        offday_hr: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data?.hr?.status,
        },
        offday_fsuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data?.fsuperior?.status,
        },
        offday_ssuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data?.ssuperior?.status,
        },
      };
      const response = await EditOffdayRequestAPI(
        this.data?.request_id,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.showModal = false;
        this.getNeedApproval();
      }
      this.showMessageStatus(response);
      this.loading_request.edit = false;
    },
    async handleEditWorkshiftRequest() {
      this.loading_request.edit = true;
      const payload = {
        empchange_hr: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.hr.status,
        },
        empchange_fsuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.fsuperior.status,
        },
        empchange_ssuperior: {
          approved_by: "HR / Admin App",
          approved_date: getDate(),
          approved_hours: getCurrentTime(),
          status: this.data.ssuperior.status,
        },
      };
      const response = await EditChangeWorkshiftAPI(
        this.data?.request_id,
        payload
      );
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response.status === 200) {
        this.showModal = false;
        this.getNeedApproval();
      }
      this.showMessageStatus(response);
      this.loading_request.edit = false;
    },
    async handleEditStatus() {
      this.loading_request.edit = true;
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
        this.getNeedApproval();
      }
      this.showMessageStatus(response);
      this.loading_request.edit = false;
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
