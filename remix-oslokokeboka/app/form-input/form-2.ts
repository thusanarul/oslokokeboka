import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_2: RecipeFormField[] = [
  {
    index: "06",
    name: "how-many-servings",
    title: {
      en: "How many servings does this recipe make?",
      no: "Hvor mange porsjoner gir denne oppskriften?",
    },
    input: {
      type: "number",
      placeholder: { en: "Enter amount...", no: "Skriv inn porsjoner..." },
    },
  },
  {
    index: "07",
    name: "what-kind-of-dish",
    title: { en: "What kind of dish is this?", no: "Hva slags rett er dette?" },
    input: {
      type: "dropdown",
      placeholder: { en: "Select type of dish", no: "Velg type rett" },
      choices: [
        { value: "drink", text: { no: "Drikke", en: "Drink" } },
        { value: "main-course", text: { no: "Hovedrett", en: "Main course" } },
        { value: "appetizer", text: { no: "Forrett", en: "Appetizer" } },
        { value: "desert", text: { no: "Dessert", en: "Desert" } },
        { value: "snacks", text: { no: "Snacks", en: "Snacks" } },
        { value: "side-dish", text: { no: "Tilbehør", en: "Side dish" } },
        { value: "soup", text: { no: "Suppe", en: "Soup" } },
        { value: "baked-goods", text: { no: "Bakst", en: "Baked goods" } },
        { value: "garnish", text: { no: "Garnityr", en: "Garnish" } },
        {
          value: "condiments",
          text: { no: "Smakstilsetning/condiments", en: "Condiments" },
        },
        { value: "seasoning", text: { no: "Krydder", en: "Seasoning" } },
        { value: "sauce", text: { no: "Saus", en: "Sauce" } },
        { value: "salat", text: { no: "Salat", en: "Salad" } },
        { value: "other", text: { no: "Diverse", en: "Other" } },
      ],
    },
  },
];

export default form_2;
