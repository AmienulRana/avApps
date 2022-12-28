<template>
  <section class="min-h-screen grid grid-cols-8">
    <section
      class="min-h-screen hidden md:block relative lg:col-span-6 md:col-span-5"
    >
      <img
        :src="'images/Background_Login.png'"
        class="h-screen w-full"
        :alt="urlImageAlt"
        cache
      />
      <div class="absolute top-10 left-12">
        <img
          :src="'/images/av_hrs_putih.png'"
          :alt="altImageLogo"
          class="w-40"
          cache
        />
        <h1 class="text-white font-bold mt-2 text italic text-xl">
          Manage Attadance, leave and payroll.
        </h1>
      </div>
    </section>
    <section
      class="flex flex-col justify-center px-8 min-h-screen lg:col-span-2 md:col-span-3"
    >
      <div class="px-4 py-1 rounded w-full">
        <img src="../assets/av_hrs.png" class="w-26 h-12 block m-auto" />
      </div>
      <p class="text-center my-8 opacity-70">
        Hai! <br />
        Login to your dashboard
      </p>
      <div class="mb-5">
        <label class="text-sm text-gray-400">Email</label>
        <input
          type="text"
          placeholder="Enter Your Email"
          class="w-full mt-2 border outline-gray-600 focus:outline focus:outline-primary px-2 py-1.5 bg-white rounded"
          autofocus
        />
      </div>
      <div class="mb-5">
        <label class="text-sm text-gray-400">Password</label>
        <input
          type="password"
          placeholder="Enter Your Password"
          class="w-full border mt-2 outline-gray-600 focus:outline focus:outline-primary px-2 py-1.5 bg-white rounded"
        />
      </div>
      <Button class="bg-dodgerblue mb-2.5 text-white py-2 text-sm rounded-sm">
        Login
      </Button>
      <Button class="bg-gray-400 text-white py-2 rounded-sm text-sm"
        >Register
      </Button>
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
      <p class="text-gray-400 text-center mt-8 text-sm">
        Copyright Ⓒ 2022 by ArmadaVision
      </p>
    </section>
  </section>
</template>

<script>
import Button from "../components/Button.vue";
export default {
  name: "LoginPage",
  components: { Button },
  data() {
    return {
      altImageLogo: "Logo avapps",
      urlImageAlt: "Backgound Login Image",
    };
  },
};
</script>

<style scoped></style>
