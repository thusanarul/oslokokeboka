import { RecipeSubmission } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({}) => {
  const recipeSubmissions = await db.recipeSubmission.findMany({
    where: {
      completed: true,
    },
  });

  console.log(recipeSubmissions);

  return json(recipeSubmissions);
};

export default function Admin() {
  const data = useLoaderData<RecipeSubmission[]>();
  console.log(data);

  return (
    <div className="text-white">
      hei
      <div></div>
    </div>
  );
}
