<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center">
        <h1 class="md:text-2xl text-lg">Departement</h1>
        <Button
          class="bg-primary text-white px-6 py-2 text-sm rounded-md"
          @click="modal.showModal = true"
          >Add Departement</Button
        >
      </section>
      <section class="flex mt-6 flex-wrap w-10/12"></section>
      <section class="">
        <section class="overflow-x-auto custom-scrollbar w-full">
          <table class="table-auto bg-white w-full mt-6 min-w-max">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm p-3">Name</th>
                <th class="text-left text-sm p-3">Manager</th>
                <th class="text-left text-sm p-3">Description</th>
                <th class="text-left text-sm p-3">Status</th>
                <th class="text-left text-sm p-3">Parent Departement</th>
                <th class="text-left text-sm p-3">Location</th>
                <th class="text-left text-sm p-3">Created</th>
                <th class="text-left text-sm p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(departement, index) in departement" :key="index">
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">{{ departement?.name }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ departement?.manager }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{
                      departement?.description ? departement?.description : "-"
                    }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">{{ departement?.status }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ departement?.parent_departement }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  {{ departement?.location ? departement?.location : "-" }}
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{ departement?.created }}
                  </p>
                </td>
                <td class="p-3 relative">
                  <button class="mr-3">
                    <font-awesome-icon icon="fa-trash-alt" />
                  </button>
                  <button @click="handleDetailDesignation(departement.id)">
                    <font-awesome-icon icon="fa-pen-to-square" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </section>
    <Modal
      title="Add Departement"
      class="md:w-9/12 w-full mx-auto"
      :showModal="modal.showModal"
      @close="modal.showModal = false"
    >
      <Input
        label="Name"
        label_class="w-full"
        input_class="w-full mt-2"
        class="flex-col"
        placeholder="Name"
        :value="name"
        @change="name = $event"
      />
      <SelectSearch
        label="Manager"
        placeholder="Choose a manager"
        :options="getAllEmployee"
        :isOpen="modal.showSelect === 'choose_manager'"
        @handleShowSelect="
          modal.showSelect === 'choose_manager'
            ? (modal.showSelect = null)
            : (modal.showSelect = 'choose_manager')
        "
        class="flex-col"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        :selectedOption="manager"
        @selected="manager = $event"
      />
      <Select
        class="flex-col mt-4"
        input_class="w-full mt-2"
        label_class="w-full"
        label="Parent Departement"
        :options="onlyDepartementName"
        :value="parent_departement"
        @change="parent_departement = $event"
      />
      <Input
        label="Location"
        label_class="w-full"
        input_class="w-full mt-2"
        class="flex-col mt-4"
        placeholder="Enter Location"
        :value="location"
        @change="location = $event"
      />
      <SelectSearch
        label="Work Shift"
        placeholder="Choose a Work shift"
        :options="[
          'Regular work shift',
          'demo working shift regular',
          'demo working shift scheduled',
        ]"
        :isOpen="modal.showSelect === 'work_shift'"
        @handleShowSelect="
          modal.showSelect === 'work_shift'
            ? (modal.showSelect = null)
            : (modal.showSelect = 'work_shift')
        "
        class="flex-col"
        input_class="w-full mt-2"
        label_class="w-full text-black"
        :selectedOption="work_shift"
        @selected="work_shift = $event"
      />
      <label class="text-sm"> Description </label>
      <textarea
        class="border focus:outline-primary rounded w-full mt-2"
        rows="3"
        v-model="description"
      >
      </textarea>
      <template #footer>
        <section class="flex justify-end">
          <Button
            @click="showModal = false"
            class="bg-gray-400 w-24 mr-3 px-2 py-2 text-white rounded-md"
          >
            Cancel
          </Button>
          <Button
            class="bg-primary w-24 px-2 py-2 text-white rounded-md"
            @click="handleAddDesignation"
            :class="!name && 'opacity-70'"
            :disabled="!name"
            v-if="!modalEdit"
          >
            Save
          </Button>
          <Button
            v-else
            class="bg-primary w-24 px-2 py-2 text-white rounded-md"
            @click="handleEditDesignation"
            :class="!name && 'opacity-70'"
            :disabled="!name"
          >
            Edit
          </Button>
        </section>
      </template>
    </Modal>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Button from "../../components/Button.vue";
import Modal from "../../components/Modal.vue";
import Input from "../../components/Input.vue";
import SelectSearch from "../../components/Select/SelectSearch.vue";
import Select from "../../components/Select/index.vue";
import employee from "@/employee.json";

export default {
  name: "DepartementPage",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Input,
    SelectSearch,
    Select,
  },
  data() {
    return {
      modal: {
        showModal: true,
        showSelect: null,
      },
      manager: "",
      modalEdit: false,
      name: "",
      id: "",
      work_shift: "",
      parent_departement: "",
      employee: employee,
      description: "",
      designations: [],
    };
  },
  methods: {
    handleAddDesignation() {
      const data = {
        id: this.designations.length + 1,
        name: this.name,
        description: this.description,
        parent_departement: this.parent_departement,
        work_shift: this.work_shift,
        manager: this.manager,
        status: "Active",
      };
      const checkDuplicate = this.designations.filter(
        (designation) => designation.name === this.name
      );
      if (!checkDuplicate.length > 0) {
        this.designations.push(data);
        this.showModal = false;
        localStorage.setItem("designations", JSON.stringify(this.designations));
      } else {
        alert(`${this.name} Sudah ditambahkan`);
      }
    },
    handleDetailDesignation(id) {
      this.showModal = true;
      this.id = id;
      this.modalEdit = true;
      const findDesignation = this.designations.filter(
        (des) => des.id === id
      )[0];
      this.name = findDesignation.name;
      this.description = findDesignation.description;
    },
    handleEditDesignation() {},
    handleDeleteDesignation() {},
  },
  mounted() {
    const designationsStorage = localStorage.getItem("designations");
    if (designationsStorage) {
      this.designations = JSON.parse(designationsStorage);
    }
  },
  computed: {
    getAllEmployee() {
      return this.employee.map((employe) => employe.name);
    },
    // onlyDepartementName() {
    //   //   return this.departements.map((dep) => dep?.name);
    // },
  },
};
</script>

<style scoped></style>
