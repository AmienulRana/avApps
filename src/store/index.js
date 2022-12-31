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
    changeIsLoggedIn(state, payload) {
      state.isLoggedIn = payload;
    },
  },
  actions: {},
});

export default store;
