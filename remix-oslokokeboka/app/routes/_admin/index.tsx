import { RecipeSubmission, SubmissionState } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type SubmissionStats = {
  total: number;
  started: number;
  completed: number;
  processed: number;
};

export const loader: LoaderFunction = async ({}) => {
  const submissionGroups = await db.recipeSubmission.groupBy({
    by: ["state"],
    _count: true,
  });

  const stats: SubmissionStats = {
    total: submissionGroups.reduce(
      (prevValue, group) => prevValue + group._count,
      0
    ),
    started:
      submissionGroups.find((v) => v.state === SubmissionState.STARTED)
        ?._count ?? 0,
    completed:
      submissionGroups.find((v) => v.state === SubmissionState.COMPLETED)
        ?._count ?? 0,
    processed:
      submissionGroups.find((v) => v.state === SubmissionState.PROCESSED)
        ?._count ?? 0,
  };

  console.log(stats);
  const recipeSubmissions = await db.recipeSubmission.findMany({
    where: {
      state: SubmissionState.COMPLETED,
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
