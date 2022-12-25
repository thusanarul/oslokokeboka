import { useTranslation } from "react-i18next";

export const ContactUs = ({
  className,
}: {
  className?: string | undefined;
}) => {
  const { t } = useTranslation();

  return (
    <p className={className}>
      {t("contact-us")}{" "}
      <a className="underline" href="mailto:info@oslokokeboka.no">
        info@oslokokeboka.no
      </a>
    </p>
  );
};
