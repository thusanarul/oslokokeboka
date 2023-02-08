import { SubmissionState } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { Recipe } from "~/components/recipe";
import { db } from "~/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "id is required to fetch recipe");

  const recipeFields = await db.recipeField.findMany({
    where: {
      recipeSubmissionId: params.id,
      RecipeSubmission: {
        state: SubmissionState.PROCESSED,
      },
    },
    select: {
      index: true,
      name: true,
      inputType: true,
      inputValue: true,
    },
    orderBy: {
      index: "asc",
    },
  });

  const recipe: Recipe = recipeFields.reduce((obj, item) => {
    return {
      ...obj,
      [item.name]: item,
    };
  }, {});

  return json(recipe);
};

export const meta: MetaFunction = ({ data }: { data: Recipe }) => {
  const recipe = data;

  const name = recipe["name-of-dish"].inputValue;

  return {
    title: `${name} | Oslo Kokeboka`,
    "og:title": `${name} | Oslo Kokeboka`,
  };
};

export default function RecipeSubmission() {
  const { t } = useTranslation();
  const recipe: Recipe = useLoaderData();
  const [showShare, setShowShare] = useState(true);

  return (
    <div className="w-full flex flex-col">
      <section
        id="recipe-submission"
        className="py-[100px] md:py-[40px] w-[90%] max-w-[540px] mx-auto"
      >
        <Recipe recipe={recipe} />
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
          {showShare ? t("share-this") : t("link-copied")}
        </button>

        <Link className="w-fit fuzzy orange-button" to={"/create-recipe/0"}>
          {t("submit-your-recipe")}
        </Link>
      </div>
      <Link
        className="w-fit fuzzy blue-button self-center mt-3"
        to={"/recipes"}
      >
        {t("explore-recipes")}
      </Link>
    </div>
  );
}
