import { InputType } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

// create recipe layout from json?

type Recipe = Record<
  string,
  {
    index: string;
    name: string;
    inputType: InputType;
    inputValue: string;
  }
>;

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

export default function Recipe() {
  const recipe: Recipe = useLoaderData();

  console.log(recipe);

  return (
    <div className="w-full h-screen">
      <section
        id="recipe"
        className="flex flex-col w-[90%] max-w-[540px] bg-white mx-auto"
      >
        <InfoBox recipe={recipe} />
      </section>
      <div></div>
    </div>
  );
}

const InfoBox = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <h1 className="text-paper">{recipe["name-of-dish"].inputValue}</h1>
      </span>
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <p className="text-paper text-[17px]">
          {recipe["who-are-you"].inputValue}
        </p>
      </span>
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <p className="text-salmon text-[17px]">
          {recipe["who-are-you"].inputValue}
        </p>
      </span>
      <dl className="flex gap justify-between bg-purple py-[20px] pl-[20px] pr-[40px]">
        <span>
          <dt className="text-salmon text-[12px]">Type</dt>
          <dl className="text-paper text-[17px]">
            {recipe["what-kind-of-dish"].inputValue}
          </dl>
        </span>
        <span>
          <dt className="text-salmon text-[12px]">Serves</dt>
          <dl className="text-paper text-[17px]">
            {recipe["how-many-servings"].inputValue}
          </dl>
        </span>
      </dl>
    </div>
  );
};
