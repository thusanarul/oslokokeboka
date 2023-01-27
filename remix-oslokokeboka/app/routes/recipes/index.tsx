import { useTranslation } from "react-i18next";

export let handle = {
  i18n: "recipes",
};

export default function RecipesIndex() {
  const { t } = useTranslation("recipes");

  return (
    <div className="w-[85%] md:body-width flex flex-col mx-auto gap-[40px]">
      <header className="flex flex-col gap-2">
        <h1 className="fuzzy text-paper">{t("header")}</h1>
        <p>{t("ingress")}</p>
      </header>
      <section className="self-center" id="under-construction">
        <div className="bg-rectangle w-[335px] max-w-[335px] h-[651px] pt-[30px] px-[20px] flex flex-col gap-[20px] justify-start place-items-center">
          <h2 className="text-purple text-center">
            {t("construction-header")}
          </h2>
          <img
            className="max-w-[161px] h-[130px]"
            src="images/food/onion.png"
            alt="Onion"
          ></img>
          <p className="text-purple">{t("construction-text")}</p>
          <p className="text-purple">
            {t("construction-suggestion")}{" "}
            <a className="underline" href="mailto:info@oslokokeboka.no">
              info@oslokokeboka.no
            </a>
          </p>
          <p className="text-purple text-[12px] leading-[17px]">
            {t("construction-asterix")}
          </p>
        </div>
      </section>
    </div>
  );
}
