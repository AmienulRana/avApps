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
            <p class="text-sm text-gray-400">Employee Id</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Employee Status</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Departement</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Work Shifts</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Joining Date</p>
          </td>
          <td class="p-3 text-sm">
            <p class="text-sm text-gray-400">Role</p>
          </td>
          <td class="p-3 text-right relative">
            <Button
              class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full"
              @click="showContactEmployee('tes')"
            >
              <font-awesome-icon icon="fa-ellipsis" />
            </Button>
            <div
              class="text-left absolute -top-full right-16 rounded-md bg-white shadow-md md:w-max md:h-max"
              v-if="contactEmployee === 'tes'"
            >
              <ul>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    View details
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Edit
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Assign leave
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Edit salary
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Add joining date
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Terminate
                  </router-link>
                </li>
                <li class="px-4 py-2 hover:bg-gray-100 hover:text-blue-400">
                  <router-link
                    to="/detail-employee"
                    class="cursor-pointer text-sm"
                  >
                    Remove from employee list
                  </router-link>
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
