import { Link } from "@remix-run/react";
import { useMemo } from "react";
import { boroughMap } from "~/maps";

export type Submissions = Record<string, Record<string, string>>;

const MasonrySubmissions = ({ submissions }: { submissions: Submissions }) => {
  const left = useMemo(
    () => Object.keys(submissions).filter((_, i) => i % 2 !== 0),
    [submissions]
  );
  const right = useMemo(
    () => Object.keys(submissions).filter((_, i) => i % 2 === 0),
    [submissions]
  );

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        {left.map((val, i) => {
          return (
            <Submission
              key={"left-submission-" + i}
              id={val}
              submissions={submissions}
            />
          );
        })}
      </div>
      <div className="flex flex-col gap-2">
        {right.map((val, i) => {
          return (
            <Submission
              key={"right-submission-" + i}
              id={val}
              submissions={submissions}
            />
          );
        })}
      </div>
    </div>
  );
};

const Submission = ({
  id,
  submissions,
}: {
  id: string;
  submissions: Submissions;
}) => {
  const borough =
    submissions[id]["neighbourhood"] != ""
      ? boroughMap[submissions[id]["neighbourhood"]]
      : "No neighbourhood :(";

  return (
    <Link
      className="flex flex-col bg-darkwine min-w-min md:w-[280px] p-5 gap-3"
      to={`recipe/${id}`}
    >
      <h2 className="fuzzy text-paper text-[22px] md:text-[29px]">
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
        <p>{borough}</p>
      </span>
    </Link>
  );
};

export default MasonrySubmissions;
