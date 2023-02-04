import { InputType } from "@prisma/client";
import { TFunction, useTranslation } from "react-i18next";
import { i18nKey } from "~/routes/create-recipe/$step";
import { boroughMap, dishCategoryMap } from "~/maps";

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
  t?: TFunction<("preview" | "common")[]>;
  lang?: i18nKey;
};

export let handle = {
  i18n: "preview",
};

export const Recipe = ({ recipe }: { recipe: Recipe }) => {
  const { t, i18n } = useTranslation(["preview", "common"]);
  const lang = i18n.language as i18nKey;

  return (
    <div className="flex flex-col gap-[10px]">
      <InfoBox recipe={recipe} t={t} lang={lang} />
      <AuthorSays recipe={recipe} t={t} />
      <Ingredients recipe={recipe} t={t} />
      <HowTo recipe={recipe} t={t} />
      <Pictures recipe={recipe} t={t} />
      <AdditionalInfo recipe={recipe} t={t} />
    </div>
  );
};

const AdditionalInfo = ({ recipe, t }: RecipeSectionTypes) => {
  const text = recipe["additional-notes"].inputValue;

  if (!t || text === "") {
    return null;
  }

  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">{t("additional-info")}</p>
      </span>
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[17px] text-paper">{text}</p>
      </span>
    </div>
  );
};

const Pictures = ({ recipe, t }: RecipeSectionTypes) => {
  // Need to implement in form first anyways
  return null;
};

const HowTo = ({ recipe, t }: RecipeSectionTypes) => {
  if (!t) {
    return null;
  }

  const parsed = recipe["how-to"].inputValue.split("\n");

  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">{t("do-the-following")}</p>
      </span>
      <span className="bg-darkwine py-[20px] pl-[20px] pr-[40px]">
        {parsed.map((value, index) => {
          return (
            <p key={`how_to-${index}`} className="text-[17px] text-paper">
              {value === "" ? <br /> : value}
            </p>
          );
        })}
      </span>
    </div>
  );
};

const Ingredients = ({ recipe, t }: RecipeSectionTypes) => {
  if (!t) {
    return null;
  }
  // ingredients are saved in a textarea with newline split.
  // should have maybe been transformed before inserting into db?
  let ingredients = recipe["ingredients"].inputValue.split("\n");

  const lastIngredient = ingredients.reduce(
    (prev, currentValue, currentIndex) =>
      currentValue !== "" ? (prev = currentIndex) : prev,
    0
  );

  if (ingredients.length - 1 > lastIngredient) {
    ingredients = ingredients.slice(0, lastIngredient + 1);
  }

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
  if (!t) {
    return null;
  }

  const parsed = recipe["the-story"].inputValue.split("\n");

  return (
    <div className="flex flex-col gap-[2px]">
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        <p className="text-[15px]">
          {recipe["name"].inputValue} {t("says")}
        </p>
      </span>
      <span className="bg-purple py-[20px] pl-[20px] pr-[40px]">
        {parsed.map((value, index) => {
          return (
            <p key={`the-story-${index}`} className="text-[17px] text-paper">
              {value === "" ? <br /> : value}
            </p>
          );
        })}
      </span>
    </div>
  );
};

const InfoBox = ({ recipe, t, lang }: RecipeSectionTypes) => {
  if (!lang || !t) {
    return null;
  }

  const borough = boroughMap[recipe["neighbourhood"].inputValue];
  const dishType =
    dishCategoryMap[recipe["what-kind-of-dish"].inputValue][lang];

  return (
    <div className="flex flex-col gap-[2px]">
      <div className="flex flex-col bg-purple py-[20px] pl-[20px] pr-[40px] gap-2">
        <h1 className="fuzzy text-paper text-center">
          {recipe["name-of-dish"].inputValue}
        </h1>
        <span className="bg-purple flex self-center gap-3">
          <p className="text-ochre">{recipe["name"].inputValue}</p>
          <p>{borough}</p>
        </span>
      </div>
      <dl className="flex gap justify-between bg-purple py-[20px] pl-[20px] pr-[40px]">
        <span>
          <dt className="text-salmon text-[12px]">{t("type")}</dt>
          <dl className="text-paper text-[17px]">{dishType}</dl>
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
