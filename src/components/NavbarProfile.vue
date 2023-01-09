<template>
  <div class="relative inline-block text-left">
    <button
      @click.stop="$emit('click', showDropdown ? false : true)"
      class="focus:outline-none focus:shadow-outline border-l pl-4 ml-2"
    >
      <span
        class="rounded-full min-w-max w-36 justify-between flex items-center mx-2"
      >
        <div>
          <p class="text-gray-900 leading-none">{{ profile.name }}</p>
          <p class="text-gray-400 leading-none text-sm">App Admin</p>
        </div>
        <img
          :src="profile.avatar"
          alt="Profile Picture"
          class="w-12 h-12 object-cover rounded-full"
        />
      </span>
    </button>
    <div
      class="origin-top-right absolute right-0 top-full mt-4 w-48 rounded-md shadow-lg"
      v-if="showDropdown"
    >
      <div class="py-1 rounded-md bg-white shadow-xs">
        <button class="text-start px-4 py-3 w-full text-sm">
          <font-awesome-icon icon="fa-user" class="mr-2" />
          My Profile
        </button>
        <button class="text-start px-4 py-3 w-full text-sm">
          <font-awesome-icon icon="fa-gear" class="mr-2" />
          Setting
        </button>
        <button
          class="text-start px-4 py-3 w-full text-sm"
          @click="handleLogout"
        >
          <font-awesome-icon
            icon="fa-right-from-bracket"
            class="mr-2 -rotate-180"
          />
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { showDropdown: Boolean },
  data() {
    return {
      profile: {
        avatar: "https://via.placeholder.com/50x50",
        name: "John Doe",
      },
    };
  },
  emits: ["click"],
  methods: {
    handleLogout() {
      this.$store.commit("changeIsLoggedIn", false);
      this.$store.commit("setToken", undefined);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/*
    Menambahkan triangle pointer pada dropdown
  */

.origin-top-right button:hover {
  background: rgb(248, 248, 248);
  color: #1976d3;
}
</style>
