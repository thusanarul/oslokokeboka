import { RecipeSubmission, SubmissionState } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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

  const recipeSubmissions = await db.recipeSubmission.findMany({
    where: {
      state: SubmissionState.COMPLETED,
    },
  });

  return json<{ stats: SubmissionStats; submissions: RecipeSubmission[] }>({
    stats: stats,
    submissions: recipeSubmissions,
  });
};

export default function Admin() {
  const { stats, submissions } = useLoaderData<{
    stats: SubmissionStats;
    submissions: RecipeSubmission[];
  }>();

  return (
    <div className="text-white">
      <h1>Admin stuff</h1>
      <section id="submission-stats">
        <h2>Recipes submission stats</h2>
        <div>
          <h2>Total: {stats.total}</h2>
          <h2>Started, but not completed: {stats.started}</h2>
          <h2>Completed, but not processed: {stats.completed}</h2>
          <h2>Processed: {stats.processed}</h2>
        </div>
      </section>
      <section id="submissions">
        {submissions.map((submission, index) => {
          return (
            <Link
              key={`submission-${index}`}
              className="bg-darkwine"
              to={`recipe/${submission.id}`}
            >
              <p>Recipe {index + 1}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
