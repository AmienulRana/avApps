<template>
  <div class="mb-2">
    <p class="text-end text-sm text-gray-400">Off day</p>
  </div>
  <KeepAlive>
    <div
      class="flex items-center mb-2.5"
      v-for="(day, i) in shift_day"
      :key="i"
    >
      <Select
        :label="i"
        input_class="md:w-4/6 mt-2 md:mt-0"
        class="w-full mr-6"
        :options="shift_data"
        :value="day.shift"
        :disabled="day.off_day"
        @change="day.shift = $event"
      />
      <SwitchButton
        @update:model="(value) => (day.off_day = value)"
        :value="day.off_day"
      />
    </div>
  </KeepAlive>
  <div class="flex justify-end w-full mb-4">
    <Button
      class="bg-primary text-white w-24 text-sm rounded py-2"
      @click="handleEditWorkShift"
    >
      Save
    </Button>
  </div>
</template>

<script>
import SwitchButton from "./SwitchButton.vue";
import Select from "./Select/index.vue";
import Button from "./Button.vue";
import { EditWorkShiftAPI } from "@/actions/employment";
import { useToast } from "vue-toastification";
export default {
  name: "EmploymentShift",
  components: { SwitchButton, Button, Select },
  props: { emp_attadance: Object },
  data() {
    return {
      shift_data: [
        "Shift 1 Stationery (08:00 am - 05:00pm)",
        "Shift 2 Stationery",
        "Shift 3 Stationery",
      ],
      shift_day: {
        senin: {
          shift: this.emp_attadance.senin.shift,
          off_day: this.emp_attadance.senin.off_day,
        },
        selasa: {
          shift: this.emp_attadance.selasa.shift,
          off_day: this.emp_attadance.selasa.off_day,
        },
        rabu: {
          shift: this.emp_attadance.rabu.shift,
          off_day: this.emp_attadance.rabu.off_day,
        },
        kamis: {
          shift: this.emp_attadance.kamis.shift,
          off_day: this.emp_attadance.kamis.off_day,
        },
        jumat: {
          shift: this.emp_attadance.jumat.shift,
          off_day: this.emp_attadance.jumat.off_day,
        },
        sabtu: {
          shift: this.emp_attadance.sabtu.shift,
          off_day: this.emp_attadance.sabtu.off_day,
        },
        minggu: {
          shift: this.emp_attadance.minggu.shift,
          off_day: this.emp_attadance.minggu.off_day,
        },
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  watch: {
    emp_attadance: {
      handle(newValue) {
        this.shift_day = newValue;
      },
      deep: true,
    },
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
    async handleEditWorkShift() {
      const { id } = this.$route.params;
      const response = await EditWorkShiftAPI(id, this.shift_day);
      if (response.status === 401) {
        return this.$router.push("/");
      }
      this.showMessageStatus(response);
    },
  },
};
</script>

<style scoped></style>
