import { SubmissionState } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { Recipe } from "~/components/recipe";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "id is required to fetch recipe");

  const recipeFields = await db.recipeField.findMany({
    where: {
      recipeSubmissionId: params.id,
      RecipeSubmission: {
        state: SubmissionState.COMPLETED,
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

export default function InternalRecipeSubmission() {
  const recipe: Recipe = useLoaderData();

  const { t } = useTranslation();

  return (
    <div className="w-full h-screen">
      <section
        id="recipe"
        className="flex flex-col w-[90%] max-w-[540px] mx-auto gap-[10px]"
      >
        <Recipe recipe={recipe} t={t} />
      </section>
      <div></div>
    </div>
  );
}
