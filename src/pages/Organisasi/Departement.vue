<template>
  <LayoutAdmin @click="optionsDepartement = null">
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
                <th class="text-left text-sm p-3">Company</th>
                <th class="text-left text-sm p-3">Location</th>
                <th class="text-left text-sm p-3">Created</th>
                <th class="text-left text-sm p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(departement, index) in departements" :key="index">
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
                  <p
                    class="text-sm text-white rounded-full min-w-max px-6 py-1"
                    :class="
                      departement?.status === 'Active'
                        ? 'bg-primary'
                        : 'bg-red-500'
                    "
                  >
                    {{ departement?.status }}
                  </p>
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
                <td class="p-3 text-right relative">
                  <Button
                    class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
                    @click.stop="optionsDepartement = index"
                  >
                    <font-awesome-icon icon="fa-ellipsis" />
                  </Button>
                  <div
                    class="text-left absolute -top-full right-16 rounded-md bg-white shadow-md md:w-max md:h-max"
                    v-if="optionsDepartement === index"
                  >
                    <ul>
                      <li
                        class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400"
                      >
                        Edit
                      </li>
                      <li
                        class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400"
                      >
                        De-activate
                      </li>
                      <li
                        class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400"
                      >
                        Move Employee
                      </li>
                    </ul>
                  </div>
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
        showModal: false,
        showSelect: null,
      },
      manager: "",
      modalEdit: false,
      optionsDepartement: null,
      name: "",
      id: "",
      work_shift: "",
      location: "",
      parent_departement: "",
      employee: employee,
      description: "",
      departements: [],
    };
  },
  methods: {
    dateNow() {
      const date = new Date();
      const month = date.getMonth() + 1; // bulan dimulai dari 0, sehingga perlu ditambah 1
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${month}-${day}-${year}`;
      return formattedDate;
    },
    handleAddDesignation() {
      const data = {
        id: this.departements.length + 1,
        name: this.name,
        description: this.description,
        parent_departement: this.parent_departement,
        work_shift: this.work_shift,
        manager: this.manager,
        location: this.location,
        status: "Active",
        created: this.dateNow(),
      };
      const checkDuplicate = this.departements.filter(
        (designation) => designation.name === this.name
      );
      if (!checkDuplicate.length > 0) {
        this.departements.push(data);
        this.modal.showModal = false;
        localStorage.setItem("departements", JSON.stringify(this.departements));
      } else {
        alert(`${this.name} Sudah ditambahkan`);
      }
    },
    handleDetailDesignation(id) {
      this.showModal = true;
      this.id = id;
      this.modalEdit = true;
      const findDesignation = this.departements.filter(
        (des) => des.id === id
      )[0];
      this.name = findDesignation.name;
      this.description = findDesignation.description;
    },
    handleEditDesignation() {},
    handleDeleteDesignation() {},
  },
  mounted() {
    const departementsStorage = localStorage.getItem("departements");
    if (departementsStorage) {
      this.departements = JSON.parse(departementsStorage);
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
