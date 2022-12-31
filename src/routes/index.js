import { createWebHistory, createRouter } from "vue-router";
import Employee from "../pages/Employee/index.vue";
import EmployeeDetail from "../pages/Employee/Detail.vue";
import Login from "../pages/Login.vue";
import NotFound from "../pages/NotFound.vue";
import PayrollNominatif from "../pages/Payroll/nominatif.vue";
import AttadanceDaily from "../pages/Attadance/Daily.vue";
import LeaveRequest from "../pages/LeaveRequest.vue";
import Jabatan from "../pages/Organisasi/Jabatan.vue";
import Departement from "../pages/Organisasi/Departement.vue";
import Home from "../pages/Home.vue";
import store from "../store";

function requiredAuth(to, from, next) {
  const stateIsLoggedIn = store.state.isLoggedIn;
  const localIsLoggedIn = localStorage.getItem("isLoggedIn");
  if (stateIsLoggedIn || localIsLoggedIn) {
    next();
  } else {
    next({ path: "/login" });
  }
}
function notRequiredAuth(to, from, next) {
  const stateIsLoggedIn = store.state.isLoggedIn;
  const localIsLoggedIn = localStorage.getItem("isLoggedIn");
  if (!stateIsLoggedIn || !localIsLoggedIn) {
    next();
  } else {
    next({ path: "/" });
  }
}

const routes = [
  { path: "/", component: Home, beforeEnter: requiredAuth },
  { path: "/employee", component: Employee, beforeEnter: requiredAuth },
  { path: "/login", component: Login, beforeEnter: notRequiredAuth },
  {
    path: "/employee/:id",
    component: EmployeeDetail,
    beforeEnter: requiredAuth,
  },
  {
    path: "/payroll/nominatif",
    component: PayrollNominatif,
    beforeEnter: requiredAuth,
  },
  {
    path: "/attedance/daily",
    component: AttadanceDaily,
    beforeEnter: requiredAuth,
  },
  {
    path: "/leave-request",
    component: LeaveRequest,
    beforeEnter: requiredAuth,
  },
  {
    path: "/organisasi/jabatan",
    component: Jabatan,
    beforeEnter: requiredAuth,
  },
  {
    path: "/organisasi/departemen",
    component: Departement,
    beforeEnter: requiredAuth,
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
    meta: {
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
