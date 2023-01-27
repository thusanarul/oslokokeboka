import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  const infoComponents = [
    {
      id: "why-are-we-doing-this",
      imgSrc: "images/food/blue-kitchen.png",
      imgAlt: "pumpkin",
    },
    {
      id: "what-are-we-looking-for",
      imgSrc: "images/food/pink-dining-room.png",
      imgAlt: "tuna",
    },
  ];

  const [infoBoxVisible, setInfoBoxVisible] = useState<number>(0);

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
        <div className="flex flex-row gap-2 justify-center">
          <Link to={"/create-recipe/0"} className="fuzzy orange-button w-fit">
            {t("submit-your-recipe")}
          </Link>
          <Link to={"/recipes"} className="fuzzy orange-button bg-paper w-fit">
            {t("explore-recipes")}
          </Link>
        </div>
      </section>
      <div className="overflow-x-scroll scrollbar-hide h-[900px] mt-8 px-home">
        <div className="flex md:justify-center">
          {infoComponents.map((el, index) => (
            <section
              className="relative md:data-[el=0]:left-10 data-[visible='true']:z-10 data-[el=1]:right-10 data-[el=1]:top-8 data-[visible='false']:opacity-40 data-[el=1]:pr-home"
              id={el.id}
              key={`info-${el.id}`}
              data-el={index}
              data-visible={index === infoBoxVisible}
              onClick={() => {
                setInfoBoxVisible(index);
              }}
            >
              <h2 className="h-[64px] fuzzy text-paper text-center">
                {t(`${el.id}-header`)}
              </h2>
              <div className="flex flex-col gap-[20px] bg-rectangle w-[335px] max-w-[335px] h-[651px]">
                <img className="pt-7 px-2" alt={el.imgAlt} src={el.imgSrc} />
                <p className="text-darkestwine px-4 pb-8">
                  {t(`${el.id}-text`)}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
