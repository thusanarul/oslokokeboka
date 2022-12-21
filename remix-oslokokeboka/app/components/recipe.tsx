import { InputType } from "@prisma/client";
import { t } from "i18next";
import { TFunction } from "react-i18next";

export type Recipe = Record<
  string,
  {
    index: string;
    name: string;
    inputType: InputType;
    inputValue: string;
  }
>;

// easier than copying everything into each section every time
type RecipeSectionTypes = {
  recipe: Recipe;
  t: TFunction<("preview" | "common")[]>;
};

export const Recipe = ({
  recipe,
  t,
}: {
  recipe: Recipe;
  t: TFunction<("preview" | "common")[]>;
}) => {
  return (
    <>
      <InfoBox recipe={recipe} t={t} />
      <AuthorSays recipe={recipe} t={t} />
      <Ingredients recipe={recipe} t={t} />
      <HowTo recipe={recipe} t={t} />
      <Pictures recipe={recipe} t={t} />
      <AdditionalInfo recipe={recipe} t={t} />
    </>
  );
};

const AdditionalInfo = ({ recipe, t }: RecipeSectionTypes) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">{t("additional-info")}</p>
      </span>
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">{recipe["additional-notes"].inputValue}</p>
      </span>
    </div>
  );
};

const Pictures = ({ recipe, t }: RecipeSectionTypes) => {
  // Need to implement in form first anyways
  return null;
};

const HowTo = ({ recipe, t }: RecipeSectionTypes) => {
  const parsed = recipe["how-to"].inputValue.split("\n");

  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">{t("do-the-following")}</p>
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

const Ingredients = ({ recipe, t }: RecipeSectionTypes) => {
  // ingredients are saved in a textarea with newline split.
  // should have maybe been transformed before inserting into db?
  const ingredients = recipe["ingredients"].inputValue.split("\n");

  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">{t("to-make-this")}</p>
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

const AuthorSays = ({ recipe, t }: RecipeSectionTypes) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">
          {recipe["name"].inputValue} {t("says")}
        </p>
      </span>
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[17px]">{recipe["the-story"].inputValue}</p>
      </span>
    </div>
  );
};

const InfoBox = ({ recipe, t }: RecipeSectionTypes) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <h1 className="text-paper">{recipe["name-of-dish"].inputValue}</h1>
      </span>
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <h2 className="text-paper text-[17px]">{recipe["name"].inputValue}</h2>
      </span>
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <p className="text-salmon text-[17px]">
          {recipe["neighbourhood"].inputValue}
        </p>
      </span>
      <dl className="flex gap justify-between bg-purple py-[20px] pl-[20px] pr-[40px]">
        <span>
          <dt className="text-salmon text-[12px]">{t("type")}</dt>
          <dl className="text-paper text-[17px]">
            {recipe["what-kind-of-dish"].inputValue}
          </dl>
        </span>
        <span>
          <dt className="text-salmon text-[12px]">{t("serves")}</dt>
          <dl className="text-paper text-[17px]">
            {recipe["how-many-servings"].inputValue}
          </dl>
        </span>
      </dl>
    </div>
  );
};
