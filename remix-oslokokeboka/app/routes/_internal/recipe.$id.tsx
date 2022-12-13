import { InputType } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Recipe } from "~/components/recipe";
import { db } from "~/utils/db.server";

// create recipe layout from json?

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "id is required to fetch recipe");

  const recipeFields = await db.recipeField.findMany({
    where: {
      recipeSubmissionId: params.id,
      RecipeSubmission: {
        completed: true,
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

export default function RecipeSubmission() {
  const recipe: Recipe = useLoaderData();

  return (
    <div className="w-full h-screen">
      <section
        id="recipe"
        className="flex flex-col w-[90%] max-w-[540px] bg-white mx-auto gap-[10px]"
      >
        <Recipe recipe={recipe} />
      </section>
      <div></div>
    </div>
  );
}
