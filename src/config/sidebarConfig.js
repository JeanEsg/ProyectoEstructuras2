import {
  RiHome3Line,
  RiFileCopyLine,
  RiWalletLine,
  RiPieChartLine,
  RiUser3Line,
} from "react-icons/ri";

export const sidebarMenu = {
  admin: [
    { label: "home", path: "/index", icon: RiHome3Line },
    { label: "forms", path: "/forms", icon: RiFileCopyLine },
    { label: "create_form", path: "/crear-form", icon: RiPieChartLine },
    { label: "users", path: "/usuarios", icon: RiUser3Line },
  ],
  auditor_interno: [
    { label: "home", path: "/index", icon: RiHome3Line },
    { label: "forms", path: "/forms", icon: RiFileCopyLine },
    { label: "action_plan", path: "/plan-action", icon: RiWalletLine },
  ],
  auditor_externo: [
    { label: "home", path: "/index", icon: RiHome3Line },
    { label: "action_plan", path: "/PlanesExterno", icon: RiWalletLine },
  ],
};
