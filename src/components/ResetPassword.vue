<template>
  <section class="mt-8 px-4">
    <h1>Reset Password :</h1>
    <div class="mb-5 relative">
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter Your Password"
          class="w-full border mt-2 outline-gray-600 focus:outline focus:outline-primary px-2 py-1.5 bg-white rounded"
          v-model="password"
          @keyup="detectCapsLock"
        />
        <font-awesome-icon
          v-if="showPassword"
          @click="showPassword = false"
          icon="fa-eye"
          class="text-gray-400 absolute right-4 top-[50%] -translate-y-[25%]"
        />
        <font-awesome-icon
          v-else
          @click="showPassword = true"
          icon="fa-eye-slash"
          class="text-gray-400 absolute right-4 top-[50%] -translate-y-[25%]"
        />
      </div>
      <p v-if="error" class="text-red-500 text-sm mt-2">
        Minimum Password Must be > 6
      </p>
      <div
        class="tooltip absolute inset-x-0 top-full duration-300 z-10 mt-2 px-2 py-1 bg-gray-400 text-gray-100 text-sm rounded w-[150px] text-center"
        :class="capslockOn ? 'opacity-100' : 'opacity-0'"
      >
        Caps Lock is On!
      </div>
    </div>
    <div class="flex justify-end w-full">
      <Button
        class="bg-primary text-white w-24 text-sm rounded py-2"
        @click="handleShowModal"
      >
        Save
      </Button>
    </div>
    <Modal
      modalClass="md:w-1/2 md:h-96"
      :showModal="showModal"
      @close="showModal = false"
    >
      <section class="text-center mb-6">
        <img
          src="@/assets/icons/warning.svg"
          alt="warning-icon"
          class="block m-auto"
        />
        <h1 class="text-xl">
          Are You Sure to Reset Password Employment
          <span class="text-primary font-bold">"{{ employment }}"</span>???
        </h1>
        <section class="flex w-full justify-center mt-4">
          <Button
            class="bg-gray-400 w-24 py-2 mr-4 text-white rounded-md"
            @click="showModal = ''"
          >
            Cancel
          </Button>
          <Button
            class="bg-red-500 w-24 py-2 text-white rounded-md"
            @click="handleResetPassword"
            :disabled="loading"
          >
            Yes, Sure
          </Button>
        </section>
      </section>
    </Modal>
  </section>
</template>

<script>
import Button from "./Button.vue";
import { ResetPasswordAPI } from "@/actions/employment";
import Modal from "@/components/Modal.vue";
import { useToast } from "vue-toastification";

export default {
  name: "BankComponent",
  components: { Button, Modal },
  props: { employment: String },
  data() {
    return {
      edit: false,
      loading: false,
      password: "",
      showPassword: false,
      capslockOn: false,
      showModal: false,
      error: false,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    detectCapsLock(event) {
      this.capslockOn =
        event.getModifierState && event.getModifierState("CapsLock");
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
    handleShowModal() {
      if (this.password.length < 6) {
        this.error = true;
      } else {
        this.showModal = true;
        this.error = false;
      }
    },
    async handleResetPassword() {
      this.loading = true;
      const id = this.$route.params.id;
      const response = await ResetPasswordAPI(id, { password: this.password });
      if (response?.status === 401) {
        this.$router.push("/login");
        this.$store.commit("changeIsLoggedIn", false);
      }
      if (response?.status === 200) {
        this.password = "";
        this.showModal = false;
      }
      this.loading = false;
      this.showMessageStatus(response);
    },
  },
};
</script>

<style scoped>
.tooltip::before {
  content: "";
  display: block;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px;
  border-style: solid;
  border-color: transparent transparent #979797 transparent;
}
</style>
