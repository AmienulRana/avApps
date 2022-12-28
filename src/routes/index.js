import { createWebHistory, createRouter } from "vue-router";
import Employee from "../pages/Employee/index.vue";
import EmployeeDetail from "../pages/Employee/Detail.vue";
import Login from "../pages/Login.vue";
import NotFound from "../pages/NotFound.vue";
import PayrollNominatif from "../pages/Payroll/nominatif.vue";
import AttadanceDaily from "../pages/Attadance/Daily.vue";
import LeaveRequest from "../pages/LeaveRequest.vue";
import Jabatan from "../pages/Organisasi/Jabatan.vue";

const routes = [
  { path: "/employee", component: Employee },
  { path: "/login", component: Login },
  { path: "/employee/:id", component: EmployeeDetail },
  { path: "/payroll/nominatif", component: PayrollNominatif },
  { path: "/attedance/daily", component: AttadanceDaily },
  { path: "/leave-request", component: LeaveRequest },
  { path: "/organisasi/jabatan", component: Jabatan },
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
