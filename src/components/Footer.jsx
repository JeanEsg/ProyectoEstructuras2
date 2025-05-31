import React from "react";
import { GiStarsStack } from "react-icons/gi";
import { ImWhatsapp, ImGithub } from "react-icons/im";
import { SiGmail } from "react-icons/si";
import { TiSocialLinkedin } from "react-icons/ti";
import { TbCopyright } from "react-icons/tb";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <section id="contact">
      <footer className="bg-[#1E5BAA] p-8 xl:p-20">
        <div className="flex justify-center items-center text-center gap-1 mt-8">
          <TbCopyright className="text-white" />
          <p className="text-white italic">Auditorias 2025 - {t("footer.text1")}</p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
