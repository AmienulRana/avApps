<template>
  <section class="px-4" @click="show_select = false">
    <section
      class="bg-gray-100 mt-2 rounded-md px-4 py-1 flex justify-center relative"
    >
      <button
        class="w-1/2 h-full py-2 z-10 duration-300 text-sm truncate"
        @click="(e) => handleChangeTab(e, 'data_diri')"
        :class="tab_active === 'data_diri' ? 'text-white' : ''"
        ref="first_tab"
      >
        Data Diri
      </button>
      <button
        class="w-1/2 z-10 h-full py-2 duration-300 text-sm truncate"
        @click="(e) => handleChangeTab(e, 'arsip')"
        :class="tab_active === 'arsip' ? 'text-white' : ''"
      >
        Arsip Digital
      </button>
      <span
        class="absolute top-1/2 -translate-y-1/2 duration-300 rounded-md w-1/2 bg-primary"
        :style="`left:${indicator_position.left}px; height:${indicator_position.height}px;`"
      />
    </section>
    <section class="mt-4" v-if="tab_active === 'data_diri'">
      <Input
        label="Nama Depan"
        input_class="md:md:w-4/6 w-full mt-1 w-full mt-1"
        class="mb-2.5"
        :value="data.first_name"
        @change="data.first_name = $event"
      />
      <Input
        label="Nama Belakang"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :value="data.last_name"
        @change="data.last_name = $event"
      />
      <Input
        label="Email"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :value="data.email"
        @change="data.email = $event"
      />
      <Input
        label="NIK Ktp"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :value="data.nik_ktp"
        @change="data.nik_ktp = $event"
      />
      <Input
        label="Phone number"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :value="data.phone_number"
        @change="data.phone_number = $event"
      />
      <div class="md:flex justify-between items-center mb-2.5">
        <label class="text-sm text-gray-400 md:w-1/5 w-full"
          >Jenis Kelamin</label
        >
        <div class="flex md:w-4/6 w-full mt-1">
          <Radio
            label="Laki-Laki"
            class="mr-5"
            value="Laki-Laki"
            @change="data.gender = 'Laki-Laki'"
            :modelValue="data.gender"
          />
          <Radio
            label="Perempuan"
            class="mr-5"
            value="Perempuan"
            @change="data.gender = 'Perempuan'"
          />
        </div>
      </div>
      <Select
        label="Marital Status"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :options="['Belum menikah', 'sudah menikah']"
      />
      <Input
        label="Tgl. Lahir"
        type="date"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
      />
      <SelectSearch
        :options="['O+', 'O-', 'A+', 'A-']"
        label="Golongan Darah"
        input_class="w-full md:w-4/6 mt-1"
        position="top"
        :isOpen="show_select === 'gol'"
        @handleShowSelect="show_select = 'gol'"
      />
      <div class="flex justify-end w-full my-4">
        <Button
          class="bg-primary text-white w-24 text-sm rounded py-2"
          @click="handleAddEmployement"
        >
          Save
        </Button>
      </div>
    </section>
    <section class="mt-4" v-if="tab_active === 'arsip'">
      <p class="text-gray-400 text-center">Data kosong</p>
    </section>
  </section>
</template>

<script>
import Input from "./Input.vue";
import Select from "./Select/index.vue";
import SelectSearch from "./Select/SelectSearch";
import Radio from "./Radio.vue";

export default {
  name: "PersonalDetail",
  components: { Input, Select, Radio, SelectSearch },
  props: { mode: String },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
      },
      data: {
        first_name: "",
        last_name: "",
        email: "",
        nik_ktp: "",
        phone_number: null,
        gender: "",
        marital_status: "",
        date_birthday: "",
        blood_type: "",
      },
      show_select: false,
      tab_active: "data_diri",
    };
  },
  methods: {
    handleChangeTab(event, tab) {
      const buttonHeight = event.target.offsetHeight;
      const buttonPosition = event.target.offsetLeft;
      this.indicator_position.left = buttonPosition;
      this.indicator_position.height = buttonHeight;
      this.tab_active = tab;
    },
  },
  mounted() {
    const buttonHeight = this.$refs.first_tab?.offsetHeight;
    const buttonPosition = this.$refs.first_tab?.offsetLeft;
    this.indicator_position.left = buttonPosition;
    this.indicator_position.height = buttonHeight;
  },
};
</script>

<style scoped></style>
