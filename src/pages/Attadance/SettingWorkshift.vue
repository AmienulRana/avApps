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
        <TableSettingWorkshift />
      </section>
    </section>
  </LayoutAdmin>
  <Modal
    title="Add Workshift"
    :showModal="modal.showModal"
    @close="modal.showModal = false"
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
        />
        <InputTime
          label="Clock Out"
          :isOpen="modal.showTime === 'out'"
          @showTime="modal.showTime = 'out'"
          @selected-hour="modal.time_clockout.hour = $event"
          @selected-minute="modal.time_clockout.minute = $event"
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
import TableSettingWorkshift from "../../components/TableSettingWorkshift.vue";
import Modal from "../../components/Modal.vue";
import Input from "@/components/Input.vue";
import employee from "@/employee.json";
import InputTime from "@/components/InputTime.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import { AddShiftAPI, GetShiftAPI } from "@/actions/shift";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";

export default {
  name: "SettingWorkShift",
  components: {
    LayoutAdmin,
    Button,
    TableSettingWorkshift,
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
      optionsCompany: [],
      superAdmin: false,
      dataCompany: {},
      loading: {
        getCompany: true,
        addShift: false,
      },
      shifts: [],
      data: {
        shift_name: "",
        shift_clockin: "",
        shift_clockout: "",
        shift_late_tolarance: 0,
        shift_verylate_tolarance: 0,
        shift_status: "",
        shift_break_duration: "",
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
      const queryAdminSuper = `?company=${this.dataCompany?._id}`;
      const response = await AddShiftAPI(queryAdminSuper, payload);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }

      if (response.status === 200) {
        this.modal.showModal = false;
        this.clearInputValue();
      }
      this.showMessageStatus(response);
      this.loading.addShift = false;
    },
    async getShift() {
      const queryAdminSuper = `?company=${this.dataCompany?._id}`;
      const response = await GetShiftAPI(queryAdminSuper);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      console.log(response);
      if (response?.status === 200) {
        this.shifts = response?.data;
      }
    },
  },
  wacth: {
    dataCompany: {
      handler: function () {
        this.getShift();
      },
      deep: true,
    },
  },
  mounted() {
    const payload = decryptToken();
    this.superAdmin = payload?.role === "Super Admin";
    this.getAllCompany();
    this.getShift();
    // this.handleGetEmployement();
  },
};
</script>

<style scoped></style>
