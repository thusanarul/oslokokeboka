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
    <div className="flex flex-col gap-[52px] w-full md:w-[85%] md:max-w-[850px] md:mx-auto">
      <h2 className="fuzzy text-salmon self-center">OSLO KOKEBOKA</h2>
      <section
        className="flex flex-col px-home gap-[30px]"
        id="what-is-kokeboka"
      >
        <h1
          className="text-paper fuzzy text-center"
          dangerouslySetInnerHTML={{
            __html: t("what-is-kokeboka"),
          }}
        />
        <div className="flex flex-col md:flex-row gap-2 md:justify-center items-center">
          <Link to={"/create-recipe/0"} className="fuzzy orange-button w-fit">
            {t("submit-your-recipe")}
          </Link>
          <Link to={"/recipes"} className="fuzzy orange-button bg-paper w-fit">
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
            <h2 className="h-[64px] fuzzy text-paper text-center">
              {t(`${el.id}-header`)}
            </h2>
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
