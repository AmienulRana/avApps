<template>
  <LayoutAdmin @click="viewActions = 0">
    <section class="px-8 mt-6 w-full" @click="activeDropdown = ''">
      <section>
        <h1 class="text-2xl">Daftar Nominatif Penerima Gaji</h1>
        <p class="mt-2">
          Periode : <span class="underline text-primary">Desember 2022</span>
        </p>
      </section>
      <section class="flex mt-6 flex-wrap w-10/12 items-center">
        <Dropdown
          ref="dropdown"
          title="Departement"
          :showDropdown="activeDropdown === 'departement'"
          @update:activeDropdown="changeDropdownActive('departement')"
        />
        <Dropdown
          ref="dropdown"
          title="Status"
          :showDropdown="activeDropdown === 'status'"
          @update:activeDropdown="(e) => changeDropdownActive('status')"
        />
        <Dropdown
          ref="dropdown"
          title="Employee"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="changeDropdownActive('employee')"
        />
      </section>
      <section class="bg-white flex justify-end p-8 mt-6">
        <ul class="text-xs flex">
          <li class="mx-3">This month</li>
          <li class="mx-3">Last month</li>
          <li class="mx-3">This year</li>
          <li class="mx-3">Last year</li>
          <li class="mx-3">Total</li>
        </ul>
      </section>
      <section class="w-full custom-scrollbar overflow-x">
        <table class="table-auto bg-white w-full min-w-max">
          <thead class="border-b bg-white border-gray-200 text-gray-400">
            <tr>
              <th class="text-left text-sm p-3">Profile</th>
              <th class="text-left text-sm p-3">Payrun</th>
              <th class="text-left text-sm p-3">Payrun Period</th>
              <th class="text-left text-sm p-3">Salary</th>
              <th class="text-left text-sm p-3">Net Salary</th>
              <th class="text-left text-sm p-3">Status</th>
              <th class="text-left text-sm p-3">Details</th>
              <th class="text-left text-sm p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="flex items-center p-3 text-sm">
                <div
                  class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
                >
                  <h2 class="text-md text-white">AR</h2>
                </div>
                <div class="ml-3.5">
                  <h1 class="text-md text-blue-400 mb-0">Nama Karyawan</h1>
                  <p class="text-sm text-gray-400">Jabatan</p>
                </div>
              </td>
              <td class="p-3 text-sm">
                <p class="text-base">November 2022</p>
                <p class="text-sm text-gray-400">26 November - 25 Desember</p>
              </td>
              <td class="p-3 text-sm">
                <p class="text-sm">Monthly</p>
              </td>
              <td class="p-3 text-sm">
                <p class="text-sm">Rp2.500.000</p>
              </td>
              <td class="p-3 text-sm">
                <p class="text-sm">Rp2.900.000</p>
              </td>
              <td class="p-3 text-sm">
                <p :class="dynamicStatusClass">{{ status }}</p>
              </td>
              <td class="p-3 text-sm">
                <p class="text-sm underline">View</p>
              </td>
              <td class="p-3 text-right relative z-10">
                <Button
                  class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
                  @click.stop="viewActions = 1"
                >
                  <font-awesome-icon icon="fa-ellipsis" />
                </Button>
                <div
                  class="text-left absolute -top-full right-16 rounded-md bg-white shadow-md md:w-max md:h-max z-10"
                  v-if="viewActions === 1"
                >
                  <ul>
                    <li
                      class="px-4 py-2 cursor-pointer hover:text-blue-400"
                      @click="status = 'Calculate'"
                    >
                      Calculate/Recalculate
                    </li>
                    <li
                      class="px-4 py-2 cursor-pointer hover:text-blue-400"
                      @click="status = 'Approve Finance'"
                    >
                      Approve Finance
                    </li>
                    <li
                      class="px-4 py-2 cursor-pointer hover:text-blue-400"
                      @click="status = 'Pending'"
                    >
                      Pending
                    </li>
                    <li
                      class="px-4 py-2 cursor-pointer hover:text-blue-400"
                      @click="status = 'Cancel Payrun'"
                    >
                      Cancel Payrun
                    </li>
                    <li
                      class="px-4 py-2 cursor-pointer hover:text-blue-400"
                      @click="showModal = true"
                    >
                      Edit
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
    <Modal
      title="Edit Payslip"
      :showModal="showModal"
      @close="showModal = $event"
    >
      <section class="">
        <h1 class="text-xl text-center">AvHris</h1>
        <section class="flex justify-between my-10">
          <div class="flex">
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">AR</h2>
            </div>
            <div class="ml-3.5">
              <h1 class="text-base text-blue-400 mb-0">Nama Karyawan</h1>
              <p class="text-sm text-gray-400">amienulrana@gmail.com</p>
            </div>
          </div>
          <div>
            <p class="text-sm">
              Payslip For : <span class="text-blue-500">1 - 30 Nov 2022</span>
            </p>
            <p class="text-sm">Created at : 22 Dec, 2022</p>
          </div>
          <div>
            <p class="text-sm">Designation : Software Enginner</p>
            <p class="text-sm">Departement : Accounts</p>
          </div>
        </section>
        <section>
          <p class="flex justify-between border-b pb-2 text-sm">
            Basic Sallary <span>$40.000</span>
          </p>
          <p class="flex justify-between border-b pb-2 mt-6 text-sm">
            Benificiary <span></span>
          </p>
          <div class="flex mt-6 items-center">
            <p class="w-1/3 text-sm">Allowance</p>
            <section class="w-1/2">
              <div class="bg-gray-100 px-5 py-2 rounded-md flex items-center">
                <p
                  class="text-gray-400 ml-2 bg-white text-sm w-24 px-4 py-1 flex justify-between items-center rounded-full"
                >
                  Bonus
                  <font-awesome-icon icon="fa-xmark" />
                </p>
                <Dropdown
                  @update:activeDropdown="(e) => changeDropdownActive('bonus')"
                  title="Add"
                  backgroundTitle="bg-transparent"
                  :showDropdown="activeDropdown === 'bonus'"
                />
              </div>
              <div class="flex justify-between mt-4 items-center">
                <p class="text-sm">Bonus</p>
                <input type="number" class="w-32 border h-10 px-4" />
                <div class="flex items-center">
                  <input type="checkbox" class="mr-3" />
                  <label class="text-sm">In Percent (%) </label>
                </div>
                <font-awesome-icon icon="fa-trash-alt" class="text-red-600" />
              </div>
            </section>
          </div>
          <div class="flex my-6 items-center">
            <p class="w-1/3 text-sm">Deduction</p>
            <section class="w-1/2">
              <div class="bg-gray-100 px-5 py-2 rounded-md flex items-center">
                <p
                  class="text-gray-400 ml-2 bg-white text-sm w-24 px-4 py-1 flex justify-between items-center rounded-full"
                >
                  Bonus
                  <font-awesome-icon icon="fa-xmark" />
                </p>
                <Dropdown
                  @update:activeDropdown="(e) => changeDropdownActive('tax')"
                  title="Add"
                  backgroundTitle="bg-transparent"
                  :showDropdown="activeDropdown === 'tax'"
                />
              </div>
              <div class="flex justify-between mt-4 items-center">
                <p class="text-sm">Bonus</p>
                <input type="number" class="w-32 border h-10 px-4" />
                <div class="flex items-center">
                  <input type="checkbox" class="mr-3" />
                  <label class="text-sm">In Percent (%) </label>
                </div>
                <font-awesome-icon icon="fa-trash-alt" class="text-red-600" />
              </div>
            </section>
          </div>
          <p class="flex justify-between border-b pb-2 text-sm">
            Total Allowance <span>$1.000</span>
          </p>
          <p class="flex justify-between border-b pb-2 my-2 text-sm">
            Total Deducation <span>$200</span>
          </p>
          <p class="flex justify-between border-b pb-2 my-2">
            Benificiary Total <span>$800</span>
          </p>
          <p class="flex justify-between border-b pb-2 my-2">
            Net payable salary<span>$10.800</span>
          </p>
        </section>
      </section>
      <template v-slot:footer>
        <section class="flex w-52 justify-between">
          <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
            Cancel
          </Button>
          <Button class="bg-blue-500 w-24 py-2 text-white rounded-md">
            Save
          </Button>
        </section>
      </template>
    </Modal>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import Dropdown from "../../components/Dropdown.vue";
import Button from "../../components/Button.vue";
import Modal from "../../components/Modal.vue";

export default {
  name: "PayrollNominatif",
  data() {
    return {
      viewActions: 0,
      status: "",
      activeDropdown: "",
      showModal: false,
    };
  },
  components: {
    LayoutAdmin,
    Dropdown,
    Modal,
    Button,
  },
  methods: {
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
  },
  computed: {
    dynamicStatusClass() {
      let backgroundStatus =
        "flex py-1 text-white w-24 px-2 items-center justify-center rounded-full min-w-max ";
      switch (this.status) {
        case "Pending":
          backgroundStatus += " bg-gray-600";
          break;
        case "Approve Finance":
          backgroundStatus += " bg-green-400";
          break;
        case "Calculate":
          backgroundStatus += " bg-zinc-300";
          break;
        case "Cancel Payrun":
          backgroundStatus += " bg-red-500";
          break;
        default:
          break;
      }
      return backgroundStatus;
    },
  },
};
</script>

<style scoped>
.overflow-x {
  overflow-x: scroll;
}
table thead th,
table tbody tr td {
  padding: 1rem 2rem;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 3px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #c6c8cc;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1;
}
</style>
