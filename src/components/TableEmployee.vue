<template>
  <section class="overflow-x-auto custom-scrollbar w-full">
    <table class="table-auto bg-white w-full mt-6 min-w-max">
      <thead class="border-b bg-white border-gray-200 text-gray-400">
        <tr>
          <th class="text-left text-sm p-3">Profile</th>
          <th class="text-left text-sm p-3">Employee ID</th>
          <th class="text-left text-sm p-3">Employee Status</th>
          <th class="text-left text-sm p-3">Departement</th>
          <th class="text-left text-sm p-3">Workshift</th>
          <th class="text-left text-sm p-3">Joining date</th>
          <th class="text-left text-sm p-3">Role</th>
          <th class="text-left text-sm p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(employe, index) in employee" :key="index">
          <td class="flex items-center p-3 text-sm">
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">AR</h2>
            </div>
            <div class="ml-3.5">
              <h1 class="text-md text-blue-400 mb-0">{{ employe.name }}</h1>
              <p class="text-sm text-gray-400">{{ employe.designation }}</p>
            </div>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">{{ employe.id }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">{{ employe.status }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">{{ employe.departement }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">{{ employe.workshifts }}</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">
              {{ !employe.joining ? "-" : !employe.joining }}
            </p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">{{ employe.role }}</p>
          </td>
          <td class="p-3 text-right relative">
            <Button
              class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
              @click="showContactEmployee(employe.id)"
            >
              <font-awesome-icon icon="fa-ellipsis" />
            </Button>
            <div
              class="text-left absolute -top-full right-16 rounded-md bg-white shadow-md md:w-max md:h-max"
              v-if="contactEmployee === employe.id"
            >
              <ul>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    :to="`/detail-employee/${employe.id}`"
                    class="cursor-pointer text-sm"
                  >
                    View details
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    :to="`/detail-employee/${employe.id}`"
                    class="cursor-pointer text-sm"
                  >
                    Edit
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    :to="`/detail-employee/${employe.id}`"
                    class="cursor-pointer text-sm"
                  >
                    Assign leave
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    :to="`/detail-employee/${employe.id}`"
                    class="cursor-pointer text-sm"
                  >
                    Edit salary
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    :to="`/detail-employee/${employe.id}`"
                    class="cursor-pointer text-sm"
                  >
                    Add joining date
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    :to="`/detail-employee/${employe.id}`"
                    class="cursor-pointer text-sm"
                  >
                    Terminate
                  </router-link>
                </li>
                <li
                  class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400 text-red-600"
                >
                  Remove from employee list
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: "TableEmployee",
  props: {
    employee: Array,
  },
  data() {
    return {
      contactEmployee: null,
    };
  },
  methods: {
    showContactEmployee(id) {
      if (this.contactEmployee === id) {
        this.contactEmployee = false;
      } else {
        this.contactEmployee = id;
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
  height: 2px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #c6c8cc;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1;
}
</style>
