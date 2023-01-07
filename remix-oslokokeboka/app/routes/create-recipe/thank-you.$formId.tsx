import { SubmissionState } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { ContactUs } from "~/components/contact-us";
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
    <div className="w-full h-screen">
      <section
        id="thank-you"
        className="flex flex-col w-[90%] max-w-[540px] gap-[24px] mx-auto pt-[100px]"
      >
        <h1 className="text-salmon">
          {recipeInfo.name} {t("headerText")}
        </h1>
        <p>{t("infoText")}</p>
        <ContactUs />
        <button className="mt-[30px] p-[16px] w-fit orange-button-slim ">
          {t("view-recipes")}
        </button>
      </section>
    </div>
  );
}
