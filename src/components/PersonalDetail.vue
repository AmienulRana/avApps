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
        :value="data.emp_firstname"
        @change="data.emp_firstname = $event"
      />
      <Input
        label="Nama Belakang"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :value="data.emp_lastname"
        @change="data.emp_lastname = $event"
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
        :value="data.emp_nikktp"
        @change="data.emp_nikktp = $event"
      />
      <Input
        label="Phone number"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :value="data.emp_phone"
        @change="data.emp_phone = $event"
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
            :checked="data.emp_gender === 'Laki-Laki'"
            @change="data.emp_gender = 'Laki-Laki'"
          />
          <Radio
            label="Perempuan"
            class="mr-5"
            value="Perempuan"
            :checked="data.emp_gender === 'Perempuan'"
            @change="data.emp_gender = 'Perempuan'"
          />
        </div>
      </div>
      <Select
        label="Marital Status"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :value="data.emp_marital_status"
        :options="['Belum menikah', 'sudah menikah']"
        @change="data.emp_marital_status = $event"
      />
      <Input
        label="Tgl. Lahir"
        type="date"
        input_class="md:w-4/6 w-full mt-1"
        class="mb-2.5"
        :value="data?.emp_birthday"
        @change="data.emp_birthday = $event"
      />
      <SelectSearch
        :options="['O', 'O+', 'O-', 'A+', 'A-', 'A', 'AB', 'B']"
        label="Golongan Darah"
        input_class="w-full md:w-4/6 mt-1"
        position="top"
        :selectedOption="data?.emp_blood"
        :isOpen="show_select === 'gol'"
        @handleShowSelect="show_select = 'gol'"
        @selected="data.emp_blood = $event"
      />
      <div class="flex justify-end w-full my-4">
        <Button
          class="bg-primary text-white w-24 text-sm rounded py-2"
          @click="handleEditEmployement"
          :disabled="loading"
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
import Button from "./Button.vue";
import Select from "./Select/index.vue";
import SelectSearch from "./Select/SelectSearch";
import Radio from "./Radio.vue";
import { EditPersonalEmployementAPI } from "@/actions/employment";
import { useToast } from "vue-toastification";

export default {
  name: "PersonalDetail",
  components: { Input, Select, Radio, SelectSearch, Button },
  props: {
    mode: String,
    personalDetail: Object,
    handleDetailEmployment: Function,
  },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
      },
      loading: false,
      data: {
        emp_firstname: this.personalDetail.emp_firstname,
        emp_lastname: this.personalDetail.emp_lastname,
        email: this.personalDetail.email,
        emp_nikktp: this.personalDetail.emp_nikktp,
        emp_phone: this.personalDetail.emp_phone,
        emp_gender: this.personalDetail.emp_gender,
        emp_marital_status: this.personalDetail.emp_marital_status,
        emp_birthday: this.personalDetail.emp_birthday,
        emp_blood: this.personalDetail.emp_blood,
      },
      show_select: false,
      tab_active: "data_diri",
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    handleChangeTab(event, tab) {
      const buttonHeight = event.target.offsetHeight;
      const buttonPosition = event.target.offsetLeft;
      this.indicator_position.left = buttonPosition;
      this.indicator_position.height = buttonHeight;
      this.tab_active = tab;
    },
    showMessageStatus(response) {
      if (response.status === 200) {
        this.handleDetailEmployment();
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    async handleEditEmployement() {
      this.loading = true;
      const { id } = this.$route.params;
      const response = await EditPersonalEmployementAPI(id, this.data);
      console.log(response);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.showMessageStatus(response);
      this.loading = false;
    },
  },
  watch: {
    personalDetail: {
      handler(newData) {
        this.data = newData;
      },
      deep: true,
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
