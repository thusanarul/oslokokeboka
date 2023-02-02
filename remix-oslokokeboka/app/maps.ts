import { i18nString } from "~/routes/create-recipe/$step";

export const boroughMap: Record<string, string> = {
  alna: "Alna",
  bjerke: "Bjerke",
  frogner: "Frogner",
  "gamle-oslo": "Gamle Oslo",
  grorud: "Grorud",
  grunerlokka: "Grünerløkka",
  "nordre-aker": "Nordre Aker",
  nordstrand: "Nordstrand",
  sagene: "Sagene",
  sentrum: "Sentrum",
  "st-hanshaugen": "St. Hanshaugen",
  stovner: "Stovner",
  "sondre-nordstrand": "Søndre Nordstrand",
  ullern: "Ullern",
  "vestre-aker": "Vestre Aker",
  ostensjo: "Østensjø",
};

export const dishCategoryMap: Record<string, i18nString> = {
  drink: { no: "Drikke", en: "Drink" },
  "main-course": { no: "Hovedrett", en: "Main course" },
  appetizer: { no: "Forrett", en: "Appetizer" },
  desert: { no: "Dessert", en: "Desert" },
  snacks: { no: "Snacks", en: "Snacks" },
  "side-dish": { no: "Tilbehør", en: "Side dish" },
  soup: { no: "Suppe", en: "Soup" },
  "baked-goods": { no: "Bakst", en: "Baked goods" },
  garnish: { no: "Garnityr", en: "Garnish" },
  condiments: { no: "Smakstilsetning/condiments", en: "Condiments" },
  seasoning: { no: "Krydder", en: "Seasoning" },
  sauce: { no: "Saus", en: "Sauce" },
  salat: { no: "Salat", en: "Salad" },
  other: { no: "Diverse", en: "Other" },
};
