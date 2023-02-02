import { SubmissionState } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { ContactUs } from "~/components/contact-us";
import { db } from "~/db.server";

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

export let handle = {
  i18n: "thank-you",
};

export default function ThankYou() {
  const recipeInfo: { id: string; name: string } = useLoaderData();
  const { t } = useTranslation("thank-you");

  // this is fine as long as we do not allow someone to edit recipes based on this.
  // very easy to just set localstorage with someoneelses recipe id and start editing.
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
    <div className="flex flex-col w-[85%] header-width gap-[24px] mx-auto pt-[100px] text-center">
      <header className="flex flex-col">
        <h1 className="fuzzy text-paper">{recipeInfo.name}</h1>
        <h1 className="fuzzy text-salmon">{t("headerText")}</h1>
      </header>
      <section
        id="thank-you"
        className="flex flex-col body-width self-center gap-[24px]"
      >
        <p>{t("infoText")}</p>
        <ContactUs />
        <Link
          to={"/recipes"}
          className="mt-[30px] orange-button fuzzy w-fit self-center"
        >
          {t("view-recipes")}
        </Link>
      </section>
    </div>
  );
}
