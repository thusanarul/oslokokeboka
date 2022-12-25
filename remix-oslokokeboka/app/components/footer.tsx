import { useTranslation } from "react-i18next";
import { ContactUs } from "./contact-us";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col mx-auto w-[85%] my-[100px] text-center gap-[16px]">
      <p className="text-[12px] leading-[17px] text-pink">{t("footer")}</p>
      <section id="contact-info">
        <ContactUs className="text-[12px] leading-[17px] text-pink" />
        <p className="text-[12px] leading-[17px] text-pink">
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
