<template>
  <LayoutAdmin @click="activeDropdown = false">
    <section class="md:px-8 px-4 mt-6 w-full">
      <section class="flex justify-between items-center">
        <h1 class="md:text-2xl text-lg">Designation</h1>
        <Button
          class="bg-primary text-white px-6 py-2 text-sm rounded-md"
          @click="showModal = true"
          >Add Designation</Button
        >
      </section>
      <section class="flex mt-6 flex-wrap w-10/12"></section>
      <section class="">
        <section class="overflow-x-auto custom-scrollbar w-full">
          <table class="table-auto bg-white w-full mt-6 min-w-max">
            <thead class="border-b bg-white border-gray-200 text-gray-400">
              <tr>
                <th class="text-left text-sm p-3">Name</th>
                <th class="text-left text-sm p-3">Description</th>
                <th class="text-left text-sm p-3">No. Of Employees</th>
                <th class="text-left text-sm p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(designation, index) in designations" :key="index">
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">{{ designation.name }}</p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">
                    {{
                      designation.description ? designation.description : "-"
                    }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm text-gray-400">0</p>
                </td>
                <td class="p-3 relative">
                  <button class="mr-3">
                    <font-awesome-icon icon="fa-trash-alt" />
                  </button>
                  <button @click="handleDetailDesignation(designation.id)">
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
      title="Add Designation"
      class="md:w-9/12 w-full mx-auto h-max"
      :showModal="showModal"
      @close="showModal = false"
    >
      <section class="mb-10">
        <Input
          label="Name"
          label_class="w-full"
          input_class="w-full mt-2"
          class="flex-col"
          placeholder="Enter Name"
          :value="name"
          @input="name = $event"
        />
        <label> Description </label>
        <textarea
          class="border focus:outline-primary rounded w-full mt-2"
          rows="3"
          v-model="description"
        >
        </textarea>
      </section>
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

export default {
  name: "EmployeeIndex",
  components: {
    LayoutAdmin,
    Button,
    Modal,
    Input,
  },
  data() {
    return {
      showModal: false,
      modalEdit: false,
      name: "",
      id: "",
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
        many_employement: 0,
      };
      const checkDuplicate = this.designations.filter(
        (designation) => designation.name === this.name
      );
      if (!checkDuplicate.length > 0) {
        this.designations.push(data);
        this.showModal = false;
        localStorage.setItem("designation", JSON.stringify(this.designations));
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
    const designationStorage = localStorage.getItem("designation");
    if (designationStorage) {
      this.designations = JSON.parse(designationStorage);
    }
  },
};
</script>

<style scoped></style>
