<template>
  <section
    class="w-full overflow-x-auto custom-scrollbar h-96 bg-white"
    @click="
      showActions = null;
      showReasonNote = null;
    "
  >
    <table class="bg-white min-w-max mt-6 w-full pb-4">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm">Profile</th>
          <th class="text-left text-sm">Date & time</th>
          <th class="text-left text-sm">Overtime duration</th>
          <th class="text-left text-sm">Reason</th>
          <th class="text-left text-sm">Approved 1</th>
          <th class="text-left text-sm">Approved 2</th>
          <th class="text-left text-sm">HR Approved</th>
          <th class="text-left text-sm">Activity</th>
          <th class="text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b h-max">
          <td class="flex items-center p-3 text-sm">
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">IA</h2>
            </div>
            <div class="ml-5">
              <h1 class="text-blue-400 text-base">Ivan Arafat</h1>
              <p class="text-sm mb-1 text-gray-400">Admin & Hrm</p>
              <p class="text-xs mb-1 text-gray-400">Armada Vision</p>
            </div>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">
              <span class="text-gray-400">From :</span> 01:05 PM
            </p>
            <p class="text-sm">
              <span class="text-gray-400">To :</span> 02:05 PM
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">2 Days</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">Tambah Fitur baru</p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 items-center justify-center rounded-full bg-green-500"
            >
              Approved
            </p>
            <p class="text-sm mt-2 text-gray-400">
              Joko Legowo <br />
              10:00 AM, 24 Dec 2022
            </p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white min-w-max px-2 items-center justify-center rounded-full bg-gray-200"
            >
              Not Approved
            </p>
            <p class="text-sm mt-2 text-gray-400">
              Legowo Joko <br />
              9:42 AM, 23 Dec 2022
            </p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 items-center justify-center rounded-full bg-red-500"
            >
              Rejected
            </p>
            <p class="text-sm mt-2 text-gray-400">
              Leo Joko <br />
              8:21 AM, 23 Dec 2022
            </p>
          </td>
          <td class="p-3 text-sm flex">
            <button class="text-xl ml-3" @click="showModal = true">
              <img src="../assets/icons/log.svg" />
            </button>
          </td>
          <td class="p-3 text-right relative">
            <Button
              class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
              @click.stop="showActions = 0"
            >
              <font-awesome-icon icon="fa-ellipsis" />
            </Button>
            <div
              class="text-left absolute top-0 right-20 rounded-md bg-white shadow-md md:w-max md:h-max"
              v-if="showActions === 0"
            >
              <ul>
                <li
                  class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                >
                  Calculate/Recalculate
                </li>
                <li
                  class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                >
                  Approved 1
                </li>
                <li
                  class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                >
                  Approved 2
                </li>
                <li
                  class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
                >
                  HR Aproved
                </li>
                <li
                  class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-sm"
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
  <Modal title="Response Log" :showModal="showModal" @close="showModal = false">
    <section class="flex w-full justify-center approved">
      <div
        class="bg-icon flex w-10 h-10 p-2 rounded-full bg-gray-100 justify-center items-center"
      >
        <font-awesome-icon icon="fa-check" class="text-xl text-gray-400" />
      </div>
      <section class="relative px-10 border-l-2 h-52 ml-10">
        <div
          class="indicator p-2 w-3 h-3 rounded-full bg-gray-100 absolute top-0 -left-2"
        ></div>
        <div class="bg-gray-100 px-4 py-2 rounded w-52 text-gray-400">
          <p class="text-sm flex items-center">Approve HR</p>
          <p class="text-sm mt-1">01 Dec, 22</p>
        </div>
      </section>
    </section>
    <section class="flex w-full justify-center not-approved">
      <div
        class="flex bg-icon w-10 h-10 p-2 rounded-full bg-gray-100 justify-center items-center"
      >
        <font-awesome-icon icon="fa-xmark" class="text-xl text-gray-400" />
      </div>
      <section class="relative px-10 border-l-2 h-52 ml-10">
        <div
          class="indicator p-2 w-3 h-3 rounded-full bg-gray-100 absolute top-0 -left-2"
        ></div>
        <div class="bg-gray-100 px-4 py-2 rounded w-52 text-gray-400">
          <p class="text-sm flex items-center">Approve Atasan 1</p>
          <p class="text-sm mt-1">01 Dec, 22</p>
        </div>
      </section>
    </section>
    <section class="flex w-full justify-center approved">
      <div
        class="flex bg-icon w-10 h-10 p-2 rounded-full bg-gray-100 justify-center items-center"
      >
        <font-awesome-icon icon="fa-check" class="text-xl text-gray-400" />
      </div>
      <section class="relative px-10 border-l-2 h-52 ml-10">
        <div
          class="indicator p-2 w-3 h-3 rounded-full bg-gray-100 absolute top-0 -left-2"
        ></div>
        <div class="bg-gray-100 px-4 py-2 rounded w-52 text-gray-400">
          <p class="text-sm flex items-center">Approve Atasan 2</p>
          <p class="text-sm mt-1">01 Dec, 22</p>
        </div>
      </section>
    </section>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
export default {
  name: "TableAttadance",
  components: { Modal },
  data() {
    return {
      showActions: null,
      showDropdown: null,
      showReasonNote: null,
      showModal: false,
    };
  },
  methods: {
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = id;
      }
    },
  },
};
</script>

<style scoped>
table thead th,
table tbody tr td {
  padding: 1rem 2rem;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 5px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #c6c8cc;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1;
}
.approved .bg-icon {
  background: rgb(220, 255, 220);
}
.approved svg {
  color: rgb(110, 197, 110);
}
.approved .indicator {
  background: rgb(110, 197, 110) !important;
}
.not-approved .bg-icon {
  background: rgba(255, 0, 0, 0.4);
}
.not-approved svg {
  color: rgb(239 68 68);
}
.not-approved .indicator {
  background: rgb(239 68 68) !important;
}
</style>
