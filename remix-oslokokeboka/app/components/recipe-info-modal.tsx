import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const info = [
  {
    listTitle: "the-story",
    headerTitle: "header-the-story",
  },
  {
    listTitle: "recipe",
    headerTitle: "header-recipe",
  },
  {
    listTitle: "categorize",
    headerTitle: "header-categorize",
  },
  {
    listTitle: "your-deets",
    headerTitle: "header-your-deets",
  },
];

const RenderInfoOverlay = ({}) => {
  const location = useLocation();

  const renderInfoOverlay = location.pathname === "/create-recipe/0";

  if (!renderInfoOverlay) {
    return <></>;
  }

  const [closeInfoOverlay, setCloseInfoOverlay] = useState(false);

  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    const y = window.scrollY;
    setScrollY(y);
  };

  useEffect(() => {
    if (typeof window == undefined) {
      return;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setScrollY]);

  const middle = `${scrollY}px`;

  const { t } = useTranslation("recipe-info-modal");
  const [currentElIndex, setCurrentElIndex] = useState(0);

  const style = {
    "--middle": middle,
  } as React.CSSProperties;

  if (closeInfoOverlay) {
    return <></>;
  }

  return (
    <section
      id="recipe-info"
      style={style}
      className="text-white absolute z-30 w-[85%] max-w-[550px] bg-ochre rounded-lg flex flex-col gap-4 pl-5 py-4"
    >
      <h4 className="md:whitespace-nowrap w-full pr-5">{t("intro-header")}</h4>
      <ul
        data-scroll
        style={{ "--move-to": currentElIndex } as React.CSSProperties}
        className="w-full flex gap-3 overflow-x scrollbar-hide"
      >
        {info.map((el, index) => {
          const isCurrentEl = currentElIndex === index;
          const isFirst = index === 0;

          return (
            <li
              key={index}
              className={`flex flex-col min-w-[200px] h-[200px] rounded-lg bg-darkestwine ${
                !isCurrentEl ? "opacity-80" : ""
              }`}
            >
              <button
                className="flex flex-col h-full w-full items-start"
                onClick={() => setCurrentElIndex(index)}
              >
                <div className="w-full flex gap-2 pl-5 pt-5 overflow-visible">
                  {isFirst ? (
                    <>
                      <span className="form-indicator w-[70%] bg-salmon" />
                      <span className="form-indicator w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="form-indicator w-[15%]" />
                      <span className="form-indicator w-[85%] bg-salmon" />
                    </>
                  )}
                </div>
                <h3
                  className={`${
                    isFirst ? "pl-5" : "pl-[55px]"
                  } fuzzy mt-3 text-[22px] text-salmon`}
                >
                  {t(el.listTitle)}
                </h3>
              </button>
            </li>
          );
        })}
      </ul>
      <ul className="flex gap-2">
        {info.map((el, index) => {
          const isCurrentEl = currentElIndex === index;

          return (
            <button
              key={index}
              className={`rounded-full h-4 w-4 ${
                isCurrentEl ? "bg-darkestwine" : "bg-paper"
              }`}
              onClick={() => setCurrentElIndex(index)}
            />
          );
        })}
      </ul>
      <h2 className="fuzzy md:w-[75%] !text-[35px] text-darkwine">
        {t(info[currentElIndex].headerTitle)}
      </h2>
      <button
        onClick={() => setCloseInfoOverlay(true)}
        className="bg-paper rounded-full fuzzy w-fit !text-[19px] text-darkestwine py-4 px-6"
      >
        {t("get-started")}
      </button>
    </section>
  );
};

export default RenderInfoOverlay;
