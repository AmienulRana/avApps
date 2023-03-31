<template>
  <LayoutAdmin @click="viewActions = null">
    <section class="px-8 mt-6 w-full mb-8" @click="activeDropdown = ''">
      <section class="flex justify-between">
        <div class="flex items-center">
          <section>
            <h1 class="text-2xl">Nominatif Penerima Gaji</h1>
          </section>
          <ChoiseCompany
            v-if="superAdmin && !loading.company"
            @selected:company="dataCompany = $event"
            :options="options"
            :dataCompany="dataCompany"
          />
        </div>
        <section class="flex">
          <Button
            class="bg-primary rounded text-white mx-2 px-6 py-2 h-max"
            @click="handleGeneratePayslip"
            :disabled="loading.add"
          >
            Generate Payslip</Button
          >
          <Button
            class="rounded text-white mx-2 px-6 py-2 h-max bg-green-400 hover:opacity-70"
          >
            Send PDF Payslip
            <font-awesome-icon icon="fa-paper-plane" class="ml-2" />
          </Button>
        </section>
      </section>

      <section class="flex mt-6 flex-wrap w-10/12 items-center">
        <Dropdown
          ref="dropdown"
          title="Departement"
          :showDropdown="activeDropdown === 'departement'"
          @update:activeDropdown="changeDropdownActive('departement')"
          :options="departement"
          property="dep_name"
          @selected="
            handleFilter(
              (filter.departement = $event?._id),
              filter.status,
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              (filter.departement = $event),
              filter.status,
              filter.employment
            )
          "
          :selectedOption="filter.departement"
        />
        <Dropdown
          ref="dropdown"
          title="Status"
          :showDropdown="activeDropdown === 'status'"
          @update:activeDropdown="(e) => changeDropdownActive('status')"
          :options="['Approve', 'Cancel', 'Pending']"
          @selected="
            handleFilter(
              filter.departement,
              (filter.status = $event),
              filter.employment
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              (filter.status = $event),
              filter.employment
            )
          "
          :selectedOption="filter.status"
        />
        <Dropdown
          ref="dropdown"
          title="Employee"
          :showDropdown="activeDropdown === 'employee'"
          @update:activeDropdown="changeDropdownActive('employee')"
          :options="employment"
          property="emp_fullname"
          :selectedOption="filter.employment"
          @selected="
            handleFilter(
              filter.departement,
              filter.status,
              (filter.employment = $event?._id)
            )
          "
          @clearSelected="
            handleFilter(
              filter.departement,
              filter.status,
              (filter.employment = $event)
            )
          "
        />
      </section>
      <section class="relative mb-4">
        <section class="bg-white flex justify-between p-4 mt-6">
          <section class="bg-white">
            <div class="flex items-center px-4">
              <button
                type="button"
                class="flex flex-none items-center justify-center text-gray-400 hover:text-gray-500"
                @click.stop="previousMonth"
              >
                <ChevronLeftIcon class="h-8 w-8" aria-hidden="true" />
              </button>
              <div class="mx-4">
                <p class="text-primary cursor-pointer">
                  {{ monthSelected.text }}, {{ yearSelected }}
                </p>
              </div>
              <button
                type="button"
                class="flex flex-none items-center justify-center text-gray-400 hover:text-gray-500"
                @click.stop="nextMonth"
              >
                <ChevronRightIcon class="h-8 w-8" aria-hidden="true" />
              </button>
            </div>
          </section>
          <ul class="text-xs flex">
            <li class="mx-3">This month</li>
            <li class="mx-3">Last month</li>
            <li class="mx-3">This year</li>
            <li class="mx-3">Last year</li>
            <li class="mx-3">Total</li>
          </ul>
        </section>
        <section class="w-full custom-scrollbar overflow-x relative">
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
              <tr v-for="(payrun, i) in payrun_filter" :key="i">
                <td class="flex items-center p-3 text-sm">
                  <div
                    class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
                  >
                    <h2 class="text-md text-white">
                      {{
                        payrun?.emp_id?.emp_fullname.substr(0, 1) +
                        payrun?.emp_id?.emp_fullname.substr(
                          payrun?.emp_id?.emp_fullname.indexOf(" ") + 1,
                          1
                        )
                      }}
                    </h2>
                  </div>
                  <div class="ml-3.5">
                    <h1 class="text-blue-400 text-base mb-0">
                      <router-link :to="`/employee/${payrun?.emp_id?._id}`">{{
                        payrun?.emp_id?.emp_fullname
                      }}</router-link>
                    </h1>
                    <p class="text-sm text-gray-400">
                      {{ payrun?.emp_id?.emp_desid?.des_name }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ payrun?.emp_id?.emp_depid?.dep_name }}
                    </p>
                  </div>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-base">
                    {{ payrun?.payrun_period?.periodic_month }}
                    {{ payrun?.payrun_period?.periodic_years }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ formatDate(payrun?.payrun_period?.periodic_start_date) }}
                    - {{ formatDate(payrun?.payrun_period?.periodic_end_date) }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">
                    {{ payrun?.payrun_type_period }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">
                    {{ formatCurrency(payrun?.payrun_salary) }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p class="text-sm">
                    {{ formatCurrency(Math.round(payrun?.payrun_net_salary)) }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <p :class="dynamicStatusClass(payrun?.payrun_status)">
                    {{ payrun?.payrun_status }}
                  </p>
                </td>
                <td class="p-3 text-sm">
                  <section class="flex">
                    <Button
                      class="text-sm text-white w-20 h-9 rounded bg-gray-400 mr-2 hover:opacity-70"
                      @click="assignDetailPayrun(payrun, 'Detail')"
                    >
                      View
                      <font-awesome-icon icon="fa-eye" class="ml-2" />
                    </Button>
                    <Button
                      v-if="payrun?.payrun_status === 'Approve'"
                      class="text-sm text-white h-9 rounded bg-gray-400 hover:opacity-70"
                      :class="payrun?.payrun_file ? 'w-24' : 'w-20'"
                      @click="downloadPDF(payrun)"
                      :disabled="loadingDownload"
                    >
                      {{ payrun?.payrun_file ? "Resend" : "Send" }}
                      <font-awesome-icon icon="fa-paper-plane" class="ml-2" />
                    </Button>
                  </section>
                </td>
                <td class="p-3 text-right relative z-10">
                  <Button
                    class="p-3 shadow-none rotate-90 hover:bg-blue-100 text-primary rounded-full -z-10"
                    @click.stop="viewActions = i"
                  >
                    <font-awesome-icon icon="fa-ellipsis" />
                  </Button>
                  <div
                    class="text-left absolute top-0 right-16 rounded-md bg-white shadow-md md:w-max md:h-max z-20"
                    v-if="viewActions === i"
                  >
                    <ul>
                      <li
                        class="px-4 py-2 cursor-pointer hover:text-blue-400"
                        @click="recalculatePayslip(payrun?._id)"
                      >
                        Calculate/Recalculate
                      </li>
                      <li
                        class="px-4 py-2 cursor-pointer hover:text-blue-400"
                        @click="
                          handleEditPayslip(payrun?._id, 'Approve Finance')
                        "
                      >
                        Approve Finance
                      </li>
                      <li
                        class="px-4 py-2 cursor-pointer hover:text-blue-400"
                        @click="handleEditPayslip(payrun?._id, 'Pending')"
                      >
                        Pending
                      </li>
                      <li
                        class="px-4 py-2 cursor-pointer hover:text-blue-400"
                        @click="handleEditPayslip(payrun?._id, 'Cancel Payrun')"
                      >
                        Cancel Payrun
                      </li>
                      <li
                        class="px-4 py-2 cursor-pointer hover:text-blue-400"
                        @click="assignDetailPayrun(payrun, 'Edit')"
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
        <Loading v-if="loading.get" />
        <NoDataShowing v-if="payrun_filter.length === 0" />
      </section>
    </section>
    <Modal
      title="Edit Payslip"
      :showModal="showModal === 'Edit'"
      @close="showModal = false"
    >
      <section class="" @click="modal.showDropdown = false">
        <h1 class="text-xl text-center">AvHris</h1>
        <section class="flex justify-between my-10">
          <div class="flex">
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">
                {{
                  detail_payrun?.emp_id?.emp_fullname.substr(0, 1) +
                  detail_payrun?.emp_id?.emp_fullname.substr(
                    detail_payrun?.emp_id?.emp_fullname.indexOf(" ") + 1,
                    1
                  )
                }}
              </h2>
            </div>
            <div class="ml-3.5">
              <h1 class="text-blue-400 text-base mb-0">
                <router-link :to="`/employee/${detail_payrun?.emp_id?._id}`">{{
                  detail_payrun?.emp_id?.emp_fullname
                }}</router-link>
              </h1>
              <p class="text-sm text-gray-400">
                {{ detail_payrun?.emp_id?.email }}
              </p>
            </div>
          </div>
          <div>
            <p class="text-sm">
              Payslip For :
              <span class="text-blue-500">
                {{
                  formatDate(detail_payrun?.payrun_period?.periodic_start_date)
                }}
                -
                {{
                  formatDate(detail_payrun?.payrun_period?.periodic_end_date)
                }}
              </span>
            </p>
            <p class="text-sm">Created at : 22 Dec, 2022</p>
          </div>
          <div>
            <p class="text-sm">
              Designation : {{ detail_payrun?.emp_id?.emp_desid?.des_name }}
            </p>
            <p class="text-sm">
              Departement : {{ detail_payrun?.emp_id?.emp_depid?.dep_name }}
            </p>
          </div>
        </section>
        <section>
          <p class="flex justify-between border-b pb-2 text-sm">
            Basic Sallary
            <span>{{ formatCurrency(detail_payrun?.payrun_salary) }}</span>
          </p>
          <p class="flex justify-between border-b pb-2 mt-6 text-sm">
            Benificiary <span></span>
          </p>
          <div class="flex mt-6 items-center">
            <p class="w-1/3 text-sm">Allowance</p>
            <section class="w-full">
              <div
                class="bg-gray-100 px-5 py-2 rounded-md flex items-center flex-wrap"
                style="min-height: 55px"
              >
                <p
                  v-for="(allowance, i) in detail_payrun?.payrun_allowance"
                  :key="i"
                  class="text-gray-400 ml-2 mb-2 bg-white text-sm min-w-max px-4 py-1 flex justify-between items-center rounded-full"
                >
                  {{ allowance?.name }}
                  <font-awesome-icon
                    icon="fa-xmark"
                    class="ml-2"
                    @click="handleDeleteAllowance(allowance)"
                  />
                </p>
                <section class="relative">
                  <font-awesome-icon
                    icon="fa-plus"
                    class="mb-2 ml-2 text-gray-400 cursor-pointer"
                    @click.stop="modal.showDropdown = 'allowance'"
                  />
                  <Transition
                    enter-active-class="animated fadeInDown"
                    leave-active-class="animated fadeOutUp"
                  >
                    <section
                      class="z-10 bg-white absolute top-full overflow-y-auto left-0 right-auto shadow-md max-h-80 custom-scrollbar w-72 mt-2.5"
                      v-if="modal.showDropdown === 'allowance'"
                    >
                      <div
                        class="bg-white border-b pb-2.5 px-6 py-4 w-full"
                        @click.stop
                      >
                        <div class="relative">
                          <Input
                            :icon="true"
                            input_class="rounded-full"
                            @input="handleSearchData($event, 'allowance')"
                            :value="query"
                          />
                          <font-awesome-icon
                            icon="fa-magnifying-glass"
                            class="absolute top-1/2 -translate-y-1/2 left-3 text-primary"
                          />
                        </div>
                      </div>
                      <ul>
                        <li
                          v-for="(allow, index) in searchAllowance"
                          :key="index"
                          @click="handleAddBenificary('allowance', allow)"
                          class="px-4 py-2 text-gray-400 text-sm hover:bg-primary justify-between items-center hover:text-white cursor-pointer flex"
                        >
                          {{ allow?.ad_name }}
                        </li>
                      </ul>
                    </section>
                  </Transition>
                </section>
              </div>
              <div
                class="grid grid-cols-4 gap-3 mt-4 items-center"
                v-for="(allowance, i) in detail_payrun?.payrun_allowance"
                :key="i"
              >
                <p
                  class="text-sm"
                  v-if="!allowance?.edit"
                  @click="allowance.edit = true"
                >
                  {{ allowance?.name }}
                </p>
                <input
                  type="text"
                  class="w-32 border h-10 px-4"
                  :value="allowance?.name"
                  @input="allowance.name = $event.target.value"
                  @blur="allowance.edit = false"
                  autofocus="true"
                  v-else
                />
                <input
                  type="number"
                  class="w-32 border h-10 px-4"
                  :value="allowance?.total"
                  @input="allowance.total = +$event.target.value"
                />
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="mr-3"
                    :checked="allowance?.percent"
                    @input="
                      allowance.percent = allowance?.percent ? false : true
                    "
                  />
                  <label class="text-sm">In Percent (%) </label>
                </div>
                <font-awesome-icon
                  icon="fa-trash-alt"
                  class="text-red-600"
                  @click="handleDeleteAllowance(allowance)"
                />
              </div>
            </section>
          </div>
          <div class="flex mt-6 items-center">
            <p class="w-1/3 text-sm">Deduction</p>
            <section class="w-full">
              <div
                class="bg-gray-100 px-5 py-2 rounded-md flex items-center flex-wrap"
                style="min-height: 55px"
              >
                <p
                  v-for="(deduction, i) in detail_payrun?.payrun_deduction"
                  :key="i"
                  class="text-gray-400 ml-2 mb-2 bg-white text-sm min-w-max px-4 py-1 flex justify-between items-center rounded-full"
                >
                  {{ deduction?.name }}
                  <font-awesome-icon
                    icon="fa-xmark"
                    class="ml-2"
                    @click="handleDeleteDeduction(deduction)"
                  />
                </p>
                <section class="relative">
                  <font-awesome-icon
                    icon="fa-plus"
                    class="mb-2 ml-2 text-gray-400 cursor-pointer"
                    @click.stop="modal.showDropdown = 'deduction'"
                  />
                  <Transition
                    enter-active-class="animated fadeInDown"
                    leave-active-class="animated fadeOutUp"
                  >
                    <section
                      class="z-10 bg-white absolute top-full overflow-y-auto right-0 left-auto shadow-md max-h-80 custom-scrollbar w-72 mt-2.5"
                      v-if="modal.showDropdown === 'deduction'"
                    >
                      <div
                        class="bg-white border-b pb-2.5 px-6 py-4 w-full"
                        @click.stop
                      >
                        <div class="relative">
                          <Input
                            :icon="true"
                            input_class="rounded-full"
                            @input="handleSearchData($event, 'deduction')"
                            :value="query"
                          />
                          <font-awesome-icon
                            icon="fa-magnifying-glass"
                            class="absolute top-1/2 -translate-y-1/2 left-3 text-primary"
                          />
                        </div>
                      </div>
                      <ul>
                        <li
                          v-for="(deduct, index) in searchDeduction"
                          :key="index"
                          @click="handleAddBenificary('deduction', deduct)"
                          class="px-4 py-2 text-gray-400 text-sm hover:bg-primary justify-between items-center hover:text-white cursor-pointer flex"
                        >
                          {{ deduct?.ad_name }}
                        </li>
                      </ul>
                    </section>
                  </Transition>
                </section>
              </div>
              <div
                class="grid grid-cols-4 gap-3 mt-4 items-center"
                v-for="(deduction, i) in detail_payrun?.payrun_deduction"
                :key="i"
              >
                <p
                  class="text-sm"
                  v-if="!deduction?.edit"
                  @click="deduction.edit = true"
                >
                  {{ deduction?.name }}
                </p>
                <input
                  type="text"
                  class="w-32 border h-10 px-4"
                  :value="deduction?.name"
                  @input="deduction.name = $event.target.value"
                  @blur="deduction.edit = false"
                  autofocus="true"
                  v-else
                />
                <input
                  type="number"
                  class="w-32 border h-10 px-4"
                  :value="deduction?.total"
                  @input="deduction.total = +$event.target.value"
                />
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="mr-3"
                    :checked="deduction?.percent"
                    @input="
                      deduction.percent = deduction?.percent ? false : true
                    "
                  />
                  <label class="text-sm">In Percent (%) </label>
                </div>
                <font-awesome-icon
                  icon="fa-trash-alt"
                  class="text-red-600"
                  @click="handleDeleteDeduction(deduction)"
                />
              </div>
              <div class="grid grid-cols-4 gap-3 mt-4 items-center">
                <p class="text-sm">Potongan Absensi</p>
                <input
                  type="number"
                  class="w-32 border h-10 px-4"
                  :value="detail_payrun?.payrun_total_deduct_attendance"
                  @input="
                    detail_payrun.payrun_total_deduct_attendance =
                      +$event.target.value
                  "
                />
              </div>
            </section>
          </div>
          <p class="flex justify-between border-b pb-2 text-sm mt-8">
            Total Allowance
            <span>{{
              formatCurrency(getTotalAllowance(detail_payrun?.payrun_allowance))
            }}</span>
          </p>
          <p class="flex justify-between border-b pb-2 my-2 text-sm">
            Total Deducation
            <span>
              {{
                formatCurrency(
                  getTotalDeduction(detail_payrun?.payrun_deduction)
                )
              }}
            </span>
          </p>
          <p class="flex justify-between border-b pb-2 my-2 text-sm">
            Total Attendance Deducation
            <span>{{
              formatCurrency(detail_payrun?.payrun_total_deduct_attendance)
            }}</span>
          </p>
          <!-- <p class="flex justify-between border-b pb-2 my-2">
            Benificiary Total <span>$800</span>
          </p> -->
          <p class="flex justify-between border-b pb-2 my-2">
            Net payable salary<span>
              {{
                formatCurrency(
                  detail_payrun?.payrun_salary -
                    detail_payrun?.payrun_total_deduct_attendance +
                    getTotalAllowance(detail_payrun?.payrun_allowance) -
                    getTotalDeduction(detail_payrun?.payrun_deduction)
                )
              }}
            </span>
          </p>
        </section>
      </section>
      <template v-slot:footer>
        <section class="flex w-52 justify-between">
          <Button class="bg-gray-400 w-24 py-2 text-white rounded-md">
            Cancel
          </Button>
          <Button
            class="bg-blue-500 w-24 py-2 text-white rounded-md"
            @click="handleEditDataPayslip"
            :disabled="loading.edit"
          >
            Save
          </Button>
        </section>
      </template>
    </Modal>
    <Modal
      title="Detail Payslip"
      modalClass="modal-width"
      :showModal="true"
      :class="showModal === 'Detail' ? 'opacity-100 z-50' : 'opacity-0 -z-10'"
      @close="showModal = false"
    >
      <section id="modal-content">
        <h1 class="text-xl text-center">AvHris</h1>
        <p class="text-sm text-center">
          Periode
          <span class="text-blue-500">
            {{ detail_payrun?.payrun_period?.periodic_month }}

            {{ detail_payrun?.payrun_period?.periodic_years }}
          </span>
        </p>

        <section class="flex justify-between my-10">
          <div class="flex">
            <div
              class="w-12 h-12 flex justify-center items-center rounded-full bg-zinc-400"
            >
              <h2 class="text-md text-white">
                {{
                  detail_payrun?.emp_id?.emp_fullname.substr(0, 1) +
                  detail_payrun?.emp_id?.emp_fullname.substr(
                    detail_payrun?.emp_id?.emp_fullname.indexOf(" ") + 1,
                    1
                  )
                }}
              </h2>
            </div>
            <div class="ml-3.5">
              <h1 class="text-base text-blue-400 mb-0">
                {{ detail_payrun?.emp_id?.emp_fullname }}
              </h1>
              <p class="text-sm text-gray-400">
                {{ detail_payrun?.emp_id?.email }}
              </p>
            </div>
          </div>
          <div>
            <p class="text-sm">
              Payslip For :
              <span class="text-blue-500">
                {{
                  formatDate(
                    detail_payrun?.payrun_period?.periodic_start_date ||
                      "12-02-2023"
                  )
                }}
                -
                {{
                  formatDate(
                    detail_payrun?.payrun_period?.periodic_end_date ||
                      "10-02-2023"
                  )
                }}
              </span>
            </p>
            <p class="text-sm">Created at : 22 Dec, 2022</p>
          </div>
          <div>
            <p class="text-sm">
              Designation : {{ detail_payrun?.emp_id?.emp_desid?.des_name }}
            </p>
            <p class="text-sm">
              Departement : {{ detail_payrun?.emp_id?.emp_depid?.dep_name }}
            </p>
          </div>
        </section>
        <section>
          <p class="flex justify-between border-b pb-2 text-sm">
            Gaji Pokok
            <span>{{ formatCurrency(detail_payrun?.payrun_salary || 0) }}</span>
          </p>
          <p class="text-center mt-6 text-sm">Rincian Penghasilan</p>
          <div class="grid grid-cols-2 gap-6 mt-6">
            <section class="w-full">
              <p class="text-sm text-center mb-3">Tunjangan</p>
              <p
                class="text-gray-400 mb-2 bg-white text-sm px-4 py-1 flex justify-between items-center"
                v-if="detail_payrun?.payrun_total_overtime > 0"
              >
                <span> Lembur / Overtime </span>
                <span>
                  {{
                    formatCurrency(detail_payrun?.payrun_total_overtime || 0)
                  }}
                </span>
              </p>
              <p
                v-for="(allowance, i) in detail_payrun?.payrun_allowance"
                :key="i"
                class="text-gray-400 mb-2 bg-white text-sm px-4 py-1 flex justify-between items-center"
              >
                <span>
                  {{ allowance?.name }}
                  {{ allowance?.percent ? `${allowance?.total}%` : "" }}
                </span>
                <span>
                  {{
                    formatCurrency(
                      allowance?.percent
                        ? (allowance?.total / 100) *
                            detail_payrun?.payrun_salary
                        : allowance?.total || 0
                    )
                  }}
                </span>
              </p>
            </section>
            <section class="w-full">
              <p class="text-center text-sm mb-3">Potongan</p>
              <p
                class="text-gray-400 mb-2 bg-white text-sm px-4 py-1 flex justify-between items-center"
              >
                <span> Potongan Absensi </span>
                <span>
                  {{
                    formatCurrency(
                      detail_payrun?.payrun_total_deduct_attendance || 0
                    )
                  }}
                </span>
              </p>
              <p
                v-for="(deduction, i) in detail_payrun?.payrun_deduction"
                :key="i"
                class="text-gray-400 mb-2 bg-white text-sm px-4 py-1 flex justify-between items-center"
              >
                <span>
                  {{ deduction?.name }}
                  {{ deduction?.percent ? `${deduction?.total}%` : "" }}
                </span>
                <span>
                  {{
                    formatCurrency(
                      deduction?.percent
                        ? (deduction?.total / 100) *
                            detail_payrun?.payrun_salary
                        : deduction?.total || 0
                    )
                  }}
                </span>
              </p>
              <!-- <p
                  v-for="(deduction, i) in detail_payrun?.payrun_deduction"
                  :key="i"
                  class="text-gray-400 ml-2 bg-white text-sm min-w-max px-4 py-1 flex justify-between items-center rounded-full"
                >
                  {{ deduction?.name }}
                </p> -->
            </section>
          </div>
          <p class="flex justify-between border-b pb-2 text-sm mt-8">
            Total Tunjangan
            <span>{{
              formatCurrency(detail_payrun?.payrun_total_allowance || 0)
            }}</span>
          </p>
          <p class="flex justify-between border-b pb-2 my-2 text-sm">
            Total Potongan
            <span>
              {{ formatCurrency(detail_payrun?.payrun_total_deduction || 0) }}
            </span>
          </p>
          <p class="flex justify-between border-b pb-2 my-2 text-sm">
            Total Potongan Kehadiran
            <span>{{
              formatCurrency(detail_payrun?.payrun_total_deduct_attendance || 0)
            }}</span>
          </p>
          <!-- <p class="flex justify-between border-b pb-2 my-2">
            Benificiary Total <span>$800</span>
          </p> -->
          <p class="flex justify-between border-b pb-2 my-2">
            Net payable salary<span>
              {{ formatCurrency(detail_payrun?.payrun_net_salary || 0) }}
            </span>
          </p>
        </section>
      </section>
      <template v-slot:footer>
        <section class="flex w-52 justify-end">
          <Button
            class="bg-gray-400 w-24 py-2 text-white rounded-md"
            @click="showModal = null"
          >
            Close
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
import Input from "../../components/Input.vue";
import Modal from "../../components/Modal.vue";
import Loading from "../../components/Loading.vue";
import NoDataShowing from "../../components/NoDataShowing.vue";
import ChoiseCompany from "@/components/ChoiseCompany.vue";
import { GetAllCompanyAPI } from "@/actions/company";
import {
  GeneratePayslipAPI,
  GetPayslipAPI,
  EditPayrunStatusAPI,
  RecalculatePayrunAPI,
  EditPayrunDataAPI,
  UploadPDFFileAPI,
} from "@/actions/payrun";
import decryptToken from "@/utils/decryptToken";
import { useToast } from "vue-toastification";
import { GetAllEmployementAPI } from "@/actions/employment";
import { GetDepartementAPI } from "@/actions/departement";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { GetPeriodicAPI } from "@/actions/periodic";
import { GetAllowDeductAPI } from "@/actions/allow-deduction";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";

// import pdfcrowd from "pdfcrowd";

export default {
  name: "PayrollNominatif",
  data() {
    return {
      viewActions: null,
      status: "",
      activeDropdown: "",
      showModal: false,
      modal: {
        showDropdown: false,
      },
      superAdmin: false,
      loadingDownload: false,
      showSelectCompany: false,
      options: [],
      payruns: [],
      payrun_filter: [],
      departement: [],
      employment: [],
      allowance: [],
      searchAllowance: [],
      deduction: [],
      searchDeduction: [],
      detail_payrun: {},
      query: "",
      dataCompany: {
        _id: "",
      },
      loading: {
        company: true,
        get: false,
        add: false,
        edit: false,
      },
      filter: {
        departement: "",
        status: "",
        employment: "",
      },
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthSelected: {
        number: 2,
        text: "March",
      },
      yearSelected: 2023,
      periodic: [],
    };
  },
  components: {
    LayoutAdmin,
    Dropdown,
    Modal,
    Button,
    ChoiseCompany,
    NoDataShowing,
    Loading,
    ChevronLeftIcon,
    ChevronRightIcon,
    Input,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    handleSearchData(value, type) {
      this.query = value;
      if (type === "allowance") {
        if (this.query.length >= 1) {
          const result = this.allowance.filter((option) =>
            option.ad_name.toLowerCase().includes(this.query.toLowerCase())
          );
          this.searchAllowance = result;
        } else {
          this.searchAllowance = this.allowance;
        }
      } else {
        if (this.query.length >= 1) {
          const result = this.deduction.filter((option) =>
            option.ad_name.toLowerCase().includes(this.query.toLowerCase())
          );
          this.searchDeduction = result;
        } else {
          this.searchDeduction = this.deduction;
        }
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
    handleAddBenificary(benificary, data) {
      if (benificary === "allowance") {
        const payload = {
          allow_id: data?._id,
          name: data?.ad_name,
          edit: false,
          percent: false,
          total: 0,
        };
        this.detail_payrun.payrun_allowance = [
          ...this.detail_payrun?.payrun_allowance,
          payload,
        ];
      } else {
        const payload = {
          deduct_id: data?._id,
          name: data?.ad_name,
          edit: false,
          percent: false,
          total: 0,
        };
        this.detail_payrun.payrun_deduction = [
          ...this.detail_payrun?.payrun_deduction,
          payload,
        ];
      }
    },
    previousMonth() {
      this.monthSelected.number--;
      if (this.monthSelected.number < 0) {
        this.monthSelected.number = 11;
        this.yearSelected--;
      }
      this.monthSelected.text = this.months[this.monthSelected.number];

      const periodicFilter = this.periodic.filter(
        (period) =>
          period?.periodic_month === this.monthSelected.text &&
          +period?.periodic_years === this.yearSelected
      )[0];
      if (periodicFilter) {
        this.getPayrun(periodicFilter?._id);
      } else {
        this.toast.error(
          `Can't find periodic ${this.monthSelected.text} ${this.yearSelected}`
        );
        this.payrun_filter = [];
      }
    },
    nextMonth() {
      this.monthSelected.number++;
      if (this.monthSelected.number > 11) {
        this.monthSelected.number = 0;
        this.yearSelected++;
      }
      this.monthSelected.text = this.months[this.monthSelected.number];
      const periodicFilter = this.periodic.filter(
        (period) =>
          period?.periodic_month === this.monthSelected.text &&
          +period?.periodic_years === this.yearSelected
      )[0];
      if (periodicFilter) {
        this.getPayrun(periodicFilter?._id);
      } else {
        this.toast.error(
          `Can't find periodic ${this.monthSelected.text} ${this.yearSelected}`
        );
        this.payrun_filter = [];
      }
    },
    async getPeriodic() {
      const querySuperAdmin = `?company_id=${this?.dataCompany?._id}`;
      const response = await GetPeriodicAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }

      const filterActivePeriodic = response?.data.filter(
        (period) => period?.periodic_status === true
      )[0];

      const indexMonthActive = this.months.indexOf(
        filterActivePeriodic?.periodic_month
      );
      this.monthSelected.number = indexMonthActive;
      this.monthSelected.text = this.months[indexMonthActive];
      this.periodic = response?.data;
      this.getPayrun(filterActivePeriodic?._id);
    },
    downloadPDF(payrun) {
      this.detail_payrun = payrun;
      this.loadingDownload = true;

      window.html2canvas = html2canvas;
      let doc = new jspdf("p", "pt", "a3");
      const modalContent = document.querySelector("#modal-content");

      setTimeout(() => {
        doc.html(modalContent, {
          callback: async (pdf) => {
            pdf.setProperties({
              title: "My PDF",
              paddingLeft: 20, // ukuran padding pada sisi kiri
              paddingRight: 20, // ukuran padding pada sisi kanan
            });
            const pdfName = `${payrun?.emp_id?.emp_fullname}_${
              payrun?.payrun_period?.periodic_month
            }_${payrun?.payrun_period?.periodic_years}_${Date.now()}.pdf`;
            const pdfFile = doc.output("blob");
            doc.save(pdfName);

            const formData = new FormData();
            formData.append("file", pdfFile, pdfName);

            const response = await UploadPDFFileAPI(formData, payrun?._id);
            if (response?.status === 401) {
              this.$store.commit("changeIsLoggedIn", false);
              return this.$router.push("/login");
            }
            if (response?.status === 200) {
              this.getPayrun();
            }
            this.showMessageStatus(response);
          },
        });
        this.loadingDownload = false;
      }, 500);
    },
    handleDeleteAllowance(allowance) {
      const payrun_allowance = this.detail_payrun?.payrun_allowance;
      const delete_allowance = payrun_allowance?.filter(
        (all) => all?.allow_id !== allowance?.allow_id
      );
      this.detail_payrun.payrun_allowance = delete_allowance;
    },
    handleDeleteDeduction(deduction) {
      const payrun_deduction = this.detail_payrun?.payrun_deduction;
      const delete_deduction = payrun_deduction?.filter(
        (all) => all?.deduct_id !== deduction?.deduct_id
      );
      this.detail_payrun.payrun_deduction = delete_deduction;
    },
    handleFilter(departement, status, employment) {
      const newAttendanceProp = this.payruns.map((payrun) => ({
        ...payrun,
        emp_depid: payrun?.emp_id?.emp_depid?._id,
        employment: payrun?.emp_id?._id,
      }));
      const filterConditions = [
        { key: "payrun_status", value: status },
        { key: "emp_depid", value: departement },
        { key: "employment", value: employment },
      ];
      const dataFilter = (overtime) =>
        filterConditions.every(
          ({ key, value }) => value == "" || overtime[key] == value
        );
      this.payrun_filter = newAttendanceProp.filter(dataFilter);
    },
    getTotalAllowance(allowance) {
      let totalAllowance = 0;
      for (let i = 0; i < allowance.length; i++) {
        if (allowance[i].percent) {
          totalAllowance +=
            (allowance[i].total / 100) * this.detail_payrun?.payrun_salary;
        } else {
          totalAllowance = allowance[i].total + totalAllowance;
        }
      }
      return totalAllowance;
    },
    getTotalDeduction(deduction) {
      let totalDeduction = 0;
      for (let i = 0; i < deduction.length; i++) {
        if (deduction[i].percent) {
          totalDeduction +=
            (deduction[i].total / 100) * this.detail_payrun?.payrun_salary;
        } else {
          totalDeduction = deduction[i].total + totalDeduction;
        }
      }
      return totalDeduction;
    },
    async handleGetDepartement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetDepartementAPI(querySuperAdmin);
      if (response.status === 401) {
        return this.$router.push("/login");
      }
      this.departement = response.data;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: "numeric", month: "long" };
      return new Intl.DateTimeFormat("id-ID", options).format(date);
    },
    formatCurrency(number) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
      return formatter.format(Math.round(number));
    },
    async getAllCompany() {
      this.loading.company = true;
      const response = await GetAllCompanyAPI();
      this.options = response?.data;
      this.dataCompany = response?.data[0];
      this.loading.company = false;
    },
    async handleGetEmployement() {
      const querySuperAdmin = `?company=${this.dataCompany?._id}`;
      const response = await GetAllEmployementAPI(
        this.superAdmin ? querySuperAdmin : ""
      );
      if (response.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      const getIdNameEmp = response?.data?.map((employment) => ({
        _id: employment?._id,
        emp_fullname: employment?.emp_fullname,
      }));
      this.employment = getIdNameEmp;
    },
    changeDropdownActive(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    async handleGeneratePayslip() {
      this.loading.add = true;
      this.loading.get = true;
      const periodicFilter = this.periodic.filter(
        (period) =>
          period?.periodic_month === this.monthSelected.text &&
          +period?.periodic_years === this.yearSelected
      )[0];
      if (!periodicFilter) {
        this.toast.error(
          "Can't Generate payslip because you don't have periodic"
        );
      } else {
        const querySuperAdmin = `?company_id=${this.dataCompany?._id}&periodic_id=${periodicFilter?._id}`;
        const response = await GeneratePayslipAPI(querySuperAdmin);
        if (response?.status === 401) {
          this.$store.commit("changeIsLoggedIn", false);
          return this.$router.push("/login");
        }
        if (response?.status === 200) {
          this.getPayrun(periodicFilter?._id);
        }
        this.showMessageStatus(response);
      }
      this.loading.add = false;
      this.loading.get = false;
    },
    async recalculatePayslip(id) {
      this.loading.get = true;
      const periodicFilter = this.periodic.filter(
        (period) =>
          period?.periodic_month === this.monthSelected.text &&
          +period?.periodic_years === this.yearSelected
      )[0];

      if (!periodicFilter) {
        this.toast.error(
          "Can't Generate payslip because you don't have periodic"
        );
      } else {
        const querySuperAdmin = `?company_id=${this.dataCompany?._id}&periodic_id=${periodicFilter?._id}`;
        const response = await RecalculatePayrunAPI(`${id}${querySuperAdmin}`);
        if (response?.status === 401) {
          this.$store.commit("changeIsLoggedIn", false);
          return this.$router.push("/login");
        }
        if (response?.status === 200) {
          this.getPayrun(periodicFilter?._id);
        }
        this.loading.get = false;
        this.showMessageStatus(response);
      }
    },
    async assignDetailPayrun(payrun, modal) {
      this.showModal = modal;
      if (modal === "Edit") {
        const filterNewAllow = payrun?.payrun_allowance.filter(
          (allowance) => allowance?.name === "Komisi / Bonus"
        )[0];
        if (!filterNewAllow) {
          this.detail_payrun = {
            ...payrun,
            payrun_allowance: [
              ...payrun?.payrun_allowance,
              {
                total: 0,
                name: "Komisi / Bonus",
                percent: false,
                allow_id: `${Date.now() * 1000}`,
                edit: false,
              },
            ],
          };
          return;
        }
        this.detail_payrun = {
          ...payrun,
        };
      } else {
        this.detail_payrun = {
          ...payrun,
        };
      }
    },
    async handleEditPayslip(id, status) {
      this.loading.get = true;
      const periodicFilter = this.periodic.filter(
        (period) =>
          period?.periodic_month === this.monthSelected.text &&
          +period?.periodic_years === this.yearSelected
      )[0];
      const queryStatus = `?status=${status}`;
      const response = await EditPayrunStatusAPI(id, queryStatus);
      if (response?.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      if (response?.status === 200) {
        this.getPayrun(periodicFilter?._id);
      }
      this.loading.get = false;
      this.showMessageStatus(response);
    },
    async handleEditDataPayslip() {
      const id = this.detail_payrun?._id;
      const detail_payrun = this.detail_payrun;
      const payload = {
        ...this.detail_payrun,
        payrun_total_allowance: this.getTotalAllowance(
          detail_payrun?.payrun_allowance
        ),
        payrun_total_deduction: this.getTotalDeduction(
          detail_payrun?.payrun_deduction
        ),
        payrun_total_deduct_attendance:
          +detail_payrun?.payrun_total_deduct_attendance,
        payrun_net_salary:
          detail_payrun?.payrun_salary -
          detail_payrun?.payrun_total_deduct_attendance +
          this.getTotalAllowance(detail_payrun?.payrun_allowance) -
          this.getTotalDeduction(detail_payrun?.payrun_deduction),
      };
      this.loading.edit = true;
      const periodicFilter = this.periodic.filter(
        (period) =>
          period?.periodic_month === this.monthSelected.text &&
          +period?.periodic_years === this.yearSelected
      )[0];
      const response = await EditPayrunDataAPI(id, payload);
      if (response?.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      if (response?.status === 200) {
        this.getPayrun(periodicFilter?._id);
        this.showModal = false;
        this.detail_payrun = {};
      }
      this.loading.edit = false;
      this.showMessageStatus(response);
    },
    async getPayrun(periodic_id) {
      this.loading.get = true;
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}&periodic_id=${periodic_id}`;
      const response = await GetPayslipAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$store.commit("changeIsLoggedIn", false);
        return this.$router.push("/login");
      }
      if (response?.status === 200) {
        this.payruns = response?.data;
        this.loading.get = false;
        this.handleFilter(
          this.filter.departement,
          this.filter.status,
          this.filter.employment
        );
      }
    },
    dynamicStatusClass(status) {
      let backgroundStatus =
        "flex py-1 text-white w-24 px-2 items-center justify-center rounded-full min-w-max ";
      switch (status) {
        case "Pending":
          backgroundStatus += " bg-gray-600";
          break;
        case "Approve":
          backgroundStatus += " bg-green-400";
          break;
        case "Calculate":
          backgroundStatus += " bg-zinc-300";
          break;
        case "Cancel":
          backgroundStatus += " bg-red-500";
          break;
        default:
          break;
      }
      return backgroundStatus;
    },
    async handleGetAllowDeduct() {
      const querySuperAdmin = `?company_id=${this.dataCompany?._id}`;

      const response = await GetAllowDeductAPI(querySuperAdmin);
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        const allowance = response.data.filter(
          (ad) => ad?.ad_type === "Allowance"
        );
        const deduction = response.data.filter(
          (ad) => ad?.ad_type === "Deduction"
        );
        this.allowance = allowance;
        this.searchAllowance = allowance;
        this.searchDeduction = deduction;
        this.deduction = deduction;
      }
    },
  },
  watch: {
    dataCompany: {
      handler: function () {
        this.getPeriodic();
        this.handleGetEmployement();
        this.handleGetDepartement();
        this.handleGetAllowDeduct();
      },
      deep: true,
    },
  },
  computed: {},
  mounted() {
    const payload = decryptToken();
    this.superAdmin =
      payload?.role === "Super Admin" || payload?.role === "Group Admin";
    // if (payload?.role === "Super Admin" || payload?.role === "Group Admin") {
    this.getAllCompany();
    // }
    // if (payload?.role !== "Super Admin" || payload?.role !== "Group Admin") {
    // this.getPayrun();
    // }
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
  height: 8px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #c6c8cc;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1;
}
</style>
