import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/index.css";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faBars,
  faBriefcase,
  faCalendar,
  faChevronUp,
  faClock,
  faCreditCard,
  faExpand,
  faGear,
  faMagnifyingGlass,
  faMoon,
  faTable,
  faUsers,
  faUserTie,
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
  faGear
);

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
