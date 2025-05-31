import React from "react";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { GiCycle } from "react-icons/gi";
import { FcComboChart } from "react-icons/fc";
import { FaUsersCog } from "react-icons/fa";
import { TbWorldCog } from "react-icons/tb";
import { PiWarningFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  return (
    <section id="services" className="p-8 xl:p-20 bg-[#fffefe]">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black text-[#161236] text-shadow-sm tracking-wide text-center">
          {t("services.title")}
        </h1>
        <p className="text-xl text-gray-500 text-center">
          {t("services.subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <HiClipboardDocumentList className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            {t("services.cards.0.title")}
          </p>
          <p className="font-semibold text-[#161236]">
            {t("services.cards.0.subtitle")}
          </p>
          <p>{t("services.cards.0.description")}</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <GiCycle className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            {t("services.cards.1.title")}
          </p>
          <p className="font-semibold text-[#161236]">
            {t("services.cards.1.subtitle")}
          </p>
          <p>{t("services.cards.1.description")}</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <FcComboChart className="text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            {t("services.cards.2.title")}
          </p>
          <p className="font-semibold text-[#161236]">
            {t("services.cards.2.subtitle")}
          </p>
          <p>{t("services.cards.2.description")}</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <FaUsersCog className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            {t("services.cards.3.title")}
          </p>
          <p className="font-semibold text-[#161236]">
            {t("services.cards.3.subtitle")}
          </p>
          <p>{t("services.cards.3.description")}</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <TbWorldCog className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            {t("services.cards.4.title")}
          </p>
          <p className="font-semibold text-[#161236]">
            {t("services.cards.4.subtitle")}
          </p>
          <p>{t("services.cards.4.description")}</p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <PiWarningFill className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            {t("services.cards.5.title")}
          </p>
          <p className="font-semibold text-[#161236]">
            {t("services.cards.5.subtitle")}
          </p>
          <p>{t("services.cards.5.description")}</p>
        </div>
      </div>
    </section>
  );
};

export default Services;
