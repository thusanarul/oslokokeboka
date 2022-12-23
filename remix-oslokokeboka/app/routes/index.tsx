import { useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { images } from "~/utils/title-images";

export default function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="h-full justify-center flex flex-col gap-[52px] w-[85%] max-w-[600px] mx-auto">
      <section id="what-is-kokeboka">
        <h2 className="text-paper">{t("what-is-kokeboka")}</h2>
      </section>
      <div className="flex mx-auto justify-start w-full">
        <button
          onClick={() => {
            navigate("/create-recipe/0");
          }}
          className="orange-button"
        >
          {t("submit-your-recipe")}
        </button>
      </div>
    </div>
  );
}
