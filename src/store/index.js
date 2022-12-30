import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      sidebarMenuActive: "",
      isLoggedIn: false,
    };
  },
  mutations: {
    changeSidebarMenu(state, payload) {
      state.sidebarMenuActive = payload;
    },
    changeIsLoggedIn(state) {
      state.isLoggedIn = true;
    },
  },
  actions: {},
});

export default store;
