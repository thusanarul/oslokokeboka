import { Link, useLocation } from "@remix-run/react";
import { useMemo } from "react";
import { boroughMap } from "~/maps";

type Submission = Record<string, string>;
export type Submissions = Record<string, Submission>;

const MasonrySubmissions = ({ submissions }: { submissions: Submissions }) => {
  const shuffledKeys = useMemo(
    () => Object.keys(submissions).sort(() => Math.random() - 0.5),
    [submissions]
  );

  const left = useMemo(
    () => shuffledKeys.filter((_, i) => i % 2 !== 0),
    [shuffledKeys]
  );
  const right = useMemo(
    () => shuffledKeys.filter((_, i) => i % 2 === 0),
    [shuffledKeys]
  );

  return (
    <>
      {/* Desktop layout is in masonry style */}
      <div className="hidden md:flex gap-2">
        <div className="flex flex-col gap-2">
          {left.map((val, i) => {
            const tabIndex = i * 2 + 2; // hardcoded according to
            return (
              <Submission
                key={"left-submission-" + i}
                id={val}
                submission={submissions[val]}
                tabIndex={tabIndex}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {right.map((val, i) => {
            const tabIndex = i * 2 + 3;
            return (
              <Submission
                key={"right-submission-" + i}
                id={val}
                submission={submissions[val]}
                tabIndex={tabIndex}
              />
            );
          })}
        </div>
      </div>
      {/* boring flat layout on mobile */}
      <div className="md:hidden flex flex-col gap-2">
        {shuffledKeys.map((val, i) => {
          return (
            <Submission
              key={"flat-submission-" + i}
              id={val}
              submission={submissions[val]}
            />
          );
        })}
      </div>
    </>
  );
};

const Submission = ({
  id,
  submission,
  tabIndex,
}: {
  id: string;
  submission: Submission;
  tabIndex?: number | null;
}) => {
  const borough =
    submission["neighbourhood"] != ""
      ? boroughMap[submission["neighbourhood"]]
      : "No neighbourhood :(";

  const location = useLocation();

  // Both /recipes and /_admin use this component to render. the route layout is a bit different, so this check handles that.
  const linkTo =
    location.pathname === "/_admin" ? `recipe/${id}` : `/recipe/${id}`;

  return (
    <Link
      className="flex flex-col bg-darkwine min-w-min w-[280px] p-5 gap-3"
      to={linkTo}
      tabIndex={tabIndex ?? undefined}
    >
      <h2 className="fuzzy text-paper text-[22px] md:text-[29px]">
        {submission["name-of-dish"] != ""
          ? submission["name-of-dish"]
          : "No dish name :("}
      </h2>
      <span className="flex gap-2">
        <p className="text-ochre">
          {submission["name"] != "" ? submission["name"] : "No name :("}
        </p>
        <p>{borough}</p>
      </span>
    </Link>
  );
};

export default MasonrySubmissions;
