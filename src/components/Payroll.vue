<template>
  <section class="px-4" @click="show_select = false">
    <section
      class="bg-gray-100 mt-2 rounded-md px-4 py-1 grid grid-cols-3 relative"
    >
      <button
        class="w-full h-full py-2 z-10 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '1')"
        :class="tab_active === '1' ? 'text-white' : ''"
        ref="first_tab"
      >
        Basic Salary
      </button>
      <button
        class="w-full z-10 h-full py-2 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '2')"
        :class="tab_active === '2' ? 'text-white' : ''"
      >
        Allowance
      </button>
      <button
        class="w-full z-10 h-full py-2 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '3')"
        :class="tab_active === '3' ? 'text-white' : ''"
      >
        Deducation
      </button>
      <span
        class="absolute top-1/2 -translate-y-1/2 duration-300 rounded-md w-36 bg-primary"
        ref="indicator"
        :style="`left:${indicator_position.left}px; height:${indicator_position.height}px; width:${indicator_position.width}px;`"
      />
    </section>

    <section class="mt-4" v-if="tab_active === '1'">
      <Select
        label="Periode Penggajian"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :options="['Bulan', '2 Minggu', 'Minggu']"
        :value="data?.emp_periode"
        @change="data.emp_periode = $event"
      />
      <Input
        type="number"
        label="Gaji pokok"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :value="data?.emp_salary"
        @input="data.emp_salary = $event"
        placeholder="Tidak ada perkiraan untuk Project Manager "
      />
      <section class="flex justify-between items-center">
        <p class="text-sm text-gray-400 md:w-1/5">Jumlah Hari kerja :</p>
        <div class="md:w-4/6 mb-2.5">
          <Input
            type="number"
            input_class="md:full mt-2"
            class="mb-1.5"
            :value="data?.emp_working_days"
            @input="data.emp_working_days = $event"
          />
          <p
            class="text-sm text-gray-400"
            v-if="data?.emp_working_days && data?.emp_salary"
          >
            Gaji per hari:
            {{ formatCurrency(data?.emp_salary / data?.emp_working_days) }}
          </p>
        </div>
      </section>
      <section class="flex justify-between items-center">
        <p class="text-sm text-gray-400 md:w-1/5">Jumlah Jam kerja :</p>
        <div class="md:w-4/6 mb-2.5">
          <Input
            type="number"
            input_class="md:full mt-2"
            class="mb-1.5"
            :value="data?.emp_working_hours"
            @input="data.emp_working_hours = $event"
          />
          <p
            class="text-sm text-gray-400"
            v-if="
              data?.emp_working_days &&
              data?.emp_salary &&
              data?.emp_working_hours
            "
          >
            Gaji per jam:
            {{
              formatCurrency(
                data?.emp_salary /
                  data?.emp_working_days /
                  data?.emp_working_hours
              )
            }}
          </p>
        </div>
      </section>
      <div class="flex justify-end w-full">
        <Button
          class="bg-primary text-white w-24 text-sm rounded py-2 mb-8"
          @click="handleAddSalary"
          :disabled="loading"
        >
          Save
        </Button>
      </div>
    </section>
    <section class="mt-4" v-if="tab_active === '2'">
      <Allowance />
    </section>
    <section class="mt-4" v-if="tab_active === '3'">
      <Deducation />
    </section>
  </section>
</template>

<script>
import Input from "./Input.vue";
import Select from "./Select/index.vue";
import Allowance from "./Allowance.vue";
import Deducation from "./Deducation.vue";
import { AddSalaryAPI, GetSalaryAPI } from "@/actions/salary";
import { useToast } from "vue-toastification";

export default {
  name: "PersonalDetail",
  components: { Input, Select, Deducation, Allowance },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
        width: 0,
      },
      data: {
        emp_salary: 0,
        emp_working_hours: 0,
        emp_working_days: 0,
        emp_periode: "",
      },
      loading: false,
      show_select: false,
      tab_active: "1",
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    formatCurrency(number) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
      return formatter.format(number);
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
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
    async handleAddSalary() {
      this.loading = true;
      const data = {
        emp_salary: this.data?.emp_salary,
        emp_working_days: this.data?.emp_working_days,
        emp_working_hours: this.data?.emp_working_hours,
        emp_periode: this.data?.emp_periode,
        emp_id: this.$route.params.id,
      };
      const response = await AddSalaryAPI(data);
      if (response?.status === 401) {
        return (window.location.href = "/login");
      }
      if (response?.status === 200) {
        this.handleGetSalary();
        this.showMessageStatus(response);
        this.clearInputValue();
      }
      this.loading = false;
    },
    async handleGetSalary() {
      const { id } = this.$route.params;
      const response = await GetSalaryAPI(id);
      if (response.status === 401) {
        return (window.location.href = "/login");
      }
      if (response.status === 200) {
        this.data = response?.data;
      }
    },
    handleChangeTab(event, tab) {
      const buttonHeight = event.target.offsetHeight;
      const buttonWidth = event.target.offsetWidth;
      const buttonPosition = event.target.offsetLeft;
      this.indicator_position.left = buttonPosition;
      this.indicator_position.width = buttonWidth;
      this.indicator_position.height = buttonHeight;
      this.tab_active = tab;
    },
  },
  mounted() {
    const buttonHeight = this.$refs.first_tab?.offsetHeight;
    const buttonPosition = this.$refs.first_tab?.offsetLeft;
    const buttonWidth = this.$refs.first_tab?.offsetWidth;
    this.indicator_position.left = buttonPosition;
    this.indicator_position.height = buttonHeight;
    this.indicator_position.width = buttonWidth;

    this.handleGetSalary();
  },
};
</script>

<style scoped></style>
