import { useTranslation } from "react-i18next";

export let handle = {
  i18n: "potluck-and-party",
};

export default function PotluckAndParty() {
  const { t } = useTranslation("potluck-and-party");

  return (
    <div className="flex flex-col w-full md:w-[85%] md:max-w-[750px] md:mx-auto justify-center align-middle gap-8">
      <header>
        <h1 className="french-title text-ochre">{t("title")}</h1>
      </header>
      <section id="slurp" className="[&>*]:text-ochre flex flex-col gap-4">
        <h2>Slurp</h2>
        <p>{t("slurp")}</p>
      </section>
      <section id="crunch" className="[&>*]:text-ochre flex flex-col gap-4">
        <h2>Crunch</h2>
        <p>{t("crunch-ingress")}</p>
      </section>
      <section id="gulp" className="[&>*]:text-ochre flex flex-col gap-4">
        <h2>Gulp</h2>
        <p>{t("gulp")}</p>
      </section>
      <section
        id="smack"
        className="[&>*]:text-ochre flex flex-col gap-4 w-full"
      >
        <h2>Smack</h2>
        <p>Chr. Krohgs Gate 2, Grønland, Oslo</p>
        <p>
          <i>{t("smack")}</i>
        </p>
        <img src="images/studio.png" className="w-[500px] self-center"></img>
      </section>
    </div>
  );
}
