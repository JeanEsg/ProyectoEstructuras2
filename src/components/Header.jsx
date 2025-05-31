import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GiStarsStack } from "react-icons/gi";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed flex items-center justify-between xl:justify-start w-full py-4 px-8 h-[10vh] z-50  ${scrolled
        ? "bg-gradient-to-r from-primary to-secondary text-white"
        : "bg-gradient-to-b from-third to-[#ffffff]"
        } transition-all duration-500`}
    >
      <div className="xl:w-1/6 text-center -mt-4">
        <a
          href="#home"
          className="text-2xl md:text-3xl xl:text-4xl text-shadow-sm font-bold relative p-1"
        >
          Auditorias
          <span
            className={`${scrolled ? "text-white" : "text-primary"
              } text-4xl transition-all duration-500`}
          >
            .
          </span>
          <GiStarsStack
            className={`${scrolled ? "text-white" : "text-primary"
              } absolute bottom-1 -left-6 transition-all duration-500`}
          />
        </a>
      </div>

      <nav
        className={`fixed w-[80%] text-[#161236] font-medium md:w-[40%] xl:w-full h-full 
        bg-white xl:bg-transparent to-[#E8F3FA] 
        ${showMenu ? "left-0" : "-left-full"} ${scrolled ? "xl:text-white xl:text-shadow" : "text-[#161236]"
          } 
        top-0 xl:static flex-1 flex flex-col xl:flex-row 
        items-center justify-center gap-10 transition-all 
        duration-100 z-50`}
      >
        <a href="#home" className="relative inline-block group">
          <span
            className={`transition-colors duration-300 ${scrolled ? "group-hover:text-fourth" : "group-hover:text-primary"
              }`}
          >
            {t("home")}
          </span>
          <span
            className={`absolute left-0 bottom-0 h-0.5 w-0 ${scrolled ? "bg-fourth" : "bg-primary"
              } transition-all duration-500 group-hover:w-full`}
          ></span>
        </a>

        <a href="#services" className="relative inline-block group">
          <span
            className={`transition-colors duration-300 ${scrolled ? "group-hover:text-fourth" : "group-hover:text-primary"
              }`}
          >
            {t("n_services")}
          </span>
          <span
            className={`absolute left-0 bottom-0 h-0.5 w-0 ${scrolled ? "bg-fourth" : "bg-primary"
              } transition-all duration-500 group-hover:w-full`}
          ></span>
        </a>

        <Link to="/login">
          <button
            className={`${scrolled
              ? "bg-primary text-white border-[1px]"
              : "text-primary border-primary"
              } font-semibold px-7 p-2 border-2 rounded-[10px] relative overflow-hidden group`}
          >
            <span
              className={`${scrolled
                ? "scale-x-0 origin-left border-2 border-primary bg-white rounded-[10px] transition-transform duration-500 group-hover:scale-x-100"
                : "w-0 transition-all duration-500 group-hover:w-full"
                } absolute inset-0 bg-primary ease-in-out`}
            ></span>
            <span
              className={`${scrolled ? "group-hover:text-primary" : "group-hover:text-white"
                } relative z-10`}
            >
              {t("login")}
            </span>
          </button>
        </Link>
      </nav>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className={`p-2 rounded-full`}
        >
          <MdLanguage
            className={`${scrolled
              ? "text-white hover:text-primary"
              : "text-primary hover:text-secondary "
              } text-4xl transition-colors duration-300`}
          />
        </button>

        {showLangMenu && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
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
      </div>

      <button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden text-2xl p-2"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Fill />}
      </button>
    </header>
  );
};

export default Header;
