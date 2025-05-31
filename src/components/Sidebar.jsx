import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sidebarMenu } from "../config/sidebarConfig";
import { RiLogoutBoxLine, RiCloseFill } from "react-icons/ri";
import { IoIosMenu } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { usuario, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const rol = usuario?.rol;

  const menuItems = sidebarMenu[rol] || [];

  const languages = [
    { code: "es", label: "Español" },
    { code: "gb", label: "English", langCode: "en" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
  ];

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const getSidebarStyles = (rol) => {
    switch (rol) {
      case "admin":
        return {
          sidebar: "bg-[#13395e]",
          side: "bg-[#13395e]",
          sid: "bg-blue-950",
          hover: "hover:bg-gradient-to-r from-sky-800 to-sky-950",
          text: "text-white",
          button: "bg-sky-700",
          icon: "text-[#5AD0FF]",
          active: "bg-gradient-to-r from-sky-800 to-sky-950",
        };
      case "auditor_interno":
        return {
          sidebar: "bg-cyan-700",
          hover: "hover:bg-gradient-to-r from-cyan-600 to-cyan-900",
          text: "text-white",
          button: "bg-cyan-800",
          icon: "text-[#5AD0FF]",
          side: "bg-cyan-700",
          sid: "bg-cyan-900",
          active: "bg-gradient-to-r from-cyan-600 to-cyan-900",
        };
      case "auditor_externo":
        return {
          sidebar: "bg-sky-800",
          hover: "hover:bg-gradient-to-r from-sky-700 to-sky-900",
          text: "text-white",
          button: "bg-sky-900",
          icon: "text-[#52DAFF]",
          side: "bg-sky-800",
          sid: "bg-sky-700",
          active: "bg-gradient-to-r from-sky-700 to-sky-900",
        };
    }
  };

  const colors = getSidebarStyles(rol);

  return (
    <>
      <div className="flex">
        <div
          className={`relative transition-all duration-300 z-50 
          ${collapsed ? "w-20" : "w-64"} ${colors.side}`}
        >
          {/* Perfil */}
          <div
            className={`flex flex-col items-center justify-center p-4 gap-2 h-[30vh] relative ${colors.sidebar}`}
          >
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`absolute top-2 ${colors.button} p-1 rounded-full text-white text-xl`}
            >
              {collapsed ? <IoIosMenu /> : <RiCloseFill />}
            </button>
            <img
              src="profile.png"
              className={`${
                collapsed ? "w-12 h-12" : "w-16 h-16"
              } object-cover bg-white rounded-full ring-2 ring-gray-400`}
              alt="Perfil"
            />
            {!collapsed && (
              <h1
                className={`${colors.text} text-sm font-bold text-center break-words w-full overflow-hidden text-ellipsis whitespace-nowrap`}
              >
                {usuario?.email}
              </h1>
            )}
          </div>

          {/* Nav */}
          <div
            className={`p-4 rounded-tr-[50px] h-[70vh] flex flex-col justify-between gap-8 ${colors.sid}`}
          >
            <nav className="flex flex-col gap-6 ">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                flex items-center gap-4
                py-2 px-3 rounded-xl 
                transition-all duration-500 ease-in-out transform
                ${colors.text} 
                ${
                  isActive
                    ? `${colors.active} scale-[0.99] shadow-inner`
                    : `${colors.hover} hover:scale-[0.98] hover:shadow-md`
                }
              `}
                  >
                    <item.icon
                      className={`text-xl ${
                        isActive ? "text-inherit" : colors.icon
                      }`}
                    />
                    {!collapsed && t(`sidebar.${item.label}`)}
                  </Link>
                );
              })}
            </nav>

            <nav className="flex flex-col gap-6">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-4 ${colors.text} py-2 px-3 rounded-xl transition-all duration-300 ${colors.hover} hover:shadow-xl`}
              >
                <MdLanguage className={`text-2xl ${colors.icon}`} />
                {!collapsed && t("sidebar.language")}
              </button>

              {showLangMenu && (
                <div className="absolute bottom-32 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-1 text-sm text-gray-700">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button
                          onClick={() =>
                            handleChangeLanguage(lang.langCode || lang.code)
                          }
                          className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                        >
                          <span className={`fi fi-${lang.code} mr-2`}></span>{" "}
                          {lang.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={logout}
                className={`flex items-center gap-4 ${colors.text} py-2 px-3 rounded-xl transition-all duration-300 ${colors.hover} hover:shadow-xl`}
              >
                <RiLogoutBoxLine className={`text-xl ${colors.icon}`} />
                {!collapsed && t("sidebar.logout")}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
