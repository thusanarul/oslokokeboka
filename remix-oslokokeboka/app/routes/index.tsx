import { useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[52px] w-full md:w-[85%] md:max-w-[600px] md:mx-auto">
      <h1 className="text-salmon w-full px-[24px] md:px-0">OSLO KOKEBOKA</h1>
      <section
        className="flex flex-col px-[24px] md:px-0 gap-[30px]"
        id="what-is-kokeboka"
      >
        <h2 className="text-paper">{t("what-is-kokeboka")}</h2>
        <button
          onClick={() => {
            navigate("/create-recipe/0");
          }}
          className="orange-button w-fit"
        >
          {t("submit-your-recipe")}
        </button>
      </section>
      <div className="flex gap-[20px] px-[24px] md:px-0 overflow-x-scroll">
        <section
          className="flex flex-col gap-[30px] md:w-[50%]"
          id="what-are-we-looking-for"
        >
          <h2 className="h-[64px] text-paper">
            {t("what-are-we-looking-for-header")}
          </h2>
          <img
            className="min-w-[260px] h-[305px]"
            src={"images/food/pumpkin.png"}
          />
          <p className="text-paper text-[12px] leading-[17px]">
            {t("what-are-we-looking-for-text")}
          </p>
        </section>
        <section
          className="flex flex-col gap-[30px] md:w-[50%]"
          id="why-are-we-doing-this"
        >
          <h2 className="h-[64px] text-paper">
            {t("why-are-we-doing-this-header")}
          </h2>
          <img
            className="min-w-[260px] h-[305px]"
            src={"images/food/tuna.png"}
          />
          <p className="text-paper text-[12px] leading-[17px]">
            {t("why-are-we-doing-this-text")}
          </p>
        </section>
      </div>
    </div>
  );
}
