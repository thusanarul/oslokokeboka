import { SubmissionState } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
  const { t } = useTranslation("recipes");

  const { processed } = useLoaderData<{ processed: Submissions }>();

  return (
    <div className="w-[85%] md:body-width flex flex-col mx-auto gap-[40px]">
      <header className="flex flex-col gap-2">
        <h1 className="fuzzy text-paper">{t("header")}</h1>
        <p className="text-center">{t("ingress")}</p>
      </header>
      <section id="recipes" className="self-center">
        <MasonrySubmissions submissions={processed} />
      </section>
      {/* TODO: Create share this and submit your recipe buttons here */}
    </div>
  );
}
