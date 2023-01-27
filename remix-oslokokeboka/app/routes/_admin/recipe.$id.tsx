import { Prisma, SubmissionState } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { Recipe } from "~/components/recipe";
import { db } from "~/utils/db.server";
import { i18nKey } from "../create-recipe/$step";

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

export default function InternalRecipeSubmission() {
  const recipe: Recipe = useLoaderData();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as i18nKey;

  return (
    <div className="w-full h-screen">
      <section
        id="recipe"
        className="flex flex-col w-[90%] max-w-[540px] mx-auto gap-[10px]"
      >
        <Recipe recipe={recipe} t={t} lang={lang} />
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
      <div></div>
    </div>
  );
}
