import { Link, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  const infoComponents = [
    {
      id: "what-are-we-looking-for",
      imgSrc: "images/food/pumpkin.png",
      imgAlt: "pumpkin",
    },
    {
      id: "why-are-we-doing-this",
      imgSrc: "images/food/tuna.png",
      imgAlt: "tuna",
    },
  ];

  return (
    <div className="flex flex-col gap-[52px] w-full md:w-[85%] md:max-w-[750px] md:mx-auto">
      <h1 className="text-salmon self-center">OSLO KOKEBOKA</h1>
      <section
        className="flex flex-col px-home gap-[30px]"
        id="what-is-kokeboka"
      >
        <h2
          className="text-paper french-title text-center"
          dangerouslySetInnerHTML={{
            __html: t("what-is-kokeboka", {
              interpolation: { hei: "HALLO", escapeValue: false },
            }),
          }}
        />
        <div className="flex flex-col md:flex-row gap-2 md:justify-center items-center">
          <Link to={"/create-recipe/0"} className="orange-button w-fit">
            {t("submit-your-recipe")}
          </Link>
          <Link to={"/recipes"} className="orange-button bg-paper w-fit">
            {t("explore-recipes")}
          </Link>
        </div>
      </section>
      <div className="flex gap-[20px] px-home overflow-x-scroll scrollbar-hide md:justify-center">
        {infoComponents.map((el, index) => (
          <section
            className="flex flex-col gap-[30px] md:w-[50%] md:max-w-[260px] data-[el=0]:pl-home data-[el=1]:pr-home"
            id={el.id}
            key={`info-${el.id}`}
            data-el={index}
          >
            <h2 className="h-[64px] text-paper">{t(`${el.id}-header`)}</h2>
            <img
              className="min-w-[260px] max-w-[260px] h-[305px]"
              src={el.imgSrc}
              alt={el.imgAlt}
            />
            <p className="text-paper text-[12px] leading-[17px]">
              {t(`${el.id}-text`)}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
