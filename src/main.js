import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "./assets/styles/index.css";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

/* import specific icons */
import {
  faBars,
  faBriefcase,
  faCalendar,
  faChevronUp,
  faClock,
  faCreditCard,
  faDollar,
  faEllipsis,
  faExpand,
  faGear,
  faMagnifyingGlass,
  faMoon,
  faTable,
  faUser,
  faUsers,
  faUserTie,
  faLock,
  faPencil,
  faXmark,
  faTrashAlt,
  faFile,
  faHomeAlt,
  faCheck,
  faGraduationCap,
  faCloudArrowUp,
  faPenToSquare,
  faCameraAlt,
  faUserXmark,
  faRightFromBracket,
  faEye,
  faPaperPlane,
  faEyeSlash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
  faUsers,
  faUserTie,
  faChevronUp,
  faExpand,
  faMoon,
  faBars,
  faTable,
  faMagnifyingGlass,
  faClock,
  faCalendar,
  faCreditCard,
  faBriefcase,
  faGear,
  faEllipsis,
  faDollar,
  faUser,
  faLock,
  faPencil,
  faXmark,
  faTrashAlt,
  faFile,
  faHomeAlt,
  faCheck,
  faGraduationCap,
  faCreditCard,
  faCloudArrowUp,
  faPenToSquare,
  faCameraAlt,
  faUserXmark,
  faRightFromBracket,
  faEye,
  faPaperPlane,
  faEyeSlash,
  faPlus
);

createApp(App)
  .use(router)
  .use(Toast)
  .use(store)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
