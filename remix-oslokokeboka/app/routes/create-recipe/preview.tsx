import { Prisma, SubmissionState } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Recipe } from "~/components/recipe";
import { commitSession, getSession } from "~/session.server";
import { db } from "~/db.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("formId")) {
    return redirect("/create-recipe/0");
  }

  const recipeFields = await db.recipeField.findMany({
    where: {
      recipeSubmissionId: session.get("formId"),
      RecipeSubmission: {
        state: SubmissionState.STARTED,
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

export const action: ActionFunction = async ({ params, request }) => {
  /*
    Submit form and change submission state
  */

  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("formId")) {
    return null;
  }

  const formId = session.get("formId");

  await db.recipeSubmission.update<Prisma.RecipeSubmissionUpdateArgs>({
    where: {
      id: formId,
    },
    data: {
      state: SubmissionState.COMPLETED,
    },
  });

  // delete from session.
  // saved in localstorage in /thank-you route
  session.unset("formId");

  return redirect(`/create-recipe/thank-you/${formId}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export let handle = {
  i18n: "preview",
};

export const meta: MetaFunction = () => ({
  robots: "noindex",
});

export default function RecipePreview() {
  const recipe: Recipe = useLoaderData();
  const navigate = useNavigate();
  const { t } = useTranslation(["preview", "common"]);

  return (
    <div className="w-full">
      <div className="py-[100px] md:py-[40px] w-[90%] max-w-[540px] mx-auto">
        <section
          id="preview-info"
          className="px-[20px] py-[20px] border-blue border-[1px] rounded-[4px] flex justify-center"
        >
          <p className="fuzzy text-blue text-center">{t("infoText")}</p>
        </section>

        <section id="recipe" className="flex flex-col gap-[10px] mt-[32px]">
          <Recipe recipe={recipe} />
          <Form
            method="post"
            id="preview-actions"
            className="flex mt-[42px] gap-[16px] justify-center"
          >
            <Link
              className="w-fit fuzzy inverted-orange-button"
              to={"/create-recipe/3"}
            >
              {t("edit-recipe")}
            </Link>
            <button type="submit" className="fuzzy orange-button w-fit">
              {t("submit", { ns: "common" })}
            </button>
          </Form>
        </section>
      </div>
    </div>
  );
}
