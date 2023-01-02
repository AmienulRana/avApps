import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      sidebarMenuActive: "",
      isLoggedIn: false,
      file: null,
    };
  },
  mutations: {
    changeSidebarMenu(state, payload) {
      state.sidebarMenuActive = payload;
    },
    changeIsLoggedIn(state, payload) {
      state.isLoggedIn = payload;
    },
    setFile(state, payload) {
      state.file = payload;
    },
    unSetFile(state) {
      state.file = null;
    },
  },
  actions: {},
});

export default store;
