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
          <th class="text-left text-sm">Leave duration</th>
          <th class="text-left text-sm">Name</th>
          <th class="text-left text-sm">Type</th>
          <th class="text-left text-sm">Attachments</th>
          <th class="text-left text-sm">Status</th>
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
            <p class="text-sm">Cuti Tahunan(Paid)</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">Paid</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm">-</p>
          </td>
          <td class="p-3 text-sm">
            <p
              class="flex py-1 text-white w-24 items-center justify-center rounded-full bg-coral"
            >
              Pending
            </p>
          </td>
          <td class="p-3 text-sm flex">
            <div class="relative">
              <button
                class="text-blue-400 text-md"
                @click.stop="showReasonNote = 0"
              >
                <font-awesome-icon icon="fa-file" />
              </button>
              <section
                v-if="showReasonNote === 0"
                class="z-10 bg-white absolute rounded-md top-full left-auto right-0 shadow-md w-72 mt-2.5 px-8 py-4"
              >
                <h1 class="opacity-70">Reason Note</h1>
                <p
                  class="mt-5 text-sm bg-amber-100 px-6 py-4 mb-10 text-gray-400"
                >
                  Catatan leave request
                </p>
                <div class="flex justify-end mb-6">
                  <Button
                    class="bg-gray-500 text-white w-24 py-2 rounded"
                    @click="showReasonNote = null"
                  >
                    Close
                  </Button>
                </div>
              </section>
            </div>
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
              class="text-left absolute -top-full right-20 rounded-md bg-white shadow-md md:w-max md:h-max"
              v-if="showActions === 0"
            >
              <ul>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  View details
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  Rejected
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <Modal title="Response Log" :showModal="showModal" @close="showModal = false">
    <section class="flex w-full justify-center">
      <div>
        <h2 class="text-base">At 9:18 AM, Today</h2>
        <p class="text-gray-400 text-xs">
          Applied by <span class="text-blue-400">Dr.Banner</span>
        </p>
      </div>
      <section class="relative px-10 border-l-2 h-52 ml-10">
        <div
          class="flex w-10 h-10 p-2 rounded-full bg-gray-100 absolute top-0 -left-5"
        >
          <img src="../assets/icons/log.svg" />
        </div>
        <div class="bg-gray-100 mt-10 px-4 py-2 rounded">
          <h2 class="text-sm flex items-center">
            Paid Casual
            <span class="w-1.5 block h-1.5 rounded-full bg-gray-300 mx-4" />
            1 Day
          </h2>
          <h2 class="text-sm mt-1">01 Dec, 22</h2>
          <div class="flex text-xs text-gray-400 mt-2">
            <font-awesome-icon icon="fa-file" />
            <article>
              <p class="ml-2">Reason Note</p>
            </article>
          </div>
        </div>
      </section>
    </section>
    <section class="mt-4">
      <label class="text-sm">Response Note</label>
      <textarea rows="4" class="w-full mt-2 border outline-primary py-4">
      </textarea>
      <section class="grid grid-cols-3 items-center mt-4">
        <p class="text-sm">Update status</p>
        <div class="flex">
          <Radio label="Pending" />
          <Radio label="Approved" class="mx-8" />
          <Radio label="Rejected" />
        </div>
      </section>
    </section>
    <template #footer>
      <section class="flex w-52 justify-between">
        <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
          Cancel
        </Button>
        <Button class="bg-green-500 w-24 py-2 text-white rounded-md">
          Save
        </Button>
      </section>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import Radio from "./Radio.vue";
export default {
  name: "TableAttadance",
  components: { Modal, Radio },
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
</style>
