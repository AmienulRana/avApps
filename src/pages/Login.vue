<template>
  <section class="min-h-screen md:grid grid-cols-8">
    <section
      class="min-h-screen hidden md:block relative lg:col-span-5 md:col-span-4"
    >
      <img
        :src="'images/Background_Login.png'"
        class="h-full w-full"
        :alt="urlImageAlt"
        cache
      />
      <div class="absolute top-10 left-12">
        <img
          :src="'/images/av_hrs_putih.png'"
          :alt="altImageLogo"
          class="lg:w-40 md:w-28"
          cache
        />
        <h1 class="text-white font-bold mt-2 text italic lg:text-xl">
          Manage Attadance, leave and payroll.
        </h1>
      </div>
    </section>
    <section
      class="flex flex-col justify-center py-5 md:py-0 px-10 md:px-14 lg:px-20 min-h-screen lg:col-span-3 md:col-span-4"
    >
      <div class="px-4 py-1 mt-10 rounded w-full">
        <img src="../assets/av_hrs.png" class="w-26 h-12 block m-auto" />
      </div>
      <p class="text-center md:my-8 my-4 opacity-70">
        Hai! <br />
        Login to your dashboard
      </p>
      <div class="mb-5">
        <Select
          label="Login as"
          class="flex-col"
          label_class="w-full mb-2 text-gray-400"
          :options="['Admin Group', 'App Admin', 'Employee']"
          @change="changeAccount($event)"
        />
      </div>
      <div class="mb-5">
        <label class="text-sm text-gray-400">Email</label>
        <input
          type="text"
          placeholder="Enter Your Email"
          class="w-full mt-2 border outline-gray-600 focus:outline focus:outline-primary px-2 py-1.5 bg-white rounded"
          autofocus
          v-model="email"
        />
      </div>
      <div class="mb-5">
        <label class="text-sm text-gray-400">Password</label>
        <input
          type="password"
          placeholder="Enter Your Password"
          class="w-full border mt-2 outline-gray-600 focus:outline focus:outline-primary px-2 py-1.5 bg-white rounded"
          v-model="password"
        />
      </div>
      <Button
        class="bg-dodgerblue mb-2.5 text-white py-2 text-sm rounded-sm"
        @click="handleLoginCompany"
        :disabled="loading"
      >
        <Loading dotColor="white" class="py-1" v-if="loading" />
        <template v-else>Login</template>
      </Button>
      <!-- <Button class="bg-gray-400 text-white py-2 rounded-sm text-sm"
        >Register
      </Button> -->
      <div class="flex justify-between mt-3">
        <div>
          <input type="checkbox" class="mr-2" />
          <label class="text-sm">Remember me</label>
        </div>
        <router-link
          to="/forgot-password"
          class="text-dodgerblue underline text-sm"
          ><font-awesome-icon icon="fa-lock" class="mr-2" />Forgot
          password</router-link
        >
      </div>
      <p class="text-gray-400 text-center mt-8 mb-5 text-sm">
        Copyright Ⓒ {{ new Date().getFullYear() }} by ArmadaVision
      </p>
    </section>
  </section>
</template>

<script>
import Button from "../components/Button.vue";
import { LoginSuperAPI, LoginAdminAPI } from "@/actions/login";
import Select from "@/components/Select/index.vue";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "@/config";
import Loading from "@/components/Loading.vue";
import { useToast } from "vue-toastification";

export default {
  name: "LoginPage",
  components: { Button, Select, Loading },
  data() {
    return {
      altImageLogo: "Logo avapps",
      urlImageAlt: "Backgound Login Image",
      login_as: "",
      email: "",
      password: "",
      loading: false,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    changeAccount(role) {
      this.login_as = role;
      if (role === "Admin Group") {
        this.email = "superadmin@demo.com";
        this.password = "superAdmin123";
      } else if (role === "App Admin") {
        this.email = "armadavision@test.com";
        this.password = "armadaVision123";
      }
    },
    encrypt(token) {
      const secret_key = SECRET_KEY;
      const ciphertext = CryptoJS.AES.encrypt(token, secret_key);
      return ciphertext.toString();
    },
    validationResponse(response) {
      if (response.status === 200) {
        const { token } = response?.data;
        const encryptedToken = this.encrypt(token);
        this.$store.state.isLoggedIn = true;
        this.toast.success(response?.data?.message);
        this.$store.commit("setToken", token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("token", encryptedToken);
        this.$router.push("/");
      } else {
        if (response.data.message) {
          this.toast.error(response?.data?.message);
        }
        this.loading = false;
      }
    },
    async handleLoginCompany() {
      this.loading = true;
      const { email, password } = this;
      if (!this.login_as) {
        return alert("Select role to Login");
      }
      if (this.login_as === "Admin Group") {
        const response = await LoginSuperAPI({ email, password });
        this.validationResponse(response);
      } else if (this.login_as === "App Admin") {
        const response = await LoginAdminAPI({ email, password });
        this.validationResponse(response);
      }
    },
  },
};
</script>

<style scoped></style>
