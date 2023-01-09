<template>
  <section class="w-full custom-scrollbar overflow-x-auto">
    <table class="min-w-max bg-white w-full mt-6">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm p-3">Nama Perusahaan</th>
          <th class="text-left text-sm p-3">Posisi</th>
          <th class="text-left text-sm p-3">Masa Bekerja</th>
          <th class="text-left text-sm p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="experience in experiences" :key="experience?._id">
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              {{ experience?.empexp_company }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              {{ experience?.empexp_comp_position }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              {{ changeFormatMonth(experience?.empexp_startdate) }} ~ <br />
              {{ changeFormatMonth(experience?.empexp_endate) }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <button
              class="mr-3"
              @click="handleDeleteExperience(experience?._id)"
            >
              <font-awesome-icon icon="fa-trash-alt" class="text-red-500" />
            </button>
            <button @click="handleDetailExperience(experience)">
              <font-awesome-icon icon="fa-pen-to-square" class="text-primary" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="mt-8">
    <Input
      label="Nama Perusahaan"
      input_class="md:w-4/6 mt-2"
      class="mb-2.5"
      @change="data.empexp_company = $event"
      :value="data.empexp_company"
    />
    <Input
      label="Posisi"
      input_class="md:w-4/6 mt-2"
      class="mb-2.5"
      @change="data.empexp_comp_position = $event"
      :value="data.empexp_comp_position"
    />
    <Input
      type="date"
      label="Tanggal Mulai"
      input_class="md:w-4/6 mt-2"
      class="mb-2.5"
      @change="data.empexp_startdate = $event"
      :value="data.empexp_startdate"
    />
    <Input
      type="date"
      label="Tanggal Berakhir"
      input_class="md:w-4/6 mt-2"
      class="mb-2.5"
      @change="data.empexp_endate = $event"
      :value="data.empexp_endate"
    />
    <div class="flex justify-end w-full my-4">
      <Button
        class="bg-primary text-white w-24 text-sm rounded py-2"
        @click="handleAddExperience"
        v-if="!edit"
        :disabled="loading || !data.empexp_company"
      >
        Save
      </Button>
      <Button
        class="bg-primary text-white w-24 text-sm rounded py-2"
        @click="handleEditExperience"
        v-else
        :disabled="loading"
      >
        Edit
      </Button>
    </div>
  </section>
</template>

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";
import {
  AddExperienceAPI,
  GetExperienceAPI,
  EditExperienceAPI,
  DeleteExperienceAPI,
} from "@/actions/experience";
import { useToast } from "vue-toastification";

export default {
  name: "ExperienceComponent",
  components: { Input, Button },
  data() {
    return {
      experiences: [],
      loading: false,
      data: {
        empexp_company: "",
        empexp_comp_position: "",
        empexp_startdate: "",
        empexp_endate: "",
        emp_id: "",
      },
      edit: false,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    changeFormatMonth(dateString) {
      const date = new Date(dateString);

      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const monthName = months[date.getMonth()];

      const newDateString = `${monthName}-${date.getFullYear()}`;
      return newDateString;
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
    async handleAddExperience() {
      this.loading = true;
      const data = {
        ...this.data,
        empexp_company: this.data?.empexp_company,
        empexp_comp_position: this.data?.empexp_comp_position,
        empexp_startdate: this.data?.empexp_startdate,
        empexp_endate: this.data?.empexp_endate,
        emp_id: this.$route.params.id,
      };
      const response = await AddExperienceAPI(data);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.handleGetExperience();
        this.showMessageStatus(response);
        this.clearInputValue();
      }
      this.loading = false;
    },
    async handleGetExperience() {
      const { id } = this.$route.params;
      const response = await GetExperienceAPI(id);
      if (response.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      this.experiences = response?.data;
    },
    handleDetailExperience(experience) {
      this.edit = true;
      this.data.emp_id = experience?._id;
      this.data.empexp_comp_position = experience?.empexp_comp_position;
      this.data.empexp_company = experience?.empexp_company;
      this.data.empexp_endate = experience?.empexp_endate;
      this.data.empexp_startdate = experience?.empexp_startdate;
    },
    async handleEditExperience() {
      this.loading = true;
      const id = this.data.emp_id;
      const data = {
        ...this.data,
      };
      const response = await EditExperienceAPI(id, data);
      if (response.status === 401) {
        return (window.location.href = "/");
      }
      if (response.status === 200) {
        this.handleGetExperience();
        this.clearInputValue();
        this.showMessageStatus(response);
        this.edit = false;
      }
      this.loading = false;
    },
    async handleDeleteExperience(id) {
      const response = await DeleteExperienceAPI(id);
      if (response.status === 401) {
        return (window.location.href = "/");
      }
      if (response.status === 200) {
        this.handleGetExperience();
        this.showMessageStatus(response);
      }
    },
  },
  mounted() {
    this.handleGetExperience();
  },
};
</script>

<style scoped></style>
