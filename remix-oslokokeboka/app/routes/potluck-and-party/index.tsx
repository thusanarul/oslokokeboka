import { MetaFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";

export let handle = {
  i18n: "potluck-and-party",
};

export const meta: MetaFunction = () => ({
  robots: "noindex",
});

const spotifyLink =
  "https://open.spotify.com/playlist/5qPZ9PTa0Ym8YKLrZsHKS5?si=eb7dc070670845b7";

export default function PotluckAndParty() {
  const { t } = useTranslation("potluck-and-party");

  return (
    <div className="flex flex-col gap-8 bg-darkwine p-[20px] md:p-[44px] w-[85%] body-width mx-auto">
      <header className="items-center flex flex-col gap-4">
        <h1 className="fuzzy text-ochre text-[28px] md:text-[33px]">
          {t("small-title")}
        </h1>
        <h1 className="fuzzy text-ochre">{t("title")}</h1>
        <img
          src="images/food/ok-mango-min.png"
          className="w-[140px] self-center"
        ></img>
      </header>
      <section id="slurp" className="flex flex-col gap-4">
        <h2 className="fuzzy text-ochre text-[28px] md:text-[33px]">Slurp</h2>
        <p className="text-paper">{t("slurp")}</p>
      </section>
      <section id="crunch" className="flex flex-col gap-4">
        <h2 className="fuzzy text-ochre text-[28px] md:text-[33px]">Crunch</h2>
        <p className="text-paper">{t("crunch-ingress")}</p>
        <ul className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6].map((val) => {
            if (val == 6) {
            }

            return (
              <li className="text-paper flex gap-2">
                <span className="text-paper">{val}.</span>

                {val == 6 ? (
                  <a target="_blank" href={spotifyLink} className="underline">
                    {t(`crunch-${val}`)}
                  </a>
                ) : (
                  t(`crunch-${val}`)
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <section id="gulp" className="flex flex-col gap-4">
        <h2 className="fuzzy text-ochre text-[28px] md:text-[33px]">Gulp</h2>
        <p className="text-paper">{t("gulp")}</p>
      </section>
      <section id="smack" className="flex flex-col gap-4 w-full">
        <h2 className="fuzzy text-ochre text-[28px] md:text-[33px]">Smack</h2>
        <p className="text-paper">
          Chr. Krohgs Gate 2, Grønland, Oslo
          <br /> {t("smack")}
        </p>
        <p className="text-paper">{t("call")}</p>
        <img src="images/studio-min.png" className="w-[500px] self-center" />
      </section>
    </div>
  );
}
