import { useTranslation } from "react-i18next";
import { ContactUs } from "./contact-us";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col mx-auto w-[85%] md:body-width py-[100px] text-center gap-[16px]">
      <p className="text-[12px] leading-[17px] text-salmon">{t("footer")}</p>
      <section id="contact-info">
        <ContactUs className="text-[12px] leading-[17px] text-salmon" />
        <p className="text-[12px] leading-[17px] text-salmon mt-[4px]">
          Instagram{" "}
          <a
            className="underline"
            href="https://www.instagram.com/oslokokeboka/"
            target={"_blank"}
          >
            @oslokokeboka
          </a>
        </p>
      </section>
    </footer>
  );
};
