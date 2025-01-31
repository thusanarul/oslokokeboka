import { Prisma, SubmissionState } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Recipe } from "~/components/recipe";
import { db } from "~/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "id is required to fetch recipe");

  const recipeFields = await db.recipeField.findMany({
    where: {
      recipeSubmissionId: params.id,
      RecipeSubmission: {
        OR: [
          { state: SubmissionState.COMPLETED },
          { state: SubmissionState.PROCESSED },
          { state: SubmissionState.SOFT_DELETE },
        ],
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

const submissionActionMap: Record<string, SubmissionState> = {
  accept: SubmissionState.PROCESSED,
  soft_delete: SubmissionState.SOFT_DELETE,
};

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.id, "id is required to fetch recipe");

  const formId = params.id;
  const formData = await request.formData();

  formData.forEach(async (val, key, _) => {
    if (key != "submission_action") {
      return;
    }

    if (Object.keys(submissionActionMap).includes(val.toString())) {
      await db.recipeSubmission.update<Prisma.RecipeSubmissionUpdateArgs>({
        where: {
          id: formId,
        },
        data: {
          state: submissionActionMap[val.toString()],
        },
      });
    }
  });

  return redirect("/_admin");
};

export let handle = {
  i18n: "preview",
};

export default function InternalRecipeSubmission() {
  const recipe: Recipe = useLoaderData();

  return (
    <div className="w-full h-screen">
      <section
        id="recipe"
        className="flex flex-col w-[90%] max-w-[540px] mx-auto gap-[10px]"
      >
        <Recipe recipe={recipe} />
        <Form className="w-full flex justify-between" method="post">
          <button
            type="submit"
            name="submission_action"
            value="soft_delete"
            className="p-[16px] w-fit inverted-red-button"
          >
            Delete
          </button>
          <button
            type="submit"
            name="submission_action"
            value="accept"
            className="w-fit orange-button"
          >
            Accept
          </button>
        </Form>
      </section>
    </div>
  );
}
