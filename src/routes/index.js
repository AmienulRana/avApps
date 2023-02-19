import { createWebHistory, createRouter } from "vue-router";
import Employee from "../pages/Employee/index.vue";
import EmployeeDetail from "../pages/Employee/Detail.vue";
import EmployeeStatus from "../pages/Employee/Status.vue";
import EmployeeWarning from "../pages/Employee/Warning.vue";
import Login from "../pages/Login.vue";
import NotFound from "../pages/NotFound.vue";
import PayrollNominatif from "../pages/Payroll/nominatif.vue";
import AttadanceDaily from "../pages/Attadance/Daily.vue";
import AttendanceDetail from "../pages/Attadance/Detail.vue";
import SettingWorkShift from "../pages/Attadance/SettingWorkshift.vue";
import SettingCuti from "../pages/Attadance/SettingCuti.vue";
import AppSetting from "../pages/Setting/AppSetting.vue";
import LeaveRequest from "../pages/LeaveRequest.vue";
import OvertimeRequest from "../pages/Pengajuan/OvertimeRequest.vue";
import OutsideAssignment from "../pages/Pengajuan/OutsideAssignment.vue";
import ChangeWorkShift from "../pages/Pengajuan/ChangeWorkShift.vue";
import ChangeOffDay from "../pages/Pengajuan/ChangeOffDay.vue";
import Jabatan from "../pages/Organisasi/Jabatan.vue";
import AllowDeduc from "../pages/Setting/AllowDeduc.vue";
import Departement from "../pages/Organisasi/Departement.vue";
import Holiday from "../pages/Administration/Holiday.vue";
import Announcement from "../pages/Administration/Announcement.vue";
import Home from "../pages/Home.vue";
import Periodic from "../pages/Setting/Periodic.vue";
import Location from "../pages/Setting/Location.vue";
import LeaveSetting from "../pages/Setting/LeaveSetting.vue";
import NeedApproval from "../pages/Pengajuan/NeedApproval.vue";
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
  {
    path: "/employee-status",
    component: EmployeeStatus,
    beforeEnter: requiredAuth,
  },
  {
    path: "/employee-warning",
    component: EmployeeWarning,
    beforeEnter: requiredAuth,
  },
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
    path: "/attedance/setting-workshift",
    component: SettingWorkShift,
    beforeEnter: requiredAuth,
  },
  {
    path: "/attedance/setting-cuti",
    component: SettingCuti,
    beforeEnter: requiredAuth,
  },
  {
    path: "/attedance/detail",
    component: AttendanceDetail,
    beforeEnter: requiredAuth,
  },
  {
    path: "/leave-request",
    component: LeaveRequest,
    beforeEnter: requiredAuth,
  },
  {
    path: "/overtime-request",
    component: OvertimeRequest,
    beforeEnter: requiredAuth,
  },
  {
    path: "/outside-assignment",
    component: OutsideAssignment,
    beforeEnter: requiredAuth,
  },
  {
    path: "/change-shift",
    component: ChangeWorkShift,
    beforeEnter: requiredAuth,
  },
  {
    path: "/change-off",
    component: ChangeOffDay,
    beforeEnter: requiredAuth,
  },
  {
    path: "/need-approval",
    component: NeedApproval,
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
    path: "/setting/allowance-deduction",
    component: AllowDeduc,
    beforeEnter: requiredAuth,
  },
  {
    path: "/setting/periodic",
    component: Periodic,
    beforeEnter: requiredAuth,
  },
  {
    path: "/setting/location",
    component: Location,
    beforeEnter: requiredAuth,
  },
  {
    path: "/setting/leave",
    component: LeaveSetting,
    beforeEnter: requiredAuth,
  },
  {
    path: "/setting/app",
    component: AppSetting,
    beforeEnter: requiredAuth,
  },
  {
    path: "/administration/holiday",
    component: Holiday,
    beforeEnter: requiredAuth,
  },
  {
    path: "/administration/announcements",
    component: Announcement,
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
