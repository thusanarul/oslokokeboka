import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  {
    code: "no",
    display: "Norsk",
  },
  {
    code: "en",
    display: "English",
  },
];

export const Header = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const location = useLocation();

  const [pathname, setPathname] = useState("");

  let [hideHome, setHideHome] = useState<boolean>(true);

  const width =
    pathname == "/"
      ? "px-home md:header-width md:mx-auto"
      : "px-home w-[100%] md:[w-85%] md:header-width md:mx-auto";

  const onScroll = () => {
    if (window.scrollY > 50) {
      setHideHome(false);
    } else {
      setHideHome(true);
    }
  };

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  useEffect(() => {
    if (pathname === "/") {
      setHideHome(true);
      window.addEventListener("scroll", onScroll);
    } else {
      setHideHome(false);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <header
      className={`flex items-center justify-between sticky top-0 py-6 mb-4 bg-darkestwine z-20 ${width} `}
    >
      {pathname === "/" ? (
        <p
          className={`fuzzy text-salmon text-center transition-opacity ease-in-out duration-500 leading-[87%] ${
            hideHome && "opacity-0"
          }`}
        >
          Oslo
          <br />
          Kokeboka
        </p>
      ) : (
        <Link
          className={`fuzzy text-salmon text-center transition-opacity ease-in-out duration-500 leading-[87%]`}
          to={"/"}
        >
          Oslo
          <br />
          Kokeboka
        </Link>
      )}

      <section className="w-fit flex" id="language-switch">
        {languages.map((el, i) => {
          const disabled = el.code == lang;
          const last = i == languages.length - 1;

          return (
            <div key={`language-${el.code}`} className="flex">
              <button
                className={`fuzzy text-paper ${disabled && "underline"}`}
                onClick={() => {
                  i18n.changeLanguage(el.code);
                }}
                disabled={disabled}
              >
                {el.display}
              </button>
              {!last && <span className="text-paper mx-1">|</span>}
            </div>
          );
        })}
      </section>
    </header>
  );
};
