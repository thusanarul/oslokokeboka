import { SubmissionState } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MasonrySubmissions, {
  Submissions,
} from "~/components/masonry-submissions";
import { db } from "~/db.server";
import { mapToSubmissionsObject } from "~/functions";

export const loader: LoaderFunction = async () => {
  const p = await db.recipeField.findMany({
    where: {
      name: {
        in: ["name-of-dish", "name", "neighbourhood"],
      },
      RecipeSubmission: {
        state: SubmissionState.PROCESSED,
      },
    },
    select: {
      recipeSubmissionId: true,
      name: true,
      inputValue: true,
    },
  });

  const processed: Submissions = mapToSubmissionsObject(p);

  return json<{ processed: Submissions }>({
    processed,
  });
};

export let handle = {
  i18n: "recipes",
};

export default function RecipesIndex() {
  const { t } = useTranslation(["recipes", "common"]);

  const { processed } = useLoaderData<{ processed: Submissions }>();
  const [showShare, setShowShare] = useState(true);

  return (
    <div className="w-[85%] md:body-width flex flex-col mx-auto gap-[40px]">
      <header className="flex flex-col gap-2">
        <h1 className="fuzzy text-paper">{t("header")}</h1>
        <p className="text-center">{t("ingress")}</p>
      </header>
      {Object.keys(processed).length > 0 && (
        <>
          <section id="recipes" className="self-center">
            <MasonrySubmissions submissions={processed} />
          </section>
          <div className="flex w-full justify-center gap-3">
            <button
              type="button"
              className="w-fit fuzzy paper-button"
              disabled={!showShare}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowShare(false);
              }}
            >
              {showShare
                ? t("share-this", { ns: "common" })
                : t("link-copied", { ns: "common" })}
            </button>

            <Link className="w-fit fuzzy orange-button" to={"/create-recipe/0"}>
              {t("submit-your-recipe", { ns: "common" })}
            </Link>
          </div>
        </>
      )}

      {Object.keys(processed).length === 0 && (
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
      )}
    </div>
  );
}
