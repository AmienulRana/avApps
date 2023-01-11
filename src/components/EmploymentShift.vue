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
        property="shift_desc"
        :options="shift_data"
        :value="day.shift_desc"
        :disabled="day.off_day"
        @change="day.shift_desc = $event"
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
import { EditWorkShiftAPI, GetShiftEmpAPI } from "@/actions/employment";
import { useToast } from "vue-toastification";
export default {
  name: "EmploymentShift",
  components: { SwitchButton, Button, Select },
  props: { emp_attadance: Object },
  data() {
    return {
      shift_data: [],
      shift_day: {
        senin: {
          shift_desc: this.emp_attadance.senin?.shift?.shift_desc,
          shift: this.emp_attadance.senin?.shift?._id,
          off_day: this.emp_attadance.senin.off_day,
        },
        selasa: {
          shift_desc: this.emp_attadance.selasa?.shift?.shift_desc,
          shift: this.emp_attadance.selasa?.shift?._id,
          off_day: this.emp_attadance.selasa.off_day,
        },
        rabu: {
          shift_desc: this.emp_attadance.rabu?.shift?.shift_desc,
          shift: this.emp_attadance.rabu?.shift?._id,
          off_day: this.emp_attadance.rabu.off_day,
        },
        kamis: {
          shift_desc: this.emp_attadance.kamis?.shift?.shift_desc,
          shift: this.emp_attadance.kamis?.shift?._id,
          off_day: this.emp_attadance.kamis.off_day,
        },
        jumat: {
          shift_desc: this.emp_attadance.jumat?.shift?.shift_desc,
          shift: this.emp_attadance.jumat?.shift?._id,
          off_day: this.emp_attadance.jumat.off_day,
        },
        sabtu: {
          shift_desc: this.emp_attadance.sabtu?.shift?.shift_desc,
          shift: this.emp_attadance.sabtu?.shift?._id,
          off_day: this.emp_attadance.sabtu.off_day,
        },
        minggu: {
          shift_desc: this.emp_attadance.minggu?.shift?.shift_desc,
          shift: this.emp_attadance.minggu?.shift?._id,
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
      handle: function (newValue) {
        console.log(newValue);
        // this.shift_day.seni = newValue;
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
    async getShift() {
      const { id } = this.$route.params;
      const response = await GetShiftEmpAPI(id);
      if (response?.status === 200) {
        this.shift_data = response.data;
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
  mounted() {
    this.getShift();
    console.log(this.emp_attadance);
  },
};
</script>

<style scoped></style>
