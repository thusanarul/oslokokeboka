import { SubmissionState } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import MasonrySubmissions, {
  Submissions,
} from "~/components/masonry-submissions";
import { db } from "~/db.server";
import { mapToSubmissionsObject } from "~/functions";

type SubmissionStats = {
  total: number;
  started: number;
  completed: number;
  processed: number;
  deleted: number;
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
    deleted:
      submissionGroups.find((v) => v.state === SubmissionState.SOFT_DELETE)
        ?._count ?? 0,
  };

  const p = await db.recipeField.findMany({
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

  const a = await db.recipeField.findMany({
    where: {
      name: {
        in: ["name-of-dish", "name", "neighbourhood"],
      },
      RecipeSubmission: {
        OR: [
          { state: SubmissionState.PROCESSED },
          { state: SubmissionState.SOFT_DELETE },
        ],
      },
    },
    select: {
      recipeSubmissionId: true,
      name: true,
      inputValue: true,
    },
  });

  const pending: Submissions = mapToSubmissionsObject(p);
  const all: Submissions = mapToSubmissionsObject(a);

  return json<{
    stats: SubmissionStats;
    pending: Submissions;
    all: Submissions;
  }>({
    stats,
    pending,
    all,
  });
};

enum SubmissionsView {
  PendingForApproval,
  ViewAll,
}

const submissionsView = [
  {
    type: SubmissionsView.PendingForApproval,
    display: "Pending for approval",
  },
  {
    type: SubmissionsView.ViewAll,
    display: "View all",
  },
];

export default function Admin() {
  const { stats, pending, all } = useLoaderData<{
    stats: SubmissionStats;
    pending: Submissions;
    all: Submissions;
  }>();

  const [currentSubmissionView, setCurrentSubmissionsView] =
    useState<SubmissionsView>(SubmissionsView.PendingForApproval);

  return (
    <div className="text-white flex flex-col items-center gap-6 pt-6 pb-16">
      <h1 className="">Administrator</h1>
      <section id="submission-stats" className="px-2">
        <h2>Recipes submission stats</h2>
        <div>
          <h2>Total: {stats.total}</h2>
          <h2>Started, but not completed: {stats.started}</h2>
          <h2>Completed, but not processed: {stats.completed}</h2>
          <h2>Processed: {stats.processed}</h2>
          <h2>Deleted: {stats.deleted}</h2>
        </div>
      </section>

      <div className="px-2" id="submissions-switch">
        {submissionsView.map((el, i) => {
          const disabled = el.type === currentSubmissionView;
          const last = i == submissionsView.length - 1;

          return (
            <>
              <button
                className={`fuzzy ${disabled && "underline"}`}
                onClick={() => {
                  setCurrentSubmissionsView(el.type);
                }}
                disabled={disabled}
              >
                <h2 className="text-[22px] md:text-[29px] text-paper">
                  {el.display}
                </h2>
              </button>
              {!last && (
                <span className="text-paper text-[24px] md:text-[29px] mx-1">
                  |
                </span>
              )}
            </>
          );
        })}
      </div>

      <section
        data-visible={
          currentSubmissionView === SubmissionsView.PendingForApproval
        }
        id="pending-for-approval"
        className="px-2 data-[visible='false']:hidden"
      >
        <MasonrySubmissions submissions={pending} />
      </section>
      <section
        data-visible={currentSubmissionView === SubmissionsView.ViewAll}
        id="view-all"
        className="px-2 data-[visible='false']:hidden"
      >
        <MasonrySubmissions submissions={all} />
      </section>
    </div>
  );
}
