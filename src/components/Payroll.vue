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
        :value="basic_salary.periode"
        @change="basic_salary.periode = $event"
      />
      <Input
        type="number"
        label="Gaji pokok"
        input_class="md:w-4/6 mt-2"
        class="mb-2.5"
        :value="basic_salary.salary"
        @input="basic_salary.salary = $event"
        placeholder="Tidak ada perkiraan untuk Project Manager "
      />
      <section class="flex justify-between items-center">
        <p class="text-sm text-gray-400 md:w-1/5">Jumlah Hari kerja :</p>
        <div class="md:w-4/6 mb-2.5">
          <Input
            type="number"
            input_class="md:full mt-2"
            class="mb-1.5"
            :value="basic_salary.working_days"
            @input="basic_salary.working_days = $event"
          />
          <p
            class="text-sm text-gray-400"
            v-if="basic_salary.working_days && basic_salary.salary"
          >
            Gaji per hari:
            {{
              formatCurrency(basic_salary.salary / basic_salary.working_days)
            }}
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
            :value="basic_salary.working_hours"
            @input="basic_salary.working_hours = $event"
          />
          <p
            class="text-sm text-gray-400"
            v-if="
              basic_salary.working_days &&
              basic_salary.salary &&
              basic_salary.working_hours
            "
          >
            Gaji per jam:
            {{
              formatCurrency(
                basic_salary.salary /
                  basic_salary.working_days /
                  basic_salary.working_hours
              )
            }}
          </p>
        </div>
      </section>
      <div class="flex justify-end w-full">
        <Button class="bg-primary text-white w-24 text-sm rounded py-2">
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
      basic_salary: {
        periode: "",
        salary: null,
        working_days: null,
        working_hours: null,
      },
      show_select: false,
      tab_active: "1",
    };
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
  },
};
</script>

<style scoped></style>
