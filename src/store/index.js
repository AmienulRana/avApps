import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      sidebarMenuActive: "",
      isLoggedIn: false,
      file: null,
      token: null,
      currentPage: 1,
      filter: {
        employment_status: "",
        designation: "",
        departement: "",
        workshifts: "",
        role: "",
      },
    };
  },
  mutations: {
    changeSidebarMenu(state, payload) {
      state.sidebarMenuActive = payload;
    },
    changeIsLoggedIn(state, payload) {
      state.isLoggedIn = payload;
    },
    changeCurrentPage(state, payload) {
      state.currentPage = payload;
    },
    setFile(state, payload) {
      state.file = payload;
    },
    unSetFile(state) {
      state.file = null;
    },
    setToken(state, payload) {
      state.token = payload;
    },
    setValueFilter(state, payload) {
      state.filter = { ...payload };
    },
  },
  actions: {},
});

export default store;
