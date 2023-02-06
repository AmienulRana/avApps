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
                        @click="assignDetailShift(shift)"
                      >
                        Edit
                      </li>
                      <li
                        class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
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
      <section class="my-4 flex justify-between items-center">
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
      <section class="my-4 flex justify-between items-center">
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
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="addNewShift"
          :disabled="loading.addShift || !data.shift_name"
          v-if="!modal.edit"
        >
          Save
        </Button>
        <Button
          class="bg-green-500 w-24 py-2 text-white rounded-md"
          @click="EditNewShift"
          :disabled="loading.addShift || !data.shift_name"
          v-else
        >
          Save
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
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
          minute: null,
        },
        time_clockout: {
          hour: null,
          minute: null,
        },
      },
      showActions: null,
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
  methods: {
    formatStringToDate(property) {
      const hour = this.modal[property].hour;
      const minute = this.modal[property].minute;
      const AM_PM = Number(hour) > 12 && Number(hour) < 23 ? "PM" : "AM";
      return !minute ? `${hour}:00 ${AM_PM}` : `${hour}:${minute} ${AM_PM}`;
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
      this.modal.time_clockin.hour = "";
      this.modal.time_clockin.minute = "";
      this.modal.time_clockout.hour = "";
      this.modal.time_clockout.minute = "";
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
        this.modal.showModal = false;
        this.clearInputValue();
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
      console.log(shift);
      this.modal.edit = true;
      this.modal.showModal = true;
      this.data._id = shift?._id;
      this.data.shift_name = shift?.shift_name;
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
