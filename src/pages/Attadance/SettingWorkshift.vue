<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="px-8 mt-6 w-full overflow-x-hiden">
      <section class="flex justify-between items-center mb-8">
        <section class="flex items-center">
          <h1 class="text-2xl">Setting Workshift</h1>
          <ChoiseCompany
            v-if="superAdmin && !loading?.getCompany"
            @selected:company="dataCompany = $event"
            :options="optionsCompany"
            :dataCompany="dataCompany"
          />
        </section>
        <div class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2"
            @click="modal.showModal = true"
          >
            Add Workshift</Button
          >
        </div>
      </section>
      <section class="w-full">
        <section
          class="w-full overflow-x-auto custom-scrollbar bg-white mb-10"
          @click="showActions = null"
        >
          <table class="bg-white min-w-max mt-6 w-full pb-4">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm">Company Name</th>
                <th class="text-left text-sm">Shift Name</th>
                <th class="text-left text-sm">Start At</th>
                <th class="text-left text-sm">End At</th>
                <th class="text-left text-sm">Type</th>
                <th class="text-left text-sm">Break Duration</th>
                <th class="text-left text-sm">Status</th>
                <th class="text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b h-max" v-for="(shift, i) in shifts" :key="i">
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
                  <p
                    class="flex py-1 text-white w-24 items-center justify-center rounded-full"
                    :class="
                      shift?.shift_type === 'Schedule'
                        ? 'bg-coral'
                        : 'bg-green-500'
                    "
                  >
                    {{ shift?.shift_type }}
                  </p>
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
                        class="px-4 py-2 hover:bg-gray-100 cursor-pointer hover:text-blue-400 text-sm"
                        @click="assignDetailShift(shift)"
                      >
                        Edit
                      </li>
                      <li
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-blue-400 text-sm"
                        @click="deleteNewShift(shift?._id)"
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    :title="`${modal.edit ? 'Edit' : 'Add'} Workshift`"
    :showModal="modal.showModal"
    @close="
      modal.showModal = false;
      modal.edit = false;
      shift_type = 'Regular';
      clearInputValue();
    "
  >
    <template #header>
      <ChoiseCompany
        v-if="superAdmin"
        @selected:company="dataCompany = $event"
        :options="optionsCompany"
        :dataCompany="dataCompany"
      />
    </template>
    <section
      @click="
        modal.showSelect = false;
        modal.showTime = false;
      "
    >
      <Input
        label="Shift Name"
        class="flex-col mt-4"
        label_class="w-full"
        input_class="mt-2"
        @change="data.shift_name = $event"
        :value="data?.shift_name"
      />
      <template v-if="shift_type === 'Regular'">
        <section class="my-2 flex justify-between items-center">
          <InputTime
            label="Clock In"
            :isOpen="modal.showTime === 'in'"
            @showTime="modal.showTime = 'in'"
            @selected-hour="modal.time_clockin.hour = $event"
            @selected-minute="modal.time_clockin.minute = $event"
            :hourValue="modal.time_clockin.hour"
            :minuteValue="modal.time_clockin.minute"
          />
          <InputTime
            label="Clock Out"
            :isOpen="modal.showTime === 'out'"
            @showTime="modal.showTime = 'out'"
            @selected-hour="modal.time_clockout.hour = $event"
            @selected-minute="modal.time_clockout.minute = $event"
            :hourValue="modal.time_clockout.hour"
            :minuteValue="modal.time_clockout.minute"
          />
          <Input
            type="number"
            label="Break Duration"
            class="flex-col mt-4 w-28"
            label_class="w-full"
            input_class="mt-2"
            @change="data.shift_break_duration = $event"
            :value="data?.shift_break_duration"
          />
        </section>
        <section class="my-2 flex justify-between items-center">
          <Input
            type="number"
            label="Shift Late Tolarance"
            class="flex-col md:w-5/12 mt-4"
            label_class="w-full"
            input_class="mt-2"
            @change="data.shift_late_tolarance = $event"
            :value="data?.shift_late_tolarance"
          />
          <Input
            type="number"
            label="Shift Very Late Tolarance"
            class="flex-col md:w-5/12 mt-4"
            label_class="w-full"
            input_class="mt-2"
            @change="data.shift_verylate_tolarance = $event"
            :value="data?.shift_verylate_tolarance"
          />
        </section>
      </template>
      <div
        class="md:flex justify-between items-center mb-2.5 mt-4"
        v-if="!modal.edit"
      >
        <label class="w-max">Choose a working shift type</label>
        <div class="flex md:w-4/6 w-full mt-1">
          <Radio
            label="Regular"
            class="mr-5"
            value="Regular"
            :checked="shift_type === 'Regular'"
            @change="shift_type = 'Regular'"
          />
          <Radio
            label="Schedule"
            class="mr-5"
            :checked="shift_type === 'Schedule'"
            value="Schedule"
            @change="shift_type = 'Schedule'"
          />
        </div>
      </div>
      <template v-if="shift_type === 'Schedule'">
        <p class="mb-2">
          Set Scheduled Week
          <span class="text-xs text-gray-500"
            >(Set week with customized time)</span
          >
        </p>
        <section class="my-2 flex justify-between items-center">
          <Input
            type="number"
            label="Shift Late Tolarance"
            class="flex-col md:w-5/12 mt-4"
            label_class="w-full"
            input_class="mt-2"
            @change="data.shift_late_tolarance = $event"
            :value="data?.shift_late_tolarance"
          />
          <Input
            type="number"
            label="Shift Very Late Tolarance"
            class="flex-col md:w-5/12 mt-4"
            label_class="w-full"
            input_class="mt-2"
            @change="data.shift_verylate_tolarance = $event"
            :value="data?.shift_verylate_tolarance"
          />
        </section>
        <section class="mb-2.5" v-for="(week, i) in weeks" :key="i">
          <p class="mb-1.5 text-sm">{{ week?.title }}</p>
          <section class="flex justify-between items-center">
            <InputTime
              label="Clock In"
              :isOpen="modal.showTime === week?.time_state_in"
              @showTime="modal.showTime = week?.time_state_in"
              @selected-hour="modal[week?.state].in.hour = $event"
              @selected-minute="modal[week?.state].in.minute = $event"
              :hourValue="modal[week?.state]?.in?.hour"
              :minuteValue="modal[week?.state]?.in.minute"
            />
            <InputTime
              label="Clock Out"
              :isOpen="modal.showTime === week?.time_state_out"
              @showTime="modal.showTime = week?.time_state_out"
              @selected-hour="modal[week?.state].out.hour = $event"
              @selected-minute="modal[week?.state].out.minute = $event"
              :hourValue="modal[week?.state]?.out.hour"
              :minuteValue="modal[week?.state]?.out.minute"
            />
            <Input
              label="Break Duration"
              class="flex-col w-28 mb-0"
              label_class="w-full"
              input_class="mt-2"
              @change="modal[week?.state].break = $event"
              :value="modal[week?.state]?.break"
            />
          </section>
        </section>
      </template>
    </section>
    <template #footer>
      <section class="flex w-[230px] justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>

        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="AddShiftSchedule"
          :disabled="loading.addShift || !data.shift_name"
          v-if="!modal.edit && shift_type === 'Schedule'"
        >
          Save Schedule
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="addNewShift"
          :disabled="loading.addShift || !data.shift_name"
          v-if="!modal.edit && shift_type === 'Regular'"
        >
          Save
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="EditNewShift"
          :disabled="loading.addShift || !data.shift_name"
          v-if="modal.edit && shift_type === 'Regular'"
        >
          Edit Regular
        </Button>
        <Button
          class="bg-green-500 w-[110px] py-2 ml-2 text-white rounded-md"
          @click="EditShiftSchedule"
          :disabled="loading.addShift || !data.shift_name"
          v-if="modal.edit && shift_type === 'Schedule'"
        >
          Edit Schedule
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Radio from "../../components/Radio.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import employee from "@/employee.json";
import InputTime from "@/components/InputTime.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import SwitchButton from "../../components/SwitchButton.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import {
  AddShiftAPI,
  GetShiftAPI,
  EditShiftAPI,
  ChangeStatusShiftAPI,
  DeleteShiftAPI,
} from "@/actions/shift";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";

export default {
  name: "SettingWorkShift",
  components: {
    LayoutAdmin,
    Button,
    SwitchButton,
    Modal,
    Input,
    InputTime,
    ChoiseCompany,
    Radio,
  },
  data() {
    return {
      employee: employee,
      modal: {
        showTime: "",
        edit: false,
        showModal: false,
        time_clockin: {
          hour: null,
          minute: "00",
        },
        time_clockout: {
          hour: null,
          minute: "00",
        },
      },
      showActions: null,
      weeks: [],
      shift_type: "Regular",
      optionsCompany: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getCompany: true,
        addShift: false,
      },
      shifts: [],
      data: {
        _id: "",
        shift_name: "",
        shift_clockin: "",
        shift_clockout: "",
        shift_late_tolarance: 0,
        shift_verylate_tolarance: 0,
        shift_status: "",
        shift_break_duration: "",
        status_workshift: false,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  created() {
    for (let i = 1; i <= 53; i++) {
      this.weeks.push({
        title: `Minggu ke-${i}`,
        state: `minggu_${i}`,
        time_state_in: `minggu_${i}_in`,
        time_state_out: `minggu_${i}_out`,
      });
    }
    for (let i = 1; i <= 53; i++) {
      this.modal = {
        ...this.modal,
        [`minggu_${i}`]: {
          in: {
            hour: "08",
            minute: "00",
          },
          out: {
            hour: "17",
            minute: "00",
          },
          break: "1",
          shift_late_tolarance: 0,
          shift_verylate_tolarance: 0,
        },
      };
    }
  },
  methods: {
    formatStringToDate(property, second_property) {
      if (!second_property) {
        const hour = this.modal[property].hour;
        const minute = this.modal[property].minute;
        const AM_PM = Number(hour) > 12 && Number(hour) < 23 ? "PM" : "AM";
        return !minute ? `${hour}:00 ${AM_PM}` : `${hour}:${minute} ${AM_PM}`;
      } else {
        const hour = this.modal[property][second_property].hour;
        const minute = this.modal[property][second_property].minute;
        const AM_PM = Number(hour) > 12 && Number(hour) < 23 ? "PM" : "AM";
        return !minute ? `${hour}:00 ${AM_PM}` : `${hour}:${minute} ${AM_PM}`;
      }
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
      for (let i = 1; i <= 53; i++) {
        this.modal = {
          ...this.modal,
          [`minggu_${i}`]: {
            in: {
              hour: null,
              minute: "00",
            },
            out: {
              hour: null,
              minute: "00",
            },
            break: "0",
          },
        };
      }
      this.modal.time_clockin.hour = "";
      this.modal.time_clockin.minute = "00";
      this.modal.time_clockout.hour = "";
      this.modal.time_clockout.minute = "00";
    },

    async updateStatus(value, shift) {
      shift.shift_status = value;
      const response = await ChangeStatusShiftAPI(shift?._id);
      this.showMessageStatus(response);

      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
    },
    async getAllCompany() {
      const response = await GetAllCompanyAPI();
      this.optionsCompany = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.getCompany = false;
    },
    showMessageStatus(response) {
      if (response.status === 200) {
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    async addNewShift() {
      this.loading.addShift = true;

      const shift_clockin = this.formatStringToDate("time_clockin");
      const shift_clockout = this.formatStringToDate("time_clockout");
      const payload = {
        shift_type: this.shift_type,
        ...this.data,
        shift_clockin,
        shift_clockout,
        shift_break_duration: Number(this.data.shift_break_duration),
      };
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await AddShiftAPI(queryAdminSuper, payload);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }

      if (response.status === 200) {
        this.modal.showModal = false;
        this.clearInputValue();
        this.getShift();
      }
      this.showMessageStatus(response);
      this.loading.addShift = false;
    },
    async EditNewShift() {
      this.loading.addShift = true;

      const shift_clockin = this.formatStringToDate("time_clockin");
      const shift_clockout = this.formatStringToDate("time_clockout");
      const payload = {
        shift_type: this.shift_type,

        ...this.data,
        shift_clockin,
        shift_clockout,
        shift_break_duration: Number(this.data.shift_break_duration),
      };
      const response = await EditShiftAPI(this.data._id, payload);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }

      if (response?.status === 200) {
        this.modal.showModal = false;
        this.modal.edit = false;
        this.clearInputValue();
        this.getShift();
      }
      this.showMessageStatus(response);
      this.loading.addShift = false;
    },
    async EditShiftSchedule() {
      this.loading.addShift = true;
      let schedule = {};

      for (let i = 1; i <= 53; i++) {
        schedule = {
          ...schedule,
          [`minggu_${i}`]: {
            shift_clockin: this.formatStringToDate(`minggu_${i}`, "in"),
            shift_clockout: this.formatStringToDate(`minggu_${i}`, "out"),
            shift_break_duration: +this.modal[`minggu_${i}`]?.break,
          },
        };
      }
      const payload = {
        shift_name: this.data.shift_name,
        ...schedule,
        shift_type: this.shift_type,
        shift_late_tolarance: +this.data.shift_late_tolarance,
        shift_verylate_tolarance: +this.data?.shift_verylate_tolarance,
      };
      const response = await EditShiftAPI(this.data._id, payload);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }

      if (response.status === 200) {
        this.modal.showModal = false;
        this.clearInputValue();
        this.getShift();
      }
      this.showMessageStatus(response);
      this.loading.addShift = false;
    },
    async AddShiftSchedule() {
      this.loading.addShift = true;
      let schedule = {};

      for (let i = 1; i <= 53; i++) {
        schedule = {
          ...schedule,
          [`minggu_${i}`]: {
            shift_clockin: this.formatStringToDate(`minggu_${i}`, "in"),
            shift_clockout: this.formatStringToDate(`minggu_${i}`, "out"),
            shift_break_duration: +this.modal[`minggu_${i}`]?.break,
          },
        };
      }
      const payload = {
        shift_name: this.data.shift_name,
        ...schedule,
        shift_type: this.shift_type,
      };
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await AddShiftAPI(queryAdminSuper, payload);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }

      if (response.status === 200) {
        this.modal.showModal = false;
        this.clearInputValue();
        this.getShift();
      }
      this.showMessageStatus(response);
      this.loading.addShift = false;
    },
    async deleteNewShift(id) {
      const response = await DeleteShiftAPI(id);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.getShift();
      }
      this.showMessageStatus(response);
    },
    getHourMinute(time) {
      if (time !== "-") {
        const timeArray = time.split(" ")[0].split(":");
        return [timeArray[0], timeArray[1]];
      }
      return ["", "00"];
    },
    assignDetailShift(shift) {
      this.modal.edit = true;
      this.modal.showModal = true;
      this.data._id = shift?._id;
      this.data.shift_name = shift?.shift_name;
      this.data.shift_late_tolarance = shift?.shift_late_tolarance || 0;
      this.data.shift_verylate_tolarance = shift?.shift_verylate_tolarance || 0;
      if (shift?.shift_type === "Regular") {
        this.shift_type = "Regular";
        this.data.shift_late_tolarance = shift?.shift_late_tolarance;
        this.data.shift_verylate_tolarance = shift?.shift_verylate_tolarance;
        this.data.shift_break_duration = shift?.shift_break_duration;
        this.modal.time_clockin.hour = this.getHourMinute(
          shift?.shift_clockin
        )[0];
        this.modal.time_clockin.minute = this.getHourMinute(
          shift?.shift_clockin
        )[1];
        this.modal.time_clockout.hour = this.getHourMinute(
          shift?.shift_clockout
        )[0];
        this.modal.time_clockout.minute = this.getHourMinute(
          shift?.shift_clockout
        )[1];
      } else if (shift?.shift_type === "Schedule") {
        this.shift_type = "Schedule";
        for (let i = 1; i <= 53; i++) {
          this.modal[`minggu_${i}`].in.hour = this.getHourMinute(
            shift?.schedule[`minggu_${i}`].shift_clockin
          )[0];
          this.modal[`minggu_${i}`].in.minute = this.getHourMinute(
            shift?.schedule[`minggu_${i}`].shift_clockin
          )[1];
          this.modal[`minggu_${i}`].out.hour = this.getHourMinute(
            shift?.schedule[`minggu_${i}`].shift_clockout
          )[0];
          this.modal[`minggu_${i}`].out.minute = this.getHourMinute(
            shift?.schedule[`minggu_${i}`].shift_clockout
          )[1];
          this.modal[`minggu_${i}`].break =
            shift?.schedule[`minggu_${i}`].shift_break_duration;
        }
      }
    },
    async getShift() {
      const queryAdminSuper = `?company_id=${this.dataCompany?._id}`;
      const response = await GetShiftAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.shifts = response?.data;
      }
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.getShift();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    this.getAllCompany();
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
</style>
