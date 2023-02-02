import { Submissions } from "./components/masonry-submissions";

export const getDomainByEnv = () => {
  switch (process.env.HOPS_ENV) {
    case "localhost":
      return "localhost";
    case "test":
      return "iterate.no";
    default:
      return "oslokokeboka.no";
  }
};

// Maps data from db to object with recipeSubmissionId as key for easier rendering
export const mapToSubmissionsObject = (
  s: {
    name: string;
    recipeSubmissionId: string | null;
    inputValue: string;
  }[]
): Submissions => {
  const submissions: Submissions = {};

  // Maps data from db to object with recipeSubmissionId as key for easier rendering
  s.forEach((val) => {
    if (!val.recipeSubmissionId) {
      return;
    }

    (submissions[val.recipeSubmissionId] =
      submissions[val.recipeSubmissionId] || {})[val.name] = val.inputValue;
  });

  return submissions;
};
