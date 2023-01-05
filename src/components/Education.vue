<template>
  <section class="px-4" @click="show_select = false">
    <section
      class="bg-gray-100 mt-2 rounded-md px-4 py-1 flex justify-center relative"
    >
      <button
        class="w-1/2 h-full py-2 z-10 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '1')"
        :class="tab_active === '1' ? 'text-white' : ''"
        ref="first_tab"
      >
        Pendidikan
      </button>
      <button
        class="w-1/2 z-10 h-full py-2 duration-300 text-sm"
        @click="(e) => handleChangeTab(e, '2')"
        :class="tab_active === '2' ? 'text-white' : ''"
      >
        Pengalaman
      </button>
      <span
        class="absolute top-1/2 -translate-y-1/2 duration-300 rounded-md w-1/2 bg-primary"
        :style="`left:${indicator_position.left}px; height:${indicator_position.height}px;`"
      />
    </section>

    <section class="mt-4" v-if="tab_active === '1'">
      <table class="table-auto bg-white w-full mt-6">
        <thead class="border-b bg-white border-gray-200 text-gray-400">
          <tr>
            <th class="text-left text-sm p-3">Gelar</th>
            <th class="text-left text-sm p-3">Nama Institusi</th>
            <th class="text-left text-sm p-3">Hasil</th>
            <th class="text-left text-sm p-3">Tahun</th>
            <th class="text-left text-sm p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(education, index) in educations" :key="index">
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">{{ education?.empedu_type }}</p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">
                {{ education?.empedu_institute }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">
                {{ education?.empedu_result }}
              </p>
            </td>
            <td class="p-3 text-sm">
              <p class="text-sm text-gray-400">{{ education?.empedu_year }}</p>
            </td>
            <td class="p-3 text-sm">
              <button
                class="mr-3"
                @click="handleDeleteEducation(education?._id)"
              >
                <font-awesome-icon icon="fa-trash-alt" class="text-red-500" />
              </button>
              <button @click="handleDetailEducation(education)">
                <font-awesome-icon
                  icon="fa-pen-to-square"
                  class="text-primary"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <section class="mt-8">
        <Input
          label="Gelar"
          input_class="md:w-4/6 mt-2"
          class="mb-2.5"
          @change="data.empedu_type = $event"
          :value="data.empedu_type"
        />
        <Input
          label="Nama Institusi"
          input_class="md:w-4/6 mt-2"
          class="mb-2.5"
          @change="data.empedu_institute = $event"
          :value="data.empedu_institute"
        />
        <Input
          type="number"
          label="Hasil"
          input_class="md:w-4/6 mt-2"
          class="mb-2.5"
          @change="data.empedu_result = $event"
          :value="data.empedu_result"
        />
        <Select
          label="Tahun"
          input_class="md:w-4/6 mt-2"
          class="mb-2.5"
          :options="['2022', '2021', '2020']"
          @change="data.empedu_year = $event"
          :value="data.empedu_year"
        />
        <div class="flex justify-end w-full my-4">
          <Button
            class="bg-primary text-white w-24 text-sm rounded py-2"
            @click="handleAddEducation"
            v-if="!edit"
          >
            Save
          </Button>
          <Button
            class="bg-primary text-white w-24 text-sm rounded py-2"
            @click="handleEditEducation"
            v-else
          >
            Edit
          </Button>
        </div>
      </section>
    </section>
    <section class="mt-4" v-if="tab_active === '2'">
      <Experience />
    </section>
  </section>
</template>

<script>
import Input from "./Input.vue";
import Select from "./Select";
import Button from "./Button.vue";
import Experience from "./Experience.vue";
import { useToast } from "vue-toastification";

import {
  AddEducationAPI,
  GetEducationAPI,
  EditEducationAPI,
  DeleteEducationAPI,
} from "@/actions/education";

export default {
  name: "EducationComponent",
  components: { Input, Select, Button, Experience },
  data() {
    return {
      indicator_position: {
        left: 0,
        height: 0,
      },
      show_select: false,
      tab_active: "1",
      educations: [],
      edit: false,
      data: {
        empedu_institute: "",
        empedu_result: null,
        empedu_type: "",
        empedu_year: "",
        empedu_id: null,
      },
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
        this.toast.success(response?.data?.message);
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
      }
    },
    clearInputValue() {
      for (const key in this.data) {
        this.data[key] = "";
      }
    },
    async handleAddEducation() {
      const data = {
        ...this.data,
        emp_result: Number(this.data.empedu_result),
        emp_id: this.$route.params.id,
      };
      const response = await AddEducationAPI(data);
      if (response.status === 401) {
        return (window.location.href = "/login");
      }
      if (response.status === 200) {
        this.handleGetEducation();
        this.showMessageStatus(response);
        this.clearInputValue();
      }
    },
    async handleGetEducation() {
      const { id } = this.$route.params;
      const response = await GetEducationAPI(id);
      if (response.status === 401) {
        return (window.location.href = "/login");
      }
      this.educations = response?.data;
    },
    handleDetailEducation(education) {
      this.edit = true;
      this.data.empedu_id = education?._id;
      this.data.empedu_institute = education?.empedu_institute;
      this.data.empedu_result = education?.empedu_result;
      this.data.empedu_type = education?.empedu_type;
      this.data.empedu_year = education?.empedu_year;
    },
    async handleEditEducation() {
      const id = this.data.empedu_id;
      const data = {
        ...this.data,
        emp_result: Number(this.data.empedu_result),
      };
      const response = await EditEducationAPI(id, data);
      if (response.status === 401) {
        return (window.location.href = "/");
      }
      if (response.status === 200) {
        this.handleGetEducation();
        this.clearInputValue();
        this.showMessageStatus(response);
        this.edit = false;
      }
    },
    async handleDeleteEducation(id) {
      const response = await DeleteEducationAPI(id);
      if (response.status === 401) {
        return (window.location.href = "/");
      }
      if (response.status === 200) {
        this.handleGetEducation();
        this.showMessageStatus(response);
      }
    },
  },
  mounted() {
    const buttonHeight = this.$refs.first_tab?.offsetHeight;
    const buttonPosition = this.$refs.first_tab?.offsetLeft;
    this.indicator_position.left = buttonPosition;
    this.indicator_position.height = buttonHeight;
    this.handleGetEducation();
  },
};
</script>

<style scoped></style>
