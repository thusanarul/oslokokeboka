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
      type: "dropdown",
      placeholder: { en: "Select amount", no: "Velg mengde" },
      choices: [
        { value: 1, text: "1" },
        { value: 2, text: "2" },
        { value: 3, text: "3" },
        { value: 4, text: "4" },
        { value: 5, text: "5" },
        { value: 6, text: "6" },
        { value: 7, text: "7" },
        { value: 8, text: "8" },
        { value: 9, text: "9" },
        { value: "10+", text: "10+" },
      ],
    },
  },
  {
    index: "07",
    name: "what-kind-of-dish",
    title: { en: "What kind of dish is this?", no: "Hva slags rett er dette?" },
    input: {
      type: "dropdown",
      placeholder: { en: "Select type of dish", no: "Velg type rett" },
      choices: [{ value: "hm", text: "This would be a category" }],
    },
  },
];

export default form_2;
