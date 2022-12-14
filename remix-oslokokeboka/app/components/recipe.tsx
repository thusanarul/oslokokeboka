import { InputType } from "@prisma/client";

export type Recipe = Record<
  string,
  {
    index: string;
    name: string;
    inputType: InputType;
    inputValue: string;
  }
>;

export const Recipe = ({ recipe }: { recipe: Recipe }) => {
  return (
    <>
      <InfoBox recipe={recipe} />
      <AuthorSays recipe={recipe} />
      <Ingredients recipe={recipe} />
      <HowTo recipe={recipe} />
      <Pictures recipe={recipe} />
      <AdditionalInfo recipe={recipe} />
    </>
  );
};

const AdditionalInfo = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">Additonal info</p>
      </span>
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">{recipe["additional-notes"].inputValue}</p>
      </span>
    </div>
  );
};

const Pictures = ({ recipe }: { recipe: Recipe }) => {
  // Need to implement in form first anyways
  return null;
};

const HowTo = ({ recipe }: { recipe: Recipe }) => {
  const parsed = recipe["how-to"].inputValue.split("\n");

  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">Do the following</p>
      </span>
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        {parsed.map((value, index) => {
          if (!value) {
            return;
          }
          return (
            <p key={`how_to-${index}`} className="text-[15px]">
              {value}
            </p>
          );
        })}
      </span>
    </div>
  );
};

const Ingredients = ({ recipe }: { recipe: Recipe }) => {
  // ingredients are saved in a textarea with newline split.
  // should have maybe been transformed before inserting into db?
  const ingredients = recipe["ingredients"].inputValue.split("\n");

  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">To make this, you will need</p>
      </span>
      {ingredients.map((val, index) => {
        return (
          <span
            key={`ingredient-${index}`}
            className="bg-darkwine py-[20px] pl-[20px] pr-[40px]"
          >
            <p className="text-[17px] text-paper">{val}</p>
          </span>
        );
      })}
    </div>
  );
};

const AuthorSays = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">{recipe["who-are-you"].inputValue} says</p>
      </span>
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[17px]">{recipe["who-are-you"].inputValue}</p>
      </span>
    </div>
  );
};

const InfoBox = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <h1 className="text-paper">{recipe["name-of-dish"].inputValue}</h1>
      </span>
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <h2 className="text-paper text-[17px]">
          {recipe["who-are-you"].inputValue}
        </h2>
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
