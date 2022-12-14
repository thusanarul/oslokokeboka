import { SubmissionState } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.formId, "formId is required");

  const recipeName = await db.recipeField.findFirst({
    where: {
      name: "name-of-dish",
      recipeSubmissionId: params.formId,
      RecipeSubmission: {
        state: SubmissionState.COMPLETED,
      },
    },
    select: {
      inputValue: true,
    },
  });

  if (!recipeName) {
    return redirect("/create-recipe/0");
  }

  return json<{ id: string; name: string }>({
    id: params.formId,
    name: recipeName.inputValue,
  });
};

export default function ThankYou() {
  const recipeInfo: { id: string; name: string } = useLoaderData();

  useEffect(() => {
    const inStorage = localStorage.getItem("submittedRecipeIds");

    let prevIds = JSON.stringify([]);

    if (inStorage) {
      prevIds = inStorage;
    }

    const parsedIds: string[] = JSON.parse(prevIds);

    if (parsedIds.includes(recipeInfo.id)) {
      // Already saved this recipe. Maybe user refreshed page or something
      return;
    }

    const newIds = [...parsedIds, recipeInfo.id];

    parsedIds.push(recipeInfo.id);

    localStorage.setItem("submittedRecipeIds", JSON.stringify(newIds));
  }, [recipeInfo.id]);

  return (
    <main className="w-full h-screen">
      <section className="flex flex-col w-[90%] max-w-[540px] gap-[24px] mx-auto pt-[100px]">
        <h1 className="text-salmon">
          {recipeInfo.name} was successfully submitted!
        </h1>
        <p>
          Thank you for your submission, it will be reviewed and posted soon.
          Please not at this time, we only appect one recipe from each resident,
          but we will inform you if this changes. Until then, feel free to
          browse some other recipes from across the city!
        </p>
        <button className="mt-[30px] p-[16px] w-fit orange-button-slim ">
          View Oslo Recipes
        </button>
      </section>
    </main>
  );
}
