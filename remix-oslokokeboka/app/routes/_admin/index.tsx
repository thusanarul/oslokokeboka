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

type Submissions = Record<string, Record<string, string>>;

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

  const s = await db.recipeField.findMany({
    where: {
      name: {
        in: ["name-of-dish", "name", "neighbourhood"],
      },
      RecipeSubmission: {
        state: SubmissionState.COMPLETED,
      },
    },
    select: {
      recipeSubmissionId: true,
      name: true,
      inputValue: true,
    },
  });

  const submissions: Submissions = {};

  s.forEach((val) => {
    if (!val.recipeSubmissionId) {
      return;
    }

    (submissions[val.recipeSubmissionId] =
      submissions[val.recipeSubmissionId] || {})[val.name] = val.inputValue;
  });

  return json<{ stats: SubmissionStats; submissions: Submissions }>({
    stats: stats,
    submissions: submissions,
  });
};

export default function Admin() {
  const { stats, submissions } = useLoaderData<{
    stats: SubmissionStats;
    submissions: Submissions;
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
      <section id="submissions" className="flex flex-col gap-2">
        {Object.keys(submissions).map((id, index) => {
          return (
            <Link
              key={`submission-${index}`}
              className="flex flex-col bg-darkwine max-w-[320px] p-5 gap-3"
              to={`recipe/${id}`}
            >
              <h2 className="text-paper">
                {submissions[id]["name-of-dish"] != ""
                  ? submissions[id]["name-of-dish"]
                  : "No dish name :("}
              </h2>
              <span className="flex gap-2">
                <p className="text-ochre">
                  {submissions[id]["name"] != ""
                    ? submissions[id]["name"]
                    : "No name :("}
                </p>
                <p>
                  {submissions[id]["neighbourhood"] != ""
                    ? submissions[id]["neighbourhood"]
                    : "No neighbourhood :("}
                </p>
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
