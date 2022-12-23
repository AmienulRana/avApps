<template>
  <LayoutAdmin>
    <section class="px-8 mt-6 w-full">
      <section class="flex justify-between">
        <h1 class="text-2xl">
          Employee Detail |
          <router-link to="/employee" class="text-sm text-primary"
            >Back to all employee</router-link
          >
        </h1>
      </section>

      <section
        class="bg-white w-full grid shadow-md h-64 grid-cols-3 gap-3 py-3 my-6"
      >
        <section class="flex px-6 py-4">
          <img
            src="@/assets/profile.png"
            alt="profile image"
            class="w-32 h-32 rounded-full"
          />
          <div class="ml-9">
            <h1 class="text-xl">Nama Karyawan</h1>
            <Button
              class="bg-blue-600 px-4 text-sm py-1 my-2 text-white rounded-full"
            >
              Permanent</Button
            >
            <p class="text-sm text-gray-400">Software Enginer</p>
            <p class="text-sm text-gray-400">4JAbd23</p>
            <p class="text-sm text-gray-400">Departemen Manejer</p>
          </div>
        </section>
        <section class="px-6 py-4 border-x h-max">
          <div class="flex items-center mb-5">
            <font-awesome-icon
              icon="fa-briefcase"
              class="text-lg text-primary"
            />
            <div class="ml-3">
              <p class="text-sm text-gray-400">Departemen</p>
              <p class="text-sm opacity-80">Account</p>
            </div>
          </div>
          <div class="flex items-center">
            <font-awesome-icon icon="fa-clock" class="text-lg text-primary" />
            <div class="ml-3">
              <p class="text-sm text-gray-400">Work Shifts</p>
              <p class="text-sm opacity-80">Regular work shifts</p>
            </div>
          </div>
        </section>
        <section class="px-6 py-4">
          <div class="flex items-center mb-5">
            <font-awesome-icon icon="fa-dollar" class="text-lg text-primary" />
            <div class="ml-3">
              <p class="text-sm text-gray-400">Salary</p>
              <p class="text-sm opacity-80">
                $ 10,000
                <span class="text-primary text-xs">(current)</span>
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <font-awesome-icon
              icon="fa-calendar"
              class="text-lg text-primary"
            />
            <div class="ml-3">
              <p class="text-sm text-gray-400">Joining date</p>
              <p class="text-sm opacity-80">Not added yet</p>
            </div>
          </div>
        </section>
      </section>
      <section class="flex justify-between w-full h-auto mb-6">
        <section class="w-1/5 bg-white text-center shadow-md">
          <font-awesome-icon
            icon="fa-user"
            class="text-2xl text-primary my-10"
          />
          <ul class="text-left">
            <li
              class="cursor-pointer text-sm px-4 mb-4 truncate w-full"
              v-for="(title, i) in titleTabs"
              :class="
                sideTabActive === title ? 'text-primary' : 'text-gray-400'
              "
              @click="sideTabActive = title"
              :key="i"
            >
              {{ title }}
            </li>
            <li
              class="cursor-pointer text-sm px-4 mb-4 truncate w-full"
              @click="sideTabActive = 'cuti' || 'off'"
            >
              <Accordion :isOpen="isOpenAccordion">
                <template v-slot:header>
                  <p
                    :class="
                      sideTabActive === 'cuti' || sideTabActive === 'off'
                        ? 'text-primary'
                        : 'text-gray-400'
                    "
                  >
                    Cuti
                  </p>
                </template>
                <template v-slot:content
                  ><p class="text-white" @click.stop="sideTabActive = 'off'">
                    Off day
                  </p></template
                >
              </Accordion>
            </li>
          </ul>
        </section>
        <section class="w-3/4 bg-white">
          <PersonalDetail v-if="sideTabActive === 'Personal Detail'" />
          <Employement v-if="sideTabActive === 'Employment'" />
          <Experience v-if="sideTabActive === 'Pendidikan dan Pengalaman'" />
          <Rekening v-if="sideTabActive === 'Rekening'" />
          <Payroll v-if="sideTabActive === 'Payroll'" />
          <Deducation v-if="sideTabActive === 'Deducation dan Allowance'" />
          <Cuti
            v-if="sideTabActive === 'cuti' || 'off'"
            :tab_active="sideTabActive"
          />
        </section>
      </section>
    </section>
  </LayoutAdmin>
</template>

<script>
import LayoutAdmin from "../../components/Layout/Admin.vue";
import PersonalDetail from "../../components/PersonalDetail.vue";
import Employement from "../../components/Employement.vue";
import Experience from "../../components/Education.vue";
import Rekening from "../../components/Rekening.vue";
import Payroll from "../../components/Payroll.vue";
import Cuti from "../../components/Cuti.vue";
import Deducation from "../../components/Deducation.vue";
import Accordion from "../../components/Accordion.vue";

import Button from "@/components/Button.vue";
export default {
  name: "DetailEmployee",
  components: {
    LayoutAdmin,
    Button,
    PersonalDetail,
    Employement,
    Experience,
    Rekening,
    Payroll,
    Accordion,
    Cuti,
    Deducation,
  },
  data() {
    return {
      contents: [
        {
          text: "Payrun",
          to: "/payroll-run",
        },
        { text: "Payslip", to: "/payroll-slip" },
        { text: "Summary", to: "/payroll-summary" },
        { text: "Beneficiary badge", to: "/payroll-beneficiary" },
      ],
      titleTabs: [
        "Personal Detail",
        "Employment",
        "Pendidikan dan Pengalaman",
        "Rekening",
        "Payroll",
        "Deducation dan Allowance",
      ],
      isOpenAccordion: false,
      sideTabActive: "Deducation",
    };
  },
};
</script>

<style scoped>
</style>
        <!-- <Accordion headerClass="bg-primary px-2 rounded-md w-max">
          <template v-slot:header>
            <Button class="py-1.5 mr-2"> Actions</Button>
          </template>
          <template v-slot:content>
            <p
              class="mt-2 text-sm"
              v-for="(content, index) in contents"
              :key="index"
            >
              <router-link :to="`${content.to}`">{{
                content.text
              }}</router-link>
            </p>
          </template>
        </Accordion> -->